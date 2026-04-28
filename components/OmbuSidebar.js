import Link from "next/link";
import { useRouter } from "next/router";

export default function OmbuSidebar({ actionSlot = null }) {
  const router = useRouter();

  const navItems = [
    {
      label: "Discover",
      href: "/",
      icon: <DiscoverIcon />
    },
    {
      label: "Story Engine",
      href: "/story",
      icon: <StoryIcon />
    },
    {
      label: "Character Hub",
      href: "/characters",
      icon: <CharacterIcon />
    },
    {
      label: "World Engine",
      href: "/universes",
      icon: <WorldIcon />
    }
  ];

  const isActive = (href) => {
    if (href === "/") return router.pathname === "/";
    return router.pathname.startsWith(href);
  };

  return (
    <>
      <aside className="ombuSidebar">
        <div>
          <Link href="/" className="ombuBrand">
            <span className="ombuBrandMark">O</span>
            <span className="ombuBrandText">OMBU</span>
          </Link>

          <nav className="ombuNav">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`ombuNavItem ${isActive(item.href) ? "active" : ""}`}
              >
                <span className="ombuNavIcon">{item.icon}</span>
                <span>{item.label}</span>
              </Link>
            ))}
          </nav>
        </div>

        <div className="ombuSidebarBottom">
          {actionSlot}

          <div className="ombuSystemCard">
            <div className="ombuSystemLabel">System</div>
            <div className="ombuSystemText">Local build</div>
          </div>
        </div>
      </aside>

      <style jsx global>{`
        .ombuSidebar {
          width: 250px;
          min-height: 100vh;
          padding: 22px;
          border-right: 1px solid rgba(255, 255, 255, 0.075);
          background:
            linear-gradient(180deg, rgba(9, 11, 20, 0.92), rgba(7, 8, 15, 0.96)),
            rgba(8, 10, 18, 0.9);
          backdrop-filter: blur(20px);
          position: sticky;
          top: 0;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          flex-shrink: 0;
          z-index: 20;
        }

        .ombuBrand {
          display: flex;
          align-items: center;
          gap: 12px;
          color: white;
          text-decoration: none;
          margin-bottom: 34px;
        }

        .ombuBrandMark {
          width: 38px;
          height: 38px;
          border-radius: 14px;
          display: grid;
          place-items: center;
          font-weight: 850;
          background:
            radial-gradient(circle at 30% 25%, rgba(255, 255, 255, 0.22), transparent 32%),
            linear-gradient(135deg, rgba(111, 130, 255, 0.34), rgba(111, 130, 255, 0.1));
          border: 1px solid rgba(255, 255, 255, 0.12);
          box-shadow: 0 18px 45px rgba(85, 100, 255, 0.2);
        }

        .ombuBrandText {
          font-size: 15px;
          font-weight: 850;
          letter-spacing: 0.3em;
        }

        .ombuNav {
          display: flex;
          flex-direction: column;
          gap: 9px;
        }

        .ombuNavItem {
          position: relative;
          display: flex;
          align-items: center;
          gap: 12px;
          min-height: 46px;
          padding: 12px 14px;
          border-radius: 15px;
          color: rgba(255, 255, 255, 0.64);
          text-decoration: none;
          border: 1px solid transparent;
          background: transparent;
          transition:
            transform 220ms cubic-bezier(0.22, 1, 0.36, 1),
            background 220ms cubic-bezier(0.22, 1, 0.36, 1),
            border-color 220ms cubic-bezier(0.22, 1, 0.36, 1),
            color 220ms cubic-bezier(0.22, 1, 0.36, 1);
          overflow: hidden;
        }

        .ombuNavItem::before {
          content: "";
          position: absolute;
          inset: 0;
          background: radial-gradient(circle at left, rgba(111, 130, 255, 0.18), transparent 58%);
          opacity: 0;
          transition: opacity 220ms ease;
          pointer-events: none;
        }

        .ombuNavItem:hover {
          color: white;
          transform: translateX(3px);
          background: rgba(255, 255, 255, 0.045);
          border-color: rgba(255, 255, 255, 0.08);
        }

        .ombuNavItem:hover::before {
          opacity: 1;
        }

        .ombuNavItem.active {
          color: white;
          background:
            linear-gradient(135deg, rgba(101, 116, 255, 0.24), rgba(155, 124, 255, 0.1));
          border-color: rgba(145, 155, 255, 0.24);
          box-shadow: 0 14px 34px rgba(75, 92, 255, 0.14);
        }

        .ombuNavItem.active::after {
          content: "";
          position: absolute;
          left: 0;
          top: 12px;
          bottom: 12px;
          width: 3px;
          border-radius: 999px;
          background: linear-gradient(180deg, #7d8cff, #b08cff);
          box-shadow: 0 0 18px rgba(125, 140, 255, 0.8);
        }

        .ombuNavIcon {
          display: grid;
          place-items: center;
          width: 20px;
          height: 20px;
          color: currentColor;
          flex-shrink: 0;
        }

        .ombuSidebarBottom {
          display: flex;
          flex-direction: column;
          gap: 12px;
          margin-top: 28px;
        }

        .ombuSystemCard {
          padding: 14px;
          border-radius: 18px;
          background: rgba(255, 255, 255, 0.035);
          border: 1px solid rgba(255, 255, 255, 0.07);
        }

        .ombuSystemLabel {
          font-size: 11px;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          color: rgba(255, 255, 255, 0.38);
          margin-bottom: 6px;
        }

        .ombuSystemText {
          font-size: 13px;
          color: rgba(255, 255, 255, 0.68);
        }

        .ombuSidebarAction {
          width: 100%;
          min-height: 44px;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          border: none;
          border-radius: 15px;
          color: white;
          cursor: pointer;
          font-weight: 800;
          background: linear-gradient(135deg, #6574ff, #927dff);
          box-shadow: 0 18px 42px rgba(101, 116, 255, 0.26);
          transition: transform 220ms cubic-bezier(0.22, 1, 0.36, 1);
        }

        .ombuSidebarAction:hover {
          transform: translateY(-2px);
        }

        @media (max-width: 900px) {
          .ombuSidebar {
            width: 100%;
            min-height: auto;
            position: relative;
          }

          .ombuNav {
            flex-direction: row;
            flex-wrap: wrap;
          }

          .ombuNavItem {
            flex: 1;
            min-width: 150px;
          }

          .ombuSidebarBottom {
            display: none;
          }
        }
      `}</style>
    </>
  );
}

function DiscoverIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
      <circle cx="12" cy="12" r="8" stroke="currentColor" strokeWidth="2" />
      <path d="M15 9L13.3 13.3L9 15L10.7 10.7L15 9Z" stroke="currentColor" strokeWidth="2" />
    </svg>
  );
}

function StoryIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
      <path d="M6 4H18A2 2 0 0 1 20 6V18A2 2 0 0 1 18 20H6A2 2 0 0 1 4 18V6A2 2 0 0 1 6 4Z" stroke="currentColor" strokeWidth="2" />
      <path d="M8 8H16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      <path d="M8 12H16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      <path d="M8 16H13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

function CharacterIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
      <path d="M20 21C20 17.7 16.4 15 12 15C7.6 15 4 17.7 4 21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      <circle cx="12" cy="8" r="4" stroke="currentColor" strokeWidth="2" />
    </svg>
  );
}

function WorldIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
      <circle cx="12" cy="12" r="8" stroke="currentColor" strokeWidth="2" />
      <path d="M4 12H20" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      <path d="M12 4C14.4 6.6 16 9.2 16 12C16 14.8 14.4 17.4 12 20" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      <path d="M12 4C9.6 6.6 8 9.2 8 12C8 14.8 9.6 17.4 12 20" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}
