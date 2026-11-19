"use client";

import { useTransition } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ChevronDown, LogOut, User } from "lucide-react";
import { logout } from "@/lib/actions/auth.actions";

export default function UserMenu() {
  const [isPending, startTransition] = useTransition();

  const handleLogout = () => {
    startTransition(async () => {
      await logout();
    });
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="flex items-center gap-3 outline-none hover:opacity-80 transition-opacity cursor-pointer">
        <Avatar className="w-9 h-9 border border-border">
          <AvatarImage src="https://github.com/shadcn.png" alt="Amilia Clark" />
          <AvatarFallback>AC</AvatarFallback>
        </Avatar>
        <span className="font-medium text-sm hidden md:block">Amilia Clark</span>
        <ChevronDown className="w-4 h-4 text-muted-foreground" />
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" className="w-48 bg-card border-border">
        <DropdownMenuLabel>My Account</DropdownMenuLabel>
        <DropdownMenuSeparator className="bg-border" />
        <DropdownMenuItem className="cursor-pointer focus:bg-secondary">
          <User className="w-4 h-4 mr-2" />
          Profile
        </DropdownMenuItem>
        <DropdownMenuItem
          disabled={isPending}
          onSelect={handleLogout}
          className="cursor-pointer text-red-500 [&_svg]:text-red-500 focus:bg-red-500/10 focus:text-red-500"
        >
          <LogOut className="w-4 h-4 mr-2" />
          {isPending ? "Logging out..." : "Logout"}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}