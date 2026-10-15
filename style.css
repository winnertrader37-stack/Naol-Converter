:root {
  --bg: #101426;
  --surface: #191f35;
  --surface-2: #202843;
  --border: rgba(255,255,255,.09);
  --text: #f5f7ff;
  --muted: #a6b0cb;
  --primary: #7966ff;
  --primary-light: #a69aff;
  --green: #39d9a2;
  --danger: #ff6c83;
  --shadow: 0 20px 60px rgba(0,0,0,.22);
}

* {
  box-sizing: border-box;
}

html {
  scroll-behavior: smooth;
  scroll-padding-top: 90px;
}

body {
  margin: 0;
  background:
    radial-gradient(
      circle at 15% 0%,
      rgba(102,78,255,.16),
      transparent 32%
    ),
    var(--bg);
  color: var(--text);
  font-family: Arial, Helvetica, sans-serif;
  line-height: 1.6;
}

body.light-theme {
  --bg: #f4f6fc;
  --surface: #ffffff;
  --surface-2: #eef1fb;
  --border: rgba(25,35,70,.12);
  --text: #18203b;
  --muted: #65708c;
  --shadow: 0 20px 60px rgba(30,40,80,.09);
}

button,
input,
select,
textarea {
  font: inherit;
}

button,
a,
label {
  -webkit-tap-highlight-color: transparent;
}

button {
  cursor: pointer;
}

a {
  color: inherit;
  text-decoration: none;
}

.hidden {
  display: none !important;
}

.topbar {
  position: sticky;
  top: 0;
  z-index: 100;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 20px;
  padding: 14px 5%;
  background: rgba(16,20,38,.91);
  backdrop-filter: blur(18px);
  border-bottom: 1px solid var(--border);
}

.light-theme .topbar {
  background: rgba(255,255,255,.92);
}

.brand {
  display: flex;
  align-items: center;
  gap: 12px;
}

.brand-logo {
  display: grid;
  place-items: center;
  width: 45px;
  height: 45px;
  border-radius: 14px;
  background: linear-gradient(135deg,#8c6bff,#5746df);
  color: white;
  font-weight: 900;
  font-size: 25px;
  box-shadow: 0 8px 25px rgba(115,90,255,.32);
}

.brand strong,
.brand small {
  display: block;
}

.brand strong {
  font-size: 16px;
}

.brand small {
  font-size: 11px;
  color: var(--muted);
}

.top-nav {
  display: flex;
  gap: 25px;
  color: var(--muted);
  font-size: 13px;
}

.top-nav a:hover {
  color: var(--primary-light);
}

.icon-button {
  width: 40px;
  height: 40px;
  border: 1px solid var(--border);
  border-radius: 12px;
  background: var(--surface);
  color: var(--text);
}

.container {
  width: min(1160px, 92%);
  margin: auto;
}

.hero {
  padding: 82px 10px 60px;
  text-align: center;
}

.hero-badge {
  display: inline-block;
  padding: 8px 15px;
  border: 1px solid rgba(166,154,255,.3);
  border-radius: 30px;
  color: var(--primary-light);
  background: rgba(121,102,255,.09);
  font-size: 11px;
  font-weight: 800;
  letter-spacing: 1px;
}

.hero h1 {
  margin: 23px 0 16px;
  font-size: clamp(36px,6vw,67px);
  line-height: 1.1;
  letter-spacing: -2px;
}

.hero h1 span {
  background: linear-gradient(100deg,#9c8bff,#57d9e8);
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
}

.hero p {
  max-width: 650px;
  margin: 0 auto;
  color: var(--muted);
  font-size: 16px;
}

.hero-actions {
  display: flex;
  justify-content: center;
  gap: 12px;
  flex-wrap: wrap;
  margin-top: 30px;
}

.primary-button,
.secondary-button {
  display: inline-flex;
  justify-content: center;
  align-items: center;
  min-height: 45px;
  padding: 12px 19px;
  border-radius: 12px;
  border: 1px solid transparent;
  font-weight: 700;
  font-size: 13px;
  transition: transform .2s, opacity .2s;
}

.primary-button {
  color: #fff;
  background: linear-gradient(135deg,#7966ff,#5546dc);
  box-shadow: 0 9px 25px rgba(104,82,255,.23);
}

.secondary-button {
  color: var(--text);
  background: var(--surface);
  border-color: var(--border);
}

.primary-button:hover,
.secondary-button:hover {
  transform: translateY(-2px);
}

.section-heading {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 20px;
  margin-bottom: 25px;
}

.section-heading h2 {
  margin: 5px 0;
  font-size: clamp(23px,4vw,32px);
  letter-spacing: -.6px;
}

.section-heading p {
  margin: 0;
  color: var(--muted);
  font-size: 13px;
}

.eyebrow {
  font-size: 10px;
  letter-spacing: 1.8px;
  color: var(--primary-light);
  font-weight: 900;
}

.online-indicator {
  white-space: nowrap;
  font-size: 11px;
  color: var(--green);
}

.online-indicator span {
  display: inline-block;
  width: 7px;
  height: 7px;
  background: var(--green);
  border-radius: 50%;
  margin-right: 5px;
}

.workspace,
.editor-section,
.features-section {
  padding: 35px;
  margin-bottom: 35px;
  border: 1px solid var(--border);
  border-radius: 24px;
  background: var(--surface);
  box-shadow: var(--shadow);
}

.upload-grid {
  display: grid;
  grid-template-columns: repeat(4,minmax(0,1fr));
  gap: 15px;
}

.upload-card {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  text-align: left;
  min-height: 180px;
  padding: 21px;
  border: 1px dashed rgba(160,150,255,.4);
  border-radius: 17px;
  background: var(--surface-2);
  color: var(--text);
  transition: border-color .2s, transform .2s;
  cursor: pointer;
}

.upload-card:hover {
  border-color: var(--primary-light);
  transform: translateY(-3px);
}

.upload-icon {
  display: grid;
  place-items: center;
  width: 43px;
  height: 43px;
  margin-bottom: 14px;
  border-radius: 13px;
  background: rgba(121,102,255,.15);
  font-size: 22px;
}

.upload-card strong {
  font-size: 14px;
}

.upload-card small {
  margin-top: 6px;
  font-size: 11px;
  color: var(--muted);
}

.upload-link {
  margin-top: auto;
  padding-top: 12px;
  color: var(--primary-light);
  font-size: 11px;
  font-weight: 800;
}

.camera-panel,
.preview-panel,
.progress-panel {
  margin-top: 22px;
  padding: 22px;
  border: 1px solid var(--border);
  border-radius: 16px;
  background: var(--surface-2);
}

.camera-header,
.preview-heading,
.progress-heading {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 15px;
}

.camera-header h3,
.preview-heading h3 {
  margin: 0;
}

.camera-panel video {
  display: block;
  width: 100%;
  max-height: 450px;
  margin-top: 18px;
  background: #05070d;
  border-radius: 13px;
}

.camera-actions,
.preview-actions {
  display: flex;
  gap: 10px;
  margin-top: 16px;
  flex-wrap: wrap;
}

.helper-text {
  color: var(--muted);
  font-size: 11px;
  overflow-wrap: anywhere;
}

.preview-heading p {
  margin: 5px 0 0;
  font-size: 12px;
  color: var(--muted);
  overflow-wrap: anywhere;
}

.text-button {
  border: none;
  background: transparent;
  color: var(--danger);
  font-size: 12px;
  font-weight: 700;
}

#sourceImage {
  display: block;
  width: 100%;
  max-height: 450px;
  object-fit: contain;
  margin-top: 18px;
  border-radius: 12px;
  background: #080a12;
}

.pdf-info {
  padding: 15px;
  margin-top: 15px;
  border-radius: 10px;
  background: var(--surface);
  font-size: 12px;
}

.progress-heading {
  font-size: 12px;
  margin-bottom: 10px;
}

.progress-track {
  width: 100%;
  height: 8px;
  overflow: hidden;
  border-radius: 20px;
  background: rgba(130,130,160,.2);
}

#progressBar {
  width: 0%;
  height: 100%;
  border-radius: inherit;
  background: linear-gradient(90deg,#7966ff,#52d9e8);
  transition: width .2s;
}

.message-box {
  margin-top: 16px;
  padding: 14px 16px;
  border-radius: 12px;
  font-size: 12px;
  overflow-wrap: anywhere;
}

.error-box {
  background: rgba(255,108,131,.1);
  color: var(--danger);
  border: 1px solid rgba(255,108,131,.2);
}

.success-box {
  background: rgba(57,217,162,.1);
  color: var(--green);
  border: 1px solid rgba(57,217,162,.2);
}

.editor-layout {
  display: grid;
  grid-template-columns: minmax(0,.95fr) minmax(0,1.05fr);
  align-items: start;
  gap: 24px;
}

.editor-controls {
  display: grid;
  gap: 16px;
}

.control-card {
  padding: 21px;
  border: 1px solid var(--border);
  border-radius: 17px;
  background: var(--surface-2);
}

.control-card h3 {
  margin: 0 0 18px;
  font-size: 15px;
}

.field-label {
  display: block;
  margin: 14px 0 7px;
  color: var(--muted);
  font-size: 11px;
  font-weight: 700;
}

textarea,
.form-control,
.number-input {
  display: block;
  width: 100%;
  min-width: 0;
  padding: 12px;
  border: 1px solid var(--border);
  border-radius: 10px;
  outline: none;
  background: var(--surface);
  color: var(--text);
  font-size: 12px;
}

textarea {
  min-height: 180px;
  resize: vertical;
  line-height: 1.7;
}

textarea:focus,
.form-control:focus,
.number-input:focus {
  border-color: var(--primary-light);
}

input[type="range"] {
  display: block;
  width: 100%;
  accent-color: var(--primary);
}

input[type="color"] {
  display: block;
  width: 100%;
  height: 43px;
  padding: 4px;
  border: 1px solid var(--border);
  border-radius: 10px;
  background: var(--surface);
  cursor: pointer;
}

.two-columns {
  display: grid;
  grid-template-columns: repeat(2,minmax(0,1fr));
  gap: 15px;
}

.value-label {
  color: var(--muted);
  font-size: 10px;
}

.editor-buttons {
  display: flex;
  gap: 9px;
  margin-top: 12px;
  flex-wrap: wrap;
}

.toggle-grid {
  display: grid;
  grid-template-columns: repeat(2,minmax(0,1fr));
  gap: 9px;
  margin-top: 15px;
}

.toggle-option {
  display: flex;
  align-items: center;
  gap: 8px;
  min-height: 38px;
  padding: 9px;
  border: 1px solid var(--border);
  border-radius: 9px;
  color: var(--muted);
  font-size: 11px;
  cursor: pointer;
}

.toggle-option input {
  accent-color: var(--primary);
}

.preview-column {
  position: sticky;
  top: 90px;
  min-width: 0;
}

.preview-toolbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 15px;
}

.preview-toolbar h3 {
  margin: 3px 0 0;
}

.live-badge {
  color: var(--green);
  font-size: 10px;
  font-weight: 800;
}

.design-canvas {
  position: relative;
  display: flex;
  flex-direction: column;
  min-height: 470px;
  padding: 18px;
  overflow: hidden;
  border: 1px solid var(--border);
  border-radius: 15px;
  background: #e9edf6;
}

.paper-preview {
  position: relative;
  flex: 1;
  min-height: 410px;
  padding: 35px 25px 60px;
  overflow-wrap: anywhere;
  background: #fff;
  color: #172554;
  border-radius: 5px;
  box-shadow: 0 6px 20px rgba(0,0,0,.1);
}

.paper-preview.paper-lined {
  background-image:
    repeating-linear-gradient(
      to bottom,
      transparent 0,
      transparent 31px,
      #cdd9f2 32px
    );
}

.paper-preview.paper-grid {
  background-image:
    linear-gradient(#dce3f1 1px,transparent 1px),
    linear-gradient(90deg,#dce3f1 1px,transparent 1px);
  background-size: 25px 25px;
}

.paper-preview.paper-dots {
  background-image: radial-gradient(#c5cfe2 1px,transparent 1px);
  background-size: 18px 18px;
}

.rendered-text {
  min-height: 300px;
  white-space: pre-wrap;
  overflow-wrap: anywhere;
  font-family: cursive;
  font-size: 28px;
  line-height: 1.5;
  color: #172554;
}

.caption-preview {
  display: block;
  position: relative;
  z-index: 2;
  align-self: center;
  max-width: 100%;
  margin-bottom: 12px;
  padding: 10px 16px;
  border-radius: 12px;
  background: #5145cd;
  color: #fff;
  text-align: center;
  font-size: 20px;
  font-weight: 800;
  overflow-wrap: anywhere;
}

.caption-preview.caption-gradient {
  background: linear-gradient(110deg,#5145cd,#e54e9b);
}

.caption-preview.caption-classic {
  border-radius: 0;
  border-bottom: 3px solid #fff;
}

.caption-preview.caption-outline {
  background: transparent;
  color: #5145cd;
  border: 2px solid #5145cd;
}

.caption-preview.caption-badge {
  border-radius: 40px;
}

.caption-preview.caption-minimal {
  background: transparent;
  color: #172554;
  border-bottom: 1px solid currentColor;
  border-radius: 0;
}

.caption-top {
  order: -1;
}

.caption-middle {
  align-self: center;
  margin-top: auto;
  margin-bottom: auto;
}

.caption-bottom {
  order: 3;
  margin-top: 12px;
  margin-bottom: 0;
}

.watermark {
  position: absolute;
  right: 24px;
  bottom: 22px;
  z-index: 3;
  color: rgba(40,48,76,.6);
  font-size: 10px;
  font-weight: 900;
  letter-spacing: .5px;
  pointer-events: none;
}

.preview-notice {
  display: flex;
  gap: 10px;
  align-items: flex-start;
  margin: 12px 0 20px;
  padding: 12px;
  border: 1px solid var(--border);
  border-radius: 12px;
  background: var(--surface-2);
}

.preview-notice p {
  margin: 0;
  color: var(--muted);
  font-size: 11px;
}

.download-card {
  padding: 20px;
  border: 1px solid var(--border);
  border-radius: 15px;
  background: var(--surface-2);
}

.download-card h3 {
  margin: 0;
  font-size: 16px;
}

.download-card > p {
  color: var(--muted);
  font-size: 12px;
}

.download-button {
  display: block;
  width: 100%;
  padding: 13px;
  margin-top: 10px;
  border: 1px solid var(--border);
  border-radius: 10px;
  background: var(--surface);
  color: var(--text);
  text-align: left;
  font-size: 12px;
  font-weight: 700;
}

.download-button:hover {
  border-color: var(--primary-light);
}

.features-section {
  margin-bottom: 55px;
}

.feature-grid {
  display: grid;
  grid-template-columns: repeat(3,minmax(0,1fr));
  gap: 17px;
}

.feature-card {
  padding: 22px;
  border: 1px solid var(--border);
  border-radius: 15px;
  background: var(--surface-2);
}

.feature-card > span {
  font-size: 26px;
}

.feature-card h3 {
  margin-bottom: 7px;
  font-size: 14px;
}

.feature-card p {
  margin: 0;
  color: var(--muted);
  font-size: 12px;
}

.footer {
  padding: 35px 5%;
  text-align: center;
  border-top: 1px solid var(--border);
  background: var(--surface);
}

.footer-brand {
  font-weight: 900;
  font-size: 18px;
}

.footer p,
.footer small {
  color: var(--muted);
  font-size: 12px;
}

@media (max-width: 900px) {
  .upload-grid {
    grid-template-columns: repeat(2,minmax(0,1fr));
  }

  .editor-layout {
    grid-template-columns: 1fr;
  }

  .preview-column {
    position: static;
  }
}

@media (max-width: 600px) {
  .topbar {
    padding: 12px 4%;
  }

  .top-nav {
    display: none;
  }

  .container {
    width: 94%;
  }

  .hero {
    padding: 55px 5px 40px;
  }

  .hero h1 {
    letter-spacing: -1px;
  }

  .workspace,
  .editor-section,
  .features-section {
    padding: 17px;
    border-radius: 17px;
  }

  .upload-grid {
    gap: 10px;
  }

  .upload-card {
    min-height: 165px;
    padding: 14px;
  }

  .section-heading {
    align-items: flex-start;
  }

  .online-indicator {
    display: none;
  }

  .feature-grid {
    grid-template-columns: 1fr;
  }

  .design-canvas {
    padding: 10px;
    min-height: 400px;
  }

  .paper-preview {
    min-height: 370px;
    padding: 24px 15px 55px;
  }

  .rendered-text {
    font-size: 23px;
  }

  .two-columns {
    gap: 10px;
  }
}
