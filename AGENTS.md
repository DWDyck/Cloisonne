# AGENTS.md — Cloisonné (DWD portfolio)

Guidance for AI coding agents. Read this first; it should get you productive in ~5 minutes.

## Project Overview

**What it is:** A one-page portfolio site for "DWD", an artist making handmade cloisonné and resin card art inspired by Pokémon and collectible cards. It showcases featured pieces, a "reveal" mystery gallery, the making process, and a commission inquiry form. Live at https://dwdyck.github.io/Cloisonne/

**Primary users:** Collectors and prospective commission clients browsing (mostly on phones) and deciding whether to inquire.

**Goals:** Present the art well, make commissioning easy, load fast, stay accessible, and be trivial for a non-developer owner to host and update.

**Non-goals (do not add unless explicitly asked):**
- E-commerce, checkout, payments, carts (featured pieces list a $500 price but there is no purchase flow).
- Accounts, a CMS, a backend, databases, or server-side form handling.
- Analytics/tracking or third-party embeds.
- Using official Pokémon/Nintendo logos, card templates, fonts, or character artwork. Only photos of the owner's own authorized art.

This repo is also an experiment in building web use cases with AI (see README).

## Architecture

Single static page, no build step.

- `index.html` (~170 lines) holds all content in sections: `#home`, `#featured`, `#gallery`, `#process`, `#custom-art`, `#commissions`, `#about`, `#contact`, plus a footer and a `<dialog data-reveal-dialog>`.
- `css/styles.css` styles everything; `js/script.js` adds progressive-enhancement behavior. The page is readable without JS.
- **Data flow:** there is no data layer. Content lives in HTML; artwork metadata for the reveal dialog is in `data-title` / `data-medium` / `data-story` attributes on gallery buttons. The commission form builds a `mailto:` link client-side; **nothing is sent or stored by the site.**
- **State:** none persisted. UI state is classes/ARIA attributes only (`aria-expanded`, `aria-current="location"`, `.is-loaded`, `.has-artwork`, dialog open state).

`js/script.js` features (top-level code, `"use strict"`, no module wrapper):
1. Mobile menu toggle (`aria-expanded`; closes on Escape and outside click).
2. `IntersectionObserver` nav highlighting (`aria-current="location"`).
3. Artwork image loading: `<img data-artwork-image>` toggles `.is-loaded` / `.has-artwork` on load/error so the CSS placeholder stays visible when a photo is missing.
4. Foil-card pointer effect on `[data-foil-card], .mystery-card` (sets `--foil-x` / `--foil-y` on `pointermove`; ignores touch pointers; reduced-motion/hover handling lives in CSS).
5. Reveal `<dialog>`: opened by any `[data-art-reveal]` button (hero card, mystery cards, commission cards); populated with `textContent` from that button's `data-title` / `data-medium` / `data-story`. Closes via `[data-dialog-close]`, Escape, or its inquiry link (`[data-dialog-inquiry]`, an `<a href="#contact">`), which also prefills the form subject.
6. Commission form → `mailto:`; `const CONTACT_EMAIL = ""` at the top of the file. **When empty, the submit button is disabled and a status message is shown.** When set, the body/subject are built with `encodeURIComponent`.

## Technology Stack

- HTML5, CSS3 (custom properties, grid/flex, `clamp()`), vanilla JavaScript. No framework, no `package.json`, no dependencies, no tests, no CI.
- Fonts: system stacks only (`"Segoe UI"`, Georgia, Consolas); no webfonts or CDNs.
- Hosting: GitHub Pages, legacy build from `main` at `/`. `DEPLOYMENT.md` also documents Netlify and custom domains.
- **Deploy:** push to `main` → Pages rebuilds in ~1 minute. No staging. `main` is protected against force-push and deletion (PRs not required).

## File Structure

| Path | Purpose |
|---|---|
| `index.html` | Entire page content and structure |
| `css/styles.css` | All styles (~4,050 lines; see caution below) |
| `js/script.js` | All behavior; `CONTACT_EMAIL` constant at top |
| `images/charizard.jpg` | Only artwork photo currently tracked (~680 KB, no EXIF) |
| `favicon.svg` | Site icon |
| `README.md` | Overview and structure |
| `DEPLOYMENT.md` | Pages/Netlify/custom-domain steps |
| `IMAGE-GUIDE.txt` | Artwork photo naming, sizing and placement rules |

README lists `images/.gitkeep`, but it isn't tracked (README drift).

**Caution areas**
- **`css/styles.css` is layered.** Five `:root` blocks exist (lines ~1, ~1959, ~2182, ~2463, ~3167): successive redesigns were appended as overrides. The **last** one (light theme: `--primary`, `--secondary`, `--background`, `--surface`, …) wins over the earlier dark-theme variables, so editing an earlier block may have no visible effect. Check the cascade (search for the selector's last occurrence) before changing a style, and prefer editing the effective rule rather than adding another override.
- **Cache-busting:** `index.html` links `css/styles.css?v=content-focus-20261022`. Bump that query string whenever the CSS changes or visitors may see stale styles.
- Section IDs are referenced by nav links and the `IntersectionObserver`; renaming one breaks nav highlighting.
- `CONTACT_EMAIL`: setting it publishes that address in the public repo and on the site.

## Development Principles

- **Simplicity first; maintainability over cleverness.** Plain HTML/CSS/JS the owner can understand.
- **Minimize dependencies:** none today; keep it that way.
- **Mobile-first:** design for ~375px first. Existing breakpoints: 68rem, 54rem, 38rem, plus `@media (hover: none)`.
- **Accessibility (required):** skip link (`.skip-link` → `#main`); visible `:focus-visible` outline; `aria-current` on nav; `<dialog>` with `aria-labelledby`; form status in `role="status"`; honor `prefers-reduced-motion`; keep text contrast at WCAG AA (recent commits specifically improved button/active-link contrast, so don't regress it); keep fallbacks when an image is missing.
- **Performance:** images ≤ ~300 KB each; hero `fetchpriority="high"`, all others `loading="lazy" decoding="async"`.

## Coding Standards

- **Naming:** lowercase kebab-case CSS classes; BEM-like state classes (`is-current`, `is-loaded`, `has-artwork`); JS hooks are `data-*` attributes (`data-artwork-image`, `data-reveal-dialog`, `data-form-status`), camelCase JS identifiers, UPPER_SNAKE_CASE constants.
- **Organization:** content in HTML, presentation in CSS, behavior in JS; no inline styles or inline event handlers. Use the existing CSS variables (`--gold`, `--blue`, `--primary`, `--secondary`, `--serif`, `--mono`, `--gutter`, `--page-width`, …) instead of hard-coded colors where possible.
- **Component structure:** a "component" is a section/block of semantic HTML with a class prefix (e.g. `.technique-*`, `.specimen-*`). Put its CSS in one contiguous block.
- **DOM updates:** `textContent` / `setAttribute` / `classList`. **No `innerHTML`, `outerHTML`, `insertAdjacentHTML`, `document.write`, `eval`** (none used today).
- **Error handling:** fail soft and visibly: missing image → CSS placeholder; missing `CONTACT_EMAIL` → disabled button + message; never throw into the page.
- **Logging:** none (no `console.*` calls). Don't add.
- **Images:** `alt=""` is acceptable only when the adjacent button/caption already names the artwork; otherwise write real alt text.

## Security Rules

- **Never expose secrets / commit credentials.** The site needs none. No API keys, form-service tokens, or tracking IDs in the repo; the repo is public. If a form backend is ever requested, use a provider that needs no secret in client code and get explicit approval first.
- **Sanitize user input:** the only input is the commission form. It must stay `mailto:`-only with `encodeURIComponent`. Never insert user text via `innerHTML`.
- **Least privilege:** no new browser permissions, cookies, localStorage trackers, or third-party scripts/fonts/CDNs. If a third-party resource is unavoidable, pin the version and add Subresource Integrity.
- **Photos:** before committing any new artwork image, strip EXIF/GPS metadata (re-export or use a metadata remover). A public repo + phone photos can leak location. Don't commit client names or private commission details.
- **Contact email** (when added to `CONTACT_EMAIL`) becomes public and scrapeable; the owner should use a dedicated address.
- **Document any new risk** in this file and the commit message.
- GitHub secret scanning, push protection, and Dependabot alerts are enabled on the repo.

## Agent Workflows

1. **Understand** the existing implementation: read the relevant `index.html` section, then its CSS (all occurrences, because of layering), then the JS hook.
2. **Reuse** existing patterns (data-attribute hooks, existing variables/classes, existing section markup).
3. **Minimize scope:** don't reformat `styles.css` or redesign sections unasked.
4. **Explain tradeoffs** when more than one approach is reasonable.
5. **Identify risks before coding:** cascade conflicts, contrast, mobile layout, image weight, privacy.
6. **List impacted files** in your summary, and remember the CSS cache-bust bump.
7. Verify (see Testing) then commit with a descriptive message; include the trailer `Co-authored-by: Copilot App <223556219+Copilot@users.noreply.github.com>` when committing via that tool.

## Agent Constraints

- No new frameworks, build tools, or dependencies without an explicit explanation and approval.
- Prefer editing existing markup/rules over rewriting sections. No premature optimization.
- Preserve the single-page, static, no-backend architecture unless instructed otherwise.
- Don't add official Pokémon/Nintendo assets, logos, fonts, or card templates. Keep a fan-inspired, original-artwork stance.
- When adding artwork, follow `IMAGE-GUIDE.txt`. Exact lowercase filenames, JPG, ~300 KB or less. Pending: `pikachu.jpg`, `gengar.jpg`, `custom-familiar.jpg`, `fantasy-relic.jpg`, `midnight-continue.jpg`. For each, add an `<img data-artwork-image>` **before** the container's fallback span in `index.html`. Charizard, Pikachu and Gengar appear in both the featured collection and the mystery gallery, so add the `<img>` in both places. Use `loading="lazy" decoding="async"` for everything except the hero.

## Testing Expectations

No automated tests. Verify manually (serve with `python -m http.server` or open `index.html`; there is nothing to install):

1. Page loads without console errors; every nav link scrolls to its section and highlights correctly.
2. Mobile (~375px): menu opens/closes (button, Escape, outside click); no horizontal scroll; text doesn't overflow.
3. Reveal dialog opens from every `[data-art-reveal]` item (hero, gallery, commission cards), shows the right title/medium/story, closes with Escape and its close button, and its inquiry link jumps to `#contact` with the form subject prefilled.
4. Commission form: with empty `CONTACT_EMAIL`, the button is disabled with a message; with a test address, the `mailto:` opens with the correct, encoded subject/body. Check special characters (`&`, `?`, `#`, accents, emoji, line breaks).
5. Missing image: rename a file temporarily; the placeholder must remain, with no broken-image icon.
6. Keyboard-only pass (skip link, tab order, visible focus, dialog focus handling) and `prefers-reduced-motion`.
7. Contrast check on any color change (AA: 4.5:1 body text, 3:1 large text/UI).
8. After CSS changes: confirm the `?v=` cache-bust was bumped.

## Future Improvements / Known Technical Debt

- **CSS consolidation** (biggest debt): collapse the five stacked `:root` blocks and the override layers into one coherent light-theme stylesheet, with section comments. Do this as its own change, with before/after screenshots, not mixed with features.
- Replace the manual `?v=` cache-buster with something less error-prone (or document it in `DEPLOYMENT.md`).
- Five artwork placeholders await real photos (see Agent Constraints).
- `CONTACT_EMAIL` is empty, so the form is inert until the owner picks a public address.
- README structure list drifts from the repo (`images/.gitkeep`).
- No tests or CI; a small HTML validation/link-check Action would be cheap.
- No Content-Security-Policy (only possible via `<meta>` on Pages), and no Open Graph / social-preview tags or sitemap, which would help SEO and link sharing.
- Consider real alt text for the featured images instead of `alt=""`.
