# DWD — Handmade Cloisonné & Resin Card Art

## 🌐 Live site: [dwdyck.github.io/Cloisonne](https://dwdyck.github.io/Cloisonne/)

> **About this project:** an experiment in using AI to build interesting web use cases. Here the use case is an artist portfolio with a reveal gallery and commission inquiry flow, built as a static site.

DWD is an independent artist portfolio for physical, handmade cloisonné and resin artwork inspired by Pokémon and collectible card culture. The one-page site introduces the cloisonné technique, presents a reveal gallery and custom artwork, and shares the making process, the artist, and commission inquiries.

Featured pieces are listed at $500 each. Custom commission pricing is discussed after a project brief. This is a static portfolio; it has no checkout or server-side form processing.

## Project structure

```text
.
├── index.html
├── favicon.svg
├── README.md
├── DEPLOYMENT.md
├── IMAGE-GUIDE.txt
├── css/
│   └── styles.css
├── js/
│   └── script.js
└── images/
    ├── .gitkeep
    └── Add approved JPG artwork photos here
```

## Run locally

No build step or package installation is required.

1. Open this folder in VS Code.
2. Open `index.html` with the Live Server extension, or serve the folder with any local static HTTP server.
3. Visit the local URL shown by the server.

Serving the folder over HTTP is recommended for consistent browser behavior. All site navigation remains within `index.html`.

## Artwork and inquiries

The supplied `images/charizard.jpg` is connected to the hero, flagship piece, and gallery reveal. Other artwork panels use designed placeholders until their photos are supplied and connected; see [IMAGE-GUIDE.txt](IMAGE-GUIDE.txt) for filenames and instructions.

To enable commission inquiries, set `CONTACT_EMAIL` near the top of `js/script.js`. The form opens a prefilled draft in the visitor's email application; it does not send or store submissions.

See [DEPLOYMENT.md](DEPLOYMENT.md) for GitHub Pages, Netlify, and custom-domain setup.
