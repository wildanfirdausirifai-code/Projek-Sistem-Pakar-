"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import { Menu, X, LayoutDashboard, BookOpen, GraduationCap, LogOut, ChevronUp } from "lucide-react";

interface Props {
  hovered: boolean;
  setHovered: (v: boolean) => void;
}

export default function AdminSidebar({ hovered, setHovered }: Props) {
  const pathname = usePathname();
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [showProfile, setShowProfile] = useState(false);

  const menus = [
    { name: "Dashboard", href: "/admin/dashboard", icon: LayoutDashboard },
    { name: "Kelola Minat", href: "/admin/minat", icon: BookOpen },
    { name: "Kelola Jurusan", href: "/admin/jurusan", icon: GraduationCap },
  ];

  async function handleLogout() {
    await fetch("/api/logout", { method: "POST" });
    router.push("/admin-login");
  }

  return (
    <>
      <button
        className="md:hidden fixed top-4 left-4 z-50 bg-sky-50 text-sky-600 p-2 rounded-lg shadow border border-sky-200"
        onClick={() => setOpen(true)}
      >
        <Menu size={20} />
      </button>

      {open && (
        <div
          className="fixed inset-0 bg-black/30 z-40 md:hidden"
          onClick={() => setOpen(false)}
        />
      )}

      <aside
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => { setHovered(false); setShowProfile(false); }}
        className={`fixed top-0 left-0 h-full z-50 overflow-hidden
          bg-sky-50 border-r border-sky-100
          transition-[width] duration-150 ease-out
          ${open ? "translate-x-0" : "-translate-x-full"}
          md:translate-x-0
          ${hovered ? "md:w-56" : "md:w-14"}
        `}
      >
        {/* LOGO */}
        <div className="flex items-center px-3 py-5 border-b border-sky-100 gap-3">
          <div className="w-8 h-8 rounded-lg bg-sky-500 flex items-center justify-center shadow-sm flex-shrink-0">
            <GraduationCap size={16} className="text-white" />
          </div>
          <span className={`text-sky-900 font-bold text-sm tracking-tight whitespace-nowrap transition-opacity duration-100 ${hovered ? "opacity-100" : "opacity-0"}`}>
            Halaman Admin
          </span>
          <button className="md:hidden text-sky-400 hover:text-sky-600 ml-auto" onClick={() => setOpen(false)}>
            <X size={18} />
          </button>
        </div>

        {/* LABEL */}
        <div className="px-3 pt-4 pb-1">
          <span className={`text-xs font-semibold text-sky-400 uppercase tracking-widest whitespace-nowrap transition-opacity duration-100 ${hovered ? "opacity-100" : "opacity-0"}`}>
            Menu
          </span>
        </div>

        {/* MENU */}
        <nav className="px-2 space-y-0.5">
          {menus.map((menu) => {
            const active = pathname === menu.href;
            const Icon = menu.icon;
            return (
              <Link
                key={menu.href}
                href={menu.href}
                onClick={() => setOpen(false)}
                className={`flex items-center gap-3 px-2.5 py-2.5 rounded-xl text-sm font-medium transition-colors duration-100
                  ${active ? "bg-sky-500 text-white shadow-sm" : "text-sky-700 hover:text-sky-900 hover:bg-sky-100"}`}
              >
                <Icon size={17} className={`flex-shrink-0 ${active ? "text-white" : "text-sky-400"}`} />
                <span className={`whitespace-nowrap transition-opacity duration-100 ${hovered ? "opacity-100" : "opacity-0"}`}>
                  {menu.name}
                </span>
                {active && hovered && (
                  <span className="ml-auto w-1.5 h-1.5 rounded-full bg-white opacity-70 flex-shrink-0" />
                )}
              </Link>
            );
          })}
        </nav>

        {/* BOTTOM */}
        <div className="absolute bottom-0 left-0 right-0 px-2 py-3 border-t border-sky-100 bg-sky-100/50">
          {showProfile && hovered && (
            <div className="mb-2 bg-white rounded-xl border border-sky-100 shadow-md overflow-hidden">
              <div className="px-4 py-3 border-b border-sky-50">
                <p className="text-xs font-semibold text-sky-900">Administrator</p>
                <p className="text-xs text-sky-400">admin@sispak.id</p>
              </div>
              <button
                onClick={handleLogout}
                className="w-full flex items-center gap-2.5 px-4 py-2.5 text-sm text-red-500 hover:bg-red-50 transition-colors duration-100"
              >
                <LogOut size={14} />
                Logout
              </button>
            </div>
          )}

          <button
            onClick={() => setShowProfile(!showProfile)}
            className="w-full flex items-center gap-3 hover:bg-sky-100 rounded-xl px-2 py-1.5 transition-colors duration-100"
          >
            <div className="w-8 h-8 rounded-full bg-sky-200 flex items-center justify-center text-xs font-bold text-sky-700 flex-shrink-0">
              A
            </div>
            <div className={`flex-1 text-left transition-opacity duration-100 ${hovered ? "opacity-100" : "opacity-0"}`}>
              <p className="text-xs font-semibold text-sky-900 whitespace-nowrap">Admin</p>
              <p className="text-xs text-sky-400 whitespace-nowrap">admin@sispak.id</p>
            </div>
            {hovered && (
              <ChevronUp
                size={14}
                className={`text-sky-400 transition-transform duration-100 flex-shrink-0 ${showProfile ? "rotate-0" : "rotate-180"}`}
              />
            )}
          </button>
        </div>
      </aside>
    </>
  );
}