import Sidebar from "@/components/Sidebar";

export default function UserLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen">

      {/* SIDEBAR USER */}
      <Sidebar />

      {/* CONTENT + FOOTER */}
      <div className="flex-1 flex flex-col">
        <main className="flex-1 p-6">
          {children}
        </main>

        {/* FOOTER */}
        <footer style={{
          background: '#f5f3ee',
          borderTop: '2px solid #2C2C2A',
          fontFamily: "'Georgia', 'Times New Roman', serif",
          padding: '36px 48px 20px',
        }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '48px', paddingBottom: '24px', borderBottom: '0.5px solid #b0ab9e' }}>

            {/* Identitas Penulis */}
            <div>
              <p style={{ fontSize: 11, color: '#888780', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 10 }}>
                Dikembangkan oleh
              </p>
              <h2 style={{ fontSize: 17, fontWeight: 'normal', color: '#2C2C2A', marginBottom: 4 }}>
                Wildan Firdausi Rifai
              </h2>
              <div style={{ fontSize: 12, color: '#888780', fontFamily: "'Courier New', monospace", letterSpacing: '0.08em', marginBottom: 16 }}>
                NIM 221080200045
              </div>
              <div style={{ fontSize: 13, color: '#5F5E5A', lineHeight: 1.7, borderLeft: '2px solid #2C2C2A', paddingLeft: 12 }}>
                Program Studi Informatika<br />
                Universitas Muhammadiyah Sidoarjo
              </div>
            </div>

            {/* Judul & Dosen */}
            <div>
              <p style={{ fontSize: 11, color: '#888780', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 10 }}>
                Tugas Akhir
              </p>
              <p style={{ fontSize: 13, color: '#2C2C2A', lineHeight: 1.7, marginBottom: 16 }}>
                Perancangan Sistem Pakar Berbasis Forward Chaining untuk Mendukung Pengambilan Keputusan Jurusan Siswa SMA
              </p>
              <div style={{ fontSize: 12, color: '#5F5E5A', lineHeight: 1.9 }}>
                <span style={{ color: '#888780', fontSize: 11, letterSpacing: '0.06em', textTransform: 'uppercase' }}>Pembimbing</span><br />
                Ika Ratna Indra Astutik, S.Kom., MT<br />
                <span style={{ color: '#888780', fontSize: 11, letterSpacing: '0.06em', textTransform: 'uppercase', marginTop: 6, display: 'block' }}>Penguji</span>
                Novia Ariyanti, S.Si., M.Pd
              </div>
            </div>

          </div>

          {/* Bottom bar */}
          <div style={{ paddingTop: 16, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 8 }}>
            <span style={{ fontSize: 11, color: '#b0ab9e', letterSpacing: '0.04em' }}>
              © 2026 Wildan Firdausi Rifai — Universitas Muhammadiyah Sidoarjo
            </span>
            <span style={{ fontSize: 11, color: '#b0ab9e', fontFamily: "'Courier New', monospace", letterSpacing: '0.06em' }}>
              v1.0.0 · Rule-Based · Forward Chaining
            </span>
          </div>
        </footer>
      </div>

    </div>
  );
}