"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

type User = {
  name: string;
  email: string;
};

export default function ProfileMenu() {
  const [user, setUser] = useState<User | null>(null);
  const [open, setOpen] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);
  const router = useRouter();

  useEffect(() => {
    const getUser = async (): Promise<void> => {
      try {
        const res = await fetch("/api/me", {
          credentials: "include",
          cache: "no-store",
        });

        if (!res.ok) {
          throw new Error("Gagal fetch user");
        }

        const data: { user: User } = await res.json();
        setUser(data.user);
      } catch (error) {
        console.error("Gagal ambil user:", error);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    void getUser();
  }, []);

  const initial: string = user?.name?.charAt(0)?.toUpperCase() ?? "U";

  const handleLogout = async (): Promise<void> => {
    await fetch("/api/logout", { method: "POST" });
    router.push("/login");
  };

  return (
    <div className="relative">
      {/* PROFILE BUTTON */}
      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        className="
          flex items-center gap-3
          bg-white px-4 py-2
          rounded-xl shadow
          cursor-pointer
          hover:bg-gray-50
          transition
        "
      >
        {/* Avatar */}
        <div className="w-10 h-10 flex items-center justify-center rounded-full bg-green-600 text-white font-bold">
          {initial}
        </div>

        {/* Name */}
        <div className="text-sm text-left">
          <div className="font-semibold text-gray-800">
            {loading ? "Loading..." : user?.name ?? "User"}
          </div>
          <div className="text-xs text-gray-500">
            {!loading && user?.email ? user.email : ""}
          </div>
        </div>
      </button>

      {/* DROPDOWN */}
      {open && (
        <div className="absolute right-0 mt-2 w-44 bg-white rounded-xl shadow-lg p-2 z-50">
          <button
            type="button"
            onClick={handleLogout}
            className="
              w-full text-left px-3 py-2
              rounded-lg
              hover:bg-red-100
              text-red-600
            "
          >
            Logout
          </button>
        </div>
      )}
    </div>
  );
}