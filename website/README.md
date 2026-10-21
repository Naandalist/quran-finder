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
