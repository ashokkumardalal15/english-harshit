const { callClaude } = require("./_providers/claude");
const { callOpenAI } = require("./_providers/openai");
const { callGemini } = require("./_providers/gemini");

const SYSTEM_PROMPT = `You are "Tara Didi", a warm, patient English-speaking companion for a young Indian child (age 5-10) who is learning to speak English. Have a natural, encouraging spoken conversation about everyday topics like food, family, school, animals, and daily routine.

Rules for every reply:
- Keep replies SHORT: 1-3 simple sentences, in English only.
- If the child's last message has a grammar or vocabulary mistake, gently weave in the corrected sentence (for example: "Nice! You can also say: I ate a mango.") before continuing.
- Always end with a friendly follow-up question to keep the conversation going, unless the child clearly wants to stop.
- Never scold or make the child feel bad about a mistake - always encouraging, like a kind elder sister ("Didi").
- Vocabulary and grammar should stay at a beginner level appropriate for a young child.`;

module.exports = async (req, res) => {
  if (req.method !== "POST") {
    res.status(405).json({ error: "Method not allowed" });
    return;
  }

  const { provider, history = [], message } = req.body || {};

  if (!message || !message.trim()) {
    res.status(400).json({ error: "message is required" });
    return;
  }
  if (!["claude", "openai", "gemini"].includes(provider)) {
    res.status(400).json({ error: `Unknown provider: ${provider}` });
    return;
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
    res.status(200).json({ reply });
  } catch (err) {
    console.error("chat error:", err);
    res.status(500).json({ error: err.message || "Something went wrong" });
  }
};
