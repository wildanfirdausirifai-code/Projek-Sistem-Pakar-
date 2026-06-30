"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";

const menus = [
  { name: "Dashboard", path: "/dashboard", icon: "🏠", label: "Beranda" },
  { name: "Konsultasi", path: "/konsultasi", icon: "🧠", label: "Mulai Test" },
  { name: "Riwayat", path: "/riwayat", icon: "📊", label: "Histori" },
  { name: "Hasil", path: "/hasil", icon: "📄", label: "Laporan" },
];

type User = {
  name: string;
  email: string;
};

const sidebarStyles = `
  @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');

  .sb-aside {
    font-family: 'Plus Jakarta Sans', sans-serif;
    width: 256px;
    min-height: 100vh;
    background: #1a2520;
    display: flex;
    flex-direction: column;
    padding: 0;
    position: relative;
    overflow: hidden;
    box-shadow: 4px 0 24px rgba(0,0,0,0.18);
  }

  .sb-aside::before {
    content: '';
    position: absolute;
    top: -80px; right: -60px;
    width: 200px; height: 200px;
    background: radial-gradient(circle, rgba(61,140,122,0.18), transparent 65%);
    border-radius: 50%;
    pointer-events: none;
  }

  .sb-aside::after {
    content: '';
    position: absolute;
    bottom: 60px; left: -60px;
    width: 160px; height: 160px;
    background: radial-gradient(circle, rgba(217,107,69,0.12), transparent 65%);
    border-radius: 50%;
    pointer-events: none;
  }

  .sb-brand {
    padding: 1.75rem 1.5rem 1.25rem;
    border-bottom: 1px solid rgba(255,255,255,0.06);
    position: relative;
    z-index: 1;
  }

  .sb-brand-icon {
    width: 42px; height: 42px;
    background: linear-gradient(135deg, #3d8c7a, #2d6b5c);
    border-radius: 12px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 1.3rem;
    margin-bottom: 0.75rem;
    box-shadow: 0 4px 12px rgba(61,140,122,0.35);
  }

  .sb-brand-name {
    font-size: 1.1rem;
    font-weight: 800;
    color: #f0ebe3;
    line-height: 1.2;
    letter-spacing: -0.01em;
  }

  .sb-brand-sub {
    font-size: 0.68rem;
    font-weight: 500;
    color: #4a6358;
    letter-spacing: 0.06em;
    text-transform: uppercase;
    margin-top: 2px;
  }

  .sb-nav {
    flex: 1;
    padding: 1.25rem 1rem;
    display: flex;
    flex-direction: column;
    gap: 4px;
    position: relative;
    z-index: 1;
  }

  .sb-nav-label {
    font-size: 0.62rem;
    font-weight: 700;
    letter-spacing: 0.1em;
    text-transform: uppercase;
    color: #3a5248;
    padding: 0 0.5rem;
    margin-bottom: 0.4rem;
    margin-top: 0.25rem;
  }

  .sb-link {
    display: block;
    text-decoration: none;
  }

  .sb-item {
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 0.7rem 1rem;
    border-radius: 12px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
    transition: background 0.2s;
  }

  .sb-item-default { background: transparent; }
  .sb-item-default:hover { background: rgba(255,255,255,0.05); }

  .sb-item-active {
    background: linear-gradient(135deg, #3d8c7a, #2ecc9e);
    box-shadow: 0 4px 16px rgba(61,140,122,0.40);
  }

  .sb-item-active::before {
    content: '';
    position: absolute;
    inset: 0;
    background: linear-gradient(135deg, rgba(255,255,255,0.08), transparent);
    border-radius: 12px;
  }

  .sb-icon-wrap {
    width: 34px; height: 34px;
    border-radius: 9px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 1rem;
    flex-shrink: 0;
    transition: background 0.2s;
  }

  .sb-icon-default { background: rgba(255,255,255,0.05); }
  .sb-icon-active  { background: rgba(255,255,255,0.20); }

  .sb-item-text {
    display: flex;
    flex-direction: column;
    gap: 1px;
    min-width: 0;
  }

  .sb-item-name {
    font-size: 0.875rem;
    font-weight: 700;
    line-height: 1.2;
    transition: color 0.2s;
  }

  .sb-name-default { color: #7a9e90; }
  .sb-name-active  { color: #ffffff; }

  .sb-item-sublabel {
    font-size: 0.65rem;
    font-weight: 500;
    letter-spacing: 0.03em;
    transition: color 0.2s;
  }

  .sb-sub-default { color: #3a5248; }
  .sb-sub-active  { color: rgba(255,255,255,0.65); }

  .sb-active-dot {
    width: 6px; height: 6px;
    background: #ffffff;
    border-radius: 50%;
    margin-left: auto;
    flex-shrink: 0;
    opacity: 0.7;
  }

  .sb-bottom {
    padding: 1rem;
    border-top: 1px solid rgba(255,255,255,0.06);
    position: relative;
    z-index: 1;
  }

  .sb-user {
    display: flex;
    align-items: center;
    gap: 10px;
    padding: 0.65rem 0.75rem;
    border-radius: 12px;
    background: rgba(255,255,255,0.04);
    border: 1px solid rgba(255,255,255,0.06);
    transition: background 0.2s;
    cursor: pointer;
    width: 100%;
    text-align: left;
  }

  .sb-user:hover { background: rgba(255,255,255,0.07); }

  .sb-avatar {
    width: 32px; height: 32px;
    background: linear-gradient(135deg, #d96b45, #e8a030);
    border-radius: 9px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 0.85rem;
    font-weight: 800;
    color: white;
    flex-shrink: 0;
  }

  .sb-user-name {
    font-size: 0.78rem;
    font-weight: 700;
    color: #8aab9c;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .sb-user-role {
    font-size: 0.62rem;
    color: #3a5248;
    font-weight: 500;
  }

  .sb-version {
    font-size: 0.6rem;
    font-weight: 600;
    color: #2e4a3e;
    text-align: center;
    padding: 0.5rem 0 0;
    letter-spacing: 0.06em;
    text-transform: uppercase;
  }

  /* POPUP LOGOUT */
  .sb-popup {
    background: #1e2e28;
    border: 1px solid rgba(255,255,255,0.08);
    border-radius: 12px;
    overflow: hidden;
    margin-bottom: 8px;
  }

  .sb-popup-info {
    padding: 10px 14px;
    border-bottom: 1px solid rgba(255,255,255,0.06);
  }

  .sb-popup-name {
    font-size: 0.78rem;
    font-weight: 700;
    color: #8aab9c;
  }

  .sb-popup-email {
    font-size: 0.65rem;
    color: #3a5248;
    margin-top: 1px;
  }

  .sb-logout-btn {
    width: 100%;
    padding: 10px 14px;
    background: transparent;
    border: none;
    cursor: pointer;
    display: flex;
    align-items: center;
    gap: 8px;
    font-family: 'Plus Jakarta Sans', sans-serif;
    font-size: 0.8rem;
    font-weight: 600;
    color: #e87a6a;
    transition: background 0.15s;
    text-align: left;
  }

  .sb-logout-btn:hover { background: rgba(232,122,106,0.1); }

  .sb-chevron {
    margin-left: auto;
    color: #3a5248;
    transition: transform 0.15s;
    flex-shrink: 0;
  }

  .sb-skeleton {
    background: rgba(255,255,255,0.06);
    border-radius: 4px;
    animation: sb-pulse 1.5s ease-in-out infinite;
  }

  @keyframes sb-pulse {
    0%, 100% { opacity: 0.5; }
    50% { opacity: 1; }
  }
`;

export default function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const [showProfile, setShowProfile] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [loadingUser, setLoadingUser] = useState(true);

  // ✅ Fetch user dari /api/me (sama seperti ProfileMenu.tsx)
  useEffect(() => {
    const getUser = async () => {
      try {
        const res = await fetch("/api/me", {
          credentials: "include",
          cache: "no-store",
        });
        if (!res.ok) throw new Error("Gagal fetch user");
        const data: { user: User } = await res.json();
        setUser(data.user);
      } catch (err) {
        console.error("Sidebar: gagal ambil user:", err);
        setUser(null);
      } finally {
        setLoadingUser(false);
      }
    };
    void getUser();
  }, []);

  const initial = user?.name?.charAt(0)?.toUpperCase() ?? "U";

  async function handleLogout() {
    await fetch("/api/logout", { method: "POST" });
    router.push("/login");
  }

  return (
    <>
      <style>{sidebarStyles}</style>
      <aside className="sb-aside">

        {/* BRAND */}
        <div className="sb-brand">
          <div className="sb-brand-icon">🧠</div>
          <div className="sb-brand-name">Sistem Pakar</div>
          <div className="sb-brand-sub">Rekomendasi Jurusan</div>
        </div>

        {/* NAV */}
        <nav className="sb-nav">
          <div className="sb-nav-label">Menu Utama</div>

          {menus.map((menu) => {
            const isActive = pathname === menu.path;
            return (
              <Link key={menu.path} href={menu.path} className="sb-link">
                <motion.div
                  whileHover={{ x: isActive ? 0 : 3 }}
                  whileTap={{ scale: 0.97 }}
                  transition={{ duration: 0.15 }}
                  className={`sb-item ${isActive ? "sb-item-active" : "sb-item-default"}`}
                >
                  <div className={`sb-icon-wrap ${isActive ? "sb-icon-active" : "sb-icon-default"}`}>
                    {menu.icon}
                  </div>
                  <div className="sb-item-text">
                    <span className={`sb-item-name ${isActive ? "sb-name-active" : "sb-name-default"}`}>
                      {menu.name}
                    </span>
                    <span className={`sb-item-sublabel ${isActive ? "sb-sub-active" : "sb-sub-default"}`}>
                      {menu.label}
                    </span>
                  </div>
                  {isActive && <div className="sb-active-dot" />}
                </motion.div>
              </Link>
            );
          })}
        </nav>

        {/* BOTTOM */}
        <div className="sb-bottom">

          {/* POPUP PROFIL */}
          <AnimatePresence>
            {showProfile && (
              <motion.div
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 6 }}
                transition={{ duration: 0.15 }}
                className="sb-popup"
              >
                <div className="sb-popup-info">
                  {loadingUser ? (
                    <>
                      <div className="sb-skeleton" style={{ width: "80px", height: "12px", marginBottom: "4px" }} />
                      <div className="sb-skeleton" style={{ width: "120px", height: "10px" }} />
                    </>
                  ) : (
                    <>
                      <div className="sb-popup-name">{user?.name ?? "User"}</div>
                      <div className="sb-popup-email">{user?.email ?? "-"}</div>
                    </>
                  )}
                </div>
                <button onClick={handleLogout} className="sb-logout-btn">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
                    <polyline points="16 17 21 12 16 7"/>
                    <line x1="21" y1="12" x2="9" y2="12"/>
                  </svg>
                  Logout
                </button>
              </motion.div>
            )}
          </AnimatePresence>

          {/* TOMBOL PROFIL */}
          <button
            className="sb-user"
            onClick={() => setShowProfile(!showProfile)}
          >
            <div className="sb-avatar">
              {loadingUser ? "..." : initial}
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              {loadingUser ? (
                <>
                  <div className="sb-skeleton" style={{ width: "90px", height: "11px", marginBottom: "4px" }} />
                  <div className="sb-skeleton" style={{ width: "40px", height: "9px" }} />
                </>
              ) : (
                <>
                  <div className="sb-user-name">{user?.name ?? "User"}</div>
                  <div className="sb-user-role">User</div>
                </>
              )}
            </div>
            <svg
              className="sb-chevron"
              style={{ transform: showProfile ? "rotate(0deg)" : "rotate(180deg)" }}
              width="14" height="14" viewBox="0 0 24 24" fill="none"
              stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
            >
              <polyline points="18 15 12 9 6 15"/>
            </svg>
          </button>

          <div className="sb-version">v1.0.0 · Rule Based</div>
        </div>

      </aside>
    </>
  );
}