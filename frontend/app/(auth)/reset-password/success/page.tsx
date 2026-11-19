"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowRight, Check } from "lucide-react";

export default function ResetPasswordSuccessPage() {
  const router = useRouter();
  const [secondsLeft, setSecondsLeft] = useState(20);

  useEffect(() => {
    if (secondsLeft <= 0) {
      router.push("/dashboard");
      return;
    }
    const timer = setInterval(() => setSecondsLeft((s) => s - 1), 1000);
    return () => clearInterval(timer);
  }, [secondsLeft, router]);

  return (
    <div className="w-full flex flex-col items-center text-center space-y-6">
      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#22C55E] text-black">
        <Check className="h-6 w-6 stroke-[3]" />
      </div>

      <h1 className="text-3xl font-normal tracking-tight text-white">
        Created New Password
      </h1>

      <button
        type="button"
        onClick={() => router.push("/dashboard")}
        className="flex w-full items-center justify-center gap-2 rounded-full bg-[#E5B05C] py-3 text-sm font-medium text-black hover:bg-[#ebb96b] transition-colors cursor-pointer"
      >
        <span>Navigate to Dashboard</span>
        <ArrowRight className="h-4 w-4" />
      </button>

      <p className="text-xs text-neutral-400">Navigate in {secondsLeft}s</p>
    </div>
  );
}