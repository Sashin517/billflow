"use client";

import Link from "next/link";
import { 
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue 
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import KpiCard from "@/features/dashboard/components/KpiCard";
import DataTable from "@/components/shared/DataTable"; // Your existing table component
import { recentInvoicesColumns, recentInvoicesData } from "@/features/dashboard/data/recent-invoices";

export default function DashboardPage() {
  return (
    <div className="space-y-8 pb-12">
      
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-semibold text-foreground tracking-tight">Welcome Clare !</h1>
          <p className="text-muted-foreground mt-1">Thursday, May 2026</p>
        </div>

        <div className="flex items-center gap-4">
          <Select defaultValue="today">
            <SelectTrigger className="h-11 px-4 bg-transparent border-border rounded-full w-[140px] text-foreground">
              <SelectValue placeholder="Filter" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="today">Today</SelectItem>
              <SelectItem value="week">Week-to-date</SelectItem>
              <SelectItem value="month">Month-to-date</SelectItem>
              <SelectItem value="year">Year-to-date</SelectItem>
              <SelectItem value="all">All</SelectItem>
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
          amount="Rs. 150,000.00"
          trend="15%"
          trendLabel="vs, last period"
        />
        <KpiCard 
          title="Outstanding Balance"
          subtitle="Total revenue collected"
          amount="Rs. 50,450.50"
          trend="15%"
          trendLabel="vs, last period"
        />
      </div>

      {/* Recent Invoices Table Section */}
      <div className="bg-card border border-border rounded-2xl overflow-hidden">
        <div className="px-6 py-5 border-b border-border/50">
          <h3 className="text-base font-medium text-foreground">Recent Invoices</h3>
        </div>
        
        {/* Render your existing DataTable component */}
        <DataTable 
          columns={recentInvoicesColumns} 
          data={recentInvoicesData} 
        />
      </div>

    </div>
  );
}