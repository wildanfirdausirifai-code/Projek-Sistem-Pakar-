import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET() {
  try {
    // ambil semua consultation
    const consultations = await prisma.consultation.findMany({
      orderBy: {
        createdAt: "desc",
      },
    });

    // ambil semua result
    const results = await prisma.result.findMany();

    // mapping manual (JOIN)
    const data = consultations.map((c) => {
      const hasil = results
        .filter((r) => r.consultationId === c.id)
        .sort((a, b) => b.total - a.total);

      return {
        id: c.id,
        createdAt: c.createdAt,
        result: hasil,
      };
    });

    return NextResponse.json(data);

  } catch (error) {
    console.error("RIWAYAT ERROR:", error);

    return NextResponse.json(
      { message: "Terjadi kesalahan server" },
      { status: 500 }
    );
  }
}