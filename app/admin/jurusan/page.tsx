"use client";

import { useEffect, useState } from "react";
import { Pencil, Trash2, Plus, Save, X, CheckCircle, AlertCircle, Info, ToggleLeft, ToggleRight } from "lucide-react";

type Jurusan = {
  id: number;
  kode: string;
  nama: string;
  deskripsi: string;
  aktif: boolean;
};

type Toast = {
  id: number;
  type: "success" | "error" | "warning";
  message: string;
};

export default function KelolaJurusanPage() {
  const [data, setData] = useState<Jurusan[]>([]);
  const [form, setForm] = useState({ kode: "", nama: "", deskripsi: "" });
  const [editId, setEditId] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [toasts, setToasts] = useState<Toast[]>([]);

  const showToast = (type: Toast["type"], message: string) => {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, type, message }]);
    setTimeout(() => setToasts((prev) => prev.filter((t) => t.id !== id)), 3500);
  };

  const fetchData = async () => {
    const res = await fetch("/api/jurusan");
    const result = await res.json();
    setData(result);
  };

  useEffect(() => { fetchData(); }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    if (!form.kode || !form.nama || !form.deskripsi) {
      showToast("warning", "Semua field wajib diisi!");
      return;
    }
    setLoading(true);
    try {
      let res: Response;
      if (editId) {
        res = await fetch(`/api/jurusan/${editId}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(form),
        });
      } else {
        res = await fetch("/api/jurusan", {
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
            prev.map((item) =>
              item.id === editId ? { ...item, ...form } : item
            )
          );
          showToast("success", "Data berhasil diperbarui!");
        } else {
          await fetchData();
          showToast("success", "Jurusan berhasil ditambahkan!");
        }
        setForm({ kode: "", nama: "", deskripsi: "" });
        setEditId(null);
      }
    } catch {
      showToast("error", "Gagal terhubung ke server");
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (item: Jurusan) => {
    setForm({ kode: item.kode, nama: item.nama, deskripsi: item.deskripsi });
    setEditId(item.id);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleCancel = () => {
    setForm({ kode: "", nama: "", deskripsi: "" });
    setEditId(null);
  };

  const handleDelete = async (id: number, nama: string) => {
    if (!confirm(`Hapus jurusan "${nama}"?`)) return;
    try {
      const res = await fetch(`/api/jurusan/${id}`, { method: "DELETE" });
      if (res.ok) {
        showToast("success", `Jurusan "${nama}" berhasil dihapus`);
        setData((prev) => prev.filter((item) => item.id !== id));
      } else {
        showToast("error", "Gagal menghapus data");
      }
    } catch {
      showToast("error", "Gagal terhubung ke server");
    }
  };

  const handleToggleAktif = async (item: Jurusan) => {
    try {
      const res = await fetch(`/api/jurusan/${item.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ aktif: !item.aktif }),
      });
      if (res.ok) {
        setData((prev) =>
          prev.map((d) => d.id === item.id ? { ...d, aktif: !item.aktif } : d)
        );
        showToast("success", `Jurusan "${item.nama}" ${!item.aktif ? "diaktifkan" : "dinonaktifkan"}`);
      } else {
        showToast("error", "Gagal mengubah status");
      }
    } catch {
      showToast("error", "Gagal terhubung ke server");
    }
  };

  const filtered = data.filter(
    (d) =>
      d.kode.toLowerCase().includes(search.toLowerCase()) ||
      d.nama.toLowerCase().includes(search.toLowerCase()) ||
      d.deskripsi.toLowerCase().includes(search.toLowerCase())
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
          <div key={t.id} className={`flex items-center gap-2.5 px-4 py-3 rounded-xl border shadow-lg text-sm font-medium ${toastBg(t.type)}`}>
            {toastIcon(t.type)}
            <span>{t.message}</span>
          </div>
        ))}
      </div>

      {/* HEADER */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-1">
          <div className="w-1 h-7 bg-green-500 rounded-full" />
          <h1 className="text-2xl font-bold text-gray-900">Kelola Jurusan</h1>
        </div>
        <p className="text-gray-500 text-sm ml-4">Tambah, edit, hapus, dan atur status aktif jurusan</p>
      </div>

      {/* FORM CARD */}
      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm mb-6 overflow-hidden">
        <div className="flex items-center gap-2 px-5 py-4 border-b border-gray-100 bg-gray-50">
          <div className={`w-2 h-2 rounded-full ${editId ? "bg-amber-400" : "bg-green-400"}`} />
          <span className="text-sm font-semibold text-gray-700">
            {editId ? "Edit Data Jurusan" : "Tambah Data Jurusan Baru"}
          </span>
        </div>

        <div className="p-5 space-y-4">
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="sm:w-1/4">
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">Kode</label>
              <input
                name="kode"
                value={form.kode}
                onChange={handleChange}
                placeholder="J1, J2, ..."
                className="w-full border border-gray-200 bg-gray-50 focus:bg-white focus:border-green-400 focus:ring-2 focus:ring-green-100 px-3 py-2.5 rounded-xl text-gray-800 placeholder-gray-400 text-sm outline-none transition"
              />
            </div>
            <div className="flex-1">
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">Nama Jurusan</label>
              <input
                name="nama"
                value={form.nama}
                onChange={handleChange}
                placeholder="Nama jurusan..."
                className="w-full border border-gray-200 bg-gray-50 focus:bg-white focus:border-green-400 focus:ring-2 focus:ring-green-100 px-3 py-2.5 rounded-xl text-gray-800 placeholder-gray-400 text-sm outline-none transition"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">Deskripsi</label>
            <textarea
              name="deskripsi"
              value={form.deskripsi}
              onChange={handleChange}
              placeholder="Deskripsi singkat jurusan..."
              rows={3}
              className="w-full border border-gray-200 bg-gray-50 focus:bg-white focus:border-green-400 focus:ring-2 focus:ring-green-100 px-3 py-2.5 rounded-xl text-gray-800 placeholder-gray-400 text-sm outline-none transition resize-none"
            />
          </div>

          <div className="flex gap-2">
            <button
              onClick={handleSubmit}
              disabled={loading}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold text-white transition shadow-sm
                ${editId ? "bg-amber-500 hover:bg-amber-600" : "bg-green-500 hover:bg-green-600"} disabled:opacity-60`}
            >
              {editId ? <Save size={15} /> : <Plus size={15} />}
              {loading ? "Menyimpan..." : editId ? "Simpan Perubahan" : "Tambah Jurusan"}
            </button>
            {editId && (
              <button onClick={handleCancel} className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold text-gray-600 bg-gray-100 hover:bg-gray-200 transition">
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
            <span className="text-sm font-semibold text-gray-700">Daftar Jurusan</span>
            <span className="ml-2 bg-green-100 text-green-700 text-xs font-bold px-2 py-0.5 rounded-full">{data.length} data</span>
          </div>
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Cari kode, nama, atau deskripsi..."
            className="border border-gray-200 bg-gray-50 focus:bg-white focus:border-green-400 focus:ring-2 focus:ring-green-100 px-3 py-2 rounded-xl text-sm text-gray-700 placeholder-gray-400 outline-none transition w-full sm:w-64"
          />
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-100 text-gray-600 text-xs uppercase tracking-wide">
                <th className="text-left px-5 py-3 font-bold w-24">Kode</th>
                <th className="text-left px-5 py-3 font-bold w-48">Nama</th>
                <th className="text-left px-5 py-3 font-bold">Deskripsi</th>
                <th className="text-center px-5 py-3 font-bold w-28">Status</th>
                <th className="text-right px-5 py-3 font-bold w-36">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={5} className="text-center py-12 text-gray-400">
                    <div className="flex flex-col items-center gap-2">
                      <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-gray-300 text-xl">?</div>
                      <span className="text-sm">Belum ada data</span>
                    </div>
                  </td>
                </tr>
              ) : (
                filtered.map((item) => (
                  <tr key={item.id} className={`hover:bg-green-50 transition ${editId === item.id ? "bg-amber-50" : ""} ${!item.aktif ? "opacity-50" : ""}`}>
                    <td className="px-5 py-4">
                      <span className={`inline-flex items-center px-2.5 py-1 rounded-lg font-mono font-bold text-xs ${item.aktif ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-500"}`}>
                        {item.kode}
                      </span>
                    </td>
                    <td className="px-5 py-4 text-gray-900 font-semibold">{item.nama}</td>
                    <td className="px-5 py-4 text-gray-600">{item.deskripsi}</td>
                    <td className="px-5 py-4 text-center">
                      <button
                        onClick={() => handleToggleAktif(item)}
                        className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                          item.aktif
                            ? "bg-green-100 text-green-700 hover:bg-green-200"
                            : "bg-gray-100 text-gray-500 hover:bg-gray-200"
                        }`}
                      >
                        {item.aktif
                          ? <><ToggleRight size={15} /> Aktif</>
                          : <><ToggleLeft size={15} /> Nonaktif</>
                        }
                      </button>
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex items-center justify-end gap-1">
                        <button
                          onClick={() => handleEdit(item)}
                          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-blue-700 bg-blue-50 hover:bg-blue-100 transition"
                        >
                          <Pencil size={13} /> Edit
                        </button>
                        <button
                          onClick={() => handleDelete(item.id, item.nama)}
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
          <div className="px-5 py-3 border-t border-gray-100 bg-gray-50 flex items-center justify-between">
            <span className="text-xs text-gray-500">Menampilkan {filtered.length} dari {data.length} data</span>
            <div className="flex items-center gap-3 text-xs text-gray-500">
              <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-green-400 inline-block" /> Aktif: {data.filter(d => d.aktif).length}</span>
              <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-gray-300 inline-block" /> Nonaktif: {data.filter(d => !d.aktif).length}</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}