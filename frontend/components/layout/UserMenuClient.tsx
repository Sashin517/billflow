"use client";

import { useTransition } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ChevronDown, LogOut } from "lucide-react";
import { logout } from "@/lib/actions/auth.actions";

interface UserMenuClientProps {
  user: {
    name?: string | null;
    email: string;
    avatar_url?: string | null;
  };
}

export default function UserMenuClient({ user }: UserMenuClientProps) {
  const [isPending, startTransition] = useTransition();

  const displayName = user.name || user.email;
  const initials = displayName
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  const handleLogout = () => {
    startTransition(async () => {
      await logout();
    });
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="flex items-center gap-3 outline-none hover:opacity-80 transition-opacity cursor-pointer">
        <Avatar className="w-9 h-9 border border-border">
          <AvatarImage src={user.avatar_url ?? undefined} alt={displayName} />
          <AvatarFallback>{initials}</AvatarFallback>
        </Avatar>
        <span className="font-medium text-sm hidden md:block">{displayName}</span>
        <ChevronDown className="w-4 h-4 text-muted-foreground" />
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" className="w-48 bg-card border-border">
        <DropdownMenuGroup>
          {/* <DropdownMenuLabel>My Account</DropdownMenuLabel>
          <DropdownMenuSeparator className="bg-border" /> */}
          <DropdownMenuItem
            disabled={isPending}
            onClick={handleLogout}
            className="cursor-pointer text-red-500 [&_svg]:text-red-500 focus:bg-red-500/10 focus:text-red-500 px-4 py-2"
          >
            <LogOut className="w-4 h-4 mr-2" />
            {isPending ? "Logging out..." : "Logout"}
          </DropdownMenuItem>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}