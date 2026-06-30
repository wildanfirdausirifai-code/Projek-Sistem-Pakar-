export const dynamic = "force-dynamic";
import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { gejalaIds, userId } = body;

    // ✅ Validasi
    if (!Array.isArray(gejalaIds) || gejalaIds.length === 0) {
      return NextResponse.json(
        { message: "Gejala tidak boleh kosong" },
        { status: 400 }
      );
    }

    // =========================
    // 🔥 AMBIL RULE DARI DATABASE
    // =========================
    const rules = await prisma.rule.findMany({
      where: {
        gejalaId: {
          in: gejalaIds,
        },
      },
    });

    // =========================
    // 🔥 HITUNG SKOR
    // =========================
    const skor: Record<number, number> = {};

    rules.forEach((r) => {
      skor[r.jurusanId] = (skor[r.jurusanId] || 0) + 1;
    });

    // =========================
    // 🔥 FORMAT HASIL
    // =========================
    let hasilRaw = Object.keys(skor).map((jurusanId) => ({
      jurusanId: Number(jurusanId),
      total: skor[Number(jurusanId)],
    }));

    // 🔥 SORT
    hasilRaw.sort((a, b) => b.total - a.total);

    // 🔥 FILTER
    const hasilFiltered = hasilRaw.filter((h) => h.total > 0);

    // =========================
    // 🔥 AMBIL NAMA JURUSAN
    // =========================
    const jurusanList = await prisma.jurusan.findMany();

    const hasilWithNama = hasilRaw.map((h) => {
      const jurusan = jurusanList.find((j) => j.id === h.jurusanId);
      return {
        ...h,
        nama: jurusan?.nama || "Tidak diketahui",
      };
    });

    // =========================
    // 🔥 SIMPAN DATABASE (TRANSACTION)
    // =========================
    const consultation = await prisma.$transaction(async (tx) => {

      // 1️⃣ Consultation
      const consult = await tx.consultation.create({
        data: {
          userId: userId || "guest",
        },
      });

      // 2️⃣ Answer
      await tx.answer.createMany({
        data: gejalaIds.map((id: number) => ({
          consultationId: consult.id,
          gejalaId: id,
        })),
      });

      // 3️⃣ Result
      await tx.result.createMany({
        data: hasilFiltered.map((h) => ({
          consultationId: consult.id,
          jurusanId: h.jurusanId,
          total: h.total,
        })),
      });

      return consult;
    });

    return NextResponse.json({
      consultationId: consultation.id,
      hasil: hasilWithNama,
    });

  } catch (error) {
    console.error("DIAGNOSA ERROR:", error);

    return NextResponse.json(
      { message: "Terjadi kesalahan server" },
      { status: 500 }
    );
  }
}