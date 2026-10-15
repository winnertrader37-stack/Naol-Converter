"use strict";

document.addEventListener("DOMContentLoaded", () => {
  const $ = (id) => document.getElementById(id);

  const state = {
    sourceFile: null,
    sourceType: null,
    sourceImageUrl: null,
    rotation: 0,
    pdfDocument: null,
    pdfPageCount: 0,
    busy: false
  };

  const elements = {
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
    ocrProgressWrap: $("ocrProgressWrap"),
    ocrStatusText: $("ocrStatusText"),
    ocrPercent: $("ocrPercent"),
    ocrProgressBar: $("ocrProgressBar"),
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

  function toast(message, type = "success") {
    const container = $("toastContainer");
    if (!container) return;

    const item = document.createElement("div");
    item.className = `toast${type === "error" ? " error" : ""}`;
    item.textContent = message;
    container.appendChild(item);

    window.setTimeout(() => {
      item.remove();
    }, 3600);
  }

  function setExportStatus(message, isError = false) {
    elements.exportStatus.textContent = message;
    elements.exportStatus.style.color = isError ? "#ff7088" : "#42d9ed";
  }

  function updateTextStats() {
    const text = elements.extractedText.value;
    const words = text.trim() ? text.trim().split(/\s+/).length : 0;
    const lines = text ? text.split(/\r\n|\r|\n/).length : 0;

    elements.wordCount.textContent = `${words} words`;
    elements.characterCount.textContent = `${text.length} characters`;
    elements.lineCount.textContent = `${lines} lines`;
  }

  function countWords(text) {
    return text.trim() ? text.trim().split(/\s+/).length : 0;
  }

  function updateHandwritingPreview() {
    const text = elements.handwritingText.value;

    elements.handwritingOutput.textContent =
      text || "Your handwriting preview will appear here...";

    elements.handwritingOutput.style.fontFamily = elements.handwritingFont.value;
    elements.handwritingOutput.style.fontSize = `${elements.fontSize.value}px`;
    elements.handwritingOutput.style.lineHeight = elements.lineSpacing.value;
    elements.handwritingOutput.style.fontWeight = elements.fontWeight.value;
    elements.handwritingOutput.style.color = elements.inkColor.value;
    elements.handwritingOutput.style.textAlign = elements.textAlign.value;
    elements.handwritingOutput.style.padding = elements.pagePadding.value;

    elements.fontSizeValue.textContent = `${elements.fontSize.value} px`;
    elements.lineSpacingValue.textContent = elements.lineSpacing.value;
    elements.inkColorLabel.textContent = elements.inkColor.value.toUpperCase();

    elements.watermark.style.display =
      elements.showWatermark.checked ? "block" : "none";

    elements.paperDate.textContent = elements.showDate.checked
      ? new Date().toLocaleDateString(undefined, {
          year: "numeric",
          month: "long",
          day: "numeric"
        })
      : "";

    elements.handwritingWordCount.textContent =
      `${countWords(text)} words`;

    const paper = elements.paperPreview;

    paper.classList.remove(
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

    paper.classList.add(paperClasses[elements.paperStyle.value] || "paper-lined");

    const sizes = {
      a4: { width: "460px", minHeight: "650px", label: "A4 PAGE" },
      letter: { width: "460px", minHeight: "650px", label: "LETTER PAGE" },
      a5: { width: "360px", minHeight: "510px", label: "A5 PAGE" }
    };

    const size = sizes[elements.paperSize.value] || sizes.a4;

    paper.style.width = `min(100%, ${size.width})`;
    paper.style.minHeight = size.minHeight;
    elements.pageSizeLabel.textContent = size.label;
  }

  function switchView(viewId) {
    document.querySelectorAll(".tool-view").forEach((view) => {
      view.classList.toggle("active", view.id === viewId);
    });

    document.querySelectorAll(".nav-item").forEach((button) => {
      button.classList.toggle("active", button.dataset.view === viewId);
    });

    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  document.querySelectorAll(".nav-item[data-view]").forEach((button) => {
    button.addEventListener("click", () => {
      switchView(button.dataset.view);
    });
  });

  // IMAGE UPLOAD

  function releaseSourceImageUrl() {
    if (state.sourceImageUrl) {
      URL.revokeObjectURL(state.sourceImageUrl);
      state.sourceImageUrl = null;
    }
  }

  function resetSourcePreview() {
    releaseSourceImageUrl();

    state.sourceFile = null;
    state.sourceType = null;
    state.rotation = 0;
    state.pdfDocument = null;
    state.pdfPageCount = 0;

    elements.sourceImage.removeAttribute("src");
    elements.sourceImage.hidden = true;
    elements.emptyPreview.hidden = false;
    elements.sourceStatus.textContent = "No file";
    elements.ocrProgressWrap.hidden = true;
  }

  function loadImageFile(file) {
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast("Please choose a valid image file.", "error");
      return;
    }

    if (file.size > 20 * 1024 * 1024) {
      toast("This image is larger than 20 MB. Please choose a smaller image.", "error");
      return;
    }

    releaseSourceImageUrl();

    state.sourceFile = file;
    state.sourceType = "image";
    state.rotation = 0;
    state.pdfDocument = null;

    state.sourceImageUrl = URL.createObjectURL(file);

    elements.sourceImage.onload = () => {
      elements.sourceImage.hidden = false;
      elements.emptyPreview.hidden = true;
      elements.sourceStatus.textContent = file.name.length > 20
        ? `${file.name.slice(0, 17)}...`
        : file.name;
    };

    elements.sourceImage.onerror = () => {
      toast("The image could not be opened. Try another file.", "error");
      resetSourcePreview();
    };

    elements.sourceImage.src = state.sourceImageUrl;
    toast("Image loaded. You can now extract the text.");
  }

  elements.imageInput.addEventListener("change", (event) => {
    loadImageFile(event.target.files[0]);
    event.target.value = "";
  });

  elements.cameraInput.addEventListener("change", (event) => {
    loadImageFile(event.target.files[0]);
    event.target.value = "";
  });

  elements.pdfInput.addEventListener("change", (event) => {
    loadPdfFile(event.target.files[0]);
    event.target.value = "";
  });

  $("rotateLeft").addEventListener("click", () => {
    if (state.sourceType !== "image") {
      toast("Upload an image before rotating it.", "error");
      return;
    }

    state.rotation = (state.rotation - 90 + 360) % 360;
    elements.sourceImage.style.transform = `rotate(${state.rotation}deg)`;
  });

  $("rotateRight").addEventListener("click", () => {
    if (state.sourceType !== "image") {
      toast("Upload an image before rotating it.", "error");
      return;
    }

    state.rotation = (state.rotation + 90) % 360;
    elements.sourceImage.style.transform = `rotate(${state.rotation}deg)`;
  });

  $("removeImage").addEventListener("click", () => {
    resetSourcePreview();
    elements.imageInput.value = "";
    elements.cameraInput.value = "";
    elements.pdfInput.value = "";
    toast("Source file removed.");
  });

  // PDF LOADING

  async function loadPdfFile(file) {
    if (!file) return;

    if (file.type !== "application/pdf" && !file.name.toLowerCase().endsWith(".pdf")) {
      toast("Please choose a PDF file.", "error");
      return;
    }

    if (file.size > 30 * 1024 * 1024) {
      toast("This PDF is larger than 30 MB. Please choose a smaller file.", "error");
      return;
    }

    if (!window.pdfjsLib) {
      toast("The PDF library has not loaded. Check your internet connection and reload.", "error");
      return;
    }

    try {
      elements.sourceStatus.textContent = "Opening PDF...";

      const buffer = await file.arrayBuffer();

      const pdf = await window.pdfjsLib.getDocument({
        data: new Uint8Array(buffer)
      }).promise;

      state.sourceFile = file;
      state.sourceType = "pdf";
      state.pdfDocument = pdf;
      state.pdfPageCount = pdf.numPages;
      state.rotation = 0;

      elements.sourceImage.hidden = true;
      elements.emptyPreview.hidden = true;
      elements.imagePreview.innerHTML = "";

      const info = document.createElement("div");
      info.className = "empty-preview";

      const icon = document.createElement("div");
      icon.className = "empty-preview-icon";
      icon.textContent = "▤";

      const title = document.createElement("strong");
      title.textContent = file.name;

      const description = document.createElement("span");
      description.textContent =
        `${pdf.numPages} page(s) ready for extraction.`;

      info.append(icon, title, description);
      elements.imagePreview.appendChild(info);

      elements.sourceStatus.textContent = `${pdf.numPages} PDF pages`;

      toast(`PDF loaded: ${pdf.numPages} page(s).`);
    } catch (error) {
      console.error(error);
      resetSourcePreview();
      toast("Could not open this PDF. Try another PDF file.", "error");
    }
  }

  async function renderPdfPageToCanvas(pageNumber, scale = 1.5) {
    if (!state.pdfDocument) {
      throw new Error("No PDF has been loaded.");
    }

    const page = await state.pdfDocument.getPage(pageNumber);
    const viewport = page.getViewport({ scale });

    const canvas = document.createElement("canvas");
    const context = canvas.getContext("2d");

    canvas.width = Math.ceil(viewport.width);
    canvas.height = Math.ceil(viewport.height);

    await page.render({
      canvasContext: context,
      viewport
    }).promise;

    return canvas;
  }

  async function extractPdfText() {
    if (!state.pdfDocument) {
      throw new Error("Please upload a PDF first.");
    }

    const pdf = state.pdfDocument;
    const maxPages = Math.min(pdf.numPages, 20);
    const output = [];

    setOcrProgress(0, "Reading PDF...");

    for (let pageNumber = 1; pageNumber <= maxPages; pageNumber++) {
      setOcrProgress(
        Math.round(((pageNumber - 1) / maxPages) * 100),
        `Reading PDF page ${pageNumber} of ${maxPages}...`
      );

      const page = await pdf.getPage(pageNumber);
      const content = await page.getTextContent();

      const pageText = content.items
        .map((item) => item.str || "")
        .join(" ")
        .replace(/[ \t]+/g, " ")
        .trim();

      if (pageText.length > 10) {
        output.push(`--- Page ${pageNumber} ---\n${pageText}`);
      } else {
        setOcrProgress(
          Math.round(((pageNumber - 1) / maxPages) * 100),
          `Scanning PDF page ${pageNumber}...`
        );

        const canvas = await renderPdfPageToCanvas(pageNumber, 1.5);
        const scannedText = await recognizeCanvas(canvas, false);

        output.push(`--- Page ${pageNumber} ---\n${scannedText}`);
      }
    }

    if (pdf.numPages > maxPages) {
      output.push(
        `\n[Only the first ${maxPages} pages were processed. Upload a smaller PDF or split the document to process the remaining pages.]`
      );
    }

    setOcrProgress(100, "PDF extraction complete.");
    return output.join("\n\n");
  }

  // OCR

  function setOcrProgress(percent, status) {
    const safePercent = Math.max(0, Math.min(100, percent));

    elements.ocrProgressWrap.hidden = false;
    elements.ocrProgressBar.style.width = `${safePercent}%`;
    elements.ocrPercent.textContent = `${safePercent}%`;
    elements.ocrStatusText.textContent = status;
  }

  function createProcessedCanvas(image, scale, rotation = 0) {
    const naturalWidth = image.naturalWidth || image.width;
    const naturalHeight = image.naturalHeight || image.height;

    const rotated = rotation % 180 !== 0;

    const canvas = document.createElement("canvas");
    canvas.width = Math.round((rotated ? naturalHeight : naturalWidth) * scale);
    canvas.height = Math.round((rotated ? naturalWidth : naturalHeight) * scale);

    const context = canvas.getContext("2d");

    context.fillStyle = "#ffffff";
    context.fillRect(0, 0, canvas.width, canvas.height);

    context.translate(canvas.width / 2, canvas.height / 2);
    context.rotate((rotation * Math.PI) / 180);

    context.drawImage(
      image,
      (-naturalWidth * scale) / 2,
      (-naturalHeight * scale) / 2,
      naturalWidth * scale,
      naturalHeight * scale
    );

    return canvas;
  }

  async function recognizeCanvas(canvas, showProgress = true) {
    if (!window.Tesseract) {
      throw new Error("The OCR library has not loaded. Check your internet connection.");
    }

    const language = elements.ocrLanguage.value || "eng";

    const result = await window.Tesseract.recognize(canvas, language, {
      logger: (message) => {
        if (!showProgress) return;

        if (typeof message.progress === "number") {
          const percent = Math.round(message.progress * 100);
          setOcrProgress(percent, message.status || "Recognizing text...");
        } else if (message.status) {
          setOcrProgress(0, message.status);
        }
      }
    });

    return (result.data.text || "").trim();
  }

  async function extractImageText() {
    if (!state.sourceFile || state.sourceType !== "image") {
      throw new Error("Please upload an image or take a photo first.");
    }

    if (!elements.sourceImage.naturalWidth) {
      throw new Error("The image is still loading. Please try again.");
    }

    const scale = Number(elements.imageScale.value) || 1;
    const canvas = createProcessedCanvas(
      elements.sourceImage,
      scale,
      state.rotation
    );

    setOcrProgress(0, "Preparing image...");

    return recognizeCanvas(canvas, true);
  }

  elements.extractButton.addEventListener("click", async () => {
    if (state.busy) return;

    if (!state.sourceFile) {
      toast("Upload an image, take a photo, or select a PDF first.", "error");
      return;
    }

    state.busy = true;
    elements.extractButton.disabled = true;
    elements.extractButton.textContent = "Processing...";

    try {
      let result = "";

      if (state.sourceType === "image") {
        result = await extractImageText();
      } else if (state.sourceType === "pdf") {
        result = await extractPdfText();
      }

      elements.extractedText.value = result;
      updateTextStats();

      if (result.trim()) {
        toast("Text extraction finished. Review your result.");
      } else {
        toast(
          "No readable text was detected. Try a clearer image or another language.",
          "error"
        );
      }
    } catch (error) {
      console.error(error);
      toast(error.message || "Text extraction failed.", "error");
      setOcrProgress(0, "Extraction failed.");
    } finally {
      state.busy = false;
      elements.extractButton.disabled = false;
      elements.extractButton.innerHTML = "<span>✦</span> Extract Text";
    }
  });

  elements.extractedText.addEventListener("input", updateTextStats);

  $("copyExtracted").addEventListener("click", async () => {
    await copyText(elements.extractedText.value);
  });

  $("downloadTxt").addEventListener("click", () => {
    const text = elements.extractedText.value;

    if (!text.trim()) {
      toast("There is no text to download.", "error");
      return;
    }

    downloadBlob(
      new Blob([text], { type: "text/plain;charset=utf-8" }),
      "naol-extracted-text.txt"
    );

    toast("Text file downloaded.");
  });

  $("clearExtracted").addEventListener("click", () => {
    elements.extractedText.value = "";
    updateTextStats();
    toast("Extracted text cleared.");
  });

  $("sendToHandwriting").addEventListener("click", () => {
    if (!elements.extractedText.value.trim()) {
      toast("Extract or enter some text first.", "error");
      return;
    }

    elements.handwritingText.value = elements.extractedText.value;
    updateHandwritingPreview();
    switchView("handwritingView");
    toast("Text sent to Handwriting Studio.");
  });

  // HANDWRITING SETTINGS

  elements.handwritingText.addEventListener("input", updateHandwritingPreview);

  [
    elements.handwritingFont,
    elements.fontSize,
    elements.lineSpacing,
    elements.fontWeight,
    elements.inkColor,
    elements.paperStyle,
    elements.paperSize,
    elements.textAlign,
    elements.pagePadding,
    elements.showWatermark,
    elements.showDate
  ].forEach((element) => {
    element.addEventListener("input", updateHandwritingPreview);
    element.addEventListener("change", updateHandwritingPreview);
  });

  $("clearHandwriting").addEventListener("click", () => {
    elements.handwritingText.value = "";
    updateHandwritingPreview();
    toast("Handwriting text cleared.");
  });

  $("pasteText").addEventListener("click", async () => {
    try {
      if (!navigator.clipboard || !navigator.clipboard.readText) {
        throw new Error("Clipboard access is unavailable.");
      }

      const text = await navigator.clipboard.readText();

      if (!text) {
        toast("Your clipboard is empty.", "error");
        return;
      }

      elements.handwritingText.value = text;
      updateHandwritingPreview();
      toast("Text pasted.");
    } catch (error) {
      toast("Paste access was blocked. Tap the text box and use your device's Paste option.", "error");
    }
  });

  // EXPORT UTILITIES

  function downloadBlob(blob, filename) {
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");

    link.href = url;
    link.download = filename;
    link.style.display = "none";

    document.body.appendChild(link);
    link.click();
    link.remove();

    window.setTimeout(() => URL.revokeObjectURL(url), 1500);
  }

  async function copyText(text) {
    if (!text.trim()) {
      toast("There is no text to copy.", "error");
      return;
    }

    try {
      await navigator.clipboard.writeText(text);
      toast("Text copied to clipboard.");
    } catch (error) {
      const temporary = document.createElement("textarea");
      temporary.value = text;
      temporary.style.position = "fixed";
      temporary.style.opacity = "0";

      document.body.appendChild(temporary);
      temporary.select();

      const success = document.execCommand("copy");
      temporary.remove();

      if (success) {
        toast("Text copied to clipboard.");
      } else {
        toast("Copy failed. Please select and copy the text manually.", "error");
      }
    }
  }

  async function waitForFonts() {
    if (document.fonts && document.fonts.ready) {
      await document.fonts.ready;
    }
  }

  async function makePreviewCanvas() {
    if (!window.html2canvas) {
      throw new Error("The export library has not loaded. Check your internet connection.");
    }

    await waitForFonts();

    const canvas = await window.html2canvas(elements.paperPreview, {
      scale: 2,
      backgroundColor: null,
      useCORS: true,
      logging: false
    });

    return canvas;
  }

  async function exportImage(format) {
    if (!elements.handwritingText.value.trim()) {
      toast("Enter some text before exporting your page.", "error");
      return;
    }

    try {
      setExportStatus("Preparing your image...");

      const canvas = await makePreviewCanvas();
      const mime = format === "jpg" ? "image/jpeg" : "image/png";
      const extension = format === "jpg" ? "jpg" : "png";

      canvas.toBlob((blob) => {
        if (!blob) {
          setExportStatus("Could not create the image.", true);
          toast("Image export failed.", "error");
          return;
        }

        downloadBlob(blob, `naol-handwriting.${extension}`);
        setExportStatus(`${extension.toUpperCase()} image exported successfully.`);
        toast(`${extension.toUpperCase()} image downloaded.`);
      }, mime, format === "jpg" ? 0.94 : undefined);
    } catch (error) {
      console.error(error);
      setExportStatus(error.message || "Image export failed.", true);
      toast("Image export failed. Please try again.", "error");
    }
  }

  async function exportPdf() {
    if (!elements.handwritingText.value.trim()) {
      toast("Enter some text before exporting your page.", "error");
      return;
    }

    if (!window.jspdf || !window.jspdf.jsPDF) {
      toast("The PDF export library has not loaded. Check your internet connection.", "error");
      return;
    }

    try {
      setExportStatus("Preparing PDF...");

      const canvas = await makePreviewCanvas();
      const imageData = canvas.toDataURL("image/jpeg", 0.95);

      const paperSize = elements.paperSize.value;
      const orientation = "portrait";

      const dimensions = {
        a4: [210, 297],
        letter: [215.9, 279.4],
        a5: [148, 210]
      };

      const [width, height] = dimensions[paperSize] || dimensions.a4;
      const { jsPDF } = window.jspdf;

      const pdf = new jsPDF({
        orientation,
        unit: "mm",
        format: [width, height],
        compress: true
      });

      pdf.addImage(imageData, "JPEG", 0, 0, width, height);
      pdf.save("naol-handwriting.pdf");

      setExportStatus("PDF exported successfully.");
      toast("PDF document downloaded.");
    } catch (error) {
      console.error(error);
      setExportStatus(error.message || "PDF export failed.", true);
      toast("PDF export failed. Please try again.", "error");
    }
  }

  $("exportPng").addEventListener("click", () => exportImage("png"));
  $("exportJpg").addEventListener("click", () => exportImage("jpg"));
  $("exportPdf").addEventListener("click", exportPdf);

  $("printPage").addEventListener("click", () => {
    if (!elements.handwritingText.value.trim()) {
      toast("Enter some text before printing.", "error");
      return;
    }

    window.print();
  });

  // SIDEBAR QUICK TOOLS

  $("quickClear").addEventListener("click", () => {
    if (elements.extractedText.value || elements.handwritingText.value) {
      elements.extractedText.value = "";
      elements.handwritingText.value = "";

      updateTextStats();
      updateHandwritingPreview();

      toast("Text workspace cleared.");
    } else {
      resetSourcePreview();
      toast("Workspace is already empty.");
    }
  });

  $("quickCopy").addEventListener("click", async () => {
    const text = elements.extractedText.value.trim()
      ? elements.extractedText.value
      : elements.handwritingText.value;

    await copyText(text);
  });

  $("quickDownload").addEventListener("click", () => {
    if (elements.handwritingText.value.trim()) {
      exportImage("png");
      return;
    }

    const text = elements.extractedText.value;

    if (!text.trim()) {
      toast("Enter or extract text before downloading.", "error");
      return;
    }

    downloadBlob(
      new Blob([text], { type: "text/plain;charset=utf-8" }),
      "naol-text.txt"
    );

    toast("Text downloaded.");
  });

  // APPEARANCE SWITCH

  $("themeToggle").addEventListener("click", () => {
    document.body.classList.toggle("light-mode");

    const lightMode = document.body.classList.contains("light-mode");
    $("themeToggle").textContent = lightMode ? "☀" : "◐";

    try {
      localStorage.setItem("naol-theme", lightMode ? "light" : "dark");
    } catch (error) {
      // Storage may be disabled in private browsing.
    }
  });

  try {
    if (localStorage.getItem("naol-theme") === "light") {
      document.body.classList.add("light-mode");
      $("themeToggle").textContent = "☀";
    }
  } catch (error) {
    // Storage may be disabled in private browsing.
  }

  // STARTUP

  updateTextStats();
  updateHandwritingPreview();

  if (window.pdfjsLib) {
    window.pdfjsLib.GlobalWorkerOptions.workerSrc =
      "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js";
  }

  window.addEventListener("beforeunload", releaseSourceImageUrl);

  console.log("Naol Converter initialized successfully.");
});
