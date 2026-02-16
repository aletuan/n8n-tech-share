# Step 11: AI Agents & Conversational Memory - Implementation Guide

## What Was Built

### 1. Shakespeare Conversational Agent Workflow
**File:** `workflows/Shakespeare-Conversation-Agent.json`

A complete conversational AI agent that:
- Remembers conversation history using SQLite
- Combines RAG (from Step 10's Shakespeare index) with chat memory
- Provides context-aware answers to follow-up questions
- Tracks sessions to isolate different user conversations

### 2. Tutorial Content
**File:** `content.json` (Step 11 added)

Comprehensive tutorial covering:
- What makes an agent vs simple RAG
- SQLite integration for conversation memory
- Context window management strategies
- Prompt engineering for combined RAG + chat history
- Session management best practices
- Performance optimization and cost management

---

## Setup Instructions

### Prerequisites
1. **Step 10 completed** - Shakespeare text indexed in Qdrant collection `tinyshakespeare`
2. **SQLite database** - Will be created automatically on first run
3. **n8n running** - Workflow requires n8n instance
4. **API keys configured**:
   - OpenAI API key (for embeddings and chat)
   - Qdrant API key (for vector search)

### Import Workflow

1. Open n8n
2. Click **Workflows** → **Import**
3. Select `workflows/Shakespeare-Conversation-Agent.json`
4. Configure credentials:
   - **SQLite** - Create new credential pointing to `conversations.db`
   - **OpenAI API** - Use existing credential from Step 8/10
   - **Qdrant API** - Use existing credential from Step 10

### SQLite Credential Setup

In n8n:
1. Go to **Credentials** → **Add Credential** → **SQLite**
2. Name: `SQLite - conversations.db`
3. Database file path: `/path/to/your/conversations.db` (can be relative to n8n root)
4. Save

The database will be created automatically on first workflow execution.

---

## Testing the Workflow

### Method 1: Using Insomnia (Recommended)

1. **Start the workflow** in n8n (activate webhook)

2. **Get webhook URL**:
   ```
   http://localhost:5678/webhook/shakespeare-chat
   ```

3. **First question** (new session):
   ```http
   POST http://localhost:5678/webhook/shakespeare-chat
   Content-Type: application/json

   {
     "question": "Who is Marcius?",
     "session_id": "demo-session-1"
   }
   ```

   **Expected response:**
   ```
   Marcius is a noble Roman soldier, renowned for his valor and leadership in battle...
   ```

4. **Follow-up question** (uses memory):
   ```http
   POST http://localhost:5678/webhook/shakespeare-chat
   Content-Type: application/json

   {
     "question": "What are his key characteristics?",
     "session_id": "demo-session-1"
   }
   ```

   **Expected response:**
   ```
   Based on our previous discussion about Marcius, his key characteristics include...
   ```

   ✅ **Notice:** The agent knows "his" refers to Marcius from the previous question!

5. **Another follow-up**:
   ```http
   POST http://localhost:5678/webhook/shakespeare-chat
   Content-Type: application/json

   {
     "question": "How does he interact with other characters?",
     "session_id": "demo-session-1"
   }
   ```

### Method 2: Using cURL

```bash
# Question 1
curl -X POST http://localhost:5678/webhook/shakespeare-chat \
  -H "Content-Type: application/json" \
  -d '{
    "question": "Who is Marcius?",
    "session_id": "demo-session-1"
  }'

# Question 2 (follow-up)
curl -X POST http://localhost:5678/webhook/shakespeare-chat \
  -H "Content-Type: application/json" \
  -d '{
    "question": "What are his key characteristics?",
    "session_id": "demo-session-1"
  }'
```

### Method 3: Using n8n Manual Execution

1. Open the workflow in n8n
2. Click **Execute Workflow**
3. Click on **Webhook** node
4. Click **Test webhook**
5. In the test panel, use:
   ```json
   {
     "body": {
       "question": "Who is Marcius?",
       "session_id": "test-123"
     }
   }
   ```

---

## Verifying Conversation Memory

### Check SQLite Database

```bash
# Open database
sqlite3 conversations.db

# View all conversations
SELECT * FROM conversations;

# View specific session
SELECT session_id, role, content, created_at
FROM conversations
WHERE session_id = 'demo-session-1'
ORDER BY created_at;

# Count messages per session
SELECT session_id, COUNT(*) as message_count
FROM conversations
GROUP BY session_id;
```

### Expected Database Contents

After 3 questions:
```
session_id      | role      | content                             | created_at
----------------|-----------|-------------------------------------|-------------------
demo-session-1  | user      | Who is Marcius?                     | 2026-02-16 10:00:00
demo-session-1  | assistant | Marcius is a noble Roman soldier... | 2026-02-16 10:00:02
demo-session-1  | user      | What are his key characteristics?   | 2026-02-16 10:01:15
demo-session-1  | assistant | His key characteristics include...  | 2026-02-16 10:01:18
demo-session-1  | user      | How does he interact with others?   | 2026-02-16 10:02:30
demo-session-1  | assistant | Marcius interacts with...           | 2026-02-16 10:02:33
```

---

## Workflow Node Details

### 1. Webhook
- **Path:** `/shakespeare-chat`
- **Method:** POST
- **Expected body:** `{ "question": string, "session_id": string }`
- **Response mode:** Wait for response

### 2. Initialize Database
- **Operation:** Execute Query
- **Query:** CREATE TABLE IF NOT EXISTS (idempotent)
- **Purpose:** Ensure schema exists

### 3. Load Chat History
- **Operation:** Execute Query
- **Query:** SELECT last 10 messages for session
- **Output:** Array of {role, content, created_at}

### 4. Generate Query Embedding
- **API:** OpenAI Embeddings
- **Model:** text-embedding-3-small
- **Input:** Current question
- **Output:** 1536-dimension vector

### 5. Vector Search (Qdrant)
- **Collection:** tinyshakespeare
- **Limit:** 3 chunks
- **With payload:** true (includes text)

### 6. Build RAG Prompt (Code Node)
- **Inputs:**
  - Chat history (from SQLite)
  - RAG context (from Qdrant)
  - Current question
- **Output:** Structured prompt combining all context

### 7. OpenAI Chat Model
- **Model:** chatgpt-4o-latest
- **Temperature:** 0.7
- **Input:** Combined prompt

### 8. Save Conversation
- **Operation:** Execute Query
- **Query:** INSERT 2 rows (user + assistant)
- **Purpose:** Store conversation turn

### 9. Respond to Webhook
- **Mode:** Text
- **Body:** Assistant's answer

---

## Screenshots Needed

For the tutorial, take screenshots of:

1. **Workflow Overview** (`agent-conversation-workflow.png`)
   - Full workflow canvas showing all 9 nodes

2. **Database Initialization** (`agent-db-initialize.png`)
   - Initialize Database node with CREATE TABLE query

3. **Load Chat History** (`agent-db-load-history.png`)
   - Load Chat History node showing SELECT query and output

4. **Save Messages** (`agent-db-save-messages.png`)
   - Save Conversation node with INSERT query

5. **Conversation Demo** (`agent-conversation-demo.png`)
   - Insomnia showing 3 sequential requests with follow-up questions

---

## Common Issues & Solutions

### Issue: "Table already exists" error
**Solution:** Change query to use `CREATE TABLE IF NOT EXISTS`

### Issue: Chat history not loading
**Causes:**
- Wrong session_id
- Database file path incorrect
- Index not created

**Solution:**
```sql
-- Verify data exists
SELECT * FROM conversations WHERE session_id = 'your-session-id';

-- Recreate index
CREATE INDEX IF NOT EXISTS idx_session_id ON conversations(session_id);
```

### Issue: Agent doesn't remember previous questions
**Causes:**
- Different session_id used
- Chat history node not connected properly
- Prompt not including history

**Debug:**
1. Check Build RAG Prompt node output - should include chat history
2. Verify Load Chat History returns data
3. Ensure same session_id used across requests

### Issue: Vector search returns no results
**Cause:** Step 10 indexing not completed or collection name mismatch

**Solution:**
```bash
# Verify Qdrant collection exists
curl -X GET "https://your-qdrant-url/collections/tinyshakespeare" \
  -H "api-key: your-api-key"

# Check point count
curl -X GET "https://your-qdrant-url/collections/tinyshakespeare" \
  -H "api-key: your-api-key" | jq '.result.points_count'
```

### Issue: SQL injection warning
**Solution:** Already handled with parameterized queries and single-quote escaping:
```javascript
.replace(/'/g, "''")  // Escape single quotes
```

---

## Environment Variables

Set these in n8n settings or `.env`:

```bash
# OpenAI
OPENAI_API_KEY=sk-...

# Qdrant
QDRANT_URL=https://your-qdrant-instance
QDRANT_API_KEY=your-api-key

# Optional: Custom OpenAI endpoint
OPENAI_API_BASE_URL=https://api.openai.com
```

---

## Next Steps

After Step 11 works:

1. **Add conversation summarization** - Condense old messages when > 20 turns
2. **Implement session timeout** - Auto-cleanup old conversations
3. **Add multi-knowledge base support** - Search different collections by topic
4. **Build conversation UI** - Simple chat interface
5. **Add tool calling** - Let agent decide when to use RAG vs other capabilities

---

## Performance Benchmarks

Expected latency per request:
- Database init: ~5ms (cached after first run)
- Load history: ~10ms
- Generate embedding: ~200ms
- Vector search: ~50ms
- Build prompt: ~5ms
- LLM generation: ~1-3 seconds
- Save conversation: ~10ms

**Total: ~1.5-3.5 seconds per request**

Optimization tips:
- Use database connection pooling (n8n handles automatically)
- Cache frequent queries
- Limit chat history to last 10 messages
- Use faster embedding model if needed

---

## Tutorial Integration

The Step 11 content has been added to `content.json` with:
- Introduction to conversational agents
- SQLite integration guide
- Prompt engineering for RAG + memory
- Session management patterns
- Performance and cost optimization
- Best practices

View in browser:
1. Open `index.html`
2. Navigate to **Step 11: AI Agents & Conversational Memory**
3. Follow the tutorial walkthrough

---

## Summary

✅ **Workflow created:** Shakespeare Conversational Agent
✅ **Tutorial content added:** Step 11 in content.json
✅ **Memory enabled:** SQLite conversation storage
✅ **Context-aware:** Combines RAG + chat history
✅ **Session isolated:** Multiple users can chat simultaneously

**Test it now:**
```bash
curl -X POST http://localhost:5678/webhook/shakespeare-chat \
  -H "Content-Type: application/json" \
  -d '{"question": "Who is Marcius?", "session_id": "test-1"}'
```
