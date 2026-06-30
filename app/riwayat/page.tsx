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

export default function RiwayatPage() {
  const router = useRouter();
  const [data, setData] = useState<Riwayat[]>([]);

  useEffect(() => {
    fetch("/api/riwayat")
      .then((res) => res.json())
      .then((res) => setData(res))
      .catch(() => setData([]));
  }, []);

  return (
    <div className="max-w-3xl mx-auto space-y-6">

      {/* HEADER */}
      <div className="flex items-center gap-3">
        <button
          onClick={() => router.push("/dashboard")}
          className="flex items-center justify-center w-8 h-8 rounded-full bg-gray-100 hover:bg-blue-100 hover:text-blue-600 text-gray-500 transition-colors"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-4 w-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 19l-7-7 7-7"
            />
          </svg>
        </button>

        <h1 className="text-2xl font-bold text-gray-800">
          Riwayat Konsultasi
        </h1>
      </div>

      {data.length === 0 && (
        <p className="text-gray-500">Belum ada riwayat</p>
      )}

      {data.map((item, index) => {
        const sortedResult = [...(item.result || [])].sort(
          (a, b) => b.total - a.total
        );

        return (
          <div
            key={item.id}
            className="bg-white p-5 rounded-xl shadow"
          >
            <p className="text-sm text-gray-500">
              Konsultasi #{index + 1}
            </p>

            <p className="text-xs text-gray-400 mb-3">
              {new Date(item.createdAt).toLocaleString()}
            </p>

            {sortedResult.length === 0 ? (
              <p className="text-gray-400 italic">
                Tidak ada hasil
              </p>
            ) : (
              <div className="space-y-2">
                {sortedResult.map((r, i) => (
                  <div
                    key={i}
                    className="p-3 rounded-lg bg-gray-50 border"
                  >
                    <p
                      className={`font-semibold ${
                        r.jurusanId === 1
                          ? "text-blue-600"
                          : r.jurusanId === 2
                          ? "text-green-600"
                          : "text-purple-600"
                      }`}
                    >
                      {getNamaJurusan(r.jurusanId)}
                    </p>

                    <p className="text-sm text-gray-500">
                      Skor: {r.total}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

function getNamaJurusan(id: number) {
  switch (id) {
    case 1:
      return "Sains Teknik";
    case 2:
      return "Sains Kesehatan";
    case 3:
      return "Sosial Humaniora";
    default:
      return "Tidak diketahui";
  }
}