# Bolo English — Tara Didi (Vercel version)

Ye wahi app hai jo pehle diya tha, bas **Vercel** par deploy karne ke liye restructure
kiya gaya hai (Render blocked hai to ye use karo).

```
bolo-english-vercel/
  api/
    chat.js          <- POST /api/chat  (conversation handle karta hai)
    providers.js      <- GET /api/providers (konsi API key set hai, bata deta hai)
    _providers/
      claude.js
      openai.js
      gemini.js
  public/
    index.html        <- Poora frontend
  package.json
```

## Deploy karne ke steps (bina terminal ke bhi ho sakta hai)

1. Is poore `bolo-english-vercel` folder ko GitHub par ek naye repository mein daalo
   (GitHub website se seedha "Add file → Upload files" se bhi ho sakta hai, terminal zaroori nahi)

2. https://vercel.com par jao, GitHub account se sign up/login karo

3. "**Add New**" → "**Project**" → apna GitHub repo select karo → "**Import**"

4. Vercel khud pehchan lega ki ye Node project hai. Kuch settings pooche toh default hi rehne do.

5. "**Environment Variables**" section mein (Deploy karne se pehle ya baad mein
   Project → Settings → Environment Variables mein) add karo:
   - `GEMINI_API_KEY` = apni AI Studio wali key
   - `GEMINI_MODEL` = `gemini-3.1-flash-lite`

6. "**Deploy**" dabao — 1-2 minute mein live link milega:
   `https://bolo-english-xxxx.vercel.app`

Bas — wahi link kahin bhi (Android Chrome, iPhone Safari, computer) khol sakte ho.

## Baad mein Claude/ChatGPT add karna

Project → Settings → Environment Variables mein `ANTHROPIC_API_KEY` ya
`OPENAI_API_KEY` add kar do, phir "Redeploy" dabao. Wo button bhi active ho jayega.

## Note

Agar Environment Variable add/change karte ho, Vercel ko **naye sirse deploy** karna
padta hai taaki wo values use ho — dashboard mein "Redeploy" button dabana mat bhoolna.
