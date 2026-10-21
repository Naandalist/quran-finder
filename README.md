# Cari Ayat

[![React Native](https://img.shields.io/github/package-json/dependency-version/Naandalist/quran-finder/react-native?logo=react&logoColor=61DAFB)](https://reactnative.dev)
[![React](https://img.shields.io/github/package-json/dependency-version/Naandalist/quran-finder/react?logo=react&logoColor=61DAFB)](https://react.dev)
[![Astro](https://img.shields.io/github/package-json/dependency-version/Naandalist/quran-finder/astro?filename=website%2Fpackage.json&logo=astro&logoColor=white&color=FF5D01)](https://astro.build)
[![Website](https://img.shields.io/github/actions/workflow/status/Naandalist/quran-finder/pages.yml?branch=main&label=website)](https://github.com/Naandalist/quran-finder/actions/workflows/pages.yml)
[![Google Play](https://img.shields.io/badge/Google_Play-Cari_Ayat-3DDC84?logo=googleplay&logoColor=white)](https://play.google.com/store/apps/details?id=com.naandalist.quran_finder)

Find Qur’an verses from a latin *lafaz* or an Indonesian translation keyword, even when the spelling is off.

This repository holds the Android app and its landing page.

| Path | What it is | Stack |
| --- | --- | --- |
| Repo root | App (`com.naandalist.quran_finder`) | React Native, React, SQLite, Google AdMob |
| [`website/`](./website) | Landing at [cariayat.naandalist.com](https://cariayat.naandalist.com) | Astro, React, Tailwind |

Play: [Cari Ayat on Google Play](https://play.google.com/store/apps/details?id=com.naandalist.quran_finder). Contact: [dev@naandalist.com](mailto:dev@naandalist.com).

## Develop the app

Requires Node.js 20+, JDK 17, Android SDK, and [React Native environment setup](https://reactnative.dev/docs/set-up-your-environment). Lockfile is `package-lock.json`. Use npm with `--legacy-peer-deps` (the app is not a Yarn project).

```bash
cp .env.example .env
npm install --legacy-peer-deps
npm start
```

In another terminal:

```bash
npm run android
```

Fill `.env` with AdMob app and unit IDs. Leave keys empty to skip ads. Restart Metro with `--reset-cache` after changing `.env` or Babel env config.

| Script | What it does |
| --- | --- |
| `npm start` | Metro |
| `npm run android` / `npm run ios` | Dev build on a device or emulator |
| `npm test` | Jest |
| `npm run lint` | ESLint |
| `npm run build:quran-db` | Rebuild bundled `quran.sqlite` |
| `npm run build:apk` | Gradle `assembleRelease` |
| `npm run build:aab` | Gradle `bundleRelease` |
| `npm run android:clean` | Gradle `clean` |

AAB output: `android/app/build/outputs/bundle/release/app-release.aab`. If `:app:packageReleaseBundle` fails with Metaspace, stop daemons (`cd android && ./gradlew --stop`) and rebuild; `android/gradle.properties` already raises heap and metaspace.

`website/` is a separate npm project. Metro ignores it.

## Ads

`react-native-google-mobile-ads` (16.5.x). Consent (UMP) runs before SDK init. Keys in `.env`:

```
ADMOB_ANDROID_APP_ID=
ADMOB_IOS_APP_ID=
ADMOB_NATIVE_UNIT_ID=
ADMOB_BANNER_UNIT_ID=
```

Do not commit `.env`. Do not put production unit IDs in source. Android App ID is applied from `.env` into the merged manifest; a native rebuild is required after changing it.

`com.google.android.gms.permission.AD_ID` is merged from the ads SDK. Play Console Advertising ID: **Yes**, purpose **Advertising or marketing** only.

## Website

Astro 5 + React + Tailwind 3. Pages: home, [privacy](https://cariayat.naandalist.com/privacy/), [terms](https://cariayat.naandalist.com/terms/). `app-ads.txt` is served from `website/public/`.

```bash
cd website
npm install --legacy-peer-deps
npm run dev
npm run build
```

Output is `website/dist`. GitHub Actions (`.github/workflows/pages.yml`) deploys that folder to GitHub Pages on push to `main` when `website/**` or the workflow file changes.

## Layout

```
src/app/           App root, database provider, navigation
src/screens/       Home, results, history
src/components/    Shared UI
src/lib/           Search, SQLite, storage, theme, ads
android/           Native Android project
ios/               Native iOS project
website/           Public landing, privacy, terms
tools/             Quran DB build script
```
