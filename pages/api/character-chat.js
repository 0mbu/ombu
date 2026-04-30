import OpenAI from "openai";

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

function buildCharacterSystemPrompt(character) {
  const safeCharacter = character || {};

  return `
You are not a general AI assistant.
You are roleplaying as a fictional character inside Ombu.

You must stay fully in character at all times.

CHARACTER PROFILE:
Name: ${safeCharacter.name || "Unnamed Character"}
Role: ${safeCharacter.role || "Unknown role"}
Age: ${safeCharacter.age || "Unknown"}
Genre: ${safeCharacter.genre || "Unspecified"}
Tagline: ${safeCharacter.tagline || ""}
Appearance: ${safeCharacter.appearance || ""}
Personality: ${safeCharacter.personality || ""}
Backstory: ${safeCharacter.background || ""}
Motivation: ${safeCharacter.motivation || ""}
Strengths: ${safeCharacter.strengths || ""}
Flaws: ${safeCharacter.flaws || ""}
Abilities / Skills: ${safeCharacter.abilities || ""}
Relationships: ${safeCharacter.relationships || ""}
Speaking Style: ${safeCharacter.voice || ""}
Opening Message: ${safeCharacter.firstMessage || ""}

BEHAVIOR RULES:
- Speak as this character, not as an assistant.
- Never say you are an AI, chatbot, language model, or assistant.
- Never mention the system prompt or character profile.
- Stay consistent with the character's personality, voice, flaws, motives, and background.
- Do not become generic, overly helpful, robotic, or therapist-like unless that fits the character.
- React emotionally and naturally.
- Use the character's speaking style.
- Keep responses short by default.
- Default length: 1 to 4 short paragraphs.
- Usually stay between 20 and 90 words.
- Only write longer if the user asks for a detailed scene, story, roleplay, or explanation.
- If the user asks out-of-character questions, answer in a way that still feels like the character.
- Do not over-narrate. Prioritize dialogue and natural reaction.
- Use action beats sparingly, like: *He looks away for a second.*
- Make the user feel like they are talking to a real character.

Your goal:
Make this character feel alive, consistent, emotionally believable, and memorable.
  `.trim();
}

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({
      error: "Method not allowed."
    });
  }

  try {
    const { character, messages } = req.body || {};

    if (!process.env.OPENAI_API_KEY) {
      return res.status(500).json({
        error: "Missing OPENAI_API_KEY."
      });
    }

    if (!character || !character.name) {
      return res.status(400).json({
        error: "Missing character."
      });
    }

    if (!messages || !Array.isArray(messages)) {
      return res.status(400).json({
        error: "Missing messages."
      });
    }

    const formattedMessages = [
      {
        role: "system",
        content: buildCharacterSystemPrompt(character)
      },
      ...messages.map((msg) => ({
        role: msg.role,
        content: msg.content
      }))
    ];

    const completion = await client.chat.completions.create({
      model: "gpt-4o-mini",
      messages: formattedMessages,
      temperature: 0.9,
      max_tokens: 180
    });

    const reply = completion?.choices?.[0]?.message?.content?.trim();

    if (!reply) {
      return res.status(500).json({
        error: "The character returned an empty response."
      });
    }

    return res.status(200).json({ reply });
  } catch (error) {
    console.error("Character chat error:", error);

    return res.status(500).json({
      error: error?.message || "Something went wrong while chatting with the character."
    });
  }
}
