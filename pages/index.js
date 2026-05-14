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
    motivation: "Protect her empire and punish anyone who mistakes kindness for weakness.",
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
    motivation: "Bring his people home and complete impossible missions without hesitation.",
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
    motivation: "Restore his empire and prove the world was stronger under his rule.",
    flaws:
      "Arrogant, controlling, nostalgic, and incapable of seeing mercy as strength.",
    voice: "Grand, calm, ancient, authoritative, and quietly menacing.",
    firstMessage:
      "*Veyr sits upon the cracked throne, one hand resting lazily against his crown.*\n\nKneel if you wish. Speak if you dare."
  }
];

const shelves = [
  "Featured",
  "Trending",
  "Recent",
  "Popular",
  "Anime",
  "Fantasy",
  "Drama",
  "My Characters"
];

export default function DiscoverPage() {
  const router = useRouter();
  const [activeShelf, setActiveShelf] = useState("Featured");
  const [search, setSearch] = useState("");
  const [savedCharacters, setSavedCharacters] = useState([]);
  const [loaded, setLoaded] = useState(false);
  const [isLeaving, setIsLeaving] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;

    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      const parsed = raw ? JSON.parse(raw) : [];
      setSavedCharacters(Array.isArray(parsed) ? parsed : []);
    } catch (error) {
      console.error("Failed to load saved characters:", error);
      setSavedCharacters([]);
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
        genre: character.genre || "Original",
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

  const publicSavedCharacters = useMemo(() => {
    return normalizedSavedCharacters.filter(
      (character) => character.visibility === "Public"
    );
  }, [normalizedSavedCharacters]);

  const allPublicCharacters = useMemo(() => {
    return [...publicSavedCharacters, ...publicCharacters];
  }, [publicSavedCharacters]);

  const allCharacters = useMemo(() => {
    if (activeShelf === "My Characters") return normalizedSavedCharacters;
    return allPublicCharacters;
  }, [activeShelf, allPublicCharacters, normalizedSavedCharacters]);

  const visibleCharacters = useMemo(() => {
    const cleanedSearch = search.trim().toLowerCase();

    return allCharacters.filter((character) => {
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

      const matchesSearch = !cleanedSearch || searchable.includes(cleanedSearch);

      const shelf = activeShelf.toLowerCase();
      const matchesShelf =
        activeShelf === "Featured" ||
        activeShelf === "Trending" ||
        activeShelf === "Recent" ||
        activeShelf === "Popular" ||
        activeShelf === "My Characters" ||
        searchable.includes(shelf);

      return matchesSearch && matchesShelf;
    });
  }, [allCharacters, activeShelf, search]);

  const spotlight = allPublicCharacters[0] || publicCharacters[0];

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
    }, 120);
  }

  function goCreateCharacter() {
    router.push("/characters");
  }

  function clearSearch() {
    setSearch("");
    setActiveShelf("Featured");
  }

  const emptyPrivateVault =
    activeShelf === "My Characters" &&
    loaded &&
    normalizedSavedCharacters.length === 0;

  return (
    <>
      <Head>
        <title>Discover | OMBU</title>
        <meta
          name="description"
          content="Discover AI characters, build story worlds, and start immersive roleplay scenes with Ombu."
        />
      </Head>

      <div className={`ombuDiscover ${isLeaving ? "isLeaving" : ""}`}>
        <OmbuSidebar
          actionSlot={
            <button className="railCreateButton" onClick={goCreateCharacter}>
              + Create
            </button>
          }
        />

        <main className="discoverShell">
          <header className="topBar">
            <div className="brandBlock">
              <div className="brandMark">O</div>
              <div>
                <div className="brandTitle">Ombu</div>
                <div className="brandSub">
                  Character worlds, chats, and story engines.
                </div>
              </div>
            </div>

            <div className="searchWrap">
              <span>⌕</span>
              <input
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Search characters, genres, tags, creators..."
              />

              {search ? (
                <button className="clearButton" onClick={() => setSearch("")}>
                  Clear
                </button>
              ) : null}
            </div>

            <button className="createButton" onClick={goCreateCharacter}>
              Create Character
            </button>
          </header>

          <nav className="shelfTabs" aria-label="Character shelves">
            {shelves.map((shelf) => (
              <button
                key={shelf}
                className={`shelfTab ${activeShelf === shelf ? "active" : ""}`}
                onClick={() => setActiveShelf(shelf)}
              >
                {shelf}
              </button>
            ))}
          </nav>

          <section className="quickStartGrid">
            <button
              className="spotlightCard"
              onClick={() => enterCharacter(spotlight)}
            >
              <div
                className="spotlightArt"
                style={{ "--accent": getAccent(spotlight.accent).solid }}
              >
                {spotlight.coverImage ? (
                  <img src={spotlight.coverImage} alt={spotlight.name} />
                ) : (
                  <span>{spotlight.symbol || "✦"}</span>
                )}
              </div>

              <div className="spotlightCopy">
                <div className="miniLabel">Start fast</div>
                <h1>{spotlight.name}</h1>
                <p>{spotlight.tagline}</p>

                <div className="spotlightMeta">
                  <span>{spotlight.genre}</span>
                  <span>Enter chat →</span>
                </div>
              </div>
            </button>

            <div className="miniStack">
              <InfoTile
                label="World Engine"
                title="Build universes next."
                text="Characters are the hook. Worlds become the reason people stay."
                onClick={() => router.push("/universes")}
              />

              <InfoTile
                label="Story Engine"
                title="Generate scenes."
                text="Jump from chat to story mode when a conversation needs a full episode."
                onClick={() => router.push("/story")}
              />
            </div>
          </section>

          <section className="sectionHeader">
            <div>
              <h2>
                {activeShelf === "My Characters"
                  ? "My Characters"
                  : `${activeShelf} Characters`}
              </h2>
              <p>
                {activeShelf === "My Characters"
                  ? "Your private and public creations live here."
                  : "Pick a character and start the scene immediately."}
              </p>
            </div>

            <div className="resultCount">{visibleCharacters.length} shown</div>
          </section>

          {emptyPrivateVault ? (
            <EmptyState
              title="Your character shelf is empty."
              text="Create your first character and they’ll show up here automatically."
              action="Create Character"
              onAction={goCreateCharacter}
            />
          ) : visibleCharacters.length === 0 ? (
            <EmptyState
              title="No characters found."
              text="Try another search or jump back to the featured shelf."
              action="Reset"
              onAction={clearSearch}
            />
          ) : (
            <section className="characterGrid">
              {visibleCharacters.map((character, index) => (
                <CharacterCard
                  key={character.id}
                  character={character}
                  index={index}
                  onEnter={() => enterCharacter(character)}
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
          background: #080807;
        }

        button,
        input {
          font: inherit;
        }

        button {
          -webkit-tap-highlight-color: transparent;
        }

        .ombuDiscover {
          min-height: 100vh;
          display: flex;
          color: #f4efe4;
          background:
            radial-gradient(
              circle at 18% 8%,
              rgba(211, 151, 82, 0.11),
              transparent 24%
            ),
            radial-gradient(
              circle at 88% 0%,
              rgba(93, 74, 255, 0.1),
              transparent 26%
            ),
            linear-gradient(180deg, #0b0b09 0%, #070707 100%);
          font-family:
            Inter,
            ui-sans-serif,
            system-ui,
            -apple-system,
            BlinkMacSystemFont,
            "Segoe UI",
            sans-serif;
          transition:
            opacity 150ms ease,
            transform 150ms ease,
            filter 150ms ease;
        }

        .ombuDiscover.isLeaving {
          opacity: 0;
          transform: translateY(-6px);
          filter: blur(2px);
        }

        .discoverShell {
          width: 100%;
          min-width: 0;
          padding: 20px 26px 44px;
        }

        .railCreateButton {
          width: 100%;
          min-height: 38px;
          border: 1px solid rgba(255, 216, 160, 0.2);
          border-radius: 14px;
          color: #ffe2b2;
          background: rgba(255, 198, 117, 0.09);
          font-size: 13px;
          font-weight: 850;
          cursor: pointer;
        }

        .topBar {
          display: grid;
          grid-template-columns: minmax(230px, 0.8fr) minmax(280px, 1.35fr) auto;
          align-items: center;
          gap: 14px;
          position: sticky;
          top: 0;
          z-index: 20;
          padding: 8px 0 18px;
          background: linear-gradient(
            180deg,
            rgba(8, 8, 7, 0.98) 0%,
            rgba(8, 8, 7, 0.82) 72%,
            transparent 100%
          );
          backdrop-filter: blur(16px);
        }

        .brandBlock {
          min-width: 0;
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .brandMark {
          width: 42px;
          height: 42px;
          display: grid;
          place-items: center;
          border-radius: 14px;
          color: #17110a;
          background: linear-gradient(135deg, #ffe0ae, #b87935);
          font-weight: 950;
          letter-spacing: -0.08em;
          box-shadow: 0 12px 34px rgba(213, 145, 74, 0.18);
        }

        .brandTitle {
          color: #fff5e4;
          font-size: 19px;
          font-weight: 950;
          letter-spacing: -0.04em;
        }

        .brandSub {
          margin-top: 2px;
          max-width: 340px;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
          color: rgba(244, 239, 228, 0.48);
          font-size: 12px;
          font-weight: 650;
        }

        .searchWrap {
          position: relative;
          min-height: 48px;
          display: flex;
          align-items: center;
          border: 1px solid rgba(255, 238, 214, 0.1);
          border-radius: 18px;
          background: rgba(255, 255, 255, 0.045);
          box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.04);
        }

        .searchWrap span {
          position: absolute;
          left: 16px;
          color: rgba(255, 229, 191, 0.48);
          font-size: 20px;
        }

        .searchWrap input {
          width: 100%;
          height: 48px;
          border: 0;
          outline: 0;
          color: #fff7e9;
          background: transparent;
          padding: 0 76px 0 46px;
          font-size: 14px;
        }

        .searchWrap input::placeholder {
          color: rgba(244, 239, 228, 0.34);
        }

        .clearButton {
          position: absolute;
          right: 8px;
          height: 32px;
          border: 0;
          border-radius: 999px;
          color: rgba(255, 241, 219, 0.64);
          background: rgba(255, 255, 255, 0.06);
          padding: 0 10px;
          font-size: 12px;
          font-weight: 800;
          cursor: pointer;
        }

        .createButton {
          height: 48px;
          border: 1px solid rgba(255, 221, 171, 0.26);
          border-radius: 18px;
          color: #17110a;
          background: linear-gradient(135deg, #ffe1b0, #c9853d);
          padding: 0 16px;
          font-size: 14px;
          font-weight: 950;
          white-space: nowrap;
          cursor: pointer;
          box-shadow: 0 14px 40px rgba(201, 133, 61, 0.16);
        }

        .shelfTabs {
          display: flex;
          gap: 8px;
          overflow-x: auto;
          padding: 2px 0 18px;
          scrollbar-width: none;
        }

        .shelfTabs::-webkit-scrollbar {
          display: none;
        }

        .shelfTab {
          flex: 0 0 auto;
          height: 38px;
          border: 1px solid rgba(255, 238, 214, 0.08);
          border-radius: 999px;
          color: rgba(244, 239, 228, 0.58);
          background: rgba(255, 255, 255, 0.035);
          padding: 0 14px;
          font-size: 13px;
          font-weight: 850;
          cursor: pointer;
          transition: 160ms ease;
        }

        .shelfTab:hover {
          color: #fff1da;
          border-color: rgba(255, 238, 214, 0.16);
        }

        .shelfTab.active {
          color: #17110a;
          background: #f1d4a4;
          border-color: rgba(255, 238, 214, 0.24);
        }

        .quickStartGrid {
          display: grid;
          grid-template-columns: minmax(0, 1fr) 330px;
          gap: 14px;
          margin-bottom: 26px;
        }

        .spotlightCard,
        .infoTile {
          text-align: left;
          border: 1px solid rgba(255, 238, 214, 0.1);
          background: rgba(255, 255, 255, 0.045);
          color: inherit;
          cursor: pointer;
          transition:
            transform 180ms ease,
            border-color 180ms ease,
            background 180ms ease;
        }

        .spotlightCard:hover,
        .infoTile:hover {
          transform: translateY(-2px);
          border-color: rgba(255, 221, 171, 0.22);
          background: rgba(255, 255, 255, 0.06);
        }

        .spotlightCard {
          min-height: 210px;
          display: grid;
          grid-template-columns: 190px minmax(0, 1fr);
          gap: 18px;
          align-items: center;
          border-radius: 24px;
          padding: 16px;
          overflow: hidden;
        }

        .spotlightArt {
          position: relative;
          height: 178px;
          display: grid;
          place-items: center;
          overflow: hidden;
          border-radius: 20px;
          background:
            radial-gradient(circle at 50% 26%, var(--accent), transparent 45%),
            linear-gradient(
              135deg,
              rgba(255, 255, 255, 0.09),
              rgba(255, 255, 255, 0.025)
            );
          border: 1px solid rgba(255, 255, 255, 0.08);
        }

        .spotlightArt img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .spotlightArt span {
          font-size: 68px;
          font-weight: 950;
          color: #fff0d5;
        }

        .miniLabel {
          color: rgba(255, 221, 171, 0.7);
          font-size: 11px;
          font-weight: 950;
          letter-spacing: 0.13em;
          text-transform: uppercase;
        }

        .spotlightCopy h1 {
          margin: 8px 0 8px;
          color: #fff7e9;
          font-size: clamp(34px, 4vw, 58px);
          line-height: 0.95;
          letter-spacing: -0.075em;
        }

        .spotlightCopy p {
          max-width: 600px;
          margin: 0;
          color: rgba(244, 239, 228, 0.62);
          font-size: 15px;
          line-height: 1.55;
        }

        .spotlightMeta {
          display: flex;
          flex-wrap: wrap;
          gap: 8px;
          margin-top: 16px;
        }

        .spotlightMeta span {
          border-radius: 999px;
          color: rgba(255, 242, 222, 0.72);
          background: rgba(255, 255, 255, 0.06);
          padding: 7px 10px;
          font-size: 12px;
          font-weight: 850;
        }

        .miniStack {
          display: grid;
          grid-template-rows: 1fr 1fr;
          gap: 14px;
        }

        .infoTile {
          border-radius: 22px;
          padding: 18px;
        }

        .infoTileLabel {
          color: rgba(255, 221, 171, 0.62);
          font-size: 11px;
          font-weight: 950;
          letter-spacing: 0.12em;
          text-transform: uppercase;
        }

        .infoTile h3 {
          margin: 9px 0 7px;
          color: #fff4df;
          font-size: 20px;
          letter-spacing: -0.04em;
        }

        .infoTile p {
          margin: 0;
          color: rgba(244, 239, 228, 0.52);
          font-size: 13px;
          line-height: 1.5;
        }

        .sectionHeader {
          display: flex;
          justify-content: space-between;
          align-items: flex-end;
          gap: 18px;
          margin: 2px 0 14px;
        }

        .sectionHeader h2 {
          margin: 0;
          color: #fff6e7;
          font-size: 28px;
          letter-spacing: -0.055em;
        }

        .sectionHeader p {
          margin: 5px 0 0;
          color: rgba(244, 239, 228, 0.48);
          font-size: 13px;
        }

        .resultCount {
          flex: 0 0 auto;
          border-radius: 999px;
          border: 1px solid rgba(255, 238, 214, 0.09);
          background: rgba(255, 255, 255, 0.035);
          color: rgba(244, 239, 228, 0.58);
          padding: 8px 11px;
          font-size: 12px;
          font-weight: 850;
        }

        .characterGrid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(205px, 1fr));
          gap: 14px;
        }

        .characterCard {
          position: relative;
          overflow: hidden;
          min-height: 318px;
          border: 1px solid rgba(255, 238, 214, 0.09);
          border-radius: 22px;
          background: rgba(255, 255, 255, 0.04);
          color: inherit;
          cursor: pointer;
          text-align: left;
          transition:
            transform 180ms ease,
            border-color 180ms ease,
            background 180ms ease;
        }

        .characterCard:hover {
          transform: translateY(-4px);
          border-color: rgba(255, 221, 171, 0.22);
          background: rgba(255, 255, 255, 0.058);
        }

        .cardPortrait {
          position: relative;
          height: 150px;
          display: grid;
          place-items: center;
          overflow: hidden;
          background:
            radial-gradient(
              circle at 50% 25%,
              var(--cardAccent),
              transparent 44%
            ),
            linear-gradient(
              135deg,
              rgba(255, 255, 255, 0.08),
              rgba(255, 255, 255, 0.02)
            );
          border-bottom: 1px solid rgba(255, 238, 214, 0.07);
        }

        .cardPortrait img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: transform 220ms ease;
        }

        .characterCard:hover .cardPortrait img {
          transform: scale(1.04);
        }

        .symbolAvatar {
          width: 82px;
          height: 82px;
          display: grid;
          place-items: center;
          border-radius: 25px;
          color: #fff2db;
          background: rgba(255, 255, 255, 0.075);
          border: 1px solid rgba(255, 255, 255, 0.1);
          font-size: 38px;
          font-weight: 950;
        }

        .cardNumber {
          position: absolute;
          top: 10px;
          left: 10px;
          border-radius: 999px;
          color: rgba(255, 246, 231, 0.66);
          background: rgba(0, 0, 0, 0.28);
          padding: 5px 8px;
          font-size: 10px;
          font-weight: 950;
          backdrop-filter: blur(10px);
        }

        .cardBody {
          padding: 13px 13px 14px;
        }

        .cardTopline {
          display: flex;
          justify-content: space-between;
          gap: 8px;
          margin-bottom: 8px;
        }

        .genrePill,
        .creatorName {
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
          font-size: 11px;
          font-weight: 800;
        }

        .genrePill {
          max-width: 130px;
          color: #ffe1b0;
          background: rgba(255, 198, 117, 0.09);
          border: 1px solid rgba(255, 198, 117, 0.1);
          border-radius: 999px;
          padding: 5px 8px;
        }

        .creatorName {
          max-width: 70px;
          color: rgba(244, 239, 228, 0.38);
          padding-top: 5px;
        }

        .characterCard h3 {
          margin: 0 0 4px;
          color: #fff6e7;
          font-size: 21px;
          line-height: 1.02;
          letter-spacing: -0.055em;
        }

        .characterRole {
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
          color: rgba(244, 239, 228, 0.48);
          font-size: 12px;
          font-weight: 700;
          margin-bottom: 9px;
        }

        .characterTagline {
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
          min-height: 39px;
          color: rgba(244, 239, 228, 0.64);
          font-size: 13px;
          line-height: 1.48;
        }

        .cardFooter {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 10px;
          margin-top: 13px;
        }

        .tagList {
          min-width: 0;
          display: flex;
          gap: 5px;
          overflow: hidden;
        }

        .tagList span {
          flex: 0 0 auto;
          border-radius: 999px;
          color: rgba(244, 239, 228, 0.5);
          background: rgba(255, 255, 255, 0.045);
          padding: 5px 7px;
          font-size: 10px;
          font-weight: 800;
        }

        .enterButton {
          flex: 0 0 auto;
          width: 34px;
          height: 34px;
          border: 0;
          border-radius: 12px;
          color: #17110a;
          background: #f1d4a4;
          font-size: 16px;
          font-weight: 950;
          cursor: pointer;
        }

        .emptyState {
          min-height: 330px;
          display: grid;
          place-items: center;
          border: 1px solid rgba(255, 238, 214, 0.1);
          border-radius: 24px;
          background: rgba(255, 255, 255, 0.04);
          text-align: center;
          padding: 28px;
        }

        .emptyState h2 {
          margin: 0 0 8px;
          color: #fff6e7;
          font-size: 26px;
          letter-spacing: -0.05em;
        }

        .emptyState p {
          max-width: 420px;
          margin: 0 auto 18px;
          color: rgba(244, 239, 228, 0.54);
          font-size: 14px;
          line-height: 1.55;
        }

        .emptyState button {
          height: 42px;
          border: 1px solid rgba(255, 221, 171, 0.24);
          border-radius: 15px;
          color: #17110a;
          background: #f1d4a4;
          padding: 0 14px;
          font-size: 13px;
          font-weight: 950;
          cursor: pointer;
        }

        @media (max-width: 1120px) {
          .topBar {
            grid-template-columns: 1fr;
          }

          .brandSub {
            max-width: none;
          }

          .createButton {
            width: fit-content;
          }

          .quickStartGrid {
            grid-template-columns: 1fr;
          }

          .miniStack {
            grid-template-columns: 1fr 1fr;
            grid-template-rows: auto;
          }
        }

        @media (max-width: 900px) {
          .ombuDiscover {
            flex-direction: column;
          }

          .discoverShell {
            padding: 16px 16px 36px;
          }

          .topBar {
            position: relative;
            padding-top: 4px;
          }
        }

        @media (max-width: 650px) {
          .spotlightCard {
            grid-template-columns: 1fr;
          }

          .spotlightArt {
            height: 150px;
          }

          .miniStack {
            grid-template-columns: 1fr;
          }

          .sectionHeader {
            align-items: flex-start;
            flex-direction: column;
          }

          .characterGrid {
            grid-template-columns: repeat(auto-fill, minmax(160px, 1fr));
            gap: 10px;
          }

          .characterCard {
            min-height: 306px;
          }

          .cardPortrait {
            height: 132px;
          }
        }
      `}</style>
    </>
  );
}

function CharacterCard({ character, index, onEnter }) {
  const accent = getAccent(character.accent);
  const displayNumber = String(index + 1).padStart(2, "0");

  return (
    <article
      className="characterCard"
      style={{ "--cardAccent": accent.soft }}
      onClick={onEnter}
    >
      <div className="cardPortrait">
        <span className="cardNumber">{displayNumber}</span>

        {character.coverImage ? (
          <img src={character.coverImage} alt={character.name || "Character"} />
        ) : (
          <div className="symbolAvatar">{character.symbol || "✦"}</div>
        )}
      </div>

      <div className="cardBody">
        <div className="cardTopline">
          <span className="genrePill">{character.genre || "Story"}</span>
          <span className="creatorName">{character.creator || "Ombu"}</span>
        </div>

        <h3>{character.name}</h3>
        <div className="characterRole">{character.role}</div>
        <div className="characterTagline">{character.tagline}</div>

        <div className="cardFooter">
          <div className="tagList">
            {(character.tags || []).slice(0, 2).map((tag) => (
              <span key={tag}>{tag}</span>
            ))}
          </div>

          <button
            className="enterButton"
            aria-label={`Enter ${character.name}`}
            onClick={(event) => {
              event.stopPropagation();
              onEnter();
            }}
          >
            →
          </button>
        </div>
      </div>
    </article>
  );
}

function InfoTile({ label, title, text, onClick }) {
  return (
    <button className="infoTile" onClick={onClick}>
      <div className="infoTileLabel">{label}</div>
      <h3>{title}</h3>
      <p>{text}</p>
    </button>
  );
}

function EmptyState({ title, text, action, onAction }) {
  return (
    <section className="emptyState">
      <div>
        <h2>{title}</h2>
        <p>{text}</p>
        <button onClick={onAction}>{action}</button>
      </div>
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
      solid: "rgba(91, 124, 255, 0.38)",
      soft: "rgba(91, 124, 255, 0.23)"
    },
    violet: {
      solid: "rgba(154, 104, 255, 0.38)",
      soft: "rgba(154, 104, 255, 0.23)"
    },
    amber: {
      solid: "rgba(255, 177, 84, 0.36)",
      soft: "rgba(255, 177, 84, 0.22)"
    },
    pink: {
      solid: "rgba(255, 100, 184, 0.34)",
      soft: "rgba(255, 100, 184, 0.2)"
    },
    green: {
      solid: "rgba(92, 220, 168, 0.32)",
      soft: "rgba(92, 220, 168, 0.19)"
    },
    red: {
      solid: "rgba(255, 87, 103, 0.34)",
      soft: "rgba(255, 87, 103, 0.2)"
    }
  };

  return accents[accent] || accents.blue;
}
