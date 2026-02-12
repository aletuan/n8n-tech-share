# n8n Tutorial SPA Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Build a vanilla JavaScript single-page application for hosting step-by-step n8n training tutorials with Anthropic styling.

**Architecture:** Static SPA with JSON-based content management, hash-based routing, and dynamic rendering. No build tools—just HTML, CSS, and vanilla JavaScript with Prism.js for syntax highlighting.

**Tech Stack:** HTML5, CSS3, Vanilla JavaScript (ES6+), Prism.js (CDN)

---

## Task 1: Create Basic HTML Structure

**Files:**
- Create: `index.html`

**Step 1: Create the base HTML file**

Create `index.html` with semantic structure, Anthropic brand colors, and Prism.js CDN links.

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>n8n Training Tutorial</title>
    <link rel="stylesheet" href="styles.css">
    <link href="https://cdn.jsdelivr.net/npm/prismjs@1/themes/prism.min.css" rel="stylesheet">
</head>
<body>
    <div id="app">
        <header class="header">
            <h1 id="tutorial-title">Loading...</h1>
            <div class="progress-container">
                <div class="progress-bar" id="progress-bar"></div>
            </div>
            <p class="progress-text" id="progress-text">Step 0 of 0</p>
        </header>

        <main class="main-content">
            <div id="content-container">
                <h2 id="step-title">Loading...</h2>
                <div id="step-content"></div>
            </div>
        </main>

        <footer class="navigation-footer">
            <button id="prev-btn" class="btn btn-secondary" disabled>Previous</button>
            <span class="step-indicator" id="step-indicator">Step 0 of 0</span>
            <button id="next-btn" class="btn btn-primary">Next</button>
        </footer>
    </div>

    <script src="https://cdn.jsdelivr.net/npm/prismjs@1/prism.min.js"></script>
    <script src="https://cdn.jsdelivr.net/npm/prismjs@1/components/prism-json.min.js"></script>
    <script src="app.js"></script>
</body>
</html>
```

**Step 2: Verify HTML structure**

Open `index.html` in browser and verify:
- Expected: Basic structure loads (may show "Loading..." text)
- Page title is "n8n Training Tutorial"
- No console errors

**Step 3: Commit**

```bash
git add index.html
git commit -m "feat: add base HTML structure with Prism.js integration

- Semantic HTML5 structure
- Progress bar and navigation elements
- Prism.js CDN for syntax highlighting
- Mobile-responsive viewport meta tag"
```

---

## Task 2: Create Anthropic-Styled CSS

**Files:**
- Create: `styles.css`

**Step 1: Create CSS file with Anthropic brand styling**

Create `styles.css` with Anthropic colors, typography, and responsive design.

```css
/* Reset and Base Styles */
* {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
}

:root {
    /* Anthropic Brand Colors */
    --color-bg-primary: #F4F1EA;
    --color-text-primary: #1A1A1A;
    --color-accent: #D97757;
    --color-code-bg: #F5F5F5;
    --color-border: #E0E0E0;
    --color-shadow: rgba(0, 0, 0, 0.1);

    /* Typography */
    --font-sans: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Helvetica Neue', Arial, sans-serif;
    --font-mono: 'Fira Code', 'JetBrains Mono', 'Consolas', monospace;

    /* Spacing */
    --spacing-xs: 8px;
    --spacing-sm: 16px;
    --spacing-md: 24px;
    --spacing-lg: 32px;
    --spacing-xl: 48px;

    /* Border Radius */
    --radius: 8px;
}

body {
    font-family: var(--font-sans);
    background-color: var(--color-bg-primary);
    color: var(--color-text-primary);
    line-height: 1.6;
    font-size: 16px;
}

/* App Container */
#app {
    min-height: 100vh;
    display: flex;
    flex-direction: column;
}

/* Header */
.header {
    background-color: var(--color-bg-primary);
    padding: var(--spacing-lg) var(--spacing-md);
    border-bottom: 2px solid var(--color-border);
    text-align: center;
}

.header h1 {
    font-size: 2rem;
    margin-bottom: var(--spacing-sm);
    color: var(--color-text-primary);
}

.progress-container {
    width: 100%;
    max-width: 600px;
    height: 8px;
    background-color: var(--color-border);
    border-radius: var(--radius);
    margin: var(--spacing-sm) auto;
    overflow: hidden;
}

.progress-bar {
    height: 100%;
    background-color: var(--color-accent);
    width: 0%;
    transition: width 0.3s ease;
}

.progress-text {
    font-size: 0.9rem;
    color: var(--color-text-primary);
    opacity: 0.7;
}

/* Main Content */
.main-content {
    flex: 1;
    padding: var(--spacing-lg) var(--spacing-md);
    max-width: 800px;
    width: 100%;
    margin: 0 auto;
}

#step-title {
    font-size: 1.75rem;
    margin-bottom: var(--spacing-md);
    color: var(--color-text-primary);
}

#step-content {
    font-size: 1.125rem;
    line-height: 1.8;
}

/* Content Block Styles */
.content-text {
    margin-bottom: var(--spacing-md);
}

.content-text h1,
.content-text h2,
.content-text h3 {
    margin-top: var(--spacing-md);
    margin-bottom: var(--spacing-sm);
    color: var(--color-text-primary);
}

.content-text p {
    margin-bottom: var(--spacing-sm);
}

.content-text ul,
.content-text ol {
    margin-left: var(--spacing-md);
    margin-bottom: var(--spacing-sm);
}

.content-text a {
    color: var(--color-accent);
    text-decoration: none;
    border-bottom: 1px solid var(--color-accent);
}

.content-text a:hover {
    opacity: 0.8;
}

.content-image {
    margin: var(--spacing-md) 0;
    text-align: center;
}

.content-image img {
    max-width: 100%;
    height: auto;
    border-radius: var(--radius);
    box-shadow: 0 2px 8px var(--color-shadow);
}

.content-code {
    margin: var(--spacing-md) 0;
}

.content-code pre {
    background-color: var(--color-code-bg);
    border: 1px solid var(--color-border);
    border-radius: var(--radius);
    padding: var(--spacing-sm);
    overflow-x: auto;
    font-family: var(--font-mono);
    font-size: 0.9rem;
}

.content-code code {
    font-family: var(--font-mono);
}

/* Navigation Footer */
.navigation-footer {
    background-color: var(--color-bg-primary);
    padding: var(--spacing-md);
    border-top: 2px solid var(--color-border);
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: var(--spacing-md);
}

.step-indicator {
    font-size: 0.9rem;
    color: var(--color-text-primary);
    opacity: 0.7;
}

/* Buttons */
.btn {
    padding: 12px 24px;
    border: none;
    border-radius: var(--radius);
    font-size: 1rem;
    font-family: var(--font-sans);
    cursor: pointer;
    transition: all 0.2s ease;
    font-weight: 500;
}

.btn-primary {
    background-color: var(--color-accent);
    color: white;
}

.btn-primary:hover:not(:disabled) {
    opacity: 0.9;
    transform: translateY(-1px);
}

.btn-secondary {
    background-color: transparent;
    color: var(--color-text-primary);
    border: 2px solid var(--color-border);
}

.btn-secondary:hover:not(:disabled) {
    border-color: var(--color-accent);
    color: var(--color-accent);
}

.btn:disabled {
    opacity: 0.4;
    cursor: not-allowed;
}

/* Responsive Design */
@media (max-width: 768px) {
    body {
        font-size: 14px;
    }

    .header h1 {
        font-size: 1.5rem;
    }

    #step-title {
        font-size: 1.5rem;
    }

    #step-content {
        font-size: 1rem;
    }

    .navigation-footer {
        flex-direction: column;
        gap: var(--spacing-sm);
    }

    .btn {
        width: 100%;
        padding: 14px 24px;
    }

    .step-indicator {
        order: -1;
    }
}

@media (max-width: 480px) {
    .header,
    .main-content,
    .navigation-footer {
        padding: var(--spacing-sm);
    }
}
```

**Step 2: Verify CSS styling**

Refresh browser and verify:
- Expected: Anthropic warm beige background (#F4F1EA)
- Header with progress bar visible
- Navigation buttons styled with orange accent
- No console errors

**Step 3: Commit**

```bash
git add styles.css
git commit -m "feat: add Anthropic-styled CSS with responsive design

- Anthropic brand colors (warm beige, orange accent)
- Responsive typography and spacing
- Mobile-first navigation layout
- Progress bar and button styling"
```

---

## Task 3: Create Sample Content Data File

**Files:**
- Create: `content.json`
- Create: `assets/images/.gitkeep`

**Step 1: Create assets directory structure**

```bash
mkdir -p assets/images
touch assets/images/.gitkeep
```

**Step 2: Create sample content.json**

Create `content.json` with placeholder content that demonstrates all content types.

```json
{
  "title": "n8n Training Tutorial",
  "description": "Step-by-step guide to mastering n8n workflows",
  "steps": [
    {
      "id": 1,
      "title": "Welcome to n8n",
      "content": [
        {
          "type": "text",
          "value": "<h3>Introduction</h3><p>Welcome to the n8n training tutorial! This comprehensive guide will teach you everything you need to know about building powerful automation workflows.</p><p>n8n is a fair-code licensed workflow automation tool that allows you to connect different services and automate tasks.</p>"
        },
        {
          "type": "text",
          "value": "<h3>What You'll Learn</h3><ul><li>Core n8n concepts and terminology</li><li>Creating and managing workflows</li><li>Working with nodes and connections</li><li>Handling data and expressions</li><li>Best practices for production workflows</li></ul>"
        }
      ]
    },
    {
      "id": 2,
      "title": "Understanding Workflows",
      "content": [
        {
          "type": "text",
          "value": "<h3>What is a Workflow?</h3><p>A workflow in n8n is a sequence of connected nodes that process data. Each node performs a specific action, and data flows between nodes.</p>"
        },
        {
          "type": "code",
          "language": "json",
          "value": "{\n  \"name\": \"My First Workflow\",\n  \"nodes\": [\n    {\n      \"name\": \"Start\",\n      \"type\": \"n8n-nodes-base.start\",\n      \"position\": [250, 300]\n    }\n  ],\n  \"connections\": {}\n}"
        },
        {
          "type": "text",
          "value": "<p>This is a basic workflow structure in JSON format. As you progress through this tutorial, you'll learn how to build complex workflows.</p>"
        }
      ]
    },
    {
      "id": 3,
      "title": "Working with Nodes",
      "content": [
        {
          "type": "text",
          "value": "<h3>Node Basics</h3><p>Nodes are the building blocks of n8n workflows. Each node has inputs, outputs, and configuration parameters.</p>"
        },
        {
          "type": "text",
          "value": "<h3>Common Node Types</h3><ul><li><strong>Trigger Nodes:</strong> Start workflows based on events</li><li><strong>Action Nodes:</strong> Perform operations and transformations</li><li><strong>Logic Nodes:</strong> Control workflow execution flow</li></ul>"
        },
        {
          "type": "code",
          "language": "json",
          "value": "{\n  \"name\": \"HTTP Request\",\n  \"type\": \"n8n-nodes-base.httpRequest\",\n  \"parameters\": {\n    \"url\": \"https://api.example.com/data\",\n    \"method\": \"GET\"\n  }\n}"
        }
      ]
    }
  ]
}
```

**Step 3: Verify content file**

```bash
cat content.json | head -20
```

Expected: Valid JSON with 3 sample steps

**Step 4: Commit**

```bash
git add content.json assets/images/.gitkeep
git commit -m "feat: add sample content with 3 tutorial steps

- Sample JSON structure with all content types
- Placeholder content for n8n tutorial
- Assets directory for future images"
```

---

## Task 4: Create Application JavaScript Logic

**Files:**
- Create: `app.js`

**Step 1: Create app.js with core functionality**

Create `app.js` with content loading, navigation, and rendering logic.

```javascript
// Application State
let tutorialData = null;
let currentStep = 1;
let totalSteps = 0;

// DOM Elements
const elements = {
    tutorialTitle: null,
    progressBar: null,
    progressText: null,
    stepTitle: null,
    stepContent: null,
    stepIndicator: null,
    prevBtn: null,
    nextBtn: null
};

// Initialize app when DOM is ready
document.addEventListener('DOMContentLoaded', async () => {
    initializeElements();
    await loadContent();
    initializeFromURL();
    setupEventListeners();
    renderCurrentStep();
});

// Initialize DOM element references
function initializeElements() {
    elements.tutorialTitle = document.getElementById('tutorial-title');
    elements.progressBar = document.getElementById('progress-bar');
    elements.progressText = document.getElementById('progress-text');
    elements.stepTitle = document.getElementById('step-title');
    elements.stepContent = document.getElementById('step-content');
    elements.stepIndicator = document.getElementById('step-indicator');
    elements.prevBtn = document.getElementById('prev-btn');
    elements.nextBtn = document.getElementById('next-btn');
}

// Load content from JSON file
async function loadContent() {
    try {
        const response = await fetch('content.json');
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        tutorialData = await response.json();
        totalSteps = tutorialData.steps.length;

        // Update tutorial title
        elements.tutorialTitle.textContent = tutorialData.title;
        document.title = tutorialData.title;
    } catch (error) {
        console.error('Error loading content:', error);
        elements.stepContent.innerHTML = '<p>Error loading tutorial content. Please refresh the page.</p>';
    }
}

// Initialize current step from URL hash
function initializeFromURL() {
    const hash = window.location.hash;
    if (hash) {
        const match = hash.match(/^#step-(\d+)$/);
        if (match) {
            const stepNum = parseInt(match[1], 10);
            if (stepNum >= 1 && stepNum <= totalSteps) {
                currentStep = stepNum;
                return;
            }
        }
    }
    // Default to step 1
    currentStep = 1;
    updateURL();
}

// Setup event listeners
function setupEventListeners() {
    elements.prevBtn.addEventListener('click', goToPreviousStep);
    elements.nextBtn.addEventListener('click', goToNextStep);
    window.addEventListener('hashchange', handleHashChange);

    // Optional: Keyboard navigation
    document.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowLeft' && currentStep > 1) {
            goToPreviousStep();
        } else if (e.key === 'ArrowRight' && currentStep < totalSteps) {
            goToNextStep();
        }
    });
}

// Navigation functions
function goToPreviousStep() {
    if (currentStep > 1) {
        currentStep--;
        updateURL();
        renderCurrentStep();
        scrollToTop();
    }
}

function goToNextStep() {
    if (currentStep < totalSteps) {
        currentStep++;
        updateURL();
        renderCurrentStep();
        scrollToTop();
    }
}

function handleHashChange() {
    initializeFromURL();
    renderCurrentStep();
    scrollToTop();
}

function scrollToTop() {
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

// Update URL hash
function updateURL() {
    window.history.pushState(null, '', `#step-${currentStep}`);
}

// Render current step
function renderCurrentStep() {
    if (!tutorialData || !tutorialData.steps) {
        return;
    }

    const step = tutorialData.steps.find(s => s.id === currentStep);
    if (!step) {
        elements.stepContent.innerHTML = '<p>Step not found.</p>';
        return;
    }

    // Update step title
    elements.stepTitle.textContent = step.title;

    // Render content blocks
    elements.stepContent.innerHTML = '';
    step.content.forEach(block => {
        const blockElement = renderContentBlock(block);
        if (blockElement) {
            elements.stepContent.appendChild(blockElement);
        }
    });

    // Re-run Prism syntax highlighting
    if (window.Prism) {
        Prism.highlightAll();
    }

    // Update progress
    updateProgress();

    // Update navigation buttons
    updateNavigationButtons();
}

// Render individual content block
function renderContentBlock(block) {
    switch (block.type) {
        case 'text':
            return renderTextBlock(block);
        case 'image':
            return renderImageBlock(block);
        case 'code':
            return renderCodeBlock(block);
        default:
            console.warn('Unknown content block type:', block.type);
            return null;
    }
}

// Render text block
function renderTextBlock(block) {
    const div = document.createElement('div');
    div.className = 'content-text';
    div.innerHTML = block.value;
    return div;
}

// Render image block
function renderImageBlock(block) {
    const div = document.createElement('div');
    div.className = 'content-image';

    const img = document.createElement('img');
    img.src = block.src;
    img.alt = block.alt || 'Tutorial image';

    // Optional: Add loading error handler
    img.onerror = () => {
        div.innerHTML = `<p><em>Image not found: ${block.src}</em></p>`;
    };

    div.appendChild(img);
    return div;
}

// Render code block
function renderCodeBlock(block) {
    const div = document.createElement('div');
    div.className = 'content-code';

    const pre = document.createElement('pre');
    const code = document.createElement('code');
    code.className = `language-${block.language || 'json'}`;
    code.textContent = block.value;

    pre.appendChild(code);
    div.appendChild(pre);
    return div;
}

// Update progress indicators
function updateProgress() {
    const percentage = (currentStep / totalSteps) * 100;
    elements.progressBar.style.width = `${percentage}%`;

    const progressText = `Step ${currentStep} of ${totalSteps}`;
    elements.progressText.textContent = progressText;
    elements.stepIndicator.textContent = progressText;
}

// Update navigation button states
function updateNavigationButtons() {
    // Previous button
    elements.prevBtn.disabled = currentStep === 1;

    // Next button
    if (currentStep === totalSteps) {
        elements.nextBtn.textContent = 'Complete Tutorial';
    } else {
        elements.nextBtn.textContent = 'Next';
    }
    elements.nextBtn.disabled = false;
}
```

**Step 2: Test in browser**

Open `index.html` in browser and verify:
- Expected: Tutorial loads with "Welcome to n8n" as step 1
- Progress bar shows 33% (step 1 of 3)
- "Previous" button is disabled
- "Next" button works and advances to step 2
- URL changes to `#step-2`
- Browser back button works
- Arrow keys navigate between steps
- Code blocks have syntax highlighting
- No console errors

**Step 3: Commit**

```bash
git add app.js
git commit -m "feat: add JavaScript application logic

- Content loading from JSON
- Hash-based routing and navigation
- Dynamic content rendering for text/image/code blocks
- Progress tracking and button state management
- Keyboard navigation support (arrow keys)
- Prism.js integration for syntax highlighting"
```

---

## Task 5: Add README Documentation

**Files:**
- Create: `README.md`

**Step 1: Create README with usage instructions**

Create `README.md` to document the project.

```markdown
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
```

**Step 2: Verify README**

```bash
cat README.md | head -30
```

Expected: Complete README with project overview and instructions

**Step 3: Commit**

```bash
git add README.md
git commit -m "docs: add comprehensive README

- Project overview and features
- Getting started instructions
- Content editing guide
- Deployment options
- Customization instructions"
```

---

## Task 6: Final Testing and Polish

**Files:**
- Modify: `content.json` (add note about editing)

**Step 1: Add editing instructions to content**

Add a helpful message in the first step about editing content.

```bash
# Read current content
cat content.json
```

**Step 2: Update first step with editing instructions**

Edit `content.json` to add editing instructions in step 1:

```json
{
  "title": "n8n Training Tutorial",
  "description": "Step-by-step guide to mastering n8n workflows",
  "steps": [
    {
      "id": 1,
      "title": "Welcome to n8n",
      "content": [
        {
          "type": "text",
          "value": "<h3>Introduction</h3><p>Welcome to the n8n training tutorial! This comprehensive guide will teach you everything you need to know about building powerful automation workflows.</p><p>n8n is a fair-code licensed workflow automation tool that allows you to connect different services and automate tasks.</p>"
        },
        {
          "type": "text",
          "value": "<h3>What You'll Learn</h3><ul><li>Core n8n concepts and terminology</li><li>Creating and managing workflows</li><li>Working with nodes and connections</li><li>Handling data and expressions</li><li>Best practices for production workflows</li></ul>"
        },
        {
          "type": "text",
          "value": "<h3>About This Tutorial</h3><p>This is a sample tutorial with placeholder content. To customize it for your team:</p><ol><li>Edit <code>content.json</code> to add your own steps and content</li><li>Add screenshots to <code>assets/images/</code></li><li>Update the tutorial title and description</li></ol><p>See <code>README.md</code> for detailed instructions on editing content.</p>"
        }
      ]
    }
  ]
}
```

Note: Only showing step 1 changes - keep steps 2 and 3 the same.

**Step 3: Full browser testing checklist**

Test the following in browser:

1. **Navigation:**
   - ✅ Next button advances steps
   - ✅ Previous button goes back (disabled on step 1)
   - ✅ Arrow keys work (left/right)
   - ✅ URL hash updates (#step-1, #step-2, etc.)
   - ✅ Browser back/forward buttons work
   - ✅ Direct URL with hash loads correct step

2. **Content Rendering:**
   - ✅ Text blocks render with HTML
   - ✅ Code blocks have syntax highlighting
   - ✅ Missing images show alt text fallback

3. **Progress:**
   - ✅ Progress bar updates (33%, 66%, 100%)
   - ✅ Progress text updates ("Step 1 of 3", etc.)
   - ✅ Step indicator in footer matches header

4. **Responsive:**
   - ✅ Desktop view (>768px) - sidebar layout
   - ✅ Tablet view (768px) - adjusted padding
   - ✅ Mobile view (<480px) - stacked buttons

5. **Styling:**
   - ✅ Anthropic colors (beige background, orange accent)
   - ✅ Readable typography
   - ✅ Smooth transitions
   - ✅ No layout shift or flashing

6. **Edge Cases:**
   - ✅ Invalid hash redirects to step 1
   - ✅ Refresh maintains current step
   - ✅ No JavaScript errors in console

**Step 4: Commit final changes**

```bash
git add content.json
git commit -m "feat: add editing instructions to sample content

- Added helpful message in step 1 about customizing content
- Instructions point to README.md for details
- Improved onboarding for content editors"
```

---

## Task 7: Merge to Main Branch

**Files:**
- N/A (Git operations)

**Step 1: Verify all files are committed**

```bash
git status
```

Expected: "nothing to commit, working tree clean"

**Step 2: Review commit history**

```bash
git log --oneline
```

Expected: 7 commits showing all tasks completed

**Step 3: Switch to main branch and merge**

```bash
cd /Users/andy/Workspace/Agents/n8n-tech-share
git checkout main
git merge feature/tutorial-spa
```

Expected: Fast-forward merge (no conflicts)

**Step 4: Verify merged files**

```bash
ls -la
```

Expected: index.html, styles.css, app.js, content.json, assets/, README.md all present

**Step 5: Test final application**

```bash
open index.html
```

Expected: Application works correctly in main branch

**Step 6: Clean up worktree**

```bash
git worktree remove .worktrees/tutorial-spa
```

Expected: Worktree removed successfully

---

## Summary

**Deliverables:**
- ✅ Fully functional n8n tutorial SPA
- ✅ Anthropic-styled responsive design
- ✅ Sample content with 3 steps
- ✅ Complete documentation (README.md)
- ✅ Ready for content authoring

**Next Steps for Content Authors:**
1. Edit `content.json` to replace sample content
2. Add images to `assets/images/`
3. Test in browser
4. Deploy to hosting service

**Time Estimate:** ~30-40 minutes for full implementation
