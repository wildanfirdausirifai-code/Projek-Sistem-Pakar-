"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Sidebar from "@/components/Sidebar";

type Gejala = {
  id: number;
  kode: string;
  nama: string;
};

const pageStyles = `
  @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800&display=swap');

  .kons-wrap {
    display: flex;
    min-height: 100vh;
    background: #f7f3ee;
    font-family: 'Plus Jakarta Sans', sans-serif;
  }

  .kons-main {
    flex: 1;
    padding: 2.5rem 2rem;
    overflow-y: auto;
  }

  .kons-inner {
    max-width: 860px;
    margin: 0 auto;
    display: flex;
    flex-direction: column;
    gap: 1.75rem;
  }

  /* HEADER */
  .kons-header {
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    flex-wrap: wrap;
    gap: 1rem;
  }

  .kons-tag {
    font-size: 0.68rem;
    font-weight: 700;
    letter-spacing: 0.1em;
    text-transform: uppercase;
    color: #3d8c7a;
    background: #e8f5f2;
    border: 1.5px solid #b2d9d1;
    padding: 3px 11px;
    border-radius: 999px;
    display: inline-block;
    margin-bottom: 0.5rem;
  }

  .kons-title {
    font-size: 2rem;
    font-weight: 800;
    color: #2d3a35;
    letter-spacing: -0.02em;
    margin: 0 0 0.25rem;
    line-height: 1.15;
  }

  .kons-subtitle {
    font-size: 0.88rem;
    color: #7a8f88;
    margin: 0;
  }

  .kons-back {
    display: flex;
    align-items: center;
    gap: 6px;
    font-size: 0.82rem;
    font-weight: 600;
    color: #7a8f88;
    background: #fff;
    border: 1.5px solid #e8e2d9;
    border-radius: 999px;
    padding: 6px 14px;
    cursor: pointer;
    text-decoration: none;
    transition: border-color 0.2s, color 0.2s;
    white-space: nowrap;
    font-family: 'Plus Jakarta Sans', sans-serif;
  }

  .kons-back:hover { border-color: #b2d9d1; color: #3d8c7a; }

  /* PANDUAN */
  .panduan-box {
    background: #fff;
    border: 1.5px solid #e8e2d9;
    border-radius: 20px;
    padding: 1.75rem;
    box-shadow: 0 2px 16px rgba(61,140,122,0.08);
  }

  .panduan-title {
    font-size: 1rem;
    font-weight: 800;
    color: #2d3a35;
    margin: 0 0 1.25rem;
    display: flex;
    align-items: center;
    gap: 8px;
  }

  .panduan-title::before {
    content: '';
    width: 4px;
    height: 18px;
    background: linear-gradient(180deg, #3d8c7a, #d96b45);
    border-radius: 2px;
    display: inline-block;
    flex-shrink: 0;
  }

  .panduan-steps {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(175px, 1fr));
    gap: 0.85rem;
  }

  .panduan-step {
    background: #f7f3ee;
    border: 1.5px solid #e8e2d9;
    border-radius: 14px;
    padding: 1rem 1.1rem;
    display: flex;
    flex-direction: column;
    gap: 8px;
    transition: border-color 0.2s, background 0.2s;
  }

  .panduan-step:hover {
    border-color: #b2d9d1;
    background: #e8f5f2;
  }

  .panduan-step-num {
    width: 28px; height: 28px;
    border-radius: 8px;
    background: linear-gradient(135deg, #3d8c7a, #2ecc9e);
    color: #fff;
    font-size: 0.75rem;
    font-weight: 800;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
    box-shadow: 0 2px 8px rgba(61,140,122,0.25);
  }

  .panduan-step-title {
    font-size: 0.82rem;
    font-weight: 700;
    color: #2d3a35;
  }

  .panduan-step-desc {
    font-size: 0.75rem;
    color: #7a8f88;
    line-height: 1.55;
    font-weight: 500;
  }

  .panduan-note {
    margin-top: 1rem;
    background: #fef6e4;
    border: 1.5px solid #f5d898;
    border-radius: 12px;
    padding: 0.75rem 1rem;
    font-size: 0.78rem;
    color: #a07020;
    font-weight: 500;
    display: flex;
    align-items: flex-start;
    gap: 8px;
    line-height: 1.6;
  }

  /* PROGRESS */
  .kons-progress-wrap {
    background: #fff;
    border: 1.5px solid #e8e2d9;
    border-radius: 16px;
    padding: 1rem 1.5rem;
    box-shadow: 0 2px 12px rgba(61,140,122,0.06);
  }

  .kons-progress-info {
    display: flex;
    justify-content: space-between;
    font-size: 0.78rem;
    font-weight: 600;
    color: #7a8f88;
    margin-bottom: 0.5rem;
  }

  .kons-progress-bar-bg {
    width: 100%;
    background: #f0ebe3;
    border-radius: 999px;
    height: 8px;
    overflow: hidden;
  }

  .kons-progress-bar-fill {
    background: linear-gradient(90deg, #3d8c7a, #2ecc9e);
    height: 8px;
    border-radius: 999px;
    transition: width 0.3s ease;
  }

  /* LIST */
  .kons-list {
    display: flex;
    flex-direction: column;
    gap: 0.65rem;
  }

  .kons-item {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 1rem;
    background: #fff;
    border: 1.5px solid #e8e2d9;
    border-radius: 14px;
    padding: 1rem 1.25rem;
    transition: border-color 0.2s, box-shadow 0.2s;
    box-shadow: 0 1px 4px rgba(0,0,0,0.04);
  }

  .kons-item:hover { border-color: #b2d9d1; box-shadow: 0 2px 12px rgba(61,140,122,0.08); }
  .kons-item-ya    { border-color: #b2d9d1; background: #e8f5f2; }
  .kons-item-tidak { border-color: #e8e2d9; background: #fafaf9; }

  .kons-item-left {
    display: flex;
    align-items: center;
    gap: 12px;
    flex: 1;
    min-width: 0;
  }

  .kons-num  { font-size: 0.68rem; font-weight: 700; color: #b0bdb9; width: 22px; flex-shrink: 0; }

  .kons-kode {
    font-size: 0.72rem;
    font-weight: 700;
    color: #3d8c7a;
    background: #e8f5f2;
    border: 1px solid #b2d9d1;
    border-radius: 6px;
    padding: 2px 7px;
    flex-shrink: 0;
  }

  .kons-nama { font-size: 0.875rem; font-weight: 600; color: #2d3a35; line-height: 1.4; }

  .kons-btns { display: flex; gap: 6px; flex-shrink: 0; }

  .kons-btn {
    padding: 6px 16px;
    border-radius: 8px;
    font-size: 0.78rem;
    font-weight: 700;
    cursor: pointer;
    border: 1.5px solid;
    transition: all 0.15s;
    font-family: 'Plus Jakarta Sans', sans-serif;
  }

  .kons-btn-ya-off   { background: #f7f3ee; color: #7a8f88; border-color: #e8e2d9; }
  .kons-btn-ya-off:hover { border-color: #3d8c7a; color: #3d8c7a; }
  .kons-btn-ya-on    { background: #3d8c7a; color: #fff; border-color: #3d8c7a; box-shadow: 0 2px 8px rgba(61,140,122,0.3); }

  .kons-btn-tidak-off { background: #f7f3ee; color: #7a8f88; border-color: #e8e2d9; }
  .kons-btn-tidak-off:hover { border-color: #2d3a35; color: #2d3a35; }
  .kons-btn-tidak-on  { background: #2d3a35; color: #fff; border-color: #2d3a35; }

  /* SUBMIT */
  .kons-submit-wrap {
    background: #fff;
    border: 1.5px solid #e8e2d9;
    border-radius: 20px;
    padding: 1.5rem;
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 1rem;
    flex-wrap: wrap;
    box-shadow: 0 2px 16px rgba(61,140,122,0.08);
  }

  .kons-submit-info { font-size: 0.82rem; color: #7a8f88; font-weight: 500; }
  .kons-submit-info strong { color: #3d8c7a; font-weight: 800; }

  .kons-submit-btn {
    padding: 0.7rem 2rem;
    background: linear-gradient(135deg, #3d8c7a, #2ecc9e);
    color: #fff;
    font-size: 0.9rem;
    font-weight: 800;
    border: none;
    border-radius: 12px;
    cursor: pointer;
    box-shadow: 0 4px 16px rgba(61,140,122,0.35);
    transition: opacity 0.2s, transform 0.15s;
    font-family: 'Plus Jakarta Sans', sans-serif;
    letter-spacing: -0.01em;
  }

  .kons-submit-btn:hover   { opacity: 0.92; transform: translateY(-1px); }
  .kons-submit-btn:disabled { opacity: 0.6; cursor: not-allowed; transform: none; }
`;

const gejalaList: Gejala[] = [
  { id: 1,  kode: "F1",  nama: "Senang mengerjakan soal logika atau teka-teki" },
  { id: 2,  kode: "F2",  nama: "Suka bekerja sama dan berinteraksi dengan orang lain" },
  { id: 3,  kode: "F3",  nama: "Tertarik dengan teknologi dan hal-hal modern" },
  { id: 4,  kode: "F4",  nama: "Suka membaca buku atau artikel yang bermanfaat" },
  { id: 5,  kode: "F5",  nama: "Peduli dan senang membantu orang lain" },
  { id: 6,  kode: "F6",  nama: "Nyaman dengan tugas yang butuh ketelitian dan fokus tinggi" },
  { id: 7,  kode: "F7",  nama: "Suka berdiskusi dan menyampaikan pendapat di depan orang" },
  { id: 8,  kode: "F8",  nama: "Senang menggunakan komputer dan alat teknologi" },
  { id: 9,  kode: "F9",  nama: "Tertarik pada kegiatan menggambar, desain, atau karya seni visual" },
  { id: 10, kode: "F10", nama: "Suka pelajaran IPA dan eksperimen di laboratorium" },
  { id: 11, kode: "F11", nama: "Tertarik membahas masalah sosial dan lingkungan sekitar" },
  { id: 12, kode: "F12", nama: "Suka belajar tentang tubuh manusia dan cara kerjanya" },
  { id: 13, kode: "F13", nama: "Tertarik dengan dunia jaringan, data, atau komputer" },
  { id: 14, kode: "F14", nama: "Senang berbicara di depan umum atau menyampaikan ide" },
  { id: 15, kode: "F15", nama: "Suka praktik langsung dan mencoba alat atau bahan di lapangan" },
  { id: 16, kode: "F16", nama: "Ingin bekerja dalam bidang yang membantu banyak orang" },
  { id: 17, kode: "F17", nama: "Suka membuat rencana dan menyusun strategi kerja" },
  { id: 18, kode: "F18", nama: "Suka membuat presentasi, poster, atau tampilan informasi visual lainnya" },
  { id: 19, kode: "F19", nama: "Tertarik mempelajari manusia, budaya, dan perilakunya" },
  { id: 20, kode: "F20", nama: "Tertarik dengan alat-alat kesehatan dan teknologi medis" },
  { id: 21, kode: "F21", nama: "Senang dengan pelajaran hitung-hitungan atau kerja pakai angka" },
  { id: 22, kode: "F22", nama: "Suka mengamati sesuatu dan mencatat hasilnya" },
  { id: 23, kode: "F23", nama: "Peduli terhadap kesehatan dan keselamatan orang lain" },
  { id: 24, kode: "F24", nama: "Suka mengekspresikan ide lewat tulisan, gambar, atau suara" },
  { id: 25, kode: "F25", nama: "Suka mencari informasi lalu menyusunnya jadi kesimpulan" },
];

const steps = [
  { num: "1", title: "Baca Setiap Pernyataan",  desc: "Baca setiap pernyataan dengan teliti sebelum menjawab." },
  { num: "2", title: "Jawab dengan Jujur",       desc: "Pilih Ya jika sesuai dengan dirimu, Tidak jika tidak sesuai." },
  { num: "3", title: "Jawab Semua",              desc: "Usahakan menjawab semua pernyataan agar hasil lebih akurat." },
  { num: "4", title: "Proses Diagnosa",          desc: "Klik tombol Proses Diagnosa di bawah setelah selesai menjawab." },
];

export default function KonsultasiPage() {
  const router = useRouter();
  const [jawaban, setJawaban] = useState<Record<number, string>>({});
  const [loading, setLoading] = useState(false);

  const totalJawab = Object.keys(jawaban).length;
  const totalYa    = Object.values(jawaban).filter((v) => v === "YA").length;
  const persen     = (totalJawab / gejalaList.length) * 100;

  const handleChange = (id: number, value: string) => {
    setJawaban((prev) => ({ ...prev, [id]: value }));
  };

  const handleSubmit = async () => {
    const selected = Object.keys(jawaban)
      .filter((id) => jawaban[Number(id)] === "YA")
      .map((id) => Number(id));

    if (selected.length === 0) {
      alert("Pilih minimal 1 YA");
      return;
    }

    setLoading(true);
    try {
      const res  = await fetch("/api/diagnosa", {
        method:  "POST",
        headers: { "Content-Type": "application/json" },
        body:    JSON.stringify({ gejalaIds: selected, userId: "dummy-user" }),
      });

      const text = await res.text();
      let data;
      try { data = JSON.parse(text); }
      catch { alert("Server error (bukan JSON)"); setLoading(false); return; }

      if (!res.ok) { alert(data.message || "Error backend"); setLoading(false); return; }

      router.push(`/hasil?data=${encodeURIComponent(JSON.stringify(data.hasil))}`);
    } catch {
      alert("Terjadi kesalahan koneksi");
    }
    setLoading(false);
  };

  return (
    <>
      <style>{pageStyles}</style>
      <div className="kons-wrap">

        {/* SIDEBAR */}
        <Sidebar />

        {/* KONTEN */}
        <main className="kons-main">
          <div className="kons-inner">

            {/* HEADER */}
            <div className="kons-header">
              <div>
                <span className="kons-tag">🧠 Sistem Pakar</span>
                <h1 className="kons-title">Konsultasi Jurusan</h1>
                <p className="kons-subtitle">
                  Pilih Ya atau Tidak untuk setiap pernyataan minat di bawah ini.
                </p>
              </div>
              <button className="kons-back" onClick={() => router.push("/dashboard")}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
                  stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M15 19l-7-7 7-7" />
                </svg>
                Kembali ke Dashboard
              </button>
            </div>

            {/* PANDUAN */}
            <div className="panduan-box">
              <h2 className="panduan-title">Panduan Pengisian</h2>
              <div className="panduan-steps">
                {steps.map((s) => (
                  <div key={s.num} className="panduan-step">
                    <div className="panduan-step-num">{s.num}</div>
                    <div className="panduan-step-title">{s.title}</div>
                    <div className="panduan-step-desc">{s.desc}</div>
                  </div>
                ))}
              </div>
              <div className="panduan-note">
                <span>💡</span>
                <span>
                  Tidak ada jawaban benar atau salah. Jawab sesuai minat dan
                  kepribadianmu yang sebenarnya untuk mendapatkan rekomendasi
                  jurusan yang paling tepat.
                </span>
              </div>
            </div>

            {/* PROGRESS */}
            <div className="kons-progress-wrap">
              <div className="kons-progress-info">
                <span>{totalJawab} dari {gejalaList.length} dijawab</span>
                <span>{Math.round(persen)}%</span>
              </div>
              <div className="kons-progress-bar-bg">
                <div className="kons-progress-bar-fill" style={{ width: `${persen}%` }} />
              </div>
            </div>

            {/* LIST PERTANYAAN */}
            <div className="kons-list">
              {gejalaList.map((g, index) => {
                const value = jawaban[g.id];
                return (
                  <div
                    key={g.id}
                    className={`kons-item ${
                      value === "YA" ? "kons-item-ya" : value === "TIDAK" ? "kons-item-tidak" : ""
                    }`}
                  >
                    <div className="kons-item-left">
                      <span className="kons-num">{String(index + 1).padStart(2, "0")}</span>
                      <span className="kons-kode">{g.kode}</span>
                      <span className="kons-nama">{g.nama}</span>
                    </div>
                    <div className="kons-btns">
                      <button
                        onClick={() => handleChange(g.id, "YA")}
                        className={`kons-btn ${value === "YA" ? "kons-btn-ya-on" : "kons-btn-ya-off"}`}
                      >Ya</button>
                      <button
                        onClick={() => handleChange(g.id, "TIDAK")}
                        className={`kons-btn ${value === "TIDAK" ? "kons-btn-tidak-on" : "kons-btn-tidak-off"}`}
                      >Tidak</button>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* SUBMIT */}
            <div className="kons-submit-wrap">
              <div className="kons-submit-info">
                Sudah menjawab <strong>{totalJawab}</strong> dari {gejalaList.length} pernyataan
                {totalYa > 0 && <> &nbsp;·&nbsp; <strong>{totalYa}</strong> jawaban Ya</>}
              </div>
              <button
                onClick={handleSubmit}
                disabled={loading}
                className="kons-submit-btn"
              >
                {loading ? "Memproses..." : "Proses Diagnosa →"}
              </button>
            </div>

          </div>
        </main>
      </div>
    </>
  );
}