"use client";

import { useEffect, useState } from "react";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [cooldown, setCooldown] = useState(0);

  useEffect(() => {
    if (cooldown <= 0) return;
    const timer = setInterval(() => setCooldown((c) => c - 1), 1000);
    return () => clearInterval(timer);
  }, [cooldown]);

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setCooldown(20);
  };

  return (
    <div className="w-full space-y-6 text-center">
      <div className="space-y-2">
        <h1 className="text-3xl font-normal tracking-tight text-white">
          Forgot Password
        </h1>
        <p className="text-xs text-neutral-400">
          Please provide the email linked to your account
        </p>
      </div>

      <form onSubmit={handleSend} className="space-y-6 text-left">
        <input
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email Address"
          className="w-full border-b border-neutral-600 bg-transparent py-2.5 text-sm text-white placeholder:text-neutral-500 focus:border-white focus:outline-none"
        />

        <button
          type="submit"
          className="w-full rounded-full bg-[#E5B05C] py-3 text-sm font-medium text-black hover:bg-[#ebb96b] transition-colors cursor-pointer"
        >
          Send Email
        </button>
      </form>

      <p className="text-xs text-neutral-400">
        <button
          type="button"
          disabled={cooldown > 0}
          onClick={() => setCooldown(20)}
          className="underline underline-offset-4 hover:text-white disabled:opacity-60 disabled:no-underline cursor-pointer"
        >
          Resend email again
        </button>
        {cooldown > 0 && ` in ${cooldown}s`}
      </p>
    </div>
  );
}