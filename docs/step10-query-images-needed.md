# Step 10 Query Workflow - Images Needed

## Required Screenshots

Based on your provided screenshots, you need to add these 3 images to `assets/images/`:

### 1. **rag-query-workflow.png**
- **Source:** Your screenshot showing the n8n workflow (Screenshot 2026-02-14 at 15.01.15.png)
- **Content:** Complete RAG query workflow with 6 nodes:
  1. 01 - Inbound Question (Webhook)
  2. 02 - Generate Query Embedding (HTTP Request)
  3. 03 - Vector Search (Qdrant)
  4. 04 - Build RAG Prompt (Code)
  5. 05 - Generate Answer (LLM)
  6. 06 - Return Response (Respond to Webhook)

### 2. **rag-query-insomnia-request.png**
- **Source:** Screenshot 2026-02-15 at 17.40.50.png
- **Content:** Insomnia showing:
  - POST request to http://localhost:5678/webhook/rag-query
  - Request body: `{ "question": "Who is Marcius?" }`

### 3. **rag-query-response.png**
- **Source:** Screenshot 2026-02-15 at 17.40.56.png
- **Content:** Insomnia showing the response:
  - Text response about Marcius being a noble Roman soldier

## What's Already Updated

✅ **content.json** - Query Workflow section completed with 4 tabs:
1. Overview - Workflow steps explanation
2. Workflow - n8n workflow diagram
3. Build RAG Prompt - Code details and explanation
4. Demo - Insomnia request/response walkthrough

✅ **workflows/RAG-Query-Shakespeare.json** - Workflow file copied to project

## Next Steps

1. Rename your screenshots to match the filenames above
2. Move them to `assets/images/` directory
3. Verify the tutorial displays correctly
4. Commit and push the changes

## Query Workflow Summary

**6 nodes:**
1. Webhook (POST /rag-query) receives question
2. OpenAI generates embedding for the question
3. Qdrant searches for top 5 similar chunks
4. Code node builds RAG prompt with context
5. OpenAI Chat (GPT-4o) generates answer
6. Respond to Webhook returns the answer

**Demo question:** "Who is Marcius?"
**Demo answer:** "Marcius is a noble Roman soldier, renowned for his valor and leadership in battle..."

The workflow demonstrates semantic search working correctly - it found information about the character Marcius from Shakespeare's Coriolanus!
