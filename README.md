# Dialog Lab — Eleventy + Tailwind + Alpine.js

Static site built with [Eleventy](https://www.11ty.dev/), styled with
[Tailwind CSS v4](https://tailwindcss.com/), and made interactive with
[Alpine.js](https://alpinejs.dev/) — no build step needed for Alpine (loaded via CDN),
Tailwind compiles to a single CSS file at build time.

## Project structure

```
dialoglab-11ty/
├── .eleventy.js              ← Eleventy config
├── tailwind/
│   └── input.css              ← Tailwind entry point + theme (brand color, font)
├── package.json
└── src/
    ├── _includes/
    │   └── base.njk            ← shared layout: <head>, Alpine CDN script, page shell
    ├── _data/
    │   └── site.json           ← domain, GA id, PostHog id
    ├── index.njk                ← homepage: markup + Alpine components inline
    └── assets/
        ├── css/style.css        ← compiled Tailwind output (generated, don't hand-edit)
        └── images/               ← put your image files here (see below)
```

## Why this stack

- **Tailwind** replaces the ~800 lines of Carrd-generated CSS with utility classes
  written directly in the template — one file to scan, easy to restyle without hunting
  through a stylesheet.
- **Alpine.js** replaces the hand-rolled vanilla JS from the previous version. The two
  carousels and the signup form are now self-contained `x-data` components living right
  in `index.njk` — no more separate iframe'd HTML files or a `main.js` to keep in sync.
- **Eleventy** still provides the page/layout structure, so adding a second page is
  just a new `.njk` file with the same `layout: base.njk` front matter.

## What's now Alpine-driven

- **Topic carousel** — cycles through images with a fade/scale transition, driven by
  `x-data` + `setInterval` (previously an iframe with its own `<script>`).
- **Chat demo** — reveals chat bubbles one at a time then resets, driven by a small
  `cycle()` method in `x-data`.
- **Signup form** — `status` (`idle` / `loading` / `success` / `error`) drives the UI:
  disables the button while sending, swaps to a thank-you message on success, and
  shows the server's error message on failure. Submission goes through `fetch()` to
  whatever URL is in the form's `action` attribute.

## Local development

```bash
npm install
npm run dev      # Tailwind watch + Eleventy serve, both running together
```

## Building for production

```bash
npm run build      # compiles Tailwind, then runs Eleventy
```

Output goes to `_site/` — that folder is your entire deployable site.

## Before deploying

1. **Add your images** to `src/assets/images/`: `bg.jpg`, `favicon.png`,
   `apple-touch-icon.png`, `image01.svg`, `image03.svg`. These weren't included in the
   original export you gave me, so a few `<img>` tags and the page background
   currently point at files that don't exist yet.

2. **Wire up the signup form.** It currently posts to a placeholder in `src/index.njk`:
   ```html
   action="https://formspree.io/f/YOUR_FORM_ID"
   ```
   Sign up at [Formspree](https://formspree.io) (or Netlify Forms, Getform, etc.),
   grab your real endpoint, and swap it in.

3. Analytics (Google Analytics + PostHog) are wired with your original IDs in
   `src/_data/site.json` — no changes needed there.

## Deploying

Any static host works:

- **Netlify** — build command `npm run build`, publish directory `_site`.
- **Cloudflare Pages / Vercel** — same: build command `npm run build`, output
  directory `_site`.

Then point your domain (`joindialoglab.com`) at the new host via your registrar's DNS.

## Adding more pages later

Create `src/about.njk`:

```md
---
layout: base.njk
title: About
---
<h1 class="text-[2em]">About Dialog Lab</h1>
<p class="text-[1.25em] mt-4">Your content here...</p>
```

It builds to `/about/` and automatically gets the same header, Tailwind styles, and
Alpine script as the homepage.

## Customizing the look

Brand color and font live in `tailwind/input.css`:

```css
@theme {
  --font-sans: "Montserrat", sans-serif;
  --color-brand: #4F1658;
  --color-brand-dark: #3E0946;
}
```

Change these and every `text-brand`, `bg-brand`, `border-brand`, and `font-sans` class
across the site updates automatically on the next build.
