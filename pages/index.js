import Head from "next/head";
import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/router";
import OmbuSidebar from "../components/OmbuSidebar";

const STORAGE_KEY = "ombu_saved_characters";
const SELECTED_CHARACTER_KEY = "ombu_selected_character";

function createChatId() {
  return `chat_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
}

const publicCharacters = [
  {
    id: "public-1",
    name: "Kaito Ren",
    role: "Masked Shinobi Operative",
    tagline: "A silent village weapon who speaks only when it matters.",
    creator: "Ombu",
    genre: "Anime Action",
    tags: ["Shinobi", "Stealth", "Loyalty"],
    symbol: "忍",
    accent: "blue",
    coverImage: "",
    personality:
      "Quiet, disciplined, observant, brutally loyal, and emotionally restrained.",
    background:
      "Kaito was raised inside a covert shinobi division where identity was considered a weakness.",
    motivation:
      "Protect the village and complete the mission without letting emotion compromise judgment.",
    flaws: "Emotionally distant, distrustful, and too willing to sacrifice himself.",
    voice:
      "Short, calm, precise, and serious. Speaks like someone trained to reveal nothing.",
    firstMessage:
      "*Kaito stands in the shadow of the doorway, mask tilted slightly toward you.*\n\nYou’re late."
  },
  {
    id: "public-2",
    name: "Mara Vex",
    role: "Mafia Boss",
    tagline: "Elegant, ruthless, and never forgets a debt.",
    creator: "Ombu",
    genre: "Crime Drama",
    tags: ["Power", "Loyalty", "Danger"],
    symbol: "♚",
    accent: "red",
    coverImage: "",
    personality:
      "Confident, composed, dangerous, loyal to her inner circle, and merciless to betrayal.",
    background:
      "Mara inherited a broken crime family and rebuilt it into a disciplined empire through strategy, fear, and favors.",
    motivation:
      "Protect her empire and punish anyone who mistakes kindness for weakness.",
    flaws: "Possessive, suspicious, controlling, and slow to forgive.",
    voice:
      "Smooth, direct, intimate, and threatening without needing to raise her voice.",
    firstMessage:
      "*Mara looks up from behind her desk, one hand resting over a sealed envelope.*\n\nSit. If I wanted you dead, you wouldn’t have made it past the door."
  },
  {
    id: "public-3",
    name: "Elias Parker",
    role: "Street-Level Vigilante",
    tagline: "A broke genius trying to save everyone before saving himself.",
    creator: "Ombu",
    genre: "Superhero Drama",
    tags: ["Hero", "Secrets", "Guilt"],
    symbol: "🕸",
    accent: "blue",
    coverImage: "",
    personality:
      "Funny under pressure, anxious, selfless, clever, and constantly carrying guilt behind jokes.",
    background:
      "Elias balances bills, family expectations, and a secret life protecting the city from threats nobody believes in.",
    motivation: "Do the right thing, even when it costs him everything.",
    flaws:
      "Self-sacrificing, guilt-driven, emotionally avoidant, and bad at asking for help.",
    voice: "Quick, sarcastic, nervous when vulnerable, but sincere when it matters.",
    firstMessage:
      "*Elias drops onto the fire escape beside you, breathing hard but still trying to grin.*\n\nOkay. Tiny problem. Please tell me you also heard the explosion."
  },
  {
    id: "public-4",
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
    motivation: "Reclaim her name and punish the family that erased her.",
    flaws: "Vengeful, manipulative, lonely, and terrified of needing anyone.",
    voice: "Poetic, cutting, refined, and emotionally guarded.",
    firstMessage:
      "*Seraphina tilts her head, ruined light flickering faintly behind her shoulders.*\n\nCareful. Most people regret getting my attention."
  },
  {
    id: "public-5",
    name: "Commander Rook",
    role: "Black-Ops Squad Leader",
    tagline: "He does not give orders twice.",
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
    flaws: "Emotionally repressed, harsh, suspicious, and burdened by command.",
    voice: "Short, commanding, clipped, and direct. Every second matters.",
    firstMessage:
      "*Rook checks the chamber of his sidearm, then looks at you like he already knows you’re trouble.*\n\nYou get one minute. Make it useful."
  },
  {
    id: "public-6",
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
    motivation: "Stay free from the people trying to own her gift.",
    flaws:
      "Distrustful, overworked, emotionally masked, and afraid people love the brand more than her.",
    voice:
      "Playful, warm, celebrity-polished, but vulnerable when the mask slips.",
    firstMessage:
      "*Nova slips out of the backstage door, glitter still caught in her hair.*\n\nPlease tell me you’re not another security guy."
  },
  {
    id: "public-7",
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
    motivation: "Win enough to escape the life that keeps dragging him back.",
    flaws: "Impulsive, prideful, easily provoked, and bad at walking away.",
    voice: "Loud, cocky, street-smart, funny, and emotional when pushed.",
    firstMessage:
      "*Jax spits blood into the dirt, then grins like losing never crossed his mind.*\n\nYou here to talk, or you here to watch me win?"
  },
  {
    id: "public-8",
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
    voice: "Grand, calm, ancient, authoritative, and quietly menacing.",
    firstMessage:
      "*Veyr sits upon the cracked throne, one hand resting lazily against his crown.*\n\nKneel if you wish. Speak if you dare."
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
    return savedCharacters.map((character, index) => {
      const visibility = character.visibility || "Private";

      return {
        id: character.id || `saved-${index}`,
        name: character.name || "Unnamed Character",
        role: character.role || "Original Character",
        tagline:
          character.tagline ||
          character.personality ||
          "A private character from your collection.",
        creator: "You",
        genre: character.genre || "Private",
        visibility,
        tags: normalizeTags(character.tags),
        symbol: character.avatar || character.symbol || "✦",
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
        source: "saved",
        raw: character
      };
    });
  }, [savedCharacters]);

  const localPublicCharacters = useMemo(() => {
    return normalizedSavedCharacters.filter(
      (character) => character.visibility === "Public"
    );
  }, [normalizedSavedCharacters]);

  const allPublicCharacters = useMemo(() => {
    return [...localPublicCharacters, ...publicCharacters];
  }, [localPublicCharacters]);

  const activeCharacters =
    activeTab === "public" ? allPublicCharacters : normalizedSavedCharacters;

  const visibleCharacters = useMemo(() => {
    return activeCharacters.filter((character) => {
      const searchable = [
        character.name,
        character.role,
        character.tagline,
        character.creator,
        character.genre,
        character.visibility,
        ...(character.tags || [])
      ]
        .join(" ")
        .toLowerCase();

      const cleanedSearch = search.trim().toLowerCase();
      const matchesSearch = !cleanedSearch || searchable.includes(cleanedSearch);

      const matchesCategory =
        selectedCategory === "All" ||
        searchable.includes(selectedCategory.toLowerCase());

      return matchesSearch && matchesCategory;
    });
  }, [activeCharacters, search, selectedCategory]);

  const featuredCharacter = allPublicCharacters[0] || publicCharacters[0];

  function enterCharacter(character) {
    const chatId = createChatId();

    if (typeof window !== "undefined") {
      sessionStorage.setItem(
        SELECTED_CHARACTER_KEY,
        JSON.stringify({
          character,
          chatId,
          mode: "new"
        })
      );
    }

    setIsLeaving(true);
    setTimeout(() => {
      router.push("/character-chat");
    }, 160);
  }

  function goCreateCharacter() {
    router.push("/characters");
  }

  function goStoryEngine() {
    router.push("/story");
  }

  function resetFilters() {
    setSearch("");
    setSelectedCategory("All");
  }

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
            <button className="sidebarCreateButton" onClick={goCreateCharacter}>
              Create Character
            </button>
          }
        />

        <main className="discoverMain">
          <section className="heroPanel">
            <div className="heroGlow" />
            <div className="heroCopy">
              <div className="eyebrow">OMBU ARCHIVE / DISCOVER</div>
              <h1>Characters that feel pulled from a real world.</h1>
              <p>
                Browse public personalities, reopen your originals, and build
                conversations that feel more like scenes than prompts.
              </p>

              <div className="heroActions">
                <button className="primaryButton" onClick={goCreateCharacter}>
                  Create Character
                </button>
                <button className="ghostButton" onClick={goStoryEngine}>
                  Open Story Engine
                </button>
              </div>
            </div>

            <button
              className="featuredCase"
              onClick={() => enterCharacter(featuredCharacter)}
            >
              <div className="featuredLabel">Featured Case</div>
              <div className="featuredSymbol">
                {featuredCharacter.symbol || "✦"}
              </div>
              <div className="featuredInfo">
                <strong>{featuredCharacter.name}</strong>
                <span>{featuredCharacter.role}</span>
              </div>
              <em>Enter Character →</em>
            </button>
          </section>

          <section className="commandBar">
            <div className="searchBox">
              <span>⌕</span>
              <input
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Search name, genre, role, creator, tag..."
              />
            </div>

            <div className="tabGroup">
              <button
                className={`tabButton ${activeTab === "public" ? "active" : ""}`}
                onClick={() => setActiveTab("public")}
              >
                Public <span>{allPublicCharacters.length}</span>
              </button>

              <button
                className={`tabButton ${
                  activeTab === "private" ? "active" : ""
                }`}
                onClick={() => setActiveTab("private")}
              >
                My Characters <span>{normalizedSavedCharacters.length}</span>
              </button>
            </div>
          </section>

          <section className="categoryShelf">
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

          <section className="libraryHeader">
            <div>
              <div className="sectionKicker">
                {activeTab === "public" ? "PUBLIC STACK" : "PRIVATE VAULT"}
              </div>
              <h2>
                {activeTab === "public"
                  ? "Characters ready to enter the scene."
                  : "Your saved cast."}
              </h2>
            </div>

            <div className="resultPill">{visibleCharacters.length} shown</div>
          </section>

          {activeTab === "private" &&
          loaded &&
          normalizedSavedCharacters.length === 0 ? (
            <EmptyState
              icon="✦"
              title="Your archive is quiet."
              description="Create a character and they’ll live here when you come back."
              actionLabel="Create Character"
              onAction={goCreateCharacter}
              primary
            />
          ) : visibleCharacters.length === 0 ? (
            <EmptyState
              icon="⌕"
              title="No matches found."
              description="Try another search or clear the category filter."
              actionLabel="Reset Filters"
              onAction={resetFilters}
            />
          ) : (
            <section className="characterGrid">
              {visibleCharacters.map((character, index) => (
                <CharacterTile
                  key={character.id}
                  character={character}
                  index={index}
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

        html,
        body,
        #__next {
          min-height: 100%;
        }

        body {
          margin: 0;
          background: #070704;
        }

        button,
        input {
          font: inherit;
        }

        button {
          -webkit-tap-highlight-color: transparent;
        }

        .discoverPage {
          min-height: 100vh;
          display: flex;
          color: #f7f0df;
          background:
            radial-gradient(circle at 16% 4%, rgba(209, 143, 73, 0.18), transparent 30%),
            radial-gradient(circle at 90% 18%, rgba(113, 79, 255, 0.15), transparent 31%),
            linear-gradient(135deg, rgba(255, 255, 255, 0.035) 0 1px, transparent 1px),
            linear-gradient(180deg, #090905 0%, #050505 55%, #080706 100%);
          background-size: auto, auto, 32px 32px, auto;
          font-family:
            ui-sans-serif,
            system-ui,
            -apple-system,
            BlinkMacSystemFont,
            "Segoe UI",
            sans-serif;
          transition:
            opacity 180ms ease,
            transform 180ms ease,
            filter 180ms ease;
        }

        .discoverPage.leaving {
          opacity: 0;
          transform: translateY(-8px) scale(0.995);
          filter: blur(3px);
        }

        .discoverMain {
          flex: 1;
          min-width: 0;
          padding: 28px 34px 48px;
          overflow-x: hidden;
        }

        .sidebarCreateButton {
          width: 100%;
          min-height: 42px;
          border: 1px solid rgba(231, 179, 108, 0.28);
          border-radius: 16px;
          color: #ffdfaa;
          background: linear-gradient(
            135deg,
            rgba(231, 162, 78, 0.15),
            rgba(112, 80, 255, 0.08)
          );
          font-weight: 850;
          cursor: pointer;
        }

        .heroPanel {
          position: relative;
          min-height: 360px;
          display: grid;
          grid-template-columns: minmax(0, 1fr) 340px;
          gap: 24px;
          align-items: stretch;
          overflow: hidden;
          border-radius: 36px;
          border: 1px solid rgba(255, 236, 197, 0.1);
          background:
            linear-gradient(
              135deg,
              rgba(255, 255, 255, 0.075),
              rgba(255, 255, 255, 0.018)
            ),
            radial-gradient(
              circle at 70% 22%,
              rgba(189, 141, 255, 0.16),
              transparent 34%
            ),
            rgba(13, 12, 9, 0.88);
          box-shadow:
            0 40px 120px rgba(0, 0, 0, 0.4),
            inset 0 1px 0 rgba(255, 255, 255, 0.06);
          padding: 34px;
          animation: riseIn 420ms ease both;
        }

        .heroGlow {
          position: absolute;
          inset: 0;
          pointer-events: none;
          opacity: 0.55;
          background:
            linear-gradient(
              90deg,
              transparent 0 48%,
              rgba(255, 231, 185, 0.06) 49% 50%,
              transparent 51% 100%
            ),
            radial-gradient(
              circle at 20% 30%,
              rgba(255, 206, 128, 0.18),
              transparent 18%
            );
          mask-image: linear-gradient(90deg, #000 0%, transparent 78%);
        }

        .heroCopy {
          position: relative;
          z-index: 1;
          max-width: 760px;
          align-self: center;
        }

        .eyebrow,
        .sectionKicker,
        .featuredLabel {
          font-size: 11px;
          letter-spacing: 0.18em;
          text-transform: uppercase;
          color: rgba(255, 228, 180, 0.54);
          font-weight: 850;
        }

        h1,
        h2,
        h3,
        p {
          margin-top: 0;
        }

        h1 {
          max-width: 830px;
          margin: 14px 0 16px;
          font-family: Georgia, "Times New Roman", serif;
          font-size: clamp(44px, 6vw, 86px);
          line-height: 0.88;
          letter-spacing: -0.075em;
          color: #fff7e8;
          text-wrap: balance;
        }

        .heroCopy p {
          max-width: 650px;
          margin: 0;
          color: rgba(247, 240, 223, 0.66);
          font-size: 16px;
          line-height: 1.75;
        }

        .heroActions {
          display: flex;
          flex-wrap: wrap;
          gap: 12px;
          margin-top: 26px;
        }

        .primaryButton,
        .ghostButton {
          min-height: 46px;
          border-radius: 999px;
          padding: 0 18px;
          font-weight: 900;
          cursor: pointer;
          transition:
            transform 180ms ease,
            border-color 180ms ease,
            background 180ms ease;
        }

        .primaryButton {
          border: 1px solid rgba(255, 220, 163, 0.32);
          color: #15100a;
          background: linear-gradient(135deg, #ffe3af, #d89147);
          box-shadow: 0 16px 44px rgba(214, 143, 65, 0.2);
        }

        .ghostButton {
          border: 1px solid rgba(255, 240, 211, 0.12);
          color: #f8ecd4;
          background: rgba(255, 255, 255, 0.045);
        }

        .primaryButton:hover,
        .ghostButton:hover {
          transform: translateY(-2px);
        }

        .featuredCase {
          position: relative;
          z-index: 1;
          min-height: 292px;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          border: 1px solid rgba(255, 231, 187, 0.13);
          border-radius: 30px;
          background:
            linear-gradient(
              180deg,
              rgba(255, 255, 255, 0.09),
              rgba(255, 255, 255, 0.035)
            ),
            rgba(255, 255, 255, 0.03);
          color: #fff2dc;
          padding: 20px;
          text-align: left;
          cursor: pointer;
          box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.06);
          transition:
            transform 240ms cubic-bezier(0.22, 1, 0.36, 1),
            border-color 240ms ease;
        }

        .featuredCase:hover {
          transform: translateY(-5px);
          border-color: rgba(255, 217, 154, 0.28);
        }

        .featuredSymbol {
          width: 120px;
          height: 120px;
          display: grid;
          place-items: center;
          align-self: center;
          margin: 14px 0;
          border-radius: 38px;
          font-size: 54px;
          font-weight: 950;
          background:
            radial-gradient(
              circle at 50% 30%,
              rgba(255, 219, 150, 0.22),
              transparent 50%
            ),
            rgba(255, 255, 255, 0.055);
          border: 1px solid rgba(255, 255, 255, 0.1);
        }

        .featuredInfo strong,
        .featuredInfo span,
        .featuredCase em {
          display: block;
        }

        .featuredInfo strong {
          font-size: 25px;
          letter-spacing: -0.04em;
        }

        .featuredInfo span {
          margin-top: 5px;
          color: rgba(255, 244, 223, 0.56);
          font-size: 13px;
        }

        .featuredCase em {
          margin-top: 16px;
          color: #ffdaa1;
          font-style: normal;
          font-weight: 900;
          font-size: 13px;
        }

        .commandBar {
          display: grid;
          grid-template-columns: minmax(0, 1fr) auto;
          gap: 14px;
          align-items: center;
          margin: 20px 0 14px;
          animation: riseIn 520ms ease both;
        }

        .searchBox {
          position: relative;
          min-height: 58px;
          border-radius: 22px;
          border: 1px solid rgba(255, 236, 205, 0.1);
          background: rgba(255, 255, 255, 0.045);
          box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.04);
        }

        .searchBox span {
          position: absolute;
          left: 18px;
          top: 50%;
          transform: translateY(-50%);
          color: rgba(255, 226, 179, 0.55);
          font-size: 21px;
        }

        .searchBox input {
          width: 100%;
          height: 58px;
          border: 0;
          outline: 0;
          background: transparent;
          color: #fff5df;
          padding: 0 18px 0 50px;
          font-size: 15px;
        }

        .searchBox input::placeholder {
          color: rgba(255, 240, 211, 0.36);
        }

        .tabGroup {
          display: flex;
          gap: 8px;
          padding: 6px;
          border-radius: 22px;
          border: 1px solid rgba(255, 236, 205, 0.09);
          background: rgba(255, 255, 255, 0.045);
        }

        .tabButton {
          min-height: 44px;
          border: 0;
          border-radius: 16px;
          background: transparent;
          color: rgba(255, 244, 224, 0.58);
          font-size: 13px;
          font-weight: 850;
          padding: 0 14px;
          cursor: pointer;
        }

        .tabButton span {
          margin-left: 6px;
          color: rgba(255, 226, 179, 0.46);
        }

        .tabButton.active {
          color: #1a130a;
          background: linear-gradient(135deg, #ffe2ad, #d9944d);
        }

        .tabButton.active span {
          color: rgba(26, 19, 10, 0.62);
        }

        .categoryShelf {
          display: flex;
          gap: 9px;
          overflow-x: auto;
          padding: 4px 2px 18px;
          scrollbar-width: none;
          animation: riseIn 600ms ease both;
        }

        .categoryShelf::-webkit-scrollbar {
          display: none;
        }

        .categoryChip {
          flex: 0 0 auto;
          min-height: 36px;
          border-radius: 999px;
          border: 1px solid rgba(255, 238, 211, 0.095);
          background: rgba(255, 255, 255, 0.035);
          color: rgba(255, 244, 224, 0.6);
          padding: 0 13px;
          font-size: 12px;
          font-weight: 850;
          cursor: pointer;
        }

        .categoryChip.active {
          color: #ffe0a6;
          border-color: rgba(255, 218, 161, 0.3);
          background: rgba(213, 145, 74, 0.13);
        }

        .libraryHeader {
          display: flex;
          align-items: flex-end;
          justify-content: space-between;
          gap: 18px;
          margin: 12px 0 16px;
          animation: riseIn 680ms ease both;
        }

        .libraryHeader h2 {
          margin: 7px 0 0;
          font-family: Georgia, "Times New Roman", serif;
          font-size: clamp(28px, 3.4vw, 46px);
          line-height: 1;
          letter-spacing: -0.06em;
          color: #fff5df;
        }

        .resultPill {
          border-radius: 999px;
          border: 1px solid rgba(255, 236, 205, 0.1);
          background: rgba(255, 255, 255, 0.04);
          color: rgba(255, 244, 224, 0.62);
          padding: 10px 13px;
          font-size: 12px;
          font-weight: 850;
          white-space: nowrap;
        }

        .characterGrid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(245px, 1fr));
          gap: 16px;
          animation: riseIn 760ms ease both;
        }

        .characterTile {
          position: relative;
          min-height: 392px;
          overflow: hidden;
          border-radius: 28px;
          border: 1px solid rgba(255, 238, 211, 0.1);
          background:
            linear-gradient(
              180deg,
              rgba(255, 255, 255, 0.07),
              rgba(255, 255, 255, 0.026)
            ),
            rgba(12, 11, 8, 0.74);
          box-shadow: 0 22px 80px rgba(0, 0, 0, 0.28);
          cursor: pointer;
          isolation: isolate;
          transition:
            transform 240ms cubic-bezier(0.22, 1, 0.36, 1),
            border-color 240ms ease,
            box-shadow 240ms ease;
        }

        .characterTile::before {
          content: "";
          position: absolute;
          inset: -1px;
          z-index: -1;
          opacity: 0;
          background: radial-gradient(
            circle at 50% 0%,
            var(--accent-strong),
            transparent 45%
          );
          transition: opacity 240ms ease;
        }

        .characterTile:hover {
          transform: translateY(-6px);
          border-color: rgba(255, 222, 169, 0.23);
          box-shadow: 0 32px 100px rgba(0, 0, 0, 0.36);
        }

        .characterTile:hover::before {
          opacity: 1;
        }

        .portrait {
          position: relative;
          height: 206px;
          display: grid;
          place-items: center;
          overflow: hidden;
          background:
            radial-gradient(
              circle at 50% 28%,
              var(--accent-strong),
              transparent 35%
            ),
            radial-gradient(
              circle at 18% 80%,
              var(--accent-soft),
              transparent 35%
            ),
            linear-gradient(
              145deg,
              rgba(255, 255, 255, 0.08),
              rgba(255, 255, 255, 0.02)
            );
        }

        .portrait::after {
          content: "";
          position: absolute;
          inset: 0;
          background:
            linear-gradient(
              180deg,
              transparent 34%,
              rgba(6, 5, 4, 0.82) 100%
            ),
            radial-gradient(circle at center, transparent 20%, rgba(0, 0, 0, 0.21) 100%);
          pointer-events: none;
        }

        .portraitImage {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transform: scale(1.01);
          transition: transform 300ms ease;
        }

        .characterTile:hover .portraitImage {
          transform: scale(1.055);
        }

        .portraitSymbol {
          position: relative;
          z-index: 1;
          width: 106px;
          height: 106px;
          display: grid;
          place-items: center;
          border-radius: 34px;
          color: #fff1d2;
          font-size: 48px;
          font-weight: 950;
          background: rgba(255, 255, 255, 0.075);
          border: 1px solid rgba(255, 255, 255, 0.14);
          box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.08);
          transform: rotate(-5deg);
          transition: transform 240ms cubic-bezier(0.22, 1, 0.36, 1);
        }

        .characterTile:hover .portraitSymbol {
          transform: rotate(0deg) scale(1.04);
        }

        .tileIndex {
          position: absolute;
          top: 14px;
          left: 14px;
          z-index: 2;
          border-radius: 999px;
          border: 1px solid rgba(255, 255, 255, 0.13);
          background: rgba(0, 0, 0, 0.3);
          color: rgba(255, 242, 220, 0.66);
          padding: 7px 9px;
          font-size: 11px;
          font-weight: 900;
          backdrop-filter: blur(12px);
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

        .genreBadge,
        .creator {
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
          font-size: 11px;
        }

        .genreBadge {
          max-width: 145px;
          color: #ffdca3;
          padding: 7px 9px;
          border-radius: 999px;
          background: rgba(218, 147, 75, 0.1);
          border: 1px solid rgba(255, 218, 161, 0.15);
        }

        .creator {
          color: rgba(255, 242, 220, 0.38);
          max-width: 82px;
        }

        .characterTile h3 {
          margin: 0 0 5px;
          font-size: 24px;
          line-height: 1;
          letter-spacing: -0.055em;
          color: #fff4dc;
        }

        .role {
          color: rgba(255, 242, 220, 0.5);
          font-size: 13px;
          margin-bottom: 10px;
        }

        .tagline {
          color: rgba(255, 242, 220, 0.7);
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
          color: rgba(255, 242, 220, 0.56);
          padding: 6px 8px;
          border-radius: 999px;
          background: rgba(255, 255, 255, 0.045);
          border: 1px solid rgba(255, 255, 255, 0.055);
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
          border-radius: 16px;
          border: 1px solid rgba(255, 222, 169, 0.24);
          background: linear-gradient(
            135deg,
            rgba(255, 223, 173, 0.92),
            rgba(210, 139, 68, 0.86)
          );
          color: #15100a;
          font-size: 14px;
          line-height: 1;
          font-weight: 950;
          opacity: 0;
          transform: translateY(10px);
          transition: 220ms cubic-bezier(0.22, 1, 0.36, 1);
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
          padding: 32px;
          border: 1px solid rgba(255, 238, 211, 0.1);
          background:
            radial-gradient(
              circle at 50% 0%,
              rgba(255, 214, 150, 0.1),
              transparent 36%
            ),
            rgba(255, 255, 255, 0.035);
          animation: riseIn 760ms ease both;
        }

        .emptyIcon {
          width: 78px;
          height: 78px;
          display: grid;
          place-items: center;
          border-radius: 28px;
          font-size: 34px;
          margin-bottom: 14px;
          color: #ffdda4;
          background: rgba(255, 255, 255, 0.06);
          border: 1px solid rgba(255, 255, 255, 0.09);
        }

        .emptyState h2 {
          margin: 0 0 8px;
          font-family: Georgia, "Times New Roman", serif;
          font-size: 34px;
          letter-spacing: -0.06em;
        }

        .emptyState p {
          margin: 0 0 18px;
          color: rgba(255, 242, 220, 0.58);
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

        @media (max-width: 1120px) {
          .heroPanel {
            grid-template-columns: 1fr;
          }

          .featuredCase {
            min-height: 240px;
          }

          .commandBar {
            grid-template-columns: 1fr;
          }

          .tabGroup {
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

          .heroPanel {
            padding: 24px;
            border-radius: 30px;
          }

          .libraryHeader {
            align-items: flex-start;
            flex-direction: column;
          }
        }

        @media (max-width: 560px) {
          .discoverMain {
            padding: 16px;
          }

          .heroActions,
          .tabGroup {
            width: 100%;
          }

          .primaryButton,
          .ghostButton,
          .tabButton {
            flex: 1;
          }

          .characterGrid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </>
  );
}

function CharacterTile({ character, index, onStart }) {
  const accent = getAccent(character.accent);
  const displayNumber = String(index + 1).padStart(2, "0");

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
        <span className="tileIndex">{displayNumber}</span>

        {character.coverImage ? (
          <img
            className="portraitImage"
            src={character.coverImage}
            alt={character.name || "Character"}
          />
        ) : (
          <div className="portraitSymbol">{character.symbol || "✦"</div>
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

function EmptyState({
  icon,
  title,
  description,
  actionLabel,
  onAction,
  primary = false
}) {
  return (
    <section className="emptyState">
      <div className="emptyIcon">{icon}</div>
      <h2>{title}</h2>
      <p>{description}</p>
      <button
        className={primary ? "primaryButton" : "ghostButton"}
        onClick={onAction}
      >
        {actionLabel}
      </button>
    </section>
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
      strong: "rgba(92, 118, 255, 0.38)",
      soft: "rgba(80, 120, 255, 0.18)"
    },
    violet: {
      strong: "rgba(153, 102, 255, 0.38)",
      soft: "rgba(142, 92, 255, 0.18)"
    },
    amber: {
      strong: "rgba(255, 175, 74, 0.34)",
      soft: "rgba(255, 190, 84, 0.15)"
    },
    pink: {
      strong: "rgba(255, 96, 178, 0.32)",
      soft: "rgba(255, 96, 178, 0.14)"
    },
    green: {
      strong: "rgba(90, 220, 170, 0.3)",
      soft: "rgba(80, 210, 165, 0.14)"
    },
    red: {
      strong: "rgba(255, 86, 105, 0.32)",
      soft: "rgba(255, 86, 105, 0.14)"
    }
  };

  return accents[accent] || accents.blue;
}
