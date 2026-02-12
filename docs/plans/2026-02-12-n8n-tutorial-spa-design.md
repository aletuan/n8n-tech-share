# n8n Training Tutorial SPA - Design Document

**Date:** 2026-02-12
**Type:** Single Page Application (SPA)
**Purpose:** Step-by-step n8n training tutorial for team with Anthropic styling

## Overview

A lightweight, vanilla JavaScript SPA that displays an in-depth n8n training tutorial with step-by-step navigation, syntax-highlighted code examples, and Anthropic brand styling.

## Requirements

- **Format:** Step-by-step tutorial (11+ steps)
- **Content:** Text, images, and JSON code snippets
- **Content Management:** Separate JSON data file for easy editing
- **Navigation:** Minimal UI with next/prev buttons and progress bar
- **Code Display:** Syntax highlighting for JSON workflows
- **Design:** Responsive design working on desktop, tablet, and mobile
- **Styling:** Anthropic brand colors and typography
- **Content Status:** Structure first, content to be added later

## Architecture

### File Structure

```
n8n-tech-share/
├── index.html          # Main HTML file (entire app)
├── styles.css          # Anthropic-styled CSS
├── app.js              # Application logic (navigation, rendering)
├── content.json        # Tutorial content data
└── assets/
    └── images/         # Screenshots and diagrams
```

### Technology Stack

- **Frontend:** Vanilla HTML5, CSS3, JavaScript (ES6+)
- **Syntax Highlighting:** Prism.js (CDN)
- **Hosting:** Static file hosting (GitHub Pages, Netlify, or any web server)
- **Dependencies:** None (except Prism.js CDN)

### How It Works

1. `index.html` loads and displays the basic structure
2. `app.js` fetches `content.json` and initializes the app
3. URL hash (`#step-1`, `#step-2`) tracks current step
4. JavaScript renders content dynamically without page reloads
5. Navigation updates URL and re-renders content
6. Browser back/forward buttons work naturally

## Content Data Structure

### JSON Format

```json
{
  "title": "n8n Training Tutorial",
  "description": "Step-by-step guide to mastering n8n workflows",
  "steps": [
    {
      "id": 1,
      "title": "Introduction to n8n",
      "content": [
        {
          "type": "text",
          "value": "Welcome to n8n! This tutorial will teach you..."
        },
        {
          "type": "image",
          "src": "assets/images/n8n-overview.png",
          "alt": "n8n interface overview"
        },
        {
          "type": "code",
          "language": "json",
          "value": "{\n  \"name\": \"My First Workflow\"\n}"
        }
      ]
    }
  ]
}
```

### Content Block Types

- **text:** Paragraphs, headings, lists (supports basic HTML)
- **image:** Screenshots and diagrams with src and alt text
- **code:** JSON workflows with syntax highlighting and language detection

### Content Management

- Add new steps by adding objects to the `steps` array
- Mix content blocks in any order within a step
- Each step is self-contained with its own title
- No rebuild required - just edit JSON and refresh

## UI Layout & Components

### Header Section

- Tutorial title from `content.json`
- Progress bar showing completion percentage
- Anthropic-styled with warm beige/cream background

### Main Content Area

- Centered layout, max-width ~800px
- Step title prominently displayed
- Content blocks render sequentially
- Generous whitespace
- Responsive images

### Navigation Footer

- "Previous" button (disabled on step 1)
- Step indicator in center ("Step X of Y")
- "Next" button (becomes "Complete Tutorial" on final step)
- Anthropic accent colors for buttons

### Responsive Behavior

- **Desktop:** Full width with comfortable margins
- **Tablet:** Adjusted padding, scaled images
- **Mobile:** Single column, larger touch targets, sticky navigation

## Navigation & Progress System

### URL-Based Navigation

- Each step has unique URL hash: `#step-1`, `#step-2`, etc.
- Bookmarkable and shareable links to specific steps
- Browser back/forward buttons work
- Defaults to step 1 if no hash or invalid hash

### Progress Tracking

- Progress bar: `(current step / total steps) × 100%`
- Text display: "Step X of Y"
- Progress persists in URL

### Navigation Controls

- **Next Button:** Advances to next step
- **Previous Button:** Goes back one step
- **Keyboard Support:** Arrow keys for next/prev (optional enhancement)
- **Final Step:** Button text changes to "Complete Tutorial"

### State Management

- Current step tracked in JavaScript variable
- Content rendered dynamically from JSON
- Smooth transitions between steps
- No page reloads

### Edge Cases

- Invalid step numbers redirect to step 1
- Empty content blocks skip gracefully
- Missing images show alt text

## Styling with Anthropic Brand

### Color Palette

- **Primary Background:** `#F4F1EA` (warm cream/beige)
- **Text:** `#1A1A1A` (deep charcoal)
- **Accent/Links:** `#D97757` (Anthropic orange)
- **Code Blocks:** `#F5F5F5` (light gray background)
- **Borders:** Subtle grays

### Typography

- **Headings:** ABC Diatype or system sans-serif fallback
- **Body Text:** 16-18px, line height 1.6-1.8
- **Code:** Fira Code, JetBrains Mono, or Consolas
- **Spacing:** 8px grid system

### Design Elements

- 8px border radius on buttons and code blocks
- Subtle shadows for depth
- Minimal borders - rely on spacing and color
- Smooth progress bar with orange fill
- Rounded corners and soft edges

### Design Principles

- Generous whitespace
- Warm, approachable feel
- Focus on content clarity
- Professional but friendly

### Responsive Typography

- Scales down on mobile
- Maintains readability at all sizes

## Code Syntax Highlighting

### Implementation

**Library:** Prism.js (lightweight, ~2KB core)

**CDN Includes:**
```html
<link href="https://cdn.jsdelivr.net/npm/prismjs@1/themes/prism.min.css" rel="stylesheet">
<script src="https://cdn.jsdelivr.net/npm/prismjs@1/prism.min.js"></script>
<script src="https://cdn.jsdelivr.net/npm/prismjs@1/components/prism-json.min.js"></script>
```

### How It Works

1. Render code blocks as `<pre><code class="language-json">...</code></pre>`
2. Prism.js automatically highlights syntax
3. Colors for strings, numbers, properties, brackets
4. Customizable to match Anthropic palette

### Code Block Features

- Dark text on light background
- Scrollable for long snippets
- Proper indentation preserved
- Line breaks maintained

### Fallback

- If CDN fails, code still displays in monospace
- Graceful degradation ensures usability

## Implementation Notes

### Benefits

- **Simple:** No build tools, no dependencies (except Prism.js CDN)
- **Fast:** Lightweight, loads instantly
- **Maintainable:** Anyone can edit JSON without dev tools
- **Flexible:** Easy to add more content types later
- **Portable:** Works anywhere static files can be hosted
- **Offline-capable:** Works offline after initial load

### Future Enhancements

- Copy-to-clipboard for code blocks
- Dark mode toggle
- Search functionality
- Completion tracking (localStorage)
- Export to PDF
- Print-friendly styles

## Success Criteria

- ✅ Easy for non-developers to add/edit content
- ✅ Professional Anthropic-styled appearance
- ✅ Works on all devices (desktop, tablet, mobile)
- ✅ Fast loading and smooth navigation
- ✅ Code examples clearly highlighted
- ✅ Supports 11+ tutorial steps
- ✅ No build process required
