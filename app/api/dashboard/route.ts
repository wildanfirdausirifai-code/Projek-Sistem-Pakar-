import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET() {
  try {
    const totalKonsultasi = await prisma.consultation.count();
    const totalJawaban = await prisma.answer.count();
    const totalHasil = await prisma.result.count();

    // ranking jurusan (total skor)
    const ranking = await prisma.result.groupBy({
      by: ["jurusanId"],
      _sum: { total: true },
      orderBy: { _sum: { total: "desc" } },
    });

    // data konsultasi per bulan per jurusan (untuk grafik)
    const hasilPerBulan = await prisma.result.findMany({
      select: {
        jurusanId: true,
        total: true,
        consultation: {
          select: { createdAt: true },
        },
      },
    });

    // kelompokkan per bulan-tahun per jurusan
    const grouped: Record<string, Record<number, number>> = {};

    for (const item of hasilPerBulan) {
      const date = new Date(item.consultation.createdAt);
      const key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;
      if (!grouped[key]) grouped[key] = {};
      if (!grouped[key][item.jurusanId]) grouped[key][item.jurusanId] = 0;
      grouped[key][item.jurusanId] += item.total;
    }

    // urutkan bulan
    const sortedKeys = Object.keys(grouped).sort();
    const chartData = sortedKeys.map((bulan) => ({
      bulan,
      ...grouped[bulan],
    }));

    return NextResponse.json({
      totalKonsultasi,
      totalJawaban,
      totalHasil,
      ranking,
      chartData,
    });

  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { message: "Gagal ambil dashboard" },
      { status: 500 }
    );
  }
}