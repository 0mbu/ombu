import OmbuSidebar from "../../components/OmbuSidebar";
import { useEffect, useRef, useState } from "react";

const STARTER_KEY = "ombu_starter_prompt";
const TRANSITION_KEY = "ombu_route_transition";
const SELECTED_STORY_KEY = "ombu_selected_story";
const RECENT_STORY_CHATS_KEY = "ombu_recent_story_chats";

function createChatId() {
  return `story_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
}

function getStoryHistoryKey(chatId) {
  return `ombu_story_chat_history_${chatId}`;
}

function getLastReadableMessage(messages) {
  const last = [...messages].reverse().find((msg) => msg?.content);
  if (!last) return "Continue story";

  return String(last.content)
    .replace(/\*/g, "")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, 64);
}

function getStoryTitle(messages) {
  const firstUserMessage = messages.find((msg) => msg?.role === "user" && msg?.content);
  if (!firstUserMessage) return "Untitled Story";

  const clean = String(firstUserMessage.content)
    .replace(/\s+/g, " ")
    .trim();

  if (!clean) return "Untitled Story";
  return clean.length > 38 ? `${clean.slice(0, 38)}...` : clean;
}

function saveRecentStory({ chatId, messages }) {
  if (typeof window === "undefined" || !chatId || !Array.isArray(messages)) return;

  try {
    const raw = localStorage.getItem(RECENT_STORY_CHATS_KEY);
    const existing = raw ? JSON.parse(raw) : [];
    const current = Array.isArray(existing) ? existing : [];

    const entry = {
      chatId,
      title: getStoryTitle(messages),
      lastMessage: getLastReadableMessage(messages),
      updatedAt: new Date().toISOString()
    };

    const next = [
      entry,
      ...current.filter((item) => item.chatId !== chatId)
    ].slice(0, 12);

    localStorage.setItem(RECENT_STORY_CHATS_KEY, JSON.stringify(next));
    window.dispatchEvent(new Event("ombu_recent_story_chats_updated"));
    window.dispatchEvent(new Event("ombu_recent_chats_updated"));
  } catch (error) {
    console.error("Failed to save recent story:", error);
  }
}

export default function StoryPage() {
  const [chatId, setChatId] = useState(null);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [direction, setDirection] = useState("");
  const [loading, setLoading] = useState(false);
  const [bootstrapped, setBootstrapped] = useState(false);

  const chatRef = useRef(null);
  const hasStarted = messages.length > 0 || loading;

  useEffect(() => {
    if (chatRef.current) {
      chatRef.current.scrollTop = chatRef.current.scrollHeight;
    }
  }, [messages, loading]);

  useEffect(() => {
    if (bootstrapped) return;

    if (typeof window !== "undefined") {
      const selectedRaw = sessionStorage.getItem(SELECTED_STORY_KEY);

      if (selectedRaw) {
        sessionStorage.removeItem(SELECTED_STORY_KEY);

        try {
          const selected = JSON.parse(selectedRaw);
          const selectedChatId = selected?.chatId;

          if (selected?.mode === "resume" && selectedChatId) {
            const savedRaw = localStorage.getItem(getStoryHistoryKey(selectedChatId));
            const savedMessages = savedRaw ? JSON.parse(savedRaw) : [];

            if (Array.isArray(savedMessages) && savedMessages.length > 0) {
              setChatId(selectedChatId);
              setMessages(savedMessages);
              setBootstrapped(true);
              return;
            }
          }
        } catch (error) {
          console.error("Failed to resume selected story:", error);
        }
      }

      const starterPrompt = sessionStorage.getItem(STARTER_KEY);
      if (starterPrompt) {
        sessionStorage.removeItem(STARTER_KEY);
        sessionStorage.removeItem(TRANSITION_KEY);
        setBootstrapped(true);
        sendMessage(starterPrompt, { forceNewChat: true });
        return;
      }
    }

    setBootstrapped(true);
  }, [bootstrapped]);

  useEffect(() => {
    if (!chatId || typeof window === "undefined" || messages.length === 0) return;

    localStorage.setItem(getStoryHistoryKey(chatId), JSON.stringify(messages));
    saveRecentStory({ chatId, messages });
  }, [chatId, messages]);

  const sendMessage = async (customInput, options = {}) => {
    const text = (customInput || input).trim();
    if (!text || loading) return;

    const nextChatId = options.forceNewChat || !chatId ? createChatId() : chatId;
    if (!chatId || options.forceNewChat) {
      setChatId(nextChatId);
    }

    const baseMessages = options.forceNewChat ? [] : messages;
    const updatedMessages = [...baseMessages, { role: "user", content: text }];

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

      if (!res.ok) {
        throw new Error(data?.error || "Something went wrong.");
      }

      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: data.story || "Something went wrong."
        }
      ]);
    } catch (error) {
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: error.message || "Something went wrong."
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleContinue = () => {
    if (!messages.length || loading) return;
    sendMessage("Continue the story naturally from where we left off.");
  };

  const handleDirectionSubmit = () => {
    if (!messages.length || loading || !direction.trim()) return;
    sendMessage(direction);
    setDirection("");
  };

  const handleReset = () => {
    if (loading) return;
    setChatId(null);
    setMessages([]);
    setInput("");
    setDirection("");

    if (typeof window !== "undefined") {
      sessionStorage.removeItem(SELECTED_STORY_KEY);
    }
  };

  const handleInputKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const handleDirectionKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleDirectionSubmit();
    }
  };

  return (
    <div style={styles.page}>
      <OmbuSidebar
        actionSlot={
          <button
            onClick={handleReset}
            className="ombuSidebarAction"
            disabled={loading}
          >
            + New Story
          </button>
        }
      />

      <main style={styles.main}>
        <div style={styles.topBar}>
          <div>
            <div style={styles.topBarTitle}>Story Engine</div>
            <div style={styles.topBarSub}>
              Build scenes, redirect the plot, and keep momentum.
            </div>
          </div>

          {hasStarted && !loading && (
            <button onClick={handleReset} style={styles.topResetButton}>
              New Story
            </button>
          )}
        </div>

        <div style={styles.workspace}>
          <div ref={chatRef} style={styles.chatArea}>
            {!hasStarted && (
              <div style={styles.centerWrap}>
                <div style={styles.heroEyebrow}>Narrative workspace</div>
                <div style={styles.heroTitle}>Create something worth getting lost in.</div>

                <div style={styles.centerInputShell}>
                  <textarea
                    placeholder="Start a story, scene, character idea, or vibe..."
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={handleInputKeyDown}
                    style={styles.centerInput}
                  />

                  <button
                    onClick={() => sendMessage()}
                    style={styles.centerSendButton}
                    disabled={loading}
                    aria-label="Send"
                    title="Send"
                  >
                    <SendIcon />
                  </button>
                </div>

                <div style={styles.helperText}>
                  Start a story, ask for a scene, continue one, or redirect it however you want.
                </div>
              </div>
            )}

            {hasStarted && (
              <div style={styles.messagesWrap}>
                {messages.map((msg, i) => (
                  <div
                    key={i}
                    style={{
                      ...styles.messageRow,
                      justifyContent: msg.role === "user" ? "flex-end" : "flex-start"
                    }}
                  >
                    <div
                      style={{
                        ...styles.messageBubble,
                        ...(msg.role === "user" ? styles.userBubble : styles.assistantBubble)
                      }}
                    >
                      {msg.content}
                    </div>
                  </div>
                ))}

                {loading && (
                  <div style={styles.messageRow}>
                    <div style={styles.loadingBubble}>
                      <span style={styles.dot}></span>
                      <span style={styles.dot}></span>
                      <span style={styles.dot}></span>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          <div
            style={{
              ...styles.bottomComposerWrap,
              ...(hasStarted ? styles.bottomComposerWrapActive : {})
            }}
          >
            <div style={styles.bottomComposerShell}>
              <textarea
                placeholder={
                  hasStarted
                    ? "Continue, redirect, revise, or ask a question about the story..."
                    : "Start a story, scene, or idea..."
                }
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleInputKeyDown}
                style={styles.bottomComposerInput}
              />

              <button
                onClick={() => sendMessage()}
                style={styles.bottomSendButton}
                disabled={loading}
                aria-label="Send"
                title="Send"
              >
                <SendIcon />
              </button>
            </div>

            {hasStarted && !loading && (
              <div style={styles.afterResponseControls}>
                <button onClick={handleContinue} style={styles.controlButton}>
                  <SparkIcon />
                  <span>Continue Story</span>
                </button>

                <div style={styles.directionWrap}>
                  <textarea
                    placeholder="Change direction..."
                    value={direction}
                    onChange={(e) => setDirection(e.target.value)}
                    onKeyDown={handleDirectionKeyDown}
                    style={styles.directionInput}
                  />
                  <button onClick={handleDirectionSubmit} style={styles.directionButton}>
                    Apply
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}

function SendIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
      <path d="M21 3L10 14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M21 3L14 21L10 14L3 10L21 3Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function SparkIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
      <path
        d="M12 3L13.8 8.2L19 10L13.8 11.8L12 17L10.2 11.8L5 10L10.2 8.2L12 3Z"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinejoin="round"
      />
    </svg>
  );
}

const styles = {
  page: {
    minHeight: "100vh",
    display: "flex",
    background:
      "radial-gradient(circle at 22% 8%, rgba(92, 112, 255, 0.18), transparent 32%), radial-gradient(circle at 80% 70%, rgba(126, 84, 255, 0.12), transparent 30%), #05070d",
    color: "#ffffff",
    fontFamily:
      'Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif'
  },

  main: {
    flex: 1,
    minWidth: 0,
    display: "flex",
    flexDirection: "column",
    padding: "22px 26px 18px"
  },

  topBar: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    gap: 16,
    paddingBottom: 18
  },

  topBarTitle: {
    fontSize: 24,
    fontWeight: 800,
    letterSpacing: "-0.03em"
  },

  topBarSub: {
    marginTop: 6,
    color: "rgba(255,255,255,0.52)",
    fontSize: 14
  },

  topResetButton: {
    padding: "10px 14px",
    borderRadius: 12,
    border: "1px solid rgba(255,255,255,0.08)",
    background: "rgba(255,255,255,0.04)",
    color: "white",
    cursor: "pointer"
  },

  workspace: {
    flex: 1,
    minHeight: 0,
    display: "flex",
    flexDirection: "column",
    position: "relative"
  },

  chatArea: {
    flex: 1,
    minHeight: 0,
    overflowY: "auto",
    paddingRight: 4
  },

  centerWrap: {
    minHeight: "calc(100vh - 170px)",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    padding: "0 20px 120px"
  },

  heroEyebrow: {
    fontSize: 12,
    letterSpacing: "0.16em",
    textTransform: "uppercase",
    color: "rgba(255,255,255,0.42)",
    marginBottom: 12
  },

  heroTitle: {
    fontSize: "clamp(2.5rem, 5vw, 4.4rem)",
    fontWeight: 850,
    letterSpacing: "-0.06em",
    marginBottom: 24,
    textAlign: "center",
    maxWidth: 860,
    lineHeight: 0.98
  },

  centerInputShell: {
    width: "100%",
    maxWidth: 860,
    minHeight: 82,
    borderRadius: 28,
    display: "flex",
    alignItems: "flex-end",
    gap: 12,
    padding: 12,
    background: "rgba(18, 21, 33, 0.94)",
    border: "1px solid rgba(255,255,255,0.08)",
    boxShadow: "0 20px 60px rgba(0,0,0,0.35), 0 10px 30px rgba(72, 91, 255, 0.10)"
  },

  centerInput: {
    flex: 1,
    minHeight: 58,
    maxHeight: 180,
    resize: "none",
    background: "transparent",
    border: "none",
    outline: "none",
    color: "white",
    fontSize: 18,
    lineHeight: 1.55,
    padding: "14px 16px 12px"
  },

  centerSendButton: {
    width: 54,
    height: 54,
    borderRadius: 18,
    border: "1px solid rgba(140,150,255,0.18)",
    background: "linear-gradient(135deg, rgba(110,125,255,0.30), rgba(110,125,255,0.14))",
    color: "white",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
    boxShadow: "0 14px 30px rgba(55, 75, 255, 0.18)"
  },

  helperText: {
    marginTop: 16,
    color: "rgba(255,255,255,0.48)",
    fontSize: 15,
    textAlign: "center"
  },

  messagesWrap: {
    width: "100%",
    maxWidth: 980,
    margin: "0 auto",
    padding: "20px 0 170px"
  },

  messageRow: {
    display: "flex",
    marginBottom: 16
  },

  messageBubble: {
    maxWidth: "78%",
    padding: "16px 18px",
    borderRadius: 22,
    lineHeight: 1.7,
    whiteSpace: "pre-wrap",
    fontSize: 15
  },

  userBubble: {
    background: "linear-gradient(135deg, rgba(98,120,255,0.22), rgba(98,120,255,0.10))",
    border: "1px solid rgba(137,148,255,0.16)",
    boxShadow: "0 14px 30px rgba(55, 75, 255, 0.10)"
  },

  assistantBubble: {
    background: "rgba(255,255,255,0.045)",
    border: "1px solid rgba(255,255,255,0.06)"
  },

  loadingBubble: {
    display: "flex",
    alignItems: "center",
    gap: 8,
    padding: "16px 18px",
    borderRadius: 22,
    background: "rgba(255,255,255,0.045)",
    border: "1px solid rgba(255,255,255,0.06)"
  },

  dot: {
    width: 8,
    height: 8,
    borderRadius: "50%",
    background: "rgba(255,255,255,0.7)"
  },

  bottomComposerWrap: {
    position: "fixed",
    left: "calc(250px + (100vw - 250px) / 2)",
    bottom: -220,
    transform: "translateX(-50%)",
    width: "min(980px, calc(100vw - 320px))",
    transition: "all 0.45s cubic-bezier(0.22, 1, 0.36, 1)",
    zIndex: 20
  },

  bottomComposerWrapActive: {
    bottom: 22
  },

  bottomComposerShell: {
    display: "flex",
    alignItems: "flex-end",
    gap: 12,
    padding: 12,
    borderRadius: 24,
    background: "rgba(16, 18, 29, 0.94)",
    border: "1px solid rgba(255,255,255,0.08)",
    backdropFilter: "blur(18px)",
    boxShadow: "0 20px 50px rgba(0,0,0,0.34)"
  },

  bottomComposerInput: {
    flex: 1,
    minHeight: 54,
    maxHeight: 160,
    resize: "none",
    border: "none",
    outline: "none",
    background: "transparent",
    color: "white",
    fontSize: 15,
    lineHeight: 1.55,
    padding: "12px 14px"
  },

  bottomSendButton: {
    width: 50,
    height: 50,
    borderRadius: 16,
    border: "1px solid rgba(140,150,255,0.18)",
    background: "linear-gradient(135deg, rgba(110,125,255,0.28), rgba(110,125,255,0.14))",
    color: "white",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
    boxShadow: "0 14px 30px rgba(55, 75, 255, 0.15)"
  },

  afterResponseControls: {
    marginTop: 12,
    display: "flex",
    gap: 12,
    alignItems: "stretch"
  },

  controlButton: {
    height: 52,
    padding: "0 18px",
    borderRadius: 16,
    border: "1px solid rgba(255,255,255,0.08)",
    background: "rgba(255,255,255,0.05)",
    color: "white",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    gap: 10,
    whiteSpace: "nowrap"
  },

  directionWrap: {
    flex: 1,
    display: "flex",
    gap: 10,
    padding: 10,
    borderRadius: 18,
    border: "1px solid rgba(255,255,255,0.08)",
    background: "rgba(255,255,255,0.05)"
  },

  directionInput: {
    flex: 1,
    minHeight: 32,
    maxHeight: 90,
    resize: "none",
    border: "none",
    outline: "none",
    background: "transparent",
    color: "white",
    fontSize: 14,
    lineHeight: 1.5,
    padding: "6px 6px"
  },

  directionButton: {
    minWidth: 88,
    borderRadius: 14,
    border: "1px solid rgba(140,150,255,0.18)",
    background: "linear-gradient(135deg, rgba(110,125,255,0.22), rgba(110,125,255,0.12))",
    color: "white",
    cursor: "pointer",
    padding: "0 14px"
  }
};
