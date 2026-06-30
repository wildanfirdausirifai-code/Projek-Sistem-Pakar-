"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  useEffect(() => {
    const savedEmail = localStorage.getItem("user_remember_email");
    const savedPassword = localStorage.getItem("user_remember_password");
    if (savedEmail && savedPassword) {
      setEmail(savedEmail);
      setPassword(savedPassword);
      setRememberMe(true);
    }
  }, []);

  const handleLogin = async (e?: React.FormEvent<HTMLFormElement> | React.KeyboardEvent) => {
    if (e) e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message);

      if (rememberMe) {
        localStorage.setItem("user_remember_email", email);
        localStorage.setItem("user_remember_password", password);
      } else {
        localStorage.removeItem("user_remember_email");
        localStorage.removeItem("user_remember_password");
      }

      router.push("/dashboard");
    } catch (err: any) {
      alert(err.message || "Login gagal");
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleLogin(e);
    }
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&family=Playfair+Display:wght@700&display=swap');

        .login-root {
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          background: #f0ebe3;
          padding: 24px;
          font-family: 'DM Sans', sans-serif;
          position: relative;
          overflow: hidden;
        }

        .blob-tl {
          position: fixed; top: -80px; left: -60px;
          width: 300px; height: 280px;
          background: #4a6741;
          border-radius: 60% 40% 70% 30% / 50% 60% 40% 50%;
          opacity: 0.85; z-index: 0;
        }
        .blob-tr {
          position: fixed; top: -40px; right: -40px;
          width: 200px; height: 200px;
          background: #4a6741;
          border-radius: 40% 60% 30% 70% / 50% 40% 60% 50%;
          opacity: 0.75; z-index: 0;
        }
        .blob-bl {
          position: fixed; bottom: -60px; left: -40px;
          width: 220px; height: 220px;
          background: #e8b4a0;
          border-radius: 50% 50% 40% 60% / 50% 60% 40% 50%;
          opacity: 0.7; z-index: 0;
        }
        .blob-br {
          position: fixed; bottom: -50px; right: -30px;
          width: 180px; height: 160px;
          background: #e8b4a0;
          border-radius: 50% 40% 60% 40% / 40% 50% 60% 50%;
          opacity: 0.6; z-index: 0;
        }

        .card {
          position: relative; z-index: 1;
          width: 100%; max-width: 900px;
          background: #ffffff;
          border-radius: 28px;
          box-shadow: 0 20px 60px rgba(0,0,0,0.12);
          overflow: hidden;
          display: grid;
          grid-template-columns: 1fr 1fr;
          min-height: 520px;
        }

        @media (max-width: 640px) {
          .card { grid-template-columns: 1fr; }
          .card-left { display: none !important; }
        }

        .card-left {
          background: #f7f3ee;
          display: flex; align-items: center; justify-content: center;
          padding: 40px 32px; position: relative;
        }

        .illustration-container {
          position: relative; width: 100%; max-width: 320px;
        }

        .illus-svg { width: 100%; height: auto; }

        .card-right {
          padding: 52px 48px;
          display: flex; flex-direction: column; justify-content: center;
        }

        .form-title {
          font-family: 'DM Sans', sans-serif;
          font-size: 2rem; font-weight: 700;
          color: #1a1a1a; margin: 0 0 4px 0; letter-spacing: -0.5px;
        }

        .form-subtitle {
          font-size: 0.925rem; color: #888; margin: 0 0 32px 0;
        }

        .input-group { margin-bottom: 16px; }

        .input-wrapper {
          position: relative; display: flex; align-items: center;
          border: 1.5px solid #e5e7eb; border-radius: 14px;
          background: #fff; transition: border-color 0.2s; overflow: hidden;
        }

        .input-wrapper:focus-within {
          border-color: #4a6741;
          box-shadow: 0 0 0 3px rgba(74, 103, 65, 0.1);
        }

        .input-icon {
          padding: 0 14px; color: #aaa; flex-shrink: 0;
          display: flex; align-items: center;
        }

        .input-field {
          flex: 1; border: none; outline: none;
          padding: 14px 12px 14px 0;
          font-size: 0.9rem; font-family: 'DM Sans', sans-serif;
          color: #1a1a1a; background: transparent;
        }

        .input-field::placeholder { color: #bbb; }

        .eye-btn {
          background: none; border: none; cursor: pointer;
          padding: 0 14px; color: #aaa;
          display: flex; align-items: center; transition: color 0.2s;
        }
        .eye-btn:hover { color: #4a6741; }

        .options-row {
          display: flex; align-items: center;
          margin-bottom: 24px; margin-top: 4px;
        }

        .remember-label {
          display: flex; align-items: center; gap: 8px;
          font-size: 0.875rem; color: #555;
          cursor: pointer; user-select: none;
        }

        .remember-check {
          width: 16px; height: 16px;
          accent-color: #4a6741; cursor: pointer;
        }

        .login-btn {
          width: 100%; padding: 15px; border-radius: 14px;
          background: #4a6741; color: white;
          font-family: 'DM Sans', sans-serif;
          font-size: 0.95rem; font-weight: 700;
          letter-spacing: 1.5px; text-transform: uppercase;
          border: none; cursor: pointer;
          transition: background 0.2s, transform 0.1s;
          margin-bottom: 24px;
        }
        .login-btn:hover:not(:disabled) { background: #3a5433; }
        .login-btn:active:not(:disabled) { transform: scale(0.99); }
        .login-btn:disabled { opacity: 0.7; cursor: not-allowed; }

        .divider {
          display: flex; align-items: center;
          gap: 12px; margin-bottom: 20px;
          color: #1a1a1a; font-size: 0.8rem;
        }
        .divider::before, .divider::after {
          content: ''; flex: 1; height: 1px; background: #e5e7eb;
        }

        .register-btn {
          width: 100%; padding: 14px; border-radius: 14px;
          background: transparent; border: 1.5px solid #c07a5e;
          color: #c07a5e; font-family: 'DM Sans', sans-serif;
          font-size: 0.9rem; font-weight: 600; cursor: pointer;
          display: flex; align-items: center; justify-content: center;
          gap: 8px; transition: background 0.2s, color 0.2s;
        }
        .register-btn:hover { background: #fdf0ec; }
      `}</style>

      <div className="login-root">
        <div className="blob-tl" />
        <div className="blob-tr" />
        <div className="blob-bl" />
        <div className="blob-br" />

        <div className="card">

          {/* LEFT */}
          <div className="card-left">
            <div className="illustration-container">
              <svg className="illus-svg" viewBox="0 0 340 300" fill="none" xmlns="http://www.w3.org/2000/svg">
                <ellipse cx="170" cy="200" rx="140" ry="80" fill="#ede8e0" />
                <rect x="100" y="140" width="140" height="110" rx="16" fill="#3d5c36" />
                <rect x="115" y="155" width="110" height="80" rx="10" fill="#4a6741" />
                <path d="M135 140 C135 100 205 100 205 140" stroke="#2d4428" strokeWidth="20" strokeLinecap="round" fill="none"/>
                <path d="M135 140 C135 100 205 100 205 140" stroke="#3d5c36" strokeWidth="14" strokeLinecap="round" fill="none"/>
                <circle cx="170" cy="190" r="12" fill="#2d4428"/>
                <rect x="166" y="195" width="8" height="14" rx="3" fill="#2d4428"/>
                <g transform="rotate(-20, 170, 80)">
                  <circle cx="135" cy="60" r="22" fill="#c07a5e" stroke="#a06040" strokeWidth="2"/>
                  <circle cx="135" cy="60" r="12" fill="#f0ebe3"/>
                  <rect x="153" y="56" width="60" height="8" rx="4" fill="#c07a5e"/>
                  <rect x="200" y="56" width="6" height="14" rx="2" fill="#c07a5e"/>
                  <rect x="210" y="56" width="6" height="10" rx="2" fill="#c07a5e"/>
                </g>
                <rect x="72" y="100" width="14" height="14" rx="3" fill="#c07a5e" opacity="0.5" transform="rotate(15,79,107)"/>
                <rect x="255" y="85" width="10" height="10" rx="2" fill="#4a6741" opacity="0.5" transform="rotate(-10,260,90)"/>
                <rect x="80" y="200" width="10" height="10" rx="2" fill="#4a6741" opacity="0.4" transform="rotate(20,85,205)"/>
                <circle cx="82" cy="150" r="4" fill="#c07a5e" opacity="0.6"/>
                <circle cx="268" cy="170" r="5" fill="#c07a5e" opacity="0.5"/>
                <circle cx="250" cy="120" r="3" fill="#4a6741" opacity="0.5"/>
                <g transform="translate(30, 155)">
                  <rect x="0" y="80" width="70" height="6" rx="3" fill="#c9b99a"/>
                  <rect x="5" y="86" width="6" height="20" rx="2" fill="#c9b99a"/>
                  <rect x="59" y="86" width="6" height="20" rx="2" fill="#c9b99a"/>
                  <rect x="18" y="65" width="34" height="20" rx="2" fill="#e5ddd0"/>
                  <rect x="20" y="67" width="30" height="16" rx="1" fill="#7ba87a"/>
                  <rect x="14" y="84" width="42" height="3" rx="1" fill="#d5c9b8"/>
                  <ellipse cx="35" cy="56" rx="11" ry="13" fill="#c07a5e"/>
                  <circle cx="35" cy="34" r="12" fill="#f5c9a8"/>
                  <path d="M23 30 Q35 18 47 30 Q45 22 35 20 Q25 22 23 30Z" fill="#3d2b1a"/>
                  <path d="M23 30 Q20 38 22 45 Q25 35 23 30Z" fill="#3d2b1a"/>
                  <path d="M26 58 Q18 70 22 78" stroke="#c07a5e" strokeWidth="7" strokeLinecap="round" fill="none"/>
                  <rect x="56" y="72" width="6" height="12" rx="2" fill="#8b7355"/>
                  <ellipse cx="59" cy="70" rx="8" ry="7" fill="#5a8a50"/>
                  <ellipse cx="53" cy="73" rx="6" ry="5" fill="#4a7a42"/>
                  <ellipse cx="65" cy="72" rx="6" ry="5" fill="#6a9a5a"/>
                </g>
                <g transform="translate(218, 185)">
                  <rect x="8" y="40" width="44" height="28" rx="3" fill="#e5ddd0"/>
                  <rect x="10" y="42" width="40" height="24" rx="2" fill="#7ba87a"/>
                  <rect x="4" y="67" width="52" height="4" rx="2" fill="#d5c9b8"/>
                  <ellipse cx="30" cy="32" rx="13" ry="14" fill="#5a7a50"/>
                  <circle cx="30" cy="12" r="12" fill="#d4a882"/>
                  <path d="M18 10 Q30 0 42 10 Q38 4 30 2 Q22 4 18 10Z" fill="#2a1f12"/>
                  <path d="M18 48 Q10 65 5 75" stroke="#3d5030" strokeWidth="10" strokeLinecap="round" fill="none"/>
                  <path d="M42 48 Q50 65 55 75" stroke="#3d5030" strokeWidth="10" strokeLinecap="round" fill="none"/>
                  <path d="M5 75 Q20 72 55 75" stroke="#3d5030" strokeWidth="8" strokeLinecap="round" fill="none"/>
                  <rect x="60" y="55" width="5" height="20" rx="2" fill="#8b7355"/>
                  <ellipse cx="62" cy="53" rx="9" ry="8" fill="#5a8a50"/>
                  <ellipse cx="56" cy="57" rx="6" ry="5" fill="#4a7a42"/>
                  <ellipse cx="68" cy="56" rx="6" ry="5" fill="#6a9a5a"/>
                </g>
              </svg>
            </div>
          </div>

          {/* RIGHT */}
          <div className="card-right">
            <h1 className="form-title">User Login</h1>
            <p className="form-subtitle">Selamat datang, harap isi email dan password terlebih dahulu sebelum konsultasi</p>

            <form onSubmit={handleLogin}>
              <div className="input-group">
                <div className="input-wrapper">
                  <span className="input-icon">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
                      <circle cx="12" cy="7" r="4"/>
                    </svg>
                  </span>
                  <input
                    type="email"
                    placeholder="Username"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    onKeyDown={handleKeyDown}
                    className="input-field"
                    required
                  />
                </div>
              </div>

              <div className="input-group">
                <div className="input-wrapper">
                  <span className="input-icon">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
                      <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
                    </svg>
                  </span>
                  <input
                    type={showPassword ? "text" : "password"}
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    onKeyDown={handleKeyDown}
                    className="input-field"
                    required
                  />
                  <button
                    type="button"
                    className="eye-btn"
                    onClick={() => setShowPassword(!showPassword)}
                    tabIndex={-1}
                  >
                    {showPassword ? (
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94"/>
                        <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19"/>
                        <line x1="1" y1="1" x2="23" y2="23"/>
                      </svg>
                    ) : (
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                        <circle cx="12" cy="12" r="3"/>
                      </svg>
                    )}
                  </button>
                </div>
              </div>

              <div className="options-row">
                <label className="remember-label" htmlFor="rememberMe">
                  <input
                    id="rememberMe"
                    type="checkbox"
                    className="remember-check"
                    checked={rememberMe}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setRememberMe(e.target.checked)}
                  />
                  <span>Ingat saya</span>
                </label>
              </div>

              <button type="submit" disabled={loading} className="login-btn">
                {loading ? "Loading..." : "Masuk"}
              </button>
            </form>

            <div className="divider">Belum punya akun?</div>

            <button
              type="button"
              className="register-btn"
              onClick={() => router.push("/register")}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
                <circle cx="8.5" cy="7" r="4"/>
                <line x1="20" y1="8" x2="20" y2="14"/>
                <line x1="23" y1="11" x2="17" y2="11"/>
              </svg>
              Daftar Akun
            </button>

            <button
              type="button"
              className="register-btn"
              style={{ marginTop: "12px", borderColor: "#4a6741", color: "#4a6741" }}
              onClick={() => router.push("/admin-login")}
            >
              Login sebagai Admin
            </button>
          </div>

        </div>
      </div>
    </>
  );
}