"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import KpiCard from "@/features/dashboard/components/KpiCard";
import {
  calculateDashboardKpis,
  type InvoiceMetricInput,
  type Timeframe,
} from "@/lib/calc";

interface DashboardHeaderAndKpisProps {
  displayName: string;
  formattedDate: string;
  invoices: InvoiceMetricInput[];
}

export default function DashboardHeaderAndKpis({
  displayName,
  formattedDate,
  invoices,
}: DashboardHeaderAndKpisProps) {
  const [timeframe, setTimeframe] = useState<Timeframe>("All");

  const kpis = useMemo(
    () => calculateDashboardKpis(invoices, timeframe),
    [invoices, timeframe]
  );

  return (
    <>
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-semibold text-foreground tracking-tight">
            Welcome, {displayName} !
          </h1>
          <p className="text-muted-foreground mt-1">{formattedDate}</p>
        </div>

        <div className="flex items-center gap-4">
          <Select
            value={timeframe}
            onValueChange={(val) => setTimeframe(val as Timeframe)}
          >
            <SelectTrigger className="data-[size=default]:h-11 px-6 bg-transparent border-border rounded-full w-[165px] text-foreground">
              <SelectValue placeholder="Filter" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem className="px-4 py-3" value="Today">
                Today
              </SelectItem>
              <SelectItem className="px-4 py-3" value="Week-to-date">
                Week-to-date
              </SelectItem>
              <SelectItem className="px-4 py-3" value="Month-to-date">
                Month-to-date
              </SelectItem>
              <SelectItem className="px-4 py-3" value="Year-to-date">
                Year-to-date
              </SelectItem>
              <SelectItem className="px-4 py-3" value="All">
                All
              </SelectItem>
            </SelectContent>
          </Select>

          <Link href="/invoices/new">
            <Button className="bg-primary hover:bg-primary-hover text-primary-foreground font-medium h-11 px-6 rounded-full">
              Create Invoice
            </Button>
          </Link>
        </div>
      </div>

      {/* KPI Cards Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <KpiCard
          title="Total Revenue"
          subtitle="Total revenue collected"
          amount={kpis.totalRevenue.amount}
          trend={kpis.totalRevenue.trend}
          trendDirection={kpis.totalRevenue.trendDirection}
          trendLabel={kpis.totalRevenue.trendLabel}
        />
        <KpiCard
          title="Outstanding Balance"
          subtitle="Pending & overdue invoices"
          amount={kpis.outstandingBalance.amount}
          trend={kpis.outstandingBalance.trend}
          trendDirection={kpis.outstandingBalance.trendDirection}
          trendLabel={kpis.outstandingBalance.trendLabel}
        />
      </div>
    </>
  );
}