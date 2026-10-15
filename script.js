"use strict";

document.addEventListener("DOMContentLoaded", function () {
  const $ = (id) => document.getElementById(id);

  const state = {
    file: null,
    type: null,
    imageUrl: null,
    rotation: 0,
    pdf: null,
    busy: false
  };

  const el = {
    imageInput: $("imageInput"),
    cameraInput: $("cameraInput"),
    pdfInput: $("pdfInput"),

    sourceImage: $("sourceImage"),
    imagePreview: $("imagePreview"),
    emptyPreview: $("emptyPreview"),
    sourceStatus: $("sourceStatus"),

    extractButton: $("extractButton"),
    ocrLanguage: $("ocrLanguage"),
    imageScale: $("imageScale"),

    progressWrap: $("ocrProgressWrap"),
    progressText: $("ocrStatusText"),
    progressPercent: $("ocrPercent"),
    progressBar: $("ocrProgressBar"),

    extractedText: $("extractedText"),
    wordCount: $("wordCount"),
    characterCount: $("characterCount"),
    lineCount: $("lineCount"),

    handwritingText: $("handwritingText"),
    handwritingOutput: $("handwritingOutput"),
    handwritingWordCount: $("handwritingWordCount"),

    handwritingFont: $("handwritingFont"),
    fontSize: $("fontSize"),
    fontSizeValue: $("fontSizeValue"),
    lineSpacing: $("lineSpacing"),
    lineSpacingValue: $("lineSpacingValue"),
    fontWeight: $("fontWeight"),

    inkColor: $("inkColor"),
    inkColorLabel: $("inkColorLabel"),
    paperStyle: $("paperStyle"),
    paperSize: $("paperSize"),
    textAlign: $("textAlign"),
    pagePadding: $("pagePadding"),

    showWatermark: $("showWatermark"),
    showDate: $("showDate"),

    paperPreview: $("paperPreview"),
    watermark: $("watermark"),
    paperDate: $("paperDate"),
    pageSizeLabel: $("pageSizeLabel"),
    exportStatus: $("exportStatus")
  };

  // Check that the correct HTML is being used.
  const requiredElements = [
    "imageInput",
    "cameraInput",
    "pdfInput",
    "sourceImage",
    "extractButton",
    "extractedText",
    "handwritingText"
  ];

  const missingElements = requiredElements.filter((id) => !$(id));

  if (missingElements.length) {
    console.error(
      "Naol Converter: Missing HTML elements:",
      missingElements
    );

    alert(
      "Naol Converter error: Some HTML elements are missing. " +
      "Check that the correct index.html is uploaded."
    );

    return;
  }

  // --------------------------------------------------
  // NOTIFICATIONS
  // --------------------------------------------------

  function showMessage(message, type = "success") {
    let container = $("toastContainer");

    if (!container) {
      container = document.createElement("div");
      container.id = "toastContainer";
      container.className = "toast-container";
      document.body.appendChild(container);
    }

    const toast = document.createElement("div");
    toast.className = "toast";

    if (type === "error") {
      toast.classList.add("error");
    }

    toast.textContent = message;
    container.appendChild(toast);

    setTimeout(() => toast.remove(), 4500);
  }

  function setExportMessage(message, isError = false) {
    if (!el.exportStatus) return;

    el.exportStatus.textContent = message;
    el.exportStatus.style.color = isError
      ? "#ff7088"
      : "#42d9ed";
  }

  function setProgress(percent, message) {
    const value = Math.max(0, Math.min(100, percent));

    if (el.progressWrap) el.progressWrap.hidden = false;

    if (el.progressText) {
      el.progressText.textContent = message;
    }

    if (el.progressPercent) {
      el.progressPercent.textContent = value + "%";
    }

    if (el.progressBar) {
      el.progressBar.style.width = value + "%";
    }
  }

  // --------------------------------------------------
  // WORKSPACE NAVIGATION
  // --------------------------------------------------

  document.querySelectorAll(".nav-item[data-view]").forEach((button) => {
    button.addEventListener("click", function () {
      const target = this.dataset.view;

      document.querySelectorAll(".tool-view").forEach((view) => {
        view.classList.toggle("active", view.id === target);
      });

      document.querySelectorAll(".nav-item[data-view]").forEach((item) => {
        item.classList.toggle("active", item === button);
      });
    });
  });

  // --------------------------------------------------
  // UPLOAD BUTTONS
  // --------------------------------------------------

  /*
    Clicking the upload cards opens the correct file input.
    This also works if the HTML labels were changed accidentally.
  */

  function openFilePicker(input) {
    if (!input) {
      showMessage("Upload input not found. Check index.html.", "error");
      return;
    }

    input.click();
  }

  document.querySelectorAll('label[for="imageInput"]').forEach((card) => {
    card.addEventListener("click", function (event) {
      event.preventDefault();
      openFilePicker(el.imageInput);
    });
  });

  document.querySelectorAll('label[for="cameraInput"]').forEach((card) => {
    card.addEventListener("click", function (event) {
      event.preventDefault();
      openFilePicker(el.cameraInput);
    });
  });

  document.querySelectorAll('label[for="pdfInput"]').forEach((card) => {
    card.addEventListener("click", function (event) {
      event.preventDefault();
      openFilePicker(el.pdfInput);
    });
  });

  // Release old preview URL when loading a new image.
  function releaseImageUrl() {
    if (state.imageUrl) {
      URL.revokeObjectURL(state.imageUrl);
      state.imageUrl = null;
    }
  }

  // --------------------------------------------------
  // IMAGE PREVIEW
  // --------------------------------------------------

  function displayImage(file) {
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      showMessage("Please select a valid image.", "error");
      return;
    }

    if (file.size > 20 * 1024 * 1024) {
      showMessage(
        "Image is too large. Please select an image under 20 MB.",
        "error"
      );
      return;
    }

    releaseImageUrl();

    state.file = file;
    state.type = "image";
    state.rotation = 0;
    state.pdf = null;

    state.imageUrl = URL.createObjectURL(file);

    el.sourceImage.style.transform = "rotate(0deg)";
    el.sourceImage.hidden = false;

    if (el.emptyPreview) {
      el.emptyPreview.hidden = true;
    }

    el.sourceImage.onload = function () {
      el.sourceStatus.textContent = file.name;
      showMessage("Image uploaded successfully.");
    };

    el.sourceImage.onerror = function () {
      showMessage("Could not display this image.", "error");
      resetSource();
    };

    el.sourceImage.src = state.imageUrl;
  }

  el.imageInput.addEventListener("change", function () {
    const file = this.files && this.files[0];

    if (file) {
      displayImage(file);
    }

    this.value = "";
  });

  el.cameraInput.addEventListener("change", function () {
    const file = this.files && this.files[0];

    if (file) {
      displayImage(file);
    }

    this.value = "";
  });

  // --------------------------------------------------
  // IMAGE ROTATION
  // --------------------------------------------------

  const rotateLeftButton = $("rotateLeft");
  const rotateRightButton = $("rotateRight");

  if (rotateLeftButton) {
    rotateLeftButton.addEventListener("click", function () {
      if (state.type !== "image") {
        showMessage("Upload an image before rotating.", "error");
        return;
      }

      state.rotation = (state.rotation + 270) % 360;

      el.sourceImage.style.transform =
        "rotate(" + state.rotation + "deg)";

      showMessage("Image rotated.");
    });
  }

  if (rotateRightButton) {
    rotateRightButton.addEventListener("click", function () {
      if (state.type !== "image") {
        showMessage("Upload an image before rotating.", "error");
        return;
      }

      state.rotation = (state.rotation + 90) % 360;

      el.sourceImage.style.transform =
        "rotate(" + state.rotation + "deg)";

      showMessage("Image rotated.");
    });
  }

  // --------------------------------------------------
  // RESET SOURCE
  // --------------------------------------------------

  function resetSource() {
    releaseImageUrl();

    state.file = null;
    state.type = null;
    state.rotation = 0;
    state.pdf = null;

    el.sourceImage.removeAttribute("src");
    el.sourceImage.style.transform = "none";
    el.sourceImage.hidden = true;

    if (el.emptyPreview) {
      el.emptyPreview.hidden = false;
    }

    /*
      Do not clear imagePreview.innerHTML here.
      Clearing it removes the image and placeholder elements.
    */

    if (el.sourceStatus) {
      el.sourceStatus.textContent = "No file";
    }

    if (el.progressWrap) {
      el.progressWrap.hidden = true;
    }
  }

  const removeImageButton = $("removeImage");

  if (removeImageButton) {
    removeImageButton.addEventListener("click", function () {
      resetSource();
      showMessage("Source file removed.");
    });
  }

  // --------------------------------------------------
  // PDF UPLOAD AND PREVIEW
  // --------------------------------------------------

  async function loadPdf(file) {
    if (!file) return;

    if (
      file.type !== "application/pdf" &&
      !file.name.toLowerCase().endsWith(".pdf")
    ) {
      showMessage("Please select a PDF file.", "error");
      return;
    }

    if (file.size > 30 * 1024 * 1024) {
      showMessage("PDF is too large. Maximum size is 30 MB.", "error");
      return;
    }

    if (!window.pdfjsLib) {
      showMessage(
        "PDF library did not load. Check your internet connection and reload the page.",
        "error"
      );
      return;
    }

    try {
      el.sourceStatus.textContent = "Opening PDF...";

      const buffer = await file.arrayBuffer();

      const pdf = await window.pdfjsLib.getDocument({
        data: new Uint8Array(buffer)
      }).promise;

      state.file = file;
      state.type = "pdf";
      state.pdf = pdf;
      state.rotation = 0;

      el.sourceImage.hidden = true;

      if (el.emptyPreview) {
        el.emptyPreview.hidden = true;
      }

      /*
        Keep the original image and placeholder elements in the DOM.
        Add PDF information separately instead of replacing imagePreview.
      */

      let pdfInfo = $("pdfPreviewInfo");

      if (!pdfInfo) {
        pdfInfo = document.createElement("div");
        pdfInfo.id = "pdfPreviewInfo";
        pdfInfo.className = "empty-preview";
        el.imagePreview.appendChild(pdfInfo);
      }

      pdfInfo.replaceChildren();

      const icon = document.createElement("div");
      icon.className = "empty-preview-icon";
      icon.textContent = "▤";

      const title = document.createElement("strong");
      title.textContent = file.name;

      const description = document.createElement("span");
      description.textContent =
        pdf.numPages + " page(s) ready for text extraction.";

      pdfInfo.append(icon, title, description);
      pdfInfo.hidden = false;

      el.sourceStatus.textContent = pdf.numPages + " PDF pages";

      showMessage("PDF uploaded successfully.");
    } catch (error) {
      console.error("PDF upload error:", error);

      resetSource();

      showMessage(
        "Could not open this PDF. Try another file or reload the page.",
        "error"
      );
    }
  }

  el.pdfInput.addEventListener("change", function () {
    const file = this.files && this.files[0];

    if (file) {
      loadPdf(file);
    }

    this.value = "";
  });

  // --------------------------------------------------
  // OCR LIBRARY CHECK
  // --------------------------------------------------

  async function recognizeCanvas(canvas) {
    if (!window.Tesseract) {
      throw new Error(
        "OCR library did not load. Check your internet connection and reload."
      );
    }

    const language = el.ocrLanguage
      ? el.ocrLanguage.value
      : "eng";

    const result = await window.Tesseract.recognize(
      canvas,
      language,
      {
        logger: function (message) {
          if (typeof message.progress === "number") {
            setProgress(
              Math.round(message.progress * 100),
              message.status || "Recognizing text..."
            );
          } else if (message.status) {
            setProgress(0, message.status);
          }
        }
      }
    );

    return (result.data.text || "").trim();
  }

  function makeImageCanvas(image, scale, rotation) {
    const width = image.naturalWidth;
    const height = image.naturalHeight;

    if (!width || !height) {
      throw new Error("Image has not finished loading.");
    }

    const sideways = rotation % 180 !== 0;

    const canvas = document.createElement("canvas");

    canvas.width = Math.ceil(
      (sideways ? height : width) * scale
    );

    canvas.height = Math.ceil(
      (sideways ? width : height) * scale
    );

    const context = canvas.getContext("2d");

    if (!context) {
      throw new Error("Could not prepare the image.");
    }

    context.fillStyle = "#ffffff";
    context.fillRect(0, 0, canvas.width, canvas.height);

    context.translate(canvas.width / 2, canvas.height / 2);
    context.rotate((rotation * Math.PI) / 180);

    context.drawImage(
      image,
      (-width * scale) / 2,
      (-height * scale) / 2,
      width * scale,
      height * scale
    );

    return canvas;
  }

  async function extractImageText() {
    if (state.type !== "image" || !state.file) {
      throw new Error("Upload an image first.");
    }

    const scale = Number(el.imageScale.value) || 1;

    setProgress(0, "Preparing image...");

    const canvas = makeImageCanvas(
      el.sourceImage,
      scale,
      state.rotation
    );

    return recognizeCanvas(canvas);
  }

  // --------------------------------------------------
  // PDF TEXT EXTRACTION
  // --------------------------------------------------

  async function renderPdfPage(pageNumber, scale = 1.5) {
    const page = await state.pdf.getPage(pageNumber);

    const viewport = page.getViewport({ scale });

    const canvas = document.createElement("canvas");

    canvas.width = Math.ceil(viewport.width);
    canvas.height = Math.ceil(viewport.height);

    const context = canvas.getContext("2d");

    await page.render({
      canvasContext: context,
      viewport: viewport
    }).promise;

    return canvas;
  }

  async function extractPdfText() {
    if (!state.pdf) {
      throw new Error("Upload a PDF file first.");
    }

    const maxPages = Math.min(state.pdf.numPages, 20);
    const allPages = [];

    for (let number = 1; number <= maxPages; number++) {
      setProgress(
        Math.round(((number - 1) / maxPages) * 100),
        "Reading PDF page " + number + " of " + maxPages + "..."
      );

      const page = await state.pdf.getPage(number);
      const content = await page.getTextContent();

      const text = content.items
        .map((item) => item.str || "")
        .join(" ")
        .replace(/[ \t]+/g, " ")
        .trim();

      if (text.length > 10) {
        allPages.push(
          "--- Page " + number + " ---\n" + text
        );
      } else {
        setProgress(
          Math.round(((number - 1) / maxPages) * 100),
          "Scanning PDF page " + number + "..."
        );

        const canvas = await renderPdfPage(number, 1.5);
        const scannedText = await recognizeCanvas(canvas);

        allPages.push(
          "--- Page " + number + " ---\n" + scannedText
        );
      }
    }

    if (state.pdf.numPages > maxPages) {
      allPages.push(
        "[Only the first " + maxPages +
        " pages were processed. Split the PDF to process the remaining pages.]"
      );
    }

    setProgress(100, "PDF extraction complete.");

    return allPages.join("\n\n");
  }

  // --------------------------------------------------
  // EXTRACT BUTTON
  // --------------------------------------------------

  el.extractButton.addEventListener("click", async function () {
    if (state.busy) return;

    if (!state.file || !state.type) {
      showMessage(
        "First upload an image, take a photo, or choose a PDF.",
        "error"
      );
      return;
    }

    state.busy = true;
    el.extractButton.disabled = true;
    el.extractButton.textContent = "Processing...";

    try {
      let result = "";

      if (state.type === "image") {
        result = await extractImageText();
      } else if (state.type === "pdf") {
        result = await extractPdfText();
      }

      el.extractedText.value = result;
      updateTextStats();

      if (result.trim()) {
        showMessage("Text extraction completed successfully.");
      } else {
        showMessage(
          "No readable text found. Try a clearer image.",
          "error"
        );
      }
    } catch (error) {
      console.error("OCR error:", error);

      showMessage(
        error.message || "Text extraction failed.",
        "error"
      );

      setProgress(0, "Extraction failed.");
    } finally {
      state.busy = false;
      el.extractButton.disabled = false;
      el.extractButton.innerHTML = "<span>✦</span> Extract Text";
    }
  });

  // --------------------------------------------------
  // TEXT STATISTICS
  // --------------------------------------------------

  function updateTextStats() {
    const text = el.extractedText.value;

    const words = text.trim()
      ? text.trim().split(/\s+/).length
      : 0;

    const lines = text
      ? text.split(/\r\n|\r|\n/).length
      : 0;

    if (el.wordCount) {
      el.wordCount.textContent = words + " words";
    }

    if (el.characterCount) {
      el.characterCount.textContent =
        text.length + " characters";
    }

    if (el.lineCount) {
      el.lineCount.textContent = lines + " lines";
    }
  }

  el.extractedText.addEventListener("input", updateTextStats);

  // --------------------------------------------------
  // COPY AND DOWNLOAD
  // --------------------------------------------------

  async function copyText(text) {
    if (!text || !text.trim()) {
      showMessage("There is no text to copy.", "error");
      return;
    }

    try {
      await navigator.clipboard.writeText(text);
      showMessage("Text copied.");
    } catch (error) {
      const area = document.createElement("textarea");

      area.value = text;
      area.style.position = "fixed";
      area.style.left = "-9999px";

      document.body.appendChild(area);

      area.select();

      const success = document.execCommand("copy");

      area.remove();

      if (success) {
        showMessage("Text copied.");
      } else {
        showMessage("Copy failed. Please copy manually.", "error");
      }
    }
  }

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

  const copyButton = $("copyExtracted");

  if (copyButton) {
    copyButton.addEventListener("click", () => {
      copyText(el.extractedText.value);
    });
  }

  const downloadTxtButton = $("downloadTxt");

  if (downloadTxtButton) {
    downloadTxtButton.addEventListener("click", function () {
      const text = el.extractedText.value;

      if (!text.trim()) {
        showMessage("There is no text to download.", "error");
        return;
      }

      downloadBlob(
        new Blob([text], {
          type: "text/plain;charset=utf-8"
        }),
        "naol-extracted-text.txt"
      );

      showMessage("Text file downloaded.");
    });
  }

  const clearExtractedButton = $("clearExtracted");

  if (clearExtractedButton) {
    clearExtractedButton.addEventListener("click", function () {
      el.extractedText.value = "";
      updateTextStats();
      showMessage("Text cleared.");
    });
  }

  const sendToHandwritingButton = $("sendToHandwriting");

  if (sendToHandwritingButton) {
    sendToHandwritingButton.addEventListener("click", function () {
      if (!el.extractedText.value.trim()) {
        showMessage("Extract or enter text first.", "error");
        return;
      }

      el.handwritingText.value = el.extractedText.value;
      updateHandwritingPreview();

      document.querySelectorAll(".tool-view").forEach((view) => {
        view.classList.toggle(
          "active",
          view.id === "handwritingView"
        );
      });

      document.querySelectorAll(".nav-item[data-view]").forEach((button) => {
        button.classList.toggle(
          "active",
          button.dataset.view === "handwritingView"
        );
      });

      showMessage("Text sent to Handwriting Studio.");
    });
  }

  // --------------------------------------------------
  // HANDWRITING PREVIEW
  // --------------------------------------------------

  function updateHandwritingPreview() {
    if (!el.handwritingOutput || !el.paperPreview) return;

    const text = el.handwritingText.value;

    el.handwritingOutput.textContent =
      text || "Your handwriting preview will appear here...";

    el.handwritingOutput.style.fontFamily =
      el.handwritingFont.value;

    el.handwritingOutput.style.fontSize =
      el.fontSize.value + "px";

    el.handwritingOutput.style.lineHeight =
      el.lineSpacing.value;

    el.handwritingOutput.style.fontWeight =
      el.fontWeight.value;

    el.handwritingOutput.style.color =
      el.inkColor.value;

    el.handwritingOutput.style.textAlign =
      el.textAlign.value;

    el.handwritingOutput.style.padding =
      el.pagePadding.value;

    if (el.fontSizeValue) {
      el.fontSizeValue.textContent =
        el.fontSize.value + " px";
    }

    if (el.lineSpacingValue) {
      el.lineSpacingValue.textContent =
        el.lineSpacing.value;
    }

    if (el.inkColorLabel) {
      el.inkColorLabel.textContent =
        el.inkColor.value.toUpperCase();
    }

    if (el.handwritingWordCount) {
      const words = text.trim()
        ? text.trim().split(/\s+/).length
        : 0;

      el.handwritingWordCount.textContent =
        words + " words";
    }

    el.watermark.style.display =
      el.showWatermark.checked ? "block" : "none";

    el.paperDate.textContent = el.showDate.checked
      ? new Date().toLocaleDateString()
      : "";

    el.paperPreview.classList.remove(
      "paper-lined",
      "paper-plain",
      "paper-grid",
      "paper-margin",
      "paper-cream"
    );

    const paperClasses = {
      lined: "paper-lined",
      plain: "paper-plain",
      grid: "paper-grid",
      margin: "paper-margin",
      cream: "paper-cream"
    };

    el.paperPreview.classList.add(
      paperClasses[el.paperStyle.value] || "paper-lined"
    );

    const sizes = {
      a4: {
        width: "460px",
        height: "650px",
        label: "A4 PAGE"
      },
      letter: {
        width: "460px",
        height: "650px",
        label: "LETTER PAGE"
      },
      a5: {
        width: "360px",
        height: "510px",
        label: "A5 PAGE"
      }
    };

    const size = sizes[el.paperSize.value] || sizes.a4;

    el.paperPreview.style.width =
      "min(100%, " + size.width + ")";

    el.paperPreview.style.minHeight = size.height;

    el.pageSizeLabel.textContent = size.label;
  }

  el.handwritingText.addEventListener(
    "input",
    updateHandwritingPreview
  );

  [
    el.handwritingFont,
    el.fontSize,
    el.lineSpacing,
    el.fontWeight,
    el.inkColor,
    el.paperStyle,
    el.paperSize,
    el.textAlign,
    el.pagePadding,
    el.showWatermark,
    el.showDate
  ].forEach((input) => {
    if (!input) return;

    input.addEventListener("input", updateHandwritingPreview);
    input.addEventListener("change", updateHandwritingPreview);
  });

  const clearHandwritingButton = $("clearHandwriting");

  if (clearHandwritingButton) {
    clearHandwritingButton.addEventListener("click", function () {
      el.handwritingText.value = "";
      updateHandwritingPreview();
      showMessage("Handwriting text cleared.");
    });
  }

  const pasteTextButton = $("pasteText");

  if (pasteTextButton) {
    pasteTextButton.addEventListener("click", async function () {
      try {
        const text = await navigator.clipboard.readText();

        if (!text) {
          showMessage("Clipboard is empty.", "error");
          return;
        }

        el.handwritingText.value = text;
        updateHandwritingPreview();

        showMessage("Text pasted.");
      } catch (error) {
        showMessage(
          "Clipboard access is blocked. Long-press the text box and choose Paste.",
          "error"
        );
      }
    });
  }

  // --------------------------------------------------
  // EXPORT IMAGE
  // --------------------------------------------------

  async function makePreviewCanvas() {
    if (!window.html2canvas) {
      throw new Error(
        "Image export library did not load. Check your internet connection."
      );
    }

    if (document.fonts && document.fonts.ready) {
      await document.fonts.ready;
    }

    return window.html2canvas(el.paperPreview, {
      scale: 2,
      backgroundColor: null,
      useCORS: true,
      logging: false
    });
  }

  async function exportImage(format) {
    if (!el.handwritingText.value.trim()) {
      showMessage("Enter text before exporting.", "error");
      return;
    }

    try {
      setExportMessage("Preparing image...");

      const canvas = await makePreviewCanvas();

      const mime = format === "jpg"
        ? "image/jpeg"
        : "image/png";

      canvas.toBlob(function (blob) {
        if (!blob) {
          setExportMessage("Image export failed.", true);
          showMessage("Could not create image.", "error");
          return;
        }

        downloadBlob(
          blob,
          format === "jpg"
            ? "naol-handwriting.jpg"
            : "naol-handwriting.png"
        );

        setExportMessage("Image downloaded successfully.");
        showMessage("Image downloaded.");
      }, mime, 0.95);
    } catch (error) {
      console.error(error);

      setExportMessage(
        error.message || "Export failed.",
        true
      );

      showMessage("Image export failed.", "error");
    }
  }

  const exportPngButton = $("exportPng");
  const exportJpgButton = $("exportJpg");

  if (exportPngButton) {
    exportPngButton.addEventListener("click", () => {
      exportImage("png");
    });
  }

  if (exportJpgButton) {
    exportJpgButton.addEventListener("click", () => {
      exportImage("jpg");
    });
  }

  // --------------------------------------------------
  // EXPORT PDF
  // --------------------------------------------------

  const exportPdfButton = $("exportPdf");

  if (exportPdfButton) {
    exportPdfButton.addEventListener("click", async function () {
      if (!el.handwritingText.value.trim()) {
        showMessage("Enter text before exporting.", "error");
        return;
      }

      if (!window.jspdf || !window.jspdf.jsPDF) {
        showMessage(
          "PDF export library did not load. Check your internet connection.",
          "error"
        );
        return;
      }

      try {
        setExportMessage("Preparing PDF...");

        const canvas = await makePreviewCanvas();
        const image = canvas.toDataURL("image/jpeg", 0.95);

        const formats = {
          a4: [210, 297],
          letter: [215.9, 279.4],
          a5: [148, 210]
        };

        const dimensions =
          formats[el.paperSize.value] || formats.a4;

        const { jsPDF } = window.jspdf;

        const pdf = new jsPDF({
          orientation: "portrait",
          unit: "mm",
          format: dimensions,
          compress: true
        });

        pdf.addImage(
          image,
          "JPEG",
          0,
          0,
          dimensions[0],
          dimensions[1]
        );

        pdf.save("naol-handwriting.pdf");

        setExportMessage("PDF downloaded successfully.");
        showMessage("PDF downloaded.");
      } catch (error) {
        console.error(error);

        setExportMessage(
          error.message || "PDF export failed.",
          true
        );

        showMessage("PDF export failed.", "error");
      }
    });
  }

  const printButton = $("printPage");

  if (printButton) {
    printButton.addEventListener("click", function () {
      if (!el.handwritingText.value.trim()) {
        showMessage("Enter text before printing.", "error");
        return;
      }

      window.print();
    });
  }

  // --------------------------------------------------
  // SIDEBAR QUICK TOOLS
  // --------------------------------------------------

  const quickClear = $("quickClear");

  if (quickClear) {
    quickClear.addEventListener("click", function () {
      el.extractedText.value = "";
      el.handwritingText.value = "";

      updateTextStats();
      updateHandwritingPreview();

      showMessage("Text workspace cleared.");
    });
  }

  const quickCopy = $("quickCopy");

  if (quickCopy) {
    quickCopy.addEventListener("click", function () {
      const text = el.extractedText.value.trim()
        ? el.extractedText.value
        : el.handwritingText.value;

      copyText(text);
    });
  }

  const quickDownload = $("quickDownload");

  if (quickDownload) {
    quickDownload.addEventListener("click", function () {
      if (el.handwritingText.value.trim()) {
        exportImage("png");
        return;
      }

      const text = el.extractedText.value;

      if (!text.trim()) {
        showMessage("There is no text to download.", "error");
        return;
      }

      downloadBlob(
        new Blob([text], {
          type: "text/plain;charset=utf-8"
        }),
        "naol-text.txt"
      );

      showMessage("Text downloaded.");
    });
  }

  // --------------------------------------------------
  // THEME TOGGLE
  // --------------------------------------------------

  const themeToggle = $("themeToggle");

  if (themeToggle) {
    themeToggle.addEventListener("click", function () {
      document.body.classList.toggle("light-mode");

      const lightMode =
        document.body.classList.contains("light-mode");

      themeToggle.textContent = lightMode ? "☀" : "◐";

      try {
        localStorage.setItem(
          "naol-theme",
          lightMode ? "light" : "dark"
        );
      } catch (error) {
        // Storage may be unavailable.
      }
    });

    try {
      if (localStorage.getItem("naol-theme") === "light") {
        document.body.classList.add("light-mode");
        themeToggle.textContent = "☀";
      }
    } catch (error) {
      // Storage may be unavailable.
    }
  }

  // --------------------------------------------------
  // INITIALIZATION
  // --------------------------------------------------

  if (window.pdfjsLib) {
    window.pdfjsLib.GlobalWorkerOptions.workerSrc =
      "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js";
  }

  updateTextStats();
  updateHandwritingPreview();

  console.log("Naol Converter is ready.");

  if (!window.Tesseract) {
    console.warn(
      "Tesseract OCR is not loaded yet. Check internet/CDN access if extraction fails."
    );
  }
});
