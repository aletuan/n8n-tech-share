# Smart Email Responder - Setup Guide

This guide explains how to import, configure, and test the AI-powered email responder workflow.

## 📦 Workflow Overview

**Smart Email Responder.json** - Demonstrates AI integration with:
1. Sample email input
2. Sentiment analysis using OpenAI
3. AI-generated response
4. Formatted output

## 🚀 Setup Instructions

### Step 1: Import Workflow

1. Open n8n
2. Click **Import from File**
3. Import `Smart Email Responder.json`

### Step 2: Configure OpenAI Credentials

You need an OpenAI API key:

1. Go to [OpenAI Platform](https://platform.openai.com/api-keys)
2. Create an API key
3. In n8n, go to **Credentials**
4. Add **OpenAI** credential
5. Paste your API key
6. Save credential

### Step 3: Update OpenAI Nodes

Both "Analyze Sentiment" and "Generate Response" nodes need credentials:

1. Click on **Analyze Sentiment** node
2. Select your OpenAI credential from dropdown
3. Click on **Generate Response** node
4. Select the same OpenAI credential
5. Save workflow

---

## 🎬 Testing the Workflow

### Execute Workflow

**What to do:**
1. Click **Execute workflow** button

**What happens:**
- ✅ Sample Email creates test email data
- ✅ Analyze Sentiment sends email to OpenAI for sentiment analysis
- ✅ Generate Response creates personalized reply based on sentiment
- ✅ Format Output displays complete result

**Expected Output:**
```json
{
  "originalFrom": "customer@example.com",
  "originalSubject": "Question about my order #12345",
  "originalBody": "Hi, I ordered a product last week but haven't received a shipping confirmation yet. Can you help me track my order? I'm getting a bit worried.",
  "detectedSentiment": "negative",
  "aiResponse": "Dear Customer,\n\nThank you for reaching out to us. I understand your concern about not receiving a shipping confirmation for order #12345. I apologize for any worry this may have caused.\n\nI'm looking into your order right now and will send you the tracking information within the next hour. Our team is committed to ensuring you receive your product as quickly as possible.\n\nThank you for your patience.\n\nBest regards,\nCustomer Support Team",
  "processedAt": "2026-02-12 20:00:00",
  "status": "✅ Response Generated"
}
```

---

## 🎯 Key Learning Points

### 1. AI Node Configuration
- Model: GPT-3.5-turbo (fast, cost-effective)
- Temperature: 0.3 for sentiment (focused), 0.7 for response (creative)
- Max Tokens: Controls response length

### 2. Prompt Engineering
- Clear instructions for AI
- Context included (sentiment, original email)
- Role definition ("helpful customer service representative")

### 3. Chaining AI Calls
- First call: Analyze sentiment
- Second call: Use sentiment to generate contextual response
- Each step builds on previous output

### 4. Accessing Previous Node Data
- `$('Sample Email').item.json.from` - Get data from Sample Email node
- `$('Analyze Sentiment').item.json.message.content` - Get AI response
- `$json.message.content` - Get current node's AI response

---

## 📸 Screenshots Needed

For step 8 tutorial, capture these 3 screenshots:

1. **ai-email-responder-workflow.png** - Full workflow showing all 5 nodes connected
2. **ai-openai-config.png** - Generate Response node configuration panel showing prompt and settings
3. **ai-response-output.png** - Format Output node showing the complete result with AI-generated response

---

## 🔧 Customization Options

### Change the Sample Email
Edit the "Sample Email" node assignments:
- Test different tones (angry, happy, confused)
- Different scenarios (refund, question, complaint)
- Different lengths

### Adjust AI Parameters

**For Sentiment Analysis:**
- Lower temperature (0.1-0.3) = More consistent
- Higher temperature (0.4-0.7) = More nuanced

**For Response Generation:**
- Lower temperature (0.5-0.7) = More professional
- Higher temperature (0.8-1.0) = More creative

### Add More Steps
Extend the workflow:
- Add language detection
- Add priority scoring
- Add automatic email sending
- Log responses to database

---

## 💰 Cost Management

Each execution makes **2 API calls**:
1. Sentiment analysis (~50 tokens)
2. Response generation (~200 tokens)

**Approximate cost per execution:** $0.001-0.002 (less than a penny)

For production:
- Set up API usage limits in OpenAI dashboard
- Monitor token usage with Set nodes
- Consider caching common responses

---

## 🐛 Troubleshooting

### "No credentials configured"
- ✅ Add OpenAI credential in n8n
- ✅ Select credential in both AI nodes
- ✅ Verify API key is active

### "Rate limit exceeded"
- ✅ Check OpenAI dashboard for usage
- ✅ Upgrade OpenAI plan if needed
- ✅ Add retry logic with wait time

### AI response is too short/long
- ✅ Adjust maxTokens parameter
- ✅ Modify prompt to request specific length
- ✅ Use system message for consistent formatting

---

**Ready to test?** Import the workflow and configure OpenAI credentials! 🚀
