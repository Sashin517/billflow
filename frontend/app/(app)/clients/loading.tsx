import { Skeleton } from "@/components/ui/skeleton";

export default function ClientsLoading() {
  return (
    <div className="space-y-8 flex flex-col h-full">
      {/* Header Section Skeleton */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <Skeleton className="h-9 w-32" />
        <Skeleton className="h-11 w-40 rounded-md" />
      </div>

      {/* Sub-header & Filters Skeleton */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <Skeleton className="h-7 w-24" />
        
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <Skeleton className="h-11 w-full sm:w-[320px] rounded-md" />
          <Skeleton className="h-11 w-28 rounded-md shrink-0" />
        </div>
      </div>

      {/* Clients Grid Skeleton */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {Array.from({ length: 12 }).map((_, i) => (
          <div 
            key={i} 
            className="bg-card border border-border rounded-xl flex flex-col overflow-hidden relative"
          >
            {/* Top Right Actions Skeleton */}
            <div className="absolute top-5 right-5 flex items-center gap-3 z-10">
              <Skeleton className="w-[18px] h-[18px] rounded-sm" />
              <Skeleton className="w-[18px] h-[18px] rounded-sm" />
            </div>

            {/* Card Content Skeleton */}
            <div className="p-6 pb-5 flex-1 mt-2">
              <div className="flex items-center gap-4 mb-6">
                {/* Avatar Skeleton */}
                <Skeleton className="w-12 h-12 rounded-full shrink-0" />
                <div className="space-y-2">
                  {/* Name & Title Skeleton */}
                  <Skeleton className="h-5 w-32" />
                  <Skeleton className="h-4 w-40" />
                </div>
              </div>

              {/* Contact Info Skeleton */}
              <div className="space-y-3">
                <Skeleton className="h-4 w-48" />
                <Skeleton className="h-4 w-32" />
              </div>
            </div>

            {/* Bottom Actions Bar Skeleton */}
            <div className="flex items-center justify-between px-6 py-4 border-t border-border/50 bg-card">
              <Skeleton className="w-5 h-5 rounded-sm" />
              <Skeleton className="w-5 h-5 rounded-sm" />
              <Skeleton className="w-5 h-5 rounded-sm" />
              <Skeleton className="w-5 h-5 rounded-sm" />
            </div>
          </div>
        ))}
      </div>

      {/* Pagination Skeleton */}
      <div className="flex justify-center items-center mt-6 pb-6">
        <Skeleton className="h-11 w-[400px] rounded-lg border border-border/50" />
      </div>
    </div>
  );
}