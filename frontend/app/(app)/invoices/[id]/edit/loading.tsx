import { Skeleton } from "@/components/ui/skeleton";

export default function InvoiceCreatorLoading() {
  return (
    <div className="flex h-[calc(100vh-2rem)] w-full overflow-hidden relative">
      
      {/* Left Side: Form Panel Skeleton */}
      <div className="w-[45%] flex-shrink-0 border-r border-border pr-6 overflow-y-auto pb-12 no-scrollbar">
        <div className="space-y-8">
          
          {/* Main Title */}
          <Skeleton className="h-8 w-[350px]" />

          {/* Invoice Details Section */}
          <div className="space-y-4">
            <Skeleton className="h-5 w-32" />
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <Skeleton className="h-4 w-24 mb-2" />
                {/* Mimics the h-9.5 input field */}
                <Skeleton className="h-9.5 w-full rounded-md" /> 
              </div>
              <div className="space-y-1">
                <Skeleton className="h-4 w-24 mb-2" />
                <Skeleton className="h-9.5 w-full rounded-md" />
              </div>
            </div>
          </div>

          {/* Client Section */}
          <div className="space-y-4">
            <Skeleton className="h-5 w-32" />
            <div className="space-y-1">
              <Skeleton className="h-9.5 w-full rounded-md" />
            </div>
          </div>

          {/* Item Management Section */}
          <div className="space-y-4 bg-card border border-border rounded-xl p-6">
            <Skeleton className="h-5 w-40" />
            
            {/* Table Header */}
            <div className="grid grid-cols-12 gap-4 pb-2 border-b border-border/50">
              <Skeleton className="col-span-5 h-3" />
              <Skeleton className="col-span-2 h-3" />
              <Skeleton className="col-span-2 h-3" />
              <div className="col-span-3 flex justify-end"><Skeleton className="h-3 w-12" /></div>
            </div>

            {/* Item Rows (Mimicking the input fields inside the table) */}
            <div className="space-y-3 pt-2">
              {[1, 2].map((i) => (
                <div key={i} className="grid grid-cols-12 gap-3 items-center">
                  <Skeleton className="col-span-5 h-9.5 rounded-md" />
                  <Skeleton className="col-span-2 h-9.5 rounded-md" />
                  <Skeleton className="col-span-2 h-9.5 rounded-md" />
                  <div className="col-span-3 flex justify-end items-center gap-3">
                    <Skeleton className="h-4 w-20" />
                    <Skeleton className="h-4 w-4" /> {/* Mimics Trash Icon */}
                  </div>
                </div>
              ))}
            </div>

            {/* Add New Item Button */}
            <div className="pt-2 flex justify-end">
              <Skeleton className="h-4 w-28" />
            </div>
          </div>

          {/* Tax & Totals Box */}
          <div className="bg-[#1A1A1A] border border-border rounded-xl p-6 space-y-6">
            <div className="flex justify-between items-center">
              <Skeleton className="h-5 w-20" />
              <Skeleton className="h-5 w-28" />
            </div>
            
            <div className="space-y-4 pt-2">
              <Skeleton className="h-4 w-40 mb-2" />
              
              {/* Checkbox Rows */}
              {[1, 2].map((i) => (
                <div key={i} className="flex justify-between items-center">
                  <div className="flex items-center gap-3">
                    <Skeleton className="h-4 w-4 rounded-sm" />
                    <Skeleton className="h-4 w-20" />
                  </div>
                  <Skeleton className="h-4 w-24" />
                </div>
              ))}
            </div>

            <div className="pt-4 border-t border-border/50 flex justify-between items-center">
              <Skeleton className="h-5 w-24" />
              <Skeleton className="h-5 w-32" />
            </div>
          </div>

          {/* Save Button */}
          <div className="flex justify-end pt-4">
            <Skeleton className="h-11 w-32 rounded-md" />
          </div>
        </div>
      </div>

      {/* Splitter Button Skeleton (Centered Chevron) */}
      <div className="absolute left-[calc(45%-16px)] top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-secondary border border-border flex items-center justify-center z-10 shadow-md">
        <Skeleton className="w-3 h-3 rounded-full" />
      </div>

      {/* Right Side: Live Preview Panel Skeleton */}
      <div className="flex-1 flex flex-col pl-6 overflow-y-auto">
        
        {/* Top Actions */}
        <div className="flex items-center justify-between mb-6 h-11 pr-4">
          <Skeleton className="h-6 w-28" />
          <Skeleton className="h-11 w-36 rounded-md" />
        </div>

        {/* Invoice Document Canvas (White Paper styling) */}
        <div className="w-full max-w-[850px] mx-auto bg-white rounded-sm shadow-lg flex flex-col overflow-hidden opacity-90">
          
          {/* Doc Header Strip (Dark) */}
          <div className="bg-[#1A1A1A] p-8 flex justify-between items-center">
            <div className="flex gap-4 items-center">
              <Skeleton className="w-12 h-12 rounded-md bg-gray-600" />
              <Skeleton className="h-6 w-40 bg-gray-600" />
            </div>
            <div className="space-y-2 flex flex-col items-end">
              <Skeleton className="h-3 w-32 bg-gray-600" />
              <Skeleton className="h-3 w-48 bg-gray-600" />
              <Skeleton className="h-3 w-28 bg-gray-600" />
            </div>
          </div>

          {/* Doc Contact Strip */}
          <div className="bg-[#F4F4F4] py-3 flex justify-center border-b border-gray-200">
             <Skeleton className="h-2 w-[400px] bg-gray-300" />
          </div>

          {/* Doc Body */}
          <div className="p-12 flex-1">
            <Skeleton className="h-10 w-48 bg-gray-200 mb-12" />

            <div className="flex justify-between items-end mb-12">
              <div className="space-y-3">
                <Skeleton className="h-3 w-16 bg-gray-300" />
                <Skeleton className="h-3 w-48 bg-gray-200" />
                <Skeleton className="h-3 w-40 bg-gray-200" />
                <div className="pt-2"><Skeleton className="h-3 w-64 bg-gray-200" /></div>
                <Skeleton className="h-3 w-56 bg-gray-200" />
              </div>
              <div className="space-y-3 flex flex-col items-end">
                <Skeleton className="h-3 w-40 bg-gray-200" />
                <Skeleton className="h-3 w-32 bg-gray-200" />
              </div>
            </div>

            {/* Doc Table */}
            <div className="space-y-4 border-b border-gray-200 pb-4 mb-8">
              <div className="bg-[#F4F4F4] p-4 flex justify-between rounded-sm">
                 <Skeleton className="h-3 w-20 bg-gray-300" />
                 <Skeleton className="h-3 w-16 bg-gray-300" />
                 <Skeleton className="h-3 w-12 bg-gray-300" />
                 <Skeleton className="h-3 w-16 bg-gray-300" />
              </div>
              <div className="px-4 flex justify-between py-2">
                 <Skeleton className="h-3 w-48 bg-gray-200" />
                 <Skeleton className="h-3 w-12 bg-gray-200" />
                 <Skeleton className="h-3 w-10 bg-gray-200" />
                 <Skeleton className="h-3 w-20 bg-gray-200" />
              </div>
              <div className="px-4 flex justify-between py-2">
                 <Skeleton className="h-3 w-32 bg-gray-200" />
                 <Skeleton className="h-3 w-8 bg-gray-200" />
                 <Skeleton className="h-3 w-12 bg-gray-200" />
                 <Skeleton className="h-3 w-20 bg-gray-200" />
              </div>
            </div>

            {/* Doc Totals */}
            <div className="flex justify-end">
              <div className="w-[300px] space-y-3">
                <div className="flex justify-between"><Skeleton className="h-3 w-20 bg-gray-200" /><Skeleton className="h-3 w-24 bg-gray-200" /></div>
                <div className="flex justify-between"><Skeleton className="h-3 w-24 bg-gray-200" /><Skeleton className="h-3 w-20 bg-gray-200" /></div>
                <div className="flex justify-between"><Skeleton className="h-3 w-20 bg-gray-200" /><Skeleton className="h-3 w-20 bg-gray-200" /></div>
                <div className="flex justify-between"><Skeleton className="h-3 w-32 bg-gray-200" /><Skeleton className="h-3 w-20 bg-gray-200" /></div>
                <div className="pt-3 border-t border-gray-200 flex justify-between">
                  <Skeleton className="h-3 w-24 bg-gray-300" /><Skeleton className="h-3 w-24 bg-gray-300" />
                </div>
                <div className="flex justify-between pb-3">
                   <Skeleton className="h-3 w-24 bg-gray-300" /><Skeleton className="h-3 w-24 bg-gray-300" />
                </div>
                <div className="pt-3 border-t border-black flex justify-between">
                  <Skeleton className="h-4 w-32 bg-gray-400" /><Skeleton className="h-4 w-24 bg-gray-400" />
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Pagination Skeleton below document */}
        <div className="flex items-center justify-center gap-4 mt-8 pb-8">
           <Skeleton className="w-8 h-8 rounded-full" />
           <Skeleton className="h-4 w-8" />
           <Skeleton className="w-8 h-8 rounded-full" />
        </div>

      </div>
    </div>
  );
}