import Sidebar from "@/components/layout/Sidebar";
import Topbar from "@/components/layout/Topbar";
import UserMenu from "@/components/layout/UserMenu";
import { Toaster } from "@/components/ui/sonner";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-screen bg-background text-foreground overflow-hidden">
      <Sidebar />
      <main className="flex-1 flex flex-col min-w-0">
        <Topbar userMenu={<UserMenu/>} />
        <div className="flex-1 p-8 overflow-y-auto">
          {children}
          <Toaster richColors position="bottom-right" />
        </div>
      </main>
    </div>
  );
}