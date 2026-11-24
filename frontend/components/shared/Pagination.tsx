"use client";

import { Button } from "@/components/ui/button";
import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
} from "lucide-react";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

function getPageNumbers(
  currentPage: number,
  totalPages: number
): (number | "...")[] {
  if (totalPages <= 5) {
    return Array.from({ length: totalPages }, (_, i) => i + 1);
  }

  if (currentPage <= 3) {
    return [1, 2, 3, "...", totalPages];
  }

  if (currentPage >= totalPages - 2) {
    return [1, "...", totalPages - 2, totalPages - 1, totalPages];
  }

  return [
    1,
    "...",
    currentPage - 1,
    currentPage,
    currentPage + 1,
    "...",
    totalPages,
  ];
}

export default function Pagination({
  currentPage,
  totalPages,
  onPageChange,
}: PaginationProps) {
  if (totalPages <= 1) return null;

  const pages = getPageNumbers(currentPage, totalPages);
  const isFirst = currentPage <= 1;
  const isLast = currentPage >= totalPages;

  return (
    <div className="flex justify-center items-center mt-6 pb-6">
      <div className="flex items-center gap-2 bg-[#1A1A1A] p-1.5 rounded-lg border border-border/50">
        <Button
          type="button"
          variant="ghost"
          size="sm"
          disabled={isFirst}
          onClick={() => onPageChange(1)}
          className="h-8 px-3 text-muted-foreground hover:text-foreground gap-1"
        >
          <ChevronsLeft className="w-3.5 h-3.5" /> First
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          disabled={isFirst}
          onClick={() => onPageChange(currentPage - 1)}
          className="h-8 px-3 text-muted-foreground hover:text-foreground gap-1"
        >
          <ChevronLeft className="w-3.5 h-3.5" /> Back
        </Button>

        <div className="flex items-center gap-1 px-2">
          {pages.map((page, index) =>
            page === "..." ? (
              <span
                key={`ellipsis-${index}`}
                className="text-muted-foreground px-1"
              >
                ...
              </span>
            ) : (
              <Button
                key={page}
                type="button"
                variant={page === currentPage ? "default" : "ghost"}
                size="sm"
                onClick={() => onPageChange(page)}
                className={
                  page === currentPage
                    ? "h-8 w-8 p-0 bg-primary hover:bg-primary-hover text-primary-foreground font-medium"
                    : "h-8 w-8 p-0 text-muted-foreground hover:text-foreground"
                }
              >
                {page}
              </Button>
            )
          )}
        </div>

        <Button
          type="button"
          variant="ghost"
          size="sm"
          disabled={isLast}
          onClick={() => onPageChange(currentPage + 1)}
          className="h-8 px-3 text-muted-foreground hover:text-foreground gap-1"
        >
          Next <ChevronRight className="w-3.5 h-3.5" />
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          disabled={isLast}
          onClick={() => onPageChange(totalPages)}
          className="h-8 px-3 text-muted-foreground hover:text-foreground gap-1"
        >
          Last <ChevronsRight className="w-3.5 h-3.5" />
        </Button>
      </div>
    </div>
  );
}