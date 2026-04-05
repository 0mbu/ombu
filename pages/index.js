import StoryControls from "../components/StoryControls";
import { useEffect, useState } from "react";

export default function Home() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  const sendMessage = async (customInput) => {
    const text = customInput || input;
    if (!text.trim()) return;

    const newMessages = [
      ...messages,
      { role: "user", content: text }
    ];

    setMessages(newMessages);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch("/api/story", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ idea: text })
      });

      const data = await res.json();

      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: data.story || "Error." }
      ]);
    } catch {
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: "Something went wrong." }
      ]);
    }

    setLoading(false);
  };

  const handleContinue = () => {
    if (!messages.length) return;
    const last = messages[messages.length - 1];
    sendMessage(last.content + "\n\nContinue the story.");
  };

  const handleDirectionSubmit = (direction) => {
    if (!messages.length) return;
    const last = messages[messages.length - 1];
    sendMessage(last.content + "\n\n" + direction);
  };

  return (
    <div style={styles.page}>
      <div style={styles.title}>OMBU</div>

      <div style={styles.chat}>
        {messages.map((msg, i) => (
          <div
            key={i}
            style={{
              ...styles.message,
              alignSelf: msg.role === "user" ? "flex-end" : "flex-start",
              background:
                msg.role === "user"
                  ? "rgba(90, 120, 255, 0.15)"
                  : "rgba(255,255,255,0.05)"
            }}
          >
            {msg.content}
          </div>
        ))}

        {loading && (
          <div style={styles.loading}>Ombu is thinking...</div>
        )}
      </div>

      <div style={styles.controls}>
        <textarea
          placeholder="Start a story, scene, or idea..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          style={styles.input}
        />

        <button onClick={() => sendMessage()} style={styles.send}>
          Send
        </button>
      </div>

      <div style={styles.storyControls}>
        <StoryControls
          hasStory={messages.length > 0}
          isLoading={loading}
          onContinue={handleContinue}
          onSubmitDirection={handleDirectionSubmit}
        />
      </div>
    </div>
  );
}

const styles = {
  page: {
    height: "100vh",
    display: "flex",
    flexDirection: "column",
    background:
      "radial-gradient(circle at 50% 20%, rgba(100,120,255,0.08), transparent 40%), #0b0b0f",
    color: "white",
    fontFamily: "sans-serif"
  },

  title: {
    textAlign: "center",
    padding: "20px 0",
    fontSize: 22,
    letterSpacing: 4,
    opacity: 0.9
  },

  chat: {
    flex: 1,
    overflowY: "auto",
    padding: "20px",
    display: "flex",
    flexDirection: "column",
    gap: 12
  },

  message: {
    maxWidth: "70%",
    padding: "12px 16px",
    borderRadius: 16,
    lineHeight: 1.5,
    whiteSpace: "pre-wrap"
  },

  loading: {
    opacity: 0.5,
    fontSize: 14
  },

  controls: {
    display: "flex",
    gap: 10,
    padding: 16,
    borderTop: "1px solid rgba(255,255,255,0.05)"
  },

  input: {
    flex: 1,
    borderRadius: 12,
    padding: 12,
    background: "rgba(255,255,255,0.05)",
    color: "white",
    border: "none",
    outline: "none",
    resize: "none"
  },

  send: {
    padding: "10px 16px",
    borderRadius: 12,
    border: "none",
    background: "rgba(100,120,255,0.2)",
    color: "white",
    cursor: "pointer"
  },

  storyControls: {
    padding: 10,
    borderTop: "1px solid rgba(255,255,255,0.05)"
  }
};
