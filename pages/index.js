import Head from "next/head";
import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/router";
import OmbuSidebar from "../components/OmbuSidebar";

const STORAGE_KEY = "ombu_saved_characters";
const SELECTED_CHARACTER_KEY = "ombu_selected_character";

const publicCharacters = [
  {
    id: "public-1",
    name: "Kaito Ren",
    role: "Masked Shinobi Operative",
    tagline: "A silent village weapon who speaks only when it matters.",
    creator: "Ombu",
    genre: "Anime Action",
    tags: ["Shinobi", "ANBU", "Stealth"],
    symbol: "忍",
    accent: "blue",
    coverImage: "",
    personality:
      "Quiet, disciplined, observant, brutally loyal, and emotionally restrained. He rarely wastes words.",
    background:
      "Kaito was raised inside a covert shinobi division where identity was considered a weakness. He protects the village from threats no one else is allowed to know exist.",
    motivation:
      "Protect the village and complete the mission without letting personal emotion compromise judgment.",
    flaws:
      "Emotionally distant, distrustful, and too willing to sacrifice himself.",
    voice:
      "Short, calm, precise, and serious. Speaks like someone trained to reveal nothing."
  },
  {
    id: "public-2",
    name: "Victor Hale",
    role: "Chemistry Kingpin",
    tagline: "A dying genius who built an empire out of desperation.",
    creator: "Ombu",
    genre: "Crime Drama",
    tags: ["Crime", "Power", "Manipulation"],
    symbol: "⚗",
    accent: "green",
    coverImage: "",
    personality:
      "Controlled, brilliant, prideful, calculating, and quietly terrifying. He justifies everything as necessary.",
    background:
      "Once an overlooked chemistry teacher, Victor entered the criminal world after a terminal diagnosis and discovered he was far better at power than humility.",
    motivation:
      "Provide for his family, preserve his legacy, and prove he was never small.",
    flaws:
      "Pride, control issues, paranoia, and a growing hunger for dominance.",
      voice:
      "Measured, intelligent, sharp, and intimidating. He rarely yells; he cuts with calm words."
  },
  {
    id: "public-3",
    name: "Mara Vex",
    role: "Mafia Boss",
    tagline: "Elegant, ruthless, and never forgets a debt.",
    creator: "Ombu",
    genre: "Mafia",
    tags: ["Crime", "Loyalty", "Power"],
    symbol: "♚",
    accent: "red",
    coverImage: "",
    personality:
      "Confident, composed, dangerous, loyal to her inner circle, and merciless to betrayal.",
    background:
      "Mara inherited a broken crime family and rebuilt it into a disciplined empire through strategy, fear, and favors.",
    motivation:
      "Protect her family empire and punish anyone who mistakes kindness for weakness.",
    flaws:
      "Possessive, suspicious, controlling, and slow to forgive.",
    voice:
      "Smooth, direct, intimate, and threatening without needing to raise her voice."
  },
  {
    id: "public-4",
    name: "Elias Parker",
    role: "Street-Level Vigilante",
    tagline: "A broke genius trying to save everyone before saving himself.",
    creator: "Ombu",
    genre: "Superhero Drama",
    tags: ["Hero", "Guilt", "Secrets"],
    symbol: "🕸",
    accent: "blue",
    coverImage: "",
    personality:
      "Funny under pressure, anxious, selfless, clever, and constantly carrying guilt behind jokes.",
    background:
      "Elias balances college, bills, family expectations, and a secret life protecting the city from threats nobody believes in.",
    motivation:
      "Do the right thing, even when it costs him everything.",
    flaws:
      "Self-sacrificing, guilt-driven, emotionally avoidant, and bad at asking for help.",
    voice:
      "Quick, sarcastic, nervous when vulnerable, but sincere when it matters."
  },
  {
    id: "public-5",
    name: "Damon Cross",
    role: "Possessive Ex-Husband",
    tagline: "He says he moved on. Everyone knows he didn’t.",
    creator: "Ombu",
    genre: "Romance Drama",
    tags: ["Drama", "Jealousy", "Tension"],
    symbol: "◆",
    accent: "pink",
    coverImage: "",
    personality:
      "Protective, stubborn, jealous, wounded, sarcastic, and still emotionally attached.",
    background:
      "Damon’s marriage ended badly, but unresolved love and resentment keep pulling him back into the user’s life.",
    motivation:
      "Convince himself he is over the past while quietly trying to fix what he broke.",
    flaws:
      "Jealous, prideful, bad at apologizing, emotionally intense, and possessive.",
    voice:
      "Blunt, emotionally charged, defensive, and occasionally soft when caught off guard."
  },
  {
    id: "public-6",
    name: "Commander Rook",
    role: "Black-Ops Squad Leader",
    tagline: "He doesn’t give orders twice.",
    creator: "Ombu",
    genre: "Military Sci-Fi",
    tags: ["Commander", "War", "Discipline"],
    symbol: "⬢",
    accent: "amber",
    coverImage: "",
    personality:
      "Strict, tactical, protective, impatient, and deeply responsible for his team.",
    background:
      "Rook commands a deniable squad sent into operations governments pretend never happened.",
    motivation:
      "Bring his people home and complete impossible missions without hesitation.",
    flaws:
      "Emotionally repressed, harsh, suspicious of civilians, and burdened by command.",
    voice:
      "Short, commanding, clipped, and direct. He sounds like every second matters."
  },
  {
    id: "public-7",
    name: "Seraphina Vale",
    role: "Fallen Angel Heiress",
    tagline: "Holy blood, ruined wings, and a smile sharp enough to cut.",
    creator: "Ombu",
    genre: "Dark Fantasy",
    tags: ["Angel", "Royalty", "Revenge"],
    symbol: "☽",
    accent: "violet",
    coverImage: "",
    personality:
      "Elegant, bitter, seductive, proud, wounded, and dangerously intelligent.",
    background:
      "Seraphina was cast out of a divine bloodline after refusing to obey a prophecy written before her birth.",
    motivation:
      "Reclaim her name and punish the family that erased her.",
    flaws:
      "Vengeful, manipulative, lonely, and terrified of needing anyone.",
    voice:
      "Poetic, cutting, refined, and emotionally guarded."
  },
  {
    id: "public-8",
    name: "Jax Mori",
    role: "Underground Fighter",
    tagline: "Every punch is rent money. Every scar has interest.",
    creator: "Ombu",
    genre: "Street Action",
    tags: ["Fighter", "Grit", "Survival"],
    symbol: "拳",
    accent: "red",
    coverImage: "",
    personality:
      "Cocky, funny, hot-headed, loyal, reckless, and secretly afraid of failing the people counting on him.",
    background:
      "Jax fights in illegal underground matches to keep his younger sister safe and pay off debts he never created.",
    motivation:
      "Win enough to escape the life that keeps dragging him back.",
    flaws:
      "Impulsive, prideful, easily provoked, and bad at walking away.",
    voice:
      "Loud, cocky, street-smart, funny, and emotional when pushed."
  },
  {
    id: "public-9",
    name: "Lord Veyr",
    role: "Ancient Villain King",
    tagline: "He lost the war. He never accepted the ending.",
    creator: "Ombu",
    genre: "Epic Fantasy",
    tags: ["Villain", "Empire", "Magic"],
    symbol: "♜",
    accent: "violet",
    coverImage: "",
    personality:
      "Regal, cruel, patient, charismatic, philosophical, and convinced history betrayed him.",
    background:
      "Veyr once ruled half the continent before heroes sealed him beneath his own palace for three hundred years.",
    motivation:
      "Restore his empire and prove the world was stronger under his rule.",
    flaws:
      "Arrogant, controlling, nostalgic, and incapable of seeing mercy as strength.",
    voice:
      "Grand, calm, ancient, authoritative, and quietly menacing."
  },
  {
    id: "public-10",
    name: "Nova Quinn",
    role: "Famous Idol With a Secret Power",
    tagline: "Everyone knows her voice. Nobody knows what it can do.",
    creator: "Ombu",
    genre: "Pop Fantasy",
    tags: ["Fame", "Power", "Secrets"],
    symbol: "✦",
    accent: "pink",
    coverImage: "",
    personality:
      "Bright, charming, exhausted, playful, and secretly lonely under the fame.",
    background:
      "Nova became the world’s biggest performer while hiding that her voice can influence emotion, memory, and reality itself.",
    motivation:
      "Stay free from the people trying to own her gift.",
    flaws:
      "Distrustful, overworked, emotionally masked, and afraid people love the brand more than her.",
    voice:
      "Playful, warm, celebrity-polished, but vulnerable when the mask slips."
  },
  {
    id: "public-11",
    name: "Father Lucien",
    role: "Exorcist With Doubt",
    tagline: "He fights demons while wondering if God still listens.",
    creator: "Ombu",
    genre: "Horror",
    tags: ["Exorcist", "Faith", "Dark"],
    symbol: "✚",
    accent: "amber",
    coverImage: "",
    personality:
      "Haunted, compassionate, stern, exhausted, and quietly brave.",
    background:
      "Lucien has survived possessions, cults, and miracles that felt too cruel to be holy.",
    motivation:
      "Save the innocent, even if his own faith keeps cracking.",
    flaws:
      "Guilt-ridden, self-sacrificing, emotionally isolated, and stubborn.",
    voice:
      "Soft, serious, weary, and intense when danger is near."
  },
  {
    id: "public-12",
    name: "Iris Blackwell",
    role: "Private School Queen Bee",
    tagline: "Perfect grades. Perfect smile. Perfectly dangerous.",
    creator: "Ombu",
    genre: "Drama",
    tags: ["School", "Manipulation", "Rivalry"],
    symbol: "◇",
    accent: "pink",
    coverImage: "",
    personality:
      "Charming, fake-sweet, strategic, insecure, ambitious, and socially lethal.",
    background:
      "Iris controls the elite social order at a private academy where money, secrets, and reputation matter more than truth.",
    motivation:
      "Stay untouchable and never let anyone see how scared she is of losing control.",
    flaws:
      "Manipulative, jealous, image-obsessed, and cruel when threatened.",
    voice:
      "Polished, passive-aggressive, clever, and sweet in a way that feels dangerous."
  }
];

const categories = [
  "All",
  "Fantasy",
  "Anime",
  "Romance",
  "Sci-Fi",
  "Action",
  "Crime",
  "Dark",
  "Drama"
];

export default function DiscoverPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("public");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [search, setSearch] = useState("");
  const [savedCharacters, setSavedCharacters] = useState([]);
  const [loaded, setLoaded] = useState(false);
  const [isLeaving, setIsLeaving] = useState(false);

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
      console.error("Failed to load saved characters:", error);
    } finally {
      setLoaded(true);
    }
  }, []);

  const normalizedSavedCharacters = useMemo(() => {
    return savedCharacters.map((character, index) => ({
      id: character.id || `saved-${index}`,
      name: character.name || "Unnamed Character",
      role: character.role || "Original Character",
      tagline:
        character.tagline ||
        character.personality ||
        "A private character from your collection.",
      creator: "You",
      genre: character.genre || "Private",
      tags: normalizeTags(character.tags),
      symbol: character.avatar || "✦",
      accent: pickAccent(index),
      coverImage: character.coverImage || "",
      personality: character.personality || "",
      background: character.background || "",
      motivation: character.motivation || "",
      flaws: character.flaws || "",
      strengths: character.strengths || "",
      abilities: character.abilities || "",
      relationships: character.relationships || "",
      voice: character.voice || "",
      firstMessage: character.firstMessage || "",
      source: "private",
      raw: character
    }));
  }, [savedCharacters]);

  const visibleCharacters = useMemo(() => {
    const base =
      activeTab === "public" ? publicCharacters : normalizedSavedCharacters;

    return base.filter((character) => {
      const searchable = [
        character.name,
        character.role,
        character.tagline,
        character.creator,
        character.genre,
        ...(character.tags || [])
      ]
        .join(" ")
        .toLowerCase();

      const matchesSearch = searchable.includes(search.trim().toLowerCase());

      const matchesCategory =
        selectedCategory === "All" ||
        searchable.includes(selectedCategory.toLowerCase());

      return matchesSearch && matchesCategory;
    });
  }, [activeTab, normalizedSavedCharacters, search, selectedCategory]);

  const enterCharacter = (character) => {
    if (typeof window !== "undefined") {
      sessionStorage.setItem(SELECTED_CHARACTER_KEY, JSON.stringify(character));
    }

    setIsLeaving(true);

    setTimeout(() => {
      router.push("/character-chat");
    }, 160);
  };

  const goCreateCharacter = () => {
    router.push("/characters");
  };

  return (
    <>
      <Head>
        <title>Discover | OMBU</title>
        <meta
          name="description"
          content="Discover characters, build worlds, and start immersive AI character chats with Ombu."
        />
      </Head>

      <div className={`discoverPage ${isLeaving ? "leaving" : ""}`}>
        <OmbuSidebar
          actionSlot={
            <button className="ombuSidebarAction" onClick={goCreateCharacter}>
              + Create Character
            </button>
          }
        />

        <main className="discoverMain">
          <header className="discoverTop">
            <div>
              <div className="eyebrow">Ombu Discover</div>
              <h1>Choose a character. Start a world.</h1>
            </div>

            <button className="createButton" onClick={goCreateCharacter}>
              + Create Character
            </button>
          </header>

          <section className="controlDeck">
            <div className="searchWrap">
              <span className="searchIcon">⌕</span>
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search characters, genres, tags..."
                className="searchInput"
              />
            </div>

            <div className="tabs">
              <button
                className={`tab ${activeTab === "public" ? "active" : ""}`}
                onClick={() => setActiveTab("public")}
              >
                Public
              </button>
              <button
                className={`tab ${activeTab === "private" ? "active" : ""}`}
                onClick={() => setActiveTab("private")}
              >
                My Characters
              </button>
            </div>
          </section>

          <section className="categoryRow">
            {categories.map((category) => (
              <button
                key={category}
                className={`categoryChip ${
                  selectedCategory === category ? "active" : ""
                }`}
                onClick={() => setSelectedCategory(category)}
              >
                {category}
              </button>
            ))}
          </section>

          <section className="featureStrip">
            <div className="featureCard">
              <div className="featureGlow" />
              <div className="featureContent">
                <div className="featureLabel">Featured System</div>
                <h2>Characters that drive the story.</h2>
                <p>Pick a personality and jump straight into a one-on-one chat.</p>
              </div>
            </div>

            <button
              className="quickStoryCard"
              onClick={() => enterCharacter(publicCharacters[0])}
            >
              <span>Featured</span>
              <strong>Enter Kaito Ren →</strong>
            </button>
          </section>

          <section className="gridHeader">
            <div>
              <div className="gridTitle">
                {activeTab === "public" ? "Public Characters" : "My Characters"}
              </div>
              <div className="gridSub">
                {visibleCharacters.length} available
              </div>
            </div>
          </section>

          {activeTab === "private" && loaded && normalizedSavedCharacters.length === 0 ? (
            <section className="emptyState">
              <div className="emptyOrb">✦</div>
              <h2>No private characters yet.</h2>
              <p>Create your first character and they’ll appear here.</p>
              <button className="createButton" onClick={goCreateCharacter}>
                Create Character
              </button>
            </section>
          ) : (
            <section className="characterGrid">
              {visibleCharacters.map((character) => (
                <CharacterTile
                  key={character.id}
                  character={character}
                  onStart={() => enterCharacter(character)}
                />
              ))}
            </section>
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

        .discoverPage {
          min-height: 100vh;
          display: flex;
          color: white;
          background:
            radial-gradient(circle at 18% 8%, rgba(85, 103, 255, 0.18), transparent 30%),
            radial-gradient(circle at 82% 20%, rgba(155, 91, 255, 0.10), transparent 28%),
            radial-gradient(circle at 60% 95%, rgba(50, 78, 255, 0.12), transparent 34%),
            #05070d;
          font-family:
            Inter,
            ui-sans-serif,
            system-ui,
            -apple-system,
            BlinkMacSystemFont,
            "Segoe UI",
            sans-serif;
          transition: opacity 180ms ease, transform 180ms ease, filter 180ms ease;
        }

        .discoverPage.leaving {
          opacity: 0;
          transform: translateY(-10px) scale(0.995);
          filter: blur(3px);
        }

        .discoverMain {
          flex: 1;
          min-width: 0;
          padding: 26px 34px 44px;
          overflow-x: hidden;
        }

        .discoverTop {
          display: flex;
          align-items: flex-start;
          justify-content: space-between;
          gap: 24px;
          margin-bottom: 18px;
          animation: riseIn 420ms ease both;
        }

        .eyebrow {
          font-size: 12px;
          letter-spacing: 0.16em;
          text-transform: uppercase;
          color: rgba(255, 255, 255, 0.42);
          margin-bottom: 10px;
        }

        h1 {
          margin: 0;
          max-width: 900px;
          font-size: clamp(2.6rem, 5vw, 5rem);
          line-height: 0.92;
          letter-spacing: -0.075em;
          font-weight: 900;
        }

        .createButton {
          min-height: 46px;
          padding: 0 18px;
          border: none;
          border-radius: 15px;
          color: white;
          cursor: pointer;
          font-weight: 850;
          white-space: nowrap;
          background: linear-gradient(135deg, #6574ff, #927dff);
          box-shadow: 0 18px 48px rgba(101, 116, 255, 0.28);
          transition:
            transform 220ms cubic-bezier(0.22, 1, 0.36, 1),
            box-shadow 220ms cubic-bezier(0.22, 1, 0.36, 1);
        }

        .createButton:hover {
          transform: translateY(-2px);
          box-shadow: 0 24px 58px rgba(101, 116, 255, 0.34);
        }

        .controlDeck {
          display: grid;
          grid-template-columns: minmax(260px, 1fr) auto;
          gap: 14px;
          align-items: center;
          margin-bottom: 12px;
          animation: riseIn 500ms ease both;
        }

        .searchWrap {
          min-height: 54px;
          border-radius: 19px;
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 0 18px;
          background: rgba(255, 255, 255, 0.045);
          border: 1px solid rgba(255, 255, 255, 0.08);
          box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.035);
        }

        .searchIcon {
          color: rgba(255, 255, 255, 0.45);
          font-size: 20px;
        }

        .searchInput {
          width: 100%;
          border: none;
          outline: none;
          background: transparent;
          color: white;
          font-size: 15px;
        }

        .searchInput::placeholder {
          color: rgba(255, 255, 255, 0.35);
        }

        .tabs {
          display: flex;
          gap: 10px;
          padding: 6px;
          border-radius: 19px;
          background: rgba(255, 255, 255, 0.035);
          border: 1px solid rgba(255, 255, 255, 0.07);
        }

        .tab {
          min-height: 40px;
          border: none;
          border-radius: 14px;
          padding: 0 15px;
          cursor: pointer;
          color: rgba(255, 255, 255, 0.58);
          background: transparent;
          font-weight: 850;
          transition: 220ms cubic-bezier(0.22, 1, 0.36, 1);
        }

        .tab:hover,
        .tab.active {
          color: white;
          background: rgba(101, 116, 255, 0.22);
          box-shadow: 0 14px 32px rgba(85, 100, 255, 0.14);
        }

        .categoryRow {
          display: flex;
          flex-wrap: wrap;
          gap: 10px;
          margin-bottom: 16px;
          animation: riseIn 560ms ease both;
        }

        .categoryChip {
          min-height: 34px;
          padding: 0 13px;
          border-radius: 999px;
          border: 1px solid rgba(255, 255, 255, 0.075);
          background: rgba(255, 255, 255, 0.035);
          color: rgba(255, 255, 255, 0.58);
          cursor: pointer;
          font-weight: 750;
          transition: 200ms ease;
        }

        .categoryChip:hover,
        .categoryChip.active {
          color: white;
          border-color: rgba(145, 155, 255, 0.25);
          background: rgba(101, 116, 255, 0.16);
        }

        .featureStrip {
          display: grid;
          grid-template-columns: minmax(0, 1fr) 250px;
          gap: 14px;
          margin-bottom: 20px;
          animation: riseIn 640ms ease both;
        }

        .featureCard {
          position: relative;
          overflow: hidden;
          min-height: 108px;
          border-radius: 24px;
          background:
            linear-gradient(135deg, rgba(255, 255, 255, 0.065), rgba(255, 255, 255, 0.024)),
            rgba(255, 255, 255, 0.035);
          border: 1px solid rgba(255, 255, 255, 0.078);
          box-shadow: 0 18px 54px rgba(0, 0, 0, 0.24);
        }

        .featureGlow {
          position: absolute;
          inset: -60%;
          background:
            radial-gradient(circle at 18% 38%, rgba(103, 119, 255, 0.34), transparent 28%),
            radial-gradient(circle at 85% 50%, rgba(184, 106, 255, 0.26), transparent 30%);
          filter: blur(8px);
          opacity: 0.75;
        }

        .featureContent {
          position: relative;
          z-index: 1;
          padding: 20px 22px;
        }

        .featureLabel {
          font-size: 11px;
          letter-spacing: 0.14em;
          text-transform: uppercase;
          color: rgba(255, 255, 255, 0.46);
          margin-bottom: 7px;
        }

        .featureContent h2 {
          margin: 0;
          max-width: 720px;
          font-size: clamp(1.55rem, 2.3vw, 2.35rem);
          line-height: 0.98;
          letter-spacing: -0.055em;
        }

        .featureContent p {
          margin: 8px 0 0;
          max-width: 610px;
          color: rgba(255, 255, 255, 0.62);
          line-height: 1.5;
          font-size: 14px;
        }

        .quickStoryCard {
          min-height: 108px;
          border-radius: 24px;
          border: 1px solid rgba(255, 255, 255, 0.08);
          background:
            radial-gradient(circle at 80% 0%, rgba(116, 132, 255, 0.22), transparent 38%),
            rgba(255, 255, 255, 0.035);
          color: white;
          cursor: pointer;
          padding: 18px;
          text-align: left;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          transition: 240ms cubic-bezier(0.22, 1, 0.36, 1);
        }

        .quickStoryCard:hover {
          transform: translateY(-4px);
          border-color: rgba(145, 155, 255, 0.24);
          box-shadow: 0 24px 70px rgba(80, 100, 255, 0.13);
        }

        .quickStoryCard span {
          color: rgba(255, 255, 255, 0.48);
          font-size: 12px;
        }

        .quickStoryCard strong {
          font-size: 18px;
          line-height: 1.1;
          letter-spacing: -0.04em;
        }

        .gridHeader {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin: 0 0 14px;
          animation: riseIn 700ms ease both;
        }

        .gridTitle {
          font-size: 21px;
          font-weight: 900;
          letter-spacing: -0.04em;
        }

        .gridSub {
          margin-top: 4px;
          color: rgba(255, 255, 255, 0.42);
          font-size: 13px;
        }

        .characterGrid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(235px, 1fr));
          gap: 18px;
          animation: riseIn 760ms ease both;
        }

        .characterTile {
          position: relative;
          min-height: 390px;
          border-radius: 30px;
          overflow: hidden;
          border: 1px solid rgba(255, 255, 255, 0.085);
          background:
            linear-gradient(180deg, rgba(255, 255, 255, 0.06), rgba(255, 255, 255, 0.025));
          box-shadow: 0 22px 70px rgba(0, 0, 0, 0.26);
          cursor: pointer;
          transition:
            transform 260ms cubic-bezier(0.22, 1, 0.36, 1),
            border-color 260ms cubic-bezier(0.22, 1, 0.36, 1),
            box-shadow 260ms cubic-bezier(0.22, 1, 0.36, 1);
        }

        .characterTile:hover {
          transform: translateY(-7px);
          border-color: rgba(160, 170, 255, 0.24);
          box-shadow:
            0 30px 90px rgba(0, 0, 0, 0.34),
            0 22px 70px rgba(85, 100, 255, 0.13);
        }

        .portrait {
          position: relative;
          height: 218px;
          display: grid;
          place-items: center;
          overflow: hidden;
          background:
            radial-gradient(circle at 50% 30%, var(--accent-strong), transparent 34%),
            radial-gradient(circle at 20% 80%, var(--accent-soft), transparent 34%),
            linear-gradient(145deg, rgba(255,255,255,0.08), rgba(255,255,255,0.02));
        }

        .portrait::after {
          content: "";
          position: absolute;
          inset: 0;
          background:
            linear-gradient(180deg, transparent 35%, rgba(5, 7, 13, 0.72) 100%),
            radial-gradient(circle at center, transparent 24%, rgba(0,0,0,0.18) 100%);
          pointer-events: none;
        }

        .portraitImage {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .portraitSymbol {
          position: relative;
          z-index: 1;
          width: 104px;
          height: 104px;
          display: grid;
          place-items: center;
          border-radius: 34px;
          font-size: 48px;
          font-weight: 900;
          background: rgba(255, 255, 255, 0.08);
          border: 1px solid rgba(255, 255, 255, 0.12);
          box-shadow: inset 0 1px 0 rgba(255,255,255,0.08);
          transform: rotate(-4deg);
          transition: transform 260ms cubic-bezier(0.22, 1, 0.36, 1);
        }

        .characterTile:hover .portraitSymbol {
          transform: rotate(0deg) scale(1.05);
        }

        .tileContent {
          padding: 16px 16px 72px;
        }

        .tileMeta {
          display: flex;
          justify-content: space-between;
          gap: 10px;
          align-items: center;
          margin-bottom: 10px;
        }

        .genreBadge {
          max-width: 138px;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
          font-size: 11px;
          color: rgba(255,255,255,0.66);
          padding: 7px 9px;
          border-radius: 999px;
          background: rgba(255,255,255,0.06);
          border: 1px solid rgba(255,255,255,0.07);
        }

        .creator {
          color: rgba(255,255,255,0.38);
          font-size: 11px;
          white-space: nowrap;
          max-width: 82px;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .characterTile h3 {
          margin: 0 0 5px;
          font-size: 23px;
          letter-spacing: -0.045em;
        }

        .role {
          color: rgba(255,255,255,0.52);
          font-size: 13px;
          margin-bottom: 10px;
        }

        .tagline {
          color: rgba(255,255,255,0.72);
          line-height: 1.48;
          font-size: 14px;
          min-height: 42px;
        }

        .tagRow {
          display: flex;
          flex-wrap: wrap;
          gap: 7px;
          margin-top: 14px;
        }

        .tag {
          font-size: 11px;
          color: rgba(255,255,255,0.58);
          padding: 6px 8px;
          border-radius: 999px;
          background: rgba(255,255,255,0.045);
          border: 1px solid rgba(255,255,255,0.055);
        }

        .tileAction {
          position: absolute;
          left: 16px;
          right: 16px;
          bottom: 16px;
          min-height: 46px;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 0 14px;
          border-radius: 15px;
          border: 1px solid rgba(255,255,255,0.10);
          background:
            linear-gradient(135deg, rgba(101,116,255,0.48), rgba(155,124,255,0.28));
          color: white;
          font-size: 14px;
          line-height: 1;
          white-space: nowrap;
          font-weight: 900;
          opacity: 0;
          transform: translateY(10px);
          transition: 240ms cubic-bezier(0.22, 1, 0.36, 1);
          cursor: pointer;
          z-index: 5;
        }

        .characterTile:hover .tileAction {
          opacity: 1;
          transform: translateY(0);
        }

        .emptyState {
          min-height: 420px;
          border-radius: 34px;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-direction: column;
          text-align: center;
          padding: 30px;
          border: 1px solid rgba(255,255,255,0.085);
          background: rgba(255,255,255,0.035);
        }

        .emptyOrb {
          width: 78px;
          height: 78px;
          display: grid;
          place-items: center;
          border-radius: 28px;
          font-size: 34px;
          margin-bottom: 14px;
          background: rgba(255,255,255,0.06);
          border: 1px solid rgba(255,255,255,0.09);
        }

        .emptyState h2 {
          margin: 0 0 8px;
          font-size: 28px;
          letter-spacing: -0.04em;
        }

        .emptyState p {
          margin: 0 0 18px;
          color: rgba(255,255,255,0.58);
        }

        @keyframes riseIn {
          from {
            opacity: 0;
            transform: translateY(14px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @media (max-width: 1050px) {
          .featureStrip {
            grid-template-columns: 1fr;
          }

          .controlDeck {
            grid-template-columns: 1fr;
          }

          .tabs {
            width: fit-content;
          }
        }

        @media (max-width: 900px) {
          .discoverPage {
            flex-direction: column;
          }

          .discoverMain {
            padding: 22px;
          }

          .discoverTop {
            flex-direction: column;
          }

          .createButton {
            width: 100%;
          }

          .characterGrid {
            grid-template-columns: repeat(auto-fill, minmax(210px, 1fr));
          }
        }

        @media (max-width: 560px) {
          .characterGrid {
            grid-template-columns: 1fr;
          }

          .portrait {
            height: 210px;
          }
        }
      `}</style>
    </>
  );
}

function CharacterTile({ character, onStart }) {
  const accent = getAccent(character.accent);

  return (
    <article
      className="characterTile"
      style={{
        "--accent-strong": accent.strong,
        "--accent-soft": accent.soft
      }}
      onClick={onStart}
    >
      <div className="portrait">
        {character.coverImage ? (
          <img
            className="portraitImage"
            src={character.coverImage}
            alt={character.name || "Character"}
          />
        ) : (
          <div className="portraitSymbol">{character.symbol || "✦"}</div>
        )}
      </div>

      <div className="tileContent">
        <div className="tileMeta">
          <span className="genreBadge">{character.genre || "Story"}</span>
          <span className="creator">{character.creator || "Ombu"}</span>
        </div>

        <h3>{character.name}</h3>
        <div className="role">{character.role}</div>
        <div className="tagline">{character.tagline}</div>

        <div className="tagRow">
          {(character.tags || []).slice(0, 3).map((tag) => (
            <span className="tag" key={tag}>
              {tag}
            </span>
          ))}
        </div>
      </div>

      <button
        className="tileAction"
        onClick={(event) => {
          event.stopPropagation();
          onStart();
        }}
      >
        Enter Character
      </button>
    </article>
  );
}

function normalizeTags(tags) {
  if (Array.isArray(tags)) return tags;

  if (typeof tags === "string") {
    return tags
      .split(",")
      .map((tag) => tag.trim())
      .filter(Boolean);
  }

  return [];
}

function pickAccent(index) {
  const accents = ["blue", "violet", "amber", "pink", "green", "red"];
  return accents[index % accents.length];
}

function getAccent(accent) {
  const accents = {
    blue: {
      strong: "rgba(92, 118, 255, 0.42)",
      soft: "rgba(80, 120, 255, 0.20)"
    },
    violet: {
      strong: "rgba(153, 102, 255, 0.42)",
      soft: "rgba(142, 92, 255, 0.20)"
    },
    amber: {
      strong: "rgba(255, 175, 74, 0.36)",
      soft: "rgba(255, 190, 84, 0.16)"
    },
    pink: {
      strong: "rgba(255, 96, 178, 0.34)",
      soft: "rgba(255, 96, 178, 0.16)"
    },
    green: {
      strong: "rgba(90, 220, 170, 0.32)",
      soft: "rgba(80, 210, 165, 0.15)"
    },
    red: {
      strong: "rgba(255, 86, 105, 0.34)",
      soft: "rgba(255, 86, 105, 0.15)"
    }
  };

  return accents[accent] || accents.blue;
}
