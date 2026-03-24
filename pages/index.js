import { useState } from "react";

export default function Home() {
  const [idea, setIdea] = useState("");
  const [story, setStory] = useState("");

  const generateStory = async () => {
    const res = await fetch("/api/story", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ idea })
    });

    const data = await res.json();
    setStory(data.story);
  };

  return (
    <div style={{ padding: 40 }}>
      <h1>0mbu</h1>

      <textarea
        placeholder="Enter your story idea..."
        value={idea}
        onChange={(e) => setIdea(e.target.value)}
        style={{ width: "100%", height: 100 }}
      />

      <br /><br />

      <button onClick={generateStory}>
        Start Story
      </button>

      <p style={{ marginTop: 20 }}>{story}</p>
    </div>
  );
}
