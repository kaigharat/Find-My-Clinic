# 🚀 COMPLETE GEMINI API SETUP GUIDE (Step-by-Step)

## ❌ CURRENT STATUS
Your current API key returns **404 Not Found** error.
This means the Generative Language API is NOT enabled for your Google Cloud project.

## ✅ SOLUTION: Enable Generative Language API

### STEP 1: Open Google Cloud Console
**EXACT URL:** https://console.cloud.google.com/
- Sign in with your Google account
- Make sure you're signed in with the SAME account you used for Google AI Studio

### STEP 2: Select/Create Project
- At the top of the page, click the **project dropdown**
- If you see projects, select one
- If no projects exist, click **"NEW PROJECT"**
- Give it a name like "ClinicFinder AI"
- Click **"CREATE"**

### STEP 3: Go to APIs & Services
- In the left sidebar, click **"APIs & Services"**
- Then click **"Library"**

### STEP 4: Find Generative Language API
- In the search box at the top, type: `Generative Language API`
- **IMPORTANT:** Make sure it says "Generative Language API" by Google
- Click on it

### STEP 5: Enable the API
- On the API page, click the **blue "ENABLE" button**
- Wait for it to finish enabling (may take a few seconds)

### STEP 6: Verify API is Enabled
- Go back to **"APIs & Services"** → **"Library"**
- Search again for "Generative Language API"
- You should see **"API enabled"** with a green checkmark

## 🔑 GET A FRESH API KEY

### Option A: From Google AI Studio (Recommended)
1. Go to: https://makersuite.google.com/app/apikey
2. Click **"Create API key"**
3. Copy the new key

### Option B: From Google Cloud Console
1. Go to: https://console.cloud.google.com/
2. Go to **"APIs & Services"** → **"Credentials"**
3. Click **"+ CREATE CREDENTIALS"** → **"API key"**
4. Copy the key

## 🧪 TEST YOUR NEW SETUP

Run this command in your terminal:
```bash
node -e "
import { GoogleGenerativeAI } from '@google/generative-ai';
const genAI = new GoogleGenerativeAI('YOUR_NEW_API_KEY');
const model = genAI.getGenerativeModel({ model: 'gemini-pro' });
model.generateContent('Test').then(r => {
  console.log('✅ SUCCESS!');
  console.log('Response:', r.response.text());
}).catch(e => {
  console.log('❌ Still failed:', e.message);
});
"
```

Replace `YOUR_NEW_API_KEY` with your actual key.

## 📝 UPDATE YOUR PROJECT

1. Open your `.env` file
2. Replace the current `GEMINI_API_KEY` with your new working key
3. Save the file
4. Restart your dev server: `npm run dev`

## 🎯 EXPECTED RESULT

After completing all steps:
- ✅ Symptom analysis shows real Gemini AI analysis
- ✅ No more "Service Temporarily Unavailable" message
- ✅ Advanced AI-powered medical insights

## 🔍 TROUBLESHOOTING

### Still getting 404?
- Double-check you're in the right Google Cloud project
- Make sure Generative Language API shows "API enabled"
- Try creating a new API key

### Still getting errors?
- Make sure you're using the same Google account everywhere
- Try a different browser or incognito mode
- Check if you have billing enabled (sometimes required)

## 📞 NEED HELP?

If you still can't get it working after following these exact steps, please:
1. Take a screenshot of your Google Cloud Console APIs page
2. Show me the exact error message you're getting
3. Tell me which step is failing

**Follow these steps EXACTLY and your Gemini AI will work!** 🚀