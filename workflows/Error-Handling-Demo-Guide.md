# Error Handling Demo - Setup Guide

This guide explains how to import, configure, and test the error handling demo workflows.

## 📦 Workflows Included

1. **API Data Fetcher with Error Handling.json** - Main workflow demonstrating error handling
2. **API Error Monitor.json** - Error Trigger workflow for critical failures

---

## 🚀 Setup Instructions

### Step 1: Import Both Workflows

1. Open n8n
2. Click **Import from File**
3. Import `API Data Fetcher with Error Handling.json`
4. Import `API Error Monitor.json`

### Step 2: Configure Gmail Credentials

Both workflows use Gmail to send alerts. You need to set up Gmail credentials:

1. Go to **Credentials** in n8n
2. Add **Gmail OAuth2** credential
3. Follow the authentication flow
4. Update the email addresses in both workflows:
   - Main workflow: `admin@company.com` → your email
   - Error Monitor: `admin@company.com, team-lead@company.com` → your emails

### Step 3: Activate Error Monitor

⚠️ **Important:** The Error Trigger workflow must be **ACTIVE** to catch errors.

1. Open `API Error Monitor` workflow
2. Click the **Active** toggle at the top
3. Verify it shows "Active"

---

## 🎬 Testing the Workflows

### Test 1: Success Scenario (Happy Path)

**What to do:**
1. Open `API Data Fetcher with Error Handling` workflow
2. Click **Execute workflow**

**What happens:**
- ✅ HTTP Request succeeds (gets user from JSONPlaceholder API)
- ✅ IF node routes to TRUE path
- ✅ Process Data extracts user info
- ✅ Display Success shows final result

**Expected Output:**
```json
{
  "status": "success",
  "userName": "Leanne Graham",
  "userEmail": "Sincere@april.biz",
  "userPhone": "1-770-736-8031 x56442",
  "processedAt": "2026-02-12 16:45:00",
  "message": "User data retrieved successfully",
  "finalStatus": "✅ SUCCESS",
  "summary": "Retrieved data for Leanne Graham",
  "timestamp": "2026-02-12T16:45:00.000Z"
}
```

---

### Test 2: API Failure (Error Path)

**What to do:**
1. Open `API Data Fetcher with Error Handling` workflow
2. Click on the **HTTP Request** node
3. Change the URL to: `https://jsonplaceholder.typicode.com/users/999999` (invalid ID)
4. Click **Execute workflow**

**What happens:**
- ❌ HTTP Request fails (404 Not Found)
- ✅ Continue on Fail prevents crash
- ✅ IF node routes to FALSE path
- ✅ Format Error Details prepares alert
- 📧 Gmail sends error alert to admin

**Expected Output at IF Node:**
```json
{
  "error": {
    "message": "Request failed with status code 404",
    "httpCode": 404,
    "description": "Not Found"
  }
}
```

**Expected Output at Send Error Alert:**
```json
{
  "status": "failed",
  "errorMessage": "Request failed with status code 404",
  "errorCode": "404",
  "failedAt": "2026-02-12 16:45:00",
  "alertMessage": "⚠️ API Call Failed: Request failed with status code 404"
}
```

**Email Received:**
```
Subject: 🚨 API Error Alert - 2026-02-12 16:45:00

🚨 API Call Failed

Error: Request failed with status code 404
HTTP Code: 404
Time: 2026-02-12 16:45:00
Workflow: API Data Fetcher

This is an automated alert from n8n. Please investigate immediately.
```

---

### Test 3: Critical Failure (Error Trigger)

**What to do:**
1. Open `API Data Fetcher with Error Handling` workflow
2. Click on the **HTTP Request** node
3. Change the URL to: `https://invalid-domain-that-does-not-exist-12345.com/api`
4. **Disable** "Continue on Fail" in the HTTP Request node settings
5. Click **Execute workflow**

**What happens:**
- ❌ HTTP Request crashes (DNS error)
- ❌ Workflow stops immediately
- 🔥 Error Trigger workflow activates automatically
- 📧 Critical alert email sent to team

**Expected Critical Email:**
```
Subject: 🔥 CRITICAL: Workflow Failure - HTTP Request - Get User Data

🔥 Critical Workflow Failure

Execution Details:

• Workflow: API Data Fetcher with Error Handling
• Failed Node: HTTP Request - Get User Data
• Error: getaddrinfo ENOTFOUND invalid-domain...
• Execution ID: abc123xyz
• Time: 2026-02-12 16:45:00

⚠️ This is a critical error that requires immediate attention.
The workflow could not recover using Continue on Fail.

Error Trigger Workflow - Automated Monitoring
```

---

## 📊 Workflow Comparison

| Aspect | Main Workflow | Error Monitor |
|--------|---------------|---------------|
| **Purpose** | Process API calls with error handling | Catch critical failures |
| **Trigger** | Manual | Error Trigger |
| **Handles** | Expected errors (API fails) | Unexpected crashes |
| **Alert Level** | Warning (🚨) | Critical (🔥) |
| **Active?** | Run on demand | Must be ACTIVE |

---

## 🎯 Key Learning Points

### 1. Continue on Fail
- Enabled on HTTP Request node
- Prevents workflow from crashing
- Returns error object instead
- Essential for production workflows

### 2. IF Node Validation
- Checks if `$json.id` exists (present in successful API response)
- Routes to success or error path
- More reliable than checking if error doesn't exist

### 3. Error Trigger
- Separate workflow, always active
- Catches what Continue on Fail can't
- Safety net for unexpected failures
- Sends critical alerts

### 4. Retry Logic
- HTTP Request has built-in retry
- 3 attempts with 1 second delay
- Handles transient network issues

---

## 🔧 Customization Options

### Change API Endpoint
Current: `https://jsonplaceholder.typicode.com/users/1`

Replace with your own API:
- Internal company API
- Weather API
- Database query API
- Any REST endpoint

### Add More Error Handlers
Add additional nodes to the error path:
- Log to Google Sheets
- Create Jira ticket
- Send Slack message
- Write to database

### Enhance Success Path
Add more processing after success:
- Store in database
- Trigger another workflow
- Update dashboard
- Send confirmation

---

## 🐛 Troubleshooting

### Error Trigger Not Firing
- ✅ Check that `API Error Monitor` is ACTIVE
- ✅ Verify workflow name matches exactly
- ✅ Make sure error actually crashed the workflow

### Gmail Not Sending
- ✅ Verify Gmail credentials are configured
- ✅ Check OAuth2 token hasn't expired
- ✅ Verify email addresses are correct
- ✅ Check spam folder

### HTTP Request Always Succeeds
- ✅ Use invalid URL to test failure: `/users/999999`
- ✅ Or disable internet to test timeout
- ✅ Or use `https://httpstat.us/500` for 500 error

---

## 📸 Visual Demo Suggestions

For step 7 tutorial, capture these screenshots:

1. **Workflow Overview** - Full workflow showing both paths
2. **Success Path** - HTTP Request → IF → Process → Success
3. **Error Path** - HTTP Request → IF → Format → Alert
4. **IF Node Detail** - Showing error check condition
5. **Error Alert Email** - Gmail showing received alert
6. **Error Trigger Workflow** - Separate monitoring workflow
7. **Critical Alert Email** - Gmail showing critical alert

---

## 💡 Next Steps

After mastering error handling, explore:
- Adding retry with exponential backoff
- Implementing circuit breaker pattern
- Logging errors to monitoring service
- Building error dashboard
- Setting up PagerDuty/OpsGenie integration

---

## 🎓 Production Best Practices

1. ✅ **Always enable Continue on Fail** for external API calls
2. ✅ **Always validate input** before expensive operations
3. ✅ **Always set up Error Trigger** for critical workflows
4. ✅ **Always include context** in error messages (execution ID, timestamp)
5. ✅ **Always test failure paths** - don't just test success
6. ✅ **Always monitor actively** - set up alerts for your monitoring

---

**Ready to import and test?** Follow the setup instructions above! 🚀
