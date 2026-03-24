# Gemini AI Integration Setup

## ✅ Completed Steps

1. **Package installed**: `@google/generative-ai`
2. **API endpoints created**:
   - `app/api/ai/chat/route.ts` - Chatbot FAQ
   - `app/api/ai/classify/route.ts` - Auto-classify enquiries
   - `app/api/ai/suggest/route.ts` - Category suggestion
   - `app/api/ai/search/route.ts` - AI-powered search
   - `app/api/ai/analytics/route.ts` - Analytics insights
3. **Environment variable**: GEMINI_API_KEY is configured in `.env.local`

## ⚙️ Database Setup

Run the following SQL in your Supabase SQL Editor:

```sql
ALTER TABLE users ADD COLUMN IF NOT EXISTS specialty TEXT;
```

This adds a `specialty` column to track SSO officer specializations (e.g., "Academic", "Visa & International", etc.)

## 🚀 API Endpoints Reference

### 1. Chat Endpoint
**POST** `/api/ai/chat`
```json
{
  "message": "Can I change my course?",
  "history": [
    { "role": "user", "content": "Hi" },
    { "role": "assistant", "content": "Hello! How can I help?" }
  ]
}
```
Response: `{ reply: string, escalate: boolean }`

### 2. Classify Endpoint
**POST** `/api/ai/classify`
```json
{
  "title": "Need accommodation for exam",
  "description": "I have a medical condition..."
}
```
Response: `{ complexity: "general"|"complex", category: string, priority: string, suggested_response: string, assigned_to: string|null }`

### 3. Suggest Category Endpoint
**POST** `/api/ai/suggest`
```json
{
  "text": "I need help with my visa application"
}
```
Response: `{ category: string, confidence: number }`

### 4. Search Endpoint
**POST** `/api/ai/search`
```json
{
  "query": "How do I withdraw from a course?"
}
```
Response: `{ answer: string, sources: [{id, title, type}] }`

### 5. Analytics Endpoint
**POST** `/api/ai/analytics`
```json
{
  "period": "30"
}
```
Response: `{ summary: string, metrics: object, trends: array }`

## 🔍 Features Implemented

- ✅ **Gemini 1.5 Flash Model** for fast responses
- ✅ **Error Handling** with fallback values for all endpoints
- ✅ **Escalation Detection** in chatbot (mentions [ESCALATE] if complex)
- ✅ **SSO Assignment** based on specialty matching for complex cases
- ✅ **Knowledge Base Search** synthesizing answers from resolved enquiries
- ✅ **Analytics Generation** with insights on enquiry trends

## 📝 Troubleshooting

1. **"Gemini API key not configured"** - Ensure `GEMINI_API_KEY` is set in `.env.local`
2. **Slow responses** - Using `gemini-2.0-flash` for speed optimization
3. **Parse errors** - All endpoints return fallback responses on JSON parsing failures
4. **Database connection** - Verify Supabase credentials in `.lib/supabase/`

## 🎯 Next Steps (Frontend Integration)

When ready to integrate with frontend:
1. Add chatbot UI component to layout
2. Integrate classify/suggest into enquiry creation flow
3. Add search feature to search page
4. Add analytics dashboard for SSO officers
5. Create feedback collection mechanism for enquiries

---

**Setup Date**: 2026-03-24
**Gemini Model**: gemini-2.0-flash
