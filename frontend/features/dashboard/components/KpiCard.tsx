import { MoreVertical, ArrowUp } from "lucide-react";

interface KpiCardProps {
  title: string;
  subtitle: string;
  amount: string;
  trend: string;
  trendLabel: string;
}

export default function KpiCard({ title, subtitle, amount, trend, trendLabel }: KpiCardProps) {
  return (
    <div className="relative overflow-hidden bg-card border border-border rounded-[24px] p-8 flex flex-col justify-between h-[236px]">
      
      {/* The Yellow Blurred Shape */}
      <div className="absolute -bottom-20 -left-20 w-[400px] h-[200px] bg-[#D4AF37]/30 blur-[112px] rounded-full pointer-events-none" />

      {/* Header */}
      <div className="relative z-10 flex justify-between items-start">
        <div className="space-y-1">
          <h3 className="text-2xl font-medium text-foreground">{title}</h3>
          <p className="text-sm text-muted-foreground">{subtitle}</p>
        </div>
        <button className="text-muted-foreground hover:text-foreground transition-colors p-1">
          <MoreVertical className="w-5 h-5" />
        </button>
      </div>

      {/* Footer / Values */}
      <div className="relative z-10 flex flex-col items-end justify-end mt-auto gap-2">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1 bg-green-500/10 text-green-500 px-2 py-1 rounded text-sm font-medium">
            <ArrowUp className="w-3 h-3" />
            {trend}
          </div>
          <span className="text-[32px] font-medium tracking-tight text-foreground">{amount}</span>
        </div>
        <span className="text-sm text-muted-foreground">{trendLabel}</span>
      </div>
      
    </div>
  );
}