export type Timeframe =
  | "Today"
  | "Week-to-date"
  | "Month-to-date"
  | "Year-to-date"
  | "All";

export type TrendDirection = "up" | "down" | "neutral";

export interface InvoiceMetricInput {
  issue_date: string;
  grand_total: number | string;
  status: string;
}

export interface KpiMetricResult {
  amount: string;
  trend: string;
  trendDirection: TrendDirection;
  trendLabel: string;
}

export interface DashboardKpis {
  totalRevenue: KpiMetricResult;
  outstandingBalance: KpiMetricResult;
}

function formatRs(value: number): string {
  return `Rs. ${value.toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
}

function parseLocalDate(dateStr: string): Date | null {
  if (!dateStr) return null;
  // Handle YYYY-MM-DD without UTC timezone shift
  const isoDateOnly = /^(\d{4})-(\d{2})-(\d{2})$/.exec(dateStr.trim());
  if (isoDateOnly) {
    return new Date(
      Number(isoDateOnly[1]),
      Number(isoDateOnly[2]) - 1,
      Number(isoDateOnly[3])
    );
  }
  const parsed = new Date(dateStr);
  return Number.isNaN(parsed.getTime()) ? null : parsed;
}

function startOfDay(d: Date): Date {
  return new Date(d.getFullYear(), d.getMonth(), d.getDate(), 0, 0, 0, 0);
}

function endOfDay(d: Date): Date {
  return new Date(d.getFullYear(), d.getMonth(), d.getDate(), 23, 59, 59, 999);
}

function getPeriodBounds(timeframe: Timeframe, now: Date) {
  const todayStart = startOfDay(now);
  const todayEnd = endOfDay(now);

  if (timeframe === "Today") {
    const yesterday = new Date(todayStart);
    yesterday.setDate(yesterday.getDate() - 1);
    return {
      currentStart: todayStart,
      currentEnd: todayEnd,
      prevStart: startOfDay(yesterday),
      prevEnd: endOfDay(yesterday),
      label: "vs. yesterday",
    };
  }

  if (timeframe === "Week-to-date") {
    // Monday as start of week
    const dayOfWeek = (todayStart.getDay() + 6) % 7;
    const weekStart = new Date(todayStart);
    weekStart.setDate(todayStart.getDate() - dayOfWeek);

    const prevWeekStart = new Date(weekStart);
    prevWeekStart.setDate(weekStart.getDate() - 7);
    const prevWeekEnd = new Date(todayEnd);
    prevWeekEnd.setDate(todayEnd.getDate() - 7);

    return {
      currentStart: weekStart,
      currentEnd: todayEnd,
      prevStart: prevWeekStart,
      prevEnd: prevWeekEnd,
      label: "vs. last week",
    };
  }

  if (timeframe === "Month-to-date") {
    const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
    const prevMonthStart = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    const prevMonthEnd = endOfDay(
      new Date(now.getFullYear(), now.getMonth() - 1, now.getDate())
    );

    return {
      currentStart: monthStart,
      currentEnd: todayEnd,
      prevStart: prevMonthStart,
      prevEnd: prevMonthEnd,
      label: "vs. last month",
    };
  }

  if (timeframe === "Year-to-date") {
    const yearStart = new Date(now.getFullYear(), 0, 1);
    const prevYearStart = new Date(now.getFullYear() - 1, 0, 1);
    const prevYearEnd = endOfDay(
      new Date(now.getFullYear() - 1, now.getMonth(), now.getDate())
    );

    return {
      currentStart: yearStart,
      currentEnd: todayEnd,
      prevStart: prevYearStart,
      prevEnd: prevYearEnd,
      label: "vs. last year",
    };
  }

  return null; // "All"
}

function computeTrend(
  current: number,
  previous: number,
  label: string
): Omit<KpiMetricResult, "amount"> {
  if (previous === 0 && current === 0) {
    return { trend: "0%", trendDirection: "neutral", trendLabel: label };
  }
  if (previous === 0 && current > 0) {
    return { trend: "100%", trendDirection: "up", trendLabel: label };
  }

  const diffPercent = ((current - previous) / previous) * 100;
  const rounded = Math.round(Math.abs(diffPercent));

  if (rounded === 0) {
    return { trend: "0%", trendDirection: "neutral", trendLabel: label };
  }

  return {
    trend: `${rounded}%`,
    trendDirection: diffPercent > 0 ? "up" : "down",
    trendLabel: label,
  };
}

function sumInvoices(invoices: InvoiceMetricInput[]) {
  let revenue = 0;
  let outstanding = 0;

  for (const inv of invoices) {
    const total = Number(inv.grand_total) || 0;
    const status = (inv.status || "").toLowerCase();

    if (status === "paid") {
      revenue += total;
    } else if (status !== "draft") {
      // Pending, Overdue, etc.
      outstanding += total;
    }
  }

  return { revenue, outstanding };
}

export function calculateDashboardKpis(
  invoices: InvoiceMetricInput[],
  timeframe: Timeframe,
  now: Date = new Date()
): DashboardKpis {
  const bounds = getPeriodBounds(timeframe, now);

  if (!bounds) {
    const totals = sumInvoices(invoices);
    return {
      totalRevenue: {
        amount: formatRs(totals.revenue),
        trend: "0%",
        trendDirection: "neutral",
        trendLabel: "All time",
      },
      outstandingBalance: {
        amount: formatRs(totals.outstanding),
        trend: "0%",
        trendDirection: "neutral",
        trendLabel: "All time",
      },
    };
  }

  const currentInvoices: InvoiceMetricInput[] = [];
  const prevInvoices: InvoiceMetricInput[] = [];

  for (const inv of invoices) {
    const date = parseLocalDate(inv.issue_date);
    if (!date) continue;

    if (date >= bounds.currentStart && date <= bounds.currentEnd) {
      currentInvoices.push(inv);
    } else if (date >= bounds.prevStart && date <= bounds.prevEnd) {
      prevInvoices.push(inv);
    }
  }

  const current = sumInvoices(currentInvoices);
  const previous = sumInvoices(prevInvoices);

  return {
    totalRevenue: {
      amount: formatRs(current.revenue),
      ...computeTrend(current.revenue, previous.revenue, bounds.label),
    },
    outstandingBalance: {
      amount: formatRs(current.outstanding),
      ...computeTrend(current.outstanding, previous.outstanding, bounds.label),
    },
  };
}