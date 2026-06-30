"use client";

import { useEffect, useState } from "react";
import { Pencil, Trash2, Plus, Save, X, CheckCircle, AlertCircle, Info } from "lucide-react";

type Gejala = {
  id: number;
  kode: string;
  nama: string;
};

type Toast = {
  id: number;
  type: "success" | "error" | "warning";
  message: string;
};

export default function KelolaMinatPage() {
  const [data, setData] = useState<Gejala[]>([]);
  const [form, setForm] = useState({ kode: "", nama: "" });
  const [editId, setEditId] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [toasts, setToasts] = useState<Toast[]>([]);

  const showToast = (type: Toast["type"], message: string) => {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, type, message }]);
    setTimeout(() => setToasts((prev) => prev.filter((t) => t.id !== id)), 3500);
  };

  const sortData = (arr: Gejala[]) =>
    [...arr].sort((a, b) => {
      const numA = parseInt(a.kode.replace(/\D/g, ""));
      const numB = parseInt(b.kode.replace(/\D/g, ""));
      if (!isNaN(numA) && !isNaN(numB)) return numA - numB;
      return a.kode.localeCompare(b.kode);
    });

  const fetchData = async () => {
    const res = await fetch("/api/gejala");
    const result = await res.json();
    setData(sortData(result));
  };

  useEffect(() => { fetchData(); }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    if (!form.kode || !form.nama) {
      showToast("warning", "Kode dan Nama Minat wajib diisi!");
      return;
    }

    setLoading(true);
    try {
      let res: Response;

      if (editId) {
        res = await fetch(`/api/gejala/${editId}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(form),
        });
      } else {
        res = await fetch("/api/gejala", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(form),
        });
      }

      const result = await res.json();

      if (!res.ok) {
        showToast("error", result.message || "Terjadi kesalahan");
      } else {
        if (editId) {
          setData((prev) =>
            sortData(
              prev.map((item) =>
                item.id === editId ? { ...item, kode: form.kode, nama: form.nama } : item
              )
            )
          );
          showToast("success", "Data berhasil diperbarui!");
        } else {
          await fetchData();
          showToast("success", "Data berhasil ditambahkan!");
        }
        setForm({ kode: "", nama: "" });
        setEditId(null);
      }
    } catch {
      showToast("error", "Gagal terhubung ke server");
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (item: Gejala) => {
    setForm({ kode: item.kode, nama: item.nama });
    setEditId(item.id);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleCancel = () => {
    setForm({ kode: "", nama: "" });
    setEditId(null);
  };

  const handleDelete = async (id: number, kode: string) => {
    if (!confirm(`Hapus minat "${kode}"?`)) return;
    try {
      const res = await fetch(`/api/gejala/${id}`, { method: "DELETE" });
      if (res.ok) {
        showToast("success", `Minat "${kode}" berhasil dihapus`);
        setData((prev) => prev.filter((item) => item.id !== id));
      } else {
        showToast("error", "Gagal menghapus data");
      }
    } catch {
      showToast("error", "Gagal terhubung ke server");
    }
  };

  const filtered = data.filter(
    (d) =>
      d.kode.toLowerCase().includes(search.toLowerCase()) ||
      d.nama.toLowerCase().includes(search.toLowerCase())
  );

  const toastIcon = (type: Toast["type"]) => {
    if (type === "success") return <CheckCircle size={16} className="text-green-500 shrink-0" />;
    if (type === "error") return <AlertCircle size={16} className="text-red-500 shrink-0" />;
    return <Info size={16} className="text-amber-500 shrink-0" />;
  };

  const toastBg = (type: Toast["type"]) => {
    if (type === "success") return "bg-green-50 border-green-200 text-green-800";
    if (type === "error") return "bg-red-50 border-red-200 text-red-800";
    return "bg-amber-50 border-amber-200 text-amber-800";
  };

  return (
    <div className="p-6 md:p-8 min-h-screen bg-gray-50">

      {/* TOAST */}
      <div className="fixed top-5 right-5 z-50 flex flex-col gap-2 w-80">
        {toasts.map((t) => (
          <div
            key={t.id}
            className={`flex items-center gap-2.5 px-4 py-3 rounded-xl border shadow-lg text-sm font-medium ${toastBg(t.type)}`}
          >
            {toastIcon(t.type)}
            <span>{t.message}</span>
          </div>
        ))}
      </div>

      {/* HEADER */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-1">
          <div className="w-1 h-7 bg-green-500 rounded-full" />
          <h1 className="text-2xl font-bold text-gray-900">Kelola Minat</h1>
        </div>
        <p className="text-gray-500 text-sm ml-4">Tambah, edit, dan hapus data minat siswa</p>
      </div>

      {/* FORM CARD */}
      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm mb-6 overflow-hidden">
        <div className="flex items-center gap-2 px-5 py-4 border-b border-gray-100 bg-gray-50">
          <div className={`w-2 h-2 rounded-full ${editId ? "bg-amber-400" : "bg-green-400"}`} />
          <span className="text-sm font-semibold text-gray-700">
            {editId ? "Edit Data Minat" : "Tambah Data Minat Baru"}
          </span>
        </div>

        <div className="p-5">
          <div className="flex flex-col sm:flex-row gap-3 mb-4">
            <div className="sm:w-1/4">
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">
                Kode
              </label>
              <input
                name="kode"
                value={form.kode}
                onChange={handleChange}
                placeholder="F1, F2, ..."
                className="w-full border border-gray-200 bg-gray-50 focus:bg-white focus:border-green-400 focus:ring-2 focus:ring-green-100 px-3 py-2.5 rounded-xl text-gray-800 placeholder-gray-400 text-sm outline-none transition"
              />
            </div>
            <div className="flex-1">
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">
                Nama Minat
              </label>
              <input
                name="nama"
                value={form.nama}
                onChange={handleChange}
                placeholder="Deskripsi minat siswa..."
                className="w-full border border-gray-200 bg-gray-50 focus:bg-white focus:border-green-400 focus:ring-2 focus:ring-green-100 px-3 py-2.5 rounded-xl text-gray-800 placeholder-gray-400 text-sm outline-none transition"
              />
            </div>
          </div>

          <div className="flex gap-2">
            <button
              onClick={handleSubmit}
              disabled={loading}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold text-white transition shadow-sm
                ${editId ? "bg-amber-500 hover:bg-amber-600" : "bg-green-500 hover:bg-green-600"} disabled:opacity-60`}
            >
              {editId ? <Save size={15} /> : <Plus size={15} />}
              {loading ? "Menyimpan..." : editId ? "Simpan Perubahan" : "Tambah Minat"}
            </button>
            {editId && (
              <button
                onClick={handleCancel}
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold text-gray-600 bg-gray-100 hover:bg-gray-200 transition"
              >
                <X size={15} /> Batal
              </button>
            )}
          </div>
        </div>
      </div>

      {/* TABLE CARD */}
      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 px-5 py-4 border-b border-gray-100">
          <div>
            <span className="text-sm font-semibold text-gray-700">Daftar Minat</span>
            <span className="ml-2 bg-green-100 text-green-700 text-xs font-bold px-2 py-0.5 rounded-full">
              {data.length} data
            </span>
          </div>
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Cari kode atau nama..."
            className="border border-gray-200 bg-gray-50 focus:bg-white focus:border-green-400 focus:ring-2 focus:ring-green-100 px-3 py-2 rounded-xl text-sm text-gray-700 placeholder-gray-400 outline-none transition w-full sm:w-56"
          />
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-100 text-gray-600 text-xs uppercase tracking-wide">
                <th className="text-left px-5 py-3 font-bold w-24">Kode</th>
                <th className="text-left px-5 py-3 font-bold">Nama Minat</th>
                <th className="text-right px-5 py-3 font-bold w-32">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={3} className="text-center py-12 text-gray-400">
                    <div className="flex flex-col items-center gap-2">
                      <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-gray-300 text-xl">?</div>
                      <span className="text-sm">Belum ada data</span>
                    </div>
                  </td>
                </tr>
              ) : (
                filtered.map((item) => (
                  <tr
                    key={item.id}
                    className={`hover:bg-green-50 transition ${editId === item.id ? "bg-amber-50" : ""}`}
                  >
                    <td className="px-5 py-4">
                      <span className="inline-flex items-center px-2.5 py-1 rounded-lg bg-green-100 text-green-800 font-mono font-bold text-xs">
                        {item.kode}
                      </span>
                    </td>
                    <td className="px-5 py-4 text-gray-900 font-medium">{item.nama}</td>
                    <td className="px-5 py-4">
                      <div className="flex items-center justify-end gap-1">
                        <button
                          onClick={() => handleEdit(item)}
                          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-blue-700 bg-blue-50 hover:bg-blue-100 transition"
                        >
                          <Pencil size={13} /> Edit
                        </button>
                        <button
                          onClick={() => handleDelete(item.id, item.kode)}
                          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-red-600 bg-red-50 hover:bg-red-100 transition"
                        >
                          <Trash2 size={13} /> Hapus
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {filtered.length > 0 && (
          <div className="px-5 py-3 border-t border-gray-100 bg-gray-50">
            <span className="text-xs text-gray-500">
              Menampilkan {filtered.length} dari {data.length} data
            </span>
          </div>
        )}
      </div>
    </div>
  );
}