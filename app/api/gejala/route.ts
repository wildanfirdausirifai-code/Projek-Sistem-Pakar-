import { NextResponse } from "next/server";
import prisma from "../../../lib/prisma";

export async function GET() {
  try {
    const data = await prisma.gejala.findMany({ orderBy: { kode: "asc" } });
    return NextResponse.json(data);
  } catch {
    return NextResponse.json({ message: "Gagal mengambil data" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const { kode, nama } = await req.json();

    if (!kode || !nama) {
      return NextResponse.json({ message: "Kode dan nama wajib diisi" }, { status: 400 });
    }

    // Cek duplikat kode
    const existing = await prisma.gejala.findFirst({ where: { kode } });
    if (existing) {
      return NextResponse.json({ message: `Kode "${kode}" sudah digunakan` }, { status: 409 });
    }

    const data = await prisma.gejala.create({ data: { kode, nama } });
    return NextResponse.json(data, { status: 201 });
  } catch {
    return NextResponse.json({ message: "Gagal menambah data" }, { status: 500 });
  }
}