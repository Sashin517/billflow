"use client";

import Link from "next/link";
import Image from "next/image";
import { ArrowUpRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import Scanner from "@/components/Scanner";

const LIQUID_GLASS_SURFACE =
  "bg-gradient-to-br from-white/[0.11] via-white/[0.04] to-white/[0.02] backdrop-blur-2xl border border-white/[0.12] shadow-[inset_0_1px_1px_rgba(255,255,255,0.22),0_24px_60px_rgba(0,0,0,0.65)]";

export default function HeroSection() {
  return (
    <section className="relative w-full overflow-hidden bg-black pt-10 pb-20 lg:pt-14 lg:pb-28">
      {/* Hero-only Scanner WebGL Background (White & Grey Shades) */}
      <div className="pointer-events-none absolute inset-0 z-0">
        <Scanner
          color1="#3F3F46"
          color2="#A1A1AA"
          color3="#FFFFFF"
          colorSpread={0.12}
          speed={0.35}
          sweepSpeed={0.2}
          glow={0.45}
          brightness={0.85}
          vignette={0.45}
          opacity={0.45}
          scanDirection="diagonal"
          mouseInteraction={true}
          clickEffect="ping"
        />
        {/* Soft edge & bottom fade so it blends into the rest of the page */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black" />
      </div>

      {/* Hero Bento Content */}
      <div className="relative z-10 max-w-[1400px] mx-auto px-6 lg:px-10">
        <div className="grid grid-cols-1 lg:grid-cols-[44%_56%] gap-8 lg:gap-0 items-stretch">
          {/* TOP-LEFT: Headline & Trust Copy */}
          <div className="flex flex-col justify-between lg:pr-12 lg:pb-10">
            <h1 className="text-4xl sm:text-5xl lg:text-[62px] font-semibold tracking-tight leading-[1.08] text-white">
                Simplify Your
                <br />
                Invoicing. 
                <br />
                Track Payments.
                <br />
                Powered by
                <br />
                <span className="text-primary">BillFlow</span>
            </h1>

            <p className="mt-8 lg:mt-10 text-base sm:text-lg text-white/80 font-normal">
              Trusted by 10,000+ businesses
            </p>
          </div>

          {/* TOP-RIGHT: Dashboard Liquid Glass Showcase + Liquid Bridge */}
          <div className="relative h-full">
            <div
              className={`relative z-10 h-full flex items-center rounded-[62px] p-[30px] ${LIQUID_GLASS_SURFACE}`}
            >
              <div className="relative w-full overflow-hidden rounded-[32px] border border-white/[0.08] bg-[#0B0B0B] shadow-2xl">
                <Image
                  src="/images/hero-dashboard.png"
                  alt="BillFlow Dashboard Preview"
                  width={1200}
                  height={760}
                  className="w-full h-auto block object-cover"
                  priority
                />
              </div>
            </div>

            {/* Responsive Liquid Glass Bridge locked to the exact corner intersection */}
            <div
              aria-hidden="true"
              style={{ ["--r" as string]: "62px" }}
              className="hidden lg:block pointer-events-none absolute bottom-0 left-0 -translate-x-1/2 translate-y-1/2 w-[calc(var(--r)*2)] h-[calc(var(--r)*2)] z-20"
            >
              {/* Concave glass fill using 4-corner radial mask intersection */}
              <div
                className="w-full h-full bg-white/[0.07] backdrop-blur-2xl"
                style={{
                  maskImage: [
                    "radial-gradient(circle var(--r) at 0 0, transparent 98.5%, black 100%)",
                    "radial-gradient(circle var(--r) at 100% 0, transparent 98.5%, black 100%)",
                    "radial-gradient(circle var(--r) at 0 100%, transparent 98.5%, black 100%)",
                    "radial-gradient(circle var(--r) at 100% 100%, transparent 98.5%, black 100%)",
                  ].join(", "),
                  maskComposite: "intersect",
                  WebkitMaskImage: [
                    "radial-gradient(circle var(--r) at 0 0, transparent 98.5%, black 100%)",
                    "radial-gradient(circle var(--r) at 100% 0, transparent 98.5%, black 100%)",
                    "radial-gradient(circle var(--r) at 0 100%, transparent 98.5%, black 100%)",
                    "radial-gradient(circle var(--r) at 100% 100%, transparent 98.5%, black 100%)",
                  ].join(", "),
                  WebkitMaskComposite: "source-in",
                }}
              />

              {/* Subtle concave edge highlights matching the card borders */}
              <svg
                viewBox="0 0 124 124"
                fill="none"
                className="absolute inset-0 w-full h-full"
              >
                <path
                  d="M 62 0.5 A 61.5 61.5 0 0 1 0.5 62"
                  stroke="rgba(255,255,255,0.14)"
                  strokeWidth="1"
                />
                <path
                  d="M 62 123.5 A 61.5 61.5 0 0 1 123.5 62"
                  stroke="rgba(255,255,255,0.14)"
                  strokeWidth="1"
                />
              </svg>
            </div>
          </div>

          {/* BOTTOM-LEFT: Invoice Preview Liquid Glass Showcase */}
          <div className="relative">
            <div
              className={`relative z-10 rounded-[62px] rounded-b-[36px] md:rounded-b-[62px]  px-[30px] pt-[30px] h-full flex items-center justify-center ${LIQUID_GLASS_SURFACE}`}
            >
              <div className="relative w-full max-w-[380px] overflow-hidden rounded-t-[32px] border border-white/[0.08] shadow-2xl">
                <Image
                  src="/images/hero-invoice.png"
                  alt="BillFlow Invoice Preview"
                  width={700}
                  height={560}
                  className="w-auto h-full block object-cover"
                  priority
                />
              </div>
            </div>
          </div>

          {/* BOTTOM-RIGHT: Description & CTA Buttons */}
          <div className="flex flex-col justify-center lg:pl-14 lg:pt-10 space-y-8">
            <p className="text-base sm:text-lg text-white/80 leading-relaxed max-w-[520px]">
              Simplify client management, automate taxes, and track rupees in
              real time. Built for scaling businesses.
            </p>

            <div className="flex flex-wrap items-center gap-4">
              <Link href="/invoices/new">
                <Button className="bg-primary hover:bg-primary-hover text-primary-foreground font-medium h-13 px-8 rounded-full text-base">
                  Create Your First Invoice
                </Button>
              </Link>

              <Link href="#demo">
                <Button
                  variant="outline"
                  className="h-13 px-8 rounded-full text-base border-white/30 bg-transparent text-white hover:bg-white/10 hover:text-white gap-2"
                >
                  Watch Demo
                  <ArrowUpRight className="w-4 h-4" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}