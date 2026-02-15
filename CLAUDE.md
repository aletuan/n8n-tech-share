# Project Context for Claude Code

> This file provides Claude Code with essential project context, conventions, and workflows.

---

## Project Overview

**n8n Training Tutorial** - A lightweight, single-page application for delivering step-by-step n8n training. Built with vanilla JavaScript, no frameworks required.

### Tech Stack
- HTML5, CSS3, Vanilla JavaScript (ES6+)
- Prism.js for syntax highlighting (CDN)
- Anthropic brand styling

### Key Files
- `index.html` - Main HTML structure
- `styles.css` - Anthropic-styled responsive design
- `app.js` - Application logic (navigation, rendering)
- `content.json` - Tutorial content (edit this to modify steps)
- `assets/images/` - Screenshots and diagrams
- `workflows/` - Example n8n workflow JSON files (NOT tracked in git)

---

## Security Guidelines

### API Keys - CRITICAL

**Never commit API keys to git.** All sensitive credentials must use environment variables.

#### Current Setup
- `workflows/` directory is **gitignored** (contains local workflow files with potential secrets)
- `.env*` files are **gitignored**
- `.mcp.json` is **gitignored** (user-specific MCP configuration)

#### Best Practices
1. **Always use environment variables** for API keys in workflow files
2. **Never hardcode keys** - use placeholders like `{{ _.OPENAI_API_KEY }}`
3. **Before any git commit**, verify no secrets are included:
   ```bash
   grep -r "sk-\|xox\|ghp_\|AKIA" . --exclude-dir=node_modules
   ```
4. If a key is accidentally exposed, **revoke it immediately**

### OpenAI API Keys
- Store in Insomnia Base Environment as `OPENAI_API_KEY`
- Reference in requests: `{{ _.OPENAI_API_KEY }}`
- Never use hardcoded `Bearer sk-...` tokens

### Qdrant API Keys
- Store in Insomnia Base Environment as `QDRANT_API_KEY`
- Reference in requests: `{{ _.QDRANT_API_KEY }}`

---

## Insomnia MCP Workflows

### Execute Request: Two Modes

| Mode | Tool | Env var substitution | Use when |
|------|------|----------------------|----------|
| **Insomnia app** | `execute_insomnia_request` | ✅ Yes | Auth/headers need env vars (e.g. OpenAI, Qdrant) |
| **MCP storage** | `execute_request` | ❌ No (sends literals) | Requests without env vars |

**Guideline:** Use `execute_insomnia_request` for endpoints requiring environment variables.

### Authentication Configuration

- Insomnia has separate **Auth tab** and **Headers tab**
- Auth tab stores `authentication` object (type, token, etc.)
- **Best practice:** Set authentication to Bearer token with `token: "{{ _.OPENAI_API_KEY }}"` so keys come from environment
- Updating only Headers may not override Auth; Auth can still send hardcoded values

### Sync Flow

```
sync_from_insomnia → pulls from Insomnia app into MCP storage
sync_to_insomnia   → pushes MCP storage to Insomnia app
```

- **Restart Insomnia** after sync to see changes
- `update_request` changes MCP storage; sync to Insomnia to push to app

### Environment Variables (Base Environment)

Store reusable values in Insomnia Base Environment:

- `OPENAI_API_KEY` - for embedding requests
- `QDRANT_URL` - Qdrant instance URL (no trailing slash)
- `QDRANT_API_KEY` - Qdrant API key (token)
- `QDRANT_COLLECTION` - collection name (e.g. `embeddings`)

Reference in requests: `{{ _.VARIABLE_NAME }}`

---

## OpenAI Embeddings

### Model
- `text-embedding-3-small` - 1536 dimensions

### Response Structure
```json
{
  "data": [
    {
      "index": 0,
      "embedding": [0.12, -0.45, 0.78, ...]
    }
  ]
}
```

Access embedding: `response.data.data[0].embedding`

### Cosine Similarity Interpretation
- **> 0.6** - semantically similar
- **0.3–0.6** - related
- **0.1–0.2** - weakly related
- **~0.1 or lower** - effectively unrelated

---

## Qdrant Vector Database

### Point IDs
- Must be **unsigned integer** or **UUID**
- ❌ Strings like `"embedding-1"` are invalid
- ✅ Use `1`, `2`, or UUIDs like `"76874cce-1fb9-4e16-9b0b-f085ac06ed6f"`

### Create Collection (Required First)
```http
PUT {QDRANT_URL}/collections/{collection_name}
Content-Type: application/json
api-key: {QDRANT_API_KEY}

{
  "vectors": {
    "size": 1536,
    "distance": "Cosine"
  }
}
```

### Upsert Points
```http
PUT {QDRANT_URL}/collections/{collection_name}/points
Content-Type: application/json
api-key: {QDRANT_API_KEY}

{
  "points": [
    {
      "id": 1,
      "vector": [0.12, -0.45, ...],
      "payload": {
        "source": "Embedding 1",
        "input_text": "Original text here"
      }
    }
  ]
}
```

### Authentication
- Header: `api-key: {token}`

---

## Workflow: Embedding → Qdrant

1. Run embedding requests via `execute_insomnia_request`
2. Extract embedding from response: `response.data.data[0].embedding`
3. Build upsert payload with points array
4. Create Qdrant collection if needed (size: 1536, distance: Cosine)
5. Upsert points via PUT to `/collections/{name}/points`

---

## Content Management

### Editing Tutorial Content

All tutorial content is in `content.json`. Structure:

```json
{
  "title": "Tutorial Title",
  "description": "Description",
  "steps": [
    {
      "id": 1,
      "title": "Step Title",
      "content": [
        {
          "type": "text",
          "value": "<p>HTML content</p>"
        },
        {
          "type": "image",
          "src": "assets/images/screenshot.png",
          "alt": "Description"
        },
        {
          "type": "code",
          "language": "json",
          "value": "{\"example\": \"code\"}"
        }
      ]
    }
  ]
}
```

### Content Block Types
- **text** - HTML content (paragraphs, headings, lists, links)
- **image** - Screenshots with alt text
- **code** - Syntax-highlighted code (JSON, JavaScript, etc.)

### Adding Images
1. Save image to `assets/images/`
2. Use descriptive filenames (e.g., `rag-indexing-workflow.png`)
3. Add to content.json with proper `src` and `alt` attributes

---

## Git Workflow

### Branches
- **main** - production branch (default for PRs)
- **improve-tutorial-content** - current working branch

### Ignored Files (`.gitignore`)
```
.worktrees/          # Git worktrees
.DS_Store            # macOS
.vscode/, .idea/     # Editors
node_modules/        # Dependencies
workflows/*          # Local workflow files (may contain secrets)
.mcp.json            # User-specific MCP config
```

### Committing
- Check for secrets before committing
- Use descriptive commit messages
- Follow pattern: `feat(scope):`, `fix(scope):`, `refactor(scope):`
- Include co-authorship: `Co-Authored-By: Claude Sonnet 4.5 <noreply@anthropic.com>`

---

## Common Tasks

### Running Locally
```bash
# Just open in browser, no build needed
open index.html
```

### Testing
```bash
# Using Playwright (if needed)
npx playwright test
```

### Adding a New Tutorial Step
1. Edit `content.json`
2. Add step object with id, title, content array
3. Add any images to `assets/images/`
4. Test in browser
5. Commit changes

### Updating Workflow Files
1. Edit in n8n or Insomnia
2. Export to `workflows/` directory
3. **Do not commit** (directory is gitignored)
4. Use environment variables for all credentials

---

## Insomnia Collection Structure

**Collection:** My first collection (wrk_24214320bbfe4b8197bbdbd91ea9f6c3)

Key requests:
- Embedding 1: `req_90043063959b4d1293d92646e9efaaa1`
- Embedding 2: `req_baf1d52027414afbab6756d40107a1bc`
- Save to Qdrant: `req_6c0e36ae4986472aa803eb988e163af8`
- OpenAI Embedding Example: `req_d57f480ddb0e43ea85a629f3999aebda`

---

## Design Guidelines

### Anthropic Brand Colors (from styles.css)
- Background: `#F4F1EA`
- Accent: `#D97757`
- Text: `#1A1A1A`

### Typography
- Headings: System fonts (SF Pro, Segoe UI, etc.)
- Code: Monaco, Menlo, Courier New

### Responsive Breakpoints
- Desktop: > 768px
- Tablet: 481px - 768px
- Mobile: ≤ 480px

---

## Notes for Claude Code

### When Working on This Project
1. **Always check for API keys** before committing
2. Use environment variables in all workflow files
3. Test changes in browser before committing
4. Keep `content.json` well-formatted and validated
5. Update this CLAUDE.md when adding new conventions

### Current Focus Areas
- Tutorial content improvements
- RAG (Retrieval-Augmented Generation) examples
- Embedding and vector search demonstrations
- n8n workflow best practices

### Recent Work
- Step 10: RAG implementation with Shakespeare indexing
- Query workflow with demo
- Insomnia MCP integration for embeddings
- Qdrant vector database integration
