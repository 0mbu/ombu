import StoryControls from "../../components/StoryControls";
import { useState } from "react";

export default function Home() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  const sendMessage = async (customInput) => {
    const text = customInput || input;
    if (!text.trim() || loading) return;

    const updatedMessages = [
      ...messages,
      { role: "user", content: text }
    ];

    setMessages(updatedMessages);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch("/api/story", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          messages: updatedMessages
        })
      });

      const data = await res.json();

      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: data.story || data.error || "Something went wrong."
        }
      ]);
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: "Something went wrong."
        }
      ]);
    }

    setLoading(false);
  };

  const handleContinue = () => {
    if (!messages.length || loading) return;
    sendMessage("Continue the story naturally from where we left off.");
  };

  const handleDirectionSubmit = (direction) => {
    if (!messages.length || loading || !direction.trim()) return;
    sendMessage(direction);
  };

  const handleReset = () => {
    if (loading) return;
    setMessages([]);
    setInput("");
  };

  return (
    <div style={styles.page}>
      <div style={styles.title}>OMBU</div>

      <div style={styles.chat}>
        {messages.length === 0 && (
          <div style={styles.emptyState}>
            Start a story, ask for a scene, continue one, or redirect it however you want.
          </div>
        )}

        {messages.map((msg, i) => (
          <div
            key={i}
            style={{
              ...styles.message,
              alignSelf: msg.role === "user" ? "flex-end" : "flex-start",
              background:
                msg.role === "user"
                  ? "rgba(90, 120, 255, 0.18)"
                  : "rgba(255,255,255,0.06)"
            }}
          >
            {msg.content}
          </div>
        ))}

        {loading && <div style={styles.loading}>Ombu is thinking...</div>}
      </div>

      <div style={styles.controls}>
        <textarea
          placeholder={
            messages.length === 0
              ? "Start a story, scene, or idea..."
              : "Continue, redirect, revise, or ask a question about the story..."
          }
          value={input}
          onChange={(e) => setInput(e.target.value)}
          style={styles.input}
        />

        <button onClick={() => sendMessage()} style={styles.send} disabled={loading}>
          {loading ? "..." : "Send"}
        </button>
      </div>

      <div style={styles.bottomRow}>
        <button onClick={handleReset} style={styles.reset} disabled={loading}>
          New Story
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

  emptyState: {
    opacity: 0.5,
    textAlign: "center",
    marginTop: 30,
    fontSize: 14
  },

  message: {
    maxWidth: "70%",
    padding: "12px 16px",
    borderRadius: 16,
    lineHeight: 1.6,
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
    resize: "none",
    minHeight: 70
  },

  send: {
    padding: "10px 16px",
    borderRadius: 12,
    border: "none",
    background: "rgba(100,120,255,0.2)",
    color: "white",
    cursor: "pointer"
  },

  bottomRow: {
    display: "flex",
    justifyContent: "flex-end",
    padding: "0 16px 12px 16px"
  },

  reset: {
    padding: "8px 14px",
    borderRadius: 10,
    border: "none",
    background: "rgba(255,255,255,0.08)",
    color: "white",
    cursor: "pointer"
  },

  storyControls: {
    padding: 10,
    borderTop: "1px solid rgba(255,255,255,0.05)"
  }
};
