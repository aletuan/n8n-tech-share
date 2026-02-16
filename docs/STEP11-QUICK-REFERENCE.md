# Step 11: Quick Reference Guide

## 🚀 Quick Start Commands

### Test Conversation
```bash
# First question
curl -X POST http://localhost:5678/webhook/shakespeare-chat \
  -H "Content-Type: application/json" \
  -d '{"question": "Who is Marcius?", "session_id": "test-1"}'

# Follow-up (uses memory)
curl -X POST http://localhost:5678/webhook/shakespeare-chat \
  -H "Content-Type: application/json" \
  -d '{"question": "What are his characteristics?", "session_id": "test-1"}'
```

### Check Database
```bash
sqlite3 conversations.db "SELECT * FROM conversations ORDER BY created_at DESC LIMIT 10;"
```

### Clean Database
```bash
sqlite3 conversations.db "DELETE FROM conversations WHERE session_id = 'test-1';"
```

---

## 📋 SQL Patterns

### Initialize Database
```sql
CREATE TABLE IF NOT EXISTS conversations (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  session_id TEXT NOT NULL,
  role TEXT NOT NULL,
  content TEXT NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX IF NOT EXISTS idx_session_id ON conversations(session_id);
```

### Load History (Last 10)
```sql
SELECT role, content, created_at
FROM conversations
WHERE session_id = ?
ORDER BY created_at DESC
LIMIT 10
```

### Save Message Pair
```sql
INSERT INTO conversations (session_id, role, content)
VALUES
  (?, 'user', ?),
  (?, 'assistant', ?);
```

### View Specific Session
```sql
SELECT * FROM conversations
WHERE session_id = 'demo-session-1'
ORDER BY created_at;
```

### Count Messages per Session
```sql
SELECT session_id, COUNT(*) as count
FROM conversations
GROUP BY session_id;
```

### Cleanup Old Conversations
```sql
DELETE FROM conversations
WHERE created_at < datetime('now', '-7 days');
```

---

## 🧩 Code Snippets

### Build RAG Prompt (Code Node)
```javascript
// Extract chat history
const historyItems = $input.first().json;
const chatHistory = Array.isArray(historyItems)
  ? historyItems.reverse().map(msg => `${msg.role}: ${msg.content}`).join('\n')
  : '';

// Extract RAG context
const searchResults = $('Vector Search (Qdrant)').first().json.result || [];
const ragContext = searchResults
  .map(item => item.payload.text)
  .join('\n\n---\n\n');

// Get question
const question = $('Webhook').first().json.body.question;

// Build prompt
const prompt = `You are a helpful assistant with expertise in Shakespeare's works.

Relevant excerpts from Shakespeare:
${ragContext}

Conversation history:
${chatHistory || 'No previous conversation'}

User question: ${question}

Answer based on the Shakespeare excerpts provided and the conversation history.`;

return {
  json: {
    prompt,
    question,
    session_id: $('Webhook').first().json.body.session_id
  }
};
```

### Escape SQL Single Quotes
```javascript
// In Save Conversation node
const content = $json.message.content.replace(/'/g, "''");
```

### Session ID Generation (Client-side)
```javascript
// Option 1: UUID
const sessionId = crypto.randomUUID();

// Option 2: User-based
const sessionId = `user-${userId}-${Date.now()}`;

// Option 3: Simple timestamp
const sessionId = `session-${Date.now()}`;
```

---

## 🎯 Common Patterns

### Fallback for Low RAG Score
```javascript
if (ragResults.length === 0 || ragResults[0].score < 0.6) {
  prompt = `The user asked: "${question}"

  I couldn't find relevant information in the knowledge base.
  Provide a helpful general answer, but mention this is based on
  general knowledge, not the specific knowledge base.`;
}
```

### Conversation Summarization (after 20 turns)
```javascript
if (messageCount > 20) {
  // Get old messages
  const oldMessages = await getMessages(session_id, offset: 10);

  // Summarize
  const summary = await llm.summarize(oldMessages);

  // Store summary
  await storeConversationSummary(session_id, summary);

  // Delete old messages
  await deleteMessages(session_id, before_id: message_id);
}
```

### Rate Limiting
```sql
-- Count recent messages
SELECT COUNT(*) as count
FROM conversations
WHERE session_id = ?
AND created_at > datetime('now', '-1 hour');

-- In workflow:
if (count > 100) {
  return { error: 'Rate limit exceeded' };
}
```

---

## 🔧 Debugging Commands

### View Latest Execution
```sql
SELECT * FROM conversations
ORDER BY created_at DESC
LIMIT 20;
```

### Check Session Exists
```sql
SELECT COUNT(*) as exists
FROM conversations
WHERE session_id = 'demo-session-1';
```

### Find Empty Sessions
```sql
SELECT session_id, COUNT(*) as count
FROM conversations
GROUP BY session_id
HAVING count = 0;
```

### Verify Index
```sql
.indexes conversations
-- Should show: idx_session_id
```

---

## 📊 Performance Monitoring

### Latency Targets
```
Database operations:    < 50ms
Generate embedding:     < 300ms
Vector search:          < 100ms
LLM generation:         < 3sec
Total:                  < 3.5sec
```

### Token Budget (GPT-4o, 128k context)
```
System message:         ~100 tokens
RAG context (3 chunks): ~1500 tokens
Chat history (10 msgs): ~2000 tokens
Current question:       ~50 tokens
────────────────────────────────
Total prompt:           ~3650 tokens (safe!)
```

### Cost per Request
```
Embedding:      $0.00001
Vector search:  Free (self-hosted)
LLM (GPT-4o):   $0.01-0.03
────────────────────────────
Total:          ~$0.01-0.03
```

---

## 🎨 Workflow Node Configuration

### 1. Webhook
```
Path: /shakespeare-chat
Method: POST
Response Mode: Wait for response
```

### 2. SQLite - Initialize
```
Operation: Execute Query
Query: CREATE TABLE IF NOT EXISTS...
```

### 3. SQLite - Load History
```
Operation: Execute Query
Query: SELECT ... WHERE session_id = '{{ $json.body.session_id }}' ... LIMIT 10
```

### 4. HTTP Request - Embedding
```
URL: https://api.openai.com/v1/embeddings
Body: {
  "model": "text-embedding-3-small",
  "input": "{{ $('Webhook').item.json.body.question }}"
}
```

### 5. HTTP Request - Vector Search
```
URL: {{ $env.QDRANT_URL }}/collections/tinyshakespeare/points/search
Body: {
  "vector": {{ $json.data[0].embedding }},
  "limit": 3,
  "with_payload": true
}
```

### 6. Code - Build RAG Prompt
```javascript
// See "Code Snippets" section above
```

### 7. OpenAI Chat Model
```
Model: chatgpt-4o-latest
Temperature: 0.7
Text: {{ $json.prompt }}
```

### 8. SQLite - Save Conversation
```
Operation: Execute Query
Query: INSERT INTO conversations ... VALUES (...), (...)
```

### 9. Respond to Webhook
```
Respond With: Text
Response Body: {{ $('OpenAI Chat Model').first().json.message.content }}
```

---

## 🧪 Testing Checklist

- [ ] Import workflow successfully
- [ ] Configure all credentials (SQLite, OpenAI, Qdrant)
- [ ] Activate workflow
- [ ] Send first question → get response
- [ ] Send follow-up question → agent remembers context
- [ ] Check database → both messages stored
- [ ] Use different session_id → separate conversation
- [ ] Verify RAG context is included (check Build RAG Prompt node)
- [ ] Test edge cases (empty question, long conversation, special characters)

---

## 🐛 Troubleshooting

### Problem: "Table doesn't exist"
**Fix:** Ensure Initialize Database node runs first

### Problem: Agent doesn't remember
**Check:**
1. Same session_id used?
2. Load Chat History returns data?
3. Build RAG Prompt includes history?

### Problem: No RAG results
**Fix:** Verify Step 10 indexing completed
```bash
curl -X GET "https://your-qdrant/collections/tinyshakespeare" -H "api-key: your-key"
```

### Problem: SQL errors
**Check:** Single quotes escaped in content
```javascript
.replace(/'/g, "''")
```

---

## 📁 File Locations

```
workflows/
  └── Shakespeare-Conversation-Agent.json

content.json
  └── Step 11 content added

docs/
  ├── STEP11-PROPOSAL.md          (original planning)
  ├── STEP11-IMPLEMENTATION.md    (setup guide)
  ├── STEP11-SUMMARY.md           (overview)
  └── STEP11-QUICK-REFERENCE.md   (this file)

assets/images/
  ├── agent-conversation-workflow.png
  ├── agent-db-initialize.png
  ├── agent-db-load-history.png
  ├── agent-db-save-messages.png
  └── agent-conversation-demo.png
```

---

## 🎯 Key Concepts

| Concept | Description |
|---------|-------------|
| **Session ID** | Isolates conversations between users |
| **Sliding Window** | Keep last N messages (prevents token overflow) |
| **RAG + Memory** | Combine knowledge base with chat history |
| **Idempotent Init** | Safe to run CREATE TABLE multiple times |
| **Context Merging** | RAG first, history second, question last |
| **Atomic Save** | Store user + assistant in one query |

---

## 💡 Tips

1. **Always use same session_id** for related questions
2. **Limit history to 10 messages** to control token usage
3. **Escape single quotes** in SQL content
4. **Monitor token count** to avoid hitting limits
5. **Test with different sessions** to verify isolation
6. **Check database regularly** during development
7. **Use UUIDs for session_id** in production

---

## 🚀 Next Steps

1. **Take screenshots** for tutorial
2. **Test multi-turn conversations** (3+ exchanges)
3. **Verify database persistence** across workflow restarts
4. **Experiment with different prompts** in Build RAG Prompt node
5. **Add conversation summarization** for long histories
6. **Implement session timeout** cleanup

---

## 📞 Quick Help

- **View workflow:** Open n8n → Workflows → Shakespeare Conversation Agent
- **Test endpoint:** `http://localhost:5678/webhook/shakespeare-chat`
- **Check database:** `sqlite3 conversations.db`
- **View tutorial:** Open `index.html` → Step 11

---

**Happy building!** 🎉
