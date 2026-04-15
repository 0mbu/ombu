import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useRef, useState } from "react";

export default function StoryPage() {
  const router = useRouter();
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [direction, setDirection] = useState("");
  const [loading, setLoading] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  const chatRef = useRef(null);
  const starterHandledRef = useRef(false);
  const hasStarted = messages.length > 0 || loading;

  useEffect(() => {
    if (chatRef.current) {
      chatRef.current.scrollTop = chatRef.current.scrollHeight;
    }
  }, [messages, loading]);

  const sendMessage = async (customInput) => {
    const text = (customInput || input).trim();
    if (!text || loading) return;

    const updatedMessages = [...messages, { role: "user", content: text }];

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
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!router.isReady) return;

    const starter = router.query.starter;

    if (starterHandledRef.current) return;
    if (!starter || typeof starter !== "string") return;
    if (loading || messages.length > 0) return;

    starterHandledRef.current = true;
    sendMessage(starter);
  }, [router.isReady, router.query.starter, loading, messages.length]);

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
    starterHandledRef.current = false;
    setMessages([]);
    setInput("");
    setDirection("");
    router.push("/story", undefined, { shallow: true });
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
      <aside
        style={{
          ...styles.sidebar,
          width: sidebarCollapsed ? 88 : 260
        }}
      >
        <div style={styles.sidebarTop}>
          <div style={styles.sidebarBrandRow}>
            <div style={styles.sidebarLogo}>O</div>
            {!sidebarCollapsed && <div style={styles.sidebarBrandText}>OMBU</div>}
          </div>

          <button
            onClick={() => setSidebarCollapsed((prev) => !prev)}
            style={styles.collapseButton}
            aria-label="Toggle sidebar"
            title="Toggle sidebar"
          >
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              style={{
                transform: sidebarCollapsed ? "rotate(180deg)" : "none",
                transition: "transform 0.2s ease"
              }}
            >
              <path
                d="M15 6L9 12L15 18"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
        </div>

        <div style={styles.sidebarSection}>
          <Link href="/" style={styles.sidebarItem}>
            <span style={styles.sidebarIconWrap}>
              <HomeIcon />
            </span>
            {!sidebarCollapsed && <span>Home</span>}
          </Link>

          <Link href="/story" style={styles.sidebarItemActive}>
            <span style={styles.sidebarIconWrap}>
              <StoryIcon />
            </span>
            {!sidebarCollapsed && <span>Story</span>}
          </Link>

          <Link
            href="/story?starter=Create%20a%20character%20with%20a%20distinct%20voice%2C%20appearance%2C%20and%20personality."
            style={styles.sidebarItem}
          >
            <span style={styles.sidebarIconWrap}>
              <CharacterIcon />
            </span>
            {!sidebarCollapsed && <span>Characters</span>}
          </Link>

          <Link
            href="/story?starter=Build%20a%20fictional%20world%20with%20clear%20rules%2C%20tone%2C%20and%20lore."
            style={styles.sidebarItem}
          >
            <span style={styles.sidebarIconWrap}>
              <UniverseIcon />
            </span>
            {!sidebarCollapsed && <span>Universes</span>}
          </Link>

          <Link href="/story" style={styles.sidebarItem}>
            <span style={styles.sidebarIconWrap}>
              <ProfileIcon />
            </span>
            {!sidebarCollapsed && <span>Profile</span>}
          </Link>
        </div>

        <div style={styles.sidebarBottom}>
          <button onClick={handleReset} style={styles.newStorySidebarButton} disabled={loading}>
            <span style={styles.sidebarIconWrap}>
              <PlusIcon />
            </span>
            {!sidebarCollapsed && <span>New Story</span>}
          </button>
        </div>
      </aside>

      <main style={styles.main}>
        <div style={styles.topBar}>
          <div>
            <div style={styles.topBarTitle}>Story Workspace</div>
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
                <div style={styles.heroTitle}>Create something worth getting lost in.</div>

                <div style={styles.centerInputShell}>
                  <textarea
                    placeholder="Start a story, scene, or idea..."
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
                        ...(msg.role === "user"
                          ? styles.userBubble
                          : styles.assistantBubble)
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

/* ---------- ICONS ---------- */

function SendIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
      <path
        d="M21 3L10 14"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M21 3L14 21L10 14L3 10L21 3Z"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function HomeIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
      <path
        d="M3 10.5L12 3L21 10.5V20A1 1 0 0 1 20 21H4A1 1 0 0 1 3 20V10.5Z"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M9 21V12H15V21"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function StoryIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
      <path
        d="M6 4H18A2 2 0 0 1 20 6V18A2 2 0 0 1 18 20H6A2 2 0 0 1 4 18V6A2 2 0 0 1 6 4Z"
        stroke="currentColor"
        strokeWidth="2"
      />
      <path
        d="M8 8H16"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
      <path
        d="M8 12H16"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
      <path
        d="M8 16H13"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  );
}

function CharacterIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
      <path
        d="M20 21C20 17.6863 16.4183 15 12 15C7.58172 15 4 17.6863 4 21"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
      <circle cx="12" cy="8" r="4" stroke="currentColor" strokeWidth="2" />
    </svg>
  );
}

function UniverseIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
      <circle cx="12" cy="12" r="8" stroke="currentColor" strokeWidth="2" />
      <path
        d="M4 12H20"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
      <path
        d="M12 4C14.5 6.5 16 9.16667 16 12C16 14.8333 14.5 17.5 12 20"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
      <path
        d="M12 4C9.5 6.5 8 9.16667 8 12C8 14.8333 9.5 17.5 12 20"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  );
}

function ProfileIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
      <circle cx="12" cy="8" r="4" stroke="currentColor" strokeWidth="2" />
      <path
        d="M5 20C6.5 17.5 9 16 12 16C15 16 17.5 17.5 19 20"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  );
}

function PlusIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
      <path
        d="M12 5V19"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
      <path
        d="M5 12H19"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
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

/* ---------- STYLES ---------- */

const styles = {
  page: {
    minHeight: "100vh",
    display: "flex",
    background:
      "radial-gradient(circle at top, rgba(82, 99, 255, 0.18), transparent 28%), #05070d",
    color: "#ffffff",
    fontFamily:
      'Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif'
  },

  sidebar: {
    background: "rgba(10, 12, 20, 0.9)",
    borderRight: "1px solid rgba(255,255,255,0.06)",
    padding: "18px 14px",
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
    transition: "width 0.25s ease",
    position: "sticky",
    top: 0,
    height: "100vh",
    backdropFilter: "blur(18px)"
  },

  sidebarTop: {
    display: "flex",
    flexDirection: "column",
    gap: 18
  },

  sidebarBrandRow: {
    display: "flex",
    alignItems: "center",
    gap: 12,
    padding: "4px 6px"
  },

  sidebarLogo: {
    width: 38,
    height: 38,
    borderRadius: 12,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    background: "linear-gradient(135deg, rgba(120,140,255,0.28), rgba(120,140,255,0.08))",
    border: "1px solid rgba(255,255,255,0.08)",
    fontWeight: 700,
    fontSize: 16,
    boxShadow: "0 10px 30px rgba(55, 75, 255, 0.18)"
  },

  sidebarBrandText: {
    fontSize: 18,
    letterSpacing: 3,
    fontWeight: 600,
    opacity: 0.95
  },

  collapseButton: {
    height: 42,
    borderRadius: 12,
    border: "1px solid rgba(255,255,255,0.08)",
    background: "rgba(255,255,255,0.03)",
    color: "white",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    justifyContent: "center"
  },

  sidebarSection: {
    display: "flex",
    flexDirection: "column",
    gap: 10,
    marginTop: 20
  },

  sidebarItem: {
    display: "flex",
    alignItems: "center",
    gap: 12,
    padding: "12px 14px",
    borderRadius: 14,
    color: "rgba(255,255,255,0.72)",
    textDecoration: "none",
    background: "transparent",
    border: "1px solid transparent",
    transition: "all 0.2s ease"
  },

  sidebarItemActive: {
    display: "flex",
    alignItems: "center",
    gap: 12,
    padding: "12px 14px",
    borderRadius: 14,
    color: "white",
    textDecoration: "none",
    background: "linear-gradient(135deg, rgba(96,115,255,0.22), rgba(96,115,255,0.08))",
    border: "1px solid rgba(135,145,255,0.18)",
    boxShadow: "0 12px 28px rgba(55, 75, 255, 0.14)"
  },

  sidebarIconWrap: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    minWidth: 18
  },

  sidebarBottom: {
    marginTop: 24
  },

  newStorySidebarButton: {
    width: "100%",
    display: "flex",
    alignItems: "center",
    gap: 12,
    justifyContent: "center",
    padding: "13px 14px",
    borderRadius: 14,
    border: "1px solid rgba(130,145,255,0.18)",
    background: "linear-gradient(135deg, rgba(98,120,255,0.20), rgba(98,120,255,0.10))",
    color: "white",
    cursor: "pointer",
    boxShadow: "0 14px 30px rgba(55, 75, 255, 0.14)"
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
    fontWeight: 700,
    letterSpacing: "-0.02em"
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
    padding: "0 20px 120px",
    animation: "fadeIn 0.35s ease"
  },

  heroTitle: {
    fontSize: 40,
    fontWeight: 700,
    letterSpacing: "-0.04em",
    marginBottom: 24,
    textAlign: "center",
    maxWidth: 760,
    lineHeight: 1.08
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
    left: "50%",
    bottom: -220,
    transform: "translateX(-50%)",
    width: "min(980px, calc(100vw - 140px))",
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
