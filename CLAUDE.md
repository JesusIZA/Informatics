# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

A static HTML/CSS/JS web application in Ukrainian serving as a navigation portal for computer science students (grades 5-9) to access educational materials on Google Drive, plus interactive training games.

## Architecture

- **Multi-page application**: Separate HTML files for each page
- **External CSS**: Main styles in `styles.css` (shared across pages), game-specific styles in game folders
- **JavaScript**: vanilla, no frameworks. Games have their own scripts; main pages load `theme-init.js` (in `<head>`, applies the saved theme before first paint) and `background.js` (themes, theme switcher, logo letters, background stickers)
- **No build system**: Open directly in browser or deploy to any static hosting
- **External dependency**: Google Fonts via CDN — "Balsamiq Sans" (headings, buttons), "Nunito" (body), "Inter" (still referenced inside game stylesheets)
- **Visual theme ("Candy Pop")**: light pastel background, white cards with 3px dark outline and a hard offset shadow that "presses" on click, playful colors per class button. Game pages (`games/*/`) keep the original dark theme via a `body:has(.game-container)` override block in `styles.css`, because their own stylesheets assume a dark background and white text.
- **Theme system (age levels)**: `data-theme` attribute on `<html>` switches the whole look. Registry lives in `background.js` (`THEMES`): each theme has a label/icon for the switcher, a sticker pool, sticker counts per breakpoint, an animation-duration multiplier and the `grades` it is auto-applied for. CSS side: a `html[data-theme="<name>"]` block in `styles.css` overrides the `:root` variables (`--ink` outlines, `--text`/`--text-soft` text, `--paper` cards, `--bg-*`, palette) plus a few component tweaks. Text color must use `--text`, never `--ink` (that is for outlines/shadows) so dark themes work.
  - `candy` — level 1, grades 5-6. It is the CSS base (rules without a `html[data-theme]` prefix), so `data-theme="candy"` simply matches no override block.
  - Default theme is `retro` (`DEFAULT_THEME` in both `theme-init.js` and `background.js`); `<html>` always carries a `data-theme` attribute after init.
  - `retro` — level 3, grades 8-9: 8-bit game look. Dark purple background with a pixel grid and faint CRT scanlines; fonts `Press Start 2P` (headings/buttons, has Cyrillic, single weight, used at small sizes) + `IBM Plex Mono` (body). Zero border-radius everywhere, 3px frames, hard offset "pixel" shadows (`--px-shadow: 5px 5px 0 var(--ink)`), hover moves the element up-left and grows the shadow, active moves it down-right; class buttons are solid console-palette fills with dark text; logo letters cycle 4 colors with a 4px hard shadow; the rainbow bar is made of color blocks; "Ігри-тренажери" gets a blinking ▶ cursor; sticker/logo animations run in `steps()` for a frame-by-frame feel; 14 gaming stickers rendered as real pixel art: `pixelate: 18` in the theme makes `background.js` draw each emoji on an 18×18 canvas and insert it as an `<img>` scaled up with `image-rendering: pixelated` (`.sticker-pixel`), no rotation. The same `pixelEmoji()` is applied by `applyPixelIcons()` to UI emoji (`.game-icon` on games.html, `.success-icon` on index.html) — original glyph kept in `data-emoji` and restored when switching to a non-pixel theme.
  - Palette discipline (user request 2026-09-17): only `candy` is multicolored. `cosmos` stays in a cold cyan → blue → violet range (class buttons: column 1 cyan shades, column 2 blue, column 3 violet, darker downwards; logo letters fade cyan→violet; the only warm color is `--coral` for "forbidden"/errors). `retro` uses a strict 3-color arcade palette — magenta `#ff3fd2`, cyan `#00e5ff`, yellow `#ffe14d` — plus white and the dark background (class buttons: one color per column in three shades; logo cycles the three colors; rainbow bar = three color blocks). Do not add new hues to these two themes.
  - `cosmos` — level 2, grade 7: dark navy space, two star layers instead of polka dots, neon 3-color logo with pure glow (no stroke/hard shadow), 16 space stickers with 1.6× slower animations. Components use a HUD ("cockpit panel") language that matches the squared Russo One font: 3px radius, 1px neon outline, 3px solid accent bar on the left edge, L-shaped corner brackets (`::before` top-right / `::after` bottom-right), dark frosted-glass fill (`--hud-bg` + `backdrop-filter`). Every button/panel takes its accent as an RGB triplet in `--c` (per class button, per rules section, per game category); neutral panels use `--hud-line`. Hover = brighter fill + stronger glow + 2px lift, no tilt. Category titles are uppercase outlined tags; list bullets are glowing rotated squares. Rounded pills, gradients and thick borders are avoided in this theme. Own fonts via `--font-head: 'Russo One'` (single weight 400 — the theme forces `font-weight: 400` on heading/button elements to avoid faux bold) and `--font-body: 'Exo 2'`; both have Cyrillic. All theme fonts are loaded from one Google Fonts link in the three main pages.
  - Switcher: buttons fixed top-right (`.theme-switcher`, built by JS on the three main pages, not in games). Icons are drawn in the style of the ACTIVE theme (`iconStyle`): `sticker` = emoji (candy), `line` = thin-stroke inline SVG (cosmos), `pixel` = blocky SVG with `shape-rendering: crispEdges` (retro). All three variants for every theme live in `ICONS` in `background.js`; `updateSwitcher()` re-renders them on theme change. The active button is intentionally understated in every theme (pressed offset + faint neutral ring, no bright glow) — the user found a strong highlight distracting. Manual choice is saved in `localStorage["siteTheme"]` as `{theme}` permanently per browser (older `{theme, day}` records are still read, the day is ignored).
  - Themes switch ONLY via the switcher. An earlier "auto-hint" (clicking a class button previewed the theme for that grade) was removed on 2026-09-17 because it felt like the site changed on its own — do not reintroduce it. `grades` in the registry is informational only.

## Development

To view/test changes, open `index.html` directly in a web browser. No build, compilation, or server required.

## Structure

```
├── index.html                      # Main page - class selection
├── rules.html                      # Rules page - classroom behavior rules
├── games.html                      # Games hub - list of training games
├── styles.css                      # Shared styles for all pages (+ theme blocks)
├── background.js                   # Themes, switcher, logo letters, background stickers
├── theme-init.js                   # Applies saved theme before first paint
├── games/
│   ├── Skhodynky_Setup.exe         # Installer of "Сходинки до інформатики" (downloadable from games.html)
│   ├── mouse-click/                # "Лопни кульку" game
│   │   ├── index.html
│   │   ├── styles.css
│   │   └── script.js
│   ├── keyboard-letters/           # "Знайди літеру" game
│   │   ├── index.html
│   │   ├── styles.css
│   │   └── script.js
│   ├── keyboard-typing/            # "Набери слово" game
│   │   ├── index.html
│   │   ├── styles.css
│   │   └── script.js
│   ├── memory-pairs/               # "Знайди пару" game
│   │   ├── index.html
│   │   ├── styles.css
│   │   └── script.js
│   └── mouse-drag/                 # "Перетягни предмет" game
│       ├── index.html
│       ├── styles.css
│       └── script.js
├── docs/
│   └── project-analytics.md        # Project analytics and statistics
├── CLAUDE.md                       # AI assistant guide
└── README.md                       # Project documentation (Ukrainian)
```

## Key Files

### styles.css
Contains all CSS styles organized in sections:
- Base styles (reset, body)
- CSS custom properties (`:root`): palette (`--ink`, `--coral`, `--sky`, ...), fonts, border/shadow sizes
- Polka-dot overlay (`body::before`) on main pages
- Matrix animation (falling binary code) — hidden on main pages, shown only in games
- Background stickers: on main pages the empty `<div class="shapes">` is filled by `background.js` — the viewport is split into a grid of cells and one emoji `<span class="sticker stk-*">` is placed at a random offset inside each cell (even spread, random positions on every load; 28 on desktop, 18 tablet, 10 mobile). Position/size/tilt/duration/delay come as inline CSS variables (`--x --y --size --tilt --dur --delay`); each of the 28 emoji has its own `@keyframes stk-*` animation in `styles.css`. Game pages keep their 6 static `div.shape` styled as the original floating geometric shapes (the script exits when `.game-container` exists)
- Headings: ink-colored with a soft white halo (`text-shadow`) so they stay readable over background stickers. The main title is `<h1 class="logo">Інформатика</h1>`: `background.js` splits it into `span.logo-letter` elements (`--i` index) and CSS gives each letter its own color, tilt, pop-in delay and a gentle wave; letters bounce on hover
- Entrance animation `slideUp` uses individual `translate`/`scale` properties so it never overrides hover `transform` (hover must not swap the `animation` property, otherwise the element replays its entrance and blinks)
- Container (`.container`, `.container.wide`)
- Animations (keyframes)
- Page-specific components (class buttons, rules sections, game cards)
- Media queries (responsive design, reduced motion)

### index.html
- Main navigation page with class buttons
- Links to Google Drive folders for each class (protected by access codes)
- Access codes loaded from Google Sheets CSV at runtime
- Modal dialog for code entry with validation
- Success animation is theme-specific. The overlay holds three variant blocks (`.wipe`, `.warp`, `.pixel-loader`) plus the shared `.success-card` with 📂; each theme shows its own via `display` in `styles.css` and sets `--success-duration` on `.success-overlay`, which the inline script reads for the redirect delay. Candy: six palette stripes slide up (curtain wipe) then the card pops, 800 ms. Cosmos: hyperspace jump — two `repeating-conic-gradient` star-streak layers scale out from the center under a radial mask, then a HUD-framed card with corner brackets locks in, 1050 ms. Retro: black screen drops in 6 steps, pixel progress bar fills in 10 steps under a "ЗАВАНТАЖЕННЯ..." caption (Press Start 2P, animated dots), then the pixelated folder card pops, 1450 ms.
- Link to rules page
- Link to games page

### rules.html
- Classroom behavior rules organized in 4 sections
- Uses `.container.wide` and `h1.rules-title` modifiers
- Back button to return to main page

### games.html
- Games hub page with categorized game cards
- Categories: Mouse, Keyboard, Logic, "Завантажити на комп'ютер" (external)
- Uses `.container.wide` layout
- Cards with `.coming-soon` class are disabled
- External card (`.game-card-external`) downloads the "Сходинки до інформатики" game installer, hosted in the repo itself as `games/Skhodynky_Setup.exe` (~33 MB, served by GitHub Pages; bare `download` attribute, the saved file keeps the Latin name on purpose). The installer is unsigned, so Windows SmartScreen shows "Windows protected your PC" on first run — that cannot be fixed from the website, only by code-signing the installer. Google Drive hosting was abandoned: for signed-in users Drive always shows a slow "couldn't scan for viruses / download anyway" interstitial for .exe files, even with `confirm=t`

## Games

### Mouse Click Game (`games/mouse-click/`)
- Pop balloons by clicking them
- 3 difficulty levels (easy, medium, hard)
- Types: normal (+1), golden (+5), bomb (-1 life), time bonus (+5 sec)
- 60 seconds gameplay, 3 lives
- High scores saved in localStorage (`balloonGameRecords`)

### Keyboard Letters Game (`games/keyboard-letters/`)
- Press correct keys as letters appear on screen
- 5 difficulty levels (beginner, easy, medium, hard, expert)
- Ukrainian alphabet (а-я, А-Я) + digits + symbols
- Letter types: normal (+1), golden (+5), fast (+3), time bonus (+5 sec)
- Combo system: 5+ streak = x2, 10+ = x3, 15+ = x4 multiplier
- Timer ring shows remaining time for each letter
- High scores saved in localStorage (`keyboardLettersRecords`)

### Keyboard Typing Game (`games/keyboard-typing/`)
- Type complete Ukrainian words as they appear
- 3 difficulty levels:
  - Easy (3-5 letter words, 12s per word, 1 word max)
  - Medium (4-7 letter words, 10s per word, 2 words max)
  - Hard (5-10 letter words, 9s per word, 2 words max)
- Word types: normal (×1), golden (×2), fast (×1.5, ×0.6 time), time bonus (+5 sec)
- Each letter in word highlighted as typed (current letter pulses)
- Golden words glow, fast words pulse when active
- 3 errors per word = word skipped, lose life
- Combo system: 3+ streak = ×1.5, 6+ = ×2, 10+ = ×3
- Stats: words completed, characters typed, accuracy %, speed (chars/min)
- ~340 Ukrainian words dictionary built-in
- High scores saved in localStorage (`keyboardTypingRecords`)

### Memory Pairs Game (`games/memory-pairs/`)
- Classic memory card matching game
- 3 difficulty levels with different grid sizes:
  - Easy (3×4, 6 pairs, 80s)
  - Medium (4×4, 8 pairs, 100s)
  - Hard (4×5, 10 pairs, 120s)
- Card themes: animals, food, transport (emoji)
- 3D flip animation for cards
- Scoring: base points (10) + speed bonus (+5 if <3s) × combo multiplier
- Combo system: 2+ streak = ×1.5, 3+ = ×2, 5+ = ×3
- Time bonus for remaining seconds on win
- High scores saved in localStorage (`memoryPairsRecords`)

### Mouse Drag Game (`games/mouse-drag/`)
- Drag and drop sorting game
- 3 difficulty levels with different themes:
  - Easy: Fruits vs Vegetables (2 categories, 8 items, 80s) — pool: 16+16 items
  - Medium: Animals by habitat - Farm/Forest/Water (3 categories, 12 items, 100s) — pool: 13+17+17 items
  - Hard: Seasons - Winter/Spring/Summer/Autumn (4 categories, 16 items, 120s) — pool: 12+11+11+12 items
- Drag items to correct category zones
- Touch support for mobile devices
- Scoring: base points × combo multiplier + streak bonus
- Combo system: 3+ streak = ×1.5, 5+ = ×2, 8+ = ×3
- Time bonus for remaining seconds on win
- High scores saved in localStorage (`mouseDragRecords`)

### Mouse Aim Game (`games/mouse-aim/`)
- Click targets to score points based on accuracy
- 3 difficulty levels:
  - Easy (4s per target, 2 max targets, size 80-100px)
  - Medium (3s per target, 3 max targets, size 60-80px)
  - Hard (2s per target, 4 max targets, size 45-60px)
- Target zones: outer (1pt), middle (2pt), bullseye (5pt)
- Target types: normal, golden (×2 points), fast (×0.6 time), time bonus (+5 sec)
- Combo system: 5+ streak = ×2, 10+ = ×3, 15+ = ×4
- 60 seconds gameplay, 3 lives
- High scores saved in localStorage (`mouseAimRecords`)

## Key Details

- Language: Ukrainian (`lang="uk"`)
- Each class button links to a hardcoded Google Drive folder URL
- **Access codes**: Loaded at runtime as CSV from a shared Google Sheet (export URL), can be changed without redeployment
- Responsive design: 3-column grid of class buttons filled column-wise (one column per grade: 5th, 6th, others); smaller padding/font on mobile (<500px)
- 9 classes served: 5-А, 5-Б, 5-В, 6-А, 6-Б, 6-В, 7-В, 8-Б, 9-Б
- Accessibility: supports `prefers-reduced-motion`

## Access Code System

- Codes stored in a Google Sheet shared as "anyone with the link can view" (no "publish to web" needed)
- Sheet: https://docs.google.com/spreadsheets/d/1pF5NQbIy92UI_4gsGXKDy6Q2jF1u7FWG2WAxmIqBHrQ/edit — configured via `SHEET_ID` / `SHEET_GID` constants in `index.html`
- Loaded via Google Visualization API as JSONP (`gviz/tq?tqx=out:json;responseHandler:onCodesLoaded`, injected `<script>` tag), not `fetch()`: Google omits CORS headers on the redirect when the page is opened from `file://` (origin `null`), so plain fetch fails locally. JSONP works both on GitHub Pages and from a local file.
- Column A = class name, column B = code; the formatted cell value (`f`) is used so codes keep leading zeros
- Format: `Клас,Код` (header row, then data rows)
- Codes fetched on page load via `fetch()` API
- Modal prompts for code when class button clicked
- Curtain-wipe + folder animation displays on successful code entry, redirect after 800 ms

## CSS Modifiers

- `.container.wide` - same 700px max-width as `.container` (kept for rules/games pages; base container was widened from 550px to 700px)
- `h1.rules-title` - smaller title with more bottom margin
- `.game-card.coming-soon` - disabled game card with "Скоро" badge

## Game Development Patterns

### Common game structure:
```
games/[game-name]/
├── index.html      # Game page with screens (menu, game, pause, result)
├── styles.css      # Game-specific styles (imports ../../styles.css)
└── script.js       # Game logic (difficulty config, game loop, localStorage)
```

### Game screens:
1. **Menu** - difficulty selection, records display, back button
2. **Game** - HUD (score, time, lives), game area
3. **Pause overlay** - resume/quit buttons (Escape key)
4. **Result** - final score, stats, new record indicator, play again button

### localStorage keys:
- `balloonGameRecords` - mouse click game records
- `mouseAimRecords` - mouse aim game records
- `mouseDragRecords` - mouse drag game records
- `keyboardLettersRecords` - keyboard letters game records
- `keyboardTypingRecords` - keyboard typing game records
- `memoryPairsRecords` - memory pairs game records

## Ideas Backlog

### Age-level themes (2026-09-17: theme system + level 2 "cosmos" + level 3 "retro" done; optional level-1 sibling "ocean" and a "minimal" variant still open)
Original mood-based idea below; it evolved into age levels named by style, not by age.
Let a student pick a "mood" on the main page and switch the whole site to a matching theme.

Agreed shape:
- **Optional, not blocking**: the page opens as usual (default "Candy Pop"); a row of 4-5 large emoji "mood stickers" (near the logo or in place of the subtitle) switches the theme with a smooth transition. No separate screen, no extra step before the access code.
- **Playful labels, not an emotional scale**: e.g. "сонячний", "спокійний", "космічний", "сонний" — never "сумний"/"злий" (screens are visible to classmates).
- **Theme = palette + stickers + logo colors**, layout stays identical. Implement via a `data-theme="..."` attribute on `<body>` that overrides the `:root` CSS variables (`--bg-*`, `--coral`... `--ink`), swaps the sticker emoji pool in `background.js`, and may slow animations (e.g. "сонний"). The existing dark game theme can seed a "космічний" variant.
- **Remember the choice** in `localStorage` for the current day only (per computer), so it isn't asked again during the same lesson; no data leaves the browser.
- Keep buttons/codes/rules readable in every theme; verify all three main pages (index, rules, games) per theme with screenshots.
- Suggested first step: two themes to evaluate the feel, then extend to 4.
