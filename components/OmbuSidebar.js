import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useMemo, useState } from "react";

const SELECTED_CHARACTER_KEY = "ombu_selected_character";
const SELECTED_STORY_KEY = "ombu_selected_story";
const RECENT_CHARACTER_CHATS_KEY = "ombu_recent_character_chats";
const RECENT_STORY_CHATS_KEY = "ombu_recent_story_chats";

function getStoryHistoryKey(chatId) {
  return `ombu_story_chat_history_${chatId}`;
}

function getCharacterHistoryKey(chatId) {
  return `ombu_character_chat_history_${chatId}`;
}

export default function OmbuSidebar({ actionSlot = null }) {
  const router = useRouter();
  const [storyChats, setStoryChats] = useState([]);
  const [characterChats, setCharacterChats] = useState([]);

  const navItems = [
    { label: "Discover", href: "/", icon: <DiscoverIcon /> },
    { label: "Story Engine", href: "/story", icon: <StoryIcon /> },
    { label: "World Engine", href: "/universes", icon: <WorldIcon /> }
  ];

  const isActive = (href) => {
    if (href === "/") return router.pathname === "/";
    return router.pathname.startsWith(href);
  };

  const recentMode = useMemo(() => {
    if (router.pathname.startsWith("/story")) return "story";
    if (
      router.pathname.startsWith("/characters") ||
      router.pathname.startsWith("/character-chat")
    ) {
      return "character";
    }
    return null;
  }, [router.pathname]);

  const recentConfig = useMemo(() => {
    if (recentMode === "story") {
      return {
        label: "Recent Stories",
        empty: "No recent stories",
        deleteLabel: "Delete",
        chats: storyChats
      };
    }

    if (recentMode === "character") {
      return {
        label: "Character Threads",
        empty: "No character chats",
        deleteLabel: "Delete",
        chats: characterChats
      };
    }

    return null;
  }, [recentMode, storyChats, characterChats]);

  const loadRecentChats = () => {
    if (typeof window === "undefined") return;

    try {
      const rawStories = localStorage.getItem(RECENT_STORY_CHATS_KEY);
      const parsedStories = rawStories ? JSON.parse(rawStories) : [];
      setStoryChats(Array.isArray(parsedStories) ? parsedStories : []);
    } catch (error) {
      console.error("Failed to load recent stories:", error);
      setStoryChats([]);
    }

    try {
      const rawCharacters = localStorage.getItem(RECENT_CHARACTER_CHATS_KEY);
      const parsedCharacters = rawCharacters ? JSON.parse(rawCharacters) : [];
      setCharacterChats(Array.isArray(parsedCharacters) ? parsedCharacters : []);
    } catch (error) {
      console.error("Failed to load character threads:", error);
      setCharacterChats([]);
    }
  };

  useEffect(() => {
    loadRecentChats();

    const handleRecentUpdate = () => loadRecentChats();
    const handleStorageUpdate = (event) => {
      if (
        event.key === RECENT_STORY_CHATS_KEY ||
        event.key === RECENT_CHARACTER_CHATS_KEY
      ) {
        loadRecentChats();
      }
    };

    window.addEventListener("ombu_recent_chats_updated", handleRecentUpdate);
    window.addEventListener("ombu_recent_story_chats_updated", handleRecentUpdate);
    window.addEventListener("ombu_recent_character_chats_updated", handleRecentUpdate);
    window.addEventListener("storage", handleStorageUpdate);

    return () => {
      window.removeEventListener("ombu_recent_chats_updated", handleRecentUpdate);
      window.removeEventListener("ombu_recent_story_chats_updated", handleRecentUpdate);
      window.removeEventListener("ombu_recent_character_chats_updated", handleRecentUpdate);
      window.removeEventListener("storage", handleStorageUpdate);
    };
  }, [router.pathname]);

  const openRecentChat = (chat) => {
    if (typeof window === "undefined" || !recentMode) return;

    if (recentMode === "story") {
      sessionStorage.setItem(
        SELECTED_STORY_KEY,
        JSON.stringify({
          chatId: chat.chatId,
          mode: "resume"
        })
      );

      router.push("/story");
      return;
    }

    sessionStorage.setItem(
      SELECTED_CHARACTER_KEY,
      JSON.stringify({
        character: chat.character,
        chatId: chat.chatId,
        mode: "resume"
      })
    );

    router.push("/character-chat");
  };

  const deleteRecentChats = () => {
    if (typeof window === "undefined" || !recentMode) return;

    try {
      if (recentMode === "story") {
        storyChats.forEach((chat) => {
          if (chat.chatId) {
            localStorage.removeItem(getStoryHistoryKey(chat.chatId));
          }
        });

        localStorage.removeItem(RECENT_STORY_CHATS_KEY);
        setStoryChats([]);
        window.dispatchEvent(new Event("ombu_recent_story_chats_updated"));
        window.dispatchEvent(new Event("ombu_recent_chats_updated"));
        return;
      }

      characterChats.forEach((chat) => {
        if (chat.chatId) {
          localStorage.removeItem(getCharacterHistoryKey(chat.chatId));
          localStorage.removeItem(`ombu_chat_history_${chat.chatId}`);
        }
      });

      localStorage.removeItem(RECENT_CHARACTER_CHATS_KEY);
      setCharacterChats([]);
      window.dispatchEvent(new Event("ombu_recent_character_chats_updated"));
      window.dispatchEvent(new Event("ombu_recent_chats_updated"));
    } catch (error) {
      console.error("Failed to delete recent chats:", error);
    }
  };

  const recentChats = recentConfig?.chats || [];

  return (
    <>
      <aside className="ombuSidebar">
        <div>
          <Link href="/" className="ombuBrand">
            <span className="ombuBrandMark">O</span>
            <span className="ombuBrandText">OMBU</span>
          </Link>

          <nav className="ombuNav">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`ombuNavItem ${isActive(item.href) ? "active" : ""}`}
              >
                <span className="ombuNavIcon">{item.icon}</span>
                <span className="ombuNavLabel">{item.label}</span>
              </Link>
            ))}
          </nav>

          {recentConfig && (
            <section className="ombuRecent">
              <div className="ombuRecentHeader">
                <span>{recentConfig.label}</span>
                {recentChats.length > 0 && (
                  <button onClick={deleteRecentChats}>{recentConfig.deleteLabel}</button>
                )}
              </div>

              {recentChats.length === 0 ? (
                <div className="ombuNoRecent">{recentConfig.empty}</div>
              ) : (
                <div className="ombuRecentList">
                  {recentChats.slice(0, 6).map((chat) => (
                    <button
                      key={chat.chatId}
                      className="ombuRecentItem"
                      onClick={() => openRecentChat(chat)}
                    >
                      <span className="ombuRecentAvatar">
                        {recentMode === "character" && chat.character?.coverImage ? (
                          <img
                            src={chat.character.coverImage}
                            alt={chat.character?.name || "Character"}
                          />
                        ) : (
                          <span>
                            {recentMode === "story"
                              ? "✦"
                              : chat.character?.avatar || chat.character?.symbol || "✦"}
                          </span>
                        )}
                      </span>

                      <span className="ombuRecentText">
                        <strong>
                          {recentMode === "story"
                            ? chat.title || "Untitled Story"
                            : chat.character?.name || "Unknown"}
                        </strong>
                        <small>{chat.lastMessage || "Continue"}</small>
                      </span>
                    </button>
                  ))}
                </div>
              )}
            </section>
          )}
        </div>

        <div className="ombuSidebarBottom">
          {actionSlot}
          <div className="ombuSystemCard">
            <div className="ombuSystemLabel">System</div>
            <div className="ombuSystemText">Local build</div>
          </div>
        </div>
      </aside>

      <style jsx global>{`
        .ombuSidebar {
          width: 250px;
          min-height: 100vh;
          padding: 22px;
          flex-shrink: 0;
          position: sticky;
          top: 0;
          z-index: 20;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          background:
            radial-gradient(circle at 18% 4%, rgba(112, 129, 255, 0.16), transparent 28%),
            linear-gradient(180deg, rgba(9, 11, 20, 0.96), rgba(5, 7, 13, 0.98));
          border-right: 1px solid rgba(255, 255, 255, 0.075);
          box-shadow: inset -1px 0 0 rgba(255,255,255,0.025);
          backdrop-filter: blur(20px);
        }

        .ombuBrand {
          display: flex;
          align-items: center;
          gap: 12px;
          color: #fff;
          text-decoration: none;
          margin-bottom: 38px;
          height: 40px;
        }

        .ombuBrandMark {
          width: 38px;
          height: 38px;
          border-radius: 14px;
          display: grid;
          place-items: center;
          font-size: 15px;
          font-weight: 900;
          background:
            radial-gradient(circle at 30% 24%, rgba(255,255,255,0.26), transparent 32%),
            linear-gradient(135deg, rgba(113,130,255,0.40), rgba(113,130,255,0.12));
          border: 1px solid rgba(255,255,255,0.14);
          box-shadow: 0 16px 36px rgba(92, 110, 255, 0.18);
        }

        .ombuBrandText {
          font-size: 15px;
          font-weight: 900;
          letter-spacing: 0.29em;
        }

        .ombuNav {
          display: flex;
          flex-direction: column;
          gap: 11px;
        }

        .ombuNavItem {
          position: relative;
          min-height: 48px;
          display: flex;
          align-items: center;
          gap: 13px;
          padding: 0 15px;
          border-radius: 16px;
          color: rgba(255,255,255,0.64);
          text-decoration: none;
          border: 1px solid rgba(255,255,255,0.045);
          background: rgba(255,255,255,0.018);
          overflow: hidden;
          transition: 220ms cubic-bezier(0.22, 1, 0.36, 1);
        }

        .ombuNavItem::before {
          content: "";
          position: absolute;
          inset: 0;
          opacity: 0;
          background:
            radial-gradient(circle at 0% 50%, rgba(122,139,255,0.22), transparent 46%),
            linear-gradient(135deg, rgba(101,116,255,0.12), rgba(155,124,255,0.055));
          transition: opacity 220ms ease;
          pointer-events: none;
        }

        .ombuNavItem:hover {
          color: rgba(255,255,255,0.94);
          transform: translateX(3px);
          border-color: rgba(255,255,255,0.09);
          background: rgba(255,255,255,0.04);
        }

        .ombuNavItem:hover::before {
          opacity: 1;
        }

        .ombuNavItem.active {
          color: #fff;
          transform: translateX(0);
          background: linear-gradient(135deg, rgba(101,116,255,0.24), rgba(155,124,255,0.09));
          border-color: rgba(145,155,255,0.30);
          box-shadow:
            0 18px 44px rgba(78, 94, 255, 0.14),
            inset 0 1px 0 rgba(255,255,255,0.055);
        }

        .ombuNavItem.active::before {
          opacity: 1;
        }

        .ombuNavItem.active::after {
          content: "";
          position: absolute;
          left: 0;
          top: 12px;
          bottom: 12px;
          width: 3px;
          border-radius: 999px;
          background: linear-gradient(180deg, #7f8dff, #b18cff);
          box-shadow: 0 0 18px rgba(127,141,255,0.9);
        }

        .ombuNavIcon,
        .ombuNavLabel {
          position: relative;
          z-index: 1;
        }

        .ombuNavIcon {
          width: 20px;
          height: 20px;
          display: grid;
          place-items: center;
          flex-shrink: 0;
        }

        .ombuNavLabel {
          font-size: 15px;
          font-weight: 650;
        }

        .ombuRecent {
          margin-top: 30px;
          padding-top: 18px;
          border-top: 1px solid rgba(255,255,255,0.07);
        }

        .ombuRecentHeader {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 10px;
          font-size: 11px;
          letter-spacing: 0.13em;
          text-transform: uppercase;
          color: rgba(255,255,255,0.38);
        }

        .ombuRecentHeader button {
          border: none;
          background: transparent;
          color: rgba(255,255,255,0.46);
          cursor: pointer;
          font-size: 11px;
          padding: 0;
        }

        .ombuRecentHeader button:hover {
          color: white;
        }

        .ombuNoRecent {
          font-size: 13px;
          color: rgba(255,255,255,0.38);
          padding: 10px 2px;
        }

        .ombuRecentList {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .ombuRecentItem {
          width: 100%;
          border: 1px solid rgba(255,255,255,0.055);
          background: rgba(255,255,255,0.025);
          color: white;
          border-radius: 14px;
          padding: 9px;
          display: flex;
          align-items: center;
          gap: 10px;
          cursor: pointer;
          text-align: left;
          transition: 200ms ease;
        }

        .ombuRecentItem:hover {
          background: rgba(255,255,255,0.055);
          transform: translateX(2px);
          border-color: rgba(145,155,255,0.18);
        }

        .ombuRecentAvatar {
          width: 34px;
          height: 34px;
          border-radius: 12px;
          flex-shrink: 0;
          overflow: hidden;
          display: grid;
          place-items: center;
          background: rgba(255,255,255,0.06);
          border: 1px solid rgba(255,255,255,0.07);
          font-size: 15px;
        }

        .ombuRecentAvatar img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .ombuRecentText {
          min-width: 0;
          display: flex;
          flex-direction: column;
          gap: 2px;
        }

        .ombuRecentText strong {
          font-size: 13px;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .ombuRecentText small {
          font-size: 11px;
          color: rgba(255,255,255,0.42);
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
          max-width: 145px;
        }

        .ombuSidebarBottom {
          display: flex;
          flex-direction: column;
          gap: 12px;
          margin-top: 28px;
        }

        .ombuSystemCard {
          padding: 14px;
          border-radius: 18px;
          background: rgba(255,255,255,0.032);
          border: 1px solid rgba(255,255,255,0.065);
        }

        .ombuSystemLabel {
          font-size: 11px;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          color: rgba(255,255,255,0.36);
          margin-bottom: 6px;
        }

        .ombuSystemText {
          font-size: 13px;
          color: rgba(255,255,255,0.62);
        }

        .ombuSidebarAction {
          width: 100%;
          min-height: 44px;
          border: none;
          border-radius: 15px;
          color: white;
          cursor: pointer;
          font-weight: 850;
          background: linear-gradient(135deg, #6574ff, #927dff);
          box-shadow: 0 18px 42px rgba(101,116,255,0.24);
          transition: transform 220ms cubic-bezier(0.22, 1, 0.36, 1);
        }

        .ombuSidebarAction:hover {
          transform: translateY(-2px);
        }

        .ombuSidebarAction:disabled {
          opacity: 0.5;
          cursor: not-allowed;
          transform: none;
        }

        @media (max-width: 900px) {
          .ombuSidebar {
            width: 100%;
            min-height: auto;
            position: relative;
          }

          .ombuNav {
            flex-direction: row;
            flex-wrap: wrap;
          }

          .ombuNavItem {
            flex: 1;
            min-width: 150px;
          }

          .ombuSidebarBottom {
            display: none;
          }

          .ombuRecent {
            display: none;
          }
        }
      `}</style>
    </>
  );
}

function DiscoverIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
      <circle cx="12" cy="12" r="8" stroke="currentColor" strokeWidth="2" />
      <path d="M15 9L13.3 13.3L9 15L10.7 10.7L15 9Z" stroke="currentColor" strokeWidth="2" />
    </svg>
  );
}

function StoryIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
      <path d="M6 4H18A2 2 0 0 1 20 6V18A2 2 0 0 1 18 20H6A2 2 0 0 1 4 18V6A2 2 0 0 1 6 4Z" stroke="currentColor" strokeWidth="2" />
      <path d="M8 8H16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      <path d="M8 12H16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      <path d="M8 16H13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

function WorldIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
      <circle cx="12" cy="12" r="8" stroke="currentColor" strokeWidth="2" />
      <path d="M4 12H20" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      <path d="M12 4C14.4 6.6 16 9.2 16 12C16 14.8 14.4 17.4 12 20" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      <path d="M12 4C9.6 6.6 8 9.2 8 12C8 14.8 9.6 17.4 12 20" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}
