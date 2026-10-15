"use strict";

/* =========================================================
   NAOL CONVERTER
   Image/PDF to Text + Computer Text to Handwriting
   ========================================================= */

document.addEventListener("DOMContentLoaded", function () {
    initNaolConverter();
});

function initNaolConverter() {
    const $ = (id) => document.getElementById(id);

    const elements = {
        handwritingModeBtn: $("handwritingModeBtn"),
        computerModeBtn: $("computerModeBtn"),

        ocrWorkspace: $("ocrWorkspace"),
        writingWorkspace: $("writingWorkspace"),

        backFromOcrBtn: $("backFromOcrBtn"),
        backFromWritingBtn: $("backFromWritingBtn"),

        imageTabBtn: $("imageTabBtn"),
        pdfTabBtn: $("pdfTabBtn"),
        cameraTabBtn: $("cameraTabBtn"),

        imagePanel: $("imagePanel"),
        pdfPanel: $("pdfPanel"),
        cameraPanel: $("cameraPanel"),

        imageInput: $("imageInput"),
        cameraInput: $("cameraInput"),
        pdfInput: $("pdfInput"),

        imagePreviewCard: $("imagePreviewCard"),
        sourceImage: $("sourceImage"),
        imageFileName: $("imageFileName"),
        imageDimensions: $("imageDimensions"),
        removeImageBtn: $("removeImageBtn"),
        convertImageBtn: $("convertImageBtn"),
        ocrLanguage: $("ocrLanguage"),

        pdfPreviewCard: $("pdfPreviewCard"),
        pdfFileName: $("pdfFileName"),
        pdfFileSize: $("pdfFileSize"),
        pdfPageInfo: $("pdfPageInfo"),
        pdfStartPage: $("pdfStartPage"),
        pdfEndPage: $("pdfEndPage"),
        pdfLanguage: $("pdfLanguage"),
        removePdfBtn: $("removePdfBtn"),
        convertPdfBtn: $("convertPdfBtn"),

        progressContainer: $("progressContainer"),
        progressLabel: $("progressLabel"),
        progressPercent: $("progressPercent"),
        progressBar: $("progressBar"),
        progressDetails: $("progressDetails"),

        resultCard: $("resultCard"),
        outputText: $("outputText"),
        characterCount: $("characterCount"),
        copyTextBtn: $("copyTextBtn"),
        downloadTextBtn: $("downloadTextBtn"),
        sendToHandwritingBtn: $("sendToHandwritingBtn"),

        handwritingInput: $("handwritingInput"),
        handwritingFont: $("handwritingFont"),
        writingColor: $("writingColor"),
        writingSize: $("writingSize"),
        paperStyle: $("paperStyle"),
        paperPreview: $("paperPreview"),
        handwritingPreview: $("handwritingPreview"),
        downloadHandwritingBtn: $("downloadHandwritingBtn"),
        downloadHandwritingPdfBtn: $("downloadHandwritingPdfBtn"),

        globalStatus: $("globalStatus"),
        globalStatusText: $("globalStatusText"),

        goToConverterBtn: $("goToConverterBtn")
    };

    const missingElements = Object.entries(elements)
        .filter(([, element]) => !element)
        .map(([name]) => name);

    if (missingElements.length > 0) {
        console.error(
            "Naol Converter HTML elements are missing:",
            missingElements
        );

        alert(
            "Naol Converter could not start because some HTML elements " +
            "are missing. Please ensure index.html matches the new version."
        );

        return;
    }

    let selectedImageFile = null;
    let selectedPdfFile = null;
    let pdfDocument = null;
    let busy = false;
    let currentObjectUrl = null;

    /* ---------------------------------------------------------
       STATUS
       --------------------------------------------------------- */

    function setStatus(message, type = "info") {
        elements.globalStatusText.textContent = message;

        elements.globalStatus.dataset.type = type;

        console.log("[Naol Converter]", message);
    }

    function setBusy(value) {
        busy = value;

        elements.convertImageBtn.disabled = value;
        elements.convertPdfBtn.disabled = value;

        elements.convertImageBtn.textContent = value
            ? "Processing..."
            : "✦ Convert Image to Text";

        elements.convertPdfBtn.textContent = value
            ? "Processing..."
            : "✦ Extract PDF Text";
    }

    function setProgress(percent, label, details = "") {
        const safePercent = Math.max(
            0,
            Math.min(100, Math.round(percent))
        );

        elements.progressContainer.hidden = false;
        elements.progressBar.style.width = safePercent + "%";
        elements.progressPercent.textContent = safePercent + "%";
        elements.progressLabel.textContent = label;
        elements.progressDetails.textContent = details;
    }

    function hideProgress() {
        elements.progressContainer.hidden = true;
        elements.progressBar.style.width = "0%";
    }

    function showResult(text) {
        elements.outputText.value = text || "";
        elements.resultCard.hidden = false;
        updateCharacterCount();

        elements.resultCard.scrollIntoView({
            behavior: "smooth",
            block: "start"
        });
    }

    function updateCharacterCount() {
        const count = elements.outputText.value.length;

        elements.characterCount.textContent =
            count + (count === 1 ? " character" : " characters");
    }

    /* ---------------------------------------------------------
       WORKSPACE NAVIGATION
       --------------------------------------------------------- */

    function showOcrWorkspace() {
        elements.ocrWorkspace.hidden = false;
        elements.writingWorkspace.hidden = true;

        elements.ocrWorkspace.scrollIntoView({
            behavior: "smooth",
            block: "start"
        });

        setStatus(
            "Handwriting to Computer is ready. Choose an image, PDF, or camera.",
            "success"
        );
    }

    function showWritingWorkspace() {
        elements.ocrWorkspace.hidden = true;
        elements.writingWorkspace.hidden = false;

        updateHandwritingPreview();

        elements.writingWorkspace.scrollIntoView({
            behavior: "smooth",
            block: "start"
        });

        setStatus(
            "Computer to Handwriting is ready. Enter your text below.",
            "success"
        );
    }

    function showHome() {
        elements.ocrWorkspace.hidden = true;
        elements.writingWorkspace.hidden = true;

        setStatus(
            "Choose Handwriting to Computer or Computer to Handwriting."
        );

        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });
    }

    elements.handwritingModeBtn.addEventListener(
        "click",
        showOcrWorkspace
    );

    elements.computerModeBtn.addEventListener(
        "click",
        showWritingWorkspace
    );

    elements.backFromOcrBtn.addEventListener("click", showHome);
    elements.backFromWritingBtn.addEventListener("click", showHome);

    if (elements.goToConverterBtn) {
        elements.goToConverterBtn.addEventListener(
            "click",
            showOcrWorkspace
        );
    }

    /* ---------------------------------------------------------
       INPUT TABS
       --------------------------------------------------------- */

    function activateInputTab(tabName) {
        const tabs = [
            ["image", elements.imageTabBtn, elements.imagePanel],
            ["pdf", elements.pdfTabBtn, elements.pdfPanel],
            ["camera", elements.cameraTabBtn, elements.cameraPanel]
        ];

        tabs.forEach(([name, button, panel]) => {
            const active = name === tabName;

            button.classList.toggle("active", active);
            panel.hidden = !active;
        });

        setStatus(
            tabName === "image"
                ? "Choose an image from your device."
                : tabName === "pdf"
                    ? "Choose a PDF document."
                    : "Use your phone camera to take a document photo."
        );
    }

    elements.imageTabBtn.addEventListener(
        "click",
        () => activateInputTab("image")
    );

    elements.pdfTabBtn.addEventListener(
        "click",
        () => activateInputTab("pdf")
    );

    elements.cameraTabBtn.addEventListener(
        "click",
        () => activateInputTab("camera")
    );

    /* ---------------------------------------------------------
       IMAGE UPLOAD
       --------------------------------------------------------- */

    function isImageFile(file) {
        if (!file) return false;

        return (
            file.type.startsWith("image/") ||
            /\.(jpg|jpeg|png|webp|bmp|gif|tif|tiff)$/i.test(file.name)
        );
    }

    function handleImageSelection(file) {
        if (!file) return;

        if (!isImageFile(file)) {
            setStatus("Please select a valid image file.", "error");
            alert("Please select a valid image file.");
            return;
        }

        if (file.size > 25 * 1024 * 1024) {
            setStatus("The image is too large. Choose an image under 25 MB.", "error");
            alert("Please choose an image smaller than 25 MB.");
            return;
        }

        selectedImageFile = file;

        if (currentObjectUrl) {
            URL.revokeObjectURL(currentObjectUrl);
        }

        currentObjectUrl = URL.createObjectURL(file);

        elements.sourceImage.onload = function () {
            elements.imageDimensions.textContent =
                elements.sourceImage.naturalWidth +
                " × " +
                elements.sourceImage.naturalHeight +
                " px";
        };

        elements.sourceImage.onerror = function () {
            setStatus("The image could not be displayed. Try another image.", "error");
        };

        elements.sourceImage.src = currentObjectUrl;

        elements.imageFileName.textContent = file.name;

        elements.imagePreviewCard.hidden = false;
        elements.resultCard.hidden = true;

        activateInputTab("image");

        setStatus(
            "Image uploaded successfully. Now tap Convert Image to Text.",
            "success"
        );

        elements.imagePreviewCard.scrollIntoView({
            behavior: "smooth",
            block: "start"
        });
    }

    elements.imageInput.addEventListener("change", function (event) {
        const file = event.target.files && event.target.files[0];

        handleImageSelection(file);

        // Allows selecting the same file again later.
        event.target.value = "";
    });

    elements.cameraInput.addEventListener("change", function (event) {
        const file = event.target.files && event.target.files[0];

        if (file) {
            handleImageSelection(file);
        }

        event.target.value = "";
    });

    elements.removeImageBtn.addEventListener("click", function () {
        selectedImageFile = null;

        elements.imagePreviewCard.hidden = true;
        elements.sourceImage.removeAttribute("src");
        elements.imageFileName.textContent = "";
        elements.imageDimensions.textContent = "";

        setStatus("Image removed. Choose another image.");
    });

    /* ---------------------------------------------------------
       DRAG AND DROP IMAGE SUPPORT
       --------------------------------------------------------- */

    const dropZone = document.getElementById("imageDropZone");

    if (dropZone) {
        ["dragenter", "dragover"].forEach((eventName) => {
            dropZone.addEventListener(eventName, function (event) {
                event.preventDefault();
                dropZone.classList.add("dragging");
            });
        });

        ["dragleave", "drop"].forEach((eventName) => {
            dropZone.addEventListener(eventName, function (event) {
                event.preventDefault();
                dropZone.classList.remove("dragging");
            });
        });

        dropZone.addEventListener("drop", function (event) {
            const file = event.dataTransfer &&
                event.dataTransfer.files &&
                event.dataTransfer.files[0];

            if (file) {
                handleImageSelection(file);
            }
        });
    }

    /* ---------------------------------------------------------
       IMAGE TO TEXT OCR
       --------------------------------------------------------- */

    async function convertImageToText() {
        if (busy) return;

        if (!selectedImageFile) {
            setStatus("First upload an image, then start conversion.", "error");
            alert("Please upload an image first.");
            return;
        }

        if (typeof Tesseract === "undefined") {
            setStatus(
                "OCR could not load. Check your internet connection and reload the website.",
                "error"
            );

            alert(
                "The OCR engine could not load. Connect to the internet, " +
                "reload the website, and try again."
            );

            return;
        }

        setBusy(true);
        setProgress(0, "Preparing image...", "Loading the OCR engine.");

        try {
            const language = elements.ocrLanguage.value || "eng";

            setProgress(
                5,
                "Starting OCR...",
                "The first conversion may take longer because the language model must load."
            );

            const result = await Tesseract.recognize(
                selectedImageFile,
                language,
                {
                    logger: function (message) {
                        if (typeof message.progress === "number") {
                            const percent = Math.round(
                                Math.max(0, Math.min(1, message.progress)) * 100
                            );

                            setProgress(
                                percent,
                                message.status || "Recognizing text...",
                                "Please keep this page open while the image is processed."
                            );
                        }
                    }
                }
            );

            const text = result &&
                result.data &&
                result.data.text
                ? result.data.text.trim()
                : "";

            if (!text) {
                showResult("");

                setStatus(
                    "No text was recognized. Try a clearer, brighter image or another OCR language.",
                    "error"
                );

                alert(
                    "No text was detected in this image. " +
                    "Try a clearer photo with readable writing."
                );

                return;
            }

            showResult(text);

            setProgress(100, "Conversion complete", "Your text is ready to edit.");

            setStatus(
                "Success! The image has been converted to editable text.",
                "success"
            );

        } catch (error) {
            console.error("Image OCR error:", error);

            setStatus(
                "Image conversion failed. Check your internet connection and try again.",
                "error"
            );

            alert(
                "Image conversion failed.\n\n" +
                (error && error.message ? error.message : "Unknown error") +
                "\n\nPlease check your internet connection and try again."
            );

        } finally {
            setBusy(false);

            window.setTimeout(hideProgress, 2500);
        }
    }

    elements.convertImageBtn.addEventListener(
        "click",
        convertImageToText
    );

    /* ---------------------------------------------------------
       PDF UPLOAD
       --------------------------------------------------------- */

    function formatFileSize(bytes) {
        if (bytes < 1024) return bytes + " B";

        if (bytes < 1024 * 1024) {
            return (bytes / 1024).toFixed(1) + " KB";
        }

        return (bytes / (1024 * 1024)).toFixed(2) + " MB";
    }

    async function handlePdfSelection(file) {
        if (!file) return;

        const isPdf =
            file.type === "application/pdf" ||
            file.name.toLowerCase().endsWith(".pdf");

        if (!isPdf) {
            setStatus("Please select a PDF document.", "error");
            alert("Please select a PDF file.");
            return;
        }

        if (file.size > 30 * 1024 * 1024) {
            setStatus("The PDF is too large. Choose a PDF under 30 MB.", "error");
            alert("Please choose a PDF smaller than 30 MB.");
            return;
        }

        if (typeof pdfjsLib === "undefined") {
            setStatus("The PDF reader failed to load. Check your internet connection.", "error");
            alert("The PDF reader failed to load. Please reload the page.");
            return;
        }

        selectedPdfFile = file;
        pdfDocument = null;

        elements.pdfPreviewCard.hidden = false;
        elements.resultCard.hidden = true;

        elements.pdfFileName.textContent = file.name;
        elements.pdfFileSize.textContent = formatFileSize(file.size);
        elements.pdfPageInfo.textContent = "Reading PDF page count...";

        setStatus("PDF uploaded. Reading document information...");

        try {
            const buffer = await file.arrayBuffer();

            pdfDocument = await pdfjsLib.getDocument({
                data: new Uint8Array(buffer)
            }).promise;

            const pages = pdfDocument.numPages;

            elements.pdfPageInfo.textContent =
                pages + (pages === 1 ? " page" : " pages") + " detected.";

            elements.pdfStartPage.max = pages;
            elements.pdfEndPage.max = pages;
            elements.pdfStartPage.value = 1;
            elements.pdfEndPage.value = pages;

            setStatus(
                "PDF loaded successfully. Select the pages and tap Extract PDF Text.",
                "success"
            );

        } catch (error) {
            console.error("PDF loading error:", error);

            pdfDocument = null;

            elements.pdfPageInfo.textContent = "Unable to read this PDF.";

            setStatus(
                "This PDF could not be opened. It may be damaged or protected.",
                "error"
            );

            alert(
                "The PDF could not be opened. Try another PDF file."
            );
        }
    }

    elements.pdfInput.addEventListener("change", function (event) {
        const file = event.target.files && event.target.files[0];

        handlePdfSelection(file);

        event.target.value = "";
    });

    elements.removePdfBtn.addEventListener("click", function () {
        selectedPdfFile = null;
        pdfDocument = null;

        elements.pdfPreviewCard.hidden = true;

        setStatus("PDF removed. Choose another document.");
    });

    /* ---------------------------------------------------------
       PDF TO TEXT
       Extract embedded text first. If a page is scanned,
       render it to a canvas and run OCR.
       --------------------------------------------------------- */

    async function convertPdfToText() {
        if (busy) return;

        if (!selectedPdfFile || !pdfDocument) {
            setStatus("Please upload a readable PDF first.", "error");
            alert("Please upload a PDF and wait for it to load.");
            return;
        }

        if (typeof Tesseract === "undefined") {
            setStatus("OCR engine unavailable. Check your internet connection.", "error");
            return;
        }

        const startPage = Number(elements.pdfStartPage.value);
        const endPage = Number(elements.pdfEndPage.value);
        const pageCount = pdfDocument.numPages;

        if (
            !Number.isInteger(startPage) ||
            !Number.isInteger(endPage) ||
            startPage < 1 ||
            endPage < startPage ||
            endPage > pageCount
        ) {
            alert("Enter a valid page range.");
            return;
        }

        if (endPage - startPage + 1 > 20) {
            alert(
                "Please process no more than 20 pages at a time. " +
                "You can process the remaining pages afterward."
            );
            return;
        }

        setBusy(true);

        const extractedPages = [];

        try {
            for (let pageNumber = startPage; pageNumber <= endPage; pageNumber++) {
                const overall = pageNumber - startPage;
                const total = endPage - startPage + 1;

                setProgress(
                    (overall / total) * 100,
                    "Reading page " + pageNumber + "...",
                    "Extracting selectable text or recognizing scanned handwriting."
                );

                const page = await pdfDocument.getPage(pageNumber);

                const textContent = await page.getTextContent();

                let pageText = textContent.items
                    .map(item => item.str || "")
                    .join(" ")
                    .trim();

                if (pageText.length < 3) {
                    const viewport = page.getViewport({ scale: 1.6 });

                    const canvas = document.createElement("canvas");
                    const context = canvas.getContext("2d");

                    canvas.width = Math.ceil(viewport.width);
                    canvas.height = Math.ceil(viewport.height);

                    await page.render({
                        canvasContext: context,
                        viewport: viewport
                    }).promise;

                    setProgress(
                        ((overall + 0.3) / total) * 100,
                        "Recognizing scanned page " + pageNumber + "...",
                        "Running OCR on the PDF page."
                    );

                    const language = elements.pdfLanguage.value || "eng";

                    const result = await Tesseract.recognize(
                        canvas,
                        language
                    );

                    pageText = result &&
                        result.data &&
                        result.data.text
                        ? result.data.text.trim()
                        : "";

                    canvas.width = 1;
                    canvas.height = 1;
                }

                extractedPages.push(
                    "----- Page " + pageNumber + " -----\n" +
                    (pageText || "[No text detected on this page.]")
                );
            }

            const combinedText = extractedPages.join("\n\n");

            showResult(combinedText);

            setProgress(100, "PDF conversion complete", "The extracted text is ready.");

            setStatus(
                "Success! The selected PDF pages have been processed.",
                "success"
            );

        } catch (error) {
            console.error("PDF conversion error:", error);

            setStatus(
                "PDF conversion failed. Try a smaller page range or another PDF.",
                "error"
            );

            alert(
                "PDF conversion failed.\n\n" +
                (error && error.message ? error.message : "Unknown error")
            );

        } finally {
            setBusy(false);

            window.setTimeout(hideProgress, 2500);
        }
    }

    elements.convertPdfBtn.addEventListener(
        "click",
        convertPdfToText
    );

    /* ---------------------------------------------------------
       RESULT ACTIONS
       --------------------------------------------------------- */

    elements.outputText.addEventListener(
        "input",
        updateCharacterCount
    );

    elements.copyTextBtn.addEventListener("click", async function () {
        const text = elements.outputText.value;

        if (!text.trim()) {
            alert("There is no text to copy yet.");
            return;
        }

        try {
            await navigator.clipboard.writeText(text);

            setStatus("Text copied to clipboard.", "success");

        } catch (error) {
            elements.outputText.focus();
            elements.outputText.select();

            const copied = document.execCommand("copy");

            setStatus(
                copied
                    ? "Text copied to clipboard."
                    : "Select the text and copy it manually.",
                copied ? "success" : "error"
            );
        }
    });

    elements.downloadTextBtn.addEventListener("click", function () {
        const text = elements.outputText.value;

        if (!text.trim()) {
            alert("There is no text to download.");
            return;
        }

        downloadBlob(
            new Blob([text], { type: "text/plain;charset=utf-8" }),
            "naol-converted-text.txt"
        );

        setStatus("Text file downloaded.", "success");
    });

    elements.sendToHandwritingBtn.addEventListener("click", function () {
        elements.handwritingInput.value = elements.outputText.value;

        showWritingWorkspace();

        updateHandwritingPreview();
    });

    /* ---------------------------------------------------------
       COMPUTER TEXT TO HANDWRITING
       --------------------------------------------------------- */

    function updateHandwritingPreview() {
        const text = elements.handwritingInput.value;

        elements.handwritingPreview.textContent =
            text || "Your handwriting preview will appear here.";

        elements.handwritingPreview.style.fontFamily =
            elements.handwritingFont.value;

        elements.handwritingPreview.style.color =
            elements.writingColor.value;

        elements.handwritingPreview.style.fontSize =
            elements.writingSize.value + "px";

        elements.paperPreview.classList.remove(
            "plain-paper",
            "lined-paper",
            "grid-paper"
        );

        const styles = {
            plain: "plain-paper",
            lined: "lined-paper",
            grid: "grid-paper"
        };

        elements.paperPreview.classList.add(
            styles[elements.paperStyle.value] || "plain-paper"
        );
    }

    elements.handwritingInput.addEventListener(
        "input",
        updateHandwritingPreview
    );

    elements.handwritingFont.addEventListener(
        "change",
        updateHandwritingPreview
    );

    elements.writingColor.addEventListener(
        "input",
        updateHandwritingPreview
    );

    elements.writingSize.addEventListener(
        "change",
        updateHandwritingPreview
    );

    elements.paperStyle.addEventListener(
        "change",
        updateHandwritingPreview
    );

    /* ---------------------------------------------------------
       DOWNLOAD HELPERS
       --------------------------------------------------------- */

    function downloadBlob(blob, filename) {
        const url = URL.createObjectURL(blob);
        const anchor = document.createElement("a");

        anchor.href = url;
        anchor.download = filename;

        document.body.appendChild(anchor);
        anchor.click();
        anchor.remove();

        window.setTimeout(() => URL.revokeObjectURL(url), 1500);
    }

    async function renderPreviewCanvas() {
        if (typeof html2canvas === "undefined") {
            throw new Error("The image export library failed to load.");
        }

        updateHandwritingPreview();

        return await html2canvas(elements.paperPreview, {
            scale: 2,
            backgroundColor: "#ffffff",
            useCORS: true
        });
    }

    elements.downloadHandwritingBtn.addEventListener(
        "click",
        async function () {
            if (!elements.handwritingInput.value.trim()) {
                alert("Please enter some text first.");
                return;
            }

            try {
                setStatus("Preparing handwriting image...");

                const canvas = await renderPreviewCanvas();

                canvas.toBlob(function (blob) {
                    if (!blob) {
                        setStatus("Could not create the image.", "error");
                        return;
                    }

                    downloadBlob(blob, "naol-handwriting.png");

                    setStatus(
                        "Handwriting image downloaded successfully.",
                        "success"
                    );
                }, "image/png");

            } catch (error) {
                console.error("PNG export error:", error);

                setStatus("Image export failed.", "error");

                alert(
                    "Could not export the image. Please reload and try again."
                );
            }
        }
    );

    elements.downloadHandwritingPdfBtn.addEventListener(
        "click",
        async function () {
            if (!elements.handwritingInput.value.trim()) {
                alert("Please enter some text first.");
                return;
            }

            try {
                if (!window.jspdf || !window.jspdf.jsPDF) {
                    throw new Error("The PDF export library failed to load.");
                }

                setStatus("Preparing handwriting PDF...");

                const canvas = await renderPreviewCanvas();
                const image = canvas.toDataURL("image/png");

                const PDF = window.jspdf.jsPDF;

                const pdf = new PDF({
                    orientation: "portrait",
                    unit: "mm",
                    format: "a4"
                });

                const width = 190;
                const height = canvas.height * width / canvas.width;

                pdf.addImage(
                    image,
                    "PNG",
                    10,
                    10,
                    width,
                    Math.min(height, 275)
                );

                pdf.save("naol-handwriting.pdf");

                setStatus(
                    "Handwriting PDF downloaded successfully.",
                    "success"
                );

            } catch (error) {
                console.error("PDF export error:", error);

                setStatus("PDF export failed.", "error");

                alert(
                    "Could not export the PDF. Please reload and try again."
                );
            }
        }
    );

    /* ---------------------------------------------------------
       STARTUP
       --------------------------------------------------------- */

    updateHandwritingPreview();

    activateInputTab("image");

    setStatus(
        "Ready. Choose a conversion mode to begin.",
        "success"
    );

    console.log("Naol Converter initialized successfully.");
}
