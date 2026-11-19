"use client";

import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";

interface PasswordFieldProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  hasError?: boolean;
}

export function PasswordField({
  hasError = false,
  className = "",
  ...props
}: PasswordFieldProps) {
  const [visible, setVisible] = useState(false);

  return (
    <div
      className={`relative flex items-center border-b transition-colors ${
        hasError
          ? "border-red-500"
          : "border-neutral-600 focus-within:border-white"
      }`}
    >
      <input
        {...props}
        type={visible ? "text" : "password"}
        className={`w-full bg-transparent py-2.5 pr-8 text-sm text-white placeholder:text-neutral-500 focus:outline-none ${className}`}
      />
      <button
        type="button"
        onClick={() => setVisible((prev) => !prev)}
        aria-label={visible ? "Hide password" : "Show password"}
        className="absolute right-0 p-1 text-neutral-400 hover:text-white transition-colors"
      >
        {visible ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
      </button>
    </div>
  );
}