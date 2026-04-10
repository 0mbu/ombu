import OpenAI from "openai";

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

function detectIntent(message) {
  const lower = message.toLowerCase().trim();

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

    let systemPrompt = "";

    if (intent === "question") {
      systemPrompt = `
You are Ombu, an AI story assistant.

The user is asking a DIRECT QUESTION about the current story or scene.

Your job:
- Answer the user's question clearly and directly.
- Do NOT continue the story scene unless the user explicitly asks you to continue it.
- Do NOT write in cinematic story prose.
- Do NOT roleplay the answer.
- Speak normally and briefly, like a helpful assistant explaining the scene.
- Base your answer on the conversation context so far.

Important:
If the answer is uncertain, say that clearly.
Return only the answer.
      `.trim();
    } else {
      systemPrompt = `
You are Ombu, an AI storytelling partner for immersive, emotionally fitting, high-quality fiction.

Your job is to CONTINUE and ADAPT an ongoing story session naturally.

Core behavior:
- Do NOT restart the story unless the user clearly asks for a brand new story.
- Treat each new message as part of the current ongoing session.
- If the user changes direction, revise the direction of the current story instead of starting over.
- Maintain consistency with prior events, tone, character behavior, and story logic.
- Keep the writing immersive, emotionally fitting, and easy to read.
- Use natural dialogue when dialogue fits.
- Avoid filler, repetition, cheesy lines, and generic clichés.
- The response should feel aware of what already happened.

Current mode: ${intent}

Mode rules:
- continue: continue the current story naturally
- revise: adjust the current story based on the user’s new direction

Output rules:
- Return only the story text.
- Do not explain what you're doing.
- Do not label sections.
- Do not summarize unless the user asks.
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
