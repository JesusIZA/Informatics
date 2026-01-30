# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

A static HTML/CSS/JS web application in Ukrainian serving as a navigation portal for computer science students (grades 5-9) to access educational materials on Google Drive, plus interactive training games.

## Architecture

- **Multi-page application**: Separate HTML files for each page
- **External CSS**: Main styles in `styles.css` (shared across pages), game-specific styles in game folders
- **JavaScript**: Used only in games (vanilla JS, no frameworks)
- **No build system**: Open directly in browser or deploy to any static hosting
- **External dependency**: Google Fonts "Inter" loaded via CDN

## Development

To view/test changes, open `index.html` directly in a web browser. No build, compilation, or server required.

## Structure

```
├── index.html                      # Main page - class selection
├── rules.html                      # Rules page - classroom behavior rules
├── games.html                      # Games hub - list of training games
├── styles.css                      # Shared styles for all pages
├── games/
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
- Matrix animation (falling binary code effect)
- Floating shapes (animated background elements)
- Container (`.container`, `.container.wide`)
- Animations (keyframes)
- Page-specific components (class buttons, rules sections, game cards)
- Media queries (responsive design, reduced motion)

### index.html
- Main navigation page with class buttons
- Links to Google Drive folders for each class (protected by access codes)
- Access codes loaded from Google Sheets CSV at runtime
- Modal dialog for code entry with validation
- Portal animation on successful authentication
- Link to rules page
- Link to games page

### rules.html
- Classroom behavior rules organized in 4 sections
- Uses `.container.wide` and `h1.rules-title` modifiers
- Back button to return to main page

### games.html
- Games hub page with categorized game cards
- Categories: Mouse, Keyboard, Logic, External resources
- Uses `.container.wide` layout
- Cards with `.coming-soon` class are disabled

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
- **Access codes**: Loaded from published Google Sheets CSV, can be changed without redeployment
- Responsive design: 2-column grid on desktop, single column on mobile (<500px)
- 8 classes served: 5-В, 6-А, 6-Б, 6-В, 7-Б, 8-Г, 9-Б, 9-В
- Accessibility: supports `prefers-reduced-motion`

## Access Code System

- Codes stored in Google Sheets (published as CSV)
- CSV URL configured in `index.html` → `CODES_URL` constant
- Format: `Клас,Код` (header row, then data rows)
- Codes fetched on page load via `fetch()` API
- Modal prompts for code when class button clicked
- Portal animation displays on successful code entry

## CSS Modifiers

- `.container.wide` - wider container (700px vs 550px)
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
