import { useMemo, useState } from "react";
import {
  ArrowDownRight,
  ArrowUpRight,
  BarChart3,
  Bell,
  Bot,
  CalendarDays,
  Check,
  ChevronDown,
  Clock3,
  Download,
  FileText,
  Headphones,
  LayoutDashboard,
  LineChart,
  MessageCircle,
  MoreHorizontal,
  Send,
  Settings2,
  ShieldCheck,
  Sparkles,
  X,
} from "lucide-react";

type RangeKey = "last-30" | "last-90" | "this-year";

const ranges: Record<RangeKey, string> = {
  "last-30": "Last 30 days",
  "last-90": "Last 90 days",
  "this-year": "This year",
};

const navItems = [
  { label: "Overview", icon: LayoutDashboard },
  { label: "Conversations", icon: MessageCircle },
  { label: "Appointments", icon: CalendarDays },
  { label: "Aira performance", icon: Sparkles },
];

function MiniSparkline({ positive = true }: { positive?: boolean }) {
  return (
    <div className="flex h-8 items-end gap-1" aria-hidden="true">
      {[28, 38, 30, 47, 43, 60, 54, 72, 66, 86].map((height, index) => (
        <span
          key={index}
          className={`w-1.5 rounded-t-[3px] transition-all ${
            positive ? "bg-[#82a693]" : "bg-[#d29a88]"
          }`}
          style={{ height: `${height * 0.34}px`, opacity: 0.45 + index * 0.05 }}
        />
      ))}
    </div>
  );
}

function MetricCard({
  eyebrow,
  value,
  detail,
  delta,
  positive = true,
  icon: Icon,
  accent = "sage",
}: {
  eyebrow: string;
  value: string;
  detail: string;
  delta: string;
  positive?: boolean;
  icon: typeof LineChart;
  accent?: "sage" | "clay" | "ink";
}) {
  const accentColor =
    accent === "clay"
      ? "bg-[#c98d78]/12 text-[#a56753]"
      : accent === "ink"
        ? "bg-[#202d2a]/8 text-[#202d2a]"
        : "bg-[#789786]/14 text-[#527461]";

  return (
    <article className="group flex min-h-[164px] flex-col justify-between rounded-[2px] border border-[#dcdcd2] bg-[#fbfbf7] p-5 transition-transform duration-200 hover:-translate-y-0.5">
      <div className="flex items-start justify-between">
        <div>
          <p className="font-mono text-[10px] font-medium uppercase tracking-[0.16em] text-[#7b8179]">
            {eyebrow}
          </p>
          <p className="mt-3 font-['DM_Sans'] text-[29px] font-medium tracking-[-0.06em] text-[#202d2a]">
            {value}
          </p>
        </div>
        <div className={`rounded-full p-2 ${accentColor}`}>
          <Icon size={15} strokeWidth={1.8} />
        </div>
      </div>
      <div className="flex items-end justify-between gap-4">
        <div>
          <p className="text-[12px] leading-5 text-[#7b8179]">{detail}</p>
          <p
            className={`mt-1 flex items-center gap-1 font-mono text-[11px] ${
              positive ? "text-[#527461]" : "text-[#a56753]"
            }`}
          >
            {positive ? <ArrowUpRight size={12} /> : <ArrowDownRight size={12} />}
            {delta}
          </p>
        </div>
        <MiniSparkline positive={positive} />
      </div>
    </article>
  );
}

function SectionLabel({ children, detail }: { children: string; detail?: string }) {
  return (
    <div className="mb-4 flex items-center justify-between">
      <div className="flex items-center gap-3">
        <span className="h-1.5 w-1.5 rounded-full bg-[#9a604d]" />
        <h2 className="font-mono text-[10px] font-semibold uppercase tracking-[0.18em] text-[#58625c]">
          {children}
        </h2>
      </div>
      {detail && <span className="text-[11px] text-[#969b91]">{detail}</span>}
    </div>
  );
}

function Dashboard() {
  const [activeNav, setActiveNav] = useState("Overview");
  const [range, setRange] = useState<RangeKey>("last-30");
  const [rangeOpen, setRangeOpen] = useState(false);
  const [exported, setExported] = useState(false);
  const [supportOpen, setSupportOpen] = useState(false);
  const [copilotOpen, setCopilotOpen] = useState(false);
  const [copilotInput, setCopilotInput] = useState("");
  const [copilotAnswer, setCopilotAnswer] = useState("");
  const [summaryRequested, setSummaryRequested] = useState(false);

  const chartValues = useMemo(
    () =>
      range === "last-30"
        ? [38, 43, 39, 48, 52, 50, 62, 66, 71, 68, 78, 86]
        : range === "last-90"
          ? [26, 31, 35, 33, 42, 40, 48, 55, 53, 67, 73, 82]
          : [44, 46, 40, 52, 48, 59, 64, 61, 72, 76, 82, 91],
    [range],
  );

  const handleExport = () => {
    setExported(true);
    window.setTimeout(() => setExported(false), 2400);
  };

  const handleCopilot = (prompt?: string) => {
    const question = prompt ?? copilotInput;
    if (!question.trim()) return;
    setCopilotAnswer(
      question.toLowerCase().includes("complaint")
        ? "The 3 complaint threads are concentrated around wait time. Two have already been routed to the studio manager, and Aira has drafted follow-ups for each."
        : "I found a clear opportunity: 14 missed calls happened outside studio hours this month. Aira converted 5 of those conversations into booked appointments, worth an estimated $1,420.",
    );
    setCopilotInput("");
    setCopilotOpen(true);
  };

  return (
    <div className="min-h-screen bg-[#f2f2ed] text-[#202d2a] selection:bg-[#dce6dc]">
      <style>{`
        @keyframes aira-rise { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes aira-pulse { 0%, 100% { opacity: .35; } 50% { opacity: 1; } }
        .aira-rise { animation: aira-rise .5s ease-out both; }
        .aira-rise-1 { animation-delay: .05s; }
        .aira-rise-2 { animation-delay: .1s; }
        .aira-rise-3 { animation-delay: .15s; }
        .aira-rise-4 { animation-delay: .2s; }
        .aira-pulse { animation: aira-pulse 2s ease-in-out infinite; }
      `}</style>

      <div className="flex min-h-screen">
        <aside className="sticky top-0 hidden h-screen w-[228px] shrink-0 flex-col border-r border-[#deded6] bg-[#e9ebe4] px-5 py-6 lg:flex">
          <div className="flex items-center gap-2.5 px-1">
            <div className="grid h-8 w-8 place-items-center rounded-full bg-[#202d2a] text-[#eff0e8]">
              <span className="font-['Instrument_Serif'] text-[21px] leading-none">a</span>
            </div>
            <div>
              <p className="font-['DM_Sans'] text-[16px] font-semibold tracking-[-0.04em]">aira</p>
              <p className="font-mono text-[8px] uppercase tracking-[0.16em] text-[#778078]">
                business intelligence
              </p>
            </div>
          </div>

          <div className="mt-14">
            <p className="mb-3 px-2 font-mono text-[9px] uppercase tracking-[0.2em] text-[#929991]">
              Workspace
            </p>
            <nav className="space-y-1" aria-label="Primary navigation">
              {navItems.map(({ label, icon: Icon }) => {
                const active = activeNav === label;
                return (
                  <button
                    key={label}
                    type="button"
                    onClick={() => setActiveNav(label)}
                    className={`flex w-full items-center gap-3 rounded-[2px] px-2.5 py-2.5 text-left text-[12px] transition-colors ${
                      active
                        ? "bg-[#dfe5da] font-medium text-[#202d2a]"
                        : "text-[#727c74] hover:bg-[#e1e4dd] hover:text-[#202d2a]"
                    }`}
                    aria-current={active ? "page" : undefined}
                  >
                    <Icon size={15} strokeWidth={active ? 2 : 1.7} />
                    {label}
                    {label === "Conversations" && (
                      <span className="ml-auto rounded-full bg-[#c98d78]/15 px-1.5 py-0.5 font-mono text-[9px] text-[#a56753]">
                        3
                      </span>
                    )}
                  </button>
                );
              })}
            </nav>
          </div>

          <div className="mt-auto">
            <div className="mb-5 border-t border-[#d3d7ce] pt-5">
              <button
                type="button"
                onClick={() => setSupportOpen(true)}
                className="flex w-full items-center gap-3 rounded-[2px] px-2.5 py-2.5 text-left text-[12px] text-[#727c74] transition-colors hover:bg-[#e1e4dd] hover:text-[#202d2a]"
              >
                <Headphones size={15} strokeWidth={1.7} />
                Support access
              </button>
              <button
                type="button"
                className="mt-1 flex w-full items-center gap-3 rounded-[2px] px-2.5 py-2.5 text-left text-[12px] text-[#727c74] transition-colors hover:bg-[#e1e4dd] hover:text-[#202d2a]"
              >
                <Settings2 size={15} strokeWidth={1.7} />
                Workspace settings
              </button>
            </div>
            <div className="flex items-center gap-3 border-t border-[#d3d7ce] px-1 pt-4">
              <div className="grid h-8 w-8 place-items-center rounded-full bg-[#cdd9ce] font-mono text-[10px] text-[#527461]">
                NS
              </div>
              <div className="min-w-0">
                <p className="truncate text-[11px] font-medium text-[#34413c]">Northstar Dental</p>
                <p className="text-[10px] text-[#858d84]">Owner workspace</p>
              </div>
              <MoreHorizontal size={15} className="ml-auto text-[#89918a]" />
            </div>
          </div>
        </aside>

        <main className="min-w-0 flex-1">
          <header className="flex h-[72px] items-center justify-between border-b border-[#deded6] bg-[#f2f2ed]/90 px-5 backdrop-blur-sm sm:px-8">
            <div className="flex items-center gap-3 lg:hidden">
              <div className="grid h-8 w-8 place-items-center rounded-full bg-[#202d2a] text-[#eff0e8]">
                <span className="font-['Instrument_Serif'] text-[21px]">a</span>
              </div>
              <span className="font-semibold tracking-[-0.04em]">aira</span>
            </div>
            <div className="hidden items-center gap-2 text-[12px] text-[#889089] sm:flex">
              <span>Northstar Dental Studio</span>
              <span className="text-[#bec4bb]">/</span>
              <span className="text-[#4e5c55]">{activeNav}</span>
            </div>
            <div className="ml-auto flex items-center gap-2.5">
              <button
                type="button"
                onClick={() => setSupportOpen(true)}
                className="hidden items-center gap-2 rounded-[2px] border border-[#d6d8cf] bg-[#f8f8f3] px-3 py-2 text-[11px] text-[#657068] transition-colors hover:border-[#b8c6b8] hover:text-[#202d2a] md:flex"
              >
                <Headphones size={14} />
                Talk to support
              </button>
              <button
                type="button"
                aria-label="Notifications"
                className="relative rounded-full p-2 text-[#6e7871] hover:bg-[#e4e6df]"
              >
                <Bell size={17} strokeWidth={1.7} />
                <span className="aira-pulse absolute right-1.5 top-1.5 h-1.5 w-1.5 rounded-full bg-[#a56753]" />
              </button>
              <div className="grid h-8 w-8 place-items-center rounded-full bg-[#cad7cc] font-mono text-[10px] text-[#527461]">
                JM
              </div>
            </div>
          </header>

          <div className="mx-auto max-w-[1320px] px-5 pb-14 pt-8 sm:px-8 lg:px-10">
            <div className="aira-rise flex flex-col justify-between gap-6 border-b border-[#d5d7cf] pb-7 md:flex-row md:items-end">
              <div>
                <div className="mb-3 flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full bg-[#789786]" />
                  <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-[#6d786f]">
                    Studio pulse · live
                  </span>
                </div>
                <h1 className="font-['Instrument_Serif'] text-[42px] leading-[0.95] tracking-[-0.055em] text-[#202d2a] sm:text-[52px]">
                  Good morning, Julia.
                </h1>
                <p className="mt-3 max-w-[510px] text-[13px] leading-6 text-[#778078]">
                  Here&apos;s what&apos;s moving at Northstar Dental Studio — and the work Aira handled while you were focused on patients.
                </p>
              </div>
              <div className="flex flex-wrap items-center gap-2">
                <div className="relative">
                  <button
                    type="button"
                    onClick={() => setRangeOpen((open) => !open)}
                    className="flex items-center gap-2 rounded-[2px] border border-[#d2d5cc] bg-[#f8f8f3] px-3 py-2.5 text-[11px] font-medium text-[#4d5a53] transition-colors hover:border-[#aebdaf]"
                    aria-expanded={rangeOpen}
                  >
                    <CalendarDays size={14} />
                    {ranges[range]}
                    <ChevronDown size={13} className={rangeOpen ? "rotate-180" : ""} />
                  </button>
                  {rangeOpen && (
                    <div className="absolute right-0 top-11 z-20 w-36 overflow-hidden rounded-[2px] border border-[#d2d5cc] bg-[#fbfbf7] p-1 shadow-[0_12px_28px_rgba(42,51,45,0.1)]">
                      {(Object.keys(ranges) as RangeKey[]).map((key) => (
                        <button
                          key={key}
                          type="button"
                          onClick={() => {
                            setRange(key);
                            setRangeOpen(false);
                          }}
                          className="flex w-full items-center justify-between rounded-[1px] px-2.5 py-2 text-left text-[11px] text-[#5e6a62] hover:bg-[#e8eee7]"
                        >
                          {ranges[key]}
                          {range === key && <Check size={13} className="text-[#527461]" />}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
                <button
                  type="button"
                  onClick={handleExport}
                  className="flex items-center gap-2 rounded-[2px] bg-[#202d2a] px-3 py-2.5 text-[11px] font-medium text-[#f2f2ed] transition-colors hover:bg-[#354940]"
                >
                  {exported ? <Check size={14} /> : <Download size={14} />}
                  {exported ? "Report ready" : "Export report"}
                </button>
              </div>
            </div>

            {activeNav !== "Overview" && (
              <div className="aira-rise mt-6 flex items-center gap-3 border border-[#cdd9ce] bg-[#e9f0e9] px-4 py-3 text-[12px] text-[#527461]">
                <Sparkles size={15} />
                <span>
                  You&apos;re viewing <strong>{activeNav}</strong>. The overview is your command center for all signals.
                </span>
                <button type="button" onClick={() => setActiveNav("Overview")} className="ml-auto underline underline-offset-2">
                  Return to overview
                </button>
              </div>
            )}

            <section className="aira-rise aira-rise-1 mt-8">
              <SectionLabel detail={`Compared with previous ${range === "this-year" ? "year" : "period"}`}>
                Business at a glance
              </SectionLabel>
              <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
                <MetricCard eyebrow="Revenue influenced" value="$48,260" detail="Tracked bookings this period" delta="+18.4%" icon={LineChart} />
                <MetricCard eyebrow="Sales conversion" value="31.8%" detail="Inquiry to booked appointment" delta="+6.2 pts" icon={BarChart3} accent="ink" />
                <MetricCard eyebrow="Time returned" value="42.5 hrs" detail="Equivalent to one full work week" delta="+11.7 hrs" icon={Clock3} />
                <MetricCard eyebrow="Value generated" value="$8,940" detail="Estimated from Aira-assisted work" delta="+22.1%" icon={Sparkles} accent="clay" />
              </div>
            </section>

            <section className="aira-rise aira-rise-2 mt-9 grid gap-4 xl:grid-cols-[1.55fr_0.95fr]">
              <article className="rounded-[2px] border border-[#dcdcd2] bg-[#fbfbf7] p-5 sm:p-6">
                <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-start">
                  <div>
                    <SectionLabel detail="Booked appointment value">Revenue movement</SectionLabel>
                    <div className="flex items-baseline gap-3">
                      <p className="font-['DM_Sans'] text-[32px] font-medium tracking-[-0.06em]">$48,260</p>
                      <span className="flex items-center gap-1 font-mono text-[10px] text-[#527461]">
                        <ArrowUpRight size={12} /> 18.4%
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-4 text-[10px] text-[#879087]">
                    <span className="flex items-center gap-1.5"><span className="h-1.5 w-1.5 rounded-full bg-[#789786]" />Current</span>
                    <span className="flex items-center gap-1.5"><span className="h-1.5 w-1.5 rounded-full border border-[#a8ada5]" />Prior</span>
                  </div>
                </div>
                <div className="mt-7 flex h-[175px] items-end gap-2 border-b border-l border-[#e1e2da] px-3 pb-0 pt-4 sm:gap-4">
                  {chartValues.map((value, index) => (
                    <div key={index} className="group flex h-full flex-1 flex-col justify-end">
                      <div className="relative flex h-full items-end">
                        <div
                          className="w-full rounded-t-[2px] bg-[#a9c1ac] transition-all duration-500 group-hover:bg-[#789786]"
                          style={{ height: `${value}%` }}
                        >
                          <span className="absolute -top-5 left-1/2 hidden -translate-x-1/2 font-mono text-[9px] text-[#527461] group-hover:block">
                            {Math.round(value * 580)} 
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="mt-3 flex justify-between pl-3 font-mono text-[9px] uppercase tracking-[0.1em] text-[#9da39b]">
                  {["01", "05", "10", "15", "20", "25", "30"].map((day) => <span key={day}>{day} {range === "this-year" ? "mo" : "mar"}</span>)}
                </div>
              </article>

              <article className="relative overflow-hidden rounded-[2px] bg-[#263833] p-6 text-[#e8eee7]">
                <div className="absolute -right-8 -top-12 h-44 w-44 rounded-full border border-[#7f9c8d]/20" />
                <div className="absolute -right-1 top-5 h-32 w-32 rounded-full border border-[#7f9c8d]/15" />
                <div className="relative flex h-full flex-col">
                  <div className="flex items-start justify-between">
                    <SectionLabel detail="Aira-assisted">Return on Aira</SectionLabel>
                    <ShieldCheck size={18} className="text-[#a9c1ac]" strokeWidth={1.5} />
                  </div>
                  <p className="mt-5 font-['Instrument_Serif'] text-[35px] leading-none tracking-[-0.05em]">3.7×</p>
                  <p className="mt-2 max-w-[230px] text-[12px] leading-5 text-[#b4c5b7]">
                    every $1 invested in Aira returned $3.70 in captured opportunity.
                  </p>
                  <div className="mt-auto border-t border-[#789786]/30 pt-4">
                    <div className="flex items-center justify-between text-[11px]">
                      <span className="text-[#aabdb0]">Monthly partnership</span>
                      <span className="font-mono text-[#e8eee7]">$2,400</span>
                    </div>
                    <div className="mt-2 flex items-center justify-between text-[11px]">
                      <span className="text-[#aabdb0]">Value recovered</span>
                      <span className="font-mono text-[#a9c1ac]">$8,940</span>
                    </div>
                  </div>
                </div>
              </article>
            </section>

            <section className="aira-rise aira-rise-3 mt-9 grid gap-4 lg:grid-cols-[1.15fr_0.85fr]">
              <article className="rounded-[2px] border border-[#dcdcd2] bg-[#fbfbf7] p-5 sm:p-6">
                <SectionLabel detail="This period">Demand & conversion</SectionLabel>
                <div className="grid gap-6 sm:grid-cols-2">
                  <div>
                    <div className="mb-5 flex items-end justify-between">
                      <div>
                        <p className="font-mono text-[10px] uppercase tracking-[0.14em] text-[#8a938b]">Inbound demand</p>
                        <p className="mt-2 font-['DM_Sans'] text-[32px] tracking-[-0.06em]">286</p>
                      </div>
                      <span className="font-mono text-[10px] text-[#527461]">+12.8%</span>
                    </div>
                    <div className="space-y-3">
                      {[
                        ["Calls", "164", "57%", "bg-[#789786]"],
                        ["Messages", "86", "30%", "bg-[#a7bca8]"],
                        ["Web forms", "36", "13%", "bg-[#cbd7ca]"],
                      ].map(([label, number, width, color]) => (
                        <div key={label}>
                          <div className="mb-1.5 flex justify-between text-[11px] text-[#68736b]">
                            <span>{label}</span><span className="font-mono text-[10px]">{number}</span>
                          </div>
                          <div className="h-1.5 bg-[#e7e8e1]"><div className={`h-full ${color}`} style={{ width }} /></div>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="border-t border-[#e4e4dc] pt-5 sm:border-l sm:border-t-0 sm:pl-6 sm:pt-0">
                    <div className="mb-5 flex items-end justify-between">
                      <div>
                        <p className="font-mono text-[10px] uppercase tracking-[0.14em] text-[#8a938b]">Bookings won</p>
                        <p className="mt-2 font-['DM_Sans'] text-[32px] tracking-[-0.06em]">91</p>
                      </div>
                      <span className="font-mono text-[10px] text-[#527461]">31.8% CVR</span>
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <div className="bg-[#edf2eb] p-3"><p className="font-mono text-[9px] uppercase tracking-[0.12em] text-[#79917e]">Aira booked</p><p className="mt-2 text-[21px] tracking-[-0.05em]">38</p></div>
                      <div className="bg-[#f2eee9] p-3"><p className="font-mono text-[9px] uppercase tracking-[0.12em] text-[#a87865]">Escalated</p><p className="mt-2 text-[21px] tracking-[-0.05em]">12</p></div>
                      <div className="col-span-2 flex items-center justify-between border-t border-[#e2e3db] pt-3 text-[11px]"><span className="text-[#7a847c]">After-hours opportunities</span><span className="font-mono text-[#527461]">14 captured</span></div>
                    </div>
                  </div>
                </div>
              </article>

              <article className="rounded-[2px] border border-[#dcdcd2] bg-[#fbfbf7] p-5 sm:p-6">
                <SectionLabel detail="From 42 conversations">Customer sentiment</SectionLabel>
                <div className="flex items-center gap-6">
                  <div className="relative grid h-28 w-28 shrink-0 place-items-center rounded-full border-[10px] border-[#d9e6d9] border-r-[#789786] border-t-[#789786]">
                    <div className="text-center"><p className="font-['DM_Sans'] text-[28px] tracking-[-0.08em]">86</p><p className="font-mono text-[9px] uppercase tracking-[0.1em] text-[#849087]">score</p></div>
                  </div>
                  <div className="space-y-3 text-[11px]">
                    <div className="flex items-center gap-2"><span className="h-2 w-2 rounded-full bg-[#789786]" /><span className="text-[#68736b]">Positive</span><span className="ml-auto font-mono text-[#527461]">72%</span></div>
                    <div className="flex items-center gap-2"><span className="h-2 w-2 rounded-full bg-[#cbd7ca]" /><span className="text-[#68736b]">Neutral</span><span className="ml-auto font-mono text-[#7e887f]">21%</span></div>
                    <div className="flex items-center gap-2"><span className="h-2 w-2 rounded-full bg-[#d29a88]" /><span className="text-[#68736b]">Needs care</span><span className="ml-auto font-mono text-[#a56753]">7%</span></div>
                  </div>
                </div>
                <div className="mt-5 border-t border-[#e3e3dc] pt-4">
                  <div className="flex items-start gap-3"><MessageCircle size={14} className="mt-0.5 text-[#a56753]" /><div><p className="text-[11px] font-medium text-[#4c5a52]">3 conversations need a human touch</p><p className="mt-1 text-[10px] leading-4 text-[#879088]">Mostly related to wait time and insurance questions.</p></div><button type="button" onClick={() => setActiveNav("Conversations")} className="ml-auto text-[10px] text-[#527461] underline underline-offset-2">Review</button></div>
                </div>
              </article>
            </section>

            <section className="aira-rise aira-rise-4 mt-9 grid gap-4 xl:grid-cols-[0.9fr_1.1fr]">
              <article className="rounded-[2px] border border-[#dcdcd2] bg-[#fbfbf7] p-5 sm:p-6">
                <SectionLabel detail="Most requested">Service momentum</SectionLabel>
                <div className="flex items-end justify-between border-b border-[#e1e2da] pb-5">
                  <div><p className="font-mono text-[10px] uppercase tracking-[0.14em] text-[#8a938b]">Best-selling service</p><p className="mt-2 font-['Instrument_Serif'] text-[30px] leading-none tracking-[-0.04em]">Invisalign consult</p></div>
                  <span className="font-mono text-[11px] text-[#527461]">28 booked</span>
                </div>
                <div className="mt-5 space-y-4">
                  {[
                    ["Invisalign consult", "28", "82%", "bg-[#789786]"],
                    ["New patient exam", "22", "64%", "bg-[#9db8a2]"],
                    ["Teeth whitening", "17", "49%", "bg-[#bdcdbd]"],
                  ].map(([label, count, width, color]) => (
                    <div key={label}><div className="mb-1.5 flex items-center justify-between text-[11px]"><span className="text-[#657169]">{label}</span><span className="font-mono text-[10px] text-[#527461]">{count}</span></div><div className="h-2 bg-[#e9e9e2]"><div className={`h-full ${color}`} style={{ width }} /></div></div>
                  ))}
                </div>
              </article>

              <article className="rounded-[2px] border border-[#dcdcd2] bg-[#fbfbf7] p-5 sm:p-6">
                <div className="flex items-start justify-between">
                  <SectionLabel detail="Across phone + text">Aira handled the front desk</SectionLabel>
                  <div className="flex items-center gap-1.5 rounded-full bg-[#e7efe7] px-2 py-1 font-mono text-[9px] text-[#527461]"><span className="h-1.5 w-1.5 rounded-full bg-[#789786]" />Live</div>
                </div>
                <div className="grid gap-5 sm:grid-cols-3">
                  <div className="sm:col-span-1"><p className="font-['DM_Sans'] text-[42px] leading-none tracking-[-0.08em]">78%</p><p className="mt-2 text-[11px] leading-4 text-[#7b857d]">of inbound conversations resolved without an escalation</p></div>
                  <div className="grid grid-cols-2 gap-x-5 gap-y-4 border-t border-[#e2e3dc] pt-4 sm:col-span-2 sm:border-l sm:border-t-0 sm:pl-5 sm:pt-0">
                    <div><p className="font-mono text-[9px] uppercase tracking-[0.12em] text-[#919990]">Calls answered</p><p className="mt-1.5 text-[20px] tracking-[-0.05em]">164</p><p className="text-[10px] text-[#527461]">97.6% pickup rate</p></div>
                    <div><p className="font-mono text-[9px] uppercase tracking-[0.12em] text-[#919990]">Messages handled</p><p className="mt-1.5 text-[20px] tracking-[-0.05em]">86</p><p className="text-[10px] text-[#527461]">Under 2 min avg.</p></div>
                    <div><p className="font-mono text-[9px] uppercase tracking-[0.12em] text-[#919990]">Escalations</p><p className="mt-1.5 text-[20px] tracking-[-0.05em]">12</p><p className="text-[10px] text-[#a56753]">3 need review</p></div>
                    <div><p className="font-mono text-[9px] uppercase tracking-[0.12em] text-[#919990]">Hours returned</p><p className="mt-1.5 text-[20px] tracking-[-0.05em]">42.5</p><p className="text-[10px] text-[#527461]">This period</p></div>
                  </div>
                </div>
              </article>
            </section>

            <section className="aira-rise mt-9 overflow-hidden rounded-[2px] border border-[#dcdcd2] bg-[#e8eee7]">
              <div className="flex flex-col gap-5 p-5 sm:flex-row sm:items-center sm:justify-between sm:p-7">
                <div className="flex items-start gap-4">
                  <div className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-[#263833] text-[#b8d0ba]"><Bot size={21} strokeWidth={1.5} /></div>
                  <div><p className="font-mono text-[10px] uppercase tracking-[0.18em] text-[#68806e]">Your business copilot</p><h2 className="mt-1 font-['Instrument_Serif'] text-[28px] tracking-[-0.04em] text-[#263833]">Ask Aira anything about your studio.</h2><p className="mt-1 text-[12px] text-[#6f7f73]">Get a grounded answer from your conversations, bookings, and performance data.</p></div>
                </div>
                <div className="flex w-full max-w-[370px] items-center gap-2 rounded-[2px] border border-[#c8d6c8] bg-[#f4f7f1] p-1.5 focus-within:border-[#789786]">
                  <input aria-label="Ask Aira a question" value={copilotInput} onChange={(event) => setCopilotInput(event.target.value)} onKeyDown={(event) => { if (event.key === "Enter") handleCopilot(); }} placeholder="e.g. Where did we lose opportunities?" className="min-w-0 flex-1 bg-transparent px-2 text-[11px] text-[#34413c] outline-none placeholder:text-[#9aa89d]" />
                  <button type="button" onClick={() => handleCopilot()} aria-label="Send question to Aira" className="grid h-8 w-8 shrink-0 place-items-center rounded-[2px] bg-[#263833] text-[#e8eee7] transition-colors hover:bg-[#3b5749]"><Send size={14} /></button>
                </div>
              </div>
              {(copilotAnswer || copilotOpen) && (
                <div className="border-t border-[#cbd9cd] bg-[#f3f6f0] px-5 py-4 sm:px-7">
                  <div className="flex items-start gap-3"><Sparkles size={15} className="mt-0.5 text-[#527461]" /><div><p className="font-mono text-[9px] uppercase tracking-[0.14em] text-[#78917d]">Aira&apos;s read</p><p className="mt-1 max-w-[720px] text-[12px] leading-5 text-[#516057]">{copilotAnswer || "Ask a question above and I’ll connect the dots across your studio data."}</p></div><button type="button" onClick={() => setCopilotOpen(false)} aria-label="Close copilot answer" className="ml-auto text-[#84938a] hover:text-[#263833]"><X size={15} /></button></div>
                </div>
              )}
            </section>

            <footer className="mt-9 flex flex-col items-start justify-between gap-4 border-t border-[#d5d7cf] pt-5 text-[11px] text-[#89928a] sm:flex-row sm:items-center">
              <p>Data refreshed 4 minutes ago · Northstar Dental Studio</p>
              <button
                type="button"
                onClick={() => setSummaryRequested(true)}
                className="flex items-center gap-2 font-medium text-[#527461] transition-colors hover:text-[#263833]"
              >
                {summaryRequested ? <Check size={14} /> : <FileText size={14} />}
                {summaryRequested ? "One-sheet requested — we’ll email it shortly" : "Ask Aira for this week’s one-sheet"}
              </button>
            </footer>
          </div>
        </main>
      </div>

      {supportOpen && (
        <div className="fixed inset-0 z-50 flex items-end justify-end bg-[#202d2a]/10 p-4 sm:items-center sm:p-8" role="dialog" aria-modal="true" aria-labelledby="support-title">
          <div className="w-full max-w-[360px] rounded-[2px] border border-[#d6d8cf] bg-[#fbfbf7] p-6 shadow-[0_20px_50px_rgba(42,51,45,0.16)]">
            <div className="flex items-start justify-between"><div><p className="font-mono text-[10px] uppercase tracking-[0.18em] text-[#78917d]">Priority support</p><h2 id="support-title" className="mt-2 font-['Instrument_Serif'] text-[28px] tracking-[-0.04em]">We&apos;re here, Julia.</h2></div><button type="button" onClick={() => setSupportOpen(false)} aria-label="Close support dialog" className="text-[#84908a] hover:text-[#202d2a]"><X size={17} /></button></div>
            <p className="mt-3 text-[12px] leading-5 text-[#778078]">Your Aira partner team typically replies within 15 minutes during studio hours.</p>
            <button type="button" onClick={() => setSupportOpen(false)} className="mt-5 flex w-full items-center justify-center gap-2 rounded-[2px] bg-[#202d2a] py-3 text-[11px] font-medium text-[#f2f2ed] hover:bg-[#354940]"><MessageCircle size={14} /> Start a conversation</button>
            <p className="mt-3 text-center font-mono text-[9px] uppercase tracking-[0.12em] text-[#a0a69e]">Mon–Fri · 8:00–18:00 local time</p>
          </div>
        </div>
      )}
    </div>
  );
}

export { Dashboard };
export default Dashboard;