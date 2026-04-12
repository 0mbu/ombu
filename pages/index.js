import Link from "next/link";

export default function Home() {
  return (
    <div style={styles.page}>
      <header style={styles.nav}>
        <div style={styles.logo}>OMBU</div>

        <nav style={styles.navLinks}>
          <Link href="/story" style={styles.navLink}>Story</Link>
          <span style={styles.navLinkMuted}>Characters</span>
          <span style={styles.navLinkMuted}>Universes</span>
        </nav>
      </header>

      <main style={styles.main}>
        <section style={styles.hero}>
          <div style={styles.eyebrow}>AI-Powered Creative Platform</div>

          <h1 style={styles.title}>
            Build stories, shape characters, and create worlds that feel like yours.
          </h1>

          <p style={styles.subtitle}>
            Ombu is more than a story generator. It’s a creative platform designed
            for immersive storytelling, character creation, and world building.
          </p>

          <div style={styles.heroButtons}>
            <Link href="/story" style={styles.primaryButton}>
              Start Creating
            </Link>

            <a href="#features" style={styles.secondaryButton}>
              Explore Features
            </a>
          </div>
        </section>

        <section id="features" style={styles.section}>
          <div style={styles.sectionHeader}>
            <div style={styles.sectionEyebrow}>Three Core Pillars</div>
            <h2 style={styles.sectionTitle}>
              A platform, not just a prompt box
            </h2>
            <p style={styles.sectionText}>
              Ombu is built around systems that make storytelling deeper,
              more personal, and worth returning to.
            </p>
          </div>

          <div style={styles.cardGrid}>
            <div style={styles.card}>
              <div style={styles.cardLabel}>01</div>
              <h3 style={styles.cardTitle}>Story Sessions</h3>
              <p style={styles.cardText}>
                Continue, redirect, and build scenes naturally inside a clean,
                focused narrative workspace.
              </p>
              <Link href="/story" style={styles.cardLink}>
                Open Story Workspace
              </Link>
            </div>

            <div style={styles.card}>
              <div style={styles.cardLabel}>02</div>
              <h3 style={styles.cardTitle}>Character Creation</h3>
              <p style={styles.cardText}>
                Build reusable characters with personality, voice, and identity.
              </p>
              <div style={styles.cardSoon}>Coming Soon</div>
            </div>

            <div style={styles.card}>
              <div style={styles.cardLabel}>03</div>
              <h3 style={styles.cardTitle}>Universe Building</h3>
              <p style={styles.cardText}>
                Define worlds, rules, and lore to give stories real structure.
              </p>
              <div style={styles.cardSoon}>Coming Soon</div>
            </div>
          </div>
        </section>

        <section style={styles.bottomCta}>
          <h2 style={styles.bottomTitle}>
            Start with one idea. Build something bigger.
          </h2>
          <p style={styles.bottomText}>
            Your first story is one click away.
          </p>

          <Link href="/story" style={styles.primaryButton}>
            Start Now
          </Link>
        </section>
      </main>
    </div>
  );
}

const styles = {
  page: {
    minHeight: "100vh",
    background:
      "radial-gradient(circle at 50% 20%, rgba(100,120,255,0.08), transparent 40%), #0b0b0f",
    color: "white",
    fontFamily: "sans-serif"
  },

  nav: {
    display: "flex",
    justifyContent: "space-between",
    padding: "20px 40px",
    alignItems: "center"
  },

  logo: {
    fontSize: 18,
    letterSpacing: 4,
    opacity: 0.9
  },

  navLinks: {
    display: "flex",
    gap: 20
  },

  navLink: {
    color: "white",
    textDecoration: "none",
    opacity: 0.8
  },

  navLinkMuted: {
    opacity: 0.3
  },

  main: {
    maxWidth: 1100,
    margin: "0 auto",
    padding: "40px 20px"
  },

  hero: {
    textAlign: "center",
    marginTop: 40
  },

  eyebrow: {
    opacity: 0.5,
    fontSize: 12,
    marginBottom: 10
  },

  title: {
    fontSize: 40,
    lineHeight: 1.2,
    marginBottom: 20
  },

  subtitle: {
    opacity: 0.6,
    maxWidth: 600,
    margin: "0 auto 30px auto"
  },

  heroButtons: {
    display: "flex",
    justifyContent: "center",
    gap: 15
  },

  primaryButton: {
    background: "rgba(100,120,255,0.2)",
    padding: "12px 20px",
    borderRadius: 10,
    textDecoration: "none",
    color: "white"
  },

  secondaryButton: {
    opacity: 0.6,
    textDecoration: "none",
    color: "white"
  },

  section: {
    marginTop: 80
  },

  sectionHeader: {
    textAlign: "center",
    marginBottom: 40
  },

  sectionEyebrow: {
    opacity: 0.5,
    fontSize: 12
  },

  sectionTitle: {
    fontSize: 28,
    marginTop: 10
  },

  sectionText: {
    opacity: 0.6,
    maxWidth: 600,
    margin: "10px auto"
  },

  cardGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
    gap: 20
  },

  card: {
    background: "rgba(255,255,255,0.03)",
    padding: 20,
    borderRadius: 14
  },

  cardLabel: {
    opacity: 0.4,
    fontSize: 12
  },

  cardTitle: {
    marginTop: 10
  },

  cardText: {
    opacity: 0.6,
    marginTop: 10
  },

  cardLink: {
    display: "inline-block",
    marginTop: 15,
    color: "white",
    textDecoration: "none"
  },

  cardSoon: {
    marginTop: 15,
    opacity: 0.4
  },

  bottomCta: {
    textAlign: "center",
    marginTop: 100
  },

  bottomTitle: {
    fontSize: 28
  },

  bottomText: {
    opacity: 0.6,
    margin: "10px 0 20px"
  }
};
