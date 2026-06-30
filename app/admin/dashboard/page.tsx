import prisma from "@/lib/prisma";

export default async function DashboardAdminPage() {
  const totalKonsultasi = await prisma.consultation.count();
  const totalHasil = await prisma.result.count();
  const totalUser = await prisma.user.count();
  const totalJurusan = await prisma.jurusan.count({
    where: { aktif: true },
  });

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const konsultasiHariIni = await prisma.consultation.count({
    where: { createdAt: { gte: today } },
  });

  const recentKonsultasi = await prisma.consultation.findMany({
    take: 5,
    orderBy: { createdAt: "desc" },
    include: { user: true },
  });

  const hasilPerTahun = await prisma.result.findMany({
    select: {
      jurusanId: true,
      total: true,
      consultation: { select: { createdAt: true } },
    },
  });

  const grouped: Record<string, Record<number, number>> = {};
  for (const item of hasilPerTahun) {
    const date = new Date(item.consultation.createdAt);
    const key = `${date.getFullYear()}`;
    if (!grouped[key]) grouped[key] = {};
    if (!grouped[key][item.jurusanId]) grouped[key][item.jurusanId] = 0;
    grouped[key][item.jurusanId] += item.total;
  }

  const sortedKeys = Object.keys(grouped).sort();
  const chartData = sortedKeys.map((tahun) => ({
    bulan: tahun,
    j1: grouped[tahun][1] || 0,
    j2: grouped[tahun][2] || 0,
    j3: grouped[tahun][3] || 0,
  }));

  const ranking = await prisma.result.groupBy({
    by: ["jurusanId"],
    _sum: { total: true },
    orderBy: { _sum: { total: "desc" } },
  });

  return (
    <div className="relative min-h-screen p-6">
      <div className="absolute inset-0 -z-10 bg-gradient-to-br from-slate-100 via-gray-200 to-slate-300" />
      <div className="absolute top-0 left-0 w-72 h-72 bg-blue-400 opacity-20 blur-3xl rounded-full" />
      <div className="absolute bottom-0 right-0 w-72 h-72 bg-purple-400 opacity-20 blur-3xl rounded-full" />

      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Dashboard Admin</h1>
        <p className="text-gray-500">Ringkasan aktivitas sistem pakar jurusan</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-5 gap-6 mb-8">
        <Card title="Total Konsultasi" value={totalKonsultasi} color="from-green-500 to-emerald-600" />
        <Card title="Konsultasi Hari Ini" value={konsultasiHariIni} color="from-teal-500 to-green-600" />
        <Card title="Pertanyaan Minat" value={totalHasil} color="from-blue-500 to-indigo-600" />
        <Card title="User" value={totalUser} color="from-purple-500 to-pink-600" />
        <Card title="Jurusan" value={totalJurusan} color="from-orange-500 to-red-600" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        {/* Grafik */}
        <div className="lg:col-span-2 bg-white/70 backdrop-blur-md p-6 rounded-2xl shadow-xl border border-gray-200">
          <h2 className="text-lg font-bold text-gray-800 mb-1">Tren Minat Jurusan</h2>
          <p className="text-sm text-gray-400 mb-4">Skor minat per jurusan setiap tahun</p>
          <Chart chartData={chartData} />
        </div>

        {/* Ranking */}
        <div className="bg-white/70 backdrop-blur-md p-6 rounded-2xl shadow-xl border border-gray-200">
          <h2 className="text-lg font-bold text-gray-800 mb-4">🏆 Ranking Jurusan</h2>
          <div className="flex flex-col gap-3">
            {ranking.map((item: (typeof ranking)[number], index: number) => {
              const nama = getNamaJurusan(item.jurusanId);
              const skor = item._sum.total || 0;
              const maxSkor = ranking[0]._sum.total || 1;
              const persen = Math.round((skor / maxSkor) * 100);
              const barColors = ["bg-yellow-400", "bg-gray-400", "bg-orange-400"];
              const medals = ["🥇", "🥈", "🥉"];
              return (
                <div key={item.jurusanId}>
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-sm font-semibold text-gray-700">
                      {medals[index] || "🎖️"} {nama}
                    </span>
                    <span className="text-sm font-bold text-gray-600">{skor} poin</span>
                  </div>
                  <div className="w-full bg-gray-100 rounded-full h-2.5">
                    <div
                      className={`h-2.5 rounded-full ${barColors[index] || "bg-blue-400"}`}
                      style={{ width: `${persen}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Aktivitas */}
      <div className="bg-white/70 backdrop-blur-md p-6 rounded-2xl shadow-xl border border-gray-200">
        <h2 className="text-lg font-bold text-gray-800 mb-4">Aktivitas Terbaru</h2>
        {recentKonsultasi.length === 0 ? (
          <p className="text-gray-500">Belum ada aktivitas</p>
        ) : (
          <ul className="space-y-4">
            {recentKonsultasi.map((item) => (
              <li key={item.id} className="flex justify-between items-center p-4 rounded-xl bg-white shadow-sm hover:shadow-md transition">
                <div>
                  <p className="font-semibold text-gray-800">{item.user?.name || "Guest"}</p>
                  <p className="text-gray-500 text-sm">melakukan konsultasi</p>
                </div>
                <div className="text-gray-400 text-xs">
                  {new Date(item.createdAt).toLocaleString("id-ID")}
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

function Card({ title, value, color }: { title: string; value: number; color: string }) {
  return (
    <div className={`p-5 rounded-2xl text-white shadow-lg bg-gradient-to-br ${color} hover:scale-105 transition`}>
      <p className="text-sm opacity-80">{title}</p>
      <h2 className="text-3xl font-bold mt-2">{value}</h2>
    </div>
  );
}

function getNamaJurusan(id: number) {
  switch (id) {
    case 1: return "Sains Teknik";
    case 2: return "Sains Kesehatan";
    case 3: return "Sosial Humaniora";
    default: return `Jurusan ${id}`;
  }
}

type ChartItem = { bulan: string; j1: number; j2: number; j3: number };

function Chart({ chartData }: { chartData: ChartItem[] }) {
  if (chartData.length === 0) {
    return (
      <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: 200, color: "#9ca3af", fontSize: 14 }}>
        Belum ada data untuk ditampilkan
      </div>
    );
  }

  const allValues = chartData.flatMap((d) => [d.j1, d.j2, d.j3]);
  const maxVal = Math.max(...allValues, 1);
  const W = 600, H = 240, padL = 40, padR = 20, padT = 20, padB = 50;
  const chartW = W - padL - padR;
  const chartH = H - padT - padB;
  const n = chartData.length;
  const groupW = chartW / n;
  const barW = Math.min(groupW / 4 - 4, 30);
  const colors = { j1: "#10b981", j2: "#6366f1", j3: "#f59e0b" };
  const labels = { j1: "Sains Teknik", j2: "Sains Kesehatan", j3: "Sosial Humaniora" };
  const keys = ["j1", "j2", "j3"] as const;
  const gridLines = [0, 0.25, 0.5, 0.75, 1].map((t) => ({
    y: padT + chartH * (1 - t),
    val: Math.round(maxVal * t),
  }));

  return (
    <div style={{ width: "100%", overflowX: "auto" }}>
      {/* Legend */}
      <div style={{ display: "flex", gap: 20, marginBottom: 12, flexWrap: "wrap" }}>
        {keys.map((key) => (
          <div key={key} style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 12, color: "#555" }}>
            <div style={{ width: 12, height: 12, borderRadius: 3, background: colors[key] }} />
            {labels[key]}
          </div>
        ))}
      </div>

      <svg viewBox={`0 0 ${W} ${H}`} style={{ width: "100%", height: "auto" }} xmlns="http://www.w3.org/2000/svg">
        {/* Grid */}
        {gridLines.map((g, i) => (
          <g key={i}>
            <line x1={padL} y1={g.y} x2={W - padR} y2={g.y} stroke="#e5e7eb" strokeWidth={1} strokeDasharray="4 3" />
            <text x={padL - 6} y={g.y + 4} textAnchor="end" fontSize={10} fill="#9ca3af">{g.val}</text>
          </g>
        ))}

        {/* Bars */}
        {chartData.map((d, i) => {
          const groupX = padL + i * groupW + groupW / 2;
          const offsets = [-barW - 4, 0, barW + 4];
          return (
            <g key={i}>
              {keys.map((key, ki) => {
                const val = d[key];
                const barH = (val / maxVal) * chartH;
                const x = groupX + offsets[ki] - barW / 2;
                const y = padT + chartH - barH;
                return (
                  <g key={key}>
                    <rect x={x} y={y} width={barW} height={barH} fill={colors[key]} rx={4} opacity={0.85}>
                      <title>{`${labels[key]}: ${val} (${d.bulan})`}</title>
                    </rect>
                    {val > 0 && (
                      <text x={x + barW / 2} y={y - 4} textAnchor="middle" fontSize={9} fill={colors[key]} fontWeight="700">
                        {val}
                      </text>
                    )}
                  </g>
                );
              })}
              {/* Tahun label */}
              <text x={groupX} y={H - 8} textAnchor="middle" fontSize={11} fill="#6b7280" fontWeight="600">
                {d.bulan}
              </text>
            </g>
          );
        })}

        {/* X axis line */}
        <line x1={padL} y1={padT + chartH} x2={W - padR} y2={padT + chartH} stroke="#e5e7eb" strokeWidth={1} />
      </svg>
    </div>
  );
}