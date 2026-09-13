<div align="center">
  <img src="assets/icons/icon.png" alt="Repix Logo" width="128" height="128" style="border-radius: 24px;">
  <h1>Repix</h1>
  <p><strong>The Lightning-Fast, Local AVIF Image Converter for Google Chrome</strong></p>
  <p>Convert modern AVIF images into universally supported PNG, JPEG, or WebP formats without ever leaving your browser or sacrificing your privacy to third-party cloud servers.</p>
</div>

<hr>

## 🚀 Why Repix?

As the web moves towards the highly-compressed AVIF image format, many users find themselves unable to open, edit, or share the images they download. **Repix solves this instantly.** 

By utilizing the HTML5 Canvas API directly within the browser, Repix securely converts your images locally on your machine—no servers, no waiting, no privacy risks.

## ✨ Features

- **⚡ Blazing Fast Local Processing:** Images are converted entirely on your device using the browser's native Canvas API. Zero network requests are made.
- **🛡️ 100% Private:** Your images never leave your computer.
- **🎨 Multiple Formats:** Convert from `AVIF` directly to `PNG`, `JPEG`, or `WebP`.
- **🌙 Beautiful UI & Dark Mode:** A sleek, fully responsive popup menu and a full-page dashboard, complete with a globally synced Dark Mode toggle.
- **📊 Conversion History:** Keep track of your batch conversions with an interactive history log and real-time stats tracker.
- **⚙️ Advanced Preferences:** Set a default format, tweak JPEG/WebP compression quality, and toggle auto-save behavior directly in the side-menu.

## 📦 Installation

Since Repix is currently in development (V1), you can install it manually as an unpacked Chrome extension:

1. Download or clone this repository to your local machine.
2. Open Google Chrome and navigate to `chrome://extensions/`.
3. Toggle on **Developer mode** in the top right corner.
4. Click **Load unpacked** in the top left corner.
5. Select the root `repix` directory.
6. 🎉 The Repix icon will appear in your extensions bar!

## 📂 Project Architecture

Repix is built using Vanilla HTML/CSS/JS to keep it lightweight and incredibly fast. It follows modern Chrome Extension (Manifest V3) architecture standards:

```text
repix/
├── manifest.json
├── README.md
├── progress.md
├── assets/
│   └── icons/
│       └── icon.png
└── src/
    ├── popup/        # The quick-access extension dropdown menu
    ├── dashboard/    # The full-page batch processing & history view
    └── shared/       # Core Canvas API conversion logic
```

## 🔮 Roadmap (V2.0 & V3.0)

We are actively working on making Repix the ultimate image utility tool:

- [ ] **Right-Click Context Menu:** Instantly save AVIFs as PNGs from any webpage with a single click.
- [ ] **ZIP Batch Export:** Bundle dozens of converted files into a single `.zip` archive.
- [ ] **Local AI Upscaling:** Double the resolution of blurry images during conversion using local WebGL processing.
- [ ] **PDF Binder:** Export converted images seamlessly into a single PDF document.

## 🤝 Contributing

Contributions, issues, and feature requests are welcome! 
Feel free to check the [issues page](../../issues).

---

<div align="center">
  <sub>Built with ❤️ for a faster, simpler web.</sub>
</div>
