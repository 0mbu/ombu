import Head from "next/head";
import { useState } from "react";
import OmbuSidebar from "../components/OmbuSidebar";

export default function UniversesPage() {
  const [form, setForm] = useState({
    name: "",
    genre: "",
    tone: "",
    premise: "",
    rules: "",
    conflict: "",
    powerSystem: "",
    locations: "",
    factions: "",
    storyHooks: ""
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
        <title>World Engine | OMBU</title>
      </Head>

      <div className="page">
        <OmbuSidebar />

        <main className="main">
          <section className="hero">
            <div>
              <div className="eyebrow">Worldbuilding system</div>
              <h1>World Engine</h1>
              <p>
                Define the rules, tone, factions, power systems, and conflicts that shape
                your stories before they ever begin.
              </p>
            </div>
          </section>

          <section className="stats">
            <Stat label="Mode" value="Builder" />
            <Stat label="Storage" value="Draft" />
            <Stat label="Characters" value="Coming Soon" />
          </section>

          <section className="layout">
            <div className="formCard">
              <h2 className="sectionTitle">Universe blueprint</h2>

              <div className="formGrid">
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

                <TextField
                  className="wide"
                  label="Core premise"
                  value={form.premise}
                  onChange={(value) => updateField("premise", value)}
                  placeholder="What is this world at its core?"
                />

                <TextField
                  className="wide"
                  label="Rules"
                  value={form.rules}
                  onChange={(value) => updateField("rules", value)}
                  placeholder="What can and cannot happen in this world?"
                />

                <TextField
                  className="wide"
                  label="Power system / technology"
                  value={form.powerSystem}
                  onChange={(value) => updateField("powerSystem", value)}
                  placeholder="Magic, marks, chakra, tech, mutations, divine gifts..."
                />

                <TextField
                  className="wide"
                  label="Central conflict"
                  value={form.conflict}
                  onChange={(value) => updateField("conflict", value)}
                  placeholder="What tension drives this world?"
                />

                <TextField
                  className="wide"
                  label="Important locations"
                  value={form.locations}
                  onChange={(value) => updateField("locations", value)}
                  placeholder="Kingdoms, cities, districts, ruins, schools, planets..."
                />

                <TextField
                  className="wide"
                  label="Factions / groups"
                  value={form.factions}
                  onChange={(value) => updateField("factions", value)}
                  placeholder="Clans, companies, armies, guilds, governments..."
                />

                <TextField
                  className="wide"
                  label="Story hooks"
                  value={form.storyHooks}
                  onChange={(value) => updateField("storyHooks", value)}
                  placeholder="What kinds of stories should happen here?"
                />
              </div>
            </div>

            <aside className="previewCard">
              <h2 className="sectionTitle">Live world preview</h2>

              <div className="worldOrb">◎</div>
              <div className="previewName">{form.name || "Unnamed universe"}</div>
              <div className="previewSub">
                {form.genre || "No genre yet"} {form.tone ? `• ${form.tone}` : ""}
              </div>

              <PreviewBlock label="Premise" value={form.premise} />
              <PreviewBlock label="Rules" value={form.rules} />
              <PreviewBlock label="Power System" value={form.powerSystem} />
              <PreviewBlock label="Central Conflict" value={form.conflict} />
              <PreviewBlock label="Locations" value={form.locations} />
              <PreviewBlock label="Factions" value={form.factions} />
              <PreviewBlock label="Story Hooks" value={form.storyHooks} />
            </aside>
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

        .layout {
          display: grid;
          grid-template-columns: minmax(0, 1.2fr) minmax(340px, 0.8fr);
          gap: 18px;
          animation: fadeUp 650ms ease both;
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

        .formGrid {
          display: grid;
          grid-template-columns: repeat(3, minmax(0, 1fr));
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
        textarea {
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

        input:focus,
        textarea:focus {
          border-color: rgba(135,150,255,0.38);
          box-shadow: 0 0 0 4px rgba(95,111,255,0.11);
        }

        textarea {
          min-height: 108px;
          resize: vertical;
          line-height: 1.5;
        }

        .wide {
          grid-column: 1 / -1;
        }

        .worldOrb {
          width: 62px;
          height: 62px;
          border-radius: 22px;
          display: grid;
          place-items: center;
          font-size: 30px;
          margin-bottom: 16px;
          background:
            radial-gradient(circle at 30% 25%, rgba(255,255,255,0.18), transparent 36%),
            linear-gradient(135deg, rgba(111,130,255,0.26), rgba(155,124,255,0.1));
          border: 1px solid rgba(255,255,255,0.1);
          box-shadow: 0 18px 45px rgba(85, 100, 255, 0.16);
        }

        .previewName {
          font-size: 30px;
          font-weight: 850;
          letter-spacing: -0.05em;
          margin-bottom: 6px;
        }

        .previewSub {
          color: rgba(255,255,255,0.56);
          margin-bottom: 16px;
          line-height: 1.5;
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

        .previewText {
          color: rgba(255,255,255,0.62);
          line-height: 1.6;
          white-space: pre-wrap;
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

          .stats,
          .layout,
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

function Stat({ label, value }) {
  return (
    <div className="stat">
      <div className="statLabel">{label}</div>
      <div className="statValue">{value}</div>
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

function PreviewBlock({ label, value }) {
  return (
    <div className="previewBlock">
      <div className="previewLabel">{label}</div>
      <div className="previewText">{value || "—"}</div>
    </div>
  );
}
