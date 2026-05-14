import Head from "next/head";
import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/router";

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
    tags: ["Original", "Shinobi", "Action"],
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
    tags: ["Original", "Crime", "Drama"],
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
    tags: ["Original", "Hero", "Drama"],
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
    tags: ["Original", "Fantasy", "Royalty"],
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
    tags: ["Original", "Sci-Fi", "War"],
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
    tags: ["Original", "Fame", "Fantasy"],
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
    tags: ["Original", "Fighter", "Action"],
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
    tags: ["Original", "Villain", "Empire"],
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

const filters = ["Featured", "Recent", "Trending", "Popular", "Original", "Tags"];

const worldScenarios = [
  {
    id: "world-1",
    title: "The Neon Empire",
    description:
      "A cyberpunk city-state ruled by corporate families, black-market gods, and broken heroes.",
    tag: "Sci-Fi",
    accent: "blue"
  },
  {
    id: "world-2",
    title: "Crownfall Academy",
    description:
      "A royal magic school where every friendship is political and every duel has consequences.",
    tag: "Fantasy",
    accent: "violet"
  },
  {
    id: "world-3",
    title: "Ashline District",
    description:
      "A crime-heavy city district where gangs, detectives, and vigilantes collide every night.",
    tag: "Crime",
    accent: "red"
  },
  {
    id: "world-4",
    title: "The Last Safe Route",
    description:
      "A trade road between hostile nations where one bad decision can start a war.",
    tag: "Adventure",
    accent: "amber"
  }
];

export default function DiscoverPage() {
  const router = useRouter();

  const [savedCharacters, setSavedCharacters] = useState([]);
  const [loaded, setLoaded] = useState(false);
  const [activeMode, setActiveMode] = useState("Characters");
  const [activeFilter, setActiveFilter] = useState("Featured");
  const [search, setSearch] = useState("");
  const [animated, setAnimated] = useState(true);
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
          "A character from your personal Ombu archive.",
        creator: "You",
        genre: character.genre || "Original",
        visibility,
        tags: normalizeTags(character.tags).length
          ? normalizeTags(character.tags)
          : ["Original"],
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

  const allCharacters = useMemo(() => {
    return [...publicSavedCharacters, ...publicCharacters];
  }, [publicSavedCharacters]);

  const filteredCharacters = useMemo(() => {
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

      const filter = activeFilter.toLowerCase();
      const matchesFilter =
        activeFilter === "Featured" ||
        activeFilter === "Recent" ||
        activeFilter === "Trending" ||
        activeFilter === "Popular" ||
        activeFilter === "Tags" ||
        searchable.includes(filter);

      return matchesSearch && matchesFilter;
    });
  }, [activeFilter, allCharacters, search]);

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

  function goHome() {
    router.push("/");
  }

  function goStory() {
    router.push("/story");
  }

  function goUniverses() {
    router.push("/universes");
  }

  const showEmptyCharacters =
    activeMode === "Characters" &&
    loaded &&
    filteredCharacters.length === 0;

  return (
    <>
      <Head>
        <title>Ombu | Discover Characters</title>
        <meta
          name="description"
          content="Browse characters, create worlds, and start immersive story chats on Ombu."
        />
      </Head>

      <div className={`ombuHome ${isLeaving ? "leaving" : ""}`}>
        <aside className="sideRail">
          <button className="menuButton" aria-label="Menu">
            ☰
          </button>

          <button className="railBrand" onClick={goHome} aria-label="Ombu home">
            <span>o</span>
          </button>

          <nav className="railNav" aria-label="Primary navigation">
            <RailButton active icon="⌂" label="Home" onClick={goHome} />
            <RailButton icon="◌" label="Activity" onClick={goStory} />
            <RailButton icon="＋" label="Create" onClick={goCreateCharacter} />
            <RailButton icon="▣" label="Worlds" onClick={goUniverses} />
            <RailButton icon="◇" label="Stories" onClick={goStory} />
            <RailButton icon="?" label="Guide" onClick={goStory} />
          </nav>
        </aside>

        <main className="page">
          <header className="topHeader">
            <div className="wordmark" onClick={goHome}>
              <span className="wordmarkIcon">◒</span>
              <span>OMBU</span>
            </div>

            <div className="topSearch">
              <input
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Enter your search"
              />
              <span>⌕</span>
            </div>

            <div className="topActions">
              <button className="textButton">Sign in</button>
              <button className="iconButton" aria-label="Community">
                ☁
              </button>
              <button className="iconButton" aria-label="Notifications">
                ●
              </button>
            </div>
          </header>

          <section className="banner">
            <div>
              <h1>📍 Ombu User Guide 📍</h1>
              <p>
                Chat with characters, create your own cast, and build worlds
                they can actually live inside.
              </p>
            </div>

            <span>1 / 1</span>
          </section>

          <section className="browseHeader">
            <div className="modeTabs">
              <button
                className={activeMode === "Characters" ? "active" : ""}
                onClick={() => setActiveMode("Characters")}
              >
                Characters
              </button>

              <button
                className={activeMode === "World Scenario" ? "active" : ""}
                onClick={() => setActiveMode("World Scenario")}
              >
                World Scenario
              </button>
            </div>

            <div className="toggleRow">
              <label className="toggle">
                <input
                  type="checkbox"
                  checked={animated}
                  onChange={(event) => setAnimated(event.target.checked)}
                />
                <span />
              </label>
              <strong>Animated</strong>
            </div>
          </section>

          <section className="filterRow">
            {filters.map((filter) => (
              <button
                key={filter}
                className={activeFilter === filter ? "active" : ""}
                onClick={() => setActiveFilter(filter)}
              >
                {filter}
                {filter === "Tags" ? <span>›</span> : null}
              </button>
            ))}

            <button className="createInline" onClick={goCreateCharacter}>
              Create Character
            </button>
          </section>

          {activeMode === "Characters" ? (
            <>
              <SectionTitle
                title="Those Who Walked Out of the Darkness"
                subtitle="Featured characters ready for a scene."
              />

              {showEmptyCharacters ? (
                <EmptyState
                  title="No characters found."
                  text="Try another search or create your first Ombu character."
                  action="Create Character"
                  onAction={goCreateCharacter}
                />
              ) : (
                <HorizontalCharacters
                  characters={filteredCharacters.slice(0, 7)}
                  animated={animated}
                  onEnter={enterCharacter}
                />
              )}

              <SectionTitle
                title="Curated Characters"
                subtitle="Original casts, public creations, and quick-start personalities."
              />

              <CharacterGrid
                characters={filteredCharacters}
                animated={animated}
                onEnter={enterCharacter}
              />
            </>
          ) : (
            <>
              <SectionTitle
                title="World Scenarios"
                subtitle="Create a setting, then drop characters into it."
              />

              <WorldGrid worlds={worldScenarios} onOpen={goUniverses} />
            </>
          )}
        </main>

        <button className="helpBubble" aria-label="Help">
          ☁
        </button>
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
          background: #181a1a;
          color: #f4f4f4;
          font-family:
            ui-sans-serif,
            system-ui,
            -apple-system,
            BlinkMacSystemFont,
            "Segoe UI",
            sans-serif;
        }

        button,
        input {
          font: inherit;
        }

        button {
          cursor: pointer;
          -webkit-tap-highlight-color: transparent;
        }

        .ombuHome {
          min-height: 100vh;
          display: flex;
          background: #1b1d1d;
          color: #f5f5f5;
          transition:
            opacity 140ms ease,
            transform 140ms ease,
            filter 140ms ease;
        }

        .ombuHome.leaving {
          opacity: 0;
          transform: translateY(-4px);
          filter: blur(2px);
        }

        .sideRail {
          position: sticky;
          top: 0;
          height: 100vh;
          width: 78px;
          flex: 0 0 78px;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 10px;
          padding: 13px 9px;
          background: #171919;
          border-right: 1px solid rgba(255, 255, 255, 0.06);
        }

        .menuButton {
          width: 42px;
          height: 34px;
          border: 0;
          color: #f4f4f4;
          background: transparent;
          font-size: 24px;
          line-height: 1;
        }

        .railBrand {
          width: 42px;
          height: 42px;
          display: grid;
          place-items: center;
          border: 0;
          border-radius: 14px;
          background: transparent;
        }

        .railBrand span {
          width: 27px;
          height: 27px;
          display: grid;
          place-items: center;
          border-radius: 999px;
          color: #111;
          background: linear-gradient(135deg, #ffe7ad, #ffc14e);
          font-size: 18px;
          font-weight: 950;
          line-height: 1;
        }

        .railNav {
          width: 100%;
          display: flex;
          flex-direction: column;
          gap: 8px;
          margin-top: 2px;
        }

        .railItem {
          width: 100%;
          min-height: 55px;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 3px;
          border: 0;
          border-radius: 11px;
          color: #8e98a8;
          background: transparent;
        }

        .railItem.active {
          color: #ffffff;
          background: rgba(255, 255, 255, 0.08);
        }

        .railIcon {
          font-size: 22px;
          line-height: 1;
        }

        .railLabel {
          font-size: 11px;
          font-weight: 750;
        }

        .page {
          min-width: 0;
          flex: 1;
          padding: 0 24px 52px;
          overflow-x: hidden;
        }

        .topHeader {
          position: sticky;
          top: 0;
          z-index: 20;
          height: 52px;
          display: grid;
          grid-template-columns: auto minmax(280px, 520px) auto;
          align-items: center;
          gap: 18px;
          background: rgba(27, 29, 29, 0.92);
          backdrop-filter: blur(14px);
          border-bottom: 1px solid rgba(255, 255, 255, 0.04);
        }

        .wordmark {
          display: flex;
          align-items: center;
          gap: 8px;
          color: #f8f8f8;
          font-size: 21px;
          font-weight: 950;
          letter-spacing: -0.04em;
          user-select: none;
          cursor: pointer;
        }

        .wordmarkIcon {
          display: grid;
          place-items: center;
          width: 24px;
          height: 24px;
          border-radius: 50%;
          color: #181818;
          background: linear-gradient(135deg, #fff0b6, #f5bd42);
          font-size: 13px;
        }

        .topSearch {
          position: relative;
          justify-self: end;
          width: min(520px, 100%);
        }

        .topSearch input {
          width: 100%;
          height: 36px;
          border: 1px solid rgba(255, 255, 255, 0.08);
          border-radius: 7px;
          outline: none;
          color: #f5f5f5;
          background: #242626;
          padding: 0 40px 0 13px;
          font-size: 14px;
        }

        .topSearch input::placeholder {
          color: #7d8797;
        }

        .topSearch span {
          position: absolute;
          right: 13px;
          top: 50%;
          transform: translateY(-50%);
          color: #8f98a7;
          font-size: 18px;
        }

        .topActions {
          display: flex;
          align-items: center;
          justify-content: flex-end;
          gap: 11px;
        }

        .textButton {
          border: 0;
          color: #ffffff;
          background: transparent;
          font-size: 13px;
          font-weight: 850;
        }

        .iconButton {
          width: 26px;
          height: 26px;
          border: 0;
          border-radius: 8px;
          display: grid;
          place-items: center;
          color: #fff;
          background: transparent;
          font-size: 15px;
        }

        .iconButton:first-of-type {
          background: #526fe9;
        }

        .banner {
          min-height: 168px;
          display: flex;
          align-items: center;
          justify-content: center;
          position: relative;
          margin: 0 0 21px;
          border-radius: 9px;
          background:
            radial-gradient(circle at 50% -15%, rgba(255, 216, 125, 0.08), transparent 38%),
            #050505;
          border: 1px solid rgba(255, 255, 255, 0.03);
        }

        .banner h1 {
          margin: 0 0 12px;
          font-size: 18px;
          line-height: 1.2;
          letter-spacing: -0.02em;
        }

        .banner p {
          margin: 0;
          color: #d7dbe1;
          font-size: 16px;
        }

        .banner span {
          position: absolute;
          right: 14px;
          bottom: 13px;
          color: #f3f3f3;
          font-size: 13px;
          font-weight: 850;
        }

        .browseHeader {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 18px;
          margin-bottom: 16px;
        }

        .modeTabs {
          display: flex;
          gap: 18px;
          align-items: flex-end;
        }

        .modeTabs button {
          position: relative;
          border: 0;
          background: transparent;
          color: #99a3b3;
          padding: 0 0 10px;
          font-size: 18px;
          font-weight: 900;
          letter-spacing: -0.04em;
        }

        .modeTabs button.active {
          color: #ffffff;
        }

        .modeTabs button.active::after {
          content: "";
          position: absolute;
          left: 0;
          right: 0;
          bottom: 0;
          height: 2px;
          background: #ff2f83;
          border-radius: 999px;
        }

        .toggleRow {
          display: flex;
          align-items: center;
          gap: 8px;
          color: #f3f3f3;
          font-size: 14px;
        }

        .toggle {
          position: relative;
          display: inline-flex;
          width: 34px;
          height: 18px;
        }

        .toggle input {
          opacity: 0;
          width: 0;
          height: 0;
        }

        .toggle span {
          position: absolute;
          inset: 0;
          border-radius: 999px;
          background: #303333;
          transition: 160ms ease;
        }

        .toggle span::after {
          content: "";
          position: absolute;
          top: 3px;
          left: 3px;
          width: 12px;
          height: 12px;
          border-radius: 50%;
          background: #f7f7f7;
          transition: 160ms ease;
        }

        .toggle input:checked + span {
          background: #3a3d3d;
        }

        .toggle input:checked + span::after {
          transform: translateX(16px);
        }

        .filterRow {
          display: flex;
          align-items: center;
          gap: 7px;
          overflow-x: auto;
          padding-bottom: 22px;
          scrollbar-width: none;
        }

        .filterRow::-webkit-scrollbar {
          display: none;
        }

        .filterRow button {
          flex: 0 0 auto;
          min-height: 35px;
          border: 0;
          border-radius: 7px;
          color: #f2f2f2;
          background: #303232;
          padding: 0 16px;
          font-size: 14px;
          font-weight: 850;
        }

        .filterRow button.active {
          background: #d81b63;
          color: white;
        }

        .filterRow button span {
          margin-left: 8px;
          font-size: 17px;
        }

        .filterRow .createInline {
          margin-left: auto;
          background: #242626;
          border: 1px solid rgba(255, 255, 255, 0.08);
          color: #ffffff;
        }

        .sectionTitle {
          margin: 0 0 14px;
        }

        .sectionTitle h2 {
          margin: 0;
          color: #ffffff;
          font-size: 21px;
          letter-spacing: -0.045em;
        }

        .sectionTitle p {
          margin: 5px 0 0;
          color: #8f98a7;
          font-size: 13px;
        }

        .horizontalWrap {
          position: relative;
          margin-bottom: 34px;
        }

        .horizontalList {
          display: grid;
          grid-auto-flow: column;
          grid-auto-columns: minmax(205px, 235px);
          gap: 10px;
          overflow-x: auto;
          padding-bottom: 3px;
          scrollbar-width: none;
        }

        .horizontalList::-webkit-scrollbar {
          display: none;
        }

        .characterCard {
          min-width: 0;
          border: 0;
          background: transparent;
          color: inherit;
          text-align: left;
          padding: 0;
        }

        .cardImage {
          position: relative;
          height: 290px;
          overflow: hidden;
          border-radius: 8px;
          background:
            radial-gradient(circle at 50% 20%, var(--accent), transparent 42%),
            linear-gradient(145deg, #2a2c2c, #111212);
          border: 1px solid rgba(255, 255, 255, 0.08);
          transition:
            transform 180ms ease,
            border-color 180ms ease,
            filter 180ms ease;
        }

        .characterCard:hover .cardImage {
          transform: translateY(-2px);
          border-color: rgba(255, 255, 255, 0.18);
          filter: brightness(1.05);
        }

        .cardImage img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .fakeArt {
          position: absolute;
          inset: 0;
          display: grid;
          place-items: center;
        }

        .fakeArt::before {
          content: "";
          position: absolute;
          width: 110px;
          height: 150px;
          border-radius: 999px 999px 34px 34px;
          background:
            radial-gradient(circle at 50% 24%, rgba(255, 255, 255, 0.7), transparent 10%),
            linear-gradient(180deg, rgba(255, 255, 255, 0.22), rgba(255, 255, 255, 0.04));
          filter: blur(0.2px);
          opacity: 0.8;
        }

        .fakeArt::after {
          content: "";
          position: absolute;
          width: 190px;
          height: 110px;
          bottom: -35px;
          border-radius: 50% 50% 0 0;
          background: rgba(0, 0, 0, 0.28);
        }

        .fakeArt span {
          position: relative;
          z-index: 2;
          color: #ffffff;
          font-size: 60px;
          font-weight: 950;
          text-shadow: 0 8px 28px rgba(0, 0, 0, 0.4);
        }

        .originalBadge {
          position: absolute;
          top: 7px;
          left: 7px;
          z-index: 5;
          color: #ffffff;
          background: rgba(0, 0, 0, 0.58);
          border-radius: 999px;
          padding: 3px 8px;
          font-size: 11px;
          font-weight: 950;
          font-style: italic;
        }

        .cardStats {
          position: absolute;
          right: 7px;
          bottom: 7px;
          z-index: 5;
          display: flex;
          gap: 4px;
        }

        .cardStats span {
          border-radius: 5px;
          color: #ffffff;
          background: rgba(0, 0, 0, 0.55);
          padding: 4px 6px;
          font-size: 11px;
          font-weight: 850;
        }

        .cardText {
          padding-top: 7px;
        }

        .cardText h3 {
          margin: 0 0 4px;
          overflow: hidden;
          color: #ffffff;
          text-overflow: ellipsis;
          white-space: nowrap;
          font-size: 16px;
          line-height: 1.2;
          font-weight: 950;
          letter-spacing: -0.035em;
        }

        .cardText p {
          margin: 0 0 5px;
          overflow: hidden;
          color: #a4abb6;
          text-overflow: ellipsis;
          white-space: nowrap;
          font-size: 13px;
          line-height: 1.3;
        }

        .cardText small {
          color: #1ba9e8;
          font-size: 12px;
        }

        .nextArrow {
          position: absolute;
          right: 5px;
          top: 126px;
          z-index: 10;
          width: 42px;
          height: 42px;
          border: 0;
          border-radius: 50%;
          color: #ffffff;
          background: rgba(42, 44, 44, 0.92);
          box-shadow: 0 12px 30px rgba(0, 0, 0, 0.35);
          font-size: 24px;
        }

        .grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(205px, 1fr));
          gap: 18px 10px;
        }

        .worldGrid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
          gap: 12px;
        }

        .worldCard {
          min-height: 180px;
          display: flex;
          flex-direction: column;
          justify-content: flex-end;
          border: 1px solid rgba(255, 255, 255, 0.08);
          border-radius: 9px;
          color: #ffffff;
          background:
            radial-gradient(circle at 50% 0%, var(--accent), transparent 46%),
            #111212;
          padding: 16px;
          text-align: left;
        }

        .worldCard span {
          color: #ff4f95;
          font-size: 12px;
          font-weight: 950;
          margin-bottom: 8px;
        }

        .worldCard h3 {
          margin: 0 0 8px;
          font-size: 21px;
          letter-spacing: -0.05em;
        }

        .worldCard p {
          margin: 0;
          color: #b7bec8;
          font-size: 14px;
          line-height: 1.45;
        }

        .emptyState {
          min-height: 260px;
          display: grid;
          place-items: center;
          border-radius: 9px;
          background: #111212;
          border: 1px solid rgba(255, 255, 255, 0.06);
          text-align: center;
          padding: 30px;
          margin-bottom: 30px;
        }

        .emptyState h2 {
          margin: 0 0 8px;
          color: #ffffff;
          font-size: 22px;
        }

        .emptyState p {
          margin: 0 auto 18px;
          max-width: 420px;
          color: #9ca5b4;
          line-height: 1.5;
        }

        .emptyState button {
          min-height: 38px;
          border: 0;
          border-radius: 7px;
          color: #ffffff;
          background: #d81b63;
          padding: 0 16px;
          font-weight: 850;
        }

        .helpBubble {
          position: fixed;
          right: 26px;
          bottom: 22px;
          z-index: 30;
          width: 56px;
          height: 56px;
          display: grid;
          place-items: center;
          border: 0;
          border-radius: 50%;
          color: #ffffff;
          background: #3857b7;
          font-size: 25px;
          box-shadow: 0 18px 44px rgba(0, 0, 0, 0.42);
        }

        @media (max-width: 900px) {
          .ombuHome {
            flex-direction: column;
          }

          .sideRail {
            position: relative;
            width: 100%;
            height: 62px;
            flex: 0 0 62px;
            flex-direction: row;
            justify-content: flex-start;
            overflow-x: auto;
            padding: 8px 12px;
          }

          .railNav {
            flex-direction: row;
            width: auto;
            margin-top: 0;
          }

          .railItem {
            min-width: 62px;
            min-height: 46px;
          }

          .page {
            padding: 0 14px 42px;
          }

          .topHeader {
            position: relative;
            height: auto;
            grid-template-columns: 1fr;
            padding: 12px 0;
          }

          .topSearch {
            justify-self: stretch;
          }

          .topActions {
            justify-content: flex-start;
          }

          .banner {
            min-height: 145px;
            padding: 20px;
            justify-content: flex-start;
          }

          .browseHeader {
            align-items: flex-start;
            flex-direction: column;
          }

          .filterRow .createInline {
            margin-left: 0;
          }
        }

        @media (max-width: 560px) {
          .horizontalList {
            grid-auto-columns: minmax(170px, 190px);
          }

          .cardImage {
            height: 238px;
          }

          .grid {
            grid-template-columns: repeat(auto-fill, minmax(160px, 1fr));
          }

          .modeTabs button {
            font-size: 16px;
          }
        }
      `}</style>
    </>
  );
}

function RailButton({ icon, label, active = false, onClick }) {
  return (
    <button className={`railItem ${active ? "active" : ""}`} onClick={onClick}>
      <span className="railIcon">{icon}</span>
      <span className="railLabel">{label}</span>
    </button>
  );
}

function SectionTitle({ title, subtitle }) {
  return (
    <div className="sectionTitle">
      <h2>{title}</h2>
      {subtitle ? <p>{subtitle}</p> : null}
    </div>
  );
}

function HorizontalCharacters({ characters, animated, onEnter }) {
  return (
    <div className="horizontalWrap">
      <div className="horizontalList">
        {characters.map((character, index) => (
          <CharacterCard
            key={character.id}
            character={character}
            index={index}
            animated={animated}
            onEnter={() => onEnter(character)}
          />
        ))}
      </div>

      <button className="nextArrow" aria-label="Next characters">
        ›
      </button>
    </div>
  );
}

function CharacterGrid({ characters, animated, onEnter }) {
  return (
    <section className="grid">
      {characters.map((character, index) => (
        <CharacterCard
          key={character.id}
          character={character}
          index={index}
          animated={animated}
          onEnter={() => onEnter(character)}
        />
      ))}
    </section>
  );
}

function CharacterCard({ character, index, animated, onEnter }) {
  const accent = getAccent(character.accent);
  const messageCount = ["1.6k", "893", "508", "1.8k", "3.0k", "4.6k", "8.9k"][
    index % 7
  ];
  const imageCount = ["25", "50", "78", "50", "39", "50", "78"][index % 7];

  return (
    <button
      className={`characterCard ${animated ? "animated" : ""}`}
      style={{ "--accent": accent }}
      onClick={onEnter}
    >
      <div className="cardImage">
        <div className="originalBadge">#Original</div>

        {character.coverImage ? (
          <img src={character.coverImage} alt={character.name || "Character"} />
        ) : (
          <div className="fakeArt">
            <span>{character.symbol || "✦"}</span>
          </div>
        )}

        <div className="cardStats">
          <span>▣ {messageCount}</span>
          <span>▧ {imageCount}</span>
        </div>
      </div>

      <div className="cardText">
        <h3>{character.name}</h3>
        <p>{character.tagline || character.role}</p>
        <small>@{slugify(character.creator || "ombu")}</small>
      </div>
    </button>
  );
}

function WorldGrid({ worlds, onOpen }) {
  return (
    <section className="worldGrid">
      {worlds.map((world) => (
        <button
          key={world.id}
          className="worldCard"
          style={{ "--accent": getAccent(world.accent) }}
          onClick={onOpen}
        >
          <span>{world.tag}</span>
          <h3>{world.title}</h3>
          <p>{world.description}</p>
        </button>
      ))}
    </section>
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
    blue: "rgba(85, 132, 255, 0.42)",
    violet: "rgba(150, 90, 255, 0.42)",
    amber: "rgba(255, 177, 79, 0.42)",
    pink: "rgba(255, 78, 157, 0.42)",
    green: "rgba(85, 218, 167, 0.38)",
    red: "rgba(255, 75, 95, 0.42)"
  };

  return accents[accent] || accents.blue;
}

function slugify(value) {
  return String(value)
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "_")
    .replace(/^_+|_+$/g, "");
}
