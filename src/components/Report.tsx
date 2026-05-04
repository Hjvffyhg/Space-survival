import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { LayoutDashboard, BrainCircuit, Activity, Layers, Code2, BarChart2, CheckCircle2, Sliders, Target, Play, LineChart, Zap } from 'lucide-react';
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
  { id: 'mixing', icon: BrainCircuit, label: 'Mixing Patterns' },
  { id: 'scenarios', icon: Play, label: 'Sample Scenarios' },
  { id: 'metrics', icon: LineChart, label: 'Playtesting Metrics' },
  { id: 'performance', icon: Zap, label: 'Optimization' },
];

export function Report() {
  const [activeTab, setActiveTab] = useState('summary');

  return (
    <div className="flex h-full w-full bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-2xl">
      {/* Sidebar Content Menu */}
      <div className="w-64 bg-slate-950/50 border-r border-slate-800 flex flex-col p-4 shrink-0 overflow-y-auto">
         <h2 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-4 px-2">Table of Contents</h2>
         <nav className="flex flex-col gap-1">
            {TABS.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={cn(
                    "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 relative text-left",
                    isActive 
                      ? "text-white bg-slate-800 shadow-sm"
                      : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/50"
                  )}
                >
                  <Icon size={16} className={cn("transition-colors", isActive ? "text-indigo-400" : "text-slate-500")} />
                  <span className="flex-1 truncate">{tab.label}</span>
                </button>
              );
            })}
         </nav>
      </div>

      {/* Main Report Content */}
      <div className="flex-1 overflow-y-auto p-8 md:p-12 scroll-smooth">
         <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
              className="max-w-4xl mx-auto"
            >
              <Content tab={activeTab} />
            </motion.div>
          </AnimatePresence>
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

function Implementation() {
  return (
    <div className="space-y-8">
      <div className="space-y-2">
        <h2 className="text-3xl font-semibold tracking-tight text-white mb-2">Spawning & Attack Implementation</h2>
        <p className="text-slate-400">Technical insights into the queue mechanics and execution time-slicing.</p>
      </div>

      <div className="space-y-6">
        <div className="bg-slate-950/50 p-6 rounded-2xl border border-slate-800">
          <h3 className="text-xl font-bold flex items-center gap-3 text-white mb-4">
            <span className="bg-indigo-500/20 text-indigo-400 p-2 rounded-lg"><Activity size={20} /></span>
            Spawning Mechanics
          </h3>
          <p className="text-slate-300 mb-4 leading-relaxed font-light">
            Use a queue for new spawn events. When a spawn is ready, it is added to the queue with a timestamp.
          </p>
          <ul className="space-y-3 text-slate-300">
             <li className="flex gap-3"><div className="w-1.5 h-1.5 rounded-full bg-slate-600 mt-2 shrink-0" /><div><strong>FCFS:</strong> Always dequeue the oldest spawn. Simple timestamp resolution.</div></li>
             <li className="flex gap-3"><div className="w-1.5 h-1.5 rounded-full bg-slate-600 mt-2 shrink-0" /><div><strong>Round-Robin / HRRN:</strong> Cycle through valid spawn points or apply HRRN logic to pick which spawn location activates next (e.g. prioritize locations waiting the longest, or those slated for swifter, weaker enemies).</div></li>
          </ul>
        </div>

        <div className="bg-slate-950/50 p-6 rounded-2xl border border-slate-800">
          <h3 className="text-xl font-bold flex items-center gap-3 text-white mb-4">
            <span className="bg-rose-500/20 text-rose-400 p-2 rounded-lg"><Target size={20} /></span>
            Targeting & Action Slicing
          </h3>
          <p className="text-slate-300 mb-4 leading-relaxed font-light">
            Each enemy operates as a State Machine (Idle, Move, Attack, Cooldown). The CPU scheduler dictates which enemy state machine advances per tick:
          </p>
          
          <div className="space-y-4">
            <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl flex gap-4 items-start">
               <div className="bg-slate-800 text-slate-400 font-mono text-sm w-6 h-6 flex items-center justify-center rounded-md shrink-0">1</div>
               <p className="text-sm text-slate-300 pt-0.5">Gather all active enemies (e.g., spawned and not dead).</p>
            </div>
            <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl flex gap-4 items-start">
               <div className="bg-slate-800 text-slate-400 font-mono text-sm w-6 h-6 flex items-center justify-center rounded-md shrink-0">2</div>
               <p className="text-sm text-slate-300 pt-0.5">The Scheduler picks enemies to "update" this frame based on the active strategy (FCFS: first in list; RR: next in round; HRRN: highest ratio).</p>
            </div>
            <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl flex gap-4 items-start">
               <div className="bg-slate-800 text-slate-400 font-mono text-sm w-6 h-6 flex items-center justify-center rounded-md shrink-0">3</div>
               <p className="text-sm text-slate-300 pt-0.5">Selected enemies execute their AI action (move or attack) for a fixed action interval (1 frame or short duration). Unselected enemies wait or play idle animations, simulating time-slicing.</p>
            </div>
            <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl flex gap-4 items-start">
               <div className="bg-slate-800 text-slate-400 font-mono text-sm w-6 h-6 flex items-center justify-center rounded-md shrink-0">4</div>
               <p className="text-sm text-slate-300 pt-0.5">Loop the cycle each frame. To simulate multiple processors grouping the scheduling into sub-steps (or assigning multiple "Cores") allows multiple enemies to act simultaneously within the frame.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function ExecutiveSummary() {
  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h2 className="text-3xl font-semibold tracking-tight text-white mb-2">Executive Summary</h2>
        <p className="text-lg text-slate-400 leading-relaxed font-light">
          Applying CPU scheduling paradigms to 2D survival AI architecture.
        </p>
      </div>
      <div className="prose prose-invert prose-slate max-w-none">
        <div className="bg-slate-950/50 border border-slate-800 rounded-2xl p-6 md:p-8 space-y-6 text-slate-300">
          <p>
            In a 2D survival game, enemy behavior can be driven by classic CPU scheduling strategies. 
            By treating enemy actions (spawn, pathfinding, attack) as processes, we can map 
            <strong className="text-white"> FCFS</strong>, <strong className="text-white"> RR</strong>, and <strong className="text-white"> HRRN</strong> to dictate enemy order and cadence.
          </p>
          <ul className="space-y-4 text-slate-300 mt-4 pl-0 list-none">
            <li className="flex gap-3 items-start">
              <CheckCircle2 className="mt-1 shrink-0 text-amber-400" size={18} />
              <div><strong className="text-white block">FCFS</strong> Spawns and executes behaviors in strict arrival order. Simple but can lead to convoys blocking action.</div>
            </li>
            <li className="flex gap-3 items-start">
               <CheckCircle2 className="mt-1 shrink-0 text-emerald-400" size={18} />
              <div><strong className="text-white block">Round-Robin (RR)</strong> Assigns a strict time-slice. Ensures fair distribution and high responsiveness.</div>
            </li>
            <li className="flex gap-3 items-start">
               <CheckCircle2 className="mt-1 shrink-0 text-indigo-400" size={18} />
              <div><strong className="text-white block">HRRN</strong> Balances starvation and threat by dynamic prioritization. Yields smart tactical AI.</div>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}

function Strategies() {
  return (
    <div className="space-y-8">
      <div className="space-y-2">
        <h2 className="text-3xl font-semibold tracking-tight text-white mb-2">Core Algorithms</h2>
        <p className="text-slate-400">Deep dive into CPU scheduling translates.</p>
      </div>
      {/* Snipped for brevity, reuse similar logic */}
      <div className="grid gap-6">
        <div className="p-6 rounded-2xl border border-rose-500/30 bg-rose-500/5">
          <h3 className="text-xl font-semibold text-rose-400 mb-2">FCFS (First-Come, First-Served)</h3>
          <p className="text-slate-300">Enemies are placed in a FIFO queue. The entity at the front finishes its entire attack cycle before yielding. Simple, but prone to blockage if animations are long.</p>
        </div>
        <div className="p-6 rounded-2xl border border-emerald-500/30 bg-emerald-500/5">
          <h3 className="text-xl font-semibold text-emerald-400 mb-2">Round-Robin (RR)</h3>
          <p className="text-slate-300">Every enemy receives a small time 'quantum'. Ensures fair flow and simultaneous swarm advancement, but adds state-switching overhead.</p>
        </div>
        <div className="p-6 rounded-2xl border border-indigo-500/30 bg-indigo-500/5">
          <h3 className="text-xl font-semibold text-indigo-400 mb-2">Highest-Response-Ratio-Next (HRRN)</h3>
          <p className="text-slate-300">Sorts execution by dynamic priority: <code>R = (Wait Time + Service Time) / Service Time</code>. Solves starvation while respecting enemy threat values.</p>
        </div>
      </div>
    </div>
  );
}

function ConceptualMapping() {
  return (
    <div className="space-y-8">
      <div className="space-y-2">
        <h2 className="text-3xl font-semibold tracking-tight text-white mb-2">Conceptual Mapping</h2>
      </div>
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
    <div className="bg-slate-950/50 border border-slate-800 rounded-xl p-5">
      <h3 className="text-lg font-bold text-white mb-4">{title}</h3>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-slate-300">
        <div><strong className="text-rose-400 block mb-1">FCFS:</strong>{fcfs}</div>
        <div><strong className="text-emerald-400 block mb-1">RR:</strong>{rr}</div>
        <div><strong className="text-indigo-400 block mb-1">HRRN:</strong>{hrrn}</div>
      </div>
    </div>
  );
}

function Architecture() {
  const chart = `
  flowchart TD
      classDef default fill:#0f172a,stroke:#334155,stroke-width:2px,color:#f8fafc;
      classDef active fill:#312e81,stroke:#6366f1,stroke-width:2px,color:#f8fafc;
      classDef action fill:#064e3b,stroke:#10b981,stroke-width:2px,color:#f8fafc;
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
      <div className="space-y-2">
        <h2 className="text-3xl font-semibold tracking-tight text-white mb-2">Scheduler Flowchart</h2>
      </div>
      <div className="bg-slate-950/50 border border-slate-800 rounded-2xl p-6 overflow-hidden">
        <Mermaid chart={chart} />
      </div>
    </div>
  );
}

function Balancing() {
  return (
    <div className="space-y-8">
      <div className="space-y-2">
        <h2 className="text-3xl font-semibold tracking-tight text-white mb-2">Concrete Mechanics & Balancing</h2>
        <p className="text-slate-400">Example parameters and formulas for live deployment.</p>
      </div>

      <div className="space-y-6 text-slate-300 leading-relaxed font-light text-[15px]">
        <div className="bg-slate-950/50 p-6 rounded-2xl border border-slate-800">
          <h3 className="text-lg font-semibold text-white mb-2 flex items-center gap-2">
             <div className="w-2 h-2 rounded-full bg-sky-400" /> Spawn Rates
          </h3>
          <p>
            Set a base spawn interval or wave delay <code className="bg-slate-800 px-1 py-0.5 rounded text-sky-300">T</code>. FCFS mode (easy) <code className="bg-slate-800 px-1 py-0.5 rounded text-sky-300">T=4s</code>, RR mode (normal) <code className="bg-slate-800 px-1 py-0.5 rounded text-sky-300">T=3s</code>, HRRN mode (hard) <code className="bg-slate-800 px-1 py-0.5 rounded text-sky-300">T=2s</code>.
          </p>
        </div>

        <div className="bg-slate-950/50 p-6 rounded-2xl border border-slate-800">
          <h3 className="text-lg font-semibold text-white mb-2 flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-emerald-400" /> Time Quantum (RR)
          </h3>
          <p>
            If using Round-Robin, pick a quantum. E.g. <code className="bg-slate-800 px-1 py-0.5 rounded text-emerald-300">0.5s</code> per enemy turn. A larger quantum makes enemies finish attacks uninterrupted; a very small quantum (0.1s) means highly interleaved and chaotic. Prototype value: 0.5s – 1.0s.
          </p>
        </div>

        <div className="bg-slate-950/50 p-6 rounded-2xl border border-slate-800">
          <h3 className="text-lg font-semibold text-white mb-2 flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-indigo-400" /> HRRN Priority & Threat Score
          </h3>
          <p className="mb-3">
            ResponseRatio = <code className="bg-slate-800 px-1 py-0.5 rounded text-amber-300">(W + S) / S</code>. Where W is Wait Time, and S is Service Time / Threat Measure.
          </p>
          <p className="mb-3">
            Assign base threat to enemy types: Fast weak enemy (Goblin) <code className="bg-slate-800 px-1 py-0.5 rounded text-amber-300">S=1</code>, slow tough enemy (Boss) <code className="bg-slate-800 px-1 py-0.5 rounded text-amber-300">S=5</code>. The formula favors weaker enemies that waited interrupting occasionally.
          </p>
          <p className="text-sm text-indigo-300 bg-indigo-500/10 p-3 rounded-lg border border-indigo-500/20">
            <strong>Example:</strong> Enemy A has W=10s, S=2s → R=6.0. Enemy B has W=2s, S=1s → R=3.0. Enemy A acts first.
          </p>
        </div>
      </div>

      <div className="pt-4">
        <h3 className="text-xl font-semibold tracking-tight text-white mb-4">Sample Parameter Table (Prototype)</h3>
        <div className="bg-slate-950/50 rounded-2xl border border-slate-800 overflow-hidden">
          <table className="w-full text-sm text-left">
            <thead className="bg-slate-900 text-slate-300 uppercase tracking-wider text-xs">
              <tr>
                <th className="px-6 py-4 font-semibold">Parameter</th>
                <th className="px-6 py-4 font-semibold text-rose-400">Easy (FCFS)</th>
                <th className="px-6 py-4 font-semibold text-emerald-400">Normal (RR)</th>
                <th className="px-6 py-4 font-semibold text-indigo-400">Hard (HRRN)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800 text-slate-300">
              <tr className="hover:bg-slate-800/30 transition-colors">
                <td className="px-6 py-4 font-medium text-white">Spawn Interval</td>
                <td className="px-6 py-4">4.0 s</td>
                <td className="px-6 py-4">3.0 s</td>
                <td className="px-6 py-4">2.0 s</td>
              </tr>
              <tr className="hover:bg-slate-800/30 transition-colors">
                <td className="px-6 py-4 font-medium text-white">RR Quantum</td>
                <td className="px-6 py-4 text-slate-500">N/A</td>
                <td className="px-6 py-4">0.5 s</td>
                <td className="px-6 py-4 text-slate-500">N/A</td>
              </tr>
              <tr className="hover:bg-slate-800/30 transition-colors">
                <td className="px-6 py-4 font-medium text-white">Threat (Service Time)</td>
                <td className="px-6 py-4">Uniform 1.0</td>
                <td className="px-6 py-4">Uniform 1.0</td>
                <td className="px-6 py-4 leading-relaxed">Goblin=1.0<br/>Ogre=3.0<br/>Boss=5.0</td>
              </tr>
              <tr className="hover:bg-slate-800/30 transition-colors">
                <td className="px-6 py-4 font-medium text-white">Initial Priority</td>
                <td className="px-6 py-4">FCFS queue order</td>
                <td className="px-6 py-4">RR queue order</td>
                <td className="px-6 py-4">Compute via (W+S)/S</td>
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
      <div className="space-y-2">
        <h2 className="text-3xl font-semibold tracking-tight text-white mb-2">Balancing Guidelines</h2>
        <p className="text-slate-400">Heuristics for creating fair, challenging, and tactical AI flow.</p>
      </div>

      <div className="space-y-6">
        <div className="bg-slate-950/50 p-6 rounded-2xl border border-slate-800">
          <h3 className="text-xl font-bold flex items-center gap-3 text-white mb-4">
             <span className="bg-sky-500/20 text-sky-400 p-2 rounded-lg"><Activity size={20} /></span>
             Difficulty Curve
          </h3>
          <p className="text-slate-300 font-light leading-relaxed mb-4">
             Scheduling directly affects perceived difficulty. Use retention/completion as indicators: if many players quit at a spawn wave, the scheduling might be too punishing. If players breeze through, the algorithm may be too lenient.
          </p>
          <ul className="space-y-3 text-slate-300 text-sm">
             <li className="flex gap-3"><div className="w-1.5 h-1.5 rounded-full bg-slate-600 mt-2 shrink-0" /><div><strong>FCFS:</strong> Tends to create bursts (one enemy hogging time), which can spike difficulty unpredictably.</div></li>
             <li className="flex gap-3"><div className="w-1.5 h-1.5 rounded-full bg-slate-600 mt-2 shrink-0" /><div><strong>Round-Robin:</strong> Distributes threat evenly, making a smoother and more consistent challenge.</div></li>
             <li className="flex gap-3"><div className="w-1.5 h-1.5 rounded-full bg-slate-600 mt-2 shrink-0" /><div><strong>HRRN:</strong> Adapts dynamically. Low-level enemies that waited long suddenly swarm, which players may find highly tactical.</div></li>
          </ul>
        </div>

        <div className="bg-slate-950/50 p-6 rounded-2xl border border-slate-800">
          <h3 className="text-xl font-bold flex items-center gap-3 text-white mb-4">
             <span className="bg-emerald-500/20 text-emerald-400 p-2 rounded-lg"><CheckCircle2 size={20} /></span>
             Fairness & Perceived Intelligence
          </h3>
          <p className="text-slate-300 font-light leading-relaxed mb-4">
             In game AI, fairness means not letting one enemy dominate unless intended. Players perceive HRRN-controlled enemies as more "intelligent" because the AI seems to adapt—for example, a wounded enemy suddenly gets its turn (similar to an “aggro” mechanic).
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-4">
             <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl text-center">
                <strong className="text-rose-400 block mb-2">FCFS</strong>
                <span className="text-sm text-slate-400">Can feel unfair if one target dominates and blocks others.</span>
             </div>
             <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl text-center">
                <strong className="text-emerald-400 block mb-2">Round-Robin</strong>
                <span className="text-sm text-slate-400">Innately fair. Every enemy hits in turn.</span>
             </div>
             <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl text-center">
                <strong className="text-indigo-400 block mb-2">HRRN</strong>
                <span className="text-sm text-slate-400">Prevents starvation by boosting waiting units.</span>
             </div>
          </div>
        </div>

        <div className="bg-slate-950/50 p-6 rounded-2xl border border-slate-800">
          <h3 className="text-xl font-bold flex items-center gap-3 text-white mb-4">
             <span className="bg-rose-500/20 text-rose-400 p-2 rounded-lg"><Sliders size={20} /></span>
             Tune Asymmetrically
          </h3>
          <p className="text-slate-300 font-light leading-relaxed mb-4">
            <strong className="text-white">HRRN:</strong> Requires choosing a good “service time” measure <code className="bg-slate-800 px-1 py-0.5 rounded text-amber-300">S</code>. Use common gameplay stats (attack speed, HP, DPS) to set S. If an enemy type is overlooked, try lowering its S to raise its overall priority.
          </p>
          <p className="text-slate-300 font-light leading-relaxed">
            <strong className="text-white">Round-Robin:</strong> Tuning means picking a quantum. Too large leads to FCFS-like behavior; too small makes the game feel jittery. <em className="text-slate-400 block mt-2 border-l-2 border-slate-700 pl-3">A good heuristic: a player’s single attack or dodge should fit into about one quantum to feel responsive.</em>
          </p>
        </div>
      </div>
    </div>
  );
}

function MixingPatterns() {
  return (
    <div className="space-y-8">
      <div className="space-y-2">
        <h2 className="text-3xl font-semibold tracking-tight text-white mb-2">Mixing Schedulers: Design Patterns</h2>
        <p className="text-slate-400">Instead of committing to one algorithm, combine them to enrich gameplay dynamics.</p>
      </div>

      <div className="space-y-6">
        <div className="bg-slate-950/50 p-6 rounded-2xl border border-slate-800">
          <h3 className="text-xl font-bold flex items-center gap-3 text-white mb-4">
            <span className="bg-emerald-500/20 text-emerald-400 p-2 rounded-lg"><Layers size={20} /></span>
            Difficulty Modes
          </h3>
          <ul className="space-y-4 text-slate-300 text-sm mb-4">
             <li><strong className="text-white">Easy/Story Mode (FCFS):</strong> Enemies come in simple waves; the first enemy must often be dealt with before the next fully engages. <br/><span className="text-slate-500 mt-1 block">Pros: Predictable AI. Cons: A single powerful enemy can stall everything.</span></li>
             <li><strong className="text-white">Normal Mode (Round-Robin):</strong> Enemies interleave turns, creating constant, steady pressure. <br/><span className="text-slate-500 mt-1 block">Pros: Smooth action, perceived fairness. Cons: Uniform pressure makes spike difficulty harder to implement.</span></li>
             <li><strong className="text-white">Hard Mode (HRRN):</strong> Enemy priority adapts mid-battle, causing older/waiting foes to jump in abruptly.<br/><span className="text-slate-500 mt-1 block">Pros: Emergent &quot;smart&quot; feel. Cons: High tuning complexity.</span></li>
          </ul>
        </div>

        <div className="bg-slate-950/50 p-6 rounded-2xl border border-slate-800">
          <h3 className="text-xl font-bold flex items-center gap-3 text-white mb-4">
            <span className="bg-indigo-500/20 text-indigo-400 p-2 rounded-lg"><BrainCircuit size={20} /></span>
            Per-Enemy-Type Schedulers
          </h3>
          <p className="text-slate-300 font-light leading-relaxed mb-4">
            Assign different scheduling per enemy class or zone to tailor AI behavior to enemy roles:
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
             <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl">
                <strong className="text-rose-400 block mb-2">Melee Mobs <span className="text-xs text-rose-500/70 border border-rose-500/20 py-0.5 px-1.5 rounded ml-1">FCFS</span></strong>
                <span className="text-sm text-slate-400">Charge the player in spawn order, acting one at a time.</span>
             </div>
             <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl">
                <strong className="text-emerald-400 block mb-2">Ranged <span className="text-xs text-emerald-500/70 border border-emerald-500/20 py-0.5 px-1.5 rounded ml-1">RR</span></strong>
                <span className="text-sm text-slate-400">Take turns firing shots in a cycle, maintaining constant fire.</span>
             </div>
             <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl">
                <strong className="text-indigo-400 block mb-2">Boss & Minions <span className="text-xs text-indigo-500/70 border border-indigo-500/20 py-0.5 px-1.5 rounded ml-1">HRRN</span></strong>
                <span className="text-sm text-slate-400">Alternates boss attacks and mob swarming dynamically.</span>
             </div>
          </div>
        </div>

        <div className="bg-slate-950/50 p-6 rounded-2xl border border-slate-800">
          <h3 className="text-xl font-bold flex items-center gap-3 text-white mb-4">
            <span className="bg-rose-500/20 text-rose-400 p-2 rounded-lg"><Activity size={20} /></span>
            Hybrid / Dynamic Switching
          </h3>
          <p className="text-slate-300 font-light leading-relaxed mb-4">
            Change scheduling on-the-fly based on game state, serving as an "AI Director".
          </p>
          <ul className="space-y-3 text-slate-300 text-sm">
             <li className="flex gap-3"><div className="w-1.5 h-1.5 rounded-full bg-slate-600 mt-2 shrink-0" /><div>Start a wave in FCFS (pick off weak foes), then mid-way switch to RR (sudden swarm pressure).</div></li>
             <li className="flex gap-3"><div className="w-1.5 h-1.5 rounded-full bg-slate-600 mt-2 shrink-0" /><div>Use RR by default. If an elite enemy spawns, temporarily switch that enemy to FCFS until defeated.</div></li>
             <li className="flex gap-3"><div className="w-1.5 h-1.5 rounded-full bg-slate-600 mt-2 shrink-0" /><div>Monitor performance: if clustered too densely, fallback to RR to calm things down.</div></li>
          </ul>
        </div>
      </div>
    </div>
  );
}

function Scenarios() {
  return (
    <div className="space-y-8">
      <div className="space-y-2">
        <h2 className="text-3xl font-semibold tracking-tight text-white mb-2">Sample Scenarios & Behaviors</h2>
        <p className="text-slate-400">Examples showing how emergent gameplay differs under each scheduler.</p>
      </div>

      <div className="space-y-6">
        <div className="bg-slate-950/50 p-6 rounded-2xl border border-slate-800">
          <h3 className="text-xl font-bold flex items-center gap-3 text-white mb-4">
             Three Goblins Arrive (1s attacks)
          </h3>
          <ul className="space-y-4 text-slate-300 text-sm">
             <li><strong className="text-rose-400">FCFS:</strong> Goblin 1 attacks repeatedly until dead, while others idle. Can be boring if the goblin has high HP.</li>
             <li><strong className="text-emerald-400">Round-Robin:</strong> Each goblin gets a turn every second. The player feels constant pressure of 3 sequential attacks per cycle, creating an "equal opportunity" fight.</li>
             <li><strong className="text-indigo-400">HRRN:</strong> Initially acts like FCFS. If one lives longer (waits more), its turn comes sooner the next cycle. Slowly shifts towards Round-Robin behavior for symmetrical units.</li>
          </ul>
        </div>

        <div className="bg-slate-950/50 p-6 rounded-2xl border border-slate-800">
          <h3 className="text-xl font-bold flex items-center gap-3 text-white mb-4">
             Boss (HP 30, 2s attack) & Two Minions (HP 5, 1s attack)
          </h3>
          <ul className="space-y-4 text-slate-300 text-sm">
             <li><strong className="text-rose-400">FCFS:</strong> Boss spawns first and attacks continuously. Can be very hard as the boss monopolizes the attack slots.</li>
             <li><strong className="text-emerald-400">Round-Robin:</strong> Boss attacks 2s, Minion1 1s, Boss 2s, Minion2 1s. Juggle constant pressure from both sources.</li>
             <li><strong className="text-indigo-400">HRRN:</strong> Minions build up Wait Time due to the boss's 2s Service Time. Eventually, their Response Ratio overrides the boss, causing them to jump in and get an extra hit occasionally.</li>
          </ul>
        </div>

        <div className="bg-slate-950/50 p-6 rounded-2xl border border-slate-800">
          <h3 className="text-xl font-bold flex items-center gap-3 text-white mb-4">
             Eight Enemies, Player on a Cliff
          </h3>
          <ul className="space-y-4 text-slate-300 text-sm">
             <li><strong className="text-rose-400">FCFS:</strong> Enemies pile up in a queue. If one enemy lags or blocks, the entire fight grinds to a halt.</li>
             <li><strong className="text-emerald-400">Round-Robin:</strong> 8 attacks cycle through rapidly. The player perceives a massive multi-hit rate.</li>
             <li><strong className="text-indigo-400">HRRN:</strong> Behaves like RR. If some get killed, the survivors wait longer and gain higher priority, filling the action gap smoothly.</li>
          </ul>
        </div>

        <div className="bg-slate-950/50 p-6 rounded-2xl border border-slate-800">
          <h3 className="text-xl font-bold flex items-center gap-3 text-white mb-4">
             Surprise Wave Mid-Boss
          </h3>
          <p className="text-slate-300 font-light leading-relaxed">
             As the boss's health drops, fodder spawn. Under <strong className="text-emerald-400">HRRN</strong>, these fodder enemies build Wait Time while the Boss executes long attacks. This leads to emergent peaks of tension—sudden spikes where HRRN schedules a rapid barrage of low-threat enemies all at once.
          </p>
        </div>
      </div>
    </div>
  );
}

function Metrics() {
  return (
    <div className="space-y-8">
      <div className="space-y-2">
        <h2 className="text-3xl font-semibold tracking-tight text-white mb-2">Balancing & Playtesting Metrics</h2>
        <p className="text-slate-400">Quantitative metrics and trade-offs for tuning AI scheduling.</p>
      </div>

      <div className="space-y-6">
        <div className="bg-slate-950/50 p-6 rounded-2xl border border-slate-800">
          <h3 className="text-xl font-bold flex items-center gap-3 text-white mb-4">
             Quantitative Tracking
          </h3>
          <ul className="space-y-4 text-slate-300 text-sm">
             <li><strong className="text-sky-400">Difficulty Curve & Player Flow:</strong> Track retention and completion per level. High death rates at specific waves indicate difficulty spikes. Adjust spawn rates or scheduler algorithms to smooth the curve.</li>
             <li><strong className="text-emerald-400">Fairness Metrics (Gini Coefficient):</strong> Measure hit or time-attacked distribution among enemies. A high Gini indicates unfairness (e.g., FCFS dominance). RR and HRRN lower the Gini by spreading the pressure.</li>
             <li><strong className="text-indigo-400">Perceived Intelligence:</strong> A/B test player perception. HRRN tends to surprise players (an enemy waiting long finally attacks), increasing perceived AI skill. FCFS feels "dumb", while RR feels methodical.</li>
          </ul>
        </div>

        <div className="pt-2">
          <h3 className="text-xl font-semibold tracking-tight text-white mb-4">Trade-offs Summary</h3>
          <div className="bg-slate-950/50 rounded-2xl border border-slate-800 overflow-hidden">
            <table className="w-full text-sm text-left">
              <thead className="bg-slate-900 text-slate-300 uppercase tracking-wider text-xs">
                <tr>
                  <th className="px-6 py-4 font-semibold">Criterion</th>
                  <th className="px-6 py-4 font-semibold text-rose-400">FCFS</th>
                  <th className="px-6 py-4 font-semibold text-emerald-400">Round Robin (RR)</th>
                  <th className="px-6 py-4 font-semibold text-indigo-400">HRRN</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800 text-slate-300">
                <tr className="hover:bg-slate-800/30 transition-colors">
                  <td className="px-6 py-4 font-medium text-white">Responsiveness</td>
                  <td className="px-6 py-4">Low (can stall)</td>
                  <td className="px-6 py-4">High (frequent turns)</td>
                  <td className="px-6 py-4">Medium (prevents extreme stall)</td>
                </tr>
                <tr className="hover:bg-slate-800/30 transition-colors">
                  <td className="px-6 py-4 font-medium text-white">Fairness</td>
                  <td className="px-6 py-4">Low (tasks block others)</td>
                  <td className="px-6 py-4">High (cyclic service)</td>
                  <td className="px-6 py-4">High (balances wait/service)</td>
                </tr>
                <tr className="hover:bg-slate-800/30 transition-colors">
                  <td className="px-6 py-4 font-medium text-white">Perceived "Smartness"</td>
                  <td className="px-6 py-4">Low (predictable)</td>
                  <td className="px-6 py-4">Medium (static pattern)</td>
                  <td className="px-6 py-4">High (dynamic priority)</td>
                </tr>
                <tr className="hover:bg-slate-800/30 transition-colors">
                  <td className="px-6 py-4 font-medium text-white">Complexity</td>
                  <td className="px-6 py-4">Very low (simple queue)</td>
                  <td className="px-6 py-4">Moderate (time-slicing)</td>
                  <td className="px-6 py-4">Higher (manage ratios)</td>
                </tr>
                <tr className="hover:bg-slate-800/30 transition-colors">
                  <td className="px-6 py-4 font-medium text-white">Tuning Difficulty</td>
                  <td className="px-6 py-4">None (spawn rate only)</td>
                  <td className="px-6 py-4">Medium (choose quantum)</td>
                  <td className="px-6 py-4">Medium-High (threat/service setup)</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

function Performance() {
  const chart = `
  flowchart LR
    classDef default fill:#0f172a,stroke:#334155,stroke-width:2px,color:#f8fafc;
    classDef action fill:#064e3b,stroke:#10b981,stroke-width:2px,color:#f8fafc;
    subgraph Scheduler
      A[New Spawn] --> Q[(Enemy Queue)]
      Q --> S{Scheduler Chooses}
      S -->|FCFS| X1[Oldest Enemy]
      S -->|RR| X2[Next Enemy]
      S -->|HRRN| X3[Highest Ratio]
      X1 --> Act[Perform Action]:::action
      X2 --> Act
      X3 --> Act
      Act --> Q
    end
  `;

  return (
    <div className="space-y-8">
      <div className="space-y-2">
        <h2 className="text-3xl font-semibold tracking-tight text-white mb-2">Performance & Optimization</h2>
        <p className="text-slate-400">Strategies to maintain frame rates under heavy scheduling loads (swarms).</p>
      </div>

      <div className="space-y-6">
        <div className="bg-slate-950/50 p-6 rounded-2xl border border-slate-800">
          <h3 className="text-xl font-bold flex items-center gap-3 text-white mb-4">
            <span className="bg-amber-500/20 text-amber-400 p-2 rounded-lg"><Zap size={20} /></span>
            Updating Many Enemies
          </h3>
          <ul className="space-y-4 text-slate-300 text-sm">
             <li><strong className="text-white">Cull Offscreen:</strong> Only schedule or update enemies in the player’s vicinity. Skip or freeze distant ones.</li>
             <li><strong className="text-white">Spawn on Demand:</strong> Use a scripted spawn queue. Create enemy objects just as they appear on-screen rather than keeping future enemies alive idly.</li>
             <li><strong className="text-white">Batch / Flow Movement:</strong> Group far-away enemies. Compute one path for a group (e.g., flow fields) or use an ECS (Entity Component System) to process entities rapidly.</li>
             <li><strong className="text-white">Time-Slicing:</strong> Instead of updating every enemy every frame, update only an <code className="bg-slate-800 px-1 py-0.5 rounded text-amber-300">N</code> slice per frame.</li>
          </ul>
        </div>

        <div className="bg-slate-950/50 p-6 rounded-2xl border border-slate-800">
          <h3 className="text-xl font-bold flex items-center gap-3 text-white mb-4">
             Algorithm Complexity
          </h3>
           <ul className="space-y-3 text-slate-300 text-sm">
             <li className="flex justify-between items-center border-b border-slate-800 pb-2">
                 <span className="text-rose-400 font-semibold">FCFS</span>
                 <code className="bg-slate-900 px-2 py-1 rounded text-slate-300">O(1)</code>
                 <span className="text-slate-500">per step (pop queue head)</span>
             </li>
             <li className="flex justify-between items-center border-b border-slate-800 pb-2">
                 <span className="text-emerald-400 font-semibold">Round-Robin</span>
                 <code className="bg-slate-900 px-2 py-1 rounded text-slate-300">O(1)</code>
                 <span className="text-slate-500">per step (move index)</span>
             </li>
             <li className="flex justify-between items-center pb-2">
                 <span className="text-indigo-400 font-semibold">HRRN</span>
                 <code className="bg-slate-900 px-2 py-1 rounded text-slate-300">O(n)</code>
                 <span className="text-slate-500">per selection (compute ratio)</span>
             </li>
          </ul>
          <p className="text-slate-400 text-xs mt-3 leading-relaxed">
             * If <code className="text-slate-300">n</code> gets very large, HRRN can become heavy. Optimize by using a priority heap or updating ratios only when necessary.
          </p>
        </div>

        <div className="bg-slate-950/50 border border-slate-800 rounded-2xl p-6 overflow-hidden">
          <Mermaid chart={chart} />
           <p className="text-slate-400 text-xs mt-4 leading-relaxed text-center">
             Enemy spawns are queued. Each loop, the Scheduler selects one enemy (FCFS: oldest, RR: next in rotation, HRRN: highest ratio). That enemy acts, then yields back.
           </p>
        </div>
      </div>
    </div>
  );
}
