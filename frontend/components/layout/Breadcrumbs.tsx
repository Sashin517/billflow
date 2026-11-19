"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import React from "react";

export default function Breadcrumbs() {
  const pathname = usePathname();
  const segments = pathname.split("/").filter(Boolean);

  if (segments.length === 0) return null;

  return (
    <div className="flex items-center text-sm text-muted-foreground space-x-2">
      <Link href="/dashboard" className="hover:text-foreground transition-colors">
        Home
      </Link>
      {segments.map((segment, index) => {
        const href = `/${segments.slice(0, index + 1).join("/")}`;
        const isLast = index === segments.length - 1;
        const formattedSegment = segment.charAt(0).toUpperCase() + segment.slice(1).replace(/-/g, " ");

        return (
          <React.Fragment key={href}>
            <span>&gt;</span>
            {isLast ? (
              <span className="font-medium text-foreground">{formattedSegment}</span>
            ) : (
              <Link href={href} className="hover:text-foreground transition-colors">
                {formattedSegment}
              </Link>
            )}
          </React.Fragment>
        );
      })}
    </div>
  );
}