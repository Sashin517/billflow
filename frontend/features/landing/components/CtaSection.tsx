"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function CtaSection() {
  return (
    <section className="relative w-full overflow-hidden bg-black py-24 lg:py-36 px-6 sm:px-10 lg:px-12">
      {/* Subtle Bottom-Center Golden Ambient Glow */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute left-1/2 bottom-0 -translate-x-1/2 translate-y-1/3 w-[420px] h-[220px] sm:w-[680px] sm:h-[280px] rounded-full bg-[#E2A84B]/20 blur-[90px] z-0"
      />

      <div className="relative z-10 max-w-[1400px] mx-auto w-full flex flex-col items-center text-center">
        <h2 className="text-4xl sm:text-5xl lg:text-[54px] font-medium tracking-tight leading-[1.12] text-white max-w-[900px]">
          Unlock Smoother{" "}
          <span className="text-primary">Financial Flow</span> Today
        </h2>

        <p className="mt-5 text-sm sm:text-base text-white/75 leading-relaxed max-w-[560px]">
          Start creating, tracking, and finalizing professional invoices in
          minutes. No credit card required.
        </p>

        <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
          <Link href="/register">
            <Button className="bg-primary hover:bg-primary-hover text-primary-foreground font-medium h-13 px-8 rounded-full text-base">
              Get Started for Free
            </Button>
          </Link>

          <Link href="#contact">
            <Button
              variant="outline"
              className="h-13 px-8 rounded-full text-base border-white/30 bg-transparent text-white hover:bg-white/10 hover:text-white"
            >
              Contact Sales
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}