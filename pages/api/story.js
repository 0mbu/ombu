import OpenAI from "openai";

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

function detectIntent(message) {
  const lower = message.toLowerCase();

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
    lower.includes("why") ||
    lower.includes("what if") ||
    lower.includes("who is") ||
    lower.includes("can you explain") ||
    lower.includes("what does")
  ) {
    return "question";
  }

  return "continue";
}

export default async function handler(req, res) {
  try {
    const { messages } = req.body;

    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      return res.status(400).json({
        error: "Please send at least one message."
      });
    }

    const lastUserMessage = [...messages].reverse().find((msg) => msg.role === "user");
    const latestText = lastUserMessage?.content || "";
    const intent = detectIntent(latestText);

    const systemPrompt = `
You are Ombu, an AI storytelling partner for immersive, emotionally fitting, high-quality fiction.

Your job is to CONTINUE and ADAPT an ongoing story session naturally.

Core behavior:
- Do NOT restart the story unless the user clearly asks for a brand new story.
- Treat each new message as part of the current ongoing session.
- If the user changes direction, revise the direction of the current story instead of starting over.
- If the user asks a question about the story, answer it clearly without resetting the scene.
- Maintain consistency with prior events, tone, character behavior, and story logic.
- Keep the writing immersive, emotionally fitting, and easy to read.
- Use natural dialogue when dialogue fits.
- Avoid filler, repetition, cheesy lines, and generic clichés.
- The response should feel aware of what already happened.

Current mode: ${intent}

Mode rules:
- continue: continue the current story naturally
- revise: adjust the current story based on the user’s new direction
- question: answer the user's question about the current story/session first, and only continue the story if it fits naturally

Output rules:
- Return only the story text or direct answer/story response.
- Do not explain what you're doing.
- Do not label sections.
- Do not summarize unless the user asks.
    `.trim();

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
      temperature: 1
    });

    res.status(200).json({
      story: completion.choices[0].message.content
    });
  } catch (error) {
    console.error("Story generation error:", error);

    res.status(500).json({
      error: "Something went wrong while generating the story."
    });
  }
}
