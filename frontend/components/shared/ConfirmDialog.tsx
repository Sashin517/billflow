"use client";

import { AlertTriangle, Pencil } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

export interface ConfirmDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description: string;
  variant?: "delete" | "edit";
  confirmLabel?: string;
  cancelLabel?: string;
  isLoading?: boolean;
  onConfirm: () => void | Promise<void>;
}

const variantConfig = {
  delete: {
    icon: AlertTriangle,
    iconBg: "bg-[#8A6228]/50",
    iconColor: "text-[#F59E0B]",
    buttonClass:
      "bg-[#7A1C2A] hover:bg-[#912132] text-white border border-[#9E2A3B]/40",
    defaultConfirmLabel: "Yes, Delete",
    loadingLabel: "Deleting...",
  },
  edit: {
    icon: Pencil,
    iconBg: "bg-emerald-500/20",
    iconColor: "text-emerald-400",
    buttonClass:
      "bg-emerald-600 hover:bg-emerald-700 text-white border border-emerald-500/40",
    defaultConfirmLabel: "Yes, Edit",
    loadingLabel: "Opening...",
  },
} as const;

export default function ConfirmDialog({
  open,
  onOpenChange,
  title,
  description,
  variant = "delete",
  confirmLabel,
  cancelLabel = "Cancel",
  isLoading = false,
  onConfirm,
}: ConfirmDialogProps) {
  const config = variantConfig[variant];
  const Icon = config.icon;

  return (
    <Dialog open={open} onOpenChange={(next) => !isLoading && onOpenChange(next)}>
      <DialogContent className="sm:max-w-[440px] bg-[#161615] border border-white/[0.1] rounded-2xl p-6 sm:p-8 text-center">
        <DialogHeader className="flex flex-col items-center text-center space-y-4">
          {/* Centered Icon Circle */}
          <div
            className={`w-16 h-16 rounded-full flex items-center justify-center ${config.iconBg}`}
          >
            <Icon className={`w-7 h-7 ${config.iconColor}`} strokeWidth={1.8} />
          </div>

          <div className="space-y-2">
            <DialogTitle className="text-xl font-semibold text-white text-center leading-snug">
              {title}
            </DialogTitle>
            <DialogDescription className="text-sm text-white/65 text-center leading-relaxed max-w-[340px] mx-auto">
              {description}
            </DialogDescription>
          </div>
        </DialogHeader>

        {/* Action Buttons */}
        <div className="mt-6 grid grid-cols-2 gap-3">
          <Button
            type="button"
            variant="outline"
            disabled={isLoading}
            onClick={() => onOpenChange(false)}
            className="h-11 rounded-lg border-white/25! bg-transparent text-white hover:bg-white/10! hover:text-white font-medium"
          >
            {cancelLabel}
          </Button>

          <Button
            type="button"
            disabled={isLoading}
            onClick={onConfirm}
            className={`h-11 rounded-lg font-medium ${config.buttonClass}`}
          >
            {isLoading
              ? config.loadingLabel
              : confirmLabel || config.defaultConfirmLabel}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}