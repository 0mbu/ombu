import OpenAI from "openai";

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

export default async function handler(req, res) {
  const { idea } = req.body;

  const completion = await client.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [
      {
        role: "system",
        content: "You are a cinematic storytelling engine. Write immersive, engaging opening scenes with strong dialogue and vivid detail."
      },
      {
        role: "user",
        content: idea
      }
    ]
  });

  res.status(200).json({
    story: completion.choices[0].message.content
  });
}