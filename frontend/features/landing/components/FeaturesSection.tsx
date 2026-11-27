"use client";

import { FileText, Clock, FileBarChart, Users } from "lucide-react";

const LIQUID_GLASS_SURFACE = "bg-gradient-to-br from-white/[0.11] via-white/[0.04] to-white/[0.02] backdrop-blur-2xl border border-white/[0.12] shadow-[inset_0_1px_1px_rgba(255,255,255,0.22),0_24px_60px_rgba(0,0,0,0.65)]";


const features = [
  {
    title: "Smart Invoicing",
    description: "Create, customize and automate in seconds",
    icon: FileText,
  },
  {
    title: "Real-Time Tracking",
    description: "Create, customize and automate in seconds",
    icon: Clock,
  },
  {
    title: "Dynamic Tax & Charges",
    description: "Create, customize and automate in seconds",
    icon: FileBarChart,
  },
  {
    title: "Client Management",
    description: "Create, customize and automate in seconds",
    icon: Users,
  },
];

export default function FeaturesSection() {
  return (
    <section id="features" className="w-full bg-black">
      <div className={`relative z-10 h-full flex items-center rounded-[62px] rounded-md-full ${LIQUID_GLASS_SURFACE} sm:rounded-[48px] lg:rounded-[60px] py-14 px-6 sm:px-10 lg:py-24 lg:px-12`}>
        <div className="max-w-[1400px] mx-auto">
          {/* Section Heading */}
          <h2 className="text-2xl sm:text-3xl lg:text-[34px] font-normal tracking-tight text-white leading-tight mb-8 lg:mb-11">
            Features Built For Modern Businesses
          </h2>

          {/* 4-Column Feature Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {features.map((feature) => {
              const Icon = feature.icon;
              return (
                <div
                  key={feature.title}
                  className="bg-black rounded-[28px] lg:rounded-[36px] p-7 lg:p-8 xl:p-10 flex flex-col gap-5 border border-accent-foreground/[0.2]"
                >
                  {/* Scaled Icon Box */}
                  <div className="w-14 h-14 lg:w-[60px] lg:h-[60px] rounded-[16px] bg-white flex items-center justify-center shrink-0">
                    <Icon
                      className="w-7 h-7 lg:w-8 lg:h-8 text-black"
                      strokeWidth={1.8}
                    />
                  </div>

                  {/* Card Title (Single-line on desktop) */}
                  <h3 className="text-lg xl:text-[21px] font-normal text-white leading-snug">
                    {feature.title}
                  </h3>

                  {/* Divider */}
                  <div className="w-full h-px bg-white/30" />

                  {/* Description */}
                  <p className="text-sm xl:text-[15px] font-normal text-white/75 leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}