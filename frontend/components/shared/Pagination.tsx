import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from "lucide-react";

export default function Pagination() {
  return (
    <div className="flex justify-center items-center mt-6 pb-6">
      <div className="flex items-center gap-2 bg-[#1A1A1A] p-1.5 rounded-lg border border-border/50">
        <Button variant="ghost" size="sm" className="h-8 px-3 text-muted-foreground hover:text-foreground gap-1">
          <ChevronsLeft className="w-3.5 h-3.5" /> First
        </Button>
        <Button variant="ghost" size="sm" className="h-8 px-3 text-muted-foreground hover:text-foreground gap-1">
          <ChevronLeft className="w-3.5 h-3.5" /> Back
        </Button>
        
        <div className="flex items-center gap-1 px-2">
          <Button variant="ghost" size="sm" className="h-8 w-8 p-0 text-muted-foreground hover:text-foreground">
            1
          </Button>
          <Button size="sm" className="h-8 w-8 p-0 bg-primary hover:bg-primary-hover text-primary-foreground font-medium">
            2
          </Button>
          <Button variant="ghost" size="sm" className="h-8 w-8 p-0 text-muted-foreground hover:text-foreground">
            3
          </Button>
          <span className="text-muted-foreground px-1">...</span>
          <Button variant="ghost" size="sm" className="h-8 w-8 p-0 text-muted-foreground hover:text-foreground">
            12
          </Button>
        </div>

        <Button variant="ghost" size="sm" className="h-8 px-3 text-muted-foreground hover:text-foreground gap-1">
          Next <ChevronRight className="w-3.5 h-3.5" />
        </Button>
        <Button variant="ghost" size="sm" className="h-8 px-3 text-muted-foreground hover:text-foreground gap-1">
          Last <ChevronsRight className="w-3.5 h-3.5" />
        </Button>
      </div>
    </div>
  );
}