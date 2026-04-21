import Head from "next/head";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

const STORAGE_KEY = "ombu_saved_characters";

const emptyCharacter = {
  name: "",
  role: "",
  age: "",
  appearance: "",
  personality: "",
  background: "",
  motivation: "",
  strengths: "",
  flaws: "",
  voice: ""
};

export default function CharactersPage() {
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

  const handleSave = () => {
    if (!form.name.trim()) return;

    const character = {
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
  };

  const handleNew = () => {
    setSelectedId(null);
    setForm(emptyCharacter);
  };

  const handleLoad = (character) => {
    setSelectedId(character.id);
    setForm({
      name: character.name || "",
      role: character.role || "",
      age: character.age || "",
      appearance: character.appearance || "",
      personality: character.personality || "",
      background: character.background || "",
      motivation: character.motivation || "",
      strengths: character.strengths || "",
      flaws: character.flaws || "",
      voice: character.voice || ""
    });
  };

  const handleDelete = (id) => {
    setSavedCharacters((prev) => prev.filter((item) => item.id !== id));
    if (selectedId === id) {
      handleNew();
    }
  };

  const previewTitle = useMemo(() => {
    return form.name.trim() || "Unnamed character";
  }, [form.name]);

  return (
    <>
      <Head>
        <title>Characters | OMBU</title>
      </Head>

      <div style={styles.page}>
        <div style={styles.sidebar}>
          <div style={styles.sidebarBrand}>OMBU</div>
          <div style={styles.sidebarLinks}>
            <Link href="/" style={styles.sidebarLink}>Home</Link>
            <Link href="/story" style={styles.sidebarLink}>Story</Link>
            <Link href="/characters" style={styles.sidebarActive}>Characters</Link>
            <Link href="/universes" style={styles.sidebarLink}>Universes</Link>
          </div>
        </div>

        <main style={styles.main}>
          <div style={styles.topBar}>
            <div>
              <div style={styles.eyebrow}>Character creation</div>
              <h1 style={styles.title}>Build characters worth remembering.</h1>
              <p style={styles.subtitle}>
                Create reusable characters with voice, identity, motivations, and flaws.
              </p>
            </div>

            <div style={styles.topActions}>
              <button onClick={handleNew} style={styles.secondaryButton}>
                New Character
              </button>
              <button onClick={handleSave} style={styles.primaryButton}>
                Save Character
              </button>
            </div>
          </div>

          <div style={styles.layout}>
            <section style={styles.formCard}>
              <div style={styles.sectionTitle}>Character details</div>

              <div style={styles.grid}>
                <Field
                  label="Name"
                  value={form.name}
                  onChange={(value) => updateField("name", value)}
                  placeholder="Jace Vale"
                />
                <Field
                  label="Role"
                  value={form.role}
                  onChange={(value) => updateField("role", value)}
                  placeholder="Reluctant anti-hero"
                />
                <Field
                  label="Age"
                  value={form.age}
                  onChange={(value) => updateField("age", value)}
                  placeholder="24"
                />
              </div>

              <TextAreaField
                label="Appearance"
                value={form.appearance}
                onChange={(value) => updateField("appearance", value)}
                placeholder="What do they look like?"
              />
              <TextAreaField
                label="Personality"
                value={form.personality}
                onChange={(value) => updateField("personality", value)}
                placeholder="How do they act around people?"
              />
              <TextAreaField
                label="Background"
                value={form.background}
                onChange={(value) => updateField("background", value)}
                placeholder="What shaped them?"
              />
              <TextAreaField
                label="Motivation"
                value={form.motivation}
                onChange={(value) => updateField("motivation", value)}
                placeholder="What do they want most?"
              />
              <TextAreaField
                label="Strengths"
                value={form.strengths}
                onChange={(value) => updateField("strengths", value)}
                placeholder="What are they good at?"
              />
              <TextAreaField
                label="Flaws"
                value={form.flaws}
                onChange={(value) => updateField("flaws", value)}
                placeholder="What holds them back?"
              />
              <TextAreaField
                label="Voice"
                value={form.voice}
                onChange={(value) => updateField("voice", value)}
                placeholder="How do they speak or carry themselves?"
              />
            </section>

            <aside style={styles.sideColumn}>
              <div style={styles.previewCard}>
                <div style={styles.sectionTitle}>Live preview</div>
                <div style={styles.previewName}>{previewTitle}</div>
                <div style={styles.previewRole}>{form.role || "No role yet"}</div>

                <PreviewRow label="Age" value={form.age} />
                <PreviewRow label="Appearance" value={form.appearance} />
                <PreviewRow label="Personality" value={form.personality} />
                <PreviewRow label="Background" value={form.background} />
                <PreviewRow label="Motivation" value={form.motivation} />
                <PreviewRow label="Strengths" value={form.strengths} />
                <PreviewRow label="Flaws" value={form.flaws} />
                <PreviewRow label="Voice" value={form.voice} />
              </div>

              <div style={styles.savedCard}>
                <div style={styles.sectionTitle}>Saved characters</div>

                {!savedCharacters.length ? (
                  <div style={styles.emptyState}>
                    No saved characters yet.
                  </div>
                ) : (
                  <div style={styles.savedList}>
                    {savedCharacters.map((character) => (
                      <div key={character.id} style={styles.savedItem}>
                        <button
                          type="button"
                          onClick={() => handleLoad(character)}
                          style={styles.savedLoadButton}
                        >
                          <div style={styles.savedName}>{character.name || "Unnamed character"}</div>
                          <div style={styles.savedMeta}>{character.role || "No role set"}</div>
                        </button>

                        <button
                          type="button"
                          onClick={() => handleDelete(character.id)}
                          style={styles.deleteButton}
                        >
                          Delete
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </aside>
          </div>
        </main>
      </div>
    </>
  );
}

function Field({ label, value, onChange, placeholder }) {
  return (
    <label style={styles.field}>
      <span style={styles.label}>{label}</span>
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        style={styles.input}
      />
    </label>
  );
}

function TextAreaField({ label, value, onChange, placeholder }) {
  return (
    <label style={styles.field}>
      <span style={styles.label}>{label}</span>
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        style={styles.textarea}
      />
    </label>
  );
}

function PreviewRow({ label, value }) {
  return (
    <div style={styles.previewRow}>
      <div style={styles.previewLabel}>{label}</div>
      <div style={styles.previewValue}>{value || "—"}</div>
    </div>
  );
}

const styles = {
  page: {
    minHeight: "100vh",
    display: "flex",
    background: "#06070d",
    color: "white",
    fontFamily:
      'Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif'
  },

  sidebar: {
    width: 220,
    borderRight: "1px solid rgba(255,255,255,0.06)",
    padding: 24,
    background: "rgba(10,12,20,0.9)"
  },

  sidebarBrand: {
    fontSize: 18,
    fontWeight: 700,
    letterSpacing: "0.28em",
    marginBottom: 28
  },

  sidebarLinks: {
    display: "flex",
    flexDirection: "column",
    gap: 10
  },

  sidebarLink: {
    textDecoration: "none",
    color: "rgba(255,255,255,0.72)",
    padding: "10px 12px",
    borderRadius: 12
  },

  sidebarActive: {
    textDecoration: "none",
    color: "white",
    background: "linear-gradient(135deg, rgba(96,115,255,0.22), rgba(96,115,255,0.08))",
    padding: "10px 12px",
    borderRadius: 12
  },

  main: {
    flex: 1,
    padding: 28
  },

  topBar: {
    display: "flex",
    justifyContent: "space-between",
    gap: 24,
    alignItems: "flex-start",
    marginBottom: 24
  },

  eyebrow: {
    fontSize: 12,
    letterSpacing: "0.12em",
    textTransform: "uppercase",
    color: "rgba(255,255,255,0.46)",
    marginBottom: 10
  },

  title: {
    margin: 0,
    fontSize: "clamp(2rem, 4vw, 3rem)",
    lineHeight: 1.03
  },

  subtitle: {
    marginTop: 12,
    maxWidth: 720,
    color: "rgba(255,255,255,0.62)",
    lineHeight: 1.6
  },

  topActions: {
    display: "flex",
    gap: 12
  },

  primaryButton: {
    height: 46,
    padding: "0 18px",
    borderRadius: 14,
    border: "none",
    cursor: "pointer",
    color: "white",
    fontWeight: 700,
    background: "linear-gradient(135deg, #5f6fff, #7b87ff)"
  },

  secondaryButton: {
    height: 46,
    padding: "0 18px",
    borderRadius: 14,
    border: "1px solid rgba(255,255,255,0.08)",
    background: "rgba(255,255,255,0.04)",
    color: "white",
    cursor: "pointer"
  },

  layout: {
    display: "grid",
    gridTemplateColumns: "minmax(0, 1.2fr) minmax(320px, 0.8fr)",
    gap: 20
  },

  formCard: {
    background: "rgba(255,255,255,0.035)",
    border: "1px solid rgba(255,255,255,0.06)",
    borderRadius: 24,
    padding: 22
  },

  sideColumn: {
    display: "flex",
    flexDirection: "column",
    gap: 20
  },

  previewCard: {
    background: "rgba(255,255,255,0.035)",
    border: "1px solid rgba(255,255,255,0.06)",
    borderRadius: 24,
    padding: 22
  },

  savedCard: {
    background: "rgba(255,255,255,0.035)",
    border: "1px solid rgba(255,255,255,0.06)",
    borderRadius: 24,
    padding: 22
  },

  sectionTitle: {
    fontSize: 18,
    fontWeight: 700,
    marginBottom: 18
  },

  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(3, minmax(0, 1fr))",
    gap: 14
  },

  field: {
    display: "flex",
    flexDirection: "column",
    gap: 8,
    marginBottom: 16
  },

  label: {
    fontSize: 13,
    color: "rgba(255,255,255,0.74)"
  },

  input: {
    height: 48,
    borderRadius: 14,
    border: "1px solid rgba(255,255,255,0.08)",
    background: "rgba(11,13,22,0.9)",
    color: "white",
    padding: "0 14px",
    outline: "none"
  },

  textarea: {
    minHeight: 96,
    borderRadius: 14,
    border: "1px solid rgba(255,255,255,0.08)",
    background: "rgba(11,13,22,0.9)",
    color: "white",
    padding: "12px 14px",
    outline: "none",
    resize: "vertical",
    fontFamily: "inherit"
  },

  previewName: {
    fontSize: 28,
    fontWeight: 700,
    marginBottom: 6
  },

  previewRole: {
    color: "rgba(255,255,255,0.62)",
    marginBottom: 18
  },

  previewRow: {
    marginBottom: 14
  },

  previewLabel: {
    fontSize: 12,
    letterSpacing: "0.08em",
    textTransform: "uppercase",
    color: "rgba(255,255,255,0.42)",
    marginBottom: 6
  },

  previewValue: {
    lineHeight: 1.6,
    color: "rgba(255,255,255,0.88)"
  },

  emptyState: {
    color: "rgba(255,255,255,0.52)"
  },

  savedList: {
    display: "flex",
    flexDirection: "column",
    gap: 12
  },

  savedItem: {
    display: "flex",
    gap: 10,
    alignItems: "stretch"
  },

  savedLoadButton: {
    flex: 1,
    textAlign: "left",
    borderRadius: 16,
    border: "1px solid rgba(255,255,255,0.08)",
    background: "rgba(11,13,22,0.9)",
    color: "white",
    padding: "14px",
    cursor: "pointer"
  },

  savedName: {
    fontWeight: 700,
    marginBottom: 4
  },

  savedMeta: {
    color: "rgba(255,255,255,0.58)",
    fontSize: 14
  },

  deleteButton: {
    borderRadius: 14,
    border: "1px solid rgba(255,255,255,0.08)",
    background: "rgba(255,255,255,0.04)",
    color: "white",
    padding: "0 14px",
    cursor: "pointer"
  }
};
