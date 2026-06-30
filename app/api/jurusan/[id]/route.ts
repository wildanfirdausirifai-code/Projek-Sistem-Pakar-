import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function PUT(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: idStr } = await params;
    const id = parseInt(idStr);
    const { kode, nama, deskripsi, aktif } = await req.json();

    if (!kode || !nama || !deskripsi) {
      return NextResponse.json({ message: "Semua field wajib diisi" }, { status: 400 });
    }

    const existing = await prisma.jurusan.findFirst({
      where: { kode, NOT: { id } },
    });
    if (existing) {
      return NextResponse.json({ message: `Kode "${kode}" sudah digunakan` }, { status: 409 });
    }

    const data = await prisma.jurusan.update({
      where: { id },
      data: { kode, nama, deskripsi, aktif: aktif ?? true },
    });
    return NextResponse.json(data);
  } catch {
    return NextResponse.json({ message: "Gagal mengupdate data" }, { status: 500 });
  }
}

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: idStr } = await params;
    const id = parseInt(idStr);
    const { aktif } = await req.json();

    const data = await prisma.jurusan.update({
      where: { id },
      data: { aktif },
    });
    return NextResponse.json(data);
  } catch {
    return NextResponse.json({ message: "Gagal mengupdate status" }, { status: 500 });
  }
}

export async function DELETE(
  _: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: idStr } = await params;
    const id = parseInt(idStr);
    await prisma.jurusan.delete({ where: { id } });
    return NextResponse.json({ message: "Berhasil dihapus" });
  } catch {
    return NextResponse.json({ message: "Gagal menghapus data" }, { status: 500 });
  }
}