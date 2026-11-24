"use client";

import { useEffect, useRef, useState, useTransition } from "react";
import {
  CloudUpload,
  Pipette,
  X,
  CheckCircle2,
  RotateCw,
  Pencil,
} from "lucide-react";
import { HexColorPicker } from "react-colorful";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  saveBusinessTheme,
  uploadBusinessLogo,
  deleteBusinessLogo,
} from "@/lib/actions/settings.actions";

interface BusinessThemeFormProps {
  initialData?: {
    letterhead_color?: string | null;
    logo_path?: string | null;
  } | null;
}

type UploadStatus = "idle" | "uploading" | "success" | "error";

const HEX_REGEX = /^#[0-9A-Fa-f]{6}$/;

function formatFileSize(bytes: number): string {
  return `${(bytes / (1024 * 1024)).toFixed(2)} mb`;
}

export default function BusinessThemeForm({
  initialData,
}: BusinessThemeFormProps) {
  const initialHasTheme = Boolean(
    initialData?.letterhead_color || initialData?.logo_path
  );
  const initialColor = initialData?.letterhead_color || "#E0A753";
  const initialLogo = initialData?.logo_path || null;

  const [hasExistingTheme, setHasExistingTheme] = useState(initialHasTheme);
  const [isEditing, setIsEditing] = useState(!initialHasTheme);
  const [savedSnapshot, setSavedSnapshot] = useState({
    letterhead_color: initialColor,
    logo_path: initialLogo,
  });

  const [hexColor, setHexColor] = useState(initialColor);
  const [isDragging, setIsDragging] = useState(false);
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(initialLogo);
  const [showPreview, setShowPreview] = useState<boolean>(Boolean(initialLogo));
  const [removeExistingLogo, setRemoveExistingLogo] = useState(false);

  // Upload progress indicator state
  const [uploadStatus, setUploadStatus] = useState<UploadStatus>("idle");
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadedFileMeta, setUploadedFileMeta] = useState<{
    name: string;
    size: number;
  } | null>(null);

  const [isPending, startTransition] = useTransition();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const previewTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const localPreviewRef = useRef<string | null>(null);

  useEffect(() => {
    return () => {
      if (previewTimerRef.current) clearTimeout(previewTimerRef.current);
    };
  }, []);

  const validHex = HEX_REGEX.test(hexColor) ? hexColor : "#E0A753";
  const isDirty =
    hexColor !== savedSnapshot.letterhead_color ||
    previewUrl !== savedSnapshot.logo_path;

  const handleHexChange = (raw: string) => {
    const cleaned = raw.trim().toUpperCase();
    setHexColor(
      cleaned.startsWith("#") || cleaned === "" ? cleaned : `#${cleaned}`
    );
  };

  const handleEyeDropper = async () => {
    if (typeof window === "undefined" || !("EyeDropper" in window)) {
      toast.info("Eyedropper is not supported in this browser.");
      return;
    }
    try {
      const eyeDropper = new (window as any).EyeDropper();
      const result = await eyeDropper.open();
      setHexColor(result.sRGBHex.toUpperCase());
    } catch {
      // User canceled eyedropper
    }
  };

  const runLogoUpload = async (file: File): Promise<boolean> => {
    // Create a guaranteed-working local preview URL as fallback
    if (localPreviewRef.current) URL.revokeObjectURL(localPreviewRef.current);
    const localUrl = URL.createObjectURL(file);
    localPreviewRef.current = localUrl;

    setUploadStatus("uploading");
    setUploadProgress(15);
    setShowPreview(false);

    const timer = setInterval(() => {
      setUploadProgress((prev) => (prev < 85 ? prev + 15 : prev));
    }, 150);

    try {
      const formData = new FormData();
      formData.append("file", file);

      // Ensure the "uploading" state is visible for at least 350ms
      const [uploadRes] = await Promise.all([
        uploadBusinessLogo(formData),
        new Promise((resolve) => setTimeout(resolve, 350)),
      ]);

      clearInterval(timer);

      if (!uploadRes.success) {
        setUploadStatus("error");
        setUploadProgress(45);
        toast.error(uploadRes.error || "Failed to upload logo.");
        return false;
      }

      const finalUrl = uploadRes.data?.logo_path || localUrl;
      setUploadProgress(100);
      setUploadStatus("success");
      setLogoFile(null);

      // Hold green "Upload Successful!" bar for 800ms, then show fitted image preview
      previewTimerRef.current = setTimeout(() => {
        setPreviewUrl(finalUrl);
        setShowPreview(true);
        setUploadStatus("idle");
      }, 800);

      return true;
    } catch {
      clearInterval(timer);
      setUploadStatus("error");
      setUploadProgress(45);
      toast.error("Upload failed. Please try again.");
      return false;
    }
  };

  const handleFileSelect = (file: File) => {
    if (!isEditing) return;
    if (file.size > 5 * 1024 * 1024) {
      toast.error("File exceeds 5 MB limit.");
      return;
    }
    if (!["image/png", "image/jpeg", "image/webp"].includes(file.type)) {
      toast.error("Only PNG, JPG, or WebP images are allowed.");
      return;
    }
    if (previewTimerRef.current) clearTimeout(previewTimerRef.current);
    setLogoFile(file);
    setUploadedFileMeta({ name: file.name, size: file.size });
    setRemoveExistingLogo(false);

    // Call directly (NOT inside startTransition) so "uploading" paints immediately
    void runLogoUpload(file);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    if (isEditing) setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (!isEditing) return;
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      handleFileSelect(files[0]);
    }
  };

  const handleRemoveLogo = () => {
    if (previewTimerRef.current) clearTimeout(previewTimerRef.current);
    setLogoFile(null);
    setUploadedFileMeta(null);
    setUploadStatus("idle");
    setUploadProgress(0);
    setPreviewUrl(null);
    setShowPreview(false);
    setRemoveExistingLogo(true);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const resetUploadBar = () => {
    if (previewTimerRef.current) clearTimeout(previewTimerRef.current);
    setUploadStatus("idle");
    setUploadProgress(0);
    setLogoFile(null);
    setUploadedFileMeta(null);
    setPreviewUrl(savedSnapshot.logo_path);
    setShowPreview(Boolean(savedSnapshot.logo_path));
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleCancel = () => {
    setHexColor(savedSnapshot.letterhead_color);
    setRemoveExistingLogo(false);
    resetUploadBar();
    setIsEditing(false);
  };

  const handleSave = () => {
    if (!HEX_REGEX.test(hexColor)) {
      toast.error("Please enter a valid 6-digit HEX color (e.g. #E0A753).");
      return;
    }

    startTransition(async () => {
      if (removeExistingLogo && savedSnapshot.logo_path) {
        const delRes = await deleteBusinessLogo();
        if (!delRes.success) {
          toast.error(delRes.error || "Failed to delete logo.");
          return;
        }
        setRemoveExistingLogo(false);
      }

      const themeRes = await saveBusinessTheme({ letterhead_color: hexColor });
      if (!themeRes.success) {
        toast.error(themeRes.error || "Failed to save theme settings.");
        return;
      }

      const updatedColor = themeRes.data?.letterhead_color || hexColor;
      const updatedLogo =
        themeRes.data?.logo_path !== undefined
          ? themeRes.data.logo_path
          : previewUrl;

      setHasExistingTheme(true);
      setSavedSnapshot({
        letterhead_color: updatedColor,
        logo_path: updatedLogo,
      });
      setHexColor(updatedColor);
      setPreviewUrl(updatedLogo);
      setShowPreview(Boolean(updatedLogo));
      setIsEditing(false);
      toast.success("Business theme saved successfully.");
    });
  };

  return (
    <div className="bg-card border border-border rounded-xl p-8 max-w-5xl">
      <div className="space-y-6">
        <h3 className="text-lg font-medium text-foreground">Business Theme</h3>

        <div className="space-y-6">
          <h4 className="text-base font-medium text-muted-foreground">
            Brand Identity
          </h4>

          <fieldset
            disabled={!isEditing || isPending}
            className="grid grid-cols-1 md:grid-cols-2 gap-12 disabled:opacity-85"
          >
            {/* Logo Upload Section */}
            <div className="flex flex-col gap-3">
              <label className="text-sm font-medium text-muted-foreground">
                Company Logo
              </label>

              <input
                ref={fileInputRef}
                type="file"
                accept="image/png,image/jpeg,image/webp"
                className="hidden"
                disabled={!isEditing || isPending}
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) handleFileSelect(file);
                }}
              />

              {/* Show 3-State Upload Progress Bar instead of square while uploading/success/error */}
              {uploadStatus !== "idle" && uploadedFileMeta ? (
                <div className="space-y-1.5 py-4">
                  {/* Top Row: Filename + Status Icon */}
                  <div className="flex items-center justify-between text-xs font-medium">
                    <span className="truncate text-foreground max-w-[220px]">
                      {uploadedFileMeta.name}
                    </span>

                    {uploadStatus === "uploading" && (
                      <button
                        type="button"
                        onClick={resetUploadBar}
                        aria-label="Cancel upload"
                        className="text-muted-foreground hover:text-foreground cursor-pointer"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    )}

                    {uploadStatus === "success" && (
                      <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                    )}

                    {uploadStatus === "error" && (
                      <button
                        type="button"
                        onClick={resetUploadBar}
                        aria-label="Dismiss error"
                        className="text-rose-600 hover:text-rose-500 cursor-pointer"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    )}
                  </div>

                  {/* Progress Track */}
                  <div
                    className={`h-1.5 w-full overflow-hidden rounded-full ${
                      uploadStatus === "error"
                        ? "bg-rose-500/20"
                        : "bg-secondary"
                    }`}
                  >
                    <div
                      className={`h-full rounded-full transition-all duration-300 ${
                        uploadStatus === "uploading"
                          ? "bg-primary"
                          : uploadStatus === "success"
                          ? "bg-emerald-500"
                          : "bg-rose-600"
                      }`}
                      style={{ width: `${uploadProgress}%` }}
                    />
                  </div>

                  {/* Bottom Row: Size / Status Text + Percentage / Try Again */}
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-muted-foreground">
                      {uploadStatus === "uploading" &&
                        formatFileSize(uploadedFileMeta.size)}
                      {uploadStatus === "success" && "Upload Successful!"}
                      {uploadStatus === "error" &&
                        "Upload failed! Please try again"}
                    </span>

                    {uploadStatus === "error" ? (
                      <button
                        type="button"
                        onClick={() => {
                          if (logoFile) void runLogoUpload(logoFile);
                        }}
                        className="flex items-center gap-1 font-medium text-foreground hover:text-primary transition-colors cursor-pointer"
                      >
                        Try Again
                        <RotateCw className="w-3.5 h-3.5 text-primary" />
                      </button>
                    ) : (
                      <span className="font-medium text-foreground">
                        {uploadProgress}%
                      </span>
                    )}
                  </div>
                </div>
              ) : (
                <div
                  className={`
                    relative border-2 border-dashed rounded-lg flex flex-col items-center justify-center transition-colors h-48 overflow-hidden
                    ${showPreview && previewUrl ? "p-3" : "p-8"}
                    ${isDragging ? "border-primary bg-primary/5" : "border-border bg-input/50"}
                  `}
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                >
                  {showPreview && previewUrl ? (
                    <>
                      <img
                        src={previewUrl}
                        alt="Company Logo Preview"
                        onError={(e) => {
                          if (
                            localPreviewRef.current &&
                            e.currentTarget.src !== localPreviewRef.current
                          ) {
                            e.currentTarget.src = localPreviewRef.current;
                          }
                        }}
                        className="w-full h-full object-contain rounded"
                      />
                      {isEditing && (
                        <button
                          type="button"
                          onClick={handleRemoveLogo}
                          aria-label="Remove logo"
                          className="absolute top-2 right-2 p-1 rounded-full bg-background/80 border border-border text-muted-foreground hover:text-destructive hover:border-destructive transition-colors cursor-pointer"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      )}
                    </>
                  ) : (
                    <>
                      <div className="w-12 h-12 flex items-center justify-center rounded-full bg-secondary/50 mb-4">
                        <CloudUpload className="w-6 h-6 text-primary" />
                      </div>
                      <div className="text-sm text-foreground mb-1 text-center">
                        Drag & Drop or{" "}
                        <span
                          onClick={() => {
                            if (isEditing) fileInputRef.current?.click();
                          }}
                          className={`text-primary ${
                            isEditing
                              ? "cursor-pointer hover:underline"
                              : "cursor-not-allowed"
                          }`}
                        >
                          Browse
                        </span>
                      </div>
                      <div className="text-xs text-muted-foreground text-center">
                        MAX 5 MB, PNG/JPG
                      </div>
                    </>
                  )}
                </div>
              )}
            </div>

            {/* Letter Head Color Section */}
            <div className="flex flex-col gap-1">
              <label className="text-sm font-medium text-muted-foreground">
                Letter Head Color (Optional)
              </label>
              <div className="relative">
                <div className="flex h-9.5 w-full overflow-hidden rounded-md border border-input bg-input focus-within:border-ring focus-within:ring-[3px] focus-within:ring-ring/50">
                  <Popover>
                    <PopoverTrigger
                      type="button"
                      disabled={!isEditing || isPending}
                      aria-label="Pick letterhead color"
                      className="flex shrink-0 items-center justify-center px-3 border-r border-input hover:bg-secondary/50 transition-colors cursor-pointer disabled:cursor-not-allowed"
                    >
                      <div
                        className="w-5 h-5 rounded-sm shadow-inner border border-border/50"
                        style={{ backgroundColor: validHex }}
                      />
                    </PopoverTrigger>
                    <PopoverContent
                      align="start"
                      className="w-64 p-3 bg-popover border-border space-y-3"
                    >
                      <HexColorPicker
                        color={validHex}
                        onChange={(color) => setHexColor(color.toUpperCase())}
                        style={{ width: "100%", height: "160px" }}
                      />
                      <div className="flex items-center gap-2 pt-1">
                        <Button
                          type="button"
                          variant="outline"
                          size="icon"
                          onClick={handleEyeDropper}
                          className="h-8 w-8 shrink-0 bg-input border-input"
                          title="Pick color from screen"
                        >
                          <Pipette className="w-4 h-4" />
                        </Button>
                        <div className="flex h-8 flex-1 items-center rounded-md border border-input bg-input px-2">
                          <span className="text-xs text-muted-foreground mr-2">
                            HEX
                          </span>
                          <input
                            type="text"
                            value={hexColor}
                            onChange={(e) => handleHexChange(e.target.value)}
                            maxLength={7}
                            className="w-full bg-transparent text-xs uppercase outline-none text-foreground"
                            placeholder="#E0A753"
                          />
                        </div>
                      </div>
                    </PopoverContent>
                  </Popover>
                  <input
                    type="text"
                    value={hexColor}
                    onChange={(e) => handleHexChange(e.target.value)}
                    maxLength={7}
                    className="h-full w-full bg-transparent px-3 text-sm outline-none text-muted-foreground uppercase"
                    placeholder="#E0A753"
                  />
                </div>
              </div>
            </div>
          </fieldset>
        </div>
      </div>

      <div className="mt-12 space-y-6">
        <Separator className="bg-border" />

        {/* Action Buttons */}
        <div className="flex justify-end gap-4">
          {!isEditing ? (
            <Button
              type="button"
              onClick={() => setIsEditing(true)}
              className="px-8 bg-primary hover:bg-primary-hover text-primary-foreground"
            >
              <Pencil className="w-4 h-4 mr-2" />
              Edit
            </Button>
          ) : (
            <>
              {hasExistingTheme && (
                <Button
                  type="button"
                  variant="outline"
                  disabled={isPending || uploadStatus === "uploading"}
                  onClick={handleCancel}
                  className="px-8 bg-transparent hover:bg-secondary"
                >
                  Cancel
                </Button>
              )}
              <Button
                type="button"
                disabled={
                  isPending ||
                  uploadStatus === "uploading" ||
                  (hasExistingTheme && !isDirty)
                }
                onClick={handleSave}
                className="px-8 bg-primary hover:bg-primary-hover text-primary-foreground"
              >
                {isPending ? "Saving..." : "Save"}
              </Button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}