"use client";

import Link from "next/link";
import Image from "next/image";

const menuLinks = [
  { label: "Home", href: "#" },
  { label: "Features", href: "#features" },
  { label: "Compliance", href: "#compliance" },
  { label: "Workflows", href: "#workflows" },
];

const appLinks = [
  { label: "Dashboard", href: "/dashboard" },
  { label: "Create Invoice", href: "/invoices/new" },
  { label: "Login", href: "/login" },
  { label: "Get Started", href: "/register" },
];

const socialLinks = [
  {
    label: "LinkedIn",
    href: "https://linkedin.com",
    icon: (
      <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
        <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.88 8.56a1.68 1.68 0 0 0 1.68-1.68c0-.93-.75-1.69-1.68-1.69a1.69 1.69 0 0 0-1.69 1.69c0 .93.76 1.68 1.69 1.68m1.39 9.94v-8.37H5.5v8.37h2.77z" />
      </svg>
    ),
  },
  {
    label: "X (Twitter)",
    href: "https://x.com",
    icon: (
      <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
      </svg>
    ),
  },
  {
    label: "Facebook",
    href: "https://facebook.com",
    icon: (
      <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
        <path d="M12 2.04c-5.5 0-10 4.49-10 10.02 0 5 3.66 9.15 8.44 9.9v-7H7.9v-2.9h2.54V9.85c0-2.51 1.49-3.89 3.78-3.89 1.09 0 2.23.19 2.23.19v2.47h-1.26c-1.24 0-1.63.77-1.63 1.56v1.88h2.78l-.45 2.9h-2.33v7a10 10 0 0 0 8.44-9.9c0-5.53-4.5-10.02-10-10.02z" />
      </svg>
    ),
  },
];

export default function Footer() {
  return (
    <footer className="relative w-full overflow-hidden bg-[#141413] border-t border-white/[0.08] px-6 sm:px-10 lg:px-12 pt-20">
      <div className="max-w-[1400px] mx-auto w-full">
        {/* Top Content Grid */}
        <div className="grid grid-cols-2 md:grid-cols-6 lg:grid-cols-12 gap-12 lg:gap-8 pb-16 lg:pb-24">
          {/* Brand & Copyright Column */}
          <div className="col-span-2 md:col-span-6 lg:col-span-5 flex flex-col items-start">
            <Link href="/" className="inline-flex items-center gap-3">
              <div className="h-7 w-7 overflow-hidden flex items-center justify-center shrink-0">
                  <Image
                    src="/images/logo.svg"
                    alt="Logo"
                    width={48}
                    height={48}
                    className="w-full h-full object-contain scale-[1.8]"
                    priority
                  />
              </div>
              <span className="text-xl font-semibold tracking-tight text-white">
                BillFlow
              </span>
            </Link>

            <p className="mt-5 text-base font-medium text-white/80 leading-snug max-w-[340px]">
              Smart invoicing and automated tax compliance for modern businesses.
            </p>

            <p className="mt-3 text-sm text-white/45 leading-relaxed max-w-[380px]">
              Create professional invoices, manage your client directory, and
              track payments from Draft to Paid—all in one streamlined workspace.
            </p>

            <p className="mt-6 text-xs text-white/40">
              © {new Date().getFullYear()} BillFlow. All rights reserved.
            </p>
          </div>

          {/* Spacer on large screens */}
          <div className="hidden lg:block lg:col-span-1" />

          {/* Column 1: Menu (Landing Sections) */}
          <div className="col-span-1 md:col-span-2 lg:col-span-2 flex flex-col gap-4">
            <h3 className="text-sm font-medium text-white/40">Menu</h3>
            <ul className="space-y-3">
              {menuLinks.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="text-sm text-white/80 hover:text-primary transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 2: Platform (App Routes) */}
          <div className="col-span-1 md:col-span-2 lg:col-span-2 flex flex-col gap-4">
            <h3 className="text-sm font-medium text-white/40">Platform</h3>
            <ul className="space-y-3">
              {appLinks.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="text-sm text-white/80 hover:text-primary transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3: Social (Icon + Label) */}
          <div className="col-span-2 md:col-span-2 lg:col-span-2 flex flex-col gap-4">
            <h3 className="text-sm font-medium text-white/40">Social</h3>
            <ul className="space-y-3">
              {socialLinks.map((social) => (
                <li key={social.label}>
                  <Link
                    href={social.href}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-2.5 text-sm text-white/60 hover:text-primary transition-colors"
                  >
                    <span className="text-white/45 group-hover:text-primary">
                      {social.icon}
                    </span>
                    <span>{social.label}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Oversized Cropped Brand Watermark */}
      <div
        aria-hidden="true"
        className="max-w-[1400px] mx-auto w-full select-none pointer-events-none overflow-hidden"
      >
        <div className="text-center font-bold tracking-tighter leading-[0.78] text-[clamp(4.5rem,18vw,16rem)] text-white/[0.04] translate-y-[14%]">
          BillFlow
        </div>
      </div>
    </footer>
  );
}