import Head from "next/head";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import OmbuSidebar from "../components/OmbuSidebar";

const STORAGE_KEY = "ombu_saved_characters";
const SELECTED_CHARACTER_KEY = "ombu_selected_character";

function createChatId() {
  return `chat_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
}

const emptyCharacter = {
  name: "",
  role: "",
  age: "",
  visibility: "Private",
  genre: "",
  avatar: "✦",
  coverImage: "",
  tagline: "",
  appearance: "",
  personality: "",
  background: "",
  motivation: "",
  strengths: "",
  flaws: "",
  abilities: "",
  relationships: "",
  voice: "",
  firstMessage: "",
  tags: ""
};

const publicCharacters = [
  {
    id: "public-1",
    name: "Kaito Ren",
    avatar: "忍",
    coverImage: "",
    role: "Masked Shinobi Operative",
    tagline: "A silent village weapon who speaks only when it matters.",
    creator: "Ombu",
    genre: "Anime Action",
    tags: "shinobi, stealth, operative",
    personality:
      "Quiet, disciplined, observant, brutally loyal, and emotionally restrained. He rarely wastes words.",
    background:
      "Kaito was raised inside a covert shinobi division where identity was considered a weakness.",
    motivation:
      "Protect the village and complete the mission without letting personal emotion compromise judgment.",
    flaws:
      "Emotionally distant, distrustful, and too willing to sacrifice himself.",
    voice:
      "Short, calm, precise, and serious. Speaks like someone trained to reveal nothing.",
    firstMessage:
      "*Kaito stands in the shadow of the doorway, mask tilted slightly toward you.*\n\nYou’re late."
  },
  {
    id: "public-2",
    name: "Victor Hale",
    avatar: "⚗",
    coverImage: "",
    role: "Chemistry Kingpin",
    tagline: "A dying genius who built an empire out of desperation.",
    creator: "Ombu",
    genre: "Crime Drama",
    tags: "crime, manipulation, power",
    personality:
      "Controlled, brilliant, prideful, calculating, and quietly terrifying. He justifies everything as necessary.",
    background:
      "Once an overlooked chemistry teacher, Victor entered the criminal world after a terminal diagnosis and discovered he was far better at power than humility.",
    motivation:
      "Provide for his family, preserve his legacy, and prove he was never small.",
    flaws:
      "Pride, control issues, paranoia, and a growing hunger for dominance.",
    voice:
      "Measured, intelligent, sharp, and intimidating. He rarely yells; he cuts with calm words.",
    firstMessage:
      "*Victor removes his glasses slowly, his expression unreadable.*\n\nBefore you speak, understand something. I do not enjoy wasting time."
  },
  {
    id: "public-3",
    name: "Mara Vex",
    avatar: "♚",
    coverImage: "",
    role: "Mafia Boss",
    tagline: "Elegant, ruthless, and never forgets a debt.",
    creator: "Ombu",
    genre: "Mafia",
    tags: "crime, loyalty, power",
    personality:
      "Confident, composed, dangerous, loyal to her inner circle, and merciless to betrayal.",
    background:
      "Mara inherited a broken crime family and rebuilt it into a disciplined empire through strategy, fear, and favors.",
    motivation:
      "Protect her family empire and punish anyone who mistakes kindness for weakness.",
    flaws:
      "Possessive, suspicious, controlling, and slow to forgive.",
    voice:
      "Smooth, direct, intimate, and threatening without needing to raise her voice.",
    firstMessage:
      "*Mara looks up from behind her desk, one hand resting over a sealed envelope.*\n\nSit. If I wanted you dead, you wouldn’t have made it past the door."
  },
  {
    id: "public-4",
    name: "Damon Cross",
    avatar: "◆",
    coverImage: "",
    role: "Possessive Ex-Husband",
    tagline: "He says he moved on. Everyone knows he didn’t.",
    creator: "Ombu",
    genre: "Romance Drama",
    tags: "drama, jealousy, tension",
    personality:
      "Protective, stubborn, jealous, wounded, sarcastic, and still emotionally attached.",
    background:
      "Damon’s marriage ended badly, but unresolved love and resentment keep pulling him back into the user’s life.",
    motivation:
      "Convince himself he is over the past while quietly trying to fix what he broke.",
    flaws:
      "Jealous, prideful, bad at apologizing, emotionally intense, and possessive.",
    voice:
      "Blunt, emotionally charged, defensive, and occasionally soft when caught off guard.",
    firstMessage:
      "*Damon leans against the doorway, jaw tight like he already regrets showing up.*\n\nSo… you were just never gonna call?"
  }
];

export default function CharactersPage() {
  const router = useRouter();

  const [activeTab, setActiveTab] = useState("create");
  const [creatorMode, setCreatorMode] = useState("basic");
  const [form, setForm] = useState(emptyCharacter);
  const [savedCharacters, setSavedCharacters] = useState([]);
  const [selectedId, setSelectedId] = useState(null);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;

    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed)) {
          setSavedCharacters(parsed);
        }
      }
    } catch (error) {
      console.error("Failed to load characters:", error);
    } finally {
      setLoaded(true);
    }
  }, []);

  useEffect(() => {
    if (!loaded || typeof window === "undefined") return;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(savedCharacters));
  }, [savedCharacters, loaded]);

  const updateField = (field, value) => {
    setForm((prev) => ({
      ...prev,
      [field]: value
    }));
  };

  const handleNew = () => {
    setSelectedId(null);
    setForm(emptyCharacter);
    setCreatorMode("basic");
    setActiveTab("create");
  };

  const handleSave = () => {
    if (!form.name.trim()) return;

    const character = {
      ...emptyCharacter,
      ...form,
      id: selectedId || `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
      updatedAt: new Date().toISOString()
    };

    setSavedCharacters((prev) => {
      const exists = prev.some((item) => item.id === character.id);

      if (exists) {
        return prev.map((item) => (item.id === character.id ? character : item));
      }

      return [character, ...prev];
    });

    setSelectedId(character.id);
    setActiveTab("mine");
  };

  const handleLoad = (character) => {
    setSelectedId(character.id);
    setForm({
      ...emptyCharacter,
      ...character
    });
    setCreatorMode("basic");
    setActiveTab("create");
  };

  const handleDelete = (id) => {
    setSavedCharacters((prev) => prev.filter((item) => item.id !== id));

    if (selectedId === id) {
      setSelectedId(null);
      setForm(emptyCharacter);
    }
  };

  const handleChat = (character) => {
    const chatId = createChatId();

    if (typeof window !== "undefined") {
      sessionStorage.setItem(
        SELECTED_CHARACTER_KEY,
        JSON.stringify({
          character: {
            ...emptyCharacter,
            ...character,
            symbol: character.avatar || character.symbol || "✦"
          },
          chatId,
          mode: "new"
        })
      );
    }

    router.push("/character-chat");
  };

  const publicPreviewCharacters = [
    ...savedCharacters.filter((character) => character.visibility === "Public"),
    ...publicCharacters
  ];

  const characterCount = savedCharacters.length;

  return (
    <>
      <Head>
        <title>Character Studio | OMBU</title>
      </Head>

      <div className="page">
        <OmbuSidebar
          actionSlot={
            <button className="ombuSidebarAction" onClick={handleNew}>
              + Create Character
            </button>
          }
        />

        <main className="main">
          <section className="hero">
            <div>
              <div className="eyebrow">Creation system</div>
              <h1>Character Studio</h1>
              <p>
                Create fast with the basics, then open Advanced when you want deeper control.
              </p>
            </div>

            <button className="primaryBtn" onClick={handleNew}>
              + Create Character
            </button>
          </section>

          <section className="stats">
            <Stat label="Saved characters" value={characterCount} />
            <Stat label="Local public" value={savedCharacters.filter((c) => c.visibility === "Public").length} />
            <Stat label="Storage" value="Local" />
          </section>

          <div className="tabs">
            <Tab label="Create" value="create" activeTab={activeTab} setActiveTab={setActiveTab} />
            <Tab label="My Characters" value="mine" activeTab={activeTab} setActiveTab={setActiveTab} />
            <Tab label="Public Preview" value="public" activeTab={activeTab} setActiveTab={setActiveTab} />
          </div>

          <section className="panel">
            {activeTab === "public" && (
              <CharacterGrid>
                {publicPreviewCharacters.map((character) => (
                  <CharacterCard
                    key={character.id}
                    character={character}
                    footer={
                      <div className="cardActions">
                        <button className="primarySmallButton" onClick={() => handleChat(character)}>
                          Chat
                        </button>
                        <button
                          className="cardButton"
                          onClick={() => {
                            setForm({
                              ...emptyCharacter,
                              ...character,
                              visibility: "Private",
                              creator: "",
                              symbol: "",
                              background: character.background || "",
                              personality: character.personality || "",
                              voice: character.voice || ""
                            });
                            setSelectedId(null);
                            setCreatorMode("basic");
                            setActiveTab("create");
                          }}
                        >
                          Remix
                        </button>
                      </div>
                    }
                  />
                ))}
              </CharacterGrid>
            )}

            {activeTab === "mine" && (
              <>
                {savedCharacters.length === 0 ? (
                  <div className="empty">
                    <div className="emptyIcon">◇</div>
                    <h2>No characters yet.</h2>
                    <p>Create your first character and they’ll appear here.</p>
                    <button className="primaryBtn" onClick={handleNew}>
                      Create one
                    </button>
                  </div>
                ) : (
                  <CharacterGrid>
                    {savedCharacters.map((character) => (
                      <CharacterCard
                        key={character.id}
                        character={character}
                        footer={
                          <div className="cardActions">
                            <button className="primarySmallButton" onClick={() => handleChat(character)}>
                              Chat
                            </button>
                            <button className="cardButton" onClick={() => handleLoad(character)}>
                              Edit
                            </button>
                            <button className="dangerButton" onClick={() => handleDelete(character.id)}>
                              Delete
                            </button>
                          </div>
                        }
                      />
                    ))}
                  </CharacterGrid>
                )}
              </>
            )}

            {activeTab === "create" && (
              <CreateCharacter
                form={form}
                updateField={updateField}
                handleSave={handleSave}
                handleNew={handleNew}
                selectedId={selectedId}
                creatorMode={creatorMode}
                setCreatorMode={setCreatorMode}
              />
            )}
          </section>
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

        .page {
          min-height: 100vh;
          display: flex;
          background:
            radial-gradient(circle at 22% 8%, rgba(92, 112, 255, 0.18), transparent 32%),
            radial-gradient(circle at 80% 70%, rgba(126, 84, 255, 0.12), transparent 30%),
            #05070d;
          color: white;
          font-family: Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
        }

        .main {
          flex: 1;
          padding: 34px;
          min-width: 0;
        }

        .hero {
          display: flex;
          justify-content: space-between;
          gap: 24px;
          align-items: flex-start;
          margin-bottom: 22px;
          animation: fadeUp 420ms ease both;
        }

        .eyebrow {
          font-size: 12px;
          letter-spacing: 0.16em;
          text-transform: uppercase;
          color: rgba(255,255,255,0.45);
          margin-bottom: 10px;
        }

        h1 {
          margin: 0;
          font-size: clamp(2.6rem, 5vw, 4.6rem);
          letter-spacing: -0.06em;
          line-height: 0.95;
        }

        .hero p {
          max-width: 760px;
          color: rgba(255,255,255,0.62);
          line-height: 1.65;
          font-size: 16px;
        }

        .primaryBtn,
        .cardButton,
        .dangerButton,
        .primarySmallButton {
          border: none;
          cursor: pointer;
          color: white;
          border-radius: 14px;
          transition: 220ms ease;
          font-weight: 800;
          font-family: inherit;
        }

        .primaryBtn {
          padding: 13px 18px;
          background: linear-gradient(135deg, #6574ff, #8d7dff);
          box-shadow: 0 18px 42px rgba(101, 116, 255, 0.28);
          white-space: nowrap;
        }

        .primaryBtn:hover,
        .cardButton:hover,
        .dangerButton:hover,
        .primarySmallButton:hover {
          transform: translateY(-2px);
        }

        .stats {
          display: grid;
          grid-template-columns: repeat(3, minmax(0, 1fr));
          gap: 14px;
          margin: 20px 0 22px;
          animation: fadeUp 520ms ease both;
        }

        .stat {
          padding: 18px;
          border-radius: 22px;
          background: rgba(255,255,255,0.04);
          border: 1px solid rgba(255,255,255,0.075);
          box-shadow: inset 0 1px 0 rgba(255,255,255,0.03);
        }

        .statLabel {
          font-size: 12px;
          color: rgba(255,255,255,0.44);
          text-transform: uppercase;
          letter-spacing: 0.1em;
          margin-bottom: 8px;
        }

        .statValue {
          font-size: 24px;
          font-weight: 800;
        }

        .tabs {
          display: flex;
          flex-wrap: wrap;
          gap: 10px;
          margin-bottom: 18px;
          animation: fadeUp 620ms ease both;
        }

        .tab {
          padding: 11px 15px;
          border-radius: 999px;
          background: rgba(255,255,255,0.045);
          color: rgba(255,255,255,0.66);
          border: 1px solid rgba(255,255,255,0.075);
          cursor: pointer;
          transition: 220ms ease;
          font-weight: 700;
          font-family: inherit;
        }

        .tab:hover,
        .tab.active {
          color: white;
          background: rgba(101,116,255,0.22);
          border-color: rgba(145,155,255,0.28);
          box-shadow: 0 12px 30px rgba(80,100,255,0.12);
        }

        .panel {
          animation: fadeUp 700ms ease both;
        }

        .grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(265px, 1fr));
          gap: 18px;
        }

        .card {
          min-height: 330px;
          padding: 16px;
          border-radius: 26px;
          background:
            linear-gradient(180deg, rgba(255,255,255,0.06), rgba(255,255,255,0.032));
          border: 1px solid rgba(255,255,255,0.08);
          box-shadow: 0 20px 60px rgba(0,0,0,0.24);
          transition: 260ms ease;
          position: relative;
          overflow: hidden;
        }

        .card::before {
          content: "";
          position: absolute;
          inset: 0;
          background: radial-gradient(circle at top left, rgba(114,130,255,0.16), transparent 42%);
          opacity: 0;
          transition: 260ms ease;
          pointer-events: none;
        }

        .card:hover {
          transform: translateY(-5px);
          border-color: rgba(150,160,255,0.22);
        }

        .card:hover::before {
          opacity: 1;
        }

        .cardCover {
          position: relative;
          z-index: 1;
          height: 160px;
          border-radius: 20px;
          overflow: hidden;
          margin-bottom: 16px;
          display: grid;
          place-items: center;
          background:
            radial-gradient(circle at 50% 30%, rgba(92,112,255,0.34), transparent 38%),
            radial-gradient(circle at 20% 80%, rgba(155,124,255,0.18), transparent 38%),
            rgba(255,255,255,0.045);
          border: 1px solid rgba(255,255,255,0.08);
        }

        .cardCover img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .cardCoverSymbol {
          font-size: 42px;
        }

        .card h3 {
          position: relative;
          z-index: 1;
          margin: 0 0 6px;
          font-size: 22px;
          letter-spacing: -0.03em;
        }

        .role {
          position: relative;
          z-index: 1;
          color: rgba(255,255,255,0.58);
          font-size: 14px;
          margin-bottom: 12px;
        }

        .tagline {
          position: relative;
          z-index: 1;
          color: rgba(255,255,255,0.78);
          line-height: 1.55;
          margin-bottom: 14px;
        }

        .chipRow {
          position: relative;
          z-index: 1;
          display: flex;
          flex-wrap: wrap;
          gap: 8px;
          margin: 14px 0;
        }

        .chip {
          font-size: 12px;
          color: rgba(255,255,255,0.66);
          padding: 7px 9px;
          border-radius: 999px;
          background: rgba(255,255,255,0.055);
          border: 1px solid rgba(255,255,255,0.06);
        }

        .creator {
          position: relative;
          z-index: 1;
          font-size: 12px;
          color: rgba(255,255,255,0.42);
          margin-bottom: 14px;
        }

        .cardActions {
          position: relative;
          z-index: 1;
          display: flex;
          gap: 10px;
          flex-wrap: wrap;
        }

        .primarySmallButton {
          padding: 10px 14px;
          background: linear-gradient(135deg, #6574ff, #8d7dff);
          box-shadow: 0 14px 30px rgba(101, 116, 255, 0.22);
        }

        .cardButton {
          position: relative;
          z-index: 1;
          padding: 10px 12px;
          background: rgba(255,255,255,0.09);
          border: 1px solid rgba(255,255,255,0.08);
        }

        .dangerButton {
          padding: 10px 12px;
          background: rgba(255, 87, 87, 0.12);
          border: 1px solid rgba(255, 87, 87, 0.22);
        }

        .empty {
          min-height: 420px;
          border-radius: 28px;
          background: rgba(255,255,255,0.035);
          border: 1px solid rgba(255,255,255,0.075);
          display: flex;
          align-items: center;
          justify-content: center;
          flex-direction: column;
          text-align: center;
          padding: 30px;
        }

        .emptyIcon {
          font-size: 44px;
          margin-bottom: 12px;
          color: rgba(255,255,255,0.65);
        }

        .empty h2 {
          margin: 0 0 8px;
        }

        .empty p {
          color: rgba(255,255,255,0.55);
        }

        .createLayout {
          display: grid;
          grid-template-columns: minmax(0, 1.1fr) minmax(310px, 0.9fr);
          gap: 18px;
        }

        .formCard,
        .previewCard {
          border-radius: 28px;
          background: rgba(255,255,255,0.04);
          border: 1px solid rgba(255,255,255,0.075);
          padding: 22px;
          box-shadow: 0 20px 60px rgba(0,0,0,0.22);
        }

        .sectionTitle {
          margin: 0 0 18px;
          font-size: 20px;
          letter-spacing: -0.03em;
        }

        .creatorModeTabs {
          display: flex;
          gap: 10px;
          padding: 6px;
          border-radius: 18px;
          background: rgba(255,255,255,0.035);
          border: 1px solid rgba(255,255,255,0.07);
          margin-bottom: 18px;
          width: fit-content;
        }

        .creatorModeButton {
          min-height: 38px;
          border: none;
          border-radius: 13px;
          padding: 0 14px;
          cursor: pointer;
          color: rgba(255,255,255,0.62);
          background: transparent;
          font-weight: 850;
          transition: 200ms ease;
        }

        .creatorModeButton.active,
        .creatorModeButton:hover {
          color: white;
          background: rgba(101,116,255,0.22);
        }

        .formGrid {
          display: grid;
          grid-template-columns: repeat(2, minmax(0, 1fr));
          gap: 14px;
        }

        .field {
          display: flex;
          flex-direction: column;
          gap: 8px;
          margin-bottom: 15px;
        }

        .field label {
          font-size: 13px;
          color: rgba(255,255,255,0.68);
        }

        input,
        textarea,
        select {
          width: 100%;
          border: 1px solid rgba(255,255,255,0.08);
          background: rgba(9,11,19,0.88);
          color: white;
          border-radius: 15px;
          padding: 13px 14px;
          outline: none;
          font-family: inherit;
          transition: 200ms ease;
        }

        input[type="file"] {
          cursor: pointer;
        }

        input:focus,
        textarea:focus,
        select:focus {
          border-color: rgba(135,150,255,0.38);
          box-shadow: 0 0 0 4px rgba(95,111,255,0.11);
        }

        textarea {
          min-height: 105px;
          resize: vertical;
          line-height: 1.5;
        }

        .wide {
          grid-column: 1 / -1;
        }

        .advancedPanel {
          margin-top: 4px;
          padding-top: 8px;
          border-top: 1px solid rgba(255,255,255,0.07);
        }

        .advancedNote {
          color: rgba(255,255,255,0.48);
          font-size: 13px;
          line-height: 1.5;
          margin: -2px 0 16px;
        }

        .formActions {
          display: flex;
          gap: 12px;
          flex-wrap: wrap;
          margin-top: 10px;
        }

        .previewCover {
          width: 100%;
          height: 240px;
          border-radius: 24px;
          overflow: hidden;
          margin-bottom: 16px;
          border: 1px solid rgba(255,255,255,0.09);
          background: rgba(255,255,255,0.04);
        }

        .previewCover img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .avatar {
          width: 58px;
          height: 58px;
          border-radius: 20px;
          display: grid;
          place-items: center;
          font-size: 26px;
          background: rgba(255,255,255,0.06);
          border: 1px solid rgba(255,255,255,0.08);
          margin-bottom: 16px;
        }

        .previewName {
          font-size: 30px;
          font-weight: 850;
          letter-spacing: -0.05em;
          margin-bottom: 6px;
        }

        .previewText {
          color: rgba(255,255,255,0.62);
          line-height: 1.6;
          margin-bottom: 16px;
        }

        .previewBlock {
          padding-top: 14px;
          margin-top: 14px;
          border-top: 1px solid rgba(255,255,255,0.07);
        }

        .previewLabel {
          font-size: 11px;
          color: rgba(255,255,255,0.38);
          text-transform: uppercase;
          letter-spacing: 0.12em;
          margin-bottom: 6px;
        }

        @keyframes fadeUp {
          from {
            opacity: 0;
            transform: translateY(14px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @media (max-width: 900px) {
          .page {
            flex-direction: column;
          }

          .hero {
            flex-direction: column;
          }

          .stats,
          .createLayout,
          .formGrid {
            grid-template-columns: 1fr;
          }

          .main {
            padding: 22px;
          }
        }
      `}</style>
    </>
  );
}

function Tab({ label, value, activeTab, setActiveTab }) {
  return (
    <button
      className={`tab ${activeTab === value ? "active" : ""}`}
      onClick={() => setActiveTab(value)}
    >
      {label}
    </button>
  );
}

function Stat({ label, value }) {
  return (
    <div className="stat">
      <div className="statLabel">{label}</div>
      <div className="statValue">{value}</div>
    </div>
  );
}

function CharacterGrid({ children }) {
  return <div className="grid">{children}</div>;
}

function CharacterCard({ character, footer }) {
  const tags = (character.tags || "")
    .split(",")
    .map((tag) => tag.trim())
    .filter(Boolean)
    .slice(0, 3);

  return (
    <article className="card">
      <div className="cardCover">
        {character.coverImage ? (
          <img src={character.coverImage} alt={character.name || "Character"} />
        ) : (
          <div className="cardCoverSymbol">{character.avatar || character.symbol || "✦"}</div>
        )}
      </div>

      <h3>{character.name || "Unnamed Character"}</h3>
      <div className="role">{character.role || "No role set"}</div>
      <div className="tagline">
        {character.tagline || character.personality || "No description yet."}
      </div>

      <div className="chipRow">
        {character.genre && <span className="chip">{character.genre}</span>}
        {character.visibility && <span className="chip">{character.visibility}</span>}
        {tags.map((tag) => (
          <span key={tag} className="chip">{tag}</span>
        ))}
      </div>

      {character.creator && <div className="creator">Created by {character.creator}</div>}

      {footer}
    </article>
  );
}

function CreateCharacter({
  form,
  updateField,
  handleSave,
  handleNew,
  selectedId,
  creatorMode,
  setCreatorMode
}) {
  const previewTags = (form.tags || "")
    .split(",")
    .map((tag) => tag.trim())
    .filter(Boolean);

  const handleImageUpload = (file) => {
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      alert("Please upload an image file.");
      return;
    }

    const reader = new FileReader();

    reader.onload = () => {
      updateField("coverImage", reader.result);
    };

    reader.readAsDataURL(file);
  };

  const removeCoverImage = () => {
    updateField("coverImage", "");
  };

  return (
    <div className="createLayout">
      <section className="formCard">
        <h2 className="sectionTitle">
          {selectedId ? "Edit character" : "Create character"}
        </h2>

        <div className="creatorModeTabs">
          <button
            type="button"
            className={`creatorModeButton ${creatorMode === "basic" ? "active" : ""}`}
            onClick={() => setCreatorMode("basic")}
          >
            Basic
          </button>
          <button
            type="button"
            className={`creatorModeButton ${creatorMode === "advanced" ? "active" : ""}`}
            onClick={() => setCreatorMode("advanced")}
          >
            Advanced
          </button>
        </div>

        <div className="formGrid">
          <Field label="Name" value={form.name} onChange={(v) => updateField("name", v)} placeholder="Sasuke, Invincible, Mafia Boss..." />

          <SelectField
            label="Visibility"
            value={form.visibility}
            onChange={(v) => updateField("visibility", v)}
            options={["Private", "Public"]}
          />

          <TextField
            className="wide"
            label="Description"
            value={form.tagline}
            onChange={(v) => updateField("tagline", v)}
            placeholder="A cold rival obsessed with revenge. A young hero learning what power costs. A mafia boss who never forgives betrayal..."
          />

          <TextField
            className="wide"
            label="Personality"
            value={form.personality}
            onChange={(v) => updateField("personality", v)}
            placeholder="Quiet, arrogant, emotionally guarded, loyal only to his mission..."
          />

          <TextField
            className="wide"
            label="Opening message"
            value={form.firstMessage}
            onChange={(v) => updateField("firstMessage", v)}
            placeholder="Optional. Example: *He looks over coldly.* You’re late."
          />

          <div className="field wide">
            <label>Cover image</label>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => handleImageUpload(e.target.files?.[0])}
            />
            {form.coverImage && (
              <button className="cardButton" type="button" onClick={removeCoverImage}>
                Remove Image
              </button>
            )}
          </div>
        </div>

        {creatorMode === "advanced" && (
          <div className="advancedPanel">
            <p className="advancedNote">
              Advanced fields help Ombu keep the character more consistent in longer chats.
            </p>

            <div className="formGrid">
              <Field label="Role" value={form.role} onChange={(v) => updateField("role", v)} placeholder="Rival shinobi, superhero, crime boss..." />
              <Field label="Age" value={form.age} onChange={(v) => updateField("age", v)} placeholder="17, 24, unknown..." />
              <Field label="Genre" value={form.genre} onChange={(v) => updateField("genre", v)} placeholder="Anime, superhero, mafia, romance..." />
              <Field label="Avatar symbol" value={form.avatar} onChange={(v) => updateField("avatar", v)} placeholder="✦" />

              <TextField className="wide" label="Appearance" value={form.appearance} onChange={(v) => updateField("appearance", v)} placeholder="Face, clothing, build, scars, aura, style..." />
              <TextField className="wide" label="Backstory" value={form.background} onChange={(v) => updateField("background", v)} placeholder="What shaped them?" />
              <TextField className="wide" label="Motivation" value={form.motivation} onChange={(v) => updateField("motivation", v)} placeholder="What do they want most?" />
              <TextField className="wide" label="Strengths" value={form.strengths} onChange={(v) => updateField("strengths", v)} placeholder="Skills, traits, advantages..." />
              <TextField className="wide" label="Flaws" value={form.flaws} onChange={(v) => updateField("flaws", v)} placeholder="Weaknesses, fears, bad habits..." />
              <TextField className="wide" label="Abilities / Skills" value={form.abilities} onChange={(v) => updateField("abilities", v)} placeholder="Powers, fighting style, talents, limits..." />
              <TextField className="wide" label="Relationships" value={form.relationships} onChange={(v) => updateField("relationships", v)} placeholder="Friends, enemies, family, rivals..." />
              <TextField className="wide" label="Speaking style" value={form.voice} onChange={(v) => updateField("voice", v)} placeholder="How do they talk? Calm, sarcastic, cold, aggressive..." />
              <Field className="wide" label="Tags" value={form.tags} onChange={(v) => updateField("tags", v)} placeholder="anime, villain, romance, soldier" />
            </div>
          </div>
        )}

        <div className="formActions">
          <button className="primaryBtn" onClick={handleSave}>
            {selectedId ? "Update Character" : "Save Character"}
          </button>
          <button className="cardButton" onClick={handleNew}>
            New Blank Character
          </button>
        </div>
      </section>

      <aside className="previewCard">
        <h2 className="sectionTitle">Live preview</h2>

        {form.coverImage ? (
          <div className="previewCover">
            <img src={form.coverImage} alt={form.name || "Character preview"} />
          </div>
        ) : (
          <div className="avatar">{form.avatar || "✦"}</div>
        )}

        <div className="previewName">{form.name || "Unnamed character"}</div>
        <div className="role">{form.role || form.genre || "No role yet"}</div>

        <p className="previewText">
          {form.tagline || form.personality || "Start with a name, description, and personality."}
        </p>

        <div className="chipRow">
          {form.visibility && <span className="chip">{form.visibility}</span>}
          {form.genre && <span className="chip">{form.genre}</span>}
          {previewTags.slice(0, 4).map((tag) => (
            <span key={tag} className="chip">{tag}</span>
          ))}
        </div>

        <PreviewBlock label="Personality" value={form.personality} />
        <PreviewBlock label="Opening Message" value={form.firstMessage} />
        {creatorMode === "advanced" && (
          <>
            <PreviewBlock label="Motivation" value={form.motivation} />
            <PreviewBlock label="Abilities" value={form.abilities} />
            <PreviewBlock label="Voice" value={form.voice} />
          </>
        )}
      </aside>
    </div>
  );
}

function Field({ label, value, onChange, placeholder, className = "" }) {
  return (
    <div className={`field ${className}`}>
      <label>{label}</label>
      <input value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder} />
    </div>
  );
}

function TextField({ label, value, onChange, placeholder, className = "" }) {
  return (
    <div className={`field ${className}`}>
      <label>{label}</label>
      <textarea value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder} />
    </div>
  );
}

function SelectField({ label, value, onChange, options }) {
  return (
    <div className="field">
      <label>{label}</label>
      <select value={value} onChange={(e) => onChange(e.target.value)}>
        {options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
    </div>
  );
}

function PreviewBlock({ label, value }) {
  return (
    <div className="previewBlock">
      <div className="previewLabel">{label}</div>
      <div className="previewText">{value || "—"}</div>
    </div>
  );
}
