"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Logo } from "./Logo";

const LINKS = [
  { href: "/check", label: "Check a message" },
  { href: "/radar", label: "Scam Radar" },
  { href: "/learn", label: "Learn & practise" },
  { href: "/research", label: "Research" },
];

export function Nav() {
  const path = usePathname();
  const [open, setOpen] = useState(false);
  return (
    <header className="glass sticky top-0 z-40 !border-x-0 !border-t-0">
      <div className="scroll-progress absolute inset-x-0 bottom-[-1px] h-[2px] bg-gradient-to-r from-red via-[#ff3b5c] to-violet" aria-hidden />
      <nav className="mx-auto flex h-16 max-w-7xl items-center gap-8 px-4 sm:px-6" aria-label="Main">
        <Link href="/" aria-label="Scam Decoder home" onClick={() => setOpen(false)}><Logo /></Link>
        <ul className="hidden items-center gap-1 lg:flex">
          {LINKS.slice(1).map((l) => (
            <li key={l.href}>
              <Link
                href={l.href}
                aria-current={path === l.href ? "page" : undefined}
                className={`rounded-lg px-3 py-2 text-[0.95rem] transition-colors ${path === l.href ? "bg-white/[0.08] text-white" : "text-ink-soft hover:text-white"}`}
              >
                {l.label}
              </Link>
            </li>
          ))}
        </ul>
        <Link href="/check" className="btn-primary ml-auto hidden rounded-xl px-4 py-2 text-[0.95rem] sm:inline-flex">
          Check a message
        </Link>
        <button
          className="ml-auto rounded-lg p-2 text-ink lg:hidden sm:ml-0"
          aria-expanded={open} aria-controls="mobile-nav" aria-label={open ? "Close menu" : "Open menu"}
          onClick={() => setOpen(!open)}
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden>
            {open ? <path d="M6 6l12 12M18 6L6 18" /> : <path d="M4 7h16M4 12h16M4 17h16" />}
          </svg>
        </button>
      </nav>
      {open && (
        <ul id="mobile-nav" className="border-t hairline px-4 pb-4 pt-2 lg:hidden">
          {LINKS.map((l) => (
            <li key={l.href}>
              <Link href={l.href} onClick={() => setOpen(false)} className={`block rounded-lg px-3 py-3 text-lg ${path === l.href ? "bg-white/[0.08] text-white" : "text-ink-soft"}`}>
                {l.label}
              </Link>
            </li>
          ))}
        </ul>
      )}
    </header>
  );
}
