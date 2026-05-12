import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { LayoutDashboard, BrainCircuit, Activity, Layers, Code2, BarChart2, CheckCircle2, Sliders, Target, Play, LineChart, Zap, ArrowLeft, Terminal, Server, Cpu } from 'lucide-react';
import { cn } from '../lib/utils';
import { Mermaid } from './Mermaid';

const TABS = [
  { id: 'summary', icon: LayoutDashboard, label: 'Executive Summary' },
  { id: 'strategies', icon: BrainCircuit, label: 'Core Algorithms' },
  { id: 'mapping', icon: Layers, label: 'Conceptual Mapping' },
  { id: 'architecture', icon: Activity, label: 'Architecture Model' },
  { id: 'implementation', icon: Code2, label: 'Implementation' },
  { id: 'balancing', icon: Sliders, label: 'Mechanics & Balancing' },
  { id: 'guidelines', icon: BarChart2, label: 'Balancing Guidelines' },
  { id: 'mixing', icon: Server, label: 'Mixing Patterns' },
  { id: 'scenarios', icon: Play, label: 'Sample Scenarios' },
  { id: 'metrics', icon: LineChart, label: 'Playtesting Metrics' },
  { id: 'performance', icon: Cpu, label: 'Optimization' },
];

export function Report({ onBack }: { onBack?: () => void }) {
  const [activeTab, setActiveTab] = useState('summary');

  return (
    <div className="absolute inset-0 w-full h-full bg-[#020617] overflow-hidden flex flex-col font-sans">
      {/* Background Grid */}
      <div className="absolute inset-0 pointer-events-none opacity-10 bg-[linear-gradient(rgba(6,182,212,0.2)_1px,transparent_1px),linear-gradient(90deg,rgba(6,182,212,0.2)_1px,transparent_1px)] bg-[size:40px_40px] z-0"></div>
      <div className="absolute inset-0 pointer-events-none opacity-20 bg-[radial-gradient(circle_at_center,_transparent_0%,_#020617_100%)] z-0"></div>

      {/* Header Area */}
      <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-end p-6 md:p-8 md:pt-12 border-b border-cyan-900/50 bg-slate-950/80 backdrop-blur-md shadow-[0_10px_30px_rgba(6,182,212,0.05)]">
        <div className="flex flex-col gap-4">
          {onBack && (
            <button 
              onClick={onBack}
              className="flex items-center gap-2 px-4 py-2 bg-slate-900 border border-cyan-900/50 hover:border-cyan-500 text-cyan-500 hover:text-cyan-300 transition-all font-mono text-xs tracking-widest uppercase w-max"
              style={{ clipPath: 'polygon(10% 0, 100% 0, 90% 100%, 0% 100%)' }}
            >
              <ArrowLeft size={14} /> Command Interface
            </button>
          )}
          
          <div>
            <div className="flex items-center gap-3">
              <Terminal className="text-cyan-400 shrink-0" size={32} />
              <h1 className="text-3xl md:text-5xl font-black text-white tracking-[0.2em] uppercase font-mono drop-shadow-[0_0_15px_rgba(6,182,212,0.5)]">
                SYSTEM SETTINGS & LOGS
              </h1>
            </div>
            <p className="text-cyan-500/70 font-mono text-sm tracking-widest mt-1 md:ml-[44px]">EARTH DEFENSE INITIATIVE // DATABANK ARCHIVE</p>
          </div>
        </div>
      </div>

      <div className="relative z-10 flex flex-col md:flex-row flex-1 min-h-0">
        {/* Sidebar Content Menu */}
        <div className="w-full md:w-80 bg-slate-950/80 border-b md:border-b-0 md:border-r border-cyan-900/50 flex flex-col p-4 md:p-6 shrink-0 overflow-x-auto md:overflow-y-auto custom-scrollbar backdrop-blur-sm relative">
           <div className="absolute top-0 right-0 w-8 h-8 bg-cyan-500/10" style={{ clipPath: 'polygon(100% 0, 0 0, 100% 100%)' }}></div>
           <h2 className="hidden md:block text-[10px] font-bold text-cyan-500 uppercase tracking-widest mb-6 px-2 border-b border-slate-800 pb-2">Archive Index</h2>
           <nav className="flex flex-row md:flex-col gap-2 md:gap-3 w-max md:w-auto">
              {TABS.map((tab) => {
                const Icon = tab.icon;
                const isActive = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    style={{ clipPath: 'polygon(0 0, 95% 0, 100% 50%, 95% 100%, 0 100%)' }}
                    className={cn(
                      "flex items-center gap-3 px-4 py-3 text-[10px] md:text-xs font-mono font-bold tracking-widest transition-all duration-300 relative text-left whitespace-nowrap uppercase border",
                      isActive 
                        ? "text-cyan-100 bg-cyan-950/50 border-cyan-500/50 shadow-[0_0_10px_rgba(6,182,212,0.2)]"
                        : "text-slate-500 bg-slate-900/50 border-slate-800/80 hover:text-cyan-400 hover:border-cyan-900/50"
                    )}
                  >
                    <Icon size={16} className={cn("transition-colors shrink-0", isActive ? "text-cyan-400" : "text-slate-600")} />
                    <span className="flex-1 truncate mt-0.5">{tab.label}</span>
                  </button>
                );
              })}
           </nav>
        </div>

        {/* Main Report Content */}
        <div className="flex-1 overflow-y-auto p-4 md:p-12 scroll-smooth custom-scrollbar">
           <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, scale: 0.98, filter: 'blur(5px)' }}
                animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
                exit={{ opacity: 0, scale: 0.98, filter: 'blur(5px)' }}
                transition={{ duration: 0.3 }}
                className="max-w-4xl mx-auto"
              >
                <Content tab={activeTab} />
              </motion.div>
            </AnimatePresence>
        </div>
      </div>
    </div>
  );
}

// Reusable Heading Component
function SectionHeading({ title, subtitle }: { title: string, subtitle?: string }) {
   return (
      <div className="space-y-2 border-b border-cyan-900/50 pb-4 mb-8">
        <h2 className="text-2xl md:text-3xl font-mono font-black tracking-widest text-white uppercase drop-shadow-[0_0_8px_rgba(34,211,238,0.4)]">{title}</h2>
        {subtitle && <p className="text-cyan-500/70 font-mono text-xs tracking-widest uppercase mt-2">{subtitle}</p>}
      </div>
   );
}

// Helper Container for Content sections
function ContentBox({ title, icon: Icon, children, borderColor = "border-slate-700/50" }: any) {
  return (
    <div className={cn("bg-slate-900/60 p-6 md:p-8 border backdrop-blur-sm relative", borderColor)} style={{ clipPath: 'polygon(0 0, 97% 0, 100% 7%, 100% 100%, 3% 100%, 0 93%)' }}>
      <div className="absolute top-0 right-0 w-8 h-8 bg-current opacity-10" style={{ clipPath: 'polygon(100% 0, 0 0, 100% 100%)' }}></div>
      {title && (
         <h3 className="text-lg md:text-xl font-mono font-bold flex items-center gap-4 text-white mb-6 uppercase tracking-widest border-b border-slate-800 pb-4">
          {Icon && <span className="text-cyan-400"><Icon size={20} /></span>}
          {title}
        </h3>
      )}
      <div className="font-mono text-slate-300 text-xs md:text-sm leading-relaxed">
        {children}
      </div>
    </div>
  );
}

function Content({ tab }: { tab: string }) {
  switch (tab) {
    case 'summary': return <ExecutiveSummary />;
    case 'strategies': return <Strategies />;
    case 'mapping': return <ConceptualMapping />;
    case 'architecture': return <Architecture />;
    case 'implementation': return <Implementation />;
    case 'balancing': return <Balancing />;
    case 'guidelines': return <Guidelines />;
    case 'mixing': return <MixingPatterns />;
    case 'scenarios': return <Scenarios />;
    case 'metrics': return <Metrics />;
    case 'performance': return <Performance />;
    default: return null;
  }
}

function ExecutiveSummary() {
  return (
    <div className="space-y-6">
      <SectionHeading title="Executive Summary" subtitle="Applying CPU scheduling paradigms to 2D survival AI architecture." />
      <ContentBox borderColor="border-cyan-500/30" icon={LayoutDashboard} title="Overview">
        <p className="mb-6">
          In a 2D survival game, enemy behavior can be driven by classic CPU scheduling strategies. 
          By treating enemy actions (spawn, pathfinding, attack) as processes, we can map 
          <strong className="text-cyan-400"> FCFS</strong>, <strong className="text-cyan-400"> RR</strong>, and <strong className="text-cyan-400"> HRRN</strong> to dictate enemy order and cadence.
        </p>
        <ul className="space-y-4 list-none p-0">
          <li className="flex gap-4 items-start p-4 bg-slate-950/50 border border-slate-800">
            <CheckCircle2 className="mt-0.5 shrink-0 text-amber-500" size={16} />
            <div><strong className="text-amber-400 block mb-1 uppercase tracking-widest text-[10px]">FCFS</strong> Spawns and executes behaviors in strict arrival order. Simple but can lead to convoys blocking action.</div>
          </li>
          <li className="flex gap-4 items-start p-4 bg-slate-950/50 border border-slate-800">
             <CheckCircle2 className="mt-0.5 shrink-0 text-emerald-500" size={16} />
            <div><strong className="text-emerald-400 block mb-1 uppercase tracking-widest text-[10px]">Round-Robin (RR)</strong> Assigns a strict time-slice. Ensures fair distribution and high responsiveness.</div>
          </li>
          <li className="flex gap-4 items-start p-4 bg-slate-950/50 border border-slate-800">
             <CheckCircle2 className="mt-0.5 shrink-0 text-indigo-500" size={16} />
            <div><strong className="text-indigo-400 block mb-1 uppercase tracking-widest text-[10px]">HRRN</strong> Balances starvation and threat by dynamic prioritization. Yields smart tactical AI.</div>
          </li>
        </ul>
      </ContentBox>
    </div>
  );
}

function Strategies() {
  return (
    <div className="space-y-8">
      <SectionHeading title="Core Algorithms" subtitle="Deep dive into CPU scheduling translates." />
      
      <div className="grid gap-6">
        <ContentBox borderColor="border-amber-500/30" title="FCFS (First-Come, First-Served)">
          <div className="absolute top-0 right-0 w-8 h-8 bg-amber-500/10" style={{ clipPath: 'polygon(100% 0, 0 0, 100% 100%)' }}></div>
          <p className="text-amber-100/70">Enemies are placed in a FIFO queue. The entity at the front finishes its entire attack cycle before yielding. Simple, but prone to blockage if animations are long.</p>
        </ContentBox>
        <ContentBox borderColor="border-emerald-500/30" title="Round-Robin (RR)">
           <div className="absolute top-0 right-0 w-8 h-8 bg-emerald-500/10" style={{ clipPath: 'polygon(100% 0, 0 0, 100% 100%)' }}></div>
          <p className="text-emerald-100/70">Every enemy receives a small time 'quantum'. Ensures fair flow and simultaneous swarm advancement, but adds state-switching overhead.</p>
        </ContentBox>
        <ContentBox borderColor="border-indigo-500/30" title="Highest-Response-Ratio-Next (HRRN)">
           <div className="absolute top-0 right-0 w-8 h-8 bg-indigo-500/10" style={{ clipPath: 'polygon(100% 0, 0 0, 100% 100%)' }}></div>
          <p className="text-indigo-100/70 mb-4">Sorts execution by dynamic priority. Solves starvation while respecting enemy threat values.</p>
          <div className="p-3 bg-indigo-950/30 border border-indigo-500/30 font-mono text-indigo-300 text-center uppercase tracking-widest text-xs">
              R = (Wait Time + Service Time) / Service Time
          </div>
        </ContentBox>
      </div>
    </div>
  );
}

function ConceptualMapping() {
  return (
    <div className="space-y-8">
      <SectionHeading title="Conceptual Mapping" />
      <div className="space-y-6">
        <FeatureCard 
          title="Enemy Spawn Scheduling"
          fcfs="Handles triggers in exact order occurring. Bosses delay next spawns."
          rr="Cyclical distribution across multiple spawn points."
          hrrn="Spawns prioritized by urgency and wait time."
        />
        <FeatureCard 
          title="Targeting & Attack Order"
          fcfs="First spawned attacks first. Relegates others."
          rr="Swarm takes turns attacking. Extremely fair to player."
          hrrn="Emulates aggro by favoring waiting enemies."
        />
        <FeatureCard 
          title="Action Time-Slicing"
          fcfs="One enemy updates at a time, halting others."
          rr="Cycles 16ms fixed slices across swarm."
          hrrn="Updates lagging AI components dynamically."
        />
      </div>
    </div>
  );
}

function FeatureCard({title, fcfs, rr, hrrn}: any) {
  return (
    <div className="bg-slate-900/60 border border-slate-700/50 p-6 relative" style={{ clipPath: 'polygon(0 0, 100% 0, 100% 85%, 95% 100%, 0 100%)' }}>
      <h3 className="text-base font-bold text-white mb-6 uppercase tracking-widest font-mono border-b border-slate-800 pb-2">{title}</h3>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-xs text-slate-400 font-mono">
        <div className="p-4 bg-slate-950/50 border border-amber-900/30"><strong className="text-amber-500 block mb-2 tracking-widest">FCFS</strong>{fcfs}</div>
        <div className="p-4 bg-slate-950/50 border border-emerald-900/30"><strong className="text-emerald-500 block mb-2 tracking-widest">RR</strong>{rr}</div>
        <div className="p-4 bg-slate-950/50 border border-indigo-900/30"><strong className="text-indigo-500 block mb-2 tracking-widest">HRRN</strong>{hrrn}</div>
      </div>
    </div>
  );
}

function Architecture() {
  const chart = `
  flowchart TD
      classDef default fill:#0f172a,stroke:#22d3ee,stroke-width:1px,color:#f8fafc;
      classDef active fill:#082f49,stroke:#38bdf8,stroke-width:2px,color:#f8fafc;
      classDef action fill:#064e3b,stroke:#a7f3d0,stroke-width:2px,color:#f8fafc;
      S[Enemy Spawn Event] --> Q[(AI Scheduler Queue)]
      Q --> Eval{Evaluate Strategy}
      Eval -- FCFS --> P_FCFS[Pop Front Enemy]
      Eval -- Round-Robin --> P_RR[Time-Slice]
      Eval -- HRRN --> P_HRRN[Compute Priority]
      P_FCFS --> Execute[Execute Action]:::active
      P_RR --> Execute
      P_HRRN --> Execute
      Execute --> Check{Is Action complete?}
      Check -- Yes --> End[Finish]:::action
      Check -- No --> Q_Update[Update Waiting Times]
      Q_Update --> Q
  `;
  return (
    <div className="space-y-6">
      <SectionHeading title="Architecture Model" subtitle="Scheduler Flowchart Representation" />
      <ContentBox borderColor="border-cyan-500/50">
        <div className="overflow-hidden mix-blend-screen opacity-90">
          <Mermaid chart={chart} />
        </div>
      </ContentBox>
    </div>
  );
}

function Implementation() {
  return (
    <div className="space-y-8">
      <SectionHeading title="Spawning & Attack Implementation" subtitle="Technical insights into the queue mechanics and execution time-slicing." />

      <div className="space-y-6">
        <ContentBox title="Spawning Mechanics" icon={Activity} borderColor="border-indigo-500/30">
          <div className="absolute top-0 right-0 w-8 h-8 bg-indigo-500/10" style={{ clipPath: 'polygon(100% 0, 0 0, 100% 100%)' }}></div>
          <p className="mb-4 text-indigo-100/70">Use a queue for new spawn events. When a spawn is ready, it is added to the queue with a timestamp.</p>
          <ul className="space-y-4">
             <li className="flex gap-4 p-4 border border-indigo-900/30 bg-indigo-950/20"><div className="w-2 h-2 rounded-none bg-indigo-500 mt-1.5 shrink-0" /><div><strong className="text-indigo-400">FCFS:</strong> Always dequeue the oldest spawn. Simple timestamp resolution.</div></li>
             <li className="flex gap-4 p-4 border border-indigo-900/30 bg-indigo-950/20"><div className="w-2 h-2 rounded-none bg-indigo-500 mt-1.5 shrink-0" /><div><strong className="text-indigo-400">Round-Robin / HRRN:</strong> Cycle through valid spawn points or apply HRRN logic to pick which spawn location activates next.</div></li>
          </ul>
        </ContentBox>

        <ContentBox title="Targeting & Action Slicing" icon={Target} borderColor="border-rose-500/30">
          <div className="absolute top-0 right-0 w-8 h-8 bg-rose-500/10" style={{ clipPath: 'polygon(100% 0, 0 0, 100% 100%)' }}></div>
          <p className="mb-4 text-rose-100/70">Each enemy operates as a State Machine (Idle, Move, Attack, Cooldown). The CPU scheduler dictates which enemy advances per tick:</p>
          <div className="space-y-3">
            {[ 
               "Gather all active enemies (e.g., spawned and not dead).",
               "The Scheduler picks enemies to update this frame based on the active strategy.",
               "Selected enemies execute their AI action for a fixed action interval.",
               "Loop the cycle each frame. Emulates multi-core processing limits."
            ].map((text, i) => (
               <div key={i} className="bg-slate-950 border border-slate-800 p-4 flex gap-4 items-start relative">
                 <div className="absolute top-0 left-0 w-1 h-full bg-rose-500/50"></div>
                 <div className="text-rose-500 font-mono font-black text-lg w-6 shrink-0 text-center">0{i+1}</div>
                 <p className="text-slate-400 pt-0.5">{text}</p>
               </div>
            ))}
          </div>
        </ContentBox>
      </div>
    </div>
  );
}

function Balancing() {
  return (
    <div className="space-y-8 border-b border-transparent">
      <SectionHeading title="Concrete Mechanics & Balancing" subtitle="Logic parameters and formulas for live deployment." />

      <div className="space-y-6">
        <ContentBox title="Spawn Rates" borderColor="border-sky-500/30">
          <div className="absolute top-0 right-0 w-8 h-8 bg-sky-500/10" style={{ clipPath: 'polygon(100% 0, 0 0, 100% 100%)' }}></div>
          <p className="text-sky-100/80">
            Set a base spawn interval or wave delay <code className="bg-sky-950 border border-sky-800 px-2 py-0.5 text-sky-400">T</code>. FCFS mode (easy) <code className="bg-sky-950 border border-sky-800 px-2 py-0.5 text-sky-400">T=4s</code>, RR mode (normal) <code className="bg-sky-950 border border-sky-800 px-2 py-0.5 text-sky-400">T=3s</code>, HRRN mode (hard) <code className="bg-sky-950 border border-sky-800 px-2 py-0.5 text-sky-400">T=2s</code>.
          </p>
        </ContentBox>

        <ContentBox title="Time Quantum (RR)" borderColor="border-emerald-500/30">
           <div className="absolute top-0 right-0 w-8 h-8 bg-emerald-500/10" style={{ clipPath: 'polygon(100% 0, 0 0, 100% 100%)' }}></div>
          <p className="text-emerald-100/80">
            If using Round-Robin, pick a quantum. E.g. <code className="bg-emerald-950 border border-emerald-800 px-2 py-0.5 text-emerald-400">0.5s</code> per enemy turn. A larger quantum makes enemies finish attacks uninterrupted; a very small quantum means highly interleaved chaos.
          </p>
        </ContentBox>

        <ContentBox title="HRRN Priority & Threat Score" borderColor="border-indigo-500/30">
           <div className="absolute top-0 right-0 w-8 h-8 bg-indigo-500/10" style={{ clipPath: 'polygon(100% 0, 0 0, 100% 100%)' }}></div>
          <p className="mb-4 text-indigo-100/80">
            ResponseRatio = <code className="bg-indigo-950 border border-indigo-800 px-2 py-0.5 text-indigo-400">(W + S) / S</code>. W is Wait Time, S is Service Time (Threat Measure).
          </p>
          <div className="bg-indigo-950/50 p-4 border border-indigo-500/20 text-indigo-300">
            <strong>Example:</strong> Enemy A has W=10s, S=2s → R=6.0. Enemy B has W=2s, S=1s → R=3.0. Enemy A acts first.
          </div>
        </ContentBox>
      </div>

      <div className="pt-8">
        <h3 className="text-lg font-mono font-bold tracking-widest text-white mb-4 uppercase">Parameter Table Matrix</h3>
        <div className="bg-slate-900/80 border border-cyan-900/50 overflow-hidden font-mono text-xs">
          <table className="w-full text-left">
            <thead className="bg-slate-950 text-slate-500 uppercase tracking-widest">
              <tr>
                <th className="px-6 py-4 font-bold border-b border-slate-800">Parameter</th>
                <th className="px-6 py-4 font-bold border-b border-slate-800 text-amber-500">FCFS</th>
                <th className="px-6 py-4 font-bold border-b border-slate-800 text-emerald-500">RR</th>
                <th className="px-6 py-4 font-bold border-b border-slate-800 text-indigo-500">HRRN</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/50 text-slate-300">
              <tr className="hover:bg-slate-800/30 transition-colors">
                <td className="px-6 py-4 text-white">Spawn Interval</td>
                <td className="px-6 py-4">4.0 s</td>
                <td className="px-6 py-4">3.0 s</td>
                <td className="px-6 py-4">2.0 s</td>
              </tr>
              <tr className="hover:bg-slate-800/30 transition-colors">
                <td className="px-6 py-4 text-white">RR Quantum</td>
                <td className="px-6 py-4 text-slate-600">N/A</td>
                <td className="px-6 py-4">0.5 s</td>
                <td className="px-6 py-4 text-slate-600">N/A</td>
              </tr>
              <tr className="hover:bg-slate-800/30 transition-colors">
                <td className="px-6 py-4 text-white">Initial Priority</td>
                <td className="px-6 py-4">FCFS queue</td>
                <td className="px-6 py-4">RR queue</td>
                <td className="px-6 py-4">Ratio Compute</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function Guidelines() {
  return (
    <div className="space-y-8">
      <SectionHeading title="Balancing Guidelines" subtitle="Heuristics for creating fair, challenging, and tactical AI flow." />

      <div className="space-y-6">
        <ContentBox title="Fairness & Perceived Intelligence" icon={CheckCircle2} borderColor="border-emerald-500/30">
          <p className="mb-6 text-emerald-100/70">Fairness means not letting one enemy dominate unless intended. HRRN-controlled enemies seem more "intelligent" because they adapt.</p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
             <div className="bg-slate-950/50 border border-slate-800 p-4 text-center" style={{ clipPath: 'polygon(10% 0, 100% 0, 90% 100%, 0 100%)' }}>
                <strong className="text-amber-500 block mb-2 uppercase tracking-widest">FCFS</strong>
                <span className="text-xs text-slate-500">Can feel unfair if one target blocks others.</span>
             </div>
             <div className="bg-slate-950/50 border border-slate-800 p-4 text-center" style={{ clipPath: 'polygon(10% 0, 100% 0, 90% 100%, 0 100%)' }}>
                <strong className="text-emerald-500 block mb-2 uppercase tracking-widest">RR</strong>
                <span className="text-xs text-slate-500">Innately fair. Swarm hits in synchronized turns.</span>
             </div>
             <div className="bg-slate-950/50 border border-slate-800 p-4 text-center" style={{ clipPath: 'polygon(10% 0, 100% 0, 90% 100%, 0 100%)' }}>
                <strong className="text-indigo-500 block mb-2 uppercase tracking-widest">HRRN</strong>
                <span className="text-xs text-slate-500">Prevents starvation by boosting tactical urgency.</span>
             </div>
          </div>
        </ContentBox>
      </div>
    </div>
  );
}

function MixingPatterns() {
  return (
    <div className="space-y-8">
      <SectionHeading title="Mixing Patterns" subtitle="Combine algorithms to enrich gameplay dynamics." />

      <div className="space-y-6">
        <ContentBox title="Difficulty Modes Matrix" icon={Layers} borderColor="border-cyan-500/30">
          <ul className="space-y-4">
             <li className="p-4 border border-slate-800 bg-slate-950/50"><strong className="text-amber-400">Easy (FCFS):</strong> Simple waves. Cons: A single powerful enemy can stall everything.</li>
             <li className="p-4 border border-slate-800 bg-slate-950/50"><strong className="text-emerald-400">Normal (RR):</strong> Constant, steady pressure. Cons: Uniform pressure makes spike difficulty harder.</li>
             <li className="p-4 border border-slate-800 bg-slate-950/50"><strong className="text-indigo-400">Hard (HRRN):</strong> Enemy priority adapts mid-battle. Cons: High tuning complexity.</li>
          </ul>
        </ContentBox>

        <ContentBox title="Hybrid Director AI" icon={BrainCircuit} borderColor="border-rose-500/30">
          <p className="mb-4 text-rose-100/70">Change scheduling on-the-fly based on game state.</p>
          <ul className="space-y-3 p-4 bg-slate-950/50 border border-rose-900/30 text-rose-200">
             <li className="flex gap-3"><div className="w-1.5 h-1.5 bg-rose-500 mt-1.5 shrink-0" /><div>Start wave in FCFS, switch to RR at 50% health.</div></li>
             <li className="flex gap-3"><div className="w-1.5 h-1.5 bg-rose-500 mt-1.5 shrink-0" /><div>If an Elite spawns, temporarily isolate them into FCFS.</div></li>
          </ul>
        </ContentBox>
      </div>
    </div>
  );
}

function Scenarios() {
  return (
    <div className="space-y-8">
      <SectionHeading title="Sample Scenarios" subtitle="Simulated emergent gameplay differing by scheduler." />

      <div className="space-y-6">
        <ContentBox title="Three Fighters Engaging" borderColor="border-cyan-500/30">
          <ul className="space-y-4">
             <li><strong className="text-amber-400">FCFS:</strong> Fighter 1 attacks until dead. Idle wingmen.</li>
             <li><strong className="text-emerald-400">RR:</strong> Fighters take turns firing every second. Constant strafing pressure.</li>
             <li><strong className="text-indigo-400">HRRN:</strong> Slowly shifts from FCFS to RR as wait times equalize.</li>
          </ul>
        </ContentBox>

        <ContentBox title="Capital Ship & Escorts" borderColor="border-rose-500/30">
          <ul className="space-y-4">
             <li><strong className="text-amber-400">FCFS:</strong> Capital ship monopolizes execution queues.</li>
             <li><strong className="text-emerald-400">RR:</strong> Capital ship fires main cannon, escorts fire PDLCs in sequence.</li>
             <li><strong className="text-indigo-400">HRRN:</strong> Escorts build Wait Time, interrupting the Capital Ship to strike tactically.</li>
          </ul>
        </ContentBox>
      </div>
    </div>
  );
}

function Metrics() {
  return (
    <div className="space-y-8">
      <SectionHeading title="Playtesting Metrics" subtitle="Quantitative metrics for AI tuning." />

      <div className="space-y-6">
        <ContentBox title="Quantitative Tracking Data" borderColor="border-cyan-500/30">
          <ul className="space-y-4">
             <li className="p-4 bg-slate-950/50 border border-slate-800"><strong className="text-sky-400 block mb-1">Player Flow & Retention</strong> High death rates at specific waves indicate difficulty spikes. Adjust schedulers to flatten spikes.</li>
             <li className="p-4 bg-slate-950/50 border border-slate-800"><strong className="text-emerald-400 block mb-1">Gini Coefficient (Fairness)</strong> Measure action distribution. RR lowers Gini (high fairness). FCFS increases it.</li>
             <li className="p-4 bg-slate-950/50 border border-slate-800"><strong className="text-indigo-400 block mb-1">Perceived Intelligence A/B</strong> HRRN surprises players, artificially inflating perceived AI complexity.</li>
          </ul>
        </ContentBox>
      </div>
    </div>
  );
}

function Performance() {
  const chart = `
  flowchart LR
    classDef default fill:#0f172a,stroke:#22d3ee,stroke-width:1px,color:#f8fafc;
    classDef action fill:#082f49,stroke:#38bdf8,stroke-width:2px,color:#f8fafc;
    subgraph Scheduler Process
      A[New Spawn] --> Q[(Queue Memory)]
      Q --> S{Alloc}
      S -->|FCFS| X1[Index 0]
      S -->|RR| X2[Ptr++]
      S -->|HRRN| X3[Math.max]
      X1 --> Act[Perform Action]:::action
      X2 --> Act
      X3 --> Act
      Act --> Q
    end
  `;

  return (
    <div className="space-y-8">
      <SectionHeading title="System Optimization" subtitle="Execution overhead & computational limits." />

      <div className="space-y-6">
        <ContentBox title="Computational Complexity" icon={Cpu} borderColor="border-amber-500/30">
           <div className="bg-slate-950/50 border border-slate-800 p-4">
             <div className="flex justify-between items-center border-b border-slate-800 pb-3 mb-3">
                 <span className="text-amber-400 font-bold uppercase tracking-widest">FCFS</span>
                 <code className="bg-amber-950/50 border border-amber-900/50 px-2 py-1 text-amber-200">O(1)</code>
                 <span className="text-slate-500 text-[10px]">Pop Queue</span>
             </div>
             <div className="flex justify-between items-center border-b border-slate-800 pb-3 mb-3">
                 <span className="text-emerald-400 font-bold uppercase tracking-widest">Round-Robin</span>
                 <code className="bg-emerald-950/50 border border-emerald-900/50 px-2 py-1 text-emerald-200">O(1)</code>
                 <span className="text-slate-500 text-[10px]">Move Cycle</span>
             </div>
             <div className="flex justify-between items-center text-indigo-400 font-bold uppercase tracking-widest">
                 <span>HRRN</span>
                 <code className="bg-indigo-950/50 border border-indigo-900/50 px-2 py-1 text-indigo-200">O(n)</code>
                 <span className="text-slate-500 text-[10px]">Eval Ratios</span>
             </div>
           </div>
        </ContentBox>

        <ContentBox title="Pipeline Diagram" borderColor="border-cyan-500/30">
          <div className="overflow-hidden mix-blend-screen opacity-90">
            <Mermaid chart={chart} />
          </div>
        </ContentBox>
      </div>
    </div>
  );
}
