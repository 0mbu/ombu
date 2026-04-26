import Head from "next/head";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

const STORAGE_KEY = "ombu_saved_characters";

const TABS = ["public", "mine", "create"];

const emptyCharacter = {
  name: "",
  personality: "",
  background: "",
  voice: ""
};

const mockPublicCharacters = [
  {
    id: "p1",
    name: "Kael Varyn",
    description: "Cold strategist with a hidden past",
    creator: "User_142"
  },
  {
    id: "p2",
    name: "Luna Seraph",
    description: "Emotionally unstable mage prodigy",
    creator: "VoidWriter"
  },
  {
    id: "p3",
    name: "Rex Hollow",
    description: "Post-apocalyptic survivor leader",
    creator: "AshenCore"
  }
];

export default function CharactersPage() {
  const [activeTab, setActiveTab] = useState("public");

  const [form, setForm] = useState(emptyCharacter);
  const [savedCharacters, setSavedCharacters] = useState([]);
  const [selectedId, setSelectedId] = useState(null);
  const [loaded, setLoaded] = useState(false);

  // LOAD
  useEffect(() => {
    if (typeof window === "undefined") return;

    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed)) setSavedCharacters(parsed);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoaded(true);
    }
  }, []);

  // SAVE
  useEffect(() => {
    if (!loaded) return;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(savedCharacters));
  }, [savedCharacters, loaded]);

  const updateField = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSave = () => {
    if (!form.name.trim()) return;

    const character = {
      ...form,
      id:
        selectedId ||
        `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`
    };

    setSavedCharacters((prev) => {
      const exists = prev.some((c) => c.id === character.id);
      if (exists) {
        return prev.map((c) => (c.id === character.id ? character : c));
      }
      return [character, ...prev];
    });

    setSelectedId(character.id);
    setActiveTab("mine");
  };

  const handleDelete = (id) => {
    setSavedCharacters((prev) => prev.filter((c) => c.id !== id));
  };

  const handleLoad = (c) => {
    setSelectedId(c.id);
    setForm(c);
    setActiveTab("create");
  };

  return (
    <>
      <Head>
        <title>Character Hub | OMBU</title>
      </Head>

      <div style={styles.page}>
        <Sidebar />

        <main style={styles.main}>
          <h1 style={styles.title}>Character Hub</h1>

          {/* TABS */}
          <div style={styles.tabs}>
            <Tab label="Public" value="public" activeTab={activeTab} setActiveTab={setActiveTab} />
            <Tab label="My Characters" value="mine" activeTab={activeTab} setActiveTab={setActiveTab} />
            <Tab label="Create" value="create" activeTab={activeTab} setActiveTab={setActiveTab} />
          </div>

          {/* CONTENT */}
          {activeTab === "public" && (
            <div style={styles.grid}>
              {mockPublicCharacters.map((c) => (
                <div key={c.id} style={styles.card}>
                  <h3>{c.name}</h3>
                  <p>{c.description}</p>
                  <span style={styles.meta}>by {c.creator}</span>
                  <button style={styles.useBtn}>Use Character</button>
                </div>
              ))}
            </div>
          )}

          {activeTab === "mine" && (
            <div style={styles.grid}>
              {savedCharacters.length === 0 && (
                <p>No characters yet.</p>
              )}

              {savedCharacters.map((c) => (
                <div key={c.id} style={styles.card}>
                  <h3>{c.name}</h3>
                  <p>{c.personality}</p>

                  <div style={styles.row}>
                    <button onClick={() => handleLoad(c)}>Edit</button>
                    <button onClick={() => handleDelete(c.id)}>Delete</button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {activeTab === "create" && (
            <div style={styles.form}>
              <input
                placeholder="Name"
                value={form.name}
                onChange={(e) => updateField("name", e.target.value)}
              />
              <textarea
                placeholder="Personality"
                value={form.personality}
                onChange={(e) => updateField("personality", e.target.value)}
              />
              <textarea
                placeholder="Backstory"
                value={form.background}
                onChange={(e) => updateField("background", e.target.value)}
              />
              <textarea
                placeholder="Voice"
                value={form.voice}
                onChange={(e) => updateField("voice", e.target.value)}
              />

              <button onClick={handleSave}>Save Character</button>
            </div>
          )}
        </main>
      </div>
    </>
  );
}

function Tab({ label, value, activeTab, setActiveTab }) {
  return (
    <button
      onClick={() => setActiveTab(value)}
      style={{
        ...styles.tab,
        ...(activeTab === value ? styles.activeTab : {})
      }}
    >
      {label}
    </button>
  );
}

function Sidebar() {
  return (
    <div style={styles.sidebar}>
      <Link href="/">Home</Link>
      <Link href="/story">Story Engine</Link>
      <Link href="/characters">Character Hub</Link>
      <Link href="/universes">World Engine</Link>
    </div>
  );
}

const styles = {
  page: {
    display: "flex",
    minHeight: "100vh",
    background: "#05070d",
    color: "white"
  },
  sidebar: {
    width: 200,
    padding: 20,
    borderRight: "1px solid rgba(255,255,255,0.06)",
    display: "flex",
    flexDirection: "column",
    gap: 10
  },
  main: {
    flex: 1,
    padding: 30
  },
  title: {
    fontSize: 32,
    marginBottom: 20
  },
  tabs: {
    display: "flex",
    gap: 10,
    marginBottom: 20
  },
  tab: {
    padding: "10px 14px",
    background: "#111",
    border: "1px solid #222",
    cursor: "pointer"
  },
  activeTab: {
    background: "#4f6fff"
  },
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))",
    gap: 16
  },
  card: {
    padding: 16,
    borderRadius: 12,
    background: "rgba(255,255,255,0.05)",
    border: "1px solid rgba(255,255,255,0.08)"
  },
  meta: {
    fontSize: 12,
    opacity: 0.6
  },
  useBtn: {
    marginTop: 10
  },
  row: {
    display: "flex",
    gap: 10,
    marginTop: 10
  },
  form: {
    display: "flex",
    flexDirection: "column",
    gap: 12,
    maxWidth: 500
  }
};
