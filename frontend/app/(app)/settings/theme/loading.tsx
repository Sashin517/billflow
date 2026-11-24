import { Skeleton } from "@/components/ui/skeleton";
import { Separator } from "@/components/ui/separator";

export default function ProfileSettingsLoading() {
  return (
    <div className="bg-card border border-border rounded-xl p-8 max-w-5xl">
      <div className="space-y-8">
        {/* Business Details Section */}
        <div className="space-y-6">
          <Skeleton className="h-7 w-40" />
          <div className="space-y-2">
            <Skeleton className="h-4 w-28" />
            <Skeleton className="h-9.5 w-full md:w-1/2 rounded-md" />
          </div>
        </div>

        {/* Address Section */}
        <div className="space-y-6">
          <Skeleton className="h-5 w-20" />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="space-y-2">
                <Skeleton className="h-4 w-28" />
                <Skeleton className="h-9.5 w-full rounded-md" />
              </div>
            ))}
          </div>
        </div>

        {/* Contact Numbers Section */}
        <div className="space-y-6">
          <Skeleton className="h-5 w-36" />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Skeleton className="h-4 w-32" />
              <div className="flex gap-2">
                <Skeleton className="h-9.5 flex-1 rounded-md" />
                <Skeleton className="h-9.5 w-[110px] rounded-md" />
              </div>
            </div>
          </div>
        </div>

        {/* Web & Tax Section */}
        <div className="space-y-6">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="space-y-2">
              <Skeleton className="h-4 w-32" />
              <Skeleton className="h-9.5 w-full rounded-md" />
            </div>
          ))}
        </div>

        <Separator className="bg-border" />

        {/* Tax & Service Charges Section */}
        <div className="space-y-6">
          <Skeleton className="h-7 w-48" />
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-x-12 gap-y-6">
            {Array.from({ length: 2 }).map((_, i) => (
              <div key={i} className="flex gap-4 items-end">
                <div className="flex-1 space-y-2">
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="h-9.5 w-full rounded-md" />
                </div>
                <div className="flex-[0.8] space-y-2">
                  <Skeleton className="h-4 w-16" />
                  <Skeleton className="h-9.5 w-full rounded-md" />
                </div>
                <div className="flex flex-col items-center space-y-2">
                  <Skeleton className="h-4 w-24" />
                  <div className="flex h-9.5 items-center justify-center">
                    <Skeleton className="h-5 w-9 rounded-full" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <Separator className="bg-border" />

        {/* Action Buttons */}
        <div className="flex justify-end gap-4">
          <Skeleton className="h-9.5 w-24 rounded-md" />
        </div>
      </div>
    </div>
  );
}