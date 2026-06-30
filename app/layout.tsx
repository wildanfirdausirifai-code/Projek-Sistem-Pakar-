import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="id">
      <body
        className={`${geistSans.variable} ${geistMono.variable}`}
      >
        <div className="min-h-screen relative overflow-hidden bg-gradient-to-br from-slate-100 via-gray-200 to-slate-300">

          {/* 🔵 Hiasan blur kiri atas */}
          <div className="absolute top-0 left-0 w-96 h-96 bg-blue-400 opacity-20 rounded-full blur-3xl"></div>

          {/* 🟣 Hiasan blur kanan bawah */}
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-purple-400 opacity-20 rounded-full blur-3xl"></div>

          {/* ⚪ layer transparan biar elegan */}
          <div className="absolute inset-0 bg-white/30 backdrop-blur-[2px]"></div>

          {/* CONTENT */}
          <div className="relative z-10">
            {children}
          </div>

        </div>
      </body>
    </html>
  );
}