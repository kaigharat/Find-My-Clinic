# 🔑 Complete Guide: Get Working Gemini API Key

## Step 1: Access Google AI Studio
1. Open your web browser
2. Go to: **https://makersuite.google.com/app/apikey**
3. Sign in with your **Google account** (Gmail)

## Step 2: Create API Key
1. Look for **"Create API key"** button
2. Click it (do NOT click "Create API key in new project" if you see billing warnings)
3. A new API key will be generated automatically
4. **Copy the key immediately** (it starts with `AIzaSy...`)

## Step 3: Enable Gemini API (CRITICAL)
1. Go to: **https://console.cloud.google.com/**
2. **Sign in** with the same Google account
3. **Create a new project** or **select existing project**
4. In the left sidebar, click **"APIs & Services"** → **"Library"**
5. In the search box, type: **"Generative Language API"**
6. Click on **"Generative Language API"** from results
7. Click the **"Enable"** button

## Step 4: Verify API Key Works
Run this command in your terminal:
```bash
node -e "
import { GoogleGenerativeAI } from '@google/generative-ai';
const genAI = new GoogleGenerativeAI('YOUR_API_KEY_HERE');
const model = genAI.getGenerativeModel({ model: 'gemini-pro' });
model.generateContent('Hello').then(r => console.log('✅ SUCCESS:', r.response.text())).catch(e => console.log('❌ FAILED:', e.message));
"
```

Replace `YOUR_API_KEY_HERE` with your actual key.

## Step 5: Update Your Project
1. Open your `.env` file
2. Replace the current `GEMINI_API_KEY` with your new working key
3. Save the file
4. Restart your development server: `npm run dev`

## Common Issues & Solutions

### ❌ "404 Not Found" Error
- **Cause**: API key not enabled for Gemini or wrong service
- **Solution**: Complete Step 3 above

### ❌ "API_KEY_INVALID" Error
- **Cause**: Invalid or expired API key
- **Solution**: Get a new key from Step 2

### ❌ "PERMISSION_DENIED" Error
- **Cause**: API not enabled in Google Cloud Console
- **Solution**: Complete Step 3

## Alternative: Use Google Cloud Console Directly

If Google AI Studio doesn't work:

1. Go to: https://console.cloud.google.com/
2. Create/select project
3. Go to "APIs & Services" → "Credentials"
4. Click "Create Credentials" → "API key"
5. Copy the key
6. Enable "Generative Language API" in Library

## Test Your Setup

Once you have a working key, your symptom analysis should show real AI analysis instead of "Service Temporarily Unavailable".

**Expected Result:**
- AI analysis with detailed medical insights
- No "Service Temporarily Unavailable" message
- Advanced symptom analysis powered by Gemini AI