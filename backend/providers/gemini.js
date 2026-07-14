// Adapter for Google's Gemini API (via Google AI Studio).
// Docs: https://ai.google.dev/gemini-api/docs
//
// NOTE: Google renames/retires Gemini model IDs fairly often. If this stops
// working with a "model not found" error, check the current model list at
// https://ai.google.dev/gemini-api/docs/models and update GEMINI_MODEL in .env
// (as of mid-2026 "gemini-3.1-flash-lite" is the current free-tier Flash-Lite model).

async function callGemini({ systemPrompt, history, message }) {
  if (!process.env.GEMINI_API_KEY) {
    throw new Error("GEMINI_API_KEY is not set on the server.");
  }

  const model = process.env.GEMINI_MODEL || "gemini-3.1-flash-lite";
  const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${process.env.GEMINI_API_KEY}`;

  const contents = [
    ...history.map((h) => ({
      role: h.role === "assistant" ? "model" : "user",
      parts: [{ text: h.content }],
    })),
    { role: "user", parts: [{ text: message }] },
  ];

  const response = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      systemInstruction: { parts: [{ text: systemPrompt }] },
      contents,
      generationConfig: { maxOutputTokens: 300 },
    }),
  });

  if (!response.ok) {
    const text = await response.text().catch(() => "");
    throw new Error(`Gemini API error ${response.status}: ${text.slice(0, 300)}`);
  }

  const data = await response.json();
  const parts = data.candidates?.[0]?.content?.parts || [];
  return parts.map((p) => p.text || "").join("");
}

module.exports = { callGemini };
