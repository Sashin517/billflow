"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { AlertCircle } from "lucide-react";
import { PasswordField } from "@/features/auth/components/PasswordField";

export default function ResetPasswordPage() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [submittedError, setSubmittedError] = useState(false);

  const mismatch =
    (confirmPassword.length > 0 || submittedError) &&
    password !== confirmPassword;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!password || password !== confirmPassword) {
      setSubmittedError(true);
      return;
    }
    router.push("/reset-password/success");
  };

  return (
    <div className="w-full space-y-6">
      <div className="space-y-2 text-center">
        <h1 className="text-3xl font-normal tracking-tight text-white">
          Set a New Password
        </h1>
        <p className="text-xs text-neutral-400">
          Create new password for account recovery
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        <PasswordField
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
        />

        <PasswordField
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          placeholder="Confirm Password"
          hasError={mismatch}
        />

        {mismatch && (
          <div className="flex items-center gap-2 text-xs text-red-500">
            <AlertCircle className="h-3.5 w-3.5 shrink-0" />
            <span>Password do not match, check again</span>
          </div>
        )}

        <button
          type="submit"
          className="w-full rounded-full bg-[#E5B05C] py-3 text-sm font-medium text-black hover:bg-[#ebb96b] transition-colors cursor-pointer"
        >
          Create New Password
        </button>
      </form>
    </div>
  );
}