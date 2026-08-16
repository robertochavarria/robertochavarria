# Roberto Chavarria

Production source for [robertochavarria.com](https://robertochavarria.com), Roberto Chavarria’s personal umbrella site.

The site introduces Roberto holistically, provides the parent context for his two practices—[Emerging Clarity](https://emergingclarity.com) and [Clearly Audacious](https://clearlyaudacious.com)—and briefly names the other organizations and work he helps carry.

## Structure

- `index.html` — single-page site
- `styles.css` — shared responsive design system
- `site.js` — mobile navigation, header state, and progressive reveal behavior
- `assets/` — production photography, favicon, and social image
- `CNAME` — GitHub Pages custom domain
- `robots.txt` and `sitemap.xml` — search-engine discovery

There is intentionally no empty writing or video section. The information architecture can accept those sections later when real material exists.

## Local preview

```bash
python3 -m http.server 4174
```

Open <http://127.0.0.1:4174>.

## Deployment

GitHub Pages publishes the `main` branch of `robertochavarria/robertochavarria` to the custom domain in `CNAME`.

## Design system

- Warm personal paper palette with rust as Roberto’s identifying accent
- Deep green, Emerging Clarity teal, and Clearly Audacious navy used as related but distinct voices
- Newsreader display type, Hanken Grotesk body type, and IBM Plex Mono labels
- Converging-path line motif representing distinct forms of work meeting in one life
- Responsive navigation and layout down to 320px
- Motion respects `prefers-reduced-motion`

## Release checks

1. Validate the document and local references.
2. Confirm all links and images load.
3. Test keyboard navigation and the mobile menu.
4. Check 1440px, 1024px, 768px, 390px, 360px, and 320px widths for overflow and awkward wraps.
5. Run serious/critical accessibility checks.
6. Visually inspect the full page on desktop and mobile.
7. Verify GitHub Pages for the exact deployed commit and then verify the custom domain.
