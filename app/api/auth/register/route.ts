import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import prisma from "@/lib/prisma";
import { signToken } from "@/lib/auth";

// 🔥 OPTIONAL (biar type aman)
type Role = "SISWA" | "ADMIN";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const name = String(body?.name ?? "").trim();
    const email = String(body?.email ?? "").trim().toLowerCase();
    const password = String(body?.password ?? "");

    // =========================
    // VALIDASI
    // =========================
    if (!name || !email || !password) {
      return NextResponse.json(
        { message: "Name, email, dan password wajib diisi" },
        { status: 400 }
      );
    }

    if (password.length < 6) {
      return NextResponse.json(
        { message: "Password minimal 6 karakter" },
        { status: 400 }
      );
    }

    // =========================
    // CEK EMAIL
    // =========================
    const existing = await prisma.user.findUnique({
      where: { email },
    });

    if (existing) {
      return NextResponse.json(
        { message: "Email sudah terdaftar" },
        { status: 409 }
      );
    }

    // =========================
    // HASH PASSWORD
    // =========================
    const hashed = await bcrypt.hash(password, 10);

    // =========================
    // SIMPAN USER
    // =========================
    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashed,
        role: "SISWA", // default role
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        createdAt: true,
      },
    });

    // =========================
    // TOKEN
    // =========================
    const token = signToken({
      sub: user.id,
      role: user.role as Role, // ✅ FIX ERROR TS
      name: user.name,
      email: user.email,
    });

    // =========================
    // RESPONSE + COOKIE
    // =========================
    const res = NextResponse.json({ user }, { status: 201 });

    res.cookies.set("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 7, // 7 hari
    });

    return res;

  } catch (err) {
    console.error("REGISTER ERROR:", err);

    return NextResponse.json(
      { message: "Terjadi kesalahan server" },
      { status: 500 }
    );
  }
}