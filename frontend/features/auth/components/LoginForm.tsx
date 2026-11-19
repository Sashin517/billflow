"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { CredentialResponse } from "@react-oauth/google";
import { AlertCircle } from "lucide-react";
import { loginWithGoogle } from "@/lib/actions/auth.actions";
import { GoogleAuthButton } from "./GoogleAuthButton";
import { PasswordField } from "./PasswordField";

export function LoginForm() {
  const router = useRouter();
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleGoogleSuccess = async (
    credentialResponse: CredentialResponse
  ) => {
    if (!credentialResponse.credential) {
      setError("No credential returned by Google.");
      return;
    }
    setIsLoading(true);
    setError(null);

    const result = await loginWithGoogle(credentialResponse.credential);
    if (result.success) {
      router.push("/dashboard");
      router.refresh();
    } else {
      setError(result.error || "Sign-in failed.");
      setIsLoading(false);
    }
  };

  const handleLocalLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("Please sign in with Google or configure local login endpoint.");
  };

  return (
    <div className="w-full space-y-6">
      {/* Header */}
      <div className="text-center space-y-1">
        <p className="text-2xl font-light tracking-tight text-white">
          Welcome to
        </p>
        <h1 className="text-4xl font-semibold tracking-tight text-white">
          BillFlow
        </h1>
      </div>

      {/* Google Section */}
      <div className="space-y-3">
        <p className="text-center text-xs text-neutral-400">Login with</p>
        <GoogleAuthButton
          onSuccess={handleGoogleSuccess}
          onError={() => setError("Google sign-in was cancelled or failed.")}
          disabled={isLoading}
        />
      </div>

      <p className="text-center text-xs text-neutral-300">or</p>

      {/* Local Credentials Form */}
      <form onSubmit={handleLocalLogin} className="space-y-5">
        <div>
          <input
            type="text"
            value={identifier}
            onChange={(e) => setIdentifier(e.target.value)}
            placeholder="Username or Email"
            className="w-full border-b border-neutral-600 bg-transparent py-2.5 text-sm text-white placeholder:text-neutral-500 focus:border-white focus:outline-none transition-colors"
          />
        </div>

        <div className="space-y-2">
          <PasswordField
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
          />
          <div className="flex justify-end">
            <Link
              href="/forgot-password"
              className="text-xs text-neutral-400 underline underline-offset-4 hover:text-white transition-colors"
            >
              Forgot Password?
            </Link>
          </div>
        </div>

        {error && (
          <div className="flex items-center gap-2 text-xs text-red-500">
            <AlertCircle className="h-3.5 w-3.5 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <button
          type="submit"
          disabled={isLoading}
          className="w-full rounded-full bg-[#E5B05C] py-3 text-sm font-medium text-black hover:bg-[#ebb96b] disabled:opacity-60 transition-colors cursor-pointer"
        >
          {isLoading ? "Signing in..." : "Login"}
        </button>
      </form>

      <p className="text-center text-xs text-neutral-400">
        Don&apos;t you have an account?{" "}
        <Link
          href="/signup"
          className="text-neutral-200 underline underline-offset-4 hover:text-white"
        >
          Sign up
        </Link>
      </p>
    </div>
  );
}