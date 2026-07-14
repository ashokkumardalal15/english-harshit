require("dotenv").config();
const express = require("express");
const path = require("path");

const { callClaude } = require("./providers/claude");
const { callOpenAI } = require("./providers/openai");
const { callGemini } = require("./providers/gemini");

const app = express();
app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

const SYSTEM_PROMPT = `You are "Tara Didi", a warm, patient English-speaking companion for a young Indian child (age 5-10) who is learning to speak English. Have a natural, encouraging spoken conversation about everyday topics like food, family, school, animals, and daily routine.

Rules for every reply:
- Keep replies SHORT: 1-3 simple sentences, in English only.
- If the child's last message has a grammar or vocabulary mistake, gently weave in the corrected sentence (for example: "Nice! You can also say: I ate a mango.") before continuing.
- Always end with a friendly follow-up question to keep the conversation going, unless the child clearly wants to stop.
- Never scold or make the child feel bad about a mistake - always encouraging, like a kind elder sister ("Didi").
- Vocabulary and grammar should stay at a beginner level appropriate for a young child.`;

// Which providers are configured on this server (used by the frontend to grey out missing ones)
app.get("/api/providers", (req, res) => {
  res.json({
    claude: Boolean(process.env.ANTHROPIC_API_KEY),
    openai: Boolean(process.env.OPENAI_API_KEY),
    gemini: Boolean(process.env.GEMINI_API_KEY),
  });
});

app.post("/api/chat", async (req, res) => {
  const { provider, history = [], message } = req.body || {};

  if (!message || !message.trim()) {
    return res.status(400).json({ error: "message is required" });
  }
  if (!["claude", "openai", "gemini"].includes(provider)) {
    return res.status(400).json({ error: `Unknown provider: ${provider}` });
  }

  try {
    let reply;
    if (provider === "claude") {
      reply = await callClaude({ systemPrompt: SYSTEM_PROMPT, history, message });
    } else if (provider === "openai") {
      reply = await callOpenAI({ systemPrompt: SYSTEM_PROMPT, history, message });
    } else {
      reply = await callGemini({ systemPrompt: SYSTEM_PROMPT, history, message });
    }
    res.json({ reply });
  } catch (err) {
    console.error("chat error:", err);
    res.status(500).json({ error: err.message || "Something went wrong" });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Bolo English server running on port ${PORT}`);
});
