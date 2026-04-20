import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

const blankCharacter = {
  name: "",
  title: "",
  age: "",
  gender: "",
  role: "",
  universe: "",
  appearance: "",
  personality: "",
  abilities: "",
  backstory: "",
  motivations: "",
  flaws: "",
  relationships: "",
  voice: "",
  privacy: "private"
};

export default function CharactersPage() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [form, setForm] = useState(blankCharacter);
  const [savedCharacters, setSavedCharacters] = useState([]);
  const [selectedId, setSelectedId] = useState(null);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const existing = window.localStorage.getItem("ombu_characters");
    if (existing) {
      try {
        const parsed = JSON.parse(existing);
        setSavedCharacters(Array.isArray(parsed) ? parsed : []);
      } catch {
        setSavedCharacters([]);
      }
    }
  }, []);

  const updateField = (key, value) => {
    setForm((prev) => ({
      ...prev,
      [key]: value
    }));
  };

  const handleSaveCharacter = () => {
    if (!form.name.trim()) return;

    const payload = {
      id: selectedId || `char_${Date.now()}`,
      ...form,
      updatedAt: new Date().toISOString()
    };

    const nextCharacters = selectedId
      ? savedCharacters.map((item) => (item.id === selectedId ? payload : item))
      : [payload, ...savedCharacters];

    setSavedCharacters(nextCharacters);
    setSelectedId(payload.id);

    if (typeof window !== "undefined") {
      window.localStorage.setItem("ombu_characters", JSON.stringify(nextCharacters));
    }
  };

  const handleLoadCharacter = (character) => {
    setSelectedId(character.id);
    setForm({
      name: character.name || "",
      title: character.title || "",
      age: character.age || "",
      gender: character.gender || "",
      role: character.role || "",
      universe: character.universe || "",
      appearance: character.appearance || "",
      personality: character.personality || "",
      abilities: character.abilities || "",
      backstory: character.backstory || "",
      motivations: character.motivations || "",
      flaws: character.flaws || "",
      relationships: character.relationships || "",
      voice: character.voice || "",
      privacy: character.privacy || "private"
    });
  };

  const handleNewCharacter = () => {
    setSelectedId(null);
    setForm(blankCharacter);
  };

  const handleDeleteCharacter = (id) => {
    const nextCharacters = savedCharacters.filter((item) => item.id !== id);
    setSavedCharacters(nextCharacters);

    if (typeof window !== "undefined") {
      window.localStorage.setItem("ombu_characters", JSON.stringify(nextCharacters));
    }

    if (selectedId === id) {
      handleNewCharacter();
    }
  };

  const previewSubtitle = useMemo(() => {
    const parts = [form.title, form.role, form.universe].filter(Boolean);
    return parts.length ? parts.join(" • ") : "No role or universe set yet";
  }, [form.title, form.role, form.universe]);

  return (
    <div style={styles.page}>
      <aside
        style={{
          ...styles.sidebar,
          width: sidebarCollapsed ? 88 : 260
        }}
      >
        <div style={styles.sidebarTop}>
          <div style={styles.sidebarBrandRow}>
            <div style={styles.sidebarLogo}>O</div>
            {!sidebarCollapsed && <div style={styles.sidebarBrandText}>OMBU</div>}
          </div>

          <button
            onClick={() => setSidebarCollapsed((prev) => !prev)}
            style={styles.collapseButton}
            aria-label="Toggle sidebar"
            title="Toggle sidebar"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
              <path
                d="M15 6L9 12L15 18"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
        </div>

        <div style={styles.sidebarSection}>
          <Link href="/" style={styles.sidebarItem}>
            <span style={styles.sidebarIconWrap}><HomeIcon /></span>
            {!sidebarCollapsed && <span>Home</span>}
          </Link>

          <Link href="/story" style={styles.sidebarItem}>
            <span style={styles.sidebarIconWrap}><StoryIcon /></span>
            {!sidebarCollapsed && <span>Story</span>}
          </Link>

          <Link href="/characters" style={styles.sidebarItemActive}>
            <span style={styles.sidebarIconWrap}><CharacterIcon /></span>
            {!sidebarCollapsed && <span>Characters</span>}
          </Link>

          <Link href="/universes" style={styles.sidebarItem}>
            <span style={styles.sidebarIconWrap}><UniverseIcon /></span>
            {!sidebarCollapsed && <span>Universes</span>}
          </Link>
        </div>

        <div style={styles.sidebarBottom}>
          <button onClick={handleNewCharacter} style={styles.primarySidebarButton}>
            <span style={styles.sidebarIconWrap}><PlusIcon /></span>
            {!sidebarCollapsed && <span>New Character</span>}
          </button>
        </div>
      </aside>

      <main style={styles.main}>
        <div style={styles.topBar}>
          <div>
            <div style={styles.topBarTitle}>Character Creator</div>
            <div style={styles.topBarSub}>
              Build reusable characters with strong identity, voice, and memory.
            </div>
          </div>

          <div style={styles.topBarActions}>
            <button onClick={handleNewCharacter} style={styles.secondaryButton}>Clear</button>
            <button onClick={handleSaveCharacter} style={styles.primaryButton}>Save Character</button>
          </div>
        </div>

        <div style={styles.layout}>
          <section style={styles.formPanel}>
            <div style={styles.gridTwo}>
              <Field label="Name" value={form.name} onChange={(value) => updateField("name", value)} placeholder="Kael Voss" />
              <Field label="Title / Alias" value={form.title} onChange={(value) => updateField("title", value)} placeholder="The Ash Warden" />
              <Field label="Age" value={form.age} onChange={(value) => updateField("age", value)} placeholder="27" />
              <Field label="Gender" value={form.gender} onChange={(value) => updateField("gender", value)} placeholder="Optional" />
              <Field label="Role / Archetype" value={form.role} onChange={(value) => updateField("role", value)} placeholder="Anti-hero, commander, mentor..." />
              <Field label="Universe" value={form.universe} onChange={(value) => updateField("universe", value)} placeholder="Ombu original world" />
            </div>

            <TextAreaField label="Appearance" value={form.appearance} onChange={(value) => updateField("appearance", value)} placeholder="What do they look like at a glance? Clothing, body type, notable features..." />
            <TextAreaField label="Personality" value={form.personality} onChange={(value) => updateField("personality", value)} placeholder="How do they act, react, and come across?" />
            <TextAreaField label="Abilities / Skills" value={form.abilities} onChange={(value) => updateField("abilities", value)} placeholder="Combat style, powers, profession, strengths..." />
            <TextAreaField label="Backstory" value={form.backstory} onChange={(value) => updateField("backstory", value)} placeholder="What shaped them?" />
            <TextAreaField label="Motivations" value={form.motivations} onChange={(value) => updateField("motivations", value)} placeholder="What do they want more than anything?" />
            <TextAreaField label="Flaws / Weaknesses" value={form.flaws} onChange={(value) => updateField("flaws", value)} placeholder="Internal flaws, fears, bad habits, blind spots..." />
            <TextAreaField label="Relationships" value={form.relationships} onChange={(value) => updateField("relationships", value)} placeholder="Friends, enemies, rivals, family..." />
            <TextAreaField label="Voice / Dialogue Style" value={form.voice} onChange={(value) => updateField("voice", value)} placeholder="Short and cold? Loud and reckless? Elegant and precise?" />

            <div style={styles.selectWrap}>
              <label style={styles.label}>Privacy</label>
              <select
                value={form.privacy}
                onChange={(e) => updateField("privacy", e.target.value)}
                style={styles.select}
              >
                <option value="private">Private</option>
                <option value="public">Public</option>
              </select>
            </div>
          </section>

          <aside style={styles.sidePanel}>
            <div style={styles.previewCard}>
              <div style={styles.previewEyebrow}>Live Preview</div>
              <div style={styles.previewName}>{form.name || "Unnamed Character"}</div>
              <div style={styles.previewSubtitle}>{previewSubtitle}</div>

              <PreviewBlock label="Appearance" value={form.appearance} />
              <PreviewBlock label="Personality" value={form.personality} />
              <PreviewBlock label="Abilities" value={form.abilities} />
              <PreviewBlock label="Motivation" value={form.motivations} />
              <PreviewBlock label="Voice" value={form.voice} />
            </div>

            <div style={styles.libraryCard}>
              <div style={styles.libraryHeader}>
                <div>
                  <div style={styles.previewEyebrow}>Saved Characters</div>
                  <div style={styles.libraryCount}>{savedCharacters.length} saved</div>
                </div>
              </div>

              <div style={styles.savedList}>
                {savedCharacters.length === 0 && (
                  <div style={styles.emptyState}>
                    Nothing saved yet. Build the first one and it’ll live here.
                  </div>
                )}

                {savedCharacters.map((character) => (
                  <div key={character.id} style={styles.savedItem}>
                    <button
                      type="button"
                      onClick={() => handleLoadCharacter(character)}
                      style={styles.savedItemMain}
                    >
                      <div style={styles.savedItemName}>{character.name || "Untitled"}</div>
                      <div style={styles.savedItemMeta}>
                        {[character.title, character.universe].filter(Boolean).join(" • ") || "No metadata yet"}
                      </div>
                    </button>

                    <button
                      type="button"
                      onClick={() => handleDeleteCharacter(character.id)}
                      style={styles.deleteButton}
                    >
                      Delete
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </aside>
        </div>
      </main>
    </div>
  );
}

function Field({ label, value, onChange, placeholder }) {
  return (
    <div style={styles.fieldWrap}>
      <label style={styles.label}>{label}</label>
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        style={styles.input}
      />
    </div>
  );
}

function TextAreaField({ label, value, onChange, placeholder }) {
  return (
    <div style={styles.fieldWrap}>
      <label style={styles.label}>{label}</label>
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        style={styles.textarea}
      />
    </div>
  );
}

function PreviewBlock({ label, value }) {
  return (
    <div style={styles.previewBlock}>
      <div style={styles.previewBlockLabel}>{label}</div>
      <div style={styles.previewBlockValue}>{value || "Not filled out yet."}</div>
    </div>
  );
}

function HomeIcon() {
  return <svg width="18" height="18" viewBox="0 0 24 24" fill="none"><path d="M3 10.5L12 3L21 10.5V20A1 1 0 0 1 20 21H4A1 1 0 0 1 3 20V10.5Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /><path d="M9 21V12H15V21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>;
}
function StoryIcon() {
  return <svg width="18" height="18" viewBox="0 0 24 24" fill="none"><path d="M6 4H18A2 2 0 0 1 20 6V18A2 2 0 0 1 18 20H6A2 2 0 0 1 4 18V6A2 2 0 0 1 6 4Z" stroke="currentColor" strokeWidth="2" /><path d="M8 8H16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" /><path d="M8 12H16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" /><path d="M8 16H13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" /></svg>;
}
function CharacterIcon() {
  return <svg width="18" height="18" viewBox="0 0 24 24" fill="none"><path d="M20 21C20 17.6863 16.4183 15 12 15C7.58172 15 4 17.6863 4 21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" /><circle cx="12" cy="8" r="4" stroke="currentColor" strokeWidth="2" /></svg>;
}
function UniverseIcon() {
  return <svg width="18" height="18" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="8" stroke="currentColor" strokeWidth="2" /><path d="M4 12H20" stroke="currentColor" strokeWidth="2" strokeLinecap="round" /><path d="M12 4C14.5 6.5 16 9.16667 16 12C16 14.8333 14.5 17.5 12 20" stroke="currentColor" strokeWidth="2" strokeLinecap="round" /><path d="M12 4C9.5 6.5 8 9.16667 8 12C8 14.8333 9.5 17.5 12 20" stroke="currentColor" strokeWidth="2" strokeLinecap="round" /></svg>;
}
function PlusIcon() {
  return <svg width="18" height="18" viewBox="0 0 24 24" fill="none"><path d="M12 5V19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" /><path d="M5 12H19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" /></svg>;
}

const styles = {
  page: {
    minHeight: "100vh",
    display: "flex",
    background: "radial-gradient(circle at top, rgba(82, 99, 255, 0.18), transparent 28%), #05070d",
    color: "#ffffff",
    fontFamily: 'Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif'
  },
  sidebar: {
    background: "rgba(10, 12, 20, 0.9)",
    borderRight: "1px solid rgba(255,255,255,0.06)",
    padding: "18px 14px",
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
    transition: "width 0.25s ease",
    position: "sticky",
    top: 0,
    height: "100vh",
    backdropFilter: "blur(18px)"
  },
  sidebarTop: { display: "flex", flexDirection: "column", gap: 18 },
  sidebarBrandRow: { display: "flex", alignItems: "center", gap: 12, padding: "4px 6px" },
  sidebarLogo: {
    width: 38, height: 38, borderRadius: 12, display: "flex", alignItems: "center", justifyContent: "center",
    background: "linear-gradient(135deg, rgba(120,140,255,0.28), rgba(120,140,255,0.08))",
    border: "1px solid rgba(255,255,255,0.08)", fontWeight: 700, fontSize: 16
  },
  sidebarBrandText: { fontSize: 18, letterSpacing: 3, fontWeight: 600, opacity: 0.95 },
  collapseButton: {
    height: 42, borderRadius: 12, border: "1px solid rgba(255,255,255,0.08)", background: "rgba(255,255,255,0.03)",
    color: "white", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center"
  },
  sidebarSection: { display: "flex", flexDirection: "column", gap: 10, marginTop: 20 },
  sidebarItem: {
    display: "flex", alignItems: "center", gap: 12, padding: "12px 14px", borderRadius: 14,
    color: "rgba(255,255,255,0.72)", textDecoration: "none", background: "transparent", border: "1px solid transparent"
  },
  sidebarItemActive: {
    display: "flex", alignItems: "center", gap: 12, padding: "12px 14px", borderRadius: 14,
    color: "white", textDecoration: "none", background: "linear-gradient(135deg, rgba(96,115,255,0.22), rgba(96,115,255,0.08))",
    border: "1px solid rgba(135,145,255,0.18)"
  },
  sidebarIconWrap: { display: "flex", alignItems: "center", justifyContent: "center", minWidth: 18 },
  sidebarBottom: { marginTop: 24 },
  primarySidebarButton: {
    width: "100%", display: "flex", alignItems: "center", gap: 12, justifyContent: "center", padding: "13px 14px",
    borderRadius: 14, border: "1px solid rgba(130,145,255,0.18)", background: "linear-gradient(135deg, rgba(98,120,255,0.20), rgba(98,120,255,0.10))",
    color: "white", cursor: "pointer"
  },
  main: { flex: 1, minWidth: 0, display: "flex", flexDirection: "column", padding: "22px 26px 26px" },
  topBar: { display: "flex", justifyContent: "space-between", alignItems: "center", gap: 16, paddingBottom: 18 },
  topBarTitle: { fontSize: 24, fontWeight: 700, letterSpacing: "-0.02em" },
  topBarSub: { marginTop: 6, color: "rgba(255,255,255,0.52)", fontSize: 14 },
  topBarActions: { display: "flex", gap: 10 },
  secondaryButton: {
    padding: "11px 16px", borderRadius: 12, border: "1px solid rgba(255,255,255,0.08)", background: "rgba(255,255,255,0.04)",
    color: "white", cursor: "pointer"
  },
  primaryButton: {
    padding: "11px 16px", borderRadius: 12, border: "1px solid rgba(130,145,255,0.18)",
    background: "linear-gradient(135deg, rgba(98,120,255,0.28), rgba(98,120,255,0.14))", color: "white", cursor: "pointer"
  },
  layout: { display: "grid", gridTemplateColumns: "minmax(0, 1.35fr) minmax(340px, 0.8fr)", gap: 18, minHeight: 0 },
  formPanel: {
    background: "rgba(255,255,255,0.035)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: 24, padding: 20,
    display: "flex", flexDirection: "column", gap: 16
  },
  gridTwo: { display: "grid", gridTemplateColumns: "repeat(2, minmax(0, 1fr))", gap: 14 },
  fieldWrap: { display: "flex", flexDirection: "column", gap: 8 },
  label: { fontSize: 13, color: "rgba(255,255,255,0.64)", fontWeight: 600 },
  input: {
    height: 50, borderRadius: 14, border: "1px solid rgba(255,255,255,0.08)", background: "rgba(12,14,24,0.82)",
    color: "white", padding: "0 14px", outline: "none"
  },
  textarea: {
    minHeight: 108, resize: "vertical", borderRadius: 16, border: "1px solid rgba(255,255,255,0.08)",
    background: "rgba(12,14,24,0.82)", color: "white", padding: 14, outline: "none", lineHeight: 1.6
  },
  selectWrap: { display: "flex", flexDirection: "column", gap: 8 },
  select: {
    height: 50, borderRadius: 14, border: "1px solid rgba(255,255,255,0.08)", background: "rgba(12,14,24,0.82)",
    color: "white", padding: "0 14px", outline: "none"
  },
  sidePanel: { display: "flex", flexDirection: "column", gap: 18 },
  previewCard: {
    background: "rgba(255,255,255,0.035)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: 24, padding: 20
  },
  previewEyebrow: { fontSize: 12, textTransform: "uppercase", letterSpacing: "0.10em", color: "rgba(255,255,255,0.42)", marginBottom: 10 },
  previewName: { fontSize: 28, fontWeight: 700, letterSpacing: "-0.03em" },
  previewSubtitle: { marginTop: 8, color: "rgba(255,255,255,0.58)", fontSize: 14, marginBottom: 18 },
  previewBlock: { paddingTop: 14, borderTop: "1px solid rgba(255,255,255,0.06)", marginTop: 14 },
  previewBlockLabel: { fontSize: 12, color: "rgba(255,255,255,0.42)", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 8 },
  previewBlockValue: { color: "rgba(255,255,255,0.84)", lineHeight: 1.65, whiteSpace: "pre-wrap" },
  libraryCard: {
    background: "rgba(255,255,255,0.035)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: 24, padding: 20,
    display: "flex", flexDirection: "column", minHeight: 280
  },
  libraryHeader: { display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 14 },
  libraryCount: { fontSize: 18, fontWeight: 700 },
  savedList: { display: "flex", flexDirection: "column", gap: 10 },
  emptyState: {
    borderRadius: 16, padding: 16, background: "rgba(255,255,255,0.03)", color: "rgba(255,255,255,0.58)", lineHeight: 1.6
  },
  savedItem: {
    display: "flex", gap: 10, alignItems: "stretch", borderRadius: 18, border: "1px solid rgba(255,255,255,0.06)",
    background: "rgba(255,255,255,0.03)", padding: 10
  },
  savedItemMain: {
    flex: 1, textAlign: "left", background: "transparent", border: "none", color: "white", cursor: "pointer", padding: 4
  },
  savedItemName: { fontWeight: 700, marginBottom: 6 },
  savedItemMeta: { color: "rgba(255,255,255,0.56)", fontSize: 13, lineHeight: 1.5 },
  deleteButton: {
    alignSelf: "center", height: 38, padding: "0 12px", borderRadius: 12, border: "1px solid rgba(255,255,255,0.08)",
    background: "rgba(255,255,255,0.04)", color: "white", cursor: "pointer"
  }
};
