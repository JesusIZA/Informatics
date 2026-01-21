# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

A static HTML/CSS web application in Ukrainian serving as a navigation portal for computer science students (grades 5-9) to access educational materials on Google Drive.

## Architecture

- **Single-file application**: All code lives in `index.html` (HTML + inline CSS)
- **No JavaScript**: Pure HTML/CSS with external links
- **No build system**: Open directly in browser or deploy to any static hosting
- **External dependency**: Google Fonts "Inter" loaded via CDN

## Development

To view/test changes, open `index.html` directly in a web browser. No build, compilation, or server required.

## Structure

- `index.html` - Complete application (markup + styles)
- `README.md` - Project documentation (Ukrainian)

## Key Details

- Language: Ukrainian (`lang="uk"`)
- Each class button links to a hardcoded Google Drive folder URL
- Responsive design: 2-column grid on desktop, single column on mobile (<400px)
- 8 classes served: 5-В, 6-А, 6-Б, 6-В, 7-Б, 8-Г, 9-Б, 9-В
