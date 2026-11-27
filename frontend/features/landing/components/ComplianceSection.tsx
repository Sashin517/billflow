"use client";

import Link from "next/link";
import Image from "next/image";
import { ArrowUpRight } from "lucide-react";
import SoftAurora from "@/components/SoftAurora";

export default function ComplianceSection() {
  return (
    <section
      id="compliance"
      className="relative w-full overflow-hidden bg-black py-20 lg:py-32 px-6 sm:px-10 lg:px-12"
    >
      {/* Vertical SoftAurora Beam in the Middle Gap (Desktop Only) */}
      <div
        aria-hidden="true"
        className="hidden lg:block pointer-events-none absolute inset-y-0 left-2/5 -translate-x-1/2 w-full z-0"
        style={{
          maskImage:
            "linear-gradient(to bottom, transparent, black 18%, black 82%, transparent)",
          WebkitMaskImage:
            "linear-gradient(to bottom, transparent, black 18%, black 82%, transparent)",
        }}
      >
        <SoftAurora
          speed={0.6}
          scale={1.5}
          brightness={0.9}
          color1="#f7f7f7"
          color2="#E2A84B"
          bandHeight={0.5}
          bandSpread={1}
          enableMouseInteraction
          mouseInfluence={0.25}
          spectrum={0.2}
          colorSpeed={1}
          noiseFrequency={2.5}
          noiseAmplitude={1}
          tilt={90}
          octaveDecay={0.1}
          layerOffset={0}
          clickPulse
          intro
          lightMode={false}
          opacity={0.40}
        />
      </div>

      <div className="relative z-10 max-w-[1400px] mx-auto w-full">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          {/* LEFT: Copy & CTA */}
          <div className="lg:col-span-6 flex flex-col items-start">
            <h2 className="text-4xl sm:text-5xl lg:text-[54px] font-medium tracking-tight leading-[1.1] text-white">
              Stay Compliant,
              <br />
              <span className="text-primary">Effortlessly</span>
            </h2>

            <p className="mt-6 text-sm sm:text-base text-white/75 leading-relaxed max-w-[480px]">
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

          {/* RIGHT: 3-Circle Glow + Preview Image */}
          <div className="lg:col-span-6 relative flex items-center justify-center">
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

            {/* Preview Image */}
            <div className="relative z-10 w-full aspect-[4/3] overflow-hidden rounded-[24px] lg:rounded-[32px] border border-accent-foreground/[0.4] shadow-2xl">
              <Image
                src="/images/compliance-preview.png"
                alt="BillFlow Tax & Compliance Invoice Creator"
                fill
                sizes="(max-width: 1024px) 100vw, 58vw"
                className="object-cover object-top"
                priority
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}