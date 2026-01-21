# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

A static HTML/CSS web application in Ukrainian serving as a navigation portal for computer science students (grades 5-9) to access educational materials on Google Drive.

## Architecture

- **Multi-page application**: Separate HTML files for each page
- **External CSS**: All styles in `styles.css` (shared across pages)
- **No JavaScript**: Pure HTML/CSS with external links
- **No build system**: Open directly in browser or deploy to any static hosting
- **External dependency**: Google Fonts "Inter" loaded via CDN

## Development

To view/test changes, open `index.html` directly in a web browser. No build, compilation, or server required.

## Structure

```
├── index.html      # Main page - class selection
├── rules.html      # Rules page - classroom behavior rules
├── styles.css      # Shared styles for all pages
├── CLAUDE.md       # AI assistant guide
└── README.md       # Project documentation (Ukrainian)
```

## Key Files

### styles.css
Contains all CSS styles organized in sections:
- Base styles (reset, body)
- Matrix animation (falling binary code effect)
- Floating shapes (animated background elements)
- Container (`.container`, `.container.wide`)
- Animations (keyframes)
- Page-specific components (class buttons, rules sections, etc.)
- Media queries (responsive design, reduced motion)

### index.html
- Main navigation page with class buttons
- Links to Google Drive folders for each class
- Link to rules page

### rules.html
- Classroom behavior rules organized in 4 sections
- Uses `.container.wide` and `h1.rules-title` modifiers
- Back button to return to main page

## Key Details

- Language: Ukrainian (`lang="uk"`)
- Each class button links to a hardcoded Google Drive folder URL
- Responsive design: 2-column grid on desktop, single column on mobile (<500px)
- 8 classes served: 5-В, 6-А, 6-Б, 6-В, 7-Б, 8-Г, 9-Б, 9-В
- Accessibility: supports `prefers-reduced-motion`

## CSS Modifiers

- `.container.wide` - wider container (700px vs 550px)
- `h1.rules-title` - smaller title with more bottom margin
