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
            <div className="lg:col-span-6">
            <div className="relative w-full aspect-[4/3] overflow-hidden rounded-[24px] lg:rounded-[32px] border border-white/[0.5] shadow-2xl">
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