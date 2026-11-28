import { Skeleton } from "@/components/ui/skeleton";

export default function DashboardLoading() {
  return (
    <div className="space-y-8 pb-12">
      {/* Header Section: Welcome + Date on Left, Filter + Create Button on Right */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-2">
          <Skeleton className="h-9 w-64" />
          <Skeleton className="h-4 w-52" />
        </div>

        <div className="flex items-center gap-4">
          <Skeleton className="h-11 w-[165px] rounded-full" />
          <Skeleton className="h-11 w-[150px] rounded-full" />
        </div>
      </div>

      {/* KPI Cards Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {Array.from({ length: 2 }).map((_, i) => (
          <div
            key={i}
            className="bg-card border border-border rounded-[24px] p-8 flex flex-col justify-between h-[236px]"
          >
            {/* Card Header */}
            <div className="flex justify-between items-start">
              <div className="space-y-2">
                <Skeleton className="h-7 w-44" />
                <Skeleton className="h-4 w-36" />
              </div>
              <Skeleton className="h-6 w-6 rounded-md" />
            </div>

            {/* Card Footer / Values */}
            <div className="flex flex-col items-end justify-end mt-auto gap-2.5">
              <div className="flex items-center gap-4">
                <Skeleton className="h-7 w-14 rounded" />
                <Skeleton className="h-9 w-48" />
              </div>
              <Skeleton className="h-4 w-24" />
            </div>
          </div>
        ))}
      </div>

      {/* Recent Invoices Table Section */}
      <div className="bg-card border border-border rounded-2xl overflow-hidden">
        {/* Table Card Header: Title + Search + Filter */}
        <div className="px-6 py-5 border-b border-border/50 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <Skeleton className="h-5 w-32" />

          <div className="flex items-center gap-3 w-full sm:w-auto">
            <Skeleton className="h-11 w-full sm:w-[280px] rounded-md" />
            <Skeleton className="h-11 w-28 rounded-md shrink-0" />
          </div>
        </div>

        {/* Table Header */}
        <div className="border-b border-border px-6 py-4 grid grid-cols-6 gap-4">
          <Skeleton className="h-4 w-20" />
          <Skeleton className="h-4 w-28" />
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-4 w-20" />
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-4 w-16" />
        </div>

        {/* Table Rows (9 rows matching DataTable default pageSize) */}
        <div className="divide-y divide-border/50">
          {Array.from({ length: 9 }).map((_, i) => (
            <div
              key={i}
              className="px-6 py-4 grid grid-cols-6 gap-4 items-center"
            >
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-4 w-32" />
              <Skeleton className="h-4 w-28" />
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-6 w-20 rounded-full" />
            </div>
          ))}
        </div>

        {/* Pagination */}
        <div className="flex justify-center items-center py-6">
          <Skeleton className="h-10 w-[340px] rounded-lg" />
        </div>
      </div>
    </div>
  );
}