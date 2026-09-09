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
  Pause,
  PhoneCall,
  Play,
  Send,
  Settings2,
  ShieldCheck,
  SkipBack,
  SkipForward,
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
  { label: "Call logs", icon: PhoneCall },
  { label: "Appointments", icon: CalendarDays },
  { label: "Aira performance", icon: Sparkles },
];

type CallRecord = {
  id: string;
  caller: string;
  initials: string;
  context: string;
  time: string;
  duration: string;
  status: string;
  statusTone: "resolved" | "escalated";
  intent: string;
  summary: string;
  transcript: { speaker: "Aira" | "Caller"; text: string }[];
};

const callRecords: CallRecord[] = [
  {
    id: "call-1",
    caller: "Maya Thompson",
    initials: "MT",
    context: "New patient · Invisalign enquiry",
    time: "Today, 10:42 AM",
    duration: "04:18",
    status: "Resolved by Aira",
    statusTone: "resolved",
    intent: "Book consultation",
    summary:
      "Maya was looking for an Invisalign consultation before an upcoming trip. Aira answered pricing questions, checked availability, and secured a Thursday appointment with Dr. Patel.",
    transcript: [
      { speaker: "Aira", text: "Hi Maya, you’ve reached Northstar Dental Studio. How can I help today?" },
      { speaker: "Caller", text: "I’m interested in Invisalign, but I’m travelling soon and wanted to understand how quickly I could get started." },
      { speaker: "Aira", text: "I can help with that. Our first consultation is 45 minutes, and the earliest opening with Dr. Patel is Thursday at 3:30 PM." },
      { speaker: "Caller", text: "That works perfectly. Is the consultation complimentary?" },
      { speaker: "Aira", text: "Yes, the consultation is complimentary. I’ve reserved Thursday at 3:30 PM for you and sent the details by text." },
    ],
  },
  {
    id: "call-2",
    caller: "Daniel Reed",
    initials: "DR",
    context: "Existing patient · Appointment change",
    time: "Today, 9:18 AM",
    duration: "02:41",
    status: "Resolved by Aira",
    statusTone: "resolved",
    intent: "Reschedule appointment",
    summary:
      "Daniel needed to move a hygiene appointment by one week. Aira found a matching morning slot, confirmed the change, and updated the patient record without staff involvement.",
    transcript: [
      { speaker: "Aira", text: "Good morning, Daniel. I can help you move an existing appointment." },
      { speaker: "Caller", text: "Yes please, I need to move my hygiene visit from next Tuesday." },
      { speaker: "Aira", text: "I have Tuesday the 19th at 9:00 AM or Wednesday the 20th at 11:30 AM available." },
      { speaker: "Caller", text: "Tuesday the 19th is ideal." },
      { speaker: "Aira", text: "Done. Your appointment is now Tuesday the 19th at 9:00 AM. You’ll receive a confirmation shortly." },
    ],
  },
  {
    id: "call-3",
    caller: "Leah Morgan",
    initials: "LM",
    context: "Existing patient · Insurance question",
    time: "Yesterday, 4:56 PM",
    duration: "06:07",
    status: "Escalated to studio",
    statusTone: "escalated",
    intent: "Insurance coverage",
    summary:
      "Leah had a detailed question about a claim already in progress. Aira captured the relevant details and escalated the call to the studio manager with a complete handoff note.",
    transcript: [
      { speaker: "Aira", text: "Hi Leah, I can capture the details for our studio manager and make sure this reaches the right person." },
      { speaker: "Caller", text: "My insurer rejected part of the claim and I’m not sure which code needs correcting." },
      { speaker: "Aira", text: "I understand. I’ll note the claim reference, the treatment date, and the exact rejection message for the team." },
      { speaker: "Caller", text: "The reference is NS-20481, and the treatment was on the 6th of this month." },
      { speaker: "Aira", text: "Thank you. I’ve sent that through as a priority follow-up. The studio manager will call you back during opening hours." },
    ],
  },
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
      ? "bg-[#8f9cff]/14 text-[#9db4ff]"
      : accent === "ink"
      ? "bg-[#8d8d8d]/12 text-[#d8d8d8]"
        : "bg-[#8fb7ff]/14 text-[#9fc4ff]";

  return (
    <article className="group flex min-h-[164px] flex-col justify-between rounded-[12px] border border-[#242424] bg-[#111111] p-5 transition-transform duration-200 hover:-translate-y-0.5">
      <div className="flex items-start justify-between">
        <div>
          <p className="font-mono text-[10px] font-medium uppercase tracking-[0.16em] text-[#8d8d8d]">
            {eyebrow}
          </p>
          <p className="mt-3 font-['Inter'] text-[29px] font-medium tracking-[-0.06em] text-[#f5f5f5]">
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
              positive ? "text-[#9fc4ff]" : "text-[#9db4ff]"
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
        <span className="h-1.5 w-1.5 rounded-full bg-[#8fb7ff]" />
        <h2 className="font-mono text-[10px] font-semibold uppercase tracking-[0.18em] text-[#a9a9a9]">
          {children}
        </h2>
      </div>
      {detail && <span className="text-[11px] text-[#777777]">{detail}</span>}
    </div>
  );
}

function CallLogsSection({
  selectedCall,
  onSelectCall,
}: {
  selectedCall: CallRecord;
  onSelectCall: (call: CallRecord) => void;
}) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [transcriptExported, setTranscriptExported] = useState(false);

  const handleTranscriptExport = () => {
    setTranscriptExported(true);
    window.setTimeout(() => setTranscriptExported(false), 2200);
  };

  return (
    <section className="aira-rise mt-8">
      <div className="flex flex-col justify-between gap-5 border-b border-[#202020] pb-7 md:flex-row md:items-end">
        <div>
          <div className="mb-3 flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-[#65d7e6]" />
            <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-[#8c8c8c]">
              Call intelligence · 12 this period
            </span>
          </div>
          <h1 className="font-['Inter'] text-[42px] font-semibold leading-[0.98] tracking-[-0.055em] text-[#f5f5f5] sm:text-[52px]">
            Call logs.
          </h1>
          <p className="mt-3 max-w-[560px] text-[13px] leading-6 text-[#969696]">
            Review every conversation Aira handled, with the recording, a clear handoff summary, and the full transcript in one place.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <div className="rounded-full border border-[#30466f] bg-[#121d33] px-3 py-2 font-mono text-[10px] text-[#9fc4ff]">
            9 resolved · 3 escalated
          </div>
        </div>
      </div>

      <div className="mt-7 grid gap-4 xl:grid-cols-[0.78fr_1.22fr]">
        <article className="overflow-hidden rounded-[12px] border border-[#242424] bg-[#111111]">
          <div className="flex items-center justify-between border-b border-[#242424] px-5 py-4">
            <div>
              <p className="font-mono text-[10px] font-semibold uppercase tracking-[0.18em] text-[#a9a9a9]">Recent calls</p>
              <p className="mt-1 text-[11px] text-[#6f6f6f]">Select a call to open its intelligence record.</p>
            </div>
            <span className="rounded-full bg-[#1a2941] px-2 py-1 font-mono text-[9px] text-[#9fc4ff]">Live</span>
          </div>
          <div className="divide-y divide-[#242424]">
            {callRecords.map((call) => {
              const selected = call.id === selectedCall.id;
              return (
                <button
                  key={call.id}
                  type="button"
                  onClick={() => {
                    onSelectCall(call);
                    setIsPlaying(false);
                  }}
                  className={`flex w-full items-start gap-3 px-5 py-4 text-left transition-colors ${
                    selected ? "bg-[#162440]" : "hover:bg-[#171717]"
                  }`}
                  aria-current={selected ? "true" : undefined}
                >
                  <span className={`grid h-8 w-8 shrink-0 place-items-center rounded-full font-mono text-[10px] ${selected ? "bg-[#8fb7ff] text-[#050505]" : "bg-[#242b3b] text-[#9fc4ff]"}`}>
                    {call.initials}
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="flex items-center justify-between gap-3">
                      <span className="truncate text-[12px] font-medium text-[#e3e3e3]">{call.caller}</span>
                      <span className="shrink-0 font-mono text-[9px] text-[#727272]">{call.time.split(", ")[1]}</span>
                    </span>
                    <span className="mt-1 block truncate text-[11px] text-[#858585]">{call.context}</span>
                    <span className="mt-2 flex items-center gap-2">
                      <span className={`h-1.5 w-1.5 rounded-full ${call.statusTone === "resolved" ? "bg-[#65d7e6]" : "bg-[#b7a8ff]"}`} />
                      <span className={`font-mono text-[9px] ${call.statusTone === "resolved" ? "text-[#9fc4ff]" : "text-[#b7a8ff]"}`}>{call.status}</span>
                      <span className="ml-auto font-mono text-[9px] text-[#686868]">{call.duration}</span>
                    </span>
                  </span>
                </button>
              );
            })}
          </div>
          <div className="border-t border-[#242424] px-5 py-4">
            <p className="font-mono text-[9px] uppercase tracking-[0.14em] text-[#666666]">Showing latest 3 records · 12 total this period</p>
          </div>
        </article>

        <article className="rounded-[12px] border border-[#242424] bg-[#111111] p-5 sm:p-6">
          <div className="flex flex-col justify-between gap-4 border-b border-[#2b2b2b] pb-5 sm:flex-row sm:items-start">
            <div className="flex items-start gap-3">
              <div className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-[#1a2941] font-mono text-[11px] text-[#9fc4ff]">{selectedCall.initials}</div>
              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <h2 className="font-['Inter'] text-[20px] font-semibold tracking-[-0.04em] text-[#f5f5f5]">{selectedCall.caller}</h2>
                  <span className={`rounded-full px-2 py-1 font-mono text-[9px] ${selectedCall.statusTone === "resolved" ? "bg-[#122036] text-[#9fc4ff]" : "bg-[#1e1a26] text-[#b7a8ff]"}`}>
                    {selectedCall.status}
                  </span>
                </div>
                <p className="mt-1 text-[11px] text-[#818181]">{selectedCall.context} · {selectedCall.time}</p>
              </div>
            </div>
            <button
              type="button"
              onClick={handleTranscriptExport}
              className="flex items-center justify-center gap-2 rounded-full border border-[#303030] px-3 py-2 text-[10px] font-medium text-[#bcbcbc] transition-colors hover:border-[#777777] hover:text-[#f5f5f5]"
            >
              {transcriptExported ? <Check size={13} /> : <Download size={13} />}
              {transcriptExported ? "Transcript saved" : "Export transcript"}
            </button>
          </div>

          <div className="mt-5 rounded-[10px] border border-[#30466f] bg-[#0f1a2e] p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-mono text-[9px] uppercase tracking-[0.16em] text-[#9fc4ff]">Call recording</p>
                <p className="mt-1 text-[11px] text-[#9eabbf]">Aira call · {selectedCall.duration}</p>
              </div>
              <div className="flex items-center gap-1 text-[#74849f]">
                <PhoneCall size={14} />
                <span className="font-mono text-[9px]">Studio line</span>
              </div>
            </div>
            <div className="mt-5 flex items-center gap-3">
              <button type="button" onClick={() => setIsPlaying(false)} aria-label="Rewind recording" className="grid h-8 w-8 place-items-center rounded-full text-[#9eabbf] hover:bg-[#1b2a44] hover:text-[#f5f5f5]"><SkipBack size={14} /></button>
              <button type="button" onClick={() => setIsPlaying((playing) => !playing)} aria-label={isPlaying ? "Pause recording" : "Play recording"} className="grid h-10 w-10 place-items-center rounded-full bg-[#f5f5f5] text-[#050505] transition-colors hover:bg-[#d9d9d9]">
                {isPlaying ? <Pause size={16} fill="currentColor" /> : <Play size={16} fill="currentColor" className="ml-0.5" />}
              </button>
              <button type="button" onClick={() => setIsPlaying(false)} aria-label="Fast forward recording" className="grid h-8 w-8 place-items-center rounded-full text-[#9eabbf] hover:bg-[#1b2a44] hover:text-[#f5f5f5]"><SkipForward size={14} /></button>
              <div className="min-w-0 flex-1">
                <div className="h-1.5 overflow-hidden rounded-full bg-[#263956]">
                  <div className={`h-full rounded-full bg-[#8fb7ff] transition-all duration-500 ${isPlaying ? "w-[44%]" : "w-[16%]"}`} />
                </div>
                <div className="mt-2 flex justify-between font-mono text-[9px] text-[#71809a]"><span>{isPlaying ? "01:53" : "00:41"}</span><span>{selectedCall.duration}</span></div>
              </div>
            </div>
          </div>

          <div className="mt-6 grid gap-5 lg:grid-cols-[0.82fr_1.18fr]">
            <div>
              <SectionLabel detail={selectedCall.intent}>Aira summary</SectionLabel>
              <p className="text-[12px] leading-6 text-[#a9a9a9]">{selectedCall.summary}</p>
              <div className="mt-5 grid grid-cols-2 gap-2">
                <div className="rounded-[8px] border border-[#242424] bg-[#0d0d0d] p-3">
                  <p className="font-mono text-[9px] uppercase tracking-[0.12em] text-[#777777]">Outcome</p>
                  <p className="mt-1.5 text-[12px] text-[#e3e3e3]">{selectedCall.statusTone === "resolved" ? "Appointment secured" : "Human follow-up"}</p>
                </div>
                <div className="rounded-[8px] border border-[#242424] bg-[#0d0d0d] p-3">
                  <p className="font-mono text-[9px] uppercase tracking-[0.12em] text-[#777777]">Sentiment</p>
                  <p className="mt-1.5 text-[12px] text-[#9fc4ff]">{selectedCall.statusTone === "resolved" ? "Positive" : "Needs care"}</p>
                </div>
              </div>
            </div>
            <div className="border-t border-[#2b2b2b] pt-5 lg:border-l lg:border-t-0 lg:pl-5 lg:pt-0">
              <SectionLabel detail="Speaker-labeled">Transcript</SectionLabel>
              <div className="max-h-[300px] space-y-4 overflow-y-auto pr-2">
                {selectedCall.transcript.map((line, index) => (
                  <div key={`${selectedCall.id}-${index}`} className="flex items-start gap-3">
                    <span className={`mt-0.5 grid h-6 w-6 shrink-0 place-items-center rounded-full font-mono text-[8px] ${line.speaker === "Aira" ? "bg-[#1a2941] text-[#9fc4ff]" : "bg-[#242424] text-[#a4a4a4]"}`}>
                      {line.speaker === "Aira" ? "A" : selectedCall.initials[0]}
                    </span>
                    <div>
                      <p className="font-mono text-[9px] uppercase tracking-[0.12em] text-[#777777]">{line.speaker}</p>
                      <p className="mt-1 text-[11px] leading-5 text-[#a7a7a7]">{line.text}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </article>
      </div>
    </section>
  );
}

function Dashboard() {
  const [activeNav, setActiveNav] = useState("Overview");
  const [selectedCall, setSelectedCall] = useState(callRecords[0]);
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
    <div className="min-h-screen bg-[#050505] text-[#f5f5f5] selection:bg-[#23395f]">
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
        <aside className="sticky top-0 hidden h-screen w-[228px] shrink-0 flex-col border-r border-[#202020] bg-[#0b0b0b] px-5 py-6 lg:flex">
          <div className="flex items-center gap-2.5 px-1">
             <div className="grid h-8 w-8 place-items-center rounded-full bg-gradient-to-br from-[#8fb7ff] to-[#65d7e6] text-[#050505]">
               <span className="font-['Inter'] text-[18px] font-semibold leading-none">a</span>
            </div>
            <div>
               <p className="font-['Inter'] text-[16px] font-semibold tracking-[-0.04em] text-[#f5f5f5]">aira</p>
               <p className="font-mono text-[8px] uppercase tracking-[0.16em] text-[#7d7d7d]">
                business intelligence
              </p>
            </div>
          </div>

          <div className="mt-14">
             <p className="mb-3 px-2 font-mono text-[9px] uppercase tracking-[0.2em] text-[#666666]">
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
                         ? "bg-[#1a2941] font-medium text-[#f5f5f5]"
                         : "text-[#8b8b8b] hover:bg-[#171717] hover:text-[#f5f5f5]"
                    }`}
                    aria-current={active ? "page" : undefined}
                  >
                    <Icon size={15} strokeWidth={active ? 2 : 1.7} />
                    {label}
                    {label === "Conversations" && (
                       <span className="ml-auto rounded-full bg-[#8f9cff]/15 px-1.5 py-0.5 font-mono text-[9px] text-[#b4c1ff]">
                        3
                      </span>
                    )}
                  </button>
                );
              })}
            </nav>
          </div>

          <div className="mt-auto">
             <div className="mb-5 border-t border-[#202020] pt-5">
              <button
                type="button"
                onClick={() => setSupportOpen(true)}
                 className="flex w-full items-center gap-3 rounded-[2px] px-2.5 py-2.5 text-left text-[12px] text-[#8b8b8b] transition-colors hover:bg-[#171717] hover:text-[#f5f5f5]"
              >
                <Headphones size={15} strokeWidth={1.7} />
                Support access
              </button>
              <button
                type="button"
                 className="mt-1 flex w-full items-center gap-3 rounded-[2px] px-2.5 py-2.5 text-left text-[12px] text-[#8b8b8b] transition-colors hover:bg-[#171717] hover:text-[#f5f5f5]"
              >
                <Settings2 size={15} strokeWidth={1.7} />
                Workspace settings
              </button>
            </div>
             <div className="flex items-center gap-3 border-t border-[#202020] px-1 pt-4">
               <div className="grid h-8 w-8 place-items-center rounded-full bg-[#1a2941] font-mono text-[10px] text-[#9fc4ff]">
                NS
              </div>
              <div className="min-w-0">
                 <p className="truncate text-[11px] font-medium text-[#e3e3e3]">Northstar Dental</p>
                 <p className="text-[10px] text-[#777777]">Owner workspace</p>
               </div>
               <MoreHorizontal size={15} className="ml-auto text-[#666666]" />
            </div>
          </div>
        </aside>

        <main className="min-w-0 flex-1">
           <header className="flex h-[72px] items-center justify-between border-b border-[#202020] bg-[#050505]/90 px-5 backdrop-blur-sm sm:px-8">
            <div className="flex items-center gap-3 lg:hidden">
               <div className="grid h-8 w-8 place-items-center rounded-full bg-gradient-to-br from-[#8fb7ff] to-[#65d7e6] text-[#050505]">
                 <span className="font-['Inter'] text-[18px] font-semibold">a</span>
              </div>
               <span className="font-['Inter'] font-semibold tracking-[-0.04em]">aira</span>
            </div>
             <div className="hidden items-center gap-2 text-[12px] text-[#777777] sm:flex">
              <span>Northstar Dental Studio</span>
               <span className="text-[#444444]">/</span>
               <span className="text-[#d0d0d0]">{activeNav}</span>
            </div>
            <div className="ml-auto flex items-center gap-2.5">
              <button
                type="button"
                onClick={() => setSupportOpen(true)}
                 className="hidden items-center gap-2 rounded-full border border-[#303030] bg-[#111111] px-3 py-2 text-[11px] text-[#b4b4b4] transition-colors hover:border-[#777777] hover:text-[#f5f5f5] md:flex"
              >
                <Headphones size={14} />
                Talk to support
              </button>
              <button
                type="button"
                aria-label="Notifications"
                 className="relative rounded-full p-2 text-[#8c8c8c] hover:bg-[#171717]"
              >
                <Bell size={17} strokeWidth={1.7} />
                 <span className="aira-pulse absolute right-1.5 top-1.5 h-1.5 w-1.5 rounded-full bg-[#8fb7ff]" />
               </button>
               <div className="grid h-8 w-8 place-items-center rounded-full bg-[#1a2941] font-mono text-[10px] text-[#9fc4ff]">
                JM
              </div>
            </div>
          </header>

          <div className="mx-auto max-w-[1320px] px-5 pb-14 pt-8 sm:px-8 lg:px-10">
             {activeNav !== "Call logs" && (
               <>
             <div className="aira-rise flex flex-col justify-between gap-6 border-b border-[#202020] pb-7 md:flex-row md:items-end">
              <div>
                <div className="mb-3 flex items-center gap-2">
                   <span className="h-2 w-2 rounded-full bg-[#65d7e6]" />
                   <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-[#8c8c8c]">
                    Studio pulse · live
                  </span>
             </div>
                 <h1 className="font-['Inter'] text-[42px] font-semibold leading-[0.98] tracking-[-0.055em] text-[#f5f5f5] sm:text-[52px]">
                  Good morning, Julia.
                </h1>
                 <p className="mt-3 max-w-[510px] text-[13px] leading-6 text-[#969696]">
                  Here&apos;s what&apos;s moving at Northstar Dental Studio — and the work Aira handled while you were focused on patients.
                </p>
              </div>
              <div className="flex flex-wrap items-center gap-2">
                <div className="relative">
                  <button
                    type="button"
                    onClick={() => setRangeOpen((open) => !open)}
                     className="flex items-center gap-2 rounded-full border border-[#303030] bg-[#111111] px-3 py-2.5 text-[11px] font-medium text-[#bcbcbc] transition-colors hover:border-[#777777]"
                    aria-expanded={rangeOpen}
                  >
                    <CalendarDays size={14} />
                    {ranges[range]}
                    <ChevronDown size={13} className={rangeOpen ? "rotate-180" : ""} />
                  </button>
                  {rangeOpen && (
                     <div className="absolute right-0 top-11 z-20 w-36 overflow-hidden rounded-[10px] border border-[#303030] bg-[#111111] p-1 shadow-[0_12px_28px_rgba(0,0,0,0.45)]">
                      {(Object.keys(ranges) as RangeKey[]).map((key) => (
                        <button
                          key={key}
                          type="button"
                          onClick={() => {
                            setRange(key);
                            setRangeOpen(false);
                          }}
                           className="flex w-full items-center justify-between rounded-[6px] px-2.5 py-2 text-left text-[11px] text-[#bcbcbc] hover:bg-[#1d1d1d]"
                        >
                          {ranges[key]}
                           {range === key && <Check size={13} className="text-[#9fc4ff]" />}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
                <button
                  type="button"
                  onClick={handleExport}
                   className="flex items-center gap-2 rounded-full bg-[#f5f5f5] px-3 py-2.5 text-[11px] font-medium text-[#050505] transition-colors hover:bg-[#d9d9d9]"
                >
                  {exported ? <Check size={14} /> : <Download size={14} />}
                  {exported ? "Report ready" : "Export report"}
                </button>
              </div>
            </div>
               </>
             )}

             {activeNav !== "Overview" && activeNav !== "Call logs" && (
                 <div className="aira-rise mt-6 flex items-center gap-3 border border-[#30466f] bg-[#121d33] px-4 py-3 text-[12px] text-[#a7c2ff]">
                <Sparkles size={15} />
                <span>
                  You&apos;re viewing <strong>{activeNav}</strong>. The overview is your command center for all signals.
                </span>
                <button type="button" onClick={() => setActiveNav("Overview")} className="ml-auto underline underline-offset-2">
                  Return to overview
                </button>
              </div>
            )}

             {activeNav === "Call logs" ? (
               <CallLogsSection selectedCall={selectedCall} onSelectCall={setSelectedCall} />
             ) : (
               <>
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
               <article className="rounded-[12px] border border-[#242424] bg-[#111111] p-5 sm:p-6">
                <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-start">
                  <div>
                    <SectionLabel detail="Booked appointment value">Revenue movement</SectionLabel>
                    <div className="flex items-baseline gap-3">
                       <p className="font-['Inter'] text-[32px] font-semibold tracking-[-0.06em]">$48,260</p>
                       <span className="flex items-center gap-1 font-mono text-[10px] text-[#9fc4ff]">
                        <ArrowUpRight size={12} /> 18.4%
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-4 text-[10px] text-[#879087]">
                     <span className="flex items-center gap-1.5"><span className="h-1.5 w-1.5 rounded-full bg-[#8fb7ff]" />Current</span>
                     <span className="flex items-center gap-1.5"><span className="h-1.5 w-1.5 rounded-full border border-[#777777]" />Prior</span>
                  </div>
                </div>
                 <div className="mt-7 flex h-[175px] items-end gap-2 border-b border-l border-[#2b2b2b] px-3 pb-0 pt-4 sm:gap-4">
                  {chartValues.map((value, index) => (
                    <div key={index} className="group flex h-full flex-1 flex-col justify-end">
                      <div className="relative flex h-full items-end">
                        <div
                           className="w-full rounded-t-[3px] bg-[#8fb7ff] transition-all duration-500 group-hover:bg-[#65d7e6]"
                          style={{ height: `${value}%` }}
                        >
                           <span className="absolute -top-5 left-1/2 hidden -translate-x-1/2 font-mono text-[9px] text-[#9fc4ff] group-hover:block">
                             {Math.round(value * 580)}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                 <div className="mt-3 flex justify-between pl-3 font-mono text-[9px] uppercase tracking-[0.1em] text-[#666666]">
                  {["01", "05", "10", "15", "20", "25", "30"].map((day) => <span key={day}>{day} {range === "this-year" ? "mo" : "mar"}</span>)}
                </div>
              </article>

               <article className="relative overflow-hidden rounded-[12px] bg-[#111111] p-6 text-[#f5f5f5]">
                 <div className="absolute -right-8 -top-12 h-44 w-44 rounded-full border border-[#8fb7ff]/20" />
                 <div className="absolute -right-1 top-5 h-32 w-32 rounded-full border border-[#8fb7ff]/15" />
                <div className="relative flex h-full flex-col">
                  <div className="flex items-start justify-between">
                    <SectionLabel detail="Aira-assisted">Return on Aira</SectionLabel>
                     <ShieldCheck size={18} className="text-[#8fb7ff]" strokeWidth={1.5} />
                  </div>
                   <p className="mt-5 font-['Inter'] text-[35px] font-semibold leading-none tracking-[-0.05em]">3.7×</p>
                   <p className="mt-2 max-w-[230px] text-[12px] leading-5 text-[#a6a6a6]">
                    every $1 invested in Aira returned $3.70 in captured opportunity.
                  </p>
                   <div className="mt-auto border-t border-[#8fb7ff]/30 pt-4">
                    <div className="flex items-center justify-between text-[11px]">
                       <span className="text-[#a6a6a6]">Monthly partnership</span>
                       <span className="font-mono text-[#f5f5f5]">$2,400</span>
                    </div>
                    <div className="mt-2 flex items-center justify-between text-[11px]">
                       <span className="text-[#a6a6a6]">Value recovered</span>
                       <span className="font-mono text-[#9fc4ff]">$8,940</span>
                    </div>
                  </div>
                </div>
              </article>
            </section>

            <section className="aira-rise aira-rise-3 mt-9 grid gap-4 lg:grid-cols-[1.15fr_0.85fr]">
               <article className="rounded-[12px] border border-[#242424] bg-[#111111] p-5 sm:p-6">
                <SectionLabel detail="This period">Demand & conversion</SectionLabel>
                <div className="grid gap-6 sm:grid-cols-2">
                  <div>
                    <div className="mb-5 flex items-end justify-between">
                      <div>
                        <p className="font-mono text-[10px] uppercase tracking-[0.14em] text-[#8a938b]">Inbound demand</p>
                        <p className="mt-2 font-['Inter'] text-[32px] font-semibold tracking-[-0.06em]">286</p>
                      </div>
                       <span className="font-mono text-[10px] text-[#9fc4ff]">+12.8%</span>
                    </div>
                    <div className="space-y-3">
                      {[
                           ["Calls", "164", "57%", "bg-[#8fb7ff]"],
                         ["Messages", "86", "30%", "bg-[#6d8ed2]"],
                         ["Web forms", "36", "13%", "bg-[#3f557d]"],
                      ].map(([label, number, width, color]) => (
                        <div key={label}>
                          <div className="mb-1.5 flex justify-between text-[11px] text-[#68736b]">
                            <span>{label}</span><span className="font-mono text-[10px]">{number}</span>
                          </div>
                           <div className="h-1.5 bg-[#242424]"><div className={`h-full ${color}`} style={{ width }} /></div>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="border-t border-[#2b2b2b] pt-5 sm:border-l sm:border-t-0 sm:pl-6 sm:pt-0">
                    <div className="mb-5 flex items-end justify-between">
                      <div>
                        <p className="font-mono text-[10px] uppercase tracking-[0.14em] text-[#8a938b]">Bookings won</p>
                        <p className="mt-2 font-['Inter'] text-[32px] font-semibold tracking-[-0.06em]">91</p>
                      </div>
                       <span className="font-mono text-[10px] text-[#9fc4ff]">31.8% CVR</span>
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                       <div className="bg-[#121d33] p-3"><p className="font-mono text-[9px] uppercase tracking-[0.12em] text-[#9fc4ff]">Aira booked</p><p className="mt-2 text-[21px] tracking-[-0.05em]">38</p></div>
                       <div className="bg-[#1e1a26] p-3"><p className="font-mono text-[9px] uppercase tracking-[0.12em] text-[#b7a8ff]">Escalated</p><p className="mt-2 text-[21px] tracking-[-0.05em]">12</p></div>
                       <div className="col-span-2 flex items-center justify-between border-t border-[#2b2b2b] pt-3 text-[11px]"><span className="text-[#8f8f8f]">After-hours opportunities</span><span className="font-mono text-[#9fc4ff]">14 captured</span></div>
                    </div>
                  </div>
                </div>
              </article>

               <article className="rounded-[12px] border border-[#242424] bg-[#111111] p-5 sm:p-6">
                <SectionLabel detail="From 42 conversations">Customer sentiment</SectionLabel>
                <div className="flex items-center gap-6">
                   <div className="relative grid h-28 w-28 shrink-0 place-items-center rounded-full border-[10px] border-[#25324d] border-r-[#8fb7ff] border-t-[#65d7e6]">
                     <div className="text-center"><p className="font-['Inter'] text-[28px] tracking-[-0.08em]">86</p><p className="font-mono text-[9px] uppercase tracking-[0.1em] text-[#777777]">score</p></div>
                  </div>
                  <div className="space-y-3 text-[11px]">
                     <div className="flex items-center gap-2"><span className="h-2 w-2 rounded-full bg-[#8fb7ff]" /><span className="text-[#a2a2a2]">Positive</span><span className="ml-auto font-mono text-[#9fc4ff]">72%</span></div>
                     <div className="flex items-center gap-2"><span className="h-2 w-2 rounded-full bg-[#51668f]" /><span className="text-[#a2a2a2]">Neutral</span><span className="ml-auto font-mono text-[#888888]">21%</span></div>
                     <div className="flex items-center gap-2"><span className="h-2 w-2 rounded-full bg-[#9f8eff]" /><span className="text-[#a2a2a2]">Needs care</span><span className="ml-auto font-mono text-[#b7a8ff]">7%</span></div>
                  </div>
                </div>
                 <div className="mt-5 border-t border-[#2b2b2b] pt-4">
                   <div className="flex items-start gap-3"><MessageCircle size={14} className="mt-0.5 text-[#b7a8ff]" /><div><p className="text-[11px] font-medium text-[#dedede]">3 conversations need a human touch</p><p className="mt-1 text-[10px] leading-4 text-[#858585]">Mostly related to wait time and insurance questions.</p></div><button type="button" onClick={() => setActiveNav("Conversations")} className="ml-auto text-[10px] text-[#9fc4ff] underline underline-offset-2">Review</button></div>
                </div>
              </article>
            </section>

            <section className="aira-rise aira-rise-4 mt-9 grid gap-4 xl:grid-cols-[0.9fr_1.1fr]">
               <article className="rounded-[12px] border border-[#242424] bg-[#111111] p-5 sm:p-6">
                <SectionLabel detail="Most requested">Service momentum</SectionLabel>
                 <div className="flex items-end justify-between border-b border-[#2b2b2b] pb-5">
                   <div><p className="font-mono text-[10px] uppercase tracking-[0.14em] text-[#8b8b8b]">Best-selling service</p><p className="mt-2 font-['Inter'] text-[24px] font-semibold leading-none tracking-[-0.04em]">Invisalign consult</p></div>
                   <span className="font-mono text-[11px] text-[#9fc4ff]">28 booked</span>
                </div>
                <div className="mt-5 space-y-4">
                  {[
                     ["Invisalign consult", "28", "82%", "bg-[#8fb7ff]"],
                     ["New patient exam", "22", "64%", "bg-[#6d8ed2]"],
                     ["Teeth whitening", "17", "49%", "bg-[#3f557d]"],
                  ].map(([label, count, width, color]) => (
                     <div key={label}><div className="mb-1.5 flex items-center justify-between text-[11px]"><span className="text-[#a2a2a2]">{label}</span><span className="font-mono text-[10px] text-[#9fc4ff]">{count}</span></div><div className="h-2 bg-[#242424]"><div className={`h-full ${color}`} style={{ width }} /></div></div>
                  ))}
                </div>
              </article>

               <article className="rounded-[12px] border border-[#242424] bg-[#111111] p-5 sm:p-6">
                <div className="flex items-start justify-between">
                  <SectionLabel detail="Across phone + text">Aira handled the front desk</SectionLabel>
                   <div className="flex items-center gap-1.5 rounded-full bg-[#122036] px-2 py-1 font-mono text-[9px] text-[#9fc4ff]"><span className="h-1.5 w-1.5 rounded-full bg-[#8fb7ff]" />Live</div>
                </div>
                <div className="grid gap-5 sm:grid-cols-3">
                   <div className="sm:col-span-1"><p className="font-['Inter'] text-[42px] leading-none tracking-[-0.08em]">78%</p><p className="mt-2 text-[11px] leading-4 text-[#8f8f8f]">of inbound conversations resolved without an escalation</p></div>
                   <div className="grid grid-cols-2 gap-x-5 gap-y-4 border-t border-[#2b2b2b] pt-4 sm:col-span-2 sm:border-l sm:border-t-0 sm:pl-5 sm:pt-0">
                     <div><p className="font-mono text-[9px] uppercase tracking-[0.12em] text-[#777777]">Calls answered</p><p className="mt-1.5 text-[20px] tracking-[-0.05em]">164</p><p className="text-[10px] text-[#9fc4ff]">97.6% pickup rate</p></div>
                     <div><p className="font-mono text-[9px] uppercase tracking-[0.12em] text-[#777777]">Messages handled</p><p className="mt-1.5 text-[20px] tracking-[-0.05em]">86</p><p className="text-[10px] text-[#9fc4ff]">Under 2 min avg.</p></div>
                     <div><p className="font-mono text-[9px] uppercase tracking-[0.12em] text-[#777777]">Escalations</p><p className="mt-1.5 text-[20px] tracking-[-0.05em]">12</p><p className="text-[10px] text-[#b7a8ff]">3 need review</p></div>
                     <div><p className="font-mono text-[9px] uppercase tracking-[0.12em] text-[#777777]">Hours returned</p><p className="mt-1.5 text-[20px] tracking-[-0.05em]">42.5</p><p className="text-[10px] text-[#9fc4ff]">This period</p></div>
                  </div>
                </div>
              </article>
            </section>

             <section className="aira-rise mt-9 overflow-hidden rounded-[12px] border border-[#30466f] bg-[#0f1a2e]">
              <div className="flex flex-col gap-5 p-5 sm:flex-row sm:items-center sm:justify-between sm:p-7">
                <div className="flex items-start gap-4">
                   <div className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-gradient-to-br from-[#8fb7ff] to-[#65d7e6] text-[#050505]"><Bot size={21} strokeWidth={1.5} /></div>
                   <div><p className="font-mono text-[10px] uppercase tracking-[0.18em] text-[#9fc4ff]">Your business copilot</p><h2 className="mt-1 font-['Inter'] text-[24px] font-semibold tracking-[-0.04em] text-[#f5f5f5]">Ask Aira anything about your studio.</h2><p className="mt-1 text-[12px] text-[#9eabbf]">Get a grounded answer from your conversations, bookings, and performance data.</p></div>
                </div>
                 <div className="flex w-full max-w-[370px] items-center gap-2 rounded-full border border-[#30466f] bg-[#111111] p-1.5 focus-within:border-[#8fb7ff]">
                   <input aria-label="Ask Aira a question" value={copilotInput} onChange={(event) => setCopilotInput(event.target.value)} onKeyDown={(event) => { if (event.key === "Enter") handleCopilot(); }} placeholder="e.g. Where did we lose opportunities?" className="min-w-0 flex-1 bg-transparent px-3 text-[11px] text-[#f5f5f5] outline-none placeholder:text-[#7f8da8]" />
                   <button type="button" onClick={() => handleCopilot()} aria-label="Send question to Aira" className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-[#f5f5f5] text-[#050505] transition-colors hover:bg-[#d9d9d9]"><Send size={14} /></button>
                </div>
              </div>
              {(copilotAnswer || copilotOpen) && (
                 <div className="border-t border-[#30466f] bg-[#111a2c] px-5 py-4 sm:px-7">
                   <div className="flex items-start gap-3"><Sparkles size={15} className="mt-0.5 text-[#9fc4ff]" /><div><p className="font-mono text-[9px] uppercase tracking-[0.14em] text-[#9fc4ff]">Aira&apos;s read</p><p className="mt-1 max-w-[720px] text-[12px] leading-5 text-[#b4bfd3]">{copilotAnswer || "Ask a question above and I’ll connect the dots across your studio data."}</p></div><button type="button" onClick={() => setCopilotOpen(false)} aria-label="Close copilot answer" className="ml-auto text-[#8390a8] hover:text-[#f5f5f5]"><X size={15} /></button></div>
                </div>
              )}
            </section>

             <footer className="mt-9 flex flex-col items-start justify-between gap-4 border-t border-[#202020] pt-5 text-[11px] text-[#777777] sm:flex-row sm:items-center">
              <p>Data refreshed 4 minutes ago · Northstar Dental Studio</p>
              <button
                type="button"
                onClick={() => setSummaryRequested(true)}
                 className="flex items-center gap-2 font-medium text-[#9fc4ff] transition-colors hover:text-[#f5f5f5]"
              >
                {summaryRequested ? <Check size={14} /> : <FileText size={14} />}
                {summaryRequested ? "One-sheet requested — we’ll email it shortly" : "Ask Aira for this week’s one-sheet"}
              </button>
            </footer>
               </>
             )}
          </div>
        </main>
      </div>

      {supportOpen && (
        <div className="fixed inset-0 z-50 flex items-end justify-end bg-[#000000]/55 p-4 sm:items-center sm:p-8" role="dialog" aria-modal="true" aria-labelledby="support-title">
          <div className="w-full max-w-[360px] rounded-[12px] border border-[#303030] bg-[#111111] p-6 text-[#f5f5f5] shadow-[0_20px_50px_rgba(0,0,0,0.45)]">
            <div className="flex items-start justify-between"><div><p className="font-mono text-[10px] uppercase tracking-[0.18em] text-[#9fc4ff]">Priority support</p><h2 id="support-title" className="mt-2 font-['Inter'] text-[24px] font-semibold tracking-[-0.04em]">We&apos;re here, Julia.</h2></div><button type="button" onClick={() => setSupportOpen(false)} aria-label="Close support dialog" className="text-[#777777] hover:text-[#f5f5f5]"><X size={17} /></button></div>
            <p className="mt-3 text-[12px] leading-5 text-[#929292]">Your Aira partner team typically replies within 15 minutes during studio hours.</p>
            <button type="button" onClick={() => setSupportOpen(false)} className="mt-5 flex w-full items-center justify-center gap-2 rounded-full bg-[#f5f5f5] py-3 text-[11px] font-medium text-[#050505] hover:bg-[#d9d9d9]"><MessageCircle size={14} /> Start a conversation</button>
            <p className="mt-3 text-center font-mono text-[9px] uppercase tracking-[0.12em] text-[#666666]">Mon–Fri · 8:00–18:00 local time</p>
          </div>
        </div>
      )}
    </div>
  );
}

export { Dashboard };
export default Dashboard;