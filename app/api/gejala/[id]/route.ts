import { NextResponse } from "next/server";
import prisma from "../../../../lib/prisma";

export async function PUT(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: idStr } = await params;
    const id = Number.parseInt(idStr);
    const { kode, nama } = await req.json();

    if (!kode || !nama) {
      return NextResponse.json({ message: "Kode dan nama wajib diisi" }, { status: 400 });
    }

    const existing = await prisma.gejala.findFirst({
      where: { kode, NOT: { id } },
    });
    if (existing) {
      return NextResponse.json({ message: `Kode "${kode}" sudah digunakan` }, { status: 409 });
    }

    const data = await prisma.gejala.update({ where: { id }, data: { kode, nama } });
    return NextResponse.json(data);
  } catch {
    return NextResponse.json({ message: "Gagal mengupdate data" }, { status: 500 });
  }
}

export async function DELETE(
  _: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: idStr } = await params;
    const id = Number.parseInt(idStr);
    await prisma.gejala.delete({ where: { id } });
    return NextResponse.json({ message: "Berhasil dihapus" });
  } catch {
    return NextResponse.json({ message: "Gagal menghapus data" }, { status: 500 });
  }
}