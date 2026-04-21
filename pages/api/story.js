import OpenAI from "openai";

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

function detectIntent(message) {
  const lower = (message || "").toLowerCase().trim();

  if (
    lower.includes("redo") ||
    lower.includes("rewrite") ||
    lower.includes("change that") ||
    lower.includes("go a different direction") ||
    lower.includes("instead make") ||
    lower.includes("actually make")
  ) {
    return "revise";
  }

  if (
    lower.endsWith("?") ||
    lower.startsWith("would ") ||
    lower.startsWith("could ") ||
    lower.startsWith("should ") ||
    lower.startsWith("is ") ||
    lower.startsWith("are ") ||
    lower.startsWith("why ") ||
    lower.startsWith("what ") ||
    lower.startsWith("who ") ||
    lower.startsWith("how ")
  ) {
    return "question";
  }

  return "continue";
}

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({
      error: "Method not allowed."
    });
  }

  try {
    const { messages } = req.body || {};

    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      return res.status(400).json({
        error: "Please send at least one message."
      });
    }

    if (!process.env.OPENAI_API_KEY) {
      return res.status(500).json({
        error: "Missing OPENAI_API_KEY."
      });
    }

    const lastUserMessage = [...messages].reverse().find((msg) => msg.role === "user");
    const latestText = lastUserMessage?.content || "";
    const intent = detectIntent(latestText);

    let systemPrompt = "";

    if (intent === "question") {
      systemPrompt = `
You are Ombu, an AI story assistant.

The user is asking a direct question about the current story or scene.

Your job:
- Answer clearly and directly.
- Do not continue the story unless the user asks.
- Do not roleplay the answer.
- Speak normally and briefly.
- Base the answer on the conversation so far.

If the answer is uncertain, say so clearly.
Return only the answer.
      `.trim();
    } else {
      systemPrompt = `
You are Ombu, an AI storytelling partner for immersive, emotionally fitting fiction.

Your job is to continue and adapt an ongoing story naturally.

Rules:
- Do not restart unless the user clearly asks for a new story.
- Treat each new user message as part of the current story session.
- If the user changes direction, revise the current story instead of starting over.
- Keep continuity with prior events, tone, character behavior, and story logic.
- Use natural dialogue when it fits.
- Avoid filler, repetition, and generic clichés.
- Make the writing easy to read and emotionally fitting.

Current mode: ${intent}

Mode rules:
- continue: continue the current story naturally
- revise: adjust the current story based on the user’s new direction

Return only the story text.
      `.trim();
    }

    const formattedMessages = [
      {
        role: "system",
        content: systemPrompt
      },
      ...messages.map((msg) => ({
        role: msg.role,
        content: msg.content
      }))
    ];

    const completion = await client.chat.completions.create({
      model: "gpt-4o-mini",
      messages: formattedMessages,
      temperature: intent === "question" ? 0.4 : 1
    });

    const story = completion?.choices?.[0]?.message?.content?.trim();

    if (!story) {
      return res.status(500).json({
        error: "The model returned an empty response."
      });
    }

    return res.status(200).json({ story });
  } catch (error) {
    console.error("Story generation error:", error);

    return res.status(500).json({
      error: error?.message || "Something went wrong while generating the story."
    });
  }
}
