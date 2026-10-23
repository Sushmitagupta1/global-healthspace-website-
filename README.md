# Global Healthspace Studio

Static marketing website for **Global Healthspace Studio Private Limited**, a healthcare
architecture, planning and engineering coordination practice in Ahmedabad, Gujarat, India.

The site is hand-built HTML, CSS and vanilla JavaScript. There is no build step, no
framework, no package manager and no runtime dependency. Upload the folder and it runs.

- Repository: `Sushmitagupta1/global-healthspace-website-`
- Domain (canonical): `https://globalhealthspaces.com/`
- CIN: U71100GJ2026PTC179252
- Registered office: 303, Gala Business Centre-1, Navrangpura, Ahmedabad, Gujarat 380009

---

## Pages

| File | Purpose |
| --- | --- |
| `index.html` | Home: positioning, services preview, selected work, approach, enquiry call to action |
| `about.html` | Practice story, values, directors' disciplines |
| `services.html` | Service lines and scope of work |
| `approach.html` | Process, from briefing to delivery |
| `projects.html` | Project index (content added only after client approval) |
| `team.html` | Multidisciplinary team and how the disciplines work together |
| `contact.html` | Studio details, enquiry form, studio information |
| `privacy.html` | Privacy policy |
| `terms.html` | Terms of use |
| `disclaimer.html` | Disclaimer |
| `404.html` | Not found page |

All pages share the same header, footer, stylesheet and script. Every page has a unique
`<title>`, meta description, Open Graph and Twitter card data, and a canonical URL.

---

## Project structure

```
.
├── index.html
├── about.html
├── services.html
├── approach.html
├── projects.html
├── team.html
├── contact.html
├── privacy.html
├── terms.html
├── disclaimer.html
├── 404.html
├── assets
│   ├── css
│   │   └── styles.css          Design system, layout, components, motion, responsive rules
│   ├── js
│   │   └── main.js             Navigation, reveal, parallax, hero media, cursor, form logic
│   ├── images
│   │   ├── ghs-logo.png        Primary logo (must stay unchanged)
│   │   ├── ghs-logo-light.png  Logo for dark backgrounds (must stay unchanged)
│   │   ├── hero-home.jpg       Default home hero image
│   │   ├── space-01.jpg        Use case photography
│   │   ├── space-02.jpg
│   │   ├── space-03.jpg
│   │   ├── hospital-bim.jpg
│   │   ├── og-image.jpg        1200 x 630 social sharing image
│   │   ├── apple-touch-icon.png
│   │   ├── icon-512.png
│   │   └── icon-512-maskable.png
│   └── media
│       ├── hero.json           Per-page hero image and video configuration
│       └── SETUP.txt           Plain-language instructions for replacing hero media
├── robots.txt
├── sitemap.xml
├── site.webmanifest
├── .htaccess                   Apache: HTTPS, compression, caching, error page
├── _headers                    Netlify / Cloudflare Pages headers
├── _redirects                  Netlify / Cloudflare Pages redirects
├── .gitattributes              Normalised line endings
└── .gitignore
```

---

## Design system

Defined once as custom properties at the top of `assets/css/styles.css`.

| Token | Value | Use |
| --- | --- | --- |
| `--burgundy` | `#5c1a2b` | Primary brand colour |
| `--burgundy-deep` | `#3c0f1c` | Headings, hover states |
| `--brass` | `#b08d57` | Accent rules, eyebrows, cursor |
| `--brass-light` | `#c9a876` | Accent on dark backgrounds |
| `--wine` | `#2a0d16` | Dark sections, footer |
| `--charcoal` | `#1c1c1a` | Body text |
| `--cream` | `#f7efe1` | Text on dark, cards |
| `--cream-page` | `#f8f1e6` | Page background |

Type: **Cormorant Garamond** for display headings, **Inter** for body and interface text.
Both are loaded from Google Fonts with `preconnect`; if the network is unavailable the
system serif and sans-serif fallbacks take over.

Motion is restrained by design: a single easing curve (`cubic-bezier(0.22, 1, 0.36, 1)`),
short travel distances, and no movement that competes with reading.

---

## Features

### Layout and navigation

- Sticky header that compresses on scroll and marks the current page.
- Mobile menu built on a native `<button>` with `aria-expanded` state and an accessible
  label, so keyboard and screen-reader use work without extra scripting.
- Skip-to-content link, visible focus states, landmark elements and one `h1` per page.
- Fluid type and spacing; verified at 320, 375, 390, 414, 768 and 1440 px with no
  horizontal overflow.

### Hero media system

Each page can show an optional full-bleed image or looping video behind its hero, without
touching any HTML. Configure `assets/media/hero.json`:

```json
{
  "image": "",
  "video": "",
  "pages": {
    "index.html": { "image": "assets/images/hero-home.jpg", "video": "" },
    "about.html": { "image": "", "video": "" }
  }
}
```

- Per-page values win; an empty per-page value falls back to the top-level value.
- `index.html` falls back to `assets/images/hero-home.jpg` if nothing is configured.
- Images are probed before use, so a missing file never leaves a blank panel.
- Videos are muted, looped, inline and start with the poster image, which also acts as the
  reduced-motion fallback. Visitors who prefer reduced motion see the still image only.
- A wine scrim and cream text treatment are applied automatically when media is present,
  including on inner pages and the 404 page.

`assets/media/SETUP.txt` explains the same steps for a non-technical editor.

### Motion layer

- Scroll progress line across the top of the page.
- Brass cursor dot with a trailing ring. The ring expands over interactive elements and
  switches to cream over dark surfaces. Disabled on touch devices and for reduced motion.
- Word-by-word masked reveal for hero and page titles, with a 2.8 s watchdog that restores
  full opacity if animation frames are throttled.
- Reveal-on-scroll for sections, subtle parallax on selected imagery, button shine, brass
  underline accents on cards, and image-frame keylines on hover.
- Every effect is wrapped in `prefers-reduced-motion` handling; the site is fully usable
  with animation switched off.

### Enquiry form

`contact.html` posts to Formspree.

1. Create the form at formspree.io.
2. Replace `FORMSPREE_FORM_ID` in the form's `action` attribute with the real ID.
3. Until that ID is present, the form validates and shows a "not connected yet" message
   instead of sending.

The form includes a honeypot field, client-side validation with inline error states, a
disabled submit state while sending, success and failure messages, and a consent checkbox.

### No public email or phone

By design, the site does not display a studio email address or telephone number anywhere:
not in page content, not in the footer, and not in structured data. Enquiries arrive
through the form. The only published contact details are the registered address, studio
hours and CIN.

### SEO and social

- Canonical URLs, unique titles and descriptions, Open Graph and Twitter cards.
- `ProfessionalService` JSON-LD on the home, team and contact pages, including address,
  area served and opening hours.
- `sitemap.xml`, `robots.txt`, `site.webmanifest`, maskable icons and a 1200 x 630
  sharing image.
- Descriptive `alt` text; decorative media marked `aria-hidden`.

### Hosting configuration

- `.htaccess` for Apache: forces HTTPS and the `www` to apex redirect, enables compression
  and long-lived caching for images, fonts and assets, and routes errors to `404.html`.
- `_headers` and `_redirects` provide the same behaviour on Netlify and Cloudflare Pages.

---

## Editing content

Text lives directly in the HTML files. Each section follows the same pattern:

- Eyebrow label: `<p class="eyebrow">`
- Section heading: `<h2 class="section-title">` or `<h3 class="cell-title">`
- Body copy: `<p class="section-lead">`, `<p class="cell-text">` or `<p>`
- Call to action: `<a class="btn ...">`

Add `reveal` to a block to have it fade and rise into view; add `reveal-delay-1` through
`reveal-delay-4` for stagger.

### Replacing images

Drop the new file into `assets/images/` and update the `src`. The two logo files must
remain byte-identical to the approved artwork. If a logo file is ever re-exported, bump
the version query (`?v=4`) on the logo references so browsers refresh their cache.

The hosting configuration caches CSS and JavaScript for a year. After editing
`assets/css/styles.css` or `assets/js/main.js`, add or bump a query string on the
`<link rel="stylesheet">` and `<script>` references (for example `styles.css?v=2`), or
purge the host cache, so returning visitors receive the new files.

### Changing the domain

The canonical domain appears in canonical tags, Open Graph URLs, Twitter image URLs,
`robots.txt` and `sitemap.xml`. If the domain changes, replace
`https://globalhealthspaces.com` across those files and in the JSON-LD blocks.

---

## Local preview

Any static server works. With Python installed:

```bash
python -m http.server 8000 --bind 127.0.0.1 --directory .
```

Then open `http://127.0.0.1:8000/`.

Opening the HTML files directly from disk also works, but the manifest, canonical URLs and
some browser security features behave differently over `file://`. Use a server for a
faithful preview.

Because browsers cache HTML aggressively, hard-reload (`Ctrl+Shift+R`) after content
edits, or serve with `Cache-Control: no-store` while reviewing changes.

---

## Deployment

### GitHub Pages

1. Settings, then Pages.
2. Source: Deploy from a branch.
3. Branch: `main`, folder: `/ (root)`.
4. Add a custom domain (`globalhealthspaces.com`) and enable Enforce HTTPS.

The `.htaccess` file is ignored by GitHub Pages; use the Pages custom-domain setting for
the apex and `www` behaviour.

### Netlify or Cloudflare Pages

Publish directory: repository root. `_headers` and `_redirects` are read automatically.
No build command is required.

### Traditional hosting

Upload the repository contents to the web root, keeping `.htaccess` in place. Ensure the
server serves `404.html` for missing paths and allows HTTPS.

---

## Performance and quality

- No framework, no build step, no third-party JavaScript. The only external requests are
  Google Fonts.
- Total deployed weight is roughly 2.2 MB, dominated by photography.
- Below-the-fold images use `loading="lazy"` and `decoding="async"`.
- Verified with headless Chrome at seven widths: zero horizontal overflow, zero broken
  requests, one `h1` per page, no console errors.
- Automated checks confirmed the layout and text with reduced motion forced on.

## Browser support

Current versions of Chrome, Edge, Firefox and Safari on desktop and mobile. The site is
progressive: without JavaScript, all content and links remain accessible; the enquiry form
performs a normal browser post to its configured endpoint.

## Repository notes

- `.gitattributes` normalises text files to LF so the site behaves the same on Windows,
  macOS and Linux hosting.
- `.gitignore` excludes operating system files, editor folders, logs and environment files.
- Commits should describe the change, for example
  `Update services copy and refresh hero image`.

## Repository description

> Global Healthspace Studio is a healthcare architecture, planning and engineering
> coordination practice in Ahmedabad, Gujarat, India. The static website presents services,
> approach, projects, team and contact, with a burgundy and cream identity, fully responsive
> layouts, restrained motion, SEO metadata, structured data and an enquiry form.

## Ownership

Content, photography and the Global Healthspace Studio name and logo are the property of
Global Healthspace Studio Private Limited. All rights reserved.
