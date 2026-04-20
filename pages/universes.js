import Link from "next/link";
import { useState } from "react";

export default function UniversesPage() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

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
              <path d="M15 6L9 12L15 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
        </div>

        <div style={styles.sidebarSection}>
          <Link href="/" style={styles.sidebarItem}><span style={styles.sidebarIconWrap}><HomeIcon /></span>{!sidebarCollapsed && <span>Home</span>}</Link>
          <Link href="/story" style={styles.sidebarItem}><span style={styles.sidebarIconWrap}><StoryIcon /></span>{!sidebarCollapsed && <span>Story</span>}</Link>
          <Link href="/characters" style={styles.sidebarItem}><span style={styles.sidebarIconWrap}><CharacterIcon /></span>{!sidebarCollapsed && <span>Characters</span>}</Link>
          <Link href="/universes" style={styles.sidebarItemActive}><span style={styles.sidebarIconWrap}><UniverseIcon /></span>{!sidebarCollapsed && <span>Universes</span>}</Link>
        </div>
      </aside>

      <main style={styles.main}>
        <div style={styles.topBarTitle}>Universe Builder</div>
        <div style={styles.topBarSub}>This is the right route now. Build this next after the character page.</div>

        <div style={styles.placeholderCard}>
          <div style={styles.eyebrow}>Next Build</div>
          <h1 style={styles.heading}>Universe creation has its own page now.</h1>
          <p style={styles.copy}>
            Right now this is a clean placeholder so your routing is fixed and the product architecture makes sense.
            Next move is giving this page fields for world rules, tone, factions, power systems, lore, and reusable setting memory.
          </p>
        </div>
      </main>
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

const styles = {
  page: { minHeight: "100vh", display: "flex", background: "radial-gradient(circle at top, rgba(82, 99, 255, 0.18), transparent 28%), #05070d", color: "#ffffff", fontFamily: 'Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif' },
  sidebar: { background: "rgba(10, 12, 20, 0.9)", borderRight: "1px solid rgba(255,255,255,0.06)", padding: "18px 14px", display: "flex", flexDirection: "column", transition: "width 0.25s ease", position: "sticky", top: 0, height: "100vh", backdropFilter: "blur(18px)" },
  sidebarTop: { display: "flex", flexDirection: "column", gap: 18 },
  sidebarBrandRow: { display: "flex", alignItems: "center", gap: 12, padding: "4px 6px" },
  sidebarLogo: { width: 38, height: 38, borderRadius: 12, display: "flex", alignItems: "center", justifyContent: "center", background: "linear-gradient(135deg, rgba(120,140,255,0.28), rgba(120,140,255,0.08))", border: "1px solid rgba(255,255,255,0.08)", fontWeight: 700, fontSize: 16 },
  sidebarBrandText: { fontSize: 18, letterSpacing: 3, fontWeight: 600, opacity: 0.95 },
  collapseButton: { height: 42, borderRadius: 12, border: "1px solid rgba(255,255,255,0.08)", background: "rgba(255,255,255,0.03)", color: "white", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" },
  sidebarSection: { display: "flex", flexDirection: "column", gap: 10, marginTop: 20 },
  sidebarItem: { display: "flex", alignItems: "center", gap: 12, padding: "12px 14px", borderRadius: 14, color: "rgba(255,255,255,0.72)", textDecoration: "none", background: "transparent", border: "1px solid transparent" },
  sidebarItemActive: { display: "flex", alignItems: "center", gap: 12, padding: "12px 14px", borderRadius: 14, color: "white", textDecoration: "none", background: "linear-gradient(135deg, rgba(96,115,255,0.22), rgba(96,115,255,0.08))", border: "1px solid rgba(135,145,255,0.18)" },
  sidebarIconWrap: { display: "flex", alignItems: "center", justifyContent: "center", minWidth: 18 },
  main: { flex: 1, padding: "28px" },
  topBarTitle: { fontSize: 24, fontWeight: 700, letterSpacing: "-0.02em" },
  topBarSub: { marginTop: 6, color: "rgba(255,255,255,0.52)", fontSize: 14 },
  placeholderCard: { marginTop: 24, maxWidth: 760, borderRadius: 24, padding: 24, background: "rgba(255,255,255,0.035)", border: "1px solid rgba(255,255,255,0.06)" },
  eyebrow: { fontSize: 12, textTransform: "uppercase", letterSpacing: "0.10em", color: "rgba(255,255,255,0.42)", marginBottom: 12 },
  heading: { margin: 0, fontSize: 40, lineHeight: 1.04, letterSpacing: "-0.04em" },
  copy: { marginTop: 16, color: "rgba(255,255,255,0.68)", fontSize: 16, lineHeight: 1.7 }
};
