import Head from "next/head";
import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/router";
import OmbuSidebar from "../components/OmbuSidebar";

const SELECTED_CHARACTER_KEY = "ombu_selected_character";
const RECENT_CHARACTER_CHATS_KEY = "ombu_recent_character_chats";

function createChatId() {
  return `chat_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
}

function getHistoryKey(chatId) {
  return `ombu_character_chat_history_${chatId}`;
}

function buildOpeningMessage(character) {
  if (!character) return "";

  if (character.firstMessage && character.firstMessage.trim()) {
    return character.firstMessage.trim();
  }

  const name = character.name || "The character";
  const personality = (character.personality || "").toLowerCase();
  const role = (character.role || "").toLowerCase();

  if (
    personality.includes("cold") ||
    personality.includes("quiet") ||
    personality.includes("stoic") ||
    role.includes("operative") ||
    role.includes("assassin")
  ) {
    return `*${name} studies you in silence for a moment, expression unreadable.*\n\nSpeak.`;
  }

  if (
    personality.includes("jealous") ||
    personality.includes("possessive") ||
    role.includes("ex")
  ) {
    return `*${name} leans against the doorway, trying badly to look like this does not matter.*\n\nSo… you were just not going to say anything?`;
  }

  if (
    role.includes("boss") ||
    role.includes("kingpin") ||
    role.includes("mafia")
  ) {
    return `*${name} looks up slowly, calm in a way that feels more dangerous than anger.*\n\nYou have my attention. Use it carefully.`;
  }

  if (
    personality.includes("funny") ||
    personality.includes("sarcastic") ||
    role.includes("hero")
  ) {
    return `*${name} glances over, half a smile pulling at their face.*\n\nOkay. I’m listening. Try not to make it weird.`;
  }

  return `*${name} turns toward you, waiting to see what you’ll say first.*`;
}

function getLastReadableMessage(messages) {
  const last = [...messages].reverse().find((msg) => msg?.content);
  if (!last) return "Continue chat";

  return String(last.content)
    .replace(/\*/g, "")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, 58);
}

function saveRecentChat({ chatId, character, messages }) {
  if (typeof window === "undefined" || !chatId || !character) return;

  try {
    const raw = localStorage.getItem(RECENT_CHARACTER_CHATS_KEY);
    const existing = raw ? JSON.parse(raw) : [];
    const current = Array.isArray(existing) ? existing : [];

    const entry = {
      chatId,
      character,
      lastMessage: getLastReadableMessage(messages),
      updatedAt: new Date().toISOString()
    };

    const next = [
      entry,
      ...current.filter((item) => item.chatId !== chatId)
    ].slice(0, 12);

    localStorage.setItem(RECENT_CHARACTER_CHATS_KEY, JSON.stringify(next));
    window.dispatchEvent(new Event("ombu_recent_character_chats_updated"));
    window.dispatchEvent(new Event("ombu_recent_chats_updated"));
  } catch (error) {
    console.error("Failed to save recent chat:", error);
  }
}

function renderMessageContent(content) {
  const text = String(content || "");
  const parts = text.split(/(\*[^*]+\*)/g);

  return parts.map((part, index) => {
    if (part.startsWith("*") && part.endsWith("*") && part.length > 2) {
      return <em key={index}>{part.slice(1, -1)}</em>;
    }

    return <span key={index}>{part}</span>;
  });
}

export default function CharacterChatPage() {
  const router = useRouter();

  const [character, setCharacter] = useState(null);
  const [chatId, setChatId] = useState(null);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [loaded, setLoaded] = useState(false);

  const chatRef = useRef(null);

  const chatStorageKey = useMemo(() => {
    return chatId ? getHistoryKey(chatId) : null;
  }, [chatId]);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const raw = sessionStorage.getItem(SELECTED_CHARACTER_KEY);

    if (!raw) {
      setLoaded(true);
      return;
    }

    try {
      const parsed = JSON.parse(raw);

      const selectedCharacter = parsed.character || parsed;
      const selectedChatId = parsed.chatId || createChatId();
      const mode = parsed.mode || "new";

      setCharacter(selectedCharacter);
      setChatId(selectedChatId);

      const historyKey = getHistoryKey(selectedChatId);
      const savedRaw =
        localStorage.getItem(historyKey) ||
        localStorage.getItem(`ombu_chat_history_${selectedChatId}`);

      if (mode === "resume" && savedRaw) {
        const savedMessages = JSON.parse(savedRaw);

        if (Array.isArray(savedMessages) && savedMessages.length > 0) {
          setMessages(savedMessages);
          setLoaded(true);
          return;
        }
      }

      const opening = [
        {
          role: "assistant",
          content: buildOpeningMessage(selectedCharacter)
        }
      ];

      setMessages(opening);
      localStorage.setItem(historyKey, JSON.stringify(opening));

      saveRecentChat({
        chatId: selectedChatId,
        character: selectedCharacter,
        messages: opening
      });
    } catch (error) {
      console.error("Failed to load selected character:", error);
    } finally {
      setLoaded(true);
    }
  }, []);

  useEffect(() => {
    if (!loaded || !chatStorageKey || typeof window === "undefined") return;

    if (messages.length > 0) {
      localStorage.setItem(chatStorageKey, JSON.stringify(messages));
      saveRecentChat({ chatId, character, messages });
    }
  }, [messages, loaded, chatStorageKey, chatId, character]);

  useEffect(() => {
    if (chatRef.current) {
      chatRef.current.scrollTop = chatRef.current.scrollHeight;
    }
  }, [messages, loading]);

  const sendMessage = async () => {
    const text = input.trim();
    if (!text || loading || !character) return;

    const updatedMessages = [
      ...messages,
      {
        role: "user",
        content: text
      }
    ];

    setMessages(updatedMessages);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch("/api/character-chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          character,
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
          content: data.reply
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

  const handleNewChat = () => {
    if (!character || loading) return;

    const newChatId = createChatId();
    const opening = [
      {
        role: "assistant",
        content: buildOpeningMessage(character)
      }
    ];

    setChatId(newChatId);
    setMessages(opening);

    if (typeof window !== "undefined") {
      sessionStorage.setItem(
        SELECTED_CHARACTER_KEY,
        JSON.stringify({
          character,
          chatId: newChatId,
          mode: "resume"
        })
      );

      localStorage.setItem(getHistoryKey(newChatId), JSON.stringify(opening));
      saveRecentChat({ chatId: newChatId, character, messages: opening });
    }
  };

  const handleBackToDiscover = () => {
    router.push("/");
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <>
      <Head>
        <title>
          {character?.name ? `${character.name} | OMBU` : "Character Chat | OMBU"}
        </title>
      </Head>

      <div className="chatPage">
        <OmbuSidebar
          actionSlot={
            character ? (
              <button
                className="ombuSidebarAction"
                onClick={handleNewChat}
                disabled={loading}
              >
                + New Chat
              </button>
            ) : null
          }
        />

        <main className="chatMain">
          {!character && loaded ? (
            <section className="missingState">
              <div className="missingOrb">?</div>
              <h1>No character selected.</h1>
              <p>Go back to Discover and choose a character to start chatting.</p>
              <button onClick={handleBackToDiscover}>Back to Discover</button>
            </section>
          ) : (
            <>
              <header className="chatHeader">
                <div className="characterIdentity">
                  <CharacterPortrait character={character} />

                  <div className="headerText">
                    <div className="eyebrow">Character chat</div>
                    <h1>{character?.name || "Loading..."}</h1>
                    <p>{character?.role || character?.tagline || "Ombu character"}</p>
                  </div>
                </div>

                <div className="headerActions">
                  <button className="secondaryButton" onClick={handleBackToDiscover}>
                    ← Discover
                  </button>
                  <button
                    className="secondaryButton"
                    onClick={handleNewChat}
                    disabled={loading || !character}
                  >
                    New Chat
                  </button>
                </div>
              </header>

              <section ref={chatRef} className="chatWindow">
                <div className="messages">
                  {messages.map((message, index) => (
                    <div
                      key={index}
                      className={`messageRow ${
                        message.role === "user" ? "user" : "character"
                      }`}
                    >
                      <div className="messageBubble">
                        {renderMessageContent(message.content)}
                      </div>
                    </div>
                  ))}

                  {loading && (
                    <div className="messageRow character">
                      <div className="typingBubble">
                        <span />
                        <span />
                        <span />
                      </div>
                    </div>
                  )}
                </div>
              </section>

              <section className="composerWrap">
                <div className="composer">
                  <textarea
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder={
                      character?.name
                        ? `Message ${character.name}...`
                        : "Message character..."
                    }
                  />
                  <button onClick={sendMessage} disabled={loading || !input.trim()}>
                    Send
                  </button>
                </div>
              </section>
            </>
          )}
        </main>
      </div>

      <style jsx global>{`
        * {
          box-sizing: border-box;
        }

        body {
          margin: 0;
          background: #05070d;
        }

        .chatPage {
          min-height: 100vh;
          display: flex;
          color: white;
          background:
            radial-gradient(circle at 22% 8%, rgba(92, 112, 255, 0.18), transparent 32%),
            radial-gradient(circle at 80% 70%, rgba(126, 84, 255, 0.12), transparent 30%),
            #05070d;
          font-family:
            Inter,
            ui-sans-serif,
            system-ui,
            -apple-system,
            BlinkMacSystemFont,
            "Segoe UI",
            sans-serif;
        }

        .chatMain {
          flex: 1;
          min-width: 0;
          height: 100vh;
          display: flex;
          flex-direction: column;
          padding: 24px 28px;
        }

        .chatHeader {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 18px;
          padding-bottom: 18px;
          border-bottom: 1px solid rgba(255, 255, 255, 0.06);
        }

        .characterIdentity {
          display: flex;
          align-items: center;
          gap: 14px;
          min-width: 0;
        }

        .headerText {
          min-width: 0;
        }

        .eyebrow {
          font-size: 11px;
          letter-spacing: 0.14em;
          text-transform: uppercase;
          color: rgba(255, 255, 255, 0.38);
          margin-bottom: 5px;
        }

        .chatHeader h1 {
          margin: 0;
          font-size: 28px;
          letter-spacing: -0.04em;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
          max-width: 520px;
        }

        .chatHeader p {
          margin: 5px 0 0;
          color: rgba(255, 255, 255, 0.54);
          font-size: 14px;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
          max-width: 560px;
        }

        .headerActions {
          display: flex;
          align-items: center;
          gap: 10px;
          flex-shrink: 0;
        }

        .secondaryButton {
          min-height: 40px;
          padding: 0 14px;
          border-radius: 14px;
          border: 1px solid rgba(255, 255, 255, 0.08);
          background: rgba(255, 255, 255, 0.045);
          color: white;
          cursor: pointer;
          font-weight: 800;
          transition: 200ms ease;
        }

        .secondaryButton:hover {
          transform: translateY(-1px);
          background: rgba(255, 255, 255, 0.07);
        }

        .secondaryButton:disabled {
          opacity: 0.45;
          cursor: not-allowed;
          transform: none;
        }

        .miniPortrait {
          width: 56px;
          height: 56px;
          border-radius: 18px;
          overflow: hidden;
          display: grid;
          place-items: center;
          background:
            radial-gradient(circle at 50% 30%, rgba(92, 112, 255, 0.32), transparent 42%),
            rgba(255, 255, 255, 0.06);
          border: 1px solid rgba(255, 255, 255, 0.09);
          flex-shrink: 0;
        }

        .miniPortrait img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .miniSymbol {
          font-size: 25px;
        }

        .chatWindow {
          flex: 1;
          overflow-y: auto;
          padding: 22px 0 120px;
        }

        .messages {
          width: 100%;
          max-width: 900px;
          margin: 0 auto;
        }

        .messageRow {
          display: flex;
          margin-bottom: 14px;
        }

        .messageRow.user {
          justify-content: flex-end;
        }

        .messageRow.character {
          justify-content: flex-start;
        }

        .messageBubble {
          max-width: 72%;
          padding: 14px 16px;
          border-radius: 21px;
          line-height: 1.55;
          white-space: pre-wrap;
          font-size: 15px;
        }

        .messageBubble em {
          font-style: italic;
          color: rgba(255, 255, 255, 0.68);
        }

        .messageRow.user .messageBubble {
          background: linear-gradient(
            135deg,
            rgba(101, 116, 255, 0.28),
            rgba(155, 124, 255, 0.12)
          );
          border: 1px solid rgba(145, 155, 255, 0.2);
          box-shadow: 0 14px 34px rgba(80, 100, 255, 0.12);
        }

        .messageRow.character .messageBubble {
          background: rgba(255, 255, 255, 0.045);
          border: 1px solid rgba(255, 255, 255, 0.07);
        }

        .typingBubble {
          display: flex;
          gap: 7px;
          padding: 15px 16px;
          border-radius: 21px;
          background: rgba(255, 255, 255, 0.045);
          border: 1px solid rgba(255, 255, 255, 0.07);
        }

        .typingBubble span {
          width: 7px;
          height: 7px;
          border-radius: 999px;
          background: rgba(255, 255, 255, 0.65);
          animation: pulse 900ms infinite ease-in-out;
        }

        .typingBubble span:nth-child(2) {
          animation-delay: 120ms;
        }

        .typingBubble span:nth-child(3) {
          animation-delay: 240ms;
        }

        .composerWrap {
          position: fixed;
          left: calc(250px + (100vw - 250px) / 2);
          bottom: 22px;
          width: min(900px, calc(100vw - 330px));
          transform: translateX(-50%);
        }

        .composer {
          display: flex;
          align-items: flex-end;
          gap: 12px;
          padding: 12px;
          border-radius: 24px;
          background: rgba(16, 18, 29, 0.94);
          border: 1px solid rgba(255, 255, 255, 0.08);
          backdrop-filter: blur(18px);
          box-shadow: 0 20px 55px rgba(0, 0, 0, 0.34);
        }

        .composer textarea {
          flex: 1;
          min-height: 52px;
          max-height: 150px;
          resize: none;
          border: none;
          outline: none;
          background: transparent;
          color: white;
          font-size: 15px;
          line-height: 1.55;
          padding: 12px 13px;
        }

        .composer button {
          min-width: 84px;
          height: 50px;
          border: none;
          border-radius: 16px;
          color: white;
          cursor: pointer;
          font-weight: 850;
          background: linear-gradient(135deg, #6574ff, #927dff);
          box-shadow: 0 14px 34px rgba(101, 116, 255, 0.22);
        }

        .composer button:disabled {
          opacity: 0.45;
          cursor: not-allowed;
        }

        .missingState {
          min-height: calc(100vh - 48px);
          display: flex;
          align-items: center;
          justify-content: center;
          flex-direction: column;
          text-align: center;
        }

        .missingOrb {
          width: 74px;
          height: 74px;
          border-radius: 26px;
          display: grid;
          place-items: center;
          margin-bottom: 16px;
          background: rgba(255, 255, 255, 0.055);
          border: 1px solid rgba(255, 255, 255, 0.08);
          font-size: 32px;
        }

        .missingState h1 {
          margin: 0 0 8px;
          font-size: 34px;
          letter-spacing: -0.05em;
        }

        .missingState p {
          margin: 0 0 18px;
          color: rgba(255, 255, 255, 0.58);
        }

        .missingState button {
          min-height: 44px;
          padding: 0 16px;
          border: none;
          border-radius: 15px;
          color: white;
          cursor: pointer;
          font-weight: 850;
          background: linear-gradient(135deg, #6574ff, #927dff);
        }

        @keyframes pulse {
          0%,
          100% {
            opacity: 0.35;
            transform: translateY(0);
          }
          50% {
            opacity: 1;
            transform: translateY(-2px);
          }
        }

        @media (max-width: 900px) {
          .chatPage {
            flex-direction: column;
          }

          .chatMain {
            height: auto;
            min-height: 100vh;
          }

          .chatHeader {
            align-items: flex-start;
            flex-direction: column;
          }

          .headerActions {
            width: 100%;
          }

          .secondaryButton {
            flex: 1;
          }

          .composerWrap {
            left: 50%;
            width: calc(100vw - 32px);
          }

          .messageBubble {
            max-width: 86%;
          }
        }
      `}</style>
    </>
  );
}

function CharacterPortrait({ character }) {
  if (character?.coverImage) {
    return (
      <div className="miniPortrait">
        <img src={character.coverImage} alt={character.name || "Character"} />
      </div>
    );
  }

  return (
    <div className="miniPortrait">
      <span className="miniSymbol">
        {character?.symbol || character?.avatar || "✦"}
      </span>
    </div>
  );
}
