import { Pencil, Trash2, Mail, Phone, MessageSquare, Copy } from "lucide-react";

export type Client = {
  company: string;
  contactName: string;
  email: string;
  phone: string;
  initial: string;
};

export default function ClientCard({ client }: { client: Client }) {
  return (
    <div className="bg-card border border-border rounded-xl flex flex-col overflow-hidden relative group">
      {/* Top Right Actions */}
      <div className="absolute top-5 right-5 flex items-center gap-3 z-10 opacity-80 group-hover:opacity-100 transition-opacity">
        <button className="text-muted-foreground hover:text-foreground transition-colors">
          <Pencil className="w-[18px] h-[18px]" />
        </button>
        <button className="text-muted-foreground hover:text-destructive transition-colors">
          <Trash2 className="w-[18px] h-[18px]" />
        </button>
      </div>

      {/* Card Content */}
      <div className="p-6 pb-5 flex-1">
        <div className="flex items-center gap-4 mb-5">
          <div className="w-12 h-12 rounded-full bg-[#FDECEE] text-[#D33C4A] font-medium flex items-center justify-center text-lg shrink-0">
            {client.initial}
          </div>
          <div>
            <h3 className="font-semibold text-foreground text-base leading-tight mb-1">
              {client.company}
            </h3>
            <p className="text-sm text-muted-foreground">
              {client.contactName}
            </p>
          </div>
        </div>

        <div className="space-y-1 text-sm text-muted-foreground">
          <p>{client.email}</p>
          <p>{client.phone}</p>
        </div>
      </div>

      {/* Bottom Actions Bar */}
      <div className="flex items-center justify-between px-6 py-4 border-t border-border/50 bg-card">
        <button className="text-muted-foreground hover:text-foreground transition-colors">
          <Mail className="w-[18px] h-[18px]" />
        </button>
        <button className="text-muted-foreground hover:text-foreground transition-colors">
          <Phone className="w-[18px] h-[18px]" />
        </button>
        <button className="text-muted-foreground hover:text-foreground transition-colors">
          <MessageSquare className="w-[18px] h-[18px]" />
        </button>
        <button className="text-muted-foreground hover:text-foreground transition-colors">
          <Copy className="w-[18px] h-[18px]" />
        </button>
      </div>
    </div>
  );
}