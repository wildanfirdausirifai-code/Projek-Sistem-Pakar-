"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function AdminLogin() {
  const router = useRouter();

  const [showPassword, setShowPassword] = useState(false);
  const [remember, setRemember] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  useEffect(() => {
    const savedEmail = localStorage.getItem("admin_remember_email");
    const savedPassword = localStorage.getItem("admin_remember_password");
    if (savedEmail && savedPassword) {
      setEmail(savedEmail);
      setPassword(savedPassword);
      setRemember(true);
    }
  }, []);

  const handleLogin = async () => {
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        alert(data.message);
        return;
      }

      if (remember) {
        localStorage.setItem("admin_remember_email", email);
        localStorage.setItem("admin_remember_password", password);
      } else {
        localStorage.removeItem("admin_remember_email");
        localStorage.removeItem("admin_remember_password");
      }

      router.push("/admin/dashboard");

    } catch (error) {
      console.error(error);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleLogin();
    }
  };

  return (
    <div
      style={{
        fontFamily: "'Sora', sans-serif",
        minHeight: "100vh",
        width: "100%",
        background: "radial-gradient(circle at top, #0f1f1a, #050807)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        position: "relative",
        overflow: "hidden",
      }}
    >
      <div
        style={{
          position: "absolute",
          top: -120,
          left: "50%",
          transform: "translateX(-50%)",
          width: 900,
          height: 600,
          borderRadius: "50%",
          background: "radial-gradient(circle, rgba(16,185,129,0.2) 0%, transparent 70%)",
          pointerEvents: "none",
        }}
      />

      <div style={{ width: "100%", maxWidth: 420, padding: "44px 40px", position: "relative", zIndex: 1 }}>
        <div style={{ marginBottom: 32 }}>
          <div style={{ color: "#fff", fontSize: 16, fontWeight: 700 }}>Sistem Pakar</div>
          <div style={{ color: "#10b981", fontSize: 10, textTransform: "uppercase", letterSpacing: "1.4px" }}>
            Rekomendasi Jurusan
          </div>
        </div>

        <div
          style={{
            display: "inline-flex", alignItems: "center", gap: 6,
            background: "rgba(16,185,129,0.1)", border: "1px solid rgba(16,185,129,0.2)",
            borderRadius: 20, padding: "4px 12px", fontSize: 11, color: "#10b981", marginBottom: 16,
          }}
        >
          ● Admin Access
        </div>

        <h1 style={{ color: "#fff", fontSize: 24, fontWeight: 700, marginBottom: 6 }}>
          Selamat datang 👋
        </h1>
        <p style={{ color: "rgba(255,255,255,0.4)", fontSize: 13 }}>
          Masuk untuk mengelola sistem pakar
        </p>

        <div style={{ marginTop: 20 }}>
          <input
            type="text"
            placeholder="Masukkan email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            onKeyDown={handleKeyDown}
            style={{
              width: "100%", padding: "12px", borderRadius: 10,
              border: "1px solid rgba(255,255,255,0.1)",
              background: "rgba(255,255,255,0.05)", color: "#fff",
              outline: "none", fontSize: 14, boxSizing: "border-box",
            }}
          />
        </div>

        <div style={{ marginTop: 14 }}>
          <input
            type={showPassword ? "text" : "password"}
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            onKeyDown={handleKeyDown}
            style={{
              width: "100%", padding: "12px", borderRadius: 10,
              border: "1px solid rgba(255,255,255,0.1)",
              background: "rgba(255,255,255,0.05)", color: "#fff",
              outline: "none", fontSize: 14, boxSizing: "border-box",
            }}
          />
          <div
            onClick={() => setShowPassword(!showPassword)}
            style={{ marginTop: 6, fontSize: 12, color: "#10b981", cursor: "pointer" }}
          >
            {showPassword ? "Sembunyikan" : "Lihat password"}
          </div>
        </div>

        <div style={{ marginTop: 10 }}>
          <label style={{ fontSize: 12, color: "#aaa", cursor: "pointer" }}>
            <input
              type="checkbox"
              checked={remember}
              onChange={(e) => setRemember(e.target.checked)}
              style={{ marginRight: 6 }}
            />
            Ingat saya
          </label>
        </div>

        <button
          onClick={handleLogin}
          style={{
            width: "100%", marginTop: 18, padding: 12, borderRadius: 10,
            border: "none", background: "#10b981", color: "#fff",
            fontWeight: 600, cursor: "pointer", fontSize: 15,
          }}
        >
          Masuk
        </button>
      </div>
    </div>
  );
}