"use client";

import { Search, Filter } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

import AddClientDialog from "@/features/clients/components/AddClientDialog";
import ClientGrid from "@/features/clients/components/ClientGrid";
import Pagination from "@/components/shared/Pagination";

// Dummy data for testing layout
const mockClients = Array(12).fill({
  company: "Bold Corp",
  contactName: "Sarah Jenkins, CEO",
  email: "bold@email.com",
  phone: "011-22656468",
  initial: "B",
});

export default function ClientsPage() {
  return (
    <div className="space-y-8 flex flex-col h-full">
      
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <h1 className="text-3xl font-semibold text-foreground">Clients</h1>
        <AddClientDialog />
      </div>

      {/* Sub-header & Filters */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="text-lg font-medium text-foreground">123 Clients</div>
        
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <div className="relative w-full sm:w-[320px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input 
              type="text" 
              placeholder="Search....." 
              className="pl-10 pr-4 h-11 bg-input border-border text-sm"
            />
          </div>
          <Button variant="outline" className="h-11 px-6 bg-transparent border-border hover:bg-secondary shrink-0">
            <Filter className="w-4 h-4 mr-2 text-primary" />
            Filters
          </Button>
        </div>
      </div>

      {/* Clients Grid Component */}
      <ClientGrid clients={mockClients} />

      {/* Shared Pagination Component */}
      <Pagination />
      
    </div>
  );
}