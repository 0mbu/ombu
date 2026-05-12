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

function getCreatorName(character) {
  return character?.creator || character?.author || "Ombu";
}

export default function CharacterChatPage() {
  const router = useRouter();

  const [character, setCharacter] = useState(null);
  const [chatId, setChatId] = useState(null);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const [reactionEffects, setReactionEffects] = useState({});

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

  const requestReply = async (nextMessages) => {
    const res = await fetch("/api/character-chat", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        character,
        messages: nextMessages
      })
    });

    const data = await res.json();

    if (!res.ok) {
      throw new Error(data?.error || "Something went wrong.");
    }

    return data.reply;
  };

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
      const reply = await requestReply(updatedMessages);

      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: reply
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

  const regenerateLastReply = async () => {
    if (loading || !character || messages.length === 0) return;

    const lastAssistantIndex = [...messages]
      .map((message, index) => ({ ...message, index }))
      .reverse()
      .find((message) => message.role === "assistant")?.index;

    if (typeof lastAssistantIndex !== "number") return;

    const messagesForRequest = messages.slice(0, lastAssistantIndex);
    const lastUserMessage = [...messagesForRequest]
      .reverse()
      .find((message) => message.role === "user");

    if (!lastUserMessage) return;

    setMessages(messagesForRequest);
    setLoading(true);

    try {
      const reply = await requestReply(messagesForRequest);
      setMessages([
        ...messagesForRequest,
        {
          role: "assistant",
          content: reply
        }
      ]);
    } catch (error) {
      setMessages([
        ...messagesForRequest,
        {
          role: "assistant",
          content: error.message || "Something went wrong."
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const triggerReaction = (index, type) => {
    const effectKey = `${type}-${Date.now()}`;

    setReactionEffects((prev) => ({
      ...prev,
      [index]: effectKey
    }));

    window.setTimeout(() => {
      setReactionEffects((prev) => {
        const next = { ...prev };
        if (next[index] === effectKey) {
          delete next[index];
        }
        return next;
      });
    }, 700);
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
              <header className="profileHeader">
                <button className="backPill" onClick={handleBackToDiscover}>
                  ↑
                </button>

                <CharacterPortrait character={character} size="large" />

                <div className="profileCopy">
                  <h1>{character?.name || "Loading..."}</h1>
                  <p>
                    By <span>@{getCreatorName(character)}</span>
                  </p>
                  {(character?.role || character?.tagline) && (
                    <div className="profileHook">
                      {character?.role || character?.tagline}
                    </div>
                  )}
                </div>
              </header>

              <section ref={chatRef} className="chatWindow">
                <div className="messages">
                  {messages.map((message, index) => (
                    <MessageBlock
                      key={`${message.role}-${index}`}
                      character={character}
                      message={message}
                      index={index}
                      effect={reactionEffects[index]}
                      onRegenerate={regenerateLastReply}
                      onReact={triggerReaction}
                      loading={loading}
                      isLastAssistant={
                        message.role === "assistant" &&
                        index ===
                          messages
                            .map((item, itemIndex) => ({ ...item, itemIndex }))
                            .filter((item) => item.role === "assistant")
                            .at(-1)?.itemIndex
                      }
                    />
                  ))}

                  {loading && (
                    <div className="assistantLine">
                      <CharacterPortrait character={character} size="small" />
                      <div className="assistantStack">
                        <div className="messageMeta">
                          <strong>{character?.name || "Character"}</strong>
                          <span>thinking</span>
                        </div>
                        <div className="typingCard">
                          <span />
                          <span />
                          <span />
                        </div>
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
                  <button
                    className="sendButton"
                    onClick={sendMessage}
                    disabled={loading || !input.trim()}
                    aria-label="Send message"
                  >
                    ➤
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
            radial-gradient(circle at 20% 0%, rgba(102, 115, 255, 0.12), transparent 30%),
            radial-gradient(circle at 82% 68%, rgba(140, 88, 255, 0.12), transparent 34%),
            linear-gradient(180deg, #111219 0%, #090a10 48%, #06070c 100%);
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
          position: relative;
        }

        .profileHeader {
          flex-shrink: 0;
          text-align: center;
          padding: 18px 24px 10px;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 9px;
        }

        .backPill {
          width: 56px;
          height: 28px;
          border: none;
          border-radius: 0 0 12px 12px;
          background: rgba(255, 255, 255, 0.94);
          color: #161820;
          font-size: 18px;
          line-height: 1;
          cursor: pointer;
          box-shadow: 0 10px 24px rgba(0, 0, 0, 0.22);
          transition: transform 160ms ease, opacity 160ms ease;
        }

        .backPill:hover {
          transform: translateY(-1px);
          opacity: 0.88;
        }

        .profileCopy h1 {
          margin: 2px 0 0;
          font-size: 18px;
          letter-spacing: -0.03em;
          font-weight: 850;
        }

        .profileCopy p {
          margin: 8px 0 0;
          font-size: 12px;
          color: rgba(255, 255, 255, 0.56);
        }

        .profileCopy p span {
          color: rgba(255, 255, 255, 0.78);
        }

        .profileHook {
          max-width: 520px;
          margin: 10px auto 0;
          padding: 8px 13px;
          border: 1px solid rgba(255, 255, 255, 0.075);
          border-radius: 999px;
          background: rgba(255, 255, 255, 0.035);
          color: rgba(255, 255, 255, 0.62);
          font-size: 12px;
          line-height: 1.35;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .portrait {
          overflow: hidden;
          display: grid;
          place-items: center;
          background:
            radial-gradient(circle at 50% 32%, rgba(116, 132, 255, 0.28), transparent 48%),
            rgba(255, 255, 255, 0.065);
          border: 1px solid rgba(255, 255, 255, 0.11);
          box-shadow: 0 15px 44px rgba(0, 0, 0, 0.28);
          flex-shrink: 0;
        }

        .portrait.large {
          width: 78px;
          height: 78px;
          border-radius: 999px;
        }

        .portrait.small {
          width: 28px;
          height: 28px;
          border-radius: 999px;
          box-shadow: none;
        }

        .portrait.userPortrait {
          background:
            linear-gradient(135deg, rgba(101, 116, 255, 0.42), rgba(151, 117, 255, 0.22)),
            rgba(255, 255, 255, 0.08);
        }

        .portrait img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .portraitSymbol {
          font-size: 28px;
          line-height: 1;
        }

        .portrait.small .portraitSymbol {
          font-size: 14px;
        }

        .chatWindow {
          flex: 1;
          overflow-y: auto;
          padding: 14px 28px 118px;
        }

        .messages {
          width: min(760px, 100%);
          margin: 0 auto;
        }

        .assistantLine,
        .userLine {
          display: flex;
          gap: 10px;
          margin: 20px 0;
          animation: messageIn 180ms ease both;
        }

        .userLine {
          justify-content: flex-end;
        }

        .assistantStack,
        .userStack {
          min-width: 0;
        }

        .assistantStack {
          width: min(620px, calc(100vw - 370px));
        }

        .userStack {
          display: flex;
          flex-direction: column;
          align-items: flex-end;
        }

        .messageMeta {
          display: flex;
          align-items: center;
          gap: 8px;
          min-height: 28px;
          margin-bottom: 2px;
        }

        .messageMeta strong {
          font-size: 13px;
          font-weight: 850;
          color: rgba(255, 255, 255, 0.88);
        }

        .messageMeta span {
          padding: 2px 7px;
          border-radius: 999px;
          background: rgba(255, 255, 255, 0.065);
          color: rgba(255, 255, 255, 0.5);
          font-size: 11px;
          font-weight: 750;
        }

        .assistantCard {
          position: relative;
          padding: 16px 17px;
          border-radius: 18px;
          background: rgba(255, 255, 255, 0.065);
          border: 1px solid rgba(255, 255, 255, 0.075);
          box-shadow: 0 14px 35px rgba(0, 0, 0, 0.18);
          line-height: 1.55;
          font-size: 16px;
          color: rgba(255, 255, 255, 0.84);
          white-space: pre-wrap;
        }

        .assistantCard em,
        .userBubble em {
          display: inline;
          font-style: italic;
          color: rgba(255, 255, 255, 0.66);
        }

        .messageMenu {
          position: absolute;
          top: 10px;
          right: 12px;
          color: rgba(255, 255, 255, 0.6);
          font-size: 18px;
          letter-spacing: 0.08em;
          user-select: none;
        }

        .userBubble {
          max-width: min(520px, 70vw);
          padding: 12px 15px;
          border-radius: 18px;
          background: linear-gradient(135deg, rgba(101, 116, 255, 0.32), rgba(145, 112, 255, 0.18));
          border: 1px solid rgba(155, 165, 255, 0.18);
          color: rgba(255, 255, 255, 0.9);
          line-height: 1.5;
          font-size: 15px;
          white-space: pre-wrap;
          box-shadow: 0 16px 36px rgba(95, 113, 255, 0.1);
        }

        .messageTools {
          display: flex;
          align-items: center;
          gap: 6px;
          min-height: 30px;
          margin-top: 6px;
          padding-left: 4px;
        }

        .toolButton {
          width: 27px;
          height: 27px;
          position: relative;
          display: grid;
          place-items: center;
          border: none;
          border-radius: 999px;
          background: transparent;
          color: rgba(255, 255, 255, 0.66);
          cursor: pointer;
          font-size: 15px;
          transition: transform 150ms ease, background 150ms ease, color 150ms ease;
        }

        .toolButton:hover {
          transform: translateY(-1px);
          background: rgba(255, 255, 255, 0.075);
          color: white;
        }

        .toolButton:disabled {
          opacity: 0.4;
          cursor: not-allowed;
          transform: none;
        }

        .reactionBurst {
          position: absolute;
          left: 50%;
          top: 50%;
          width: 16px;
          height: 16px;
          pointer-events: none;
          transform: translate(-50%, -50%);
          font-size: 14px;
          line-height: 1;
        }

        .reactionBurst.confetti {
          animation: tinyConfetti 650ms ease-out forwards;
        }

        .reactionBurst.fire {
          animation: tinyFire 650ms ease-out forwards;
        }

        .typingCard {
          width: 86px;
          display: flex;
          gap: 7px;
          padding: 14px 16px;
          border-radius: 18px;
          background: rgba(255, 255, 255, 0.065);
          border: 1px solid rgba(255, 255, 255, 0.075);
        }

        .typingCard span {
          width: 7px;
          height: 7px;
          border-radius: 999px;
          background: rgba(255, 255, 255, 0.72);
          animation: pulse 900ms infinite ease-in-out;
        }

        .typingCard span:nth-child(2) {
          animation-delay: 120ms;
        }

        .typingCard span:nth-child(3) {
          animation-delay: 240ms;
        }

        .composerWrap {
          position: fixed;
          left: calc(250px + (100vw - 250px) / 2);
          bottom: 20px;
          width: min(760px, calc(100vw - 330px));
          transform: translateX(-50%);
        }

        .composer {
          display: flex;
          align-items: flex-end;
          gap: 10px;
          padding: 10px;
          border-radius: 22px;
          background: rgba(18, 20, 30, 0.94);
          border: 1px solid rgba(255, 255, 255, 0.085);
          backdrop-filter: blur(18px);
          box-shadow: 0 20px 55px rgba(0, 0, 0, 0.36);
        }

        .composer textarea {
          flex: 1;
          min-height: 50px;
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

        .composer textarea::placeholder {
          color: rgba(255, 255, 255, 0.38);
        }

        .sendButton {
          width: 48px;
          height: 48px;
          flex: 0 0 auto;
          border: none;
          border-radius: 16px;
          color: white;
          cursor: pointer;
          font-weight: 900;
          background: linear-gradient(135deg, #6875ff, #9a7dff);
          box-shadow: 0 14px 34px rgba(101, 116, 255, 0.2);
          transition: transform 150ms ease, opacity 150ms ease;
        }

        .sendButton:hover:not(:disabled) {
          transform: translateY(-1px);
        }

        .sendButton:disabled {
          opacity: 0.42;
          cursor: not-allowed;
        }

        .missingState {
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-direction: column;
          text-align: center;
          padding: 24px;
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

        @keyframes messageIn {
          from {
            opacity: 0;
            transform: translateY(6px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
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

        @keyframes tinyConfetti {
          0% {
            opacity: 0;
            transform: translate(-50%, -50%) scale(0.55) rotate(0deg);
          }
          25% {
            opacity: 1;
          }
          100% {
            opacity: 0;
            transform: translate(-50%, -145%) scale(1.15) rotate(20deg);
          }
        }

        @keyframes tinyFire {
          0% {
            opacity: 0;
            transform: translate(-50%, -40%) scale(0.45);
            filter: blur(0);
          }
          20% {
            opacity: 1;
          }
          100% {
            opacity: 0;
            transform: translate(-50%, -135%) scale(1.08);
            filter: blur(0.2px);
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

          .profileHeader {
            padding-top: 12px;
          }

          .chatWindow {
            padding: 12px 16px 118px;
          }

          .assistantStack {
            width: calc(100vw - 80px);
          }

          .userBubble {
            max-width: calc(100vw - 72px);
          }

          .composerWrap {
            left: 50%;
            width: calc(100vw - 32px);
          }
        }
      `}</style>
    </>
  );
}

function MessageBlock({
  character,
  message,
  index,
  effect,
  onRegenerate,
  onReact,
  loading,
  isLastAssistant
}) {
  if (message.role === "user") {
    return (
      <div className="userLine">
        <div className="userStack">
          <div className="userBubble">{renderMessageContent(message.content)}</div>
        </div>
      </div>
    );
  }

  const effectType = effect?.startsWith("up")
    ? "confetti"
    : effect?.startsWith("down")
      ? "fire"
      : "";

  return (
    <div className="assistantLine">
      <CharacterPortrait character={character} size="small" />
      <div className="assistantStack">
        <div className="messageMeta">
          <strong>{character?.name || "Character"}</strong>
          <span>Ombu roleplay</span>
        </div>

        <div className="assistantCard">
          <div className="messageMenu">•••</div>
          {renderMessageContent(message.content)}
        </div>

        <div className="messageTools">
          <button
            className="toolButton"
            onClick={() => onRegenerate()}
            disabled={loading || !isLastAssistant}
            title="Regenerate latest reply"
            aria-label="Regenerate latest reply"
          >
            ↻
          </button>
          <button
            className="toolButton"
            onClick={() => onReact(index, "up")}
            title="Good reply"
            aria-label="Thumbs up"
          >
            ♡
            {effectType === "confetti" && (
              <span className="reactionBurst confetti">🎉</span>
            )}
          </button>
          <button
            className="toolButton"
            onClick={() => onReact(index, "down")}
            title="Bad reply"
            aria-label="Thumbs down"
          >
            ⊘
            {effectType === "fire" && <span className="reactionBurst fire">🔥</span>}
          </button>
        </div>
      </div>
    </div>
  );
}

function CharacterPortrait({ character, size = "small" }) {
  if (character?.coverImage) {
    return (
      <div className={`portrait ${size}`}>
        <img src={character.coverImage} alt={character.name || "Character"} />
      </div>
    );
  }

  return (
    <div className={`portrait ${size}`}>
      <span className="portraitSymbol">
        {character?.symbol || character?.avatar || "✦"}
      </span>
    </div>
  );
}
