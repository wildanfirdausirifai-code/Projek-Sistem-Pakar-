import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { verifyToken } from "@/lib/auth";

export async function GET() {
  try {
    const cookieStore = await cookies(); // ✅ FIX DI SINI
    const token = cookieStore.get("token")?.value;

    if (!token) {
      return NextResponse.json(
        { message: "Unauthorized" },
        { status: 401 }
      );
    }

    const user = verifyToken(token);

    return NextResponse.json({ user });

  } catch (err) {
    console.error("ME ERROR:", err);

    return NextResponse.json(
      { message: "Invalid token" },
      { status: 401 }
    );
  }
}