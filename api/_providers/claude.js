// Adapter for Anthropic's Claude API.
// Docs: https://docs.claude.com/en/api/messages

async function callClaude({ systemPrompt, history, message }) {
  if (!process.env.ANTHROPIC_API_KEY) {
    throw new Error("ANTHROPIC_API_KEY is not set on the server.");
  }

  const messages = [
    ...history.map((h) => ({ role: h.role, content: h.content })),
    { role: "user", content: message },
  ];

  const response = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": process.env.ANTHROPIC_API_KEY,
      "anthropic-version": "2023-06-01",
    },
    body: JSON.stringify({
      model: process.env.ANTHROPIC_MODEL || "claude-sonnet-4-6",
      max_tokens: 300,
      system: systemPrompt,
      messages,
    }),
  });

  if (!response.ok) {
    const text = await response.text().catch(() => "");
    throw new Error(`Claude API error ${response.status}: ${text.slice(0, 300)}`);
  }

  const data = await response.json();
  const textBlock = data.content?.find((b) => b.type === "text");
  return textBlock ? textBlock.text : "";
}

module.exports = { callClaude };
