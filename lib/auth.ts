import jwt, { type JwtPayload, type Secret } from "jsonwebtoken";

const ISSUER = "sispak-jurusan";

function getSecret(): Secret {
  const secret = process.env.JWT_SECRET;

  if (!secret) {
    throw new Error("JWT_SECRET belum di-set di file .env");
  }

  return secret;
}

// ✅ Payload JWT (SUDAH FIX)
export type AppJwtPayload = {
  sub: string; // 🔥 ID user (standar JWT)
  role: "ADMIN" | "SISWA";
  name: string;
  email: string;
};

// ✅ SIGN TOKEN
export function signToken(payload: AppJwtPayload) {
  return jwt.sign(payload, getSecret(), {
    expiresIn: "7d",
    issuer: ISSUER,
  });
}

// ✅ VERIFY TOKEN
export function verifyToken(token: string): AppJwtPayload & JwtPayload {
  try {
    const decoded = jwt.verify(token, getSecret(), {
      issuer: ISSUER,
    });

    if (typeof decoded === "string") {
      throw new Error("Token tidak valid");
    }

    return decoded as AppJwtPayload & JwtPayload;

  } catch (error) {
    throw new Error("Token invalid / expired");
  }
}