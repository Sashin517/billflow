"use client";

import { useMemo, useState } from "react";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import ClientGrid from "@/features/clients/components/ClientGrid";
import Pagination from "@/components/shared/Pagination";

export interface ClientCardItem {
  id: number;
  company: string;
  contactName: string;
  email: string;
  phone: string;
  initial: string;
}

interface ClientsListViewProps {
  clients?: ClientCardItem[];
}

const PAGE_SIZE = 12;

export default function ClientsListView({
  clients = [],
}: ClientsListViewProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  const filteredClients = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return clients;

    return clients.filter(
      (c) =>
        c.company.toLowerCase().includes(q) ||
        c.contactName.toLowerCase().includes(q) ||
        c.email.toLowerCase().includes(q) ||
        c.phone.toLowerCase().includes(q)
    );
  }, [clients, searchQuery]);

  const totalPages = Math.ceil(filteredClients.length / PAGE_SIZE);
  const safePage = Math.min(currentPage, Math.max(1, totalPages));

  const paginatedClients = useMemo(() => {
    const start = (safePage - 1) * PAGE_SIZE;
    return filteredClients.slice(start, start + PAGE_SIZE);
  }, [filteredClients, safePage]);

  const handleSearchChange = (value: string) => {
    setSearchQuery(value);
    setCurrentPage(1);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="text-lg font-medium text-foreground">
          {filteredClients.length}{" "}
          {filteredClients.length === 1 ? "Client" : "Clients"}
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto">
          <div className="relative w-full sm:w-[320px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              type="text"
              value={searchQuery}
              onChange={(e) => handleSearchChange(e.target.value)}
              placeholder="Search....."
              className="pl-10 pr-4 h-11 bg-input border-border text-sm"
            />
          </div>
        </div>
      </div>

      <ClientGrid clients={paginatedClients} />

      <Pagination
        currentPage={safePage}
        totalPages={totalPages}
        onPageChange={handlePageChange}
      />
    </>
  );
}