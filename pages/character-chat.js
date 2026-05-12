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
  return (
    character?.creator ||
    character?.author ||
    character?.createdBy ||
    character?.username ||
    "Ombu"
  );
}

export default function CharacterChatPage() {
  const router = useRouter();

  const [character, setCharacter] = useState(null);
  const [chatId, setChatId] = useState(null);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const [feedback, setFeedback] = useState({});

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

  const requestAssistantReply = async (conversation) => {
    const res = await fetch("/api/character-chat", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        character,
        messages: conversation
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
      const reply = await requestAssistantReply(updatedMessages);

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
    if (loading || !character) return;

    const lastAssistantIndex = [...messages]
      .map((message, index) => ({ message, index }))
      .reverse()
      .find((item) => item.message.role === "assistant")?.index;

    if (lastAssistantIndex === undefined) return;

    const messagesBeforeReply = messages.slice(0, lastAssistantIndex);
    const hasUserPrompt = messagesBeforeReply.some((message) => message.role === "user");

    if (!hasUserPrompt) {
      const opening = [
        {
          role: "assistant",
          content: buildOpeningMessage(character)
        }
      ];

      setMessages(opening);
      setFeedback({});
      return;
    }

    setMessages(messagesBeforeReply);
    setLoading(true);

    try {
      const reply = await requestAssistantReply(messagesBeforeReply);
      setFeedback((prev) => {
        const next = { ...prev };
        delete next[lastAssistantIndex];
        return next;
      });

      setMessages([
        ...messagesBeforeReply,
        {
          role: "assistant",
          content: reply
        }
      ]);
    } catch (error) {
      setMessages([
        ...messagesBeforeReply,
        {
          role: "assistant",
          content: error.message || "Something went wrong."
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const rateMessage = (index, value) => {
    setFeedback((prev) => ({
      ...prev,
      [index]: prev[index] === value ? null : value
    }));
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
    setFeedback({});

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
                <button className="collapseButton" aria-label="Collapse character header">
                  ⌃
                </button>

                <CharacterPortrait character={character} variant="hero" />

                <h1>{character?.name || "Loading..."}</h1>
                <p>
                  By <span>@{getCreatorName(character)}</span>
                </p>

                <div className="profileActions">
                  <button className="ghostButton" onClick={handleBackToDiscover}>
                    Discover
                  </button>
                  <button
                    className="ghostButton"
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
                    <MessageBlock
                      key={`${message.role}-${index}`}
                      message={message}
                      index={index}
                      character={character}
                      feedback={feedback[index]}
                      isLastAssistant={
                        message.role === "assistant" &&
                        index ===
                          messages
                            .map((item, itemIndex) => ({ item, itemIndex }))
                            .filter(({ item }) => item.role === "assistant")
                            .pop()?.itemIndex
                      }
                      loading={loading}
                      onRegenerate={regenerateLastReply}
                      onRate={rateMessage}
                    />
                  ))}

                  {loading && (
                    <div className="messageBlock assistantBlock loadingBlock">
                      <CharacterPortrait character={character} variant="message" />
                      <div className="messageBody">
                        <div className="messageMeta">
                          <span>{character?.name || "Character"}</span>
                          <small>thinking</small>
                        </div>
                        <div className="typingBubble">
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
                  <button onClick={sendMessage} disabled={loading || !input.trim()}>
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
          background: #121318;
        }

        .chatPage {
          min-height: 100vh;
          display: flex;
          color: white;
          background:
            radial-gradient(circle at 35% -12%, rgba(96, 111, 255, 0.13), transparent 34%),
            radial-gradient(circle at 84% 24%, rgba(132, 94, 255, 0.08), transparent 28%),
            #121318;
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
          overflow: hidden;
        }

        .profileHeader {
          flex: 0 0 auto;
          min-height: 172px;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-direction: column;
          gap: 7px;
          padding: 16px 24px 12px;
          position: relative;
        }

        .collapseButton {
          width: 56px;
          height: 28px;
          display: grid;
          place-items: center;
          border: none;
          border-radius: 0 0 8px 8px;
          background: rgba(255, 255, 255, 0.95);
          color: #202126;
          cursor: default;
          font-size: 23px;
          line-height: 1;
          margin-top: -16px;
          margin-bottom: 7px;
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.22);
        }

        .heroPortrait {
          width: 72px;
          height: 72px;
          border-radius: 999px;
          overflow: hidden;
          display: grid;
          place-items: center;
          background:
            radial-gradient(circle at 50% 28%, rgba(113, 126, 255, 0.34), transparent 42%),
            rgba(255, 255, 255, 0.08);
          border: 1px solid rgba(255, 255, 255, 0.14);
          box-shadow: 0 16px 44px rgba(0, 0, 0, 0.34);
        }

        .heroPortrait img,
        .messagePortrait img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .heroSymbol {
          font-size: 31px;
        }

        .profileHeader h1 {
          margin: 2px 0 0;
          max-width: 600px;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
          font-size: 17px;
          line-height: 1.2;
          font-weight: 850;
          letter-spacing: -0.02em;
        }

        .profileHeader p {
          margin: 0;
          color: rgba(255, 255, 255, 0.56);
          font-size: 12px;
        }

        .profileHeader p span {
          color: rgba(255, 255, 255, 0.76);
        }

        .profileActions {
          position: absolute;
          top: 18px;
          right: 24px;
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .ghostButton {
          min-height: 36px;
          padding: 0 12px;
          border-radius: 999px;
          border: 1px solid rgba(255, 255, 255, 0.08);
          background: rgba(255, 255, 255, 0.045);
          color: rgba(255, 255, 255, 0.82);
          cursor: pointer;
          font-size: 13px;
          font-weight: 800;
          transition: 180ms ease;
        }

        .ghostButton:hover {
          background: rgba(255, 255, 255, 0.075);
          color: white;
          transform: translateY(-1px);
        }

        .ghostButton:disabled {
          opacity: 0.45;
          cursor: not-allowed;
          transform: none;
        }

        .chatWindow {
          flex: 1;
          overflow-y: auto;
          padding: 4px 28px 132px;
          scroll-behavior: smooth;
        }

        .chatWindow::-webkit-scrollbar {
          width: 10px;
        }

        .chatWindow::-webkit-scrollbar-track {
          background: transparent;
        }

        .chatWindow::-webkit-scrollbar-thumb {
          background: rgba(255, 255, 255, 0.1);
          border-radius: 999px;
        }

        .messages {
          width: min(780px, 100%);
          margin: 0 auto;
          padding-top: 2px;
        }

        .messageBlock {
          display: flex;
          align-items: flex-start;
          gap: 10px;
          margin-bottom: 18px;
          animation: messageIn 180ms ease both;
        }

        .messageBlock.userBlock {
          justify-content: flex-end;
        }

        .messagePortrait {
          width: 28px;
          height: 28px;
          border-radius: 999px;
          overflow: hidden;
          display: grid;
          place-items: center;
          flex: 0 0 auto;
          background:
            radial-gradient(circle at 50% 30%, rgba(107, 122, 255, 0.28), transparent 42%),
            rgba(255, 255, 255, 0.08);
          border: 1px solid rgba(255, 255, 255, 0.13);
        }

        .messageSymbol {
          font-size: 13px;
        }

        .messageBody {
          min-width: 0;
          max-width: 82%;
        }

        .userBlock .messageBody {
          display: flex;
          justify-content: flex-end;
        }

        .messageMeta {
          display: flex;
          align-items: center;
          gap: 8px;
          min-height: 20px;
          margin: 0 0 6px 7px;
          color: rgba(255, 255, 255, 0.9);
          font-size: 13px;
          font-weight: 850;
        }

        .messageMeta small {
          min-height: 18px;
          display: inline-flex;
          align-items: center;
          padding: 0 7px;
          border-radius: 999px;
          background: rgba(255, 255, 255, 0.08);
          color: rgba(255, 255, 255, 0.62);
          font-size: 11px;
          font-weight: 800;
          letter-spacing: -0.01em;
        }

        .messageBubble {
          width: fit-content;
          max-width: 100%;
          padding: 14px 16px;
          border-radius: 15px;
          line-height: 1.55;
          white-space: pre-wrap;
          font-size: 16px;
          letter-spacing: -0.01em;
        }

        .assistantBlock .messageBubble {
          background: rgba(255, 255, 255, 0.065);
          border: 1px solid rgba(255, 255, 255, 0.055);
          color: rgba(255, 255, 255, 0.8);
          box-shadow: 0 18px 52px rgba(0, 0, 0, 0.16);
        }

        .userBlock .messageBubble {
          max-width: 620px;
          background: linear-gradient(
            135deg,
            rgba(101, 116, 255, 0.27),
            rgba(146, 125, 255, 0.15)
          );
          border: 1px solid rgba(145, 155, 255, 0.16);
          color: rgba(255, 255, 255, 0.92);
          box-shadow: 0 14px 36px rgba(78, 93, 230, 0.11);
        }

        .messageBubble em {
          font-style: italic;
          color: rgba(255, 255, 255, 0.72);
        }

        .messageMenu {
          margin-left: auto;
          border: none;
          background: transparent;
          color: rgba(255, 255, 255, 0.7);
          cursor: pointer;
          font-size: 18px;
          line-height: 1;
          padding: 0 2px;
        }

        .messageTools {
          display: flex;
          align-items: center;
          gap: 8px;
          margin: 7px 0 0 8px;
        }

        .toolButton {
          width: 25px;
          height: 25px;
          display: grid;
          place-items: center;
          border-radius: 999px;
          border: none;
          background: transparent;
          color: rgba(255, 255, 255, 0.66);
          cursor: pointer;
          font-size: 14px;
          line-height: 1;
          transition: 160ms ease;
        }

        .toolButton:hover {
          background: rgba(255, 255, 255, 0.075);
          color: white;
          transform: translateY(-1px);
        }

        .toolButton.active {
          background: rgba(101, 116, 255, 0.22);
          color: white;
        }

        .toolButton.regen {
          background: rgba(101, 116, 255, 0.22);
          color: white;
          box-shadow: 0 8px 22px rgba(76, 92, 218, 0.16);
        }

        .toolButton:disabled {
          opacity: 0.45;
          cursor: not-allowed;
          transform: none;
        }

        .typingBubble {
          width: fit-content;
          display: flex;
          gap: 7px;
          padding: 15px 16px;
          border-radius: 15px;
          background: rgba(255, 255, 255, 0.065);
          border: 1px solid rgba(255, 255, 255, 0.055);
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
          width: min(780px, calc(100vw - 330px));
          transform: translateX(-50%);
          z-index: 20;
        }

        .composer {
          display: flex;
          align-items: flex-end;
          gap: 10px;
          padding: 10px;
          border-radius: 19px;
          background: rgba(26, 27, 34, 0.96);
          border: 1px solid rgba(255, 255, 255, 0.08);
          backdrop-filter: blur(18px);
          box-shadow: 0 20px 60px rgba(0, 0, 0, 0.42);
        }

        .composer textarea {
          flex: 1;
          min-height: 48px;
          max-height: 150px;
          resize: none;
          border: none;
          outline: none;
          background: transparent;
          color: white;
          font-size: 15px;
          line-height: 1.5;
          padding: 12px 12px;
        }

        .composer textarea::placeholder {
          color: rgba(255, 255, 255, 0.4);
        }

        .composer button {
          width: 48px;
          height: 48px;
          border: none;
          border-radius: 15px;
          color: white;
          cursor: pointer;
          font-size: 18px;
          font-weight: 900;
          background: linear-gradient(135deg, #6574ff, #927dff);
          box-shadow: 0 14px 34px rgba(101, 116, 255, 0.22);
          transition: 180ms ease;
        }

        .composer button:hover {
          transform: translateY(-1px);
        }

        .composer button:disabled {
          opacity: 0.45;
          cursor: not-allowed;
          transform: none;
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

        @keyframes messageIn {
          from {
            opacity: 0;
            transform: translateY(7px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @media (max-width: 900px) {
          .chatPage {
            flex-direction: column;
          }

          .chatMain {
            height: calc(100vh - 72px);
          }

          .profileHeader {
            min-height: 152px;
            padding-inline: 16px;
          }

          .profileActions {
            position: static;
            margin-top: 6px;
          }

          .chatWindow {
            padding: 6px 16px 126px;
          }

          .messages {
            width: 100%;
          }

          .messageBody {
            max-width: calc(100% - 38px);
          }

          .messageBubble {
            font-size: 15px;
          }

          .composerWrap {
            left: 50%;
            width: calc(100vw - 32px);
          }
        }

        @media (max-width: 540px) {
          .heroPortrait {
            width: 60px;
            height: 60px;
          }

          .profileHeader h1 {
            max-width: 92vw;
          }

          .messageBlock {
            gap: 8px;
          }

          .messageBody {
            max-width: calc(100% - 34px);
          }

          .assistantBlock .messageBubble,
          .userBlock .messageBubble {
            max-width: 100%;
          }
        }
      `}</style>
    </>
  );
}

function MessageBlock({
  message,
  index,
  character,
  feedback,
  isLastAssistant,
  loading,
  onRegenerate,
  onRate
}) {
  if (message.role === "user") {
    return (
      <div className="messageBlock userBlock">
        <div className="messageBody">
          <div className="messageBubble">{renderMessageContent(message.content)}</div>
        </div>
      </div>
    );
  }

  return (
    <div className="messageBlock assistantBlock">
      <CharacterPortrait character={character} variant="message" />

      <div className="messageBody">
        <div className="messageMeta">
          <span>{character?.name || "Character"}</span>
          <small>c.ai</small>
          <button className="messageMenu" aria-label="More message options">
            ...
          </button>
        </div>

        <div className="messageBubble">{renderMessageContent(message.content)}</div>

        <div className="messageTools">
          <button
            className={`toolButton regen ${isLastAssistant ? "" : "quiet"}`}
            onClick={onRegenerate}
            disabled={!isLastAssistant || loading}
            title="Regenerate response"
            aria-label="Regenerate response"
          >
            ↻
          </button>
          <button
            className={`toolButton ${feedback === "up" ? "active" : ""}`}
            onClick={() => onRate(index, "up")}
            title="Good response"
            aria-label="Good response"
          >
            👍
          </button>
          <button
            className={`toolButton ${feedback === "down" ? "active" : ""}`}
            onClick={() => onRate(index, "down")}
            title="Bad response"
            aria-label="Bad response"
          >
            👎
          </button>
        </div>
      </div>
    </div>
  );
}

function CharacterPortrait({ character, variant = "message" }) {
  const className = variant === "hero" ? "heroPortrait" : "messagePortrait";
  const symbolClassName = variant === "hero" ? "heroSymbol" : "messageSymbol";

  if (character?.coverImage) {
    return (
      <div className={className}>
        <img src={character.coverImage} alt={character.name || "Character"} />
      </div>
    );
  }

  return (
    <div className={className}>
      <span className={symbolClassName}>
        {character?.symbol || character?.avatar || "✦"}
      </span>
    </div>
  );
}
