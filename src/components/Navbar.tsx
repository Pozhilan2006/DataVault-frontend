"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { logout, isAuthenticated } from "@/lib/auth";
import { useEffect, useState } from "react";

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const [authed, setAuthed] = useState(false);

  useEffect(() => {
    setAuthed(isAuthenticated());
  }, [pathname]);

  const handleLogout = () => {
    logout();
    router.push("/login");
  };

  const navLinks = [
    { href: "/dashboard", label: "Dashboard" },
    { href: "/upload", label: "Upload" },
  ];

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-white/10 bg-brand-950/80 backdrop-blur-md">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
        {/* Logo */}
        <Link
          href={authed ? "/dashboard" : "/login"}
          className="flex items-center gap-2 text-xl font-bold text-white"
        >
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-brand-400 to-brand-600 text-sm font-black shadow-lg shadow-brand-600/40">
            DV
          </span>
          Data Vault
        </Link>

        {/* Links */}
        {authed && (
          <div className="flex items-center gap-2">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`rounded-lg px-4 py-2 text-sm font-medium transition-all duration-200 ${
                  pathname === link.href
                    ? "bg-brand-600 text-white shadow-md shadow-brand-600/30"
                    : "text-brand-200 hover:bg-white/10 hover:text-white"
                }`}
              >
                {link.label}
              </Link>
            ))}
            <button
              onClick={handleLogout}
              className="ml-3 rounded-lg border border-white/20 px-4 py-2 text-sm font-medium text-brand-200 transition-all duration-200 hover:border-red-400/50 hover:bg-red-500/10 hover:text-red-400"
            >
              Logout
            </button>
          </div>
        )}

        {/* Auth links when logged out */}
        {!authed && (
          <div className="flex items-center gap-2">
            <Link
              href="/login"
              className="rounded-lg px-4 py-2 text-sm font-medium text-brand-200 transition-all hover:text-white"
            >
              Login
            </Link>
            <Link
              href="/register"
              className="rounded-lg bg-brand-600 px-4 py-2 text-sm font-medium text-white shadow-md shadow-brand-600/30 transition-all hover:bg-brand-500"
            >
              Register
            </Link>
          </div>
        )}
      </div>
    </nav>
  );
}
