# Contributing to Repix

First off, thank you for considering contributing to Repix! It's people like you that make the open-source community such an amazing place to learn, inspire, and create.

## 🧠 Architecture Overview
Repix is built using **Vanilla HTML/CSS/JS** targeting Manifest V3. We intentionally avoid heavy bundlers (like Webpack or Vite) and frameworks (like React) to keep the extension blazing fast, lightweight, and easy to hack on.

The codebase is organized as follows:
- `assets/icons/`: Contains extension icons.
- `src/popup/`: The quick-access extension dropdown UI.
- `src/dashboard/`: The full-page dashboard UI for batch processing.
- `src/shared/`: Shared backend logic, including the `converter.js` Canvas API engine.

## 🛠️ How to Contribute

### 1. Report Bugs
If you find a bug, please open an issue! Be sure to include:
- A clear, descriptive title.
- Steps to reproduce the bug.
- Expected behavior vs. actual behavior.
- Your OS and Chrome version.

### 2. Suggest Features
We love new ideas! If you have a feature request (like the ones listed in our `progress.md` V2/V3 roadmap), open an issue labeled `enhancement` and describe how it would work and why it would be useful.

### 3. Submit Pull Requests
Want to write code? Awesome! Here is the standard workflow:

1. **Fork the repository** and clone it locally.
2. **Create a branch** for your feature or bug fix: `git checkout -b feature/my-new-feature` or `git checkout -b fix/annoying-bug`.
3. **Make your changes** in the codebase.
4. **Test your changes** by loading the unpacked extension in `chrome://extensions/`. Ensure the popup, dashboard, and conversion logic all still work.
5. **Commit your changes** using clear and descriptive commit messages (e.g., `feat: add right-click context menu` or `fix: resolve dark mode overlap`).
6. **Push to your fork** and **Submit a Pull Request** to the `main` branch of this repository.

## 🎨 Styleguide
- **Code:** We use standard ES6 Javascript. Prefer `async/await` over raw promises. Keep logic modular.
- **CSS:** Use standard CSS without preprocessors. Respect the existing CSS variable structure and ensure you add support for `body.dark-mode` for any new UI elements.
- **UI/UX:** We aim for a premium, clean, "Apple-like" aesthetic. Use smooth transitions and maintain the existing color palette (Emerald Green / Amber Gold).

## 💬 Code of Conduct
By participating in this project, you agree to maintain a respectful, welcoming, and harassment-free environment for everyone. 

Happy hacking! 🚀
