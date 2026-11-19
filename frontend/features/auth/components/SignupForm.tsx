"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { CredentialResponse } from "@react-oauth/google";
import { AlertCircle } from "lucide-react";
import { loginWithGoogle } from "@/lib/actions/auth.actions";
import { GoogleAuthButton } from "./GoogleAuthButton";
import { PasswordField } from "./PasswordField";

export function SignupForm() {
  const router = useRouter();
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [agreed, setAgreed] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const passwordsMismatch =
    confirmPassword.length > 0 && password !== confirmPassword;

  const handleGoogleSuccess = async (
    credentialResponse: CredentialResponse
  ) => {
    if (!credentialResponse.credential) return;
    setIsLoading(true);
    setError(null);

    const result = await loginWithGoogle(credentialResponse.credential);
    if (result.success) {
      router.push("/dashboard");
      router.refresh();
    } else {
      setError(result.error || "Sign-up failed.");
      setIsLoading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setError("Password do not match, check again");
      return;
    }
    if (!agreed) {
      setError("Please agree to the terms & policy.");
      return;
    }
    setError("Use Google sign-up or connect your local registration API.");
  };

  return (
    <div className="w-full space-y-6">
      {/* Header */}
      <div className="text-center space-y-1">
        <p className="text-2xl font-light tracking-tight text-white">
          Get Started
        </p>
        <h1 className="text-4xl font-semibold tracking-tight text-white">
          Now
        </h1>
      </div>

      {/* Google Section */}
      <div className="space-y-3">
        <p className="text-center text-xs text-neutral-400">
          Create an account with
        </p>
        <GoogleAuthButton
          onSuccess={handleGoogleSuccess}
          onError={() => setError("Google sign-up failed.")}
          disabled={isLoading}
        />
      </div>

      <p className="text-center text-xs text-neutral-300">or</p>

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <input
            type="text"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            placeholder="First Name"
            className="w-full border-b border-neutral-600 bg-transparent py-2.5 text-sm text-white placeholder:text-neutral-500 focus:border-white focus:outline-none"
          />
          <input
            type="text"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            placeholder="Last Name"
            className="w-full border-b border-neutral-600 bg-transparent py-2.5 text-sm text-white placeholder:text-neutral-500 focus:border-white focus:outline-none"
          />
        </div>

        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email Address"
          className="w-full border-b border-neutral-600 bg-transparent py-2.5 text-sm text-white placeholder:text-neutral-500 focus:border-white focus:outline-none"
        />

        <PasswordField
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
        />

        <PasswordField
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          placeholder="Confirm Password"
          hasError={passwordsMismatch}
        />

        {(passwordsMismatch || error) && (
          <div className="flex items-center gap-2 text-xs text-red-500">
            <AlertCircle className="h-3.5 w-3.5 shrink-0" />
            <span>
              {passwordsMismatch
                ? "Password do not match, check again"
                : error}
            </span>
          </div>
        )}

        <label className="flex items-center gap-2.5 pt-1 text-xs text-neutral-300 cursor-pointer select-none">
          <input
            type="checkbox"
            checked={agreed}
            onChange={(e) => setAgreed(e.target.checked)}
            className="h-3.5 w-3.5 rounded border-neutral-500 bg-transparent accent-neutral-300"
          />
          <span>
            I agree to{" "}
            <Link
              href="/terms"
              className="underline underline-offset-4 hover:text-white"
            >
              terms &amp; policy
            </Link>
          </span>
        </label>

        <button
          type="submit"
          disabled={isLoading}
          className="w-full rounded-full bg-[#E5B05C] py-3 text-sm font-medium text-black hover:bg-[#ebb96b] disabled:opacity-60 transition-colors cursor-pointer"
        >
          Signup
        </button>
      </form>

      <p className="text-center text-xs text-neutral-400">
        Do you have an account?{" "}
        <Link
          href="/login"
          className="text-neutral-200 underline underline-offset-4 hover:text-white"
        >
          Login
        </Link>
      </p>
    </div>
  );
}