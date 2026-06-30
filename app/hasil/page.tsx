"use client";

import { Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";

type Hasil = {
  jurusanId: number;
  nama: string;
  total: number;
};

function HasilContent() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const dataParam = searchParams.get("data");
  let hasil: Hasil[] = [];

  try {
    if (dataParam) hasil = JSON.parse(dataParam);
  } catch {
    hasil = [];
  }

  const top = hasil[0];

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-16 bg-[var(--bg)] relative overflow-hidden">

      {/* 🌈 BACKGROUND MOTIF */}
      <div className="absolute top-[-100px] right-[-80px] w-[350px] h-[350px] bg-[radial-gradient(circle,rgba(61,140,122,0.12),transparent_70%)] rounded-full" />
      <div className="absolute bottom-[-80px] left-[-80px] w-[250px] h-[250px] bg-[radial-gradient(circle,rgba(217,107,69,0.1),transparent_70%)] rounded-full" />

      {/* 🧊 CARD */}
      <div className="relative z-10 w-full max-w-md bg-white/70 backdrop-blur-xl border border-[var(--border)] shadow-2xl rounded-3xl p-6 space-y-6 animate-[fadeUp_0.5s_ease]">

        {/* HEADER */}
        <div className="text-center space-y-2">
          <div className="w-14 h-14 mx-auto rounded-xl bg-gradient-to-br from-[var(--sage)] to-[var(--sage-dark)] flex items-center justify-center text-2xl shadow-lg">
            🎓
          </div>

          <h1 className="text-xl font-extrabold text-[var(--text-main)]">
            Hasil <span className="text-[var(--sage)]">Rekomendasi</span>
          </h1>

          <p className="text-sm text-[var(--text-muted)]">
            Berdasarkan minat dan karakter kamu
          </p>
        </div>

        {/* 🏆 TOP RESULT */}
        {top && (
          <div className="bg-[var(--sage-light)] border-2 border-[var(--sage-mid)] rounded-2xl p-4 text-center relative">

            <div className="absolute top-1 right-3 text-3xl opacity-20">
              🏆
            </div>

            <h2 className="text-lg font-extrabold text-[var(--sage-dark)]">
              {top.nama}
            </h2>

            <p className="text-sm text-[var(--text-muted)]">
              Skor: <span className="font-bold">{top.total}</span>
            </p>
          </div>
        )}

        {/* LIST */}
        <div className="space-y-3">
          {hasil.map((item, index) => (
            <div
              key={index}
              className={`flex items-center justify-between p-3 rounded-xl border transition 
              ${index === 0
                ? "bg-[var(--sage-light)] border-[var(--sage-mid)]"
                : "bg-white border-[var(--border)] hover:bg-gray-50"
              }`}
            >

              <div>
                <p className="font-semibold text-[var(--text-main)]">
                  {item.nama}
                </p>
                <p className="text-xs text-[var(--text-muted)]">
                  Skor: {item.total}
                </p>
              </div>

              <div className={`
                w-8 h-8 flex items-center justify-center rounded-lg text-sm font-bold
                ${index === 0 && "bg-[var(--sage)] text-white"}
                ${index === 1 && "bg-[var(--sage-light)] text-[var(--sage)]"}
                ${index === 2 && "bg-yellow-100 text-yellow-700"}
              `}>
                #{index + 1}
              </div>

            </div>
          ))}
        </div>

        {/* BUTTON */}
        <button
          onClick={() => router.push("/konsultasi")}
          className="w-full py-3 rounded-xl text-white font-bold bg-gradient-to-r from-[var(--sage)] to-[var(--sage-dark)] hover:scale-[1.02] transition"
        >
          ← Kembali ke Konsultasi
        </button>

      </div>
    </div>
  );
}

export default function HasilPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-[var(--bg)]">
          <p className="text-[var(--text-muted)]">Memuat hasil...</p>
        </div>
      }
    >
      <HasilContent />
    </Suspense>
  );
}