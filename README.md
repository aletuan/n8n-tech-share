# n8n Training Tutorial

A lightweight, single-page application for delivering step-by-step n8n training to teams. Built with vanilla JavaScript and styled with Anthropic's brand guidelines.

## Features

- 📚 Step-by-step tutorial format with progress tracking
- 💻 Syntax-highlighted code examples (JSON workflows)
- 📱 Fully responsive design (desktop, tablet, mobile)
- 🎨 Anthropic brand styling
- ⌨️ Keyboard navigation (arrow keys)
- 🔗 Shareable links to specific steps
- 🚀 Zero dependencies (except Prism.js CDN)
- ⚡ Fast loading, works offline after initial load

## Tech Stack

- **HTML5** - Semantic markup
- **CSS3** - Anthropic-styled responsive design
- **Vanilla JavaScript (ES6+)** - No frameworks
- **Prism.js** - Syntax highlighting for code blocks

## Project Structure

```
n8n-tech-share/
├── index.html          # Main HTML file
├── styles.css          # Anthropic-styled CSS
├── app.js              # Application logic
├── content.json        # Tutorial content (edit this!)
├── assets/
│   └── images/         # Screenshots and diagrams
└── docs/
    └── plans/          # Design and implementation docs
```

## Getting Started

### Running Locally

1. Clone the repository
2. Open `index.html` in a web browser
3. That's it! No build process required.

### Adding Content

Edit `content.json` to add or modify tutorial steps:

```json
{
  "title": "Your Tutorial Title",
  "description": "Your tutorial description",
  "steps": [
    {
      "id": 1,
      "title": "Step Title",
      "content": [
        {
          "type": "text",
          "value": "<p>Your content here with HTML support</p>"
        },
        {
          "type": "image",
          "src": "assets/images/screenshot.png",
          "alt": "Description"
        },
        {
          "type": "code",
          "language": "json",
          "value": "{\n  \"example\": \"code\"\n}"
        }
      ]
    }
  ]
}
```

### Content Block Types

- **text**: HTML content (paragraphs, headings, lists, links)
- **image**: Screenshots and diagrams with alt text
- **code**: Syntax-highlighted code (JSON, JavaScript, etc.)

## Deployment

Deploy to any static hosting service:

- **GitHub Pages**: Push to `gh-pages` branch
- **Netlify**: Drag and drop the project folder
- **Vercel**: Connect your repository
- **Any web server**: Upload files to document root

## Customization

### Changing Colors

Edit CSS variables in `styles.css`:

```css
:root {
    --color-bg-primary: #F4F1EA;  /* Background */
    --color-accent: #D97757;      /* Buttons, links */
    --color-text-primary: #1A1A1A; /* Text color */
}
```

### Adding More Content Types

Extend the `renderContentBlock()` function in `app.js` to support additional block types like videos, interactive demos, etc.

## Browser Support

- Chrome/Edge (latest)
- Firefox (latest)
- Safari (latest)
- Mobile browsers (iOS Safari, Chrome Mobile)

## License

[Your License Here]

## Credits

Built with [Prism.js](https://prismjs.com/) for syntax highlighting.
Styled with [Anthropic's brand guidelines](https://www.anthropic.com/).
