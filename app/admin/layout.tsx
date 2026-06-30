"use client";

import AdminSidebar from "@/components/AdminSidebar";
import { useState } from "react";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [hovered, setHovered] = useState(false);

  return (
    <div className="flex min-h-screen">
      <AdminSidebar hovered={hovered} setHovered={setHovered} />
      <main className={`flex-1 p-6 transition-[margin] duration-150 ease-out ${hovered ? "ml-56" : "ml-14"}`}>
        {children}
      </main>
    </div>
  );
}