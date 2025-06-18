# 📌 markyPad

> Snap sticky markdown notes onto any page, code block, or repo.

---

---

## 🧠 Overview

markyPad is a lightweight Chrome extension designed for developers, learners, and reviewers who want to leave contextual, markdown-powered notes on any webpage—especially helpful for codebases, documentation, or GitHub PRs.

[![Featured on Product Hunt](https://api.producthunt.com/widgets/embed-image/v1/featured.svg?post_id=980221&theme=light&t=1750230472445)](https://www.producthunt.com/products/github-114?embed=true&utm_source=badge-featured&utm_medium=badge&utm_source=badge-github-880b1d61-4202-4b00-aa72-08751bbe0b51)


---

---

## ✨ Features

- 📝 **Sticky Notepad Overlay**  
  Resizable notepad fixed to the screen for seamless note-taking.

- 📍 **Per-Page or Domain Scoped Notes**  
  Notes are saved based on the current page URL or entire domain, depending on your choice.

- 🧠 **Markdown Support**  
  Supports full markdown syntax, including code blocks.

- 🔄 **Auto Save & Sync**  
  Notes are saved automatically in local storage.

- ⬇️ **Export Options**  
  Export notes in Markdown or JSON format — per page or for all pages.

- 🧱 **Per-Element Anchoring (Coming Soon)**  
  Sticky notes tied to specific code blocks or DOM elements.

- 🔗 **GitHub PR Sync (Planned)**  
  Sync notes with GitHub PRs using the GitHub API.

---

---

## 🛠 Installation

### 1. Clone or Download the Repo

```bash
git clone https://github.com/mrWindswept/markyPad.git
cd markyPad

#install dependencies
npm install

#build the extension
npm run build
```

### This creates the final extension files inside the **`dist/`** folder.

---

### 2. Load the extension in chrome browser

1. Open `chrome://extensions/`

2. Enable **Developer mode**

3. Click **Load unpacked**

4. Select the `dist/` folder

---

## 🧪 Usage

- Open any site in chrome browser. You will see a sticky note at the bottom rigth of the page.

- Start writing your notes using markdown **_(Auto-saved)_**.

- Toggle between edit and preview mode.

- Choose to scope notes to the full domain 🌐 or just the current page 🔗.

- Export your notes any time as `.json`

---

#### 📁 Folder structure

```
markyPad/
├── public/                 # Static assets (icons, sidepanel HTML)
│   ├── manifest.json       # Chrome Extension manifest v3
├── src/
│   ├── components/         # React components (StickyNote, Toolbar, etc.)
│   ├── content/            # Content script logic
│   ├── background/         # Background service (if needed)
│   ├── utils/              # Storage and markdown helpers
│   └── assets/             # Assests (if needed)
└── dist/                   # Production build output
```

---

## 📄 License

MIT © [[Kunal Patil](https://github.com/mrWindswept/markyPad?tab=MIT-1-ov-file)]

---

## 🙌 Acknowledgements

`Turndown` – for HTML to Markdown conversion

`React + Tailwind CSS` – powering the UI

`Chrome Extensions API` – for storage and DOM integration

`markdown-to-jsx` - convert text to markdown

---

---

# 🛠 Contributing to markyPad

Thank you for considering contributing to **markyPad** — your efforts help make this extension better for everyone! This document outlines the process for contributing code, reporting issues, and proposing enhancements.

---

#### We welcome:

- 🐛 Bug reports and fixes
- 💡 Feature suggestions and implementations
- 🧪 Testing improvements
- 📖 Documentation updates

---

## 🚀 Getting Started

### 1. Fork & Clone

```bash
git clone https://github.com/mrWindswept/markyPad.git
cd markyPad
npm install
```

### 2. Development Commands

```bash
npm run build   # Create production-ready files (in /dist)
```

### 3. 📥 Submitting a Pull Request

#### Create a feature branch:

```bash
git checkout -b feature/my-update
```

#### Commit with clear messages:

```bash
git commit -m "`Fix`: export markdown only for current page"
```

#### Push to your fork and submit a Pull Request via GitHub

> **_Please include a brief description of what you changed and why._**

---

---

# 🙏 Thank You!

Your time and effort are truly appreciated 💖
