"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Search, FileText, Loader2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import Breadcrumbs from "./Breadcrumbs";
import {
  getInvoices,
  type InvoiceOut,
  type InvoiceStatus,
} from "@/lib/actions/invoice.actions";

const STATUS_BADGE: Record<InvoiceStatus, string> = {
  Paid: "bg-green-500/15 text-green-500",
  Pending: "bg-[#D4AF37]/15 text-[#D4AF37]",
  Overdue: "bg-destructive/15 text-destructive",
  Draft: "bg-white/10 text-muted-foreground",
};

export default function Topbar({ userMenu }: { userMenu: React.ReactNode }) {
  const router = useRouter();
  const containerRef = useRef<HTMLDivElement>(null);

  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const [invoices, setInvoices] = useState<InvoiceOut[]>([]);
  const [hasLoaded, setHasLoaded] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const loadInvoices = async () => {
    if (hasLoaded || isLoading) return;
    setIsLoading(true);
    try {
      const data = await getInvoices();
      setInvoices(data);
      setHasLoaded(true);
    } finally {
      setIsLoading(false);
    }
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(e.target as Node)
      ) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const matches = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return [];

    return invoices
      .filter(
        (inv) =>
          inv.invoice_no.toLowerCase().includes(q) ||
          inv.status.toLowerCase().includes(q) ||
          inv.issue_date.toLowerCase().includes(q) ||
          String(inv.grand_total).toLowerCase().includes(q)
      )
      .slice(0, 6);
  }, [invoices, query]);

  const handleSelectInvoice = (invoiceNo: string) => {
    setOpen(false);
    setQuery("");
    router.push(`/invoices?search=${encodeURIComponent(invoiceNo)}`);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && query.trim()) {
      e.preventDefault();
      handleSelectInvoice(query.trim());
    } else if (e.key === "Escape") {
      setOpen(false);
    }
  };

  return (
    <header className="h-20 border-b border-border bg-background flex items-center justify-between px-8 sticky top-0 z-30">
      <div className="flex-1">
        <Breadcrumbs />
      </div>

      <div className="flex items-center gap-6">
        <div ref={containerRef} className="relative hidden md:block">
          <div className="relative w-64 bg-secondary/30 rounded-full border border-border focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/30">
            <Search className="w-4.5 h-4.5 absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <Input
              type="text"
              value={query}
              onFocus={() => {
                setOpen(true);
                loadInvoices();
              }}
              onChange={(e) => {
                setQuery(e.target.value);
                setOpen(true);
              }}
              onKeyDown={handleKeyDown}
              placeholder="Search invoice..."
              className="pl-11 h-9.5 rounded-full border-0 bg-transparent pr-4 text-sm shadow-none focus-visible:ring-0 focus-visible:ring-offset-0"
            />
          </div>

          {/* Search Results Dropdown */}
          {open && query.trim().length > 0 && (
            <div className="absolute right-0 mt-2 w-80 bg-popover border border-border rounded-xl shadow-2xl overflow-hidden z-50">
              {isLoading ? (
                <div className="flex items-center justify-center gap-2 py-6 text-sm text-muted-foreground">
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Searching invoices...
                </div>
              ) : matches.length > 0 ? (
                <div className="divide-y divide-border/50 max-h-72 overflow-y-auto">
                  {matches.map((inv) => (
                    <button
                      key={inv.id}
                      type="button"
                      onClick={() => handleSelectInvoice(inv.invoice_no)}
                      className="w-full px-4 py-3 flex items-center justify-between gap-3 text-left hover:bg-secondary/60 transition-colors cursor-pointer"
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <FileText className="w-4 h-4 text-primary shrink-0" />
                        <div className="min-w-0">
                          <p className="text-sm font-medium text-foreground truncate">
                            {inv.invoice_no}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {inv.issue_date} • Rs.{" "}
                            {Number(inv.grand_total).toLocaleString("en-US", {
                              minimumFractionDigits: 2,
                              maximumFractionDigits: 2,
                            })}
                          </p>
                        </div>
                      </div>
                      <span
                        className={`shrink-0 px-2.5 py-0.5 rounded-full text-[11px] font-medium ${
                          STATUS_BADGE[inv.status] || STATUS_BADGE.Draft
                        }`}
                      >
                        {inv.status}
                      </span>
                    </button>
                  ))}
                </div>
              ) : (
                <div className="py-6 text-center text-sm text-muted-foreground">
                  No matching invoices found.
                </div>
              )}
            </div>
          )}
        </div>

        {/* <button className="relative text-muted-foreground hover:text-foreground transition-colors">
          <Bell className="w-5 h-5" />
          <span className="absolute top-0 right-0 w-2 h-2 bg-destructive rounded-full" />
        </button> */}

        {userMenu}
      </div>
    </header>
  );
}