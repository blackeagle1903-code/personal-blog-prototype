# personal-blog-prototype

# 📓 Notebook — Minimalist Personal Blog Engine

A modern, standalone personal publishing interface built with zero external dependencies. Designed with a decoupled architecture that runs instantly in the browser via `localStorage` and easily adapts to any custom backend API.

---

## ✨ Features

- **Zero Dependencies:** Pure vanilla HTML5, semantic CSS3, and standard Web APIs.
- **Editorial Typography:** Optimized line heights, balanced contrast, and fluid typography for high readability.
- **Decoupled Architecture:** Clean separation of concerns between reader view (`index.html`), admin dashboard (`admin.html`), design tokens (`style.css`), and data operations (`app.js`).
- **Instant Persistence:** Stores and syncs articles, read-time calculations, and images locally out of the box.
- **Backend Ready:** Built with a storage adapter pattern; swap two functions in `app.js` to connect to Node.js, Go, Python, or SQLite.

---

## 📁 Project Structure

```text
personal-blog-prototype/
├── image/
│   └── images.jpg       # Local cover assets
├── index.html           # Public reader feed
├── admin.html           # Content editor and post management
├── style.css            # Unified design system and tokens
├── app.js               # Centralized data adapter and business logic
└── README.md            # Documentation
