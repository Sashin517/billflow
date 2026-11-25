"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";

const navLinks = [
  { name: "Features", href: "#features" },
  { name: "Pricing", href: "#pricing" },
  { name: "Integrations", href: "#integrations" },
  { name: "Security", href: "#security" },
  { name: "FAQ", href: "#faq" },
];

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full bg-black/70 backdrop-blur-xl border-b border-white/[0.06]">
      <div className="max-w-[1400px] mx-auto px-6 lg:px-10 h-20 flex items-center justify-between">
        {/* Left: Logo */}
        <Link href="/" className="flex items-center shrink-0">
          <div className="h-12 w-12 overflow-hidden flex items-center justify-center">
            <Image
              src="/images/logo.svg"
              alt="BillFlow"
              width={36}
              height={36}
              className="w-full h-full object-contain"
              priority
            />
          </div>
        </Link>

        {/* Center: Navigation Links */}
        <nav className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              href={link.href}
              className="text-sm text-white/80 hover:text-white transition-colors"
            >
              {link.name}
            </Link>
          ))}
        </nav>

        {/* Right: Auth & CTA */}
        <div className="hidden md:flex items-center gap-6">
          <Link
            href="/login"
            className="text-sm font-medium text-white/85 hover:text-white transition-colors"
          >
            Login
          </Link>
          <Link href="/invoices/new">
            <Button className="bg-primary hover:bg-primary-hover text-primary-foreground font-medium h-11 px-6 rounded-full">
              Get Started Free
            </Button>
          </Link>
        </div>

        {/* Mobile Menu Toggle */}
        <button
          type="button"
          onClick={() => setMobileOpen((prev) => !prev)}
          aria-label="Toggle Menu"
          className="md:hidden text-white/80 hover:text-white p-2"
        >
          {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Dropdown */}
      {mobileOpen && (
        <div className="md:hidden border-t border-white/10 bg-black/95 backdrop-blur-xl px-6 py-5 space-y-4">
          <nav className="flex flex-col gap-3">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                onClick={() => setMobileOpen(false)}
                className="text-sm text-white/80 hover:text-white py-1"
              >
                {link.name}
              </Link>
            ))}
          </nav>
          <div className="flex items-center gap-4 pt-3 border-t border-white/10">
            <Link
              href="/login"
              onClick={() => setMobileOpen(false)}
              className="text-sm font-medium text-white/85 hover:text-white"
            >
              Login
            </Link>
            <Link href="/invoices/new" onClick={() => setMobileOpen(false)}>
              <Button className="bg-primary hover:bg-primary-hover text-primary-foreground font-medium h-10 px-5 rounded-full">
                Get Started Free
              </Button>
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}