"use client";

import Link from "next/link";
import Image from "next/image";
import { ArrowUpRight } from "lucide-react";

const LIQUID_GLASS_SURFACE = "bg-gradient-to-br from-white/[0.11] via-white/[0.04] to-white/[0.02] backdrop-blur-2xl border border-white/[0.12] shadow-[inset_0_1px_1px_rgba(255,255,255,0.22),0_24px_60px_rgba(0,0,0,0.65)]";

export default function ComplianceSection() {
  return (
    <section
      id="compliance"
      className="relative w-full overflow-hidden bg-black py-20 lg:py-32"
    >
      <div className="relative z-10 max-w-[1400px] mx-auto px-6 lg:px-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-10 items-center">
          {/* LEFT: Copy & CTA */}
          <div className="lg:col-span-5 flex flex-col items-start">
            <h2 className="text-4xl sm:text-5xl lg:text-[54px] font-medium tracking-tight leading-[1.1] text-white">
              Stay Compliant,
              <br />
              <span className="text-primary">Effortlessly</span>
            </h2>

            <p className="mt-6 text-sm sm:text-base text-white/75 leading-relaxed max-w-[440px]">
              Save Taxes, Charges, and Business profiles once.
              <br />
              BillFlow automatically handles VAT, SSCL, and standard
              calculations per invoice, keeping you audit-ready
            </p>

            <Link
              href="/settings/profile"
              className="group mt-10 inline-flex items-center gap-4 pb-2.5 border-b border-white/80 text-white text-sm sm:text-base font-normal hover:text-primary hover:border-primary transition-colors"
            >
              <span>Manage Compliance</span>
              <ArrowUpRight className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </Link>
          </div>

          {/* RIGHT: 3-Circle Glow + Gradient Frame + Preview Image */}
          <div className="lg:col-span-7 relative flex items-center justify-center">
            {/* 3 Concentric Circles Ambient Glow (Uniform Blur 37.7px) */}
            <div
              aria-hidden="true"
              className="pointer-events-none absolute -inset-12 z-0 flex items-center justify-center opacity-25 blur-[37.7px]"
            >
              <div className="relative w-[340px] h-[340px] sm:w-[480px] sm:h-[480px] lg:w-[560px] lg:h-[560px] flex items-center justify-center">
                {/* Outer Gold Circle */}
                <div className="absolute inset-0 rounded-full bg-[#E2A84B]" />
                {/* Middle Cream Circle */}
                <div className="absolute w-[74%] h-[74%] rounded-full bg-[#F6E4C5]" />
                {/* Inner Off-White Circle */}
                <div className="absolute w-[54%] h-[54%] rounded-full bg-[#FFF9F0]" />
              </div>
            </div>

            {/* Liquid Glass Picture Frame */}
            <div
              className={`relative z-10 w-full rounded-[28px] sm:rounded-[36px] lg:rounded-[44px] p-4 sm:p-6 lg:p-7 ${LIQUID_GLASS_SURFACE}`}
            >
              <div className="relative w-full overflow-hidden rounded-[18px] sm:rounded-[24px] lg:rounded-[28px] border border-white/[0.08] bg-[#0B0B0B] shadow-2xl">
                <Image
                  src="/images/compliance-preview.png"
                  alt="BillFlow Tax & Compliance Invoice Creator"
                  width={1200}
                  height={760}
                  className="w-full h-auto block object-cover"
                  priority
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}