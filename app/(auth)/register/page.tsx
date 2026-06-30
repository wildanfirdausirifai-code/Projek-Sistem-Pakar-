"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function RegisterPage() {
  const router = useRouter();

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();

    if (form.password !== form.confirmPassword) {
      alert("Password dan konfirmasi password tidak cocok");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.name,
          email: form.email,
          password: form.password,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message);

      alert("Akun berhasil dibuat! Silakan login.");
      router.push("/login");
    } catch (err: any) {
      alert(err.message || "Registrasi gagal");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&display=swap');

        .reg-root {
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
          min-height: 560px;
        }

        @media (max-width: 640px) {
          .card { grid-template-columns: 1fr; }
          .card-left { display: none !important; }
        }

        /* LEFT */
        .card-left {
          background: #f7f3ee;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 40px 32px;
          gap: 24px;
        }

        .illus-svg { width: 100%; max-width: 300px; height: auto; }

        .left-text { text-align: center; }
        .left-text h2 {
          font-size: 1.25rem;
          font-weight: 700;
          color: #2d4428;
          margin: 0 0 6px;
        }
        .left-text p {
          font-size: 0.85rem;
          color: #888;
          margin: 0;
          line-height: 1.5;
        }

        /* Steps indicator */
        .steps {
          display: flex;
          flex-direction: column;
          gap: 12px;
          width: 100%;
          max-width: 220px;
        }
        .step-item {
          display: flex;
          align-items: center;
          gap: 10px;
          font-size: 0.82rem;
          color: #666;
        }
        .step-dot {
          width: 28px; height: 28px;
          border-radius: 50%;
          background: #4a6741;
          color: white;
          display: flex; align-items: center; justify-content: center;
          font-size: 0.75rem;
          font-weight: 700;
          flex-shrink: 0;
        }

        /* RIGHT FORM */
        .card-right {
          padding: 44px 48px;
          display: flex;
          flex-direction: column;
          justify-content: center;
          overflow-y: auto;
        }

        .form-title {
          font-size: 1.9rem;
          font-weight: 700;
          color: #1a1a1a;
          margin: 0 0 4px;
          letter-spacing: -0.5px;
        }
        .form-subtitle {
          font-size: 0.9rem;
          color: #888;
          margin: 0 0 28px;
        }

        .input-group { margin-bottom: 14px; }

        .input-label {
          display: block;
          font-size: 0.8rem;
          font-weight: 600;
          color: #555;
          margin-bottom: 6px;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        .input-wrapper {
          position: relative;
          display: flex;
          align-items: center;
          border: 1.5px solid #e5e7eb;
          border-radius: 14px;
          background: #fff;
          transition: border-color 0.2s, box-shadow 0.2s;
          overflow: hidden;
        }
        .input-wrapper:focus-within {
          border-color: #4a6741;
          box-shadow: 0 0 0 3px rgba(74,103,65,0.1);
        }
        .input-wrapper.error {
          border-color: #e05555;
          box-shadow: 0 0 0 3px rgba(224,85,85,0.1);
        }

        .input-icon {
          padding: 0 14px;
          color: #aaa;
          flex-shrink: 0;
          display: flex; align-items: center;
        }

        .input-field {
          flex: 1;
          border: none; outline: none;
          padding: 13px 12px 13px 0;
          font-size: 0.9rem;
          font-family: 'DM Sans', sans-serif;
          color: #1a1a1a;
          background: transparent;
        }
        .input-field::placeholder { color: #bbb; }

        .eye-btn {
          background: none; border: none; cursor: pointer;
          padding: 0 14px; color: #aaa;
          display: flex; align-items: center;
          transition: color 0.2s;
        }
        .eye-btn:hover { color: #4a6741; }

        /* Password strength */
        .strength-bar {
          display: flex; gap: 4px; margin-top: 6px;
        }
        .strength-seg {
          height: 3px; flex: 1; border-radius: 2px;
          background: #e5e7eb;
          transition: background 0.3s;
        }
        .strength-seg.weak { background: #e05555; }
        .strength-seg.medium { background: #f59e0b; }
        .strength-seg.strong { background: #4a6741; }

        .strength-label {
          font-size: 0.75rem;
          margin-top: 3px;
          color: #888;
        }

        /* Match indicator */
        .match-hint {
          font-size: 0.75rem;
          margin-top: 4px;
          display: flex; align-items: center; gap: 4px;
        }
        .match-ok { color: #4a6741; }
        .match-no { color: #e05555; }

        .register-btn {
          width: 100%;
          padding: 15px;
          border-radius: 14px;
          background: #4a6741;
          color: white;
          font-family: 'DM Sans', sans-serif;
          font-size: 0.95rem;
          font-weight: 700;
          letter-spacing: 1.5px;
          text-transform: uppercase;
          border: none; cursor: pointer;
          transition: background 0.2s, transform 0.1s;
          margin-top: 20px;
          margin-bottom: 20px;
        }
        .register-btn:hover:not(:disabled) { background: #3a5433; }
        .register-btn:active:not(:disabled) { transform: scale(0.99); }
        .register-btn:disabled { opacity: 0.7; cursor: not-allowed; }

        .divider {
          display: flex; align-items: center; gap: 12px;
          margin-bottom: 16px; color: #ccc; font-size: 0.8rem;
        }
        .divider::before, .divider::after {
          content: ''; flex: 1; height: 1px; background: #e5e7eb;
        }

        .login-btn {
          width: 100%;
          padding: 14px;
          border-radius: 14px;
          background: transparent;
          border: 1.5px solid #4a6741;
          color: #4a6741;
          font-family: 'DM Sans', sans-serif;
          font-size: 0.9rem; font-weight: 600;
          cursor: pointer;
          display: flex; align-items: center; justify-content: center; gap: 8px;
          transition: background 0.2s;
        }
        .login-btn:hover { background: #f0f5ee; }
      `}</style>

      <div className="reg-root">
        <div className="blob-tl" />
        <div className="blob-tr" />
        <div className="blob-bl" />
        <div className="blob-br" />

        <div className="card">

          {/* ========== LEFT ========== */}
          <div className="card-left">
            <svg className="illus-svg" viewBox="0 0 300 240" fill="none" xmlns="http://www.w3.org/2000/svg">
              {/* Background blob */}
              <ellipse cx="150" cy="170" rx="120" ry="60" fill="#ede8e0"/>

              {/* Document / form illustration */}
              <rect x="70" y="40" width="160" height="180" rx="12" fill="white" stroke="#e0d8cc" strokeWidth="2"/>
              <rect x="70" y="40" width="160" height="36" rx="12" fill="#4a6741"/>
              <rect x="70" y="64" width="160" height="12" fill="#4a6741"/>

              {/* Header text lines */}
              <rect x="90" y="52" width="80" height="8" rx="4" fill="white" opacity="0.8"/>
              <rect x="178" y="52" width="20" height="8" rx="4" fill="#c07a5e" opacity="0.9"/>

              {/* Form fields inside doc */}
              <rect x="88" y="94" width="124" height="16" rx="6" fill="#f7f3ee" stroke="#e0d8cc" strokeWidth="1"/>
              <rect x="94" y="99" width="8" height="6" rx="2" fill="#bbb"/>
              <rect x="106" y="100" width="60" height="4" rx="2" fill="#ccc"/>

              <rect x="88" y="118" width="124" height="16" rx="6" fill="#f7f3ee" stroke="#e0d8cc" strokeWidth="1"/>
              <rect x="94" y="123" width="8" height="6" rx="2" fill="#bbb"/>
              <rect x="106" y="124" width="70" height="4" rx="2" fill="#ccc"/>

              <rect x="88" y="142" width="124" height="16" rx="6" fill="#f7f3ee" stroke="#e0d8cc" strokeWidth="1"/>
              <rect x="94" y="147" width="8" height="6" rx="2" fill="#bbb"/>
              <rect x="106" y="148" width="50" height="4" rx="2" fill="#ccc"/>

              <rect x="88" y="166" width="124" height="16" rx="6" fill="#f7f3ee" stroke="#e0d8cc" strokeWidth="1"/>
              <rect x="94" y="171" width="8" height="6" rx="2" fill="#bbb"/>
              <rect x="106" y="172" width="55" height="4" rx="2" fill="#ccc"/>

              {/* Button */}
              <rect x="88" y="193" width="124" height="18" rx="7" fill="#4a6741"/>
              <rect x="120" y="199" width="60" height="6" rx="3" fill="white" opacity="0.8"/>

              {/* Pencil decoration */}
              <g transform="translate(210, 30) rotate(30)">
                <rect x="0" y="0" width="10" height="50" rx="3" fill="#c07a5e"/>
                <polygon points="0,50 10,50 5,62" fill="#f5c9a8"/>
                <rect x="0" y="0" width="10" height="8" rx="2" fill="#888"/>
                <rect x="1" y="8" width="8" height="3" fill="#e8c060"/>
              </g>

              {/* Star sparkles */}
              <circle cx="62" cy="80" r="4" fill="#c07a5e" opacity="0.5"/>
              <circle cx="248" cy="150" r="5" fill="#4a6741" opacity="0.4"/>
              <circle cx="240" cy="60" r="3" fill="#c07a5e" opacity="0.6"/>

              {/* Small person icon */}
              <circle cx="150" cy="168" r="14" fill="#4a6741" opacity="0.15"/>
              <circle cx="150" cy="162" r="7" fill="#4a6741" opacity="0.6"/>
              <path d="M136 178 Q150 172 164 178" stroke="#4a6741" strokeWidth="4" strokeLinecap="round" fill="none" opacity="0.6"/>
            </svg>

            <div className="left-text">
              <h2>Buat Akun Baru</h2>
              <p>Daftarkan dirimu dan mulai<br/>temukan jurusan terbaikmu</p>
            </div>

            <div className="steps">
              <div className="step-item">
                <div className="step-dot">1</div>
                <span>Isi data diri kamu</span>
              </div>
              <div className="step-item">
                <div className="step-dot">2</div>
                <span>Buat password aman</span>
              </div>
              <div className="step-item">
                <div className="step-dot">3</div>
                <span>Mulai konsultasi jurusan</span>
              </div>
            </div>
          </div>

          {/* ========== RIGHT FORM ========== */}
          <div className="card-right">
            <h1 className="form-title">Daftar Akun</h1>
            <p className="form-subtitle">Buat akun baru untuk memulai 🎓</p>

            <form onSubmit={handleRegister}>

              {/* NAMA */}
              <div className="input-group">
                <label className="input-label">Nama Lengkap</label>
                <div className="input-wrapper">
                  <span className="input-icon">
                    <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
                      <circle cx="12" cy="7" r="4"/>
                    </svg>
                  </span>
                  <input
                    type="text"
                    name="name"
                    placeholder="Masukkan nama lengkap"
                    value={form.name}
                    onChange={handleChange}
                    className="input-field"
                    required
                  />
                </div>
              </div>

              {/* EMAIL */}
              <div className="input-group">
                <label className="input-label">Email</label>
                <div className="input-wrapper">
                  <span className="input-icon">
                    <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
                      <polyline points="22,6 12,13 2,6"/>
                    </svg>
                  </span>
                  <input
                    type="email"
                    name="email"
                    placeholder="Masukkan email kamu"
                    value={form.email}
                    onChange={handleChange}
                    className="input-field"
                    required
                  />
                </div>
              </div>

              {/* PASSWORD */}
              <div className="input-group">
                <label className="input-label">Password</label>
                <div className="input-wrapper">
                  <span className="input-icon">
                    <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
                      <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
                    </svg>
                  </span>
                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    placeholder="Buat password"
                    value={form.password}
                    onChange={handleChange}
                    className="input-field"
                    required
                  />
                  <button type="button" className="eye-btn" onClick={() => setShowPassword(!showPassword)} tabIndex={-1}>
                    {showPassword ? (
                      <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94"/><path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19"/><line x1="1" y1="1" x2="23" y2="23"/>
                      </svg>
                    ) : (
                      <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/>
                      </svg>
                    )}
                  </button>
                </div>
                {/* Password strength */}
                {form.password.length > 0 && (
                  <>
                    <div className="strength-bar">
                      {[0,1,2,3].map(i => {
                        const len = form.password.length;
                        const strength = len < 6 ? 1 : len < 10 ? 2 : 4;
                        return (
                          <div key={i} className={`strength-seg ${i < strength ? (strength === 1 ? 'weak' : strength === 2 ? 'medium' : 'strong') : ''}`}/>
                        );
                      })}
                    </div>
                    <div className="strength-label">
                      {form.password.length < 6 ? "Terlalu pendek" : form.password.length < 10 ? "Sedang" : "Kuat ✓"}
                    </div>
                  </>
                )}
              </div>

              {/* CONFIRM PASSWORD */}
              <div className="input-group">
                <label className="input-label">Konfirmasi Password</label>
                <div className={`input-wrapper ${form.confirmPassword && form.confirmPassword !== form.password ? 'error' : ''}`}>
                  <span className="input-icon">
                    <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0 1 12 2.944a11.955 11.955 0 0 1-8.618 3.04A12.02 12.02 0 0 0 3 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"/>
                    </svg>
                  </span>
                  <input
                    type={showConfirm ? "text" : "password"}
                    name="confirmPassword"
                    placeholder="Ulangi password"
                    value={form.confirmPassword}
                    onChange={handleChange}
                    className="input-field"
                    required
                  />
                  <button type="button" className="eye-btn" onClick={() => setShowConfirm(!showConfirm)} tabIndex={-1}>
                    {showConfirm ? (
                      <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94"/><path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19"/><line x1="1" y1="1" x2="23" y2="23"/>
                      </svg>
                    ) : (
                      <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/>
                      </svg>
                    )}
                  </button>
                </div>
                {form.confirmPassword.length > 0 && (
                  <div className={`match-hint ${form.password === form.confirmPassword ? 'match-ok' : 'match-no'}`}>
                    {form.password === form.confirmPassword ? (
                      <><svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg> Password cocok</>
                    ) : (
                      <><svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg> Password tidak cocok</>
                    )}
                  </div>
                )}
              </div>

              {/* SUBMIT */}
              <button type="submit" disabled={loading} className="register-btn">
                {loading ? "Memproses..." : "Buat Akun"}
              </button>

            </form>

            <div className="divider">Sudah punya akun?</div>

            <button type="button" className="login-btn" onClick={() => router.push("/login")}>
              <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4"/><polyline points="10 17 15 12 10 7"/><line x1="15" y1="12" x2="3" y2="12"/>
              </svg>
              Masuk Sekarang
            </button>
          </div>

        </div>
      </div>
    </>
  );
}