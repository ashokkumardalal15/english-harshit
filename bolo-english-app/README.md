# Bolo English — Tara Didi

Ek chhota real app jisme bacha voice se English bole aur AI (Tara Didi) natural conversation
karti hai, gently grammar correct karte hue. Teen AI providers mein se koi bhi chalu kar sakte ho:
**Gemini** (free tier se shuru), **Claude**, ya **ChatGPT (OpenAI)** — bina code badle, app ke
andar hi button se switch ho jata hai.

```
bolo-english-app/
  backend/
    server.js              <- Express server, saari API calls yahin se hoti hain
    providers/
      gemini.js             <- Gemini API adapter
      claude.js              <- Claude API adapter
      openai.js               <- ChatGPT API adapter
    public/
      index.html            <- Poora frontend (ek hi file, koi build step nahi)
    package.json
    .env.example            <- API keys ka template
```

## 1. Local par test karna

```bash
cd backend
npm install
cp .env.example .env
```

`.env` file kholo aur sirf **GEMINI_API_KEY** bharo (baaki khaali chhod do abhi):

1. https://aistudio.google.com/ par jao, Google account se sign in karo
2. "Get API key" par click karo, naya key banao
3. Us key ko `.env` mein `GEMINI_API_KEY=` ke aage paste karo

Phir server chalao:

```bash
npm start
```

Browser mein kholo: `http://localhost:3000`

> Note: Friend ki Gemini app ki "Pro" subscription is API key se **alag cheez** hai — AI Studio
> ka free tier khud ka hai, alag se paisa nahi lagega abhi (Flash-Lite model free tier mein hai,
> bas roz ki request-limit hai).

## 2. Real hosting par daalna (free tier)

Koi bhi Node.js-supporting host chalega — **Render** sabse aasan hai:

1. Is poore `bolo-english-app` folder ko GitHub par ek naye repository mein push karo
2. https://render.com par jao, GitHub se sign in karo
3. "New +" → "Web Service" → apna repo select karo
4. Settings:
   - **Root Directory**: `backend`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
5. "Environment" tab mein jaake yahi variables add karo (jo `.env` mein the):
   - `GEMINI_API_KEY` = (apni key)
   - `GEMINI_MODEL` = `gemini-3.1-flash-lite`
   - (baad mein chaho toh `ANTHROPIC_API_KEY` aur `OPENAI_API_KEY` bhi add kar sakte ho)
6. "Create Web Service" dabao — kuch minute mein ek live URL milega (jaise `https://bolo-english.onrender.com`)

Bas — ab wo URL kisi ke saath bhi share kar sakte ho, unhe kuch install nahi karna, bas link kholna hai.

## 3. Baad mein Claude/ChatGPT add karna

Jab chaho, Render ke "Environment" tab mein `ANTHROPIC_API_KEY` (from console.anthropic.com) ya
`OPENAI_API_KEY` (from platform.openai.com) daal do — app khud detect kar lega aur wo button bhi
active ho jayega upar. Koi code change nahi chahiye.

## Zaroori baatein

- **Cost**: Gemini Flash-Lite abhi free tier mein hai (roz ki limit ke saath). Claude aur
  ChatGPT dono paid hain per-use (bahut kam, paise cents mein) — jab tak unki API key nahi
  daaloge, wo button bas disabled dikhega.
- **Voice**: Mic aur "sunao" wali awaaz seedha user ke browser mein chalti hai (Web Speech API),
  isliye wo bhi free hai — sirf AI ka jawaab backend se aata hai.
- **Model names badalte rehte hain**: Agar kabhi "model not found" jaisa error aaye, `providers/`
  wali files mein model ka naam check karke update kar dena (comments mein current model likha hai).
