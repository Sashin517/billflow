import { Skeleton } from "@/components/ui/skeleton";
import { Separator } from "@/components/ui/separator";

export default function ThemeSettingsLoading() {
  return (
    <div className="bg-card border border-border rounded-xl p-8 max-w-5xl">
      <div className="space-y-6">
        {/* Heading: Business Theme */}
        <Skeleton className="h-7 w-40" />

        <div className="space-y-6">
          {/* Subheading: Brand Identity */}
          <Skeleton className="h-5 w-32" />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            {/* Logo Upload Square Skeleton */}
            <div className="flex flex-col gap-3">
              <Skeleton className="h-4 w-28" />
              <Skeleton className="h-48 w-full rounded-lg" />
            </div>

            {/* Letter Head Color Input Skeleton */}
            <div className="flex flex-col gap-1">
              <Skeleton className="h-4 w-44 mb-1" />
              <Skeleton className="h-9.5 w-full rounded-md" />
            </div>
          </div>
        </div>
      </div>

      <div className="mt-12 space-y-6">
        <Separator className="bg-border" />

        {/* Action Button Skeleton */}
        <div className="flex justify-end gap-4">
          <Skeleton className="h-9.5 w-24 rounded-md" />
        </div>
      </div>
    </div>
  );
}