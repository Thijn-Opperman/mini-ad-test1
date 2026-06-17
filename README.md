# Mini Lesson Playable Ad

A mobile-first, Duolingo-style playable ad that walks users through a short language lesson — from splash screen to three interactive exercises and a streak finale. Everything runs in the browser with no build step.

The project is **hosted on Vercel** and can also be installed as a PWA on your phone (standalone, no browser chrome).

## Live demo

**Vercel URL:** [INSERT VERCEL LINK]

Open the link above on your phone to try the full flow. On Android (Chrome) or iPhone (Safari), you can also add it to your home screen for an app-like experience.

## What it does

Users pick their languages and a topic, then complete three question types:

1. **Translate** — type a full sentence
2. **Listen** — build a sentence from a word bank after hearing audio
3. **Finish** — pick the missing word to complete a sentence

Along the way they earn XP, lose energy on wrong answers, and see progress on a level bar. After the lesson, a streak screen links out to Duolingo.

The experience is designed for portrait mobile screens and uses responsive sizing so layouts stay usable on smaller devices (e.g. iPhone 12).

## Tech stack

- **HTML, CSS, JavaScript** — single file (`index.html`), no framework or build tooling
- **Static assets** — PNG mascots and MP3 audio in `assets/`
- **PWA** — `manifest.webmanifest` + `sw.js` for installability and offline caching
- **Hosting** — [Vercel](https://vercel.com) (HTTPS, static deploy)

Typography uses **Arial Rounded MT Bold** throughout.

## Run locally

You need a simple static file server — opening `index.html` directly in the browser won't work reliably (especially for audio and the service worker).

```bash
python3 -m http.server 8080
```

Then open [http://localhost:8080](http://localhost:8080).

Alternatively, use the VS Code launch config (`.vscode/launch.json`) to open Chrome against `localhost:8080`.

## Folder structure

```
mini-ad-test1/
├── index.html              # Entire app: markup, styles, and logic
├── manifest.webmanifest    # PWA manifest (name, icons, standalone mode)
├── sw.js                   # Service worker (precache + offline assets)
├── vercel.json             # Vercel headers (SW cache control)
├── icons/                  # PWA app icons (192, 512, apple-touch)
├── assets/
│   ├── *.png               # Mascots and topic card images
│   └── audio/
│       ├── nl-en/          # Audio when UI is Dutch, learning English
│       └── en-nl/          # Audio when UI is English, learning Dutch
└── README.md
```

### Audio files

Listen exercises load MP3s from `assets/audio/` based on language pair and topic. Each folder needs these files:

`art.mp3`, `culture.mp3`, `travel.mp3`, `beginner.mp3`, `food.mp3`, `pop.mp3`

The slow-play button reuses the same file at 72% speed — no separate slow MP3 needed.

## Screen flow

| Step | Screen | Purpose |
|------|--------|---------|
| 0 | Splash | Duo eyes intro |
| 1 | Welcome | First lesson bubble |
| 2–3 | Language pick | UI language + learning language |
| 4 | Topic pick | Six topic cards |
| 5 | Translate | Open-answer exercise |
| 6 | XP result | +10 XP celebration |
| 7 | Listen | Word-bank + audio |
| 8 | Finish | Multiple-choice blank |
| 9 | Streak | Days practiced + click-out |

Screens use IDs like `screen-0`, `screen-1`, etc. State lives in a single `state` object at the bottom of `index.html`.

## Things to know before you continue

**Single-file by design.** The whole playable lives in one HTML file on purpose — fast to load, easy to hand off to ad platforms, no npm or bundler. If you split files later, keep deploy and caching in mind.

**Answer flow on exercises.** Each question gives two attempts. Close answers show yellow “Almost!” feedback. After two wrong tries, the correct answer is filled in automatically and the user can continue. Correct answers trigger a checkmark animation on the button before it switches to “Continue”.

**Energy and progress.** Wrong answers reduce energy (visualized on the battery icon). The level bar starts grey and fills green as the user advances.

**Responsive layout.** Bottom buttons and question content use `clamp()` and media queries. The listen and finish screens needed extra care for small viewports — test on real phones, not just desktop DevTools.

**PWA cache updates.** After deploying changes, bump `CACHE_VERSION` in `sw.js` so returning users get fresh assets.

**Click-out.** `exitAd()` opens [duolingo.com](https://www.duolingo.com) in a new tab. Change only that URL if a platform requires a different landing page.

**i18n.** Copy is driven by a `translations` object in `index.html` with `data-i18n` attributes on elements. UI language is set early in the flow.

## Deploying to Vercel

Push to your connected repo — Vercel serves the project as static files. No build command needed.

After deploy, update the live demo link at the top of this README.

## Quick test checklist

- [ ] Full flow runs without layout overlap on a small phone
- [ ] Progress bar and energy update correctly
- [ ] All three exercises: check → correct/wrong → continue
- [ ] Listen audio plays (normal + slow)
- [ ] PWA installs from the Vercel URL
- [ ] Final Continue opens Duolingo
