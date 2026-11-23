"use client";

import { Search, Bell } from "lucide-react";
import { Input } from "@/components/ui/input";
import Breadcrumbs from "./Breadcrumbs";

export default function Topbar({ userMenu }: { userMenu: React.ReactNode }) {
  return (
    <header className="h-20 border-b border-border bg-background flex items-center justify-between px-8 sticky top-0 z-10">
      <div className="flex-1">
        <Breadcrumbs />
      </div>

      <div className="flex items-center gap-6">
        <div className="relative w-64 bg-secondary/30 rounded-full border-1 border-boder md:block focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/30">
          <Search className="w-4.5 h-4.5 absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <Input 
            type="text" 
            placeholder="Search invoice..." 
            className="pl-11  h-9.5 rounded-full border-0 bg-transparent pr-1 text-sm shadow-none focus-visible:ring-0 focus-visible:ring-offset-0"
          />
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