# photosynth

**An interactive educational site about photosynthesis — from photons to glucose.**

[![Live site](https://img.shields.io/badge/demo-live-111?style=for-the-badge&logo=githubpages&logoColor=white)](https://aarushkandukoori.github.io/photosynthesis-site/)
[![HTML](https://img.shields.io/badge/HTML-semantic-f4821f?style=flat-square&logo=html5&logoColor=white)]()
[![CSS](https://img.shields.io/badge/CSS-custom-111?style=flat-square&logo=css3&logoColor=white)]()
[![JavaScript](https://img.shields.io/badge/JavaScript-vanilla-f5c842?style=flat-square&logo=javascript&logoColor=black)]()

---

## Live demo

**https://aarushkandukoori.github.io/photosynthesis-site/**

No install required — open the link and scroll through the full experience.

---

## What it is

**photosynth** is a single-page site that explains how plants convert sunlight into chemical energy. It combines clean typography, scroll-driven animation, and hands-on widgets so learners can see photosynthesis instead of only reading about it.

Built as a static site (HTML, CSS, vanilla JS) and deployed on **GitHub Pages**.

---

## Features

| Section | What you get |
|--------|----------------|
| **Pinned scroll sequence** | Apple-style scroll animation through five stages inside a plant cell — light capture, photolysis, energy transfer, carbon fixation, and glucose synthesis |
| **Chemical equation** | Animated horizontal layout for `6 CO₂ + 6 H₂O + light → C₆H₁₂O₆ + 6 O₂` |
| **Chloroplast diagram** | Interactive cross-section with hover labels for membranes, grana, stroma, and more |
| **Environmental simulator** | Sliders for light, CO₂, temperature, and water — watch the plant thrive or struggle in real time |
| **Quiz** | Three-question knowledge check with instant feedback and a score summary |
| **Dark mode** | Toggle between light and dark themes (saved in `localStorage`) |

---

## Site map

```
Hero → Scroll sequence → Overview → Equation → Process → Factors → Quiz → Footer
```

Jump to any section from the top navigation bar.

---

## Tech stack

- **HTML5** — semantic structure, accessible labels
- **CSS3** — custom properties, flex/grid, scroll-pin layout, responsive breakpoints
- **JavaScript** — no frameworks; Intersection Observer, scroll-driven animation, simulator logic
- **GitHub Pages** — static hosting from `main`

---

## Run locally

Clone the repo and serve the folder with any static file server:

```bash
git clone https://github.com/aarushkandukoori/photosynthesis-site.git
cd photosynthesis-site
python3 -m http.server 8080
```

Then open **http://localhost:8080** in your browser.

---

## Project structure

```
photosynthesis-site/
├── index.html      # Page structure and content
├── styles.css      # Layout, theme, and animations
├── script.js       # Theme toggle, equation, chloroplast, simulator, quiz
├── scroll-pin.js   # Pinned scroll sequence (plant cell animation)
└── README.md
```

---

## Deployment

The site is published from the **`main`** branch via GitHub Pages. Push to `main` and changes go live within a minute or two.

---

## Author

Made by **[Aarush Kandukoori](https://github.com/aarushkandukoori)**

---

## License

This project is open source under the [MIT License](LICENSE).
