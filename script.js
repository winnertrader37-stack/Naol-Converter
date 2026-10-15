"use strict";

/* =========================================================
   NAOL CONVERTER
   Image to Text + PDF Text Extraction
   Computer Text to Handwriting
   ========================================================= */

document.addEventListener("DOMContentLoaded", () => {
  const $ = (id) => document.getElementById(id);

  const state = {
    image: null,
    imageUrl: null,
    rotation: 0,
    processing: false,
    handwritingFont: "Caveat",
    currentPdfName: "",
    watermarkText: "Naol Converter"
  };

  /* =======================================================
     SAFE EVENT HELPER
     ======================================================= */

  function on(id, event, handler) {
    const element = $(id);
    if (element) {
      element.addEventListener(event, handler);
    }
  }

  function setText(id, value) {
    const element = $(id);
    if (element) element.textContent = value;
  }

  function setValue(id, value) {
    const element = $(id);
    if (element) element.value = value;
  }

  function show(id, visible = true) {
    const element = $(id);
    if (element) element.hidden = !visible;
  }

  function status(message, type = "info") {
    const output = $("exportStatus");
    if (output) {
      output.textContent = message;
      output.dataset.type = type;
    }
  }

  function ocrStatus(message) {
    setText("ocrStatusText", message);
  }

  function clamp(value, min, max) {
    return Math.min(max, Math.max(min, value));
  }

  /* =======================================================
     NAVIGATION
     ======================================================= */

  document.querySelectorAll(".nav-item[data-view]").forEach((button) => {
    button.addEventListener("click", () => {
      const viewId = button.dataset.view;

      document.querySelectorAll(".nav-item[data-view]").forEach((item) => {
        item.classList.toggle("active", item === button);
        item.setAttribute(
          "aria-selected",
          item === button ? "true" : "false"
        );
      });

      document.querySelectorAll(".tool-view").forEach((view) => {
        view.hidden = view.id !== viewId;
      });

      if (viewId === "handwritingView") {
        renderHandwriting();
      }
    });
  });

  /* =======================================================
     IMAGE UPLOAD / CAMERA
     ======================================================= */

  function releaseImageUrl() {
    if (state.imageUrl) {
      URL.revokeObjectURL(state.imageUrl);
      state.imageUrl = null;
    }
  }

  function loadImageFile(file) {
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      ocrStatus("Please select a valid image file.");
      return;
    }

    releaseImageUrl();

    state.image = file;
    state.rotation = 0;
    state.imageUrl = URL.createObjectURL(file);

    const image = $("sourceImage");

    if (!image) return;

    image.onload = () => {
      show("emptyPreview", false);
      show("imagePreview", true);
      setText("sourceStatus", file.name);
      image.style.transform = "rotate(0deg)";
      ocrStatus("Image ready. Press Extract Text.");
    };

    image.onerror = () => {
      ocrStatus("Could not open this image. Try another file.");
    };

    image.src = state.imageUrl;
  }

  function handleImageInput(event) {
    const file = event.target.files && event.target.files[0];
    loadImageFile(file);
    event.target.value = "";
  }

  on("imageInput", "change", handleImageInput);
  on("cameraInput", "change", handleImageInput);

  on("removeImage", "click", () => {
    state.image = null;
    state.rotation = 0;

    const image = $("sourceImage");
    if (image) image.removeAttribute("src");

    releaseImageUrl();

    show("imagePreview", false);
    show("emptyPreview", true);

    setText("sourceStatus", "No image selected");
    ocrStatus("Upload an image or take a photo.");
  });

  on("rotateLeft", "click", () => rotateImage(-90));
  on("rotateRight", "click", () => rotateImage(90));

  function rotateImage(degrees) {
    if (!state.image) {
      ocrStatus("Upload an image first.");
      return;
    }

    state.rotation = (state.rotation + degrees + 360) % 360;

    const image = $("sourceImage");
    if (image) {
      image.style.transform = `rotate(${state.rotation}deg)`;
    }
  }

  /* =======================================================
     IMAGE PREPARATION FOR OCR
     ======================================================= */

  function getImageScale() {
    const selector = $("imageScale");
    return selector ? Number(selector.value) || 1 : 1;
  }

  function prepareImageCanvas() {
    return new Promise((resolve, reject) => {
      const image = $("sourceImage");

      if (!image || !image.src || !image.complete) {
        reject(new Error("Please upload an image first."));
        return;
      }

      const scale = clamp(getImageScale(), 0.5, 3);

      const naturalWidth = image.naturalWidth;
      const naturalHeight = image.naturalHeight;

      if (!naturalWidth || !naturalHeight) {
        reject(new Error("The image has not loaded correctly."));
        return;
      }

      const rotated = state.rotation % 180 !== 0;

      const width = rotated ? naturalHeight : naturalWidth;
      const height = rotated ? naturalWidth : naturalHeight;

      const canvas = document.createElement("canvas");
      canvas.width = Math.round(width * scale);
      canvas.height = Math.round(height * scale);

      const context = canvas.getContext("2d");

      if (!context) {
        reject(new Error("Canvas is not supported by this browser."));
        return;
      }

      context.fillStyle = "#ffffff";
      context.fillRect(0, 0, canvas.width, canvas.height);

      context.save();
      context.translate(canvas.width / 2, canvas.height / 2);
      context.rotate((state.rotation * Math.PI) / 180);

      context.drawImage(
        image,
        (-naturalWidth * scale) / 2,
        (-naturalHeight * scale) / 2,
        naturalWidth * scale,
        naturalHeight * scale
      );

      context.restore();
      resolve(canvas);
    });
  }

  /* =======================================================
     OCR LANGUAGE SUPPORT
     ======================================================= */

  function getOcrLanguage() {
    const selector = $("ocrLanguage");
    return selector ? selector.value : "eng";
  }

  function getSupportedOcrLanguage(language) {
    /*
      Tesseract language models must actually exist.
      Do not silently send unsupported Oromo model "orm".
    */

    const supported = new Set([
      "eng",
      "amh",
      "ara",
      "fra",
      "deu",
      "spa",
      "ita",
      "por",
      "rus",
      "hin",
      "chi_sim"
    ]);

    if (language === "orm") {
      throw new Error(
        "Afaan Oromoo OCR model is not configured in this version. " +
        "Choose English or another available language. " +
        "Oromo OCR requires a compatible trained model or OCR service."
      );
    }

    if (!supported.has(language)) {
      throw new Error(
        "This language is not enabled in the current OCR version."
      );
    }

    return language;
  }

  function updateOcrProgress(progress) {
    const percent = Math.round(clamp(progress, 0, 1) * 100);

    const bar = $("ocrProgressBar");
    if (bar) {
      bar.style.width = `${percent}%`;
    }

    setText("ocrPercent", `${percent}%`);
  }

  /* =======================================================
     IMAGE TO TEXT
     ======================================================= */

  on("extractButton", "click", async () => {
    if (state.processing) return;

    if (!state.image) {
      ocrStatus("First upload an image or take a photo.");
      return;
    }

    if (!window.Tesseract) {
      ocrStatus("OCR library did not load. Check your internet.");
      return;
    }

    let language;

    try {
      language = getSupportedOcrLanguage(getOcrLanguage());
    } catch (error) {
      ocrStatus(error.message);
      return;
    }

    state.processing = true;

    const button = $("extractButton");
    if (button) {
      button.disabled = true;
      button.textContent = "Extracting...";
    }

    show("ocrProgressWrap", true);
    updateOcrProgress(0);
    ocrStatus("Preparing image...");

    try {
      const canvas = await prepareImageCanvas();

      ocrStatus("Reading text from image...");

      const result = await window.Tesseract.recognize(
        canvas,
        language,
        {
          logger: (message) => {
            if (message.status) {
              ocrStatus(message.status);
            }

            if (typeof message.progress === "number") {
              updateOcrProgress(message.progress);
            }
          }
        }
      );

      const text = result?.data?.text || "";
      const output = $("extractedText");

      if (output) {
        output.value = text.trim();
      }

      if (text.trim()) {
        ocrStatus("Text extraction completed.");
        updateOcrProgress(1);
      } else {
        ocrStatus(
          "No text detected. Try a clearer photo with better lighting."
        );
      }
    } catch (error) {
      console.error("OCR error:", error);
      ocrStatus(error.message || "Could not extract text.");
    } finally {
      state.processing = false;

      if (button) {
        button.disabled = false;
        button.textContent = "Extract Text";
      }
    }
  });

  /* =======================================================
     PDF TO TEXT
     ======================================================= */

  async function extractPdfText(file) {
    if (!window.pdfjsLib) {
      throw new Error(
        "PDF library did not load. Check your internet connection."
      );
    }

    window.pdfjsLib.GlobalWorkerOptions.workerSrc =
      "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js";

    const buffer = await file.arrayBuffer();

    const pdf = await window.pdfjsLib.getDocument({
      data: new Uint8Array(buffer)
    }).promise;

    let combinedText = "";

    for (let pageNumber = 1; pageNumber <= pdf.numPages; pageNumber++) {
      ocrStatus(`Reading PDF page ${pageNumber} of ${pdf.numPages}...`);

      const page = await pdf.getPage(pageNumber);
      const content = await page.getTextContent();

      const pageText = content.items
        .map((item) => item.str || "")
        .join(" ");

      combinedText += `\n\n--- Page ${pageNumber} ---\n${pageText}`;
    }

    return {
      text: combinedText.trim(),
      pages: pdf.numPages
    };
  }

  on("pdfInput", "change", async (event) => {
    const file = event.target.files && event.target.files[0];
    event.target.value = "";

    if (!file) return;

    if (file.type !== "application/pdf" &&
        !file.name.toLowerCase().endsWith(".pdf")) {
      ocrStatus("Please select a PDF file.");
      return;
    }

    if (state.processing) {
      ocrStatus("Please wait until the current task finishes.");
      return;
    }

    state.processing = true;

    const button = $("extractButton");
    if (button) button.disabled = true;

    show("ocrProgressWrap", true);
    updateOcrProgress(0);
    ocrStatus("Opening PDF...");

    try {
      const result = await extractPdfText(file);

      const output = $("extractedText");
      if (output) output.value = result.text;

      state.currentPdfName = file.name;

      if (result.text) {
        ocrStatus(
          `PDF text extracted from ${result.pages} page(s).`
        );
        updateOcrProgress(1);
      } else {
        ocrStatus(
          "No selectable text found. This may be a scanned PDF. " +
          "Take screenshots of its pages and use Image to Text OCR."
        );
      }
    } catch (error) {
      console.error("PDF error:", error);
      ocrStatus(error.message || "Could not read this PDF.");
    } finally {
      state.processing = false;
      if (button) button.disabled = false;
    }
  });

  /* =======================================================
     TEXT ACTIONS
     ======================================================= */

  on("copyExtracted", "click", async () => {
    const output = $("extractedText");
    if (!output || !output.value.trim()) {
      ocrStatus("There is no text to copy.");
      return;
    }

    try {
      await navigator.clipboard.writeText(output.value);
      ocrStatus("Text copied.");
    } catch {
      output.focus();
      output.select();

      try {
        document.execCommand("copy");
        ocrStatus("Text copied.");
      } catch {
        ocrStatus("Copy failed. Select the text and copy it manually.");
      }
    }
  });

  on("downloadTxt", "click", () => {
    const output = $("extractedText");
    if (!output || !output.value.trim()) {
      ocrStatus("There is no text to download.");
      return;
    }

    downloadBlob(
      new Blob([output.value], {
        type: "text/plain;charset=utf-8"
      }),
      "naol-extracted-text.txt"
    );
  });

  on("clearExtracted", "click", () => {
    setValue("extractedText", "");
    ocrStatus("Extracted text cleared.");
    updateOcrProgress(0);
  });

  on("sendToHandwriting", "click", () => {
    const source = $("extractedText");
    const target = $("handwritingText");

    if (!source || !target || !source.value.trim()) {
      ocrStatus("Extract text first.");
      return;
    }

    target.value = source.value;
    target.dispatchEvent(new Event("input", { bubbles: true }));

    const handwritingButton = document.querySelector(
      '.nav-item[data-view="handwritingView"]'
    );

    if (handwritingButton) handwritingButton.click();
    renderHandwriting();
  });

  /* =======================================================
     COMPUTER TEXT TO HANDWRITING
     ======================================================= */

  const fontMap = {
    "Caveat": "'Caveat', cursive",
    "Dancing Script": "'Dancing Script', cursive",
    "Pacifico": "'Pacifico', cursive",
    "Comic Sans": "'Comic Sans MS', cursive",
    "Serif": "Georgia, serif",
    "Cursive": "cursive"
  };

  function getSelectedFont() {
    const selector = $("handwritingFont");
    const selected = selector ? selector.value : "Caveat";

    if (fontMap[selected]) {
      return fontMap[selected];
    }

    if (selected.includes("Caveat")) {
      return "'Caveat', cursive";
    }

    if (selected.includes("Dancing")) {
      return "'Dancing Script', cursive";
    }

    if (selected.includes("Pacifico")) {
      return "'Pacifico', cursive";
    }

    return selected || "'Caveat', cursive";
  }

  function getHandwritingText() {
    const input = $("handwritingText");
    return input ? input.value : "";
  }

  function createHandwritingLines(text) {
    /*
      Preserve paragraph breaks.
      The preview naturally wraps long lines to the paper width.
    */

    const container = document.createElement("div");
    container.className = "handwriting-content";

    const paragraphs = text.split(/\r?\n/);

    paragraphs.forEach((paragraph) => {
      const p = document.createElement("p");
      p.textContent = paragraph || "\u00A0";
      container.appendChild(p);
    });

    return container;
  }

  function renderHandwriting() {
    const preview = $("paperPreview");
    if (!preview) return;

    const text = getHandwritingText();

    const output = $("handwritingOutput");
    const watermark = $("watermark");
    const dateElement = $("paperDate");

    const fontSize = $("fontSize")
      ? Number($("fontSize").value) || 30
      : 30;

    const lineSpacing = $("lineSpacing")
      ? Number($("lineSpacing").value) || 1.7
      : 1.7;

    const inkColor = $("inkColor")
      ? $("inkColor").value
      : "#173c80";

    const paperStyle = $("paperStyle")
      ? $("paperStyle").value
      : "lined";

    const paperSize = $("paperSize")
      ? $("paperSize").value
      : "a4";

    const textAlign = $("textAlign")
      ? $("textAlign").value
      : "left";

    const padding = $("pagePadding")
      ? Number($("pagePadding").value) || 36
      : 36;

    const font = getSelectedFont();

    state.handwritingFont = font;

    if (output) {
      output.replaceChildren();

      const content = createHandwritingLines(text);
      content.style.fontFamily = font;
      content.style.fontSize = `${fontSize}px`;
      content.style.lineHeight = String(lineSpacing);
      content.style.color = inkColor;
      content.style.textAlign = textAlign;

      output.appendChild(content);
    }

    preview.dataset.paper = paperStyle;
    preview.dataset.size = paperSize;
    preview.style.padding = `${padding}px`;

    const paperClasses = [
      "paper-lined",
      "paper-blank",
      "paper-grid",
      "paper-dotted"
    ];

    preview.classList.remove(...paperClasses);

    const paperClassMap = {
      lined: "paper-lined",
      blank: "paper-blank",
      grid: "paper-grid",
      dotted: "paper-dotted"
    };

    preview.classList.add(paperClassMap[paperStyle] || "paper-lined");

    const sizeMap = {
      a4: { width: "794px", minHeight: "1123px" },
      letter: { width: "816px", minHeight: "1056px" },
      a5: { width: "559px", minHeight: "794px" }
    };

    const size = sizeMap[paperSize] || sizeMap.a4;
    preview.style.width = `min(100%, ${size.width})`;
    preview.style.minHeight = size.minHeight;

    if (watermark) {
      const checkbox = $("showWatermark");
      watermark.hidden = !(checkbox && checkbox.checked);
      watermark.textContent = state.watermarkText;
    }

    if (dateElement) {
      const checkbox = $("showDate");
      dateElement.hidden = !(checkbox && checkbox.checked);
      dateElement.textContent = new Date().toLocaleDateString();
    }

    setText("fontSizeValue", `${fontSize}px`);
    setText("lineSpacingValue", lineSpacing.toFixed(1));
    setText("inkColorLabel", inkColor.toUpperCase());
    setText("pageSizeLabel", paperSize.toUpperCase());
  }

  on("handwritingText", "input", renderHandwriting);
  on("handwritingFont", "change", renderHandwriting);
  on("fontSize", "input", renderHandwriting);
  on("lineSpacing", "input", renderHandwriting);
  on("inkColor", "input", renderHandwriting);
  on("paperStyle", "change", renderHandwriting);
  on("paperSize", "change", renderHandwriting);
  on("textAlign", "change", renderHandwriting);
  on("pagePadding", "input", renderHandwriting);
  on("showWatermark", "change", renderHandwriting);
  on("showDate", "change", renderHandwriting);

  on("pasteText", "click", async () => {
    const input = $("handwritingText");
    if (!input) return;

    try {
      const text = await navigator.clipboard.readText();
      input.value += text;
      input.dispatchEvent(new Event("input", { bubbles: true }));
      renderHandwriting();
    } catch {
      status(
        "Clipboard permission denied. Paste your text into the text box.",
        "error"
      );
    }
  });

  on("clearHandwriting", "click", () => {
    setValue("handwritingText", "");
    renderHandwriting();
    status("Handwriting text cleared.");
  });

  /* =======================================================
     DOWNLOAD HELPERS
     ======================================================= */

  function downloadBlob(blob, filename) {
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");

    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    link.remove();

    setTimeout(() => URL.revokeObjectURL(url), 1500);
  }

  async function renderPaperCanvas() {
    if (!window.html2canvas) {
      throw new Error(
        "Export library did not load. Check your internet connection."
      );
    }

    const preview = $("paperPreview");

    if (!preview) {
      throw new Error("Paper preview not found.");
    }

    renderHandwriting();

    await document.fonts.ready;

    return window.html2canvas(preview, {
      scale: 2,
      useCORS: true,
      backgroundColor: "#ffffff",
      logging: false
    });
  }

  async function exportImage(format) {
    try {
      status("Preparing your handwriting page...");

      const canvas = await renderPaperCanvas();

      const mimeType = format === "jpg"
        ? "image/jpeg"
        : "image/png";

      canvas.toBlob((blob) => {
        if (!blob) {
          status("Image export failed.", "error");
          return;
        }

        downloadBlob(blob, `naol-handwriting.${format}`);
        status(`${format.toUpperCase()} exported successfully.`, "success");
      }, mimeType, 0.95);
    } catch (error) {
      console.error("Image export error:", error);
      status(error.message || "Image export failed.", "error");
    }
  }

  on("exportPng", "click", () => exportImage("png"));
  on("exportJpg", "click", () => exportImage("jpg"));

  on("exportPdf", "click", async () => {
    try {
      if (!window.jspdf || !window.jspdf.jsPDF) {
        throw new Error(
          "PDF export library did not load. Check your internet."
        );
      }

      status("Creating PDF...");

      const canvas = await renderPaperCanvas();
      const imageData = canvas.toDataURL("image/jpeg", 0.95);

      const orientation = canvas.width > canvas.height
        ? "landscape"
        : "portrait";

      const pdf = new window.jspdf.jsPDF({
        orientation,
        unit: "mm",
        format: "a4"
      });

      const pageWidth = pdf.internal.pageSize.getWidth();
      const pageHeight = pdf.internal.pageSize.getHeight();

      const ratio = Math.min(
        pageWidth / canvas.width,
        pageHeight / canvas.height
      );

      const width = canvas.width * ratio;
      const height = canvas.height * ratio;

      pdf.addImage(
        imageData,
        "JPEG",
        (pageWidth - width) / 2,
        0,
        width,
        height
      );

      pdf.save("naol-handwriting.pdf");
      status("PDF exported successfully.", "success");
    } catch (error) {
      console.error("PDF export error:", error);
      status(error.message || "PDF export failed.", "error");
    }
  });

  on("printPage", "click", () => {
    renderHandwriting();
    window.print();
  });

  /* =======================================================
     INITIAL STATE
     ======================================================= */

  show("imagePreview", false);
  show("emptyPreview", true);
  show("ocrProgressWrap", false);

  setText("sourceStatus", "No image selected");

  renderHandwriting();

  console.log("Naol Converter initialized successfully.");
});
