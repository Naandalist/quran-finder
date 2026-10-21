# Cari Ayat website

Static landing page for the Cari Ayat app: home, privacy policy, and terms. Astro builds plain HTML for GitHub Pages. The React Native app in the repo root is a separate Yarn project.

```bash
cd website
yarn install
yarn dev
```

Production check:

```bash
yarn build
yarn preview
```

Output is `website/dist`. GitHub Actions (`.github/workflows/pages.yml`) publishes that folder. The intended address is `https://cariayat.naandalist.com`. DNS needs a `CNAME` from `cariayat` to `naandalist.github.io` (Cloudflare proxy off), and the repo Pages source must be GitHub Actions.

Privacy policy URL for Play: `https://cariayat.naandalist.com/privacy/`.

## SEO

The shared layout renders canonical URLs, descriptions, Open Graph and Twitter metadata in static HTML. The home page includes MobileApplication JSON-LD based on the visible app information; no unverified ratings are published. The 404 page uses `noindex`.

Canonical URLs use trailing slashes. Update `src/pages/sitemap.xml.ts` when adding indexable pages. `public/robots.txt` points to that sitemap. Keep Markdown source in `src/content/` so Astro does not publish duplicate pages under `/content/`.

After deployment, submit `https://cariayat.naandalist.com/sitemap.xml` in Google Search Console and inspect the home page URL. Validate structured data in Schema Markup Validator. These checks require the deployed site; a local build does not establish indexing or ranking.
