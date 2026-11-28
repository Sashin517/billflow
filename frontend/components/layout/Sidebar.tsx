"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { 
  LayoutDashboard, 
  FileText, 
  Users, 
  Settings, 
  PanelRightClose, 
  PanelLeftClose,
  ChevronDown
} from "lucide-react";

const navItems = [
  { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  {
    name: "Invoices",
    icon: FileText,
    items: [
      { name: "Invoice Creator", href: "/invoices/new" },
      { name: "Invoice Editor", href: "/invoices" },
    ],
  },
  { name: "Clients", href: "/clients", icon: Users },
  {
    name: "Settings",
    icon: Settings,
    items: [
      { name: "Profile", href: "/settings/profile" },
      { name: "Theme", href: "/settings/theme" },
    ],
  },
];

export default function Sidebar() {
  const pathname = usePathname();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [openMenus, setOpenMenus] = useState<string[]>([]);

  // Automatically open parent menus if a child route is active on initial load
  useEffect(() => {
    navItems.forEach((group) => {
      if (group.items?.some((item) => pathname.startsWith(item.href))) {
        setOpenMenus((prev) => (prev.includes(group.name) ? prev : [...prev, group.name]));
      }
    });
  }, [pathname]);

  const toggleSubMenu = (name: string) => {
    if (isCollapsed) {
      setIsCollapsed(false);
      setOpenMenus((prev) => (prev.includes(name) ? prev : [...prev, name]));
    } else {
      setOpenMenus((prev) =>
        prev.includes(name) ? prev.filter((item) => item !== name) : [...prev, name]
      );
    }
  };

  return (
    <aside 
      className={cn(
        "bg-[#111111] border-r border-border flex flex-col h-screen overflow-y-auto transition-all duration-300",
        isCollapsed ? "w-20" : "w-64"
      )}
    >
      <div className="h-20 flex items-center justify-between px-4 border-b border-border/50">
        {!isCollapsed && (
          <div className="h-7 w-7 overflow-hidden flex items-center justify-center shrink-0">
            <Image
              src="/images/logo.svg"
              alt="Logo"
              width={32}
              height={32}
              className="w-full h-full object-contain scale-[1.8]"
              priority
            />
          </div>
        )}
        <button 
          onClick={() => setIsCollapsed(!isCollapsed)}
          className={cn(
            "text-muted-foreground hover:text-foreground transition-colors",
            isCollapsed && "w-full flex justify-center"
          )}
        >
          {isCollapsed ? <PanelLeftClose className="w-5 h-5" /> : <PanelRightClose className="w-5 h-5" />}
        </button>
      </div>

      <nav className="flex-1 px-4 py-6 space-y-4">
        {navItems.map((group) => {
          const isActiveGroup = group.href 
            ? pathname === group.href 
            : group.items?.some((item) => pathname === item.href);

          return (
            <div key={group.name} className="space-y-1">
              {group.href ? (
                <Link
                  href={group.href}
                  className={cn(
                    "flex items-center gap-3 py-2.5 rounded-xl border-l-2 transition-colors",
                    isCollapsed ? "px-0 justify-center border-l-0 rounded-full w-10 h-10 mx-auto" : "px-3",
                    pathname === group.href
                      ? "border-primary bg-secondary/40 text-primary"
                      : "border-transparent text-muted-foreground hover:text-foreground hover:bg-secondary/20"
                  )}
                  title={isCollapsed ? group.name : undefined}
                >
                  <group.icon className="w-5 h-5 shrink-0" />
                  {!isCollapsed && <span className="font-medium">{group.name}</span>}
                </Link>
              ) : (
                <div className="space-y-1">
                  <button
                    onClick={() => toggleSubMenu(group.name)}
                    className={cn(
                      "w-full flex items-center justify-between py-2.5 rounded-xl border-l-2 transition-colors",
                      isCollapsed ? "px-0 justify-center border-l-0 rounded-full w-10 h-10 mx-auto" : "px-3",
                      isActiveGroup && isCollapsed
                        ? "bg-secondary/40 text-primary"
                        : "border-transparent text-muted-foreground hover:text-foreground hover:bg-secondary/20",
                      isActiveGroup && !isCollapsed && "border-primary text-foreground"
                    )}
                    title={isCollapsed ? group.name : undefined}
                  >
                    <div className="flex items-center gap-3">
                      <group.icon className={cn("w-5 h-5 shrink-0", isActiveGroup && isCollapsed && "text-primary")} />
                      {!isCollapsed && <span className="font-medium">{group.name}</span>}
                    </div>
                    {!isCollapsed && (
                      <ChevronDown 
                        className={cn(
                          "w-4 h-4 transition-transform duration-200", 
                          openMenus.includes(group.name) ? "rotate-180" : ""
                        )} 
                      />
                    )}
                  </button>
                  
                  {/* Sub-items */}
                  {openMenus.includes(group.name) && !isCollapsed && (
                    <div className="mt-1 space-y-1">
                      {group.items?.map((item) => (
                        <Link
                          key={item.name}
                          href={item.href}
                          className={cn(
                            "flex items-center gap-3 pl-11 pr-3 py-2.5 rounded-xl border-l-2 transition-colors",
                            pathname === item.href
                              ? "border-primary bg-secondary/40 text-primary"
                              : "border-transparent text-muted-foreground hover:text-foreground hover:bg-secondary/20"
                          )}
                        >
                          <span >{item.name}</span>
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </nav>
    </aside>
  );
}