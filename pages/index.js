import { useMemo, useState } from "react";

export default function Home() {
  const [idea, setIdea] = useState("");
  const [story, setStory] = useState("");
  const [loading, setLoading] = useState(false);

  const randomPlaceholder = useMemo(() => {
    const placeholders = [
      "Drop a story idea...",
      "What do you want to experience?",
      "Give me a scene, a vibe, anything...",
      "Write something messy, I’ll turn it into a story...",
      "What can I help you with?",
      "What kind of story are we telling today?",
      "Give me something interesting...",
      "Start with a thought, I’ll handle the rest...",
      "Dark? Funny? Romantic? Your call...",
      "Throw me an idea..."
    ];

    return placeholders[Math.floor(Math.random() * placeholders.length)];
  }, []);

  const generateStory = async () => {
    if (!idea.trim()) return;

    setLoading(true);
    setStory("");

    try {
      const res = await fetch("/api/story", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ idea })
      });

      const data = await res.json();

      if (!res.ok) {
        setStory(data.error || "Something went wrong.");
      } else {
        setStory(data.story);
      }
    } catch (err) {
      setStory("Something went wrong while generating the story.");
    }

    setLoading(false);
  };

  return (
    <div style={{ padding: 40, maxWidth: 800, margin: "0 auto" }}>
      <h1>0mbu</h1>

      <textarea
        placeholder={randomPlaceholder}
        value={idea}
        onChange={(e) => setIdea(e.target.value)}
        style={{
          width: "100%",
          height: 120,
          padding: 12,
          fontSize: 16,
          resize: "vertical"
        }}
      />

      <br />
      <br />

      <button
        onClick={generateStory}
        disabled={loading}
        style={{
          padding: "10px 20px",
          fontSize: 16,
          cursor: loading ? "not-allowed" : "pointer"
        }}
      >
        {loading ? "Generating..." : "Start Story"}
      </button>

      <br />
      <br />

      <div style={{ whiteSpace: "pre-wrap", lineHeight: 1.7 }}>
        {story}
      </div>
    </div>
  );
}
