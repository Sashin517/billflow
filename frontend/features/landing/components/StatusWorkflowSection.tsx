"use client";

import Link from "next/link";
import Image from "next/image";
import { ArrowUpRight } from "lucide-react";

const LIQUID_GLASS_SURFACE =
  "bg-gradient-to-br from-white/[0.11] via-white/[0.04] to-white/[0.02] backdrop-blur-2xl border border-white/[0.12] shadow-[inset_0_1px_1px_rgba(255,255,255,0.22),0_24px_60px_rgba(0,0,0,0.65)]";

export default function StatusWorkflowSection() {
  return (
    <section id="workflows" className="w-full bg-black">
      <div
        className={`relative z-10 h-full flex items-center rounded-[36px] sm:rounded-[48px] lg:rounded-[60px] ${LIQUID_GLASS_SURFACE} py-14 px-6 sm:px-10 lg:py-24 lg:px-12`}
      >
        <div className="max-w-[1400px] mx-auto w-full">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-10 items-center">
            {/* LEFT: Status Table Preview */}
            <div className="lg:col-span-6 relative flex items-center justify-center">
               {/* 3 Concentric Circles Ambient Glows*/}
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
              <div className="relative w-full aspect-[4/3] overflow-hidden rounded-[24px] lg:rounded-[32px] border border-accent-foreground/[0.4] shadow-2xl">
                  <Image
                  src="/images/status-workflow.png"
                  alt="BillFlow Invoice Status Tracking"
                  fill
                  sizes="(max-width: 1024px) 100vw, 58vw"
                  className="object-cover object-top"
                  priority
                  />
              </div>
            </div>

            {/* RIGHT: Copy & CTA (Matches ComplianceSection typography) */}
            <div className="lg:col-span-6 flex flex-col items-start lg:items-end lg:text-right">
              <h2 className="text-4xl sm:text-5xl lg:text-[54px] font-medium tracking-tight leading-[1.1] text-white">
                Never Guess a
                <br />
                <span className="text-primary">Status Again</span>
              </h2>

              <p className="mt-6 text-sm sm:text-base text-white/75 leading-relaxed max-w-[480px]">
                Store your client directory and track invoices from Draft to Paid. Automatic overdue warnings and payment recording take the
                stress out of collections.
              </p>

              <Link
                href="/dashboard"
                className="group mt-10 inline-flex items-center gap-4 pb-2.5 border-b border-white/80 text-white text-sm sm:text-base font-normal hover:text-primary hover:border-primary transition-colors"
              >
                <span>View Dashboard Workflows</span>
                <ArrowUpRight className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}