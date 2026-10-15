/* =========================================
   NAOL CONVERTER
   Professional Responsive UI
========================================= */

:root {
  --bg: #080d1b;
  --surface: #10182a;
  --surface-2: #141e33;
  --surface-3: #1a2640;

  --text: #f3f6ff;
  --muted: #94a3bb;
  --border: rgba(255, 255, 255, 0.09);

  --primary: #8b5cf6;
  --primary-light: #a78bfa;
  --blue: #38bdf8;
  --green: #34d399;
  --orange: #fb923c;
  --red: #fb7185;

  --radius: 18px;
  --shadow: 0 20px 50px rgba(0, 0, 0, 0.22);
}

* {
  box-sizing: border-box;
}

html {
  scroll-behavior: smooth;
}

body {
  margin: 0;
  min-height: 100vh;
  background:
    radial-gradient(circle at 70% 0%, rgba(91, 33, 182, 0.12), transparent 35%),
    var(--bg);
  color: var(--text);
  font-family: "Inter", sans-serif;
  font-size: 14px;
}

button,
input,
textarea,
select {
  font: inherit;
}

button {
  cursor: pointer;
}

button:focus-visible,
input:focus-visible,
textarea:focus-visible,
select:focus-visible {
  outline: 2px solid var(--primary-light);
  outline-offset: 3px;
}

button:disabled {
  opacity: 0.55;
  cursor: not-allowed;
}

.app-shell {
  display: flex;
  min-height: 100vh;
}

/* SIDEBAR */

.sidebar {
  width: 250px;
  flex-shrink: 0;
  padding: 25px 17px;
  display: flex;
  flex-direction: column;
  background: rgba(12, 19, 35, 0.95);
  border-right: 1px solid var(--border);
}

.brand {
  display: flex;
  align-items: center;
  gap: 12px;
  color: inherit;
  text-decoration: none;
  margin-bottom: 38px;
}

.brand-logo,
.footer-logo {
  display: grid;
  place-items: center;
  width: 43px;
  height: 43px;
  flex-shrink: 0;
  border-radius: 14px;
  color: white;
  font-size: 23px;
  font-weight: 800;
  background: linear-gradient(135deg, #a78bfa, #6d28d9);
  box-shadow: 0 7px 22px rgba(139, 92, 246, 0.3);
}

.brand-copy strong,
.brand-copy span {
  display: block;
}

.brand-copy strong {
  font-size: 15px;
}

.brand-copy span {
  color: var(--muted);
  font-size: 11px;
  margin-top: 5px;
}

.sidebar-label {
  margin: 17px 10px 12px;
  color: #7785a1;
  font-size: 10px;
  font-weight: 800;
  letter-spacing: 1.4px;
}

.nav-item {
  display: flex;
  align-items: center;
  gap: 13px;
  width: 100%;
  padding: 13px 12px;
  margin-bottom: 6px;
  border: 1px solid transparent;
  border-radius: 12px;
  background: transparent;
  color: #aab7ce;
  text-align: left;
  transition: 0.2s ease;
}

.nav-item:hover {
  background: var(--surface-2);
  color: white;
}

.nav-item.active {
  background: linear-gradient(
    100deg,
    rgba(139, 92, 246, 0.23),
    rgba(56, 189, 248, 0.07)
  );
  border-color: rgba(167, 139, 250, 0.22);
  color: white;
}

.nav-item span:first-child {
  font-size: 18px;
}

.sidebar-bottom {
  margin-top: auto;
  padding-top: 25px;
}

.sidebar-badge {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 14px 11px;
  background: var(--surface-2);
  border: 1px solid var(--border);
  border-radius: 13px;
}

.sidebar-badge strong,
.sidebar-badge small {
  display: block;
}

.sidebar-badge strong {
  font-size: 12px;
}

.sidebar-badge small {
  color: var(--muted);
  margin-top: 4px;
  font-size: 10px;
}

.status-dot {
  width: 8px;
  height: 8px;
  flex-shrink: 0;
  border-radius: 50%;
  background: var(--green);
  box-shadow: 0 0 12px rgba(52, 211, 153, 0.55);
}

/* MAIN */

.main-content {
  width: calc(100% - 250px);
  max-width: 1800px;
  margin: 0 auto;
  padding: 27px 32px;
  min-width: 0;
}

.topbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 15px;
  margin-bottom: 25px;
}

.topbar-title h1 {
  margin: 0;
  font-size: 24px;
  letter-spacing: -0.8px;
}

.topbar-title p {
  margin: 7px 0 0;
  color: var(--muted);
  font-size: 12px;
}

.topbar-actions {
  display: flex;
  align-items: center;
  gap: 13px;
}

.icon-button,
.mobile-menu {
  display: grid;
  place-items: center;
  width: 41px;
  height: 41px;
  border: 1px solid var(--border);
  border-radius: 12px;
  background: var(--surface);
  color: white;
  font-size: 19px;
}

.mobile-menu {
  display: none;
}

.user-avatar {
  display: grid;
  place-items: center;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: linear-gradient(135deg, #38bdf8, #8b5cf6);
  font-weight: 800;
}

/* WELCOME */

.welcome-card {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: space-between;
  min-height: 210px;
  padding: 30px 35px;
  overflow: hidden;
  border: 1px solid rgba(167, 139, 250, 0.22);
  border-radius: 23px;
  background:
    radial-gradient(circle at 90% 40%, rgba(56, 189, 248, 0.18), transparent 30%),
    linear-gradient(115deg, #211947, #121a32 68%, #102a42);
  box-shadow: var(--shadow);
}

.welcome-content {
  position: relative;
  z-index: 2;
  max-width: 600px;
}

.eyebrow {
  color: #c4b5fd;
  font-size: 10px;
  font-weight: 800;
  letter-spacing: 1.7px;
}

.welcome-content h2 {
  max-width: 520px;
  margin: 17px 0 10px;
  font-size: clamp(25px, 3vw, 37px);
  line-height: 1.15;
  letter-spacing: -1.3px;
}

.welcome-content h2 span {
  color: #a78bfa;
}

.welcome-content p {
  max-width: 460px;
  margin: 0;
  color: #c0c9dd;
  font-size: 12px;
  line-height: 1.8;
}

.welcome-art {
  position: relative;
  width: 175px;
  height: 150px;
  flex-shrink: 0;
  margin-right: 25px;
  display: grid;
  place-items: center;
}

.art-paper {
  position: relative;
  z-index: 2;
  width: 108px;
  height: 130px;
  padding: 25px 13px;
  transform: rotate(8deg);
  border-radius: 8px;
  background: #f8fafc;
  box-shadow: 0 20px 35px rgba(0, 0, 0, 0.3);
}

.art-line {
  height: 3px;
  margin-bottom: 14px;
  border-radius: 4px;
  background: #cbd5e1;
}

.art-line.short {
  width: 60%;
}

.art-signature {
  margin-top: 15px;
  color: #6d28d9;
  font-family: "Caveat", cursive;
  font-size: 25px;
}

.art-orbit {
  position: absolute;
  width: 155px;
  height: 155px;
  border: 1px solid rgba(167, 139, 250, 0.3);
  border-radius: 50%;
}

/* QUICK ACTIONS */

.quick-actions {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 14px;
  margin: 24px 0 35px;
}

.quick-card {
  display: flex;
  align-items: center;
  gap: 12px;
  min-width: 0;
  padding: 17px 14px;
  border: 1px solid var(--border);
  border-radius: 16px;
  background: linear-gradient(145deg, var(--surface), #111b30);
  color: var(--text);
  text-align: left;
  transition: transform 0.2s, border-color 0.2s;
}

.quick-card:hover {
  transform: translateY(-3px);
  border-color: rgba(167, 139, 250, 0.4);
}

.quick-card > span:nth-child(2) {
  min-width: 0;
  flex: 1;
}

.quick-card strong,
.quick-card small {
  display: block;
}

.quick-card strong {
  font-size: 11px;
  line-height: 1.5;
}

.quick-card small {
  margin-top: 5px;
  color: var(--muted);
  font-size: 10px;
  line-height: 1.5;
}

.quick-icon {
  display: grid;
  place-items: center;
  width: 43px;
  height: 43px;
  flex-shrink: 0;
  border-radius: 13px;
  font-size: 20px;
}

.quick-icon.purple {
  background: rgba(139, 92, 246, 0.15);
}

.quick-icon.blue {
  background: rgba(56, 189, 248, 0.15);
}

.quick-icon.orange {
  background: rgba(251, 146, 60, 0.15);
}

.quick-arrow {
  color: #a78bfa;
  font-size: 16px;
}

/* SECTION */

.workspace-section {
  margin-bottom: 38px;
}

.hidden {
  display: none !important;
}

.section-heading {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 15px;
  margin-bottom: 19px;
}

.section-heading h2 {
  margin: 0;
  font-size: 19px;
  letter-spacing: -0.5px;
}

.section-heading p {
  margin: 7px 0 0;
  color: var(--muted);
  font-size: 11px;
  line-height: 1.6;
}

.live-badge,
.preview-status {
  display: inline-flex;
  align-items: center;
  gap: 7px;
  padding: 9px 11px;
  border: 1px solid rgba(52, 211, 153, 0.2);
  border-radius: 30px;
  color: #86efac;
  background: rgba(52, 211, 153, 0.08);
  font-size: 10px;
  white-space: nowrap;
}

.preview-status {
  border-color: var(--border);
  color: #a78bfa;
  background: rgba(139, 92, 246, 0.08);
}

/* PANELS */

.workspace-grid {
  display: grid;
  grid-template-columns: minmax(0, 0.92fr) minmax(0, 1.08fr);
  align-items: start;
  gap: 20px;
}

.panel {
  min-width: 0;
  padding: 22px;
  border: 1px solid var(--border);
  border-radius: var(--radius);
  background: linear-gradient(145deg, #111a2c, #0d1525);
  box-shadow: var(--shadow);
}

.panel-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  margin-bottom: 20px;
}

.panel-header h3 {
  margin: 0;
  font-size: 14px;
}

.panel-header p {
  margin: 6px 0 0;
  color: var(--muted);
  font-size: 10px;
  line-height: 1.6;
}

.text-button {
  padding: 7px 10px;
  border: 1px solid var(--border);
  border-radius: 8px;
  background: transparent;
  color: #c4b5fd;
  font-size: 11px;
}

/* INPUTS */

textarea,
select {
  width: 100%;
  border: 1px solid #27334a;
  border-radius: 11px;
  background: #0b1221;
  color: var(--text);
}

textarea {
  min-height: 175px;
  padding: 14px;
  resize: vertical;
  line-height: 1.7;
}

textarea::placeholder {
  color: #687791;
}

select {
  min-height: 43px;
  padding: 10px;
}

.text-footer {
  display: flex;
  justify-content: space-between;
  gap: 12px;
  margin-top: 10px;
  color: var(--muted);
  font-size: 10px;
}

.text-footer b {
  color: #e2e8f0;
}

.divider {
  height: 1px;
  margin: 23px 0;
  background: var(--border);
}

.subheading {
  margin: 0 0 17px;
  font-size: 13px;
}

.field-label {
  display: block;
  margin-bottom: 9px;
  color: #c3cee0;
  font-size: 11px;
  font-weight: 600;
}

.field {
  min-width: 0;
  margin-top: 17px;
}

.field-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 15px;
  margin-top: 17px;
}

.field-grid .field {
  margin-top: 0;
}

.range-row {
  display: flex;
  align-items: center;
  gap: 10px;
  min-height: 34px;
}

.range-row input {
  width: 100%;
  min-width: 0;
  accent-color: var(--primary);
}

.range-row output {
  min-width: 40px;
  color: #c4b5fd;
  font-size: 10px;
  text-align: right;
}

.color-field {
  display: flex;
  align-items: center;
  gap: 9px;
  min-height: 43px;
  padding: 5px 9px;
  border: 1px solid #27334a;
  border-radius: 11px;
  background: #0b1221;
}

.color-field input[type="color"] {
  width: 29px;
  height: 29px;
  padding: 0;
  border: none;
  border-radius: 6px;
  background: transparent;
  cursor: pointer;
}

.color-field span {
  color: #c3cee0;
  font-size: 10px;
}

/* SWITCHES */

.toggle-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  padding: 15px 0;
  border-bottom: 1px solid var(--border);
}

.toggle-row strong,
.toggle-row small {
  display: block;
}

.toggle-row strong {
  font-size: 11px;
}

.toggle-row small {
  margin-top: 5px;
  color: var(--muted);
  font-size: 10px;
}

.switch {
  position: relative;
  display: inline-block;
  width: 39px;
  height: 22px;
  flex-shrink: 0;
}

.switch input {
  width: 0;
  height: 0;
  opacity: 0;
}

.slider {
  position: absolute;
  inset: 0;
  border-radius: 20px;
  background: #344158;
  transition: 0.2s;
  cursor: pointer;
}

.slider::before {
  position: absolute;
  content: "";
  width: 16px;
  height: 16px;
  left: 3px;
  top: 3px;
  border-radius: 50%;
  background: white;
  transition: 0.2s;
}

.switch input:checked + .slider {
  background: #7c3aed;
}

.switch input:checked + .slider::before {
  transform: translateX(17px);
}

/* BUTTONS */

.primary-button,
.secondary-button {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  min-height: 43px;
  padding: 11px 15px;
  border: 1px solid transparent;
  border-radius: 11px;
  font-size: 11px;
  font-weight: 700;
  text-align: center;
  transition: transform 0.2s, filter 0.2s;
}

.primary-button {
  color: white;
  background: linear-gradient(135deg, #8b5cf6, #6d28d9);
  box-shadow: 0 7px 18px rgba(109, 40, 217, 0.18);
}

.primary-button:hover {
  filter: brightness(1.13);
  transform: translateY(-1px);
}

.secondary-button {
  color: #d9e2f2;
  background: #18233a;
  border-color: #293750;
}

.secondary-button:hover {
  background: #22304b;
}

.full-width {
  width: 100%;
  margin-top: 15px;
}

.button-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 10px;
  margin-top: 10px;
}

.upload-button {
  cursor: pointer;
}

/* PREVIEW */

.preview-panel {
  overflow: hidden;
}

.preview-stage {
  display: flex;
  align-items: flex-start;
  justify-content: center;
  min-height: 510px;
  padding: 22px 10px;
  overflow: auto;
  border: 1px solid var(--border);
  border-radius: 13px;
  background:
    radial-gradient(circle at 50% 40%, rgba(139, 92, 246, 0.09), transparent 50%),
    #0a1120;
}

.paper {
  position: relative;
  width: 100%;
  max-width: 440px;
  min-height: 570px;
  padding: 45px 32px 60px;
  overflow: hidden;
  color: #172554;
  background-color: #ffffff;
  background-image: none;
  box-shadow: 0 14px 35px rgba(0, 0, 0, 0.35);
  overflow-wrap: anywhere;
}

.paper.size-a4 {
  min-height: 570px;
}

.paper.size-a5 {
  max-width: 330px;
  min-height: 470px;
}

.paper.size-letter {
  max-width: 440px;
  min-height: 550px;
}

.paper.paper-lined {
  background-image: repeating-linear-gradient(
    to bottom,
    transparent 0,
    transparent 31px,
    rgba(96, 165, 250, 0.25) 32px,
    transparent 33px
  );
}

.paper.paper-grid {
  background-image:
    linear-gradient(rgba(96, 165, 250, 0.18) 1px, transparent 1px),
    linear-gradient(90deg, rgba(96, 165, 250, 0.18) 1px, transparent 1px);
  background-size: 22px 22px;
}

.paper.paper-margin {
  border-left: 3px solid #fb7185;
  background-image: repeating-linear-gradient(
    to bottom,
    transparent 0,
    transparent 31px,
    rgba(96, 165, 250, 0.25) 32px,
    transparent 33px
  );
}

.paper-content {
  position: relative;
  z-index: 1;
  min-height: 420px;
  font-family: "Caveat", cursive;
  font-size: 24px;
  font-weight: 400;
  line-height: 1.7;
  white-space: pre-wrap;
  overflow-wrap: anywhere;
}

.watermark {
  position: absolute;
  z-index: 3;
  right: 12px;
  bottom: 12px;
  color: rgba(71, 85, 105, 0.48);
  font-family: "Inter", sans-serif;
  font-size: 10px;
  font-weight: 700;
  letter-spacing: 0.4px;
  pointer-events: none;
  user-select: none;
}

.preview-footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
  margin-top: 14px;
  color: var(--muted);
  font-size: 10px;
}

.notice {
  margin-top: 20px;
  padding: 15px;
  border: 1px solid rgba(56, 189, 248, 0.17);
  border-radius: 12px;
  background: rgba(56, 189, 248, 0.045);
}

.notice strong {
  color: #7dd3fc;
  font-size: 11px;
}

.notice p {
  margin: 8px 0 0;
  color: var(--muted);
  font-size: 10px;
  line-height: 1.8;
}

/* SCANNER */

.scanner-panel {
  max-width: 1000px;
}

.upload-zone {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 35px 20px;
  border: 1px dashed #435273;
  border-radius: 15px;
  background: rgba(139, 92, 246, 0.035);
  text-align: center;
}

.upload-icon {
  display: grid;
  place-items: center;
  width: 68px;
  height: 68px;
  margin-bottom: 15px;
  border: 1px solid rgba(167, 139, 250, 0.18);
  border-radius: 22px;
  background: rgba(139, 92, 246, 0.12);
  font-size: 29px;
}

.upload-zone h3 {
  margin: 0;
  font-size: 16px;
}

.upload-zone p {
  max-width: 450px;
  color: var(--muted);
  font-size: 11px;
  line-height: 1.8;
}

.upload-actions {
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
  gap: 10px;
  margin-top: 12px;
}

.small-note {
  font-size: 10px !important;
}

.camera-container,
.video-container,
.image-preview-container {
  margin-top: 24px;
}

#cameraVideo,
#videoPlayer {
  display: block;
  width: 100%;
  max-height: 440px;
  margin-bottom: 15px;
  border-radius: 13px;
  background: #030712;
}

#uploadedImagePreview {
  display: block;
  width: 100%;
  max-height: 440px;
  object-fit: contain;
  margin: 14px 0;
  border-radius: 12px;
  background: #080d1b;
}

.image-preview-container h3 {
  font-size: 13px;
}

.progress-container {
  margin-top: 25px;
}

.progress-label {
  display: flex;
  justify-content: space-between;
  gap: 10px;
  margin-bottom: 10px;
  color: #cbd5e1;
  font-size: 11px;
}

progress {
  display: block;
  width: 100%;
  height: 8px;
  overflow: hidden;
  border: 0;
  border-radius: 20px;
  background: #27334a;
  accent-color: var(--primary);
}

progress::-webkit-progress-bar {
  background: #27334a;
  border-radius: 20px;
}

progress::-webkit-progress-value {
  background: linear-gradient(90deg, #8b5cf6, #38bdf8);
  border-radius: 20px;
}

/* EDITOR SHORTCUTS */

.editor-shortcuts {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}

/* FOOTER */

.app-footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 15px;
  padding: 22px 0 10px;
  border-top: 1px solid var(--border);
  color: var(--muted);
  font-size: 10px;
}

.footer-brand {
  display: flex;
  align-items: center;
  gap: 9px;
  color: white;
  font-weight: 700;
}

.footer-logo {
  width: 27px;
  height: 27px;
  border-radius: 8px;
  font-size: 14px;
}

.app-footer p {
  margin: 0;
}

/* TOAST */

.toast {
  position: fixed;
  z-index: 1000;
  left: 50%;
  bottom: 24px;
  max-width: calc(100vw - 32px);
  padding: 13px 18px;
  border: 1px solid rgba(167, 139, 250, 0.3);
  border-radius: 12px;
  background: #17213a;
  color: white;
  box-shadow: var(--shadow);
  font-size: 12px;
  opacity: 0;
  pointer-events: none;
  transform: translate(-50%, 15px);
  transition: 0.25s;
}

.toast.show {
  opacity: 1;
  transform: translate(-50%, 0);
}

/* LIGHT THEME */

body.light-theme {
  --bg: #f0f3fa;
  --surface: #ffffff;
  --surface-2: #f2f5fb;
  --surface-3: #e6ebf5;

  --text: #172033;
  --muted: #65728a;
  --border: rgba(25, 38, 64, 0.12);

  background: #f0f3fa;
  color: var(--text);
}

body.light-theme .sidebar,
body.light-theme .panel {
  background: #ffffff;
}

body.light-theme .nav-item {
  color: #526078;
}

body.light-theme .nav-item.active {
  color: #38216e;
}

body.light-theme textarea,
body.light-theme select,
body.light-theme .color-field {
  background: #f7f9fd;
  color: #172033;
  border-color: #d8dfeb;
}

body.light-theme .text-footer b,
body.light-theme .footer-brand {
  color: #172033;
}

body.light-theme .quick-card {
  background: #ffffff;
  color: #172033;
}

body.light-theme .secondary-button {
  background: #edf1fa;
  color: #24314b;
  border-color: #d8dfeb;
}

body.light-theme .icon-button,
body.light-theme .mobile-menu {
  color: #172033;
  background: white;
}

/* RESPONSIVE */

@media (max-width: 1200px) {
  .main-content {
    padding: 24px 20px;
  }

  .sidebar {
    width: 225px;
  }

  .main-content {
    width: calc(100% - 225px);
  }

  .workspace-grid {
    grid-template-columns: minmax(0, 1fr);
  }

  .preview-stage {
    min-height: 420px;
  }

  .quick-actions {
    gap: 10px;
  }
}

@media (max-width: 800px) {
  .sidebar {
    position: fixed;
    z-index: 100;
    top: 0;
    bottom: 0;
    left: 0;
    width: 270px;
    transform: translateX(-105%);
    transition: transform 0.25s ease;
    box-shadow: 20px 0 50px rgba(0, 0, 0, 0.3);
  }

  .sidebar.open {
    transform: translateX(0);
  }

  .main-content {
    width: 100%;
    padding: 19px 15px;
  }

  .mobile-menu {
    display: grid;
   
