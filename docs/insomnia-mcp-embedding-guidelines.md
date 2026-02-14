# Insomnia MCP, Embeddings & Qdrant: Best Practices & Guidelines

> Reference for Cursor sessions. Captured from session on 2026-02-13.

---

## Insomnia MCP

### Execute Request: Two Modes

| Mode | Tool | Env var substitution | Use when |
|------|------|----------------------|----------|
| **Insomnia app** | `execute_insomnia_request` | ✅ Yes | Auth/headers need env vars (e.g. OpenAI, Qdrant) |
| **MCP storage** | `execute_request` | ❌ No (sends literals like `{{ _.VAR }}`) | Requests without env vars, or when using override params |

**Guideline:** Use `execute_insomnia_request` for endpoints that depend on environment variables (OpenAI API key, Qdrant URL/token).

### Auth vs Headers

- Insomnia has separate **Auth tab** and **Headers tab**
- Auth tab stores its own `authentication` object (type, token, etc.)
- Updating only Headers may not override Auth; Auth can still send hardcoded values
- **Best practice:** Set authentication to Bearer token with `token: "{{ _.OPENAI_API_KEY }}"` so keys come from env

### Sync Flow

- `sync_from_insomnia` → pulls from Insomnia app into MCP storage
- `sync_to_insomnia` → pushes MCP storage to Insomnia app
- **Restart Insomnia** after sync to see changes
- `update_request` changes MCP storage; sync to Insomnia to push to app

### Environment Variables (Base Environment)

Store reusable values in Base Environment, e.g.:

- `OPENAI_API_KEY` – for Embedding requests
- `QDRANT_URL` – Qdrant instance URL (no trailing slash)
- `QDRANT_API_KEY` – Qdrant API key (token)
- `QDRANT_COLLECTION` – collection name (e.g. `embeddings`)

Reference in requests: `{{ _.VARIABLE_NAME }}`

---

## OpenAI Embeddings

### Model

- `text-embedding-3-small` – 1536 dimensions

### Response shape

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

Use `response.data.data[0].embedding` for the first embedding.

### Cosine similarity

- **> 0.6** – semantically similar
- **0.3–0.6** – related
- **0.1–0.2** – weakly related
- **~0.1 or lower** – effectively unrelated

---

## Qdrant

### Point IDs

- Must be **unsigned integer** or **UUID**
- Strings like `"embedding-1"` are invalid
- Use `1`, `2`, or UUIDs, e.g. `"76874cce-1fb9-4e16-9b0b-f085ac06ed6f"`

### Create collection first

Collection must exist before upserting points:

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

### Upsert points

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

### Auth

- Header: `api-key: {token}`

---

## Workflow: Embedding → Qdrant

1. Run **Embedding 1** and **Embedding 2** via `execute_insomnia_request`
2. From each response: `response.data.data[0].embedding`
3. Build payload:
   ```json
   {
     "points": [
       { "id": 1, "vector": [...], "payload": { "source": "Embedding 1", "input_text": "..." } },
       { "id": 2, "vector": [...], "payload": { "source": "Embedding 2", "input_text": "..." } }
     ]
   }
   ```
4. Create Qdrant collection if needed (size 1536, Cosine)
5. Upsert points via PUT to `/collections/{name}/points`

---

## Collection Structure (this project)

- **My first collection** (wrk_24214320bbfe4b8197bbdbd91ea9f6c3)
  - Embedding 1: `req_90043063959b4d1293d92646e9efaaa1`
  - Embedding 2: `req_baf1d52027414afbab6756d40107a1bc`
  - Save to Qdrant: `req_6c0e36ae4986472aa803eb988e163af8`
  - OpenAI Embedding Example: `req_d57f480ddb0e43ea85a629f3999aebda`
