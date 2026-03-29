"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ThemeToggle } from "./ThemeToggle";
import { MobileMenu } from "./MobileMenu";

const NAV_LINKS = [
  { href: "/#groups", label: "Groups" },
  { href: "/#events", label: "Events" },
  { href: "/cfp", label: "CFP" },
  { href: "/sponsor", label: "Sponsor" },
  {
    href: "https://join.slack.com/t/cloud-native-nordics/shared_invite/zt-2ge0c6cmo-SDDeFUDeEU~TUkZTDcis8w",
    label: "Slack",
    external: true,
  },
];

export function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 backdrop-blur-md bg-warm-white/80 dark:bg-navy-deep/80 border-b border-gray-200/20 dark:border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="flex items-center gap-3">
            <Image
              src="/logo.svg"
              alt="Cloud Native Nordics"
              width={160}
              height={52}
              className="dark:brightness-100 brightness-0"
              priority
            />
          </Link>

          <div className="hidden md:flex items-center gap-6">
            {NAV_LINKS.map((link) => (
              <a
                key={link.href}
                href={link.href}
                target={link.external ? "_blank" : undefined}
                rel={link.external ? "noopener noreferrer" : undefined}
                className="text-sm font-medium text-navy/70 dark:text-gray-300 hover:text-brand-pink transition-colors"
              >
                {link.label}
              </a>
            ))}
            <ThemeToggle />
          </div>

          <div className="flex md:hidden items-center gap-2">
            <ThemeToggle />
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="p-2 rounded-lg hover:bg-navy/10 dark:hover:bg-white/10"
              aria-label="Toggle menu"
            >
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                {mobileOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>
      </div>

      {mobileOpen && <MobileMenu links={NAV_LINKS} onClose={() => setMobileOpen(false)} />}
    </nav>
  );
}
