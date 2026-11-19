import { Skeleton } from "@/components/ui/skeleton";

export default function InvoicesTableLoading() {
  return (
    <div className="space-y-8 flex flex-col h-full">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <Skeleton className="h-9 w-32" />
        <Skeleton className="h-11 w-40 rounded-md" />
      </div>

      {/* Sub-header & Filters */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <Skeleton className="h-7 w-24" />
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <Skeleton className="h-11 w-full sm:w-[320px] rounded-md" />
          <Skeleton className="h-11 w-28 rounded-md shrink-0" />
        </div>
      </div>

      {/* Table Skeleton */}
      <div className="bg-card border border-border rounded-xl overflow-hidden flex-1">
        {/* Table Header */}
        <div className="bg-secondary/50 border-b border-border p-4 grid grid-cols-5 gap-4">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-full" />
        </div>
        
        {/* Table Rows */}
        {Array.from({ length: 7 }).map((_, i) => (
          <div key={i} className="p-4 border-b border-border/50 grid grid-cols-5 gap-4 items-center">
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-4 w-1/2" />
            <Skeleton className="h-4 w-2/3" />
            <Skeleton className="h-5 w-20 rounded-full" />
            <div className="flex justify-end"><Skeleton className="h-8 w-8 rounded-md" /></div>
          </div>
        ))}
      </div>

      {/* Pagination */}
      <div className="flex justify-center items-center mt-6 pb-6">
        <Skeleton className="h-11 w-[400px] rounded-lg border border-border/50" />
      </div>
    </div>
  );
}