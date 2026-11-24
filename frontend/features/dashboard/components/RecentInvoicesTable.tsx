"use client";

import { useMemo, useState } from "react";
import { Filter, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import DataTable from "@/components/shared/DataTable";
import {
  recentInvoicesColumns,
  type RecentInvoice,
} from "@/features/dashboard/data/recent-invoices";

interface RecentInvoicesTableProps {
  invoices?: RecentInvoice[];
}

const STATUS_OPTIONS: ("All" | RecentInvoice["status"])[] = [
  "All",
  "Draft",
  "Pending",
  "Paid",
  "Overdue",
];

export default function RecentInvoicesTable({
  invoices = [],
}: RecentInvoicesTableProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<
    "All" | RecentInvoice["status"]
  >("All");

  const filteredInvoices = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();

    return invoices.filter((inv) => {
      const matchesStatus =
        statusFilter === "All" || inv.status === statusFilter;

      const matchesSearch =
        !q ||
        inv.id.toLowerCase().includes(q) ||
        inv.company.toLowerCase().includes(q) ||
        inv.clientName.toLowerCase().includes(q) ||
        inv.amount.toLowerCase().includes(q) ||
        inv.status.toLowerCase().includes(q);

      return matchesStatus && matchesSearch;
    });
  }, [invoices, searchQuery, statusFilter]);

  return (
    <div className="bg-card border border-border rounded-2xl overflow-hidden">
      {/* Header Row: Title on Left, Search + Filter on Right */}
      <div className="px-6 py-5 border-b border-border/50 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <h3 className="text-base font-medium text-foreground">
          Recent Invoices
        </h3>

        <div className="flex items-center gap-3 w-full sm:w-auto">
          <div className="relative w-full sm:w-[280px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search....."
              className="pl-10 pr-4 h-11 bg-input border-border text-sm"
            />
          </div>

          <Popover>
            <PopoverTrigger
              render={
                <Button
                  variant="outline"
                  className="group h-11 px-6 !bg-input border !border-border text-primary hover:!bg-secondary hover:text-white shrink-0"
                />
              }
            >
              <Filter className="w-4 h-4 mr-2 text-primary group-hover:text-white transition-colors" />
              {statusFilter === "All" ? "Filters" : statusFilter}
            </PopoverTrigger>
            <PopoverContent
              align="end"
              className="w-44 p-1.5 bg-popover border-border"
            >
              <div className="flex flex-col gap-1">
                {STATUS_OPTIONS.map((status) => (
                  <button
                    key={status}
                    type="button"
                    onClick={() => setStatusFilter(status)}
                    className={`w-full text-left px-3 py-2 rounded-md text-sm transition-colors cursor-pointer ${
                      statusFilter === status
                        ? "bg-primary text-primary-foreground font-medium"
                        : "text-foreground hover:bg-secondary"
                    }`}
                  >
                    {status}
                  </button>
                ))}
              </div>
            </PopoverContent>
          </Popover>
        </div>
      </div>

      {/* DataTable (Pagination built in, 9 rows per page) */}
      <DataTable columns={recentInvoicesColumns} data={filteredInvoices} />
    </div>
  );
}