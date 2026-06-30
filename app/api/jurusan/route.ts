import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET() {
  try {
    const data = await prisma.jurusan.findMany({ orderBy: { id: "asc" } });
    return NextResponse.json(data);
  } catch {
    return NextResponse.json({ message: "Gagal mengambil data" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const { kode, nama, deskripsi } = await req.json();

    if (!kode || !nama || !deskripsi) {
      return NextResponse.json({ message: "Semua field wajib diisi" }, { status: 400 });
    }

    const existing = await prisma.jurusan.findFirst({ where: { kode } });
    if (existing) {
      return NextResponse.json({ message: `Kode "${kode}" sudah digunakan` }, { status: 409 });
    }

    const data = await prisma.jurusan.create({
      data: { kode, nama, deskripsi, aktif: true },
    });
    return NextResponse.json(data, { status: 201 });
  } catch {
    return NextResponse.json({ message: "Gagal menambah data" }, { status: 500 });
  }
}