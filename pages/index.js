import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";
import { useMemo, useState } from "react";

const heroStatements = [
  "Stories worth disappearing into.",
  "Build the kind of story you can’t stop thinking about.",
  "Where worlds begin to feel real.",
  "Give us a vibe. We’ll give it a pulse.",
  "Make fiction feel personal again.",
  "Start anywhere. Build something unforgettable.",
  "Stories that feel lived in.",
  "Start with a spark. Leave with a world."
];

const quickPrompts = [
  "Dark fantasy",
  "Enemies to lovers",
  "Post-apocalyptic",
  "Anime-style action"
];

export default function Home() {
  const router = useRouter();
  const [input, setInput] = useState("");
  const [isLeaving, setIsLeaving] = useState(false);

  const randomHeadline = useMemo(() => {
    return heroStatements[Math.floor(Math.random() * heroStatements.length)];
  }, []);

  const goToStoryWithPrompt = (promptText) => {
    const trimmed = (promptText || "").trim();
    if (!trimmed || isLeaving) return;

    if (typeof window !== "undefined") {
      sessionStorage.setItem("ombu_starter_prompt", trimmed);
      sessionStorage.setItem("ombu_route_transition", "1");
    }

    setIsLeaving(true);

    setTimeout(() => {
      router.push("/story");
    }, 180);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    goToStoryWithPrompt(input);
  };

  return (
    <>
      <Head>
        <title>OMBU</title>
        <meta
          name="description"
          content="AI storytelling, character creation, and worldbuilding."
        />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Lexend:wght@600;700;800&display=swap"
          rel="stylesheet"
        />
      </Head>

      <div
        style={{
          ...styles.page,
          ...(isLeaving ? styles.pageLeaving : {})
        }}
      >
        <div style={styles.backgroundGlowTop} />
        <div style={styles.backgroundGlowBottom} />

        <header style={styles.nav}>
          <Link href="/" style={styles.brandWrap}>
            <LogoMark />
            <div style={styles.logoText}>OMBU</div>
          </Link>

          <nav style={styles.navRight}>
            <div style={styles.navLinks}>
              <Link href="/story" style={styles.navLink}>
                Story
              </Link>
              <button
                type="button"
                onClick={() =>
                  goToStoryWithPrompt(
                    "Create a character with a distinct voice, appearance, and personality."
                  )
                }
                style={styles.navButton}
              >
                Characters
              </button>
              <button
                type="button"
                onClick={() =>
                  goToStoryWithPrompt(
                    "Build a fictional world with clear rules, tone, and lore."
                  )
                }
                style={styles.navButton}
              >
                Universes
              </button>
            </div>

            <Link href="/story" style={styles.loginButton}>
              Log in
            </Link>
          </nav>
        </header>

        <main style={styles.main}>
          <section style={styles.hero}>
            <div style={styles.heroInner}>
              <div style={styles.heroEyebrow}>
                AI storytelling, character creation, and worldbuilding
              </div>

              <h1 style={styles.title}>{randomHeadline}</h1>

              <p style={styles.subtitle}>
                Start with a scene, a character, or just a vibe. Ombu turns it into
                something cinematic, personal, and worth continuing.
              </p>

              <form onSubmit={handleSubmit} style={styles.inputShell}>
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Drop a character, a scene, or a vibe..."
                  style={styles.heroInput}
                />

                <button type="submit" style={styles.heroCta}>
                  Start Story
                </button>
              </form>

              <div style={styles.quickRow}>
                {quickPrompts.map((item) => (
                  <button
                    key={item}
                    type="button"
                    onClick={() => goToStoryWithPrompt(item)}
                    style={styles.quickChip}
                  >
                    {item}
                  </button>
                ))}
              </div>
            </div>
          </section>

          <section style={styles.cardsSection}>
            <div style={styles.sectionTop}>
              <div style={styles.sectionEyebrow}>Built to keep people coming back</div>
              <h2 style={styles.sectionTitle}>More than a prompt box</h2>
            </div>

            <div style={styles.cardGrid}>
              <button
                type="button"
                onClick={() => goToStoryWithPrompt("Start a story.")}
                style={{ ...styles.card, ...styles.cardInteractive }}
              >
                <div style={styles.cardIcon}>✦</div>
                <h3 style={styles.cardTitle}>Start a Story</h3>
                <p style={styles.cardText}>
                  Write openings, continue scenes, redirect the plot, and keep momentum
                  without losing the feel.
                </p>
                <div style={styles.cardLink}>Open workspace</div>
              </button>

              <button
                type="button"
                onClick={() =>
                  goToStoryWithPrompt(
                    "Create a character with depth, voice, identity, and strong personality."
                  )
                }
                style={{ ...styles.card, ...styles.cardInteractive }}
              >
                <div style={styles.cardIcon}>◉</div>
                <h3 style={styles.cardTitle}>Create Characters</h3>
                <p style={styles.cardText}>
                  Reusable characters with voice, identity, and depth that can carry
                  across stories.
                </p>
                <div style={styles.cardLink}>Start from a character</div>
              </button>

              <button
                type="button"
                onClick={() =>
                  goToStoryWithPrompt(
                    "Build a world with tone, lore, rules, and a clear identity."
                  )
                }
                style={{ ...styles.card, ...styles.cardInteractive }}
              >
                <div style={styles.cardIcon}>◎</div>
                <h3 style={styles.cardTitle}>Build Worlds</h3>
                <p style={styles.cardText}>
                  Universes with rules, lore, tone, and memory so stories feel grounded
                  instead of random.
                </p>
                <div style={styles.cardLink}>Start from a world</div>
              </button>
            </div>
          </section>
        </main>
      </div>
    </>
  );
}

function LogoMark() {
  return (
    <div style={styles.logoMarkWrap} aria-hidden="true">
      <svg
        width="34"
        height="34"
        viewBox="0 0 34 34"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <rect
          x="1"
          y="1"
          width="32"
          height="32"
          rx="11"
          fill="url(#ombuBg)"
          stroke="rgba(255,255,255,0.10)"
        />
        <path
          d="M10 21.2C10 16.3 13.2 12.8 17.8 12.8C20.4 12.8 22.5 13.8 24 15.8"
          stroke="url(#ombuStroke)"
          strokeWidth="2.2"
          strokeLinecap="round"
        />
        <path
          d="M24 12.6V18.1H18.5"
          stroke="url(#ombuStroke)"
          strokeWidth="2.2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M24 18.1C22.8 20.9 20.3 22.8 17.1 22.8C14.3 22.8 12 21.5 10.7 19.4"
          stroke="url(#ombuStrokeSoft)"
          strokeWidth="2"
          strokeLinecap="round"
        />
        <defs>
          <linearGradient id="ombuBg" x1="4" y1="4" x2="30" y2="30" gradientUnits="userSpaceOnUse">
            <stop stopColor="rgba(96,115,255,0.26)" />
            <stop offset="1" stopColor="rgba(96,115,255,0.08)" />
          </linearGradient>
          <linearGradient id="ombuStroke" x1="10" y1="12.8" x2="24" y2="18.1" gradientUnits="userSpaceOnUse">
            <stop stopColor="#EAF0FF" />
            <stop offset="1" stopColor="#8EA0FF" />
          </linearGradient>
          <linearGradient id="ombuStrokeSoft" x1="10.7" y1="19.4" x2="24" y2="22.8" gradientUnits="userSpaceOnUse">
            <stop stopColor="rgba(255,255,255,0.50)" />
            <stop offset="1" stopColor="rgba(142,160,255,0.95)" />
          </linearGradient>
        </defs>
      </svg>
    </div>
  );
}

const styles = {
  page: {
    minHeight: "100vh",
    background: "#06070d",
    color: "white",
    fontFamily:
      'Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
    position: "relative",
    overflow: "hidden",
    display: "flex",
    flexDirection: "column",
    transition: "opacity 0.18s ease, transform 0.18s ease, filter 0.18s ease"
  },

  pageLeaving: {
    opacity: 0,
    transform: "translateY(-16px) scale(0.99)",
    filter: "blur(4px)"
  },

  backgroundGlowTop: {
    position: "absolute",
    top: "-180px",
    left: "50%",
    transform: "translateX(-50%)",
    width: "900px",
    height: "900px",
    background:
      "radial-gradient(circle, rgba(88,108,255,0.16) 0%, rgba(88,108,255,0.08) 22%, rgba(88,108,255,0.03) 38%, transparent 65%)",
    pointerEvents: "none",
    zIndex: 0
  },

  backgroundGlowBottom: {
    position: "absolute",
    bottom: "-300px",
    right: "-220px",
    width: "700px",
    height: "700px",
    background:
      "radial-gradient(circle, rgba(88,108,255,0.10) 0%, rgba(88,108,255,0.04) 30%, transparent 70%)",
    pointerEvents: "none",
    zIndex: 0
  },

  nav: {
    position: "relative",
    zIndex: 2,
    width: "100%",
    maxWidth: 1280,
    margin: "0 auto",
    padding: "22px 28px",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between"
  },

  brandWrap: {
    display: "flex",
    alignItems: "center",
    gap: 12,
    textDecoration: "none",
    color: "white"
  },

  logoMarkWrap: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center"
  },

  logoText: {
    fontSize: 18,
    fontWeight: 700,
    letterSpacing: "0.28em"
  },

  navRight: {
    display: "flex",
    alignItems: "center",
    gap: 18
  },

  navLinks: {
    display: "flex",
    alignItems: "center",
    gap: 18
  },

  navLink: {
    color: "rgba(255,255,255,0.82)",
    textDecoration: "none",
    fontSize: 15,
    fontWeight: 500
  },

  navButton: {
    color: "rgba(255,255,255,0.82)",
    fontSize: 15,
    fontWeight: 500,
    background: "transparent",
    border: "none",
    cursor: "pointer",
    padding: 0
  },

  loginButton: {
    height: 40,
    padding: "0 16px",
    borderRadius: 12,
    border: "1px solid rgba(255,255,255,0.09)",
    background: "rgba(255,255,255,0.04)",
    color: "white",
    fontSize: 14,
    fontWeight: 600,
    cursor: "pointer",
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    textDecoration: "none"
  },

  main: {
    position: "relative",
    zIndex: 1,
    width: "100%",
    maxWidth: 1280,
    margin: "0 auto",
    padding: "0 28px 44px",
    flex: 1,
    display: "flex",
    flexDirection: "column",
    justifyContent: "center"
  },

  hero: {
    minHeight: "calc(100vh - 96px)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    textAlign: "center",
    padding: "12px 0 30px"
  },

  heroInner: {
    width: "100%",
    maxWidth: 920,
    margin: "0 auto"
  },

  heroEyebrow: {
    fontSize: 12,
    letterSpacing: "0.12em",
    textTransform: "uppercase",
    color: "rgba(255,255,255,0.46)",
    marginBottom: 16
  },

  title: {
    fontSize: "clamp(3rem, 7vw, 5.7rem)",
    lineHeight: 0.96,
    letterSpacing: "-0.06em",
    fontWeight: 800,
    margin: 0,
    marginBottom: 22,
    fontFamily: '"Lexend", Inter, ui-sans-serif, system-ui, sans-serif'
  },

  subtitle: {
    maxWidth: 700,
    margin: "0 auto 30px",
    fontSize: "clamp(1rem, 1.8vw, 1.16rem)",
    lineHeight: 1.65,
    color: "rgba(255,255,255,0.62)"
  },

  inputShell: {
    width: "100%",
    maxWidth: 860,
    margin: "0 auto",
    minHeight: 84,
    borderRadius: 24,
    padding: 12,
    display: "flex",
    alignItems: "center",
    gap: 12,
    background: "rgba(16,18,28,0.92)",
    border: "1px solid rgba(255,255,255,0.08)",
    boxShadow:
      "0 28px 80px rgba(0,0,0,0.38), 0 10px 40px rgba(72,91,255,0.12)"
  },

  heroInput: {
    flex: 1,
    minWidth: 0,
    height: 58,
    border: "none",
    outline: "none",
    background: "transparent",
    color: "white",
    fontSize: 16,
    padding: "0 14px"
  },

  heroCta: {
    flexShrink: 0,
    height: 58,
    padding: "0 22px",
    borderRadius: 18,
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    textDecoration: "none",
    color: "white",
    fontWeight: 700,
    fontSize: 15,
    border: "none",
    cursor: "pointer",
    background: "linear-gradient(135deg, #5f6fff, #7b87ff)",
    boxShadow: "0 16px 34px rgba(95,111,255,0.38)"
  },

  quickRow: {
    marginTop: 18,
    display: "flex",
    justifyContent: "center",
    flexWrap: "wrap",
    gap: 10
  },

  quickChip: {
    padding: "9px 12px",
    borderRadius: 999,
    background: "rgba(255,255,255,0.04)",
    border: "1px solid rgba(255,255,255,0.06)",
    color: "rgba(255,255,255,0.70)",
    fontSize: 13,
    fontWeight: 500,
    cursor: "pointer"
  },

  cardsSection: {
    width: "100%",
    maxWidth: 1160,
    margin: "0 auto",
    paddingBottom: 24
  },

  sectionTop: {
    textAlign: "center",
    marginBottom: 28
  },

  sectionEyebrow: {
    fontSize: 12,
    letterSpacing: "0.10em",
    textTransform: "uppercase",
    color: "rgba(255,255,255,0.42)",
    marginBottom: 10
  },

  sectionTitle: {
    margin: 0,
    fontSize: "clamp(1.9rem, 3vw, 2.8rem)",
    lineHeight: 1.04,
    letterSpacing: "-0.04em"
  },

  cardGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(3, minmax(0, 1fr))",
    gap: 18
  },

  card: {
    minHeight: 240,
    borderRadius: 24,
    padding: 24,
    background: "rgba(255,255,255,0.035)",
    border: "1px solid rgba(255,255,255,0.06)",
    boxShadow: "inset 0 1px 0 rgba(255,255,255,0.03)",
    display: "flex",
    flexDirection: "column",
    textDecoration: "none",
    textAlign: "left"
  },

  cardInteractive: {
    cursor: "pointer"
  },

  cardIcon: {
    width: 42,
    height: 42,
    borderRadius: 14,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    background: "linear-gradient(135deg, rgba(95,111,255,0.22), rgba(95,111,255,0.10))",
    border: "1px solid rgba(255,255,255,0.07)",
    color: "white",
    fontSize: 16,
    marginBottom: 18
  },

  cardTitle: {
    margin: 0,
    marginBottom: 12,
    fontSize: 24,
    lineHeight: 1.05,
    color: "white"
  },

  cardText: {
    margin: 0,
    color: "rgba(255,255,255,0.58)",
    fontSize: 15,
    lineHeight: 1.65,
    flex: 1
  },

  cardLink: {
    marginTop: 20,
    color: "white",
    fontWeight: 600,
    fontSize: 14
  }
};
