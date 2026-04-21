import Head from "next/head";
import Link from "next/link";
import { useState } from "react";

export default function UniversesPage() {
  const [form, setForm] = useState({
    name: "",
    genre: "",
    tone: "",
    premise: "",
    rules: "",
    conflict: ""
  });

  const updateField = (field, value) => {
    setForm((prev) => ({
      ...prev,
      [field]: value
    }));
  };

  return (
    <>
      <Head>
        <title>Universes | OMBU</title>
      </Head>

      <div style={styles.page}>
        <div style={styles.sidebar}>
          <div style={styles.sidebarBrand}>OMBU</div>
          <div style={styles.sidebarLinks}>
            <Link href="/" style={styles.sidebarLink}>Home</Link>
            <Link href="/story" style={styles.sidebarLink}>Story</Link>
            <Link href="/characters" style={styles.sidebarLink}>Characters</Link>
            <Link href="/universes" style={styles.sidebarActive}>Universes</Link>
          </div>
        </div>

        <main style={styles.main}>
          <div style={styles.eyebrow}>Worldbuilding</div>
          <h1 style={styles.title}>Build a universe with real structure.</h1>
          <p style={styles.subtitle}>
            This is the foundation for your worldbuilder. Right now it gives you a clean
            place to define the universe, its rules, tone, and central conflict.
          </p>

          <div style={styles.layout}>
            <section style={styles.formCard}>
              <div style={styles.sectionTitle}>Universe details</div>

              <Field
                label="Universe name"
                value={form.name}
                onChange={(value) => updateField("name", value)}
                placeholder="The Hollow Dominion"
              />
              <Field
                label="Genre"
                value={form.genre}
                onChange={(value) => updateField("genre", value)}
                placeholder="Dark fantasy"
              />
              <Field
                label="Tone"
                value={form.tone}
                onChange={(value) => updateField("tone", value)}
                placeholder="Melancholic, brutal, mythic"
              />
              <TextAreaField
                label="Premise"
                value={form.premise}
                onChange={(value) => updateField("premise", value)}
                placeholder="What is this world at its core?"
              />
              <TextAreaField
                label="Rules"
                value={form.rules}
                onChange={(value) => updateField("rules", value)}
                placeholder="How does magic, power, technology, or society work?"
              />
              <TextAreaField
                label="Central conflict"
                value={form.conflict}
                onChange={(value) => updateField("conflict", value)}
                placeholder="What tension drives this world?"
              />
            </section>

            <aside style={styles.previewCard}>
              <div style={styles.sectionTitle}>Live preview</div>

              <PreviewRow label="Universe name" value={form.name} />
              <PreviewRow label="Genre" value={form.genre} />
              <PreviewRow label="Tone" value={form.tone} />
              <PreviewRow label="Premise" value={form.premise} />
              <PreviewRow label="Rules" value={form.rules} />
              <PreviewRow label="Central conflict" value={form.conflict} />
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
    maxWidth: 760,
    color: "rgba(255,255,255,0.62)",
    lineHeight: 1.6,
    marginBottom: 24
  },

  layout: {
    display: "grid",
    gridTemplateColumns: "minmax(0, 1.1fr) minmax(320px, 0.9fr)",
    gap: 20
  },

  formCard: {
    background: "rgba(255,255,255,0.035)",
    border: "1px solid rgba(255,255,255,0.06)",
    borderRadius: 24,
    padding: 22
  },

  previewCard: {
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
    minHeight: 110,
    borderRadius: 14,
    border: "1px solid rgba(255,255,255,0.08)",
    background: "rgba(11,13,22,0.9)",
    color: "white",
    padding: "12px 14px",
    outline: "none",
    resize: "vertical",
    fontFamily: "inherit"
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
  }
};
