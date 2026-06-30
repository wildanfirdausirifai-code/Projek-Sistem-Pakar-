"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

type Result = {
  jurusanId: number;
  total: number;
};

type Riwayat = {
  id: string;
  createdAt: string;
  result: Result[];
};

type Jurusan = {
  id: number;
  aktif: boolean;
};

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800&display=swap');

  :root {
    --sage:         #3d8c7a;
    --sage-light:   #e8f5f2;
    --sage-mid:     #b2d9d1;
    --terra:        #d96b45;
    --terra-light:  #fdeee8;
    --terra-mid:    #f5c0a8;
    --honey:        #e8a030;
    --honey-light:  #fef6e4;
    --honey-mid:    #f5d898;
    --bg:           #f7f3ee;
    --white:        #ffffff;
    --text-main:    #2d3a35;
    --text-muted:   #7a8f88;
    --text-dim:     #b0bdb9;
    --border:       #e8e2d9;
    --border2:      #d4cdc2;
    --shadow:       0 2px 16px rgba(61,140,122,0.08);
    --shadow-hover: 0 6px 24px rgba(61,140,122,0.14);
  }

  .db-wrap {
    font-family: 'Plus Jakarta Sans', sans-serif;
    min-height: 100vh;
    background: var(--bg);
    color: var(--text-main);
    padding: 2.5rem 2rem;
    position: relative;
    overflow-x: hidden;
  }

  .db-deco {
    position: fixed;
    border-radius: 50%;
    pointer-events: none;
    z-index: 0;
  }
  .db-deco-1 {
    width: 380px; height: 380px;
    top: -140px; right: -100px;
    background: radial-gradient(circle, rgba(61,140,122,0.10), transparent 65%);
  }
  .db-deco-2 {
    width: 280px; height: 280px;
    bottom: -80px; left: -60px;
    background: radial-gradient(circle, rgba(217,107,69,0.09), transparent 65%);
  }
  .db-deco-3 {
    width: 200px; height: 200px;
    top: 40%; right: 10%;
    background: radial-gradient(circle, rgba(232,160,48,0.07), transparent 65%);
  }

  .db-inner {
    position: relative;
    z-index: 1;
    max-width: 980px;
    margin: 0 auto;
    display: flex;
    flex-direction: column;
    gap: 1.75rem;
  }

  .db-eyebrow {
    display: flex;
    align-items: center;
    gap: 8px;
    margin-bottom: 0.5rem;
  }

  .db-tag {
    font-size: 0.68rem;
    font-weight: 700;
    letter-spacing: 0.1em;
    text-transform: uppercase;
    color: var(--sage);
    background: var(--sage-light);
    border: 1.5px solid var(--sage-mid);
    padding: 3px 11px;
    border-radius: 999px;
  }

  .db-title {
    font-size: 2.2rem;
    font-weight: 800;
    line-height: 1.1;
    margin: 0 0 0.35rem;
    color: var(--text-main);
    letter-spacing: -0.02em;
  }

  .db-title span { color: var(--sage); }

  .db-subtitle {
    color: var(--text-muted);
    font-size: 0.88rem;
    margin: 0;
    font-weight: 400;
  }

  .db-stats {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
    gap: 1rem;
  }

  .db-card {
    background: var(--white);
    border: 1.5px solid var(--border);
    border-radius: 20px;
    padding: 1.5rem;
    position: relative;
    overflow: hidden;
    transition: transform 0.22s ease, box-shadow 0.22s ease;
    box-shadow: var(--shadow);
  }

  .db-card:hover {
    transform: translateY(-4px);
    box-shadow: var(--shadow-hover);
  }

  .db-card-bg {
    position: absolute;
    top: -20px; right: -20px;
    width: 90px; height: 90px;
    border-radius: 50%;
    opacity: 0.35;
  }

  .db-cbg-sage  { background: var(--sage-mid); }
  .db-cbg-terra { background: var(--terra-mid); }

  .db-card-icon {
    width: 44px; height: 44px;
    border-radius: 12px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 1.3rem;
    margin-bottom: 1rem;
  }

  .db-ico-sage  { background: var(--sage-light); }
  .db-ico-terra { background: var(--terra-light); }

  .db-card-label {
    font-size: 0.7rem;
    font-weight: 700;
    letter-spacing: 0.07em;
    text-transform: uppercase;
    color: var(--text-dim);
    margin-bottom: 0.2rem;
  }

  .db-card-value {
    font-size: 2.6rem;
    font-weight: 800;
    line-height: 1;
    letter-spacing: -0.02em;
  }

  .db-val-sage  { color: var(--sage); }
  .db-val-terra { color: var(--terra); }
  .db-card-hint { font-size: 0.72rem; color: var(--text-dim); margin-top: 0.3rem; font-weight: 500; }

  .db-section {
    background: var(--white);
    border: 1.5px solid var(--border);
    border-radius: 20px;
    padding: 1.75rem;
    box-shadow: var(--shadow);
  }

  .db-sec-head {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 1.25rem;
  }

  .db-sec-title {
    font-size: 1rem;
    font-weight: 800;
    color: var(--text-main);
    margin: 0;
    display: flex;
    align-items: center;
    gap: 8px;
  }

  .db-sec-title::before {
    content: '';
    width: 4px;
    height: 18px;
    background: linear-gradient(180deg, var(--sage), var(--terra));
    border-radius: 2px;
    display: inline-block;
    flex-shrink: 0;
  }

  .db-sec-count {
    font-size: 0.72rem;
    font-weight: 700;
    color: var(--sage);
    background: var(--sage-light);
    border: 1px solid var(--sage-mid);
    border-radius: 999px;
    padding: 2px 10px;
  }

  .db-activity-list { display: flex; flex-direction: column; gap: 0.7rem; }

  .db-act-item {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 1rem;
    background: var(--bg);
    border: 1.5px solid var(--border);
    border-radius: 14px;
    padding: 1rem 1.25rem;
    transition: border-color 0.2s, background 0.2s, box-shadow 0.2s;
  }

  .db-act-item:hover {
    border-color: var(--sage-mid);
    background: var(--sage-light);
    box-shadow: 0 2px 12px rgba(61,140,122,0.08);
  }

  .db-act-num {
    font-size: 0.68rem;
    font-weight: 700;
    letter-spacing: 0.07em;
    text-transform: uppercase;
    color: var(--text-dim);
  }

  .db-act-date { font-size: 0.7rem; color: var(--text-dim); margin-top: 2px; font-weight: 500; }

  .db-act-rec {
    font-size: 0.84rem;
    color: var(--text-muted);
    margin-top: 0.4rem;
    display: flex;
    align-items: center;
    gap: 6px;
    font-weight: 500;
  }

  .db-badge {
    display: inline-flex;
    align-items: center;
    padding: 3px 11px;
    border-radius: 7px;
    font-size: 0.76rem;
    font-weight: 700;
  }

  .db-badge-sage  { background: var(--sage-light);  color: var(--sage);  border: 1.5px solid var(--sage-mid); }
  .db-badge-terra { background: var(--terra-light); color: var(--terra); border: 1.5px solid var(--terra-mid); }
  .db-badge-honey { background: var(--honey-light); color: var(--honey); border: 1.5px solid var(--honey-mid); }

  .db-score-box {
    flex-shrink: 0;
    min-width: 58px;
    text-align: center;
    background: var(--white);
    border: 1.5px solid var(--border2);
    border-radius: 12px;
    padding: 0.45rem 0.65rem;
    box-shadow: 0 1px 4px rgba(0,0,0,0.05);
  }

  .db-score-num {
    font-size: 1.5rem;
    font-weight: 800;
    line-height: 1;
    letter-spacing: -0.02em;
  }

  .db-score-lbl {
    font-size: 0.58rem;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.06em;
    color: var(--text-dim);
  }

  .db-empty {
    text-align: center;
    padding: 2.5rem;
    color: var(--text-dim);
    font-size: 0.85rem;
  }

  .db-about-text {
    color: var(--text-muted);
    font-size: 0.88rem;
    line-height: 1.8;
    margin: 0;
  }

  .db-goals-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(190px, 1fr));
    gap: 0.65rem;
    list-style: none;
    padding: 0;
    margin: 0;
  }

  .db-goal {
    background: var(--bg);
    border: 1.5px solid var(--border);
    border-radius: 12px;
    padding: 0.9rem 1rem;
    display: flex;
    align-items: flex-start;
    gap: 9px;
    font-size: 0.8rem;
    color: var(--text-muted);
    line-height: 1.55;
    font-weight: 500;
    transition: border-color 0.2s, background 0.2s;
  }

  .db-goal:hover { border-color: var(--sage-mid); background: var(--sage-light); }
  .db-goal-ico { flex-shrink: 0; font-size: 1rem; }

  .db-two-col {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
    gap: 1rem;
  }

  .db-lihat-semua {
    display: inline-block;
    padding: 0.5rem 1.5rem;
    border-radius: 999px;
    background: var(--sage-light);
    color: var(--sage);
    font-weight: 700;
    font-size: 0.8rem;
    border: 1.5px solid var(--sage-mid);
    text-decoration: none;
    cursor: pointer;
    transition: background 0.2s, box-shadow 0.2s;
    font-family: 'Plus Jakarta Sans', sans-serif;
  }

  .db-lihat-semua:hover {
    background: var(--sage-mid);
    box-shadow: 0 2px 8px rgba(61,140,122,0.15);
  }
`;

export default function DashboardPage() {
  const router = useRouter();
  const [totalKonsultasi, setTotalKonsultasi] = useState(0);
  const [totalJurusan, setTotalJurusan] = useState(0);
  const [riwayat, setRiwayat] = useState<Riwayat[]>([]);

  useEffect(() => {
    fetch("/api/riwayat")
      .then((res) => res.json())
      .then((data) => {
        setTotalKonsultasi(data.length || 0);
        setRiwayat(data.slice(0, 5));
      })
      .catch(() => {
        setTotalKonsultasi(0);
        setRiwayat([]);
      });

    fetch("/api/jurusan")
      .then((res) => res.json())
      .then((data: Jurusan[]) => {
        const jumlahAktif = data.filter((j) => j.aktif).length;
        setTotalJurusan(jumlahAktif);
      })
      .catch(() => setTotalJurusan(0));
  }, []);

  return (
    <>
      <style>{styles}</style>
      <div className="db-wrap">
        <div className="db-deco db-deco-1" />
        <div className="db-deco db-deco-2" />
        <div className="db-deco db-deco-3" />

        <div className="db-inner">

          {/* HEADER */}
          <div>
            <div className="db-eyebrow">
              <span className="db-tag">🧠 Sistem Pakar</span>
            </div>
            <h1 className="db-title">
              Dashboard <span>Rekomendasi</span><br />Jurusan
            </h1>
            <p className="db-subtitle">
              Sistem Rekomendasi Berdasarkan Minat dan Karakter Siswa
            </p>
          </div>

          {/* STAT CARDS */}
          <div className="db-stats">
            <div className="db-card">
              <div className="db-card-bg db-cbg-sage" />
              <div className="db-card-icon db-ico-sage">🎓</div>
              <div className="db-card-label">Total Konsultasi</div>
              <div className="db-card-value db-val-sage">{totalKonsultasi}</div>
              <div className="db-card-hint">sesi berjalan</div>
            </div>

            <div className="db-card">
              <div className="db-card-bg db-cbg-terra" />
              <div className="db-card-icon db-ico-terra">📚</div>
              <div className="db-card-label">Jumlah Jurusan</div>
              <div className="db-card-value db-val-terra">{totalJurusan}</div>
              <div className="db-card-hint">pilihan tersedia</div>
            </div>
          </div>

          {/* AKTIVITAS */}
          <div className="db-section">
            <div className="db-sec-head">
              <h2 className="db-sec-title">Aktivitas Terbaru</h2>
              {totalKonsultasi > 0 && (
                <span className="db-sec-count">{totalKonsultasi} sesi</span>
              )}
            </div>

            {riwayat.length === 0 ? (
              <div className="db-empty">Belum ada aktivitas konsultasi.</div>
            ) : (
              <>
                <div className="db-activity-list">
                  {riwayat.map((item, index) => {
                    const sorted = [...(item.result || [])].sort((a, b) => b.total - a.total);
                    const top = sorted[0];
                    const color = getColor(top?.jurusanId);

                    return (
                      <div key={item.id} className="db-act-item">
                        <div>
                          <div className="db-act-num">Konsultasi #{index + 1}</div>
                          <div className="db-act-date">
                            {new Date(item.createdAt).toLocaleString("id-ID")}
                          </div>
                          <div className="db-act-rec">
                            Rekomendasi:{" "}
                            {top ? (
                              <span className={`db-badge db-badge-${color}`}>
                                {getNamaJurusan(top.jurusanId)}
                              </span>
                            ) : (
                              <span style={{ fontStyle: "italic", color: "var(--text-dim)" }}>—</span>
                            )}
                          </div>
                        </div>
                        {top && (
                          <div className="db-score-box">
                            <div className="db-score-num" style={{ color: getHex(top.jurusanId) }}>
                              {top.total}
                            </div>
                            <div className="db-score-lbl">skor</div>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>

                {totalKonsultasi > 5 && (
                  <div style={{ textAlign: "center", marginTop: "1.25rem" }}>
                    <button
                      className="db-lihat-semua"
                      onClick={() => router.push("/riwayat")}
                    >
                      Lihat Semua Riwayat ({totalKonsultasi} sesi) →
                    </button>
                  </div>
                )}
              </>
            )}
          </div>

          {/* ABOUT + GOALS */}
          <div className="db-two-col">
            <div className="db-section">
              <div className="db-sec-head" style={{ marginBottom: "1rem" }}>
                <h2 className="db-sec-title">Tentang Sistem</h2>
              </div>
              <p className="db-about-text">
                Sistem pakar ini dirancang untuk membantu siswa dalam menentukan jurusan yang paling sesuai dengan minat dan karakter mereka. Melalui serangkaian pertanyaan yang telah disusun, sistem akan menganalisis jawabanmu dan menghasilkan rekomendasi jurusan yang relevan sebagai bahan pertimbangan dalam mengambil keputusan pendidikanmu.
              </p>
            </div>

            <div className="db-section">
              <div className="db-sec-head" style={{ marginBottom: "1rem" }}>
                <h2 className="db-sec-title">Tujuan Sistem</h2>
              </div>
              <ul className="db-goals-grid">
                {[
                  { ico: "🎯", text: "Membantu siswa menentukan jurusan yang tepat" },
                  { ico: "🔍", text: "Mengurangi kesalahan dalam memilih jurusan" },
                  { ico: "🤖", text: "Rekomendasi berbasis sistem pakar" },
                  { ico: "💡", text: "Tingkatkan kesadaran minat & potensi diri" },
                ].map((g, i) => (
                  <li key={i} className="db-goal">
                    <span className="db-goal-ico">{g.ico}</span>
                    {g.text}
                  </li>
                ))}
              </ul>
            </div>
          </div>

        </div>
      </div>
    </>
  );
}

function getColor(id?: number) {
  if (id === 1) return "sage";
  if (id === 2) return "terra";
  return "honey";
}

function getHex(id: number) {
  if (id === 1) return "#3d8c7a";
  if (id === 2) return "#d96b45";
  return "#e8a030";
}

function getNamaJurusan(id: number) {
  switch (id) {
    case 1: return "Sains Teknik";
    case 2: return "Sains Kesehatan";
    case 3: return "Sosial Humaniora";
    default: return "Tidak diketahui";
  }
}