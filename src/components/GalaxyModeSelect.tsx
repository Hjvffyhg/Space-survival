import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { ArrowLeft, Lock, Star, Globe2, Crosshair } from 'lucide-react';
import { cn } from '../lib/utils';

interface GalaxyModeSelectProps {
  onBack: () => void;
  onSelectMode: (mode: number) => void;
}

const MODES = [
  { level: 0, title: "Type 0", subtitle: "Terrestrial", req: 0, desc: "Standard combat. Learn the basics of survival.", threat: 1 },
  { level: 1, title: "Type 1", subtitle: "Planetary", req: 5000, desc: "Harness a planet's energy. Faster enemies, more asteroids.", threat: 2 },
  { level: 2, title: "Type 2", subtitle: "Stellar", req: 15000, desc: "Dyson Sphere construction zone. Extreme asteroid density.", threat: 3 },
  { level: 3, title: "Type 3", subtitle: "Galactic", req: 30000, desc: "Control the galaxy. Bosses spawn more frequently.", threat: 3 },
  { level: 4, title: "Type 4", subtitle: "Universal", req: 50000, desc: "Mastery of the universe. Constant elite enemy spawns.", threat: 4 },
  { level: 5, title: "Type 5", subtitle: "Multiversal", req: 75000, desc: "Traverse realities. Unpredictable enemy variations.", threat: 4 },
  { level: 6, title: "Type 6", subtitle: "Omniversal", req: 100000, desc: "Control over timeline and space. The ultimate challenge.", threat: 5 },
  { level: 7, title: "Type 7", subtitle: "God Tier", req: 200000, desc: "Creator of realities. Endless hellfire.", threat: 5 }
];

export function GalaxyModeSelect({ onBack, onSelectMode }: GalaxyModeSelectProps) {
  const [highScore, setHighScore] = useState(0);

  useEffect(() => {
    const saved = localStorage.getItem('maxScore');
    if (saved) setHighScore(parseInt(saved, 10));
  }, []);

  return (
    <div className="absolute inset-0 bg-[#020617] flex flex-col p-4 pt-12 md:p-8 font-sans h-full overflow-y-auto custom-scrollbar">
      {/* Background Holographic Grid Effect */}
      <div className="absolute inset-0 z-0 opacity-10 pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle at center, #38bdf8 0%, transparent 60%), linear-gradient(rgba(56,189,248,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(56,189,248,0.1) 1px, transparent 1px)', backgroundSize: '100% 100%, 60px 60px, 60px 60px' }} />
      
      <button 
        onClick={onBack}
        className="relative z-10 flex items-center gap-2 px-4 py-2 bg-slate-900 border border-cyan-900/50 hover:border-cyan-500 text-cyan-500 hover:text-cyan-300 transition-all font-mono text-xs tracking-widest uppercase mb-6 md:mb-8 w-max"
        style={{ clipPath: 'polygon(10% 0, 100% 0, 90% 100%, 0% 100%)' }}
      >
        <ArrowLeft size={16} /> Command Interface
      </button>

      <div className="relative z-10 text-center mb-8 md:mb-12 flex flex-col items-center">
        <div className="flex items-center gap-3 justify-center mb-2">
            <Crosshair className="text-cyan-400 animate-[spin_10s_linear_infinite]" size={28} />
            <h1 className="text-3xl md:text-5xl font-black tracking-[0.3em] text-white uppercase font-mono drop-shadow-[0_0_15px_rgba(6,182,212,0.5)]">
                TACTICAL STARCHART
            </h1>
            <Crosshair className="text-cyan-400 animate-[spin_10s_linear_infinite_reverse]" size={28} />
        </div>
        <div className="bg-slate-900/80 border border-cyan-900/50 px-6 py-2 mt-2 inline-block backdrop-blur-sm" style={{ clipPath: 'polygon(5% 0, 95% 0, 100% 100%, 0 100%)' }}>
            <p className="text-xs md:text-sm text-cyan-400 font-mono tracking-widest uppercase">Max Historical Combat Score: <span className="text-white font-bold">{highScore.toLocaleString()}</span></p>
        </div>
        <p className="text-[10px] text-slate-500 mt-4 max-w-xl mx-auto font-mono uppercase tracking-[0.2em] border-t border-slate-800 pt-4">
            Authorize deployment to advanced Kardashev Scale sectors by meeting minimum threat mitigation requirements.
        </p>
      </div>

      <div className="relative z-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl mx-auto w-full pb-10">
        {MODES.map((mode, idx) => {
          const unlocked = highScore >= mode.req;
          return (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.05 }}
              key={mode.level}
              onClick={() => unlocked && onSelectMode(mode.level)}
              className={cn(
                "relative p-6 border flex flex-col transition-all duration-300 backdrop-blur-md group",
                unlocked 
                  ? "border-cyan-900/50 bg-slate-900/60 hover:border-cyan-400 hover:bg-cyan-950/40 cursor-pointer hover:-translate-y-1 hover:shadow-[0_0_25px_rgba(6,182,212,0.2)]"
                  : "border-rose-900/30 bg-slate-950/80 cursor-not-allowed opacity-80"
              )}
              style={{ clipPath: 'polygon(10% 0, 100% 0, 100% 90%, 90% 100%, 0 100%, 0 10%)' }}
            >
              {/* Corner Deco */}
              {unlocked && <div className="absolute top-0 right-0 w-8 h-8 bg-cyan-500/20 transition-colors group-hover:bg-cyan-400/40" style={{ clipPath: 'polygon(100% 0, 0 0, 100% 100%)' }}></div>}
              {!unlocked && <div className="absolute top-0 right-0 w-8 h-8 bg-rose-500/10" style={{ clipPath: 'polygon(100% 0, 0 0, 100% 100%)' }}></div>}

              {!unlocked && (
                <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-[1px] z-20 flex flex-col items-center justify-center">
                  <div className="border border-rose-500/50 bg-rose-950/50 p-4 flex flex-col items-center" style={{ clipPath: 'polygon(20% 0, 80% 0, 100% 20%, 100% 80%, 80% 100%, 20% 100%, 0 80%, 0 20%)' }}>
                      <Lock size={24} className="text-rose-500 mb-2" />
                      <div className="text-[10px] font-mono text-rose-300 uppercase tracking-widest font-bold">Encrypted</div>
                      <div className="text-[10px] font-mono text-slate-400 mt-1">REQ: {mode.req.toLocaleString()}</div>
                  </div>
                </div>
              )}

              <div className="flex justify-between items-start mb-5">
                <div className={`w-10 h-10 border flex items-center justify-center transition-colors ${unlocked ? 'border-cyan-500/50 bg-cyan-950/50 group-hover:bg-cyan-500/20' : 'border-slate-800 bg-slate-950'}`} style={{ clipPath: 'polygon(30% 0, 70% 0, 100% 30%, 100% 70%, 70% 100%, 30% 100%, 0 70%, 0 30%)' }}>
                  <Globe2 size={20} className={unlocked ? "text-cyan-400" : "text-slate-600"} />
                </div>
                <div className="text-right">
                  <div className={`text-[10px] font-mono font-bold tracking-widest ${unlocked ? 'text-cyan-500' : 'text-slate-600'}`}>TYPE {mode.level}</div>
                  <div className="text-[9px] font-mono text-slate-500 tracking-[0.2em] uppercase">Sector</div>
                </div>
              </div>

              <h3 className={`text-xl font-bold font-mono tracking-wider uppercase mb-2 ${unlocked ? 'text-white' : 'text-slate-500'}`}>{mode.subtitle}</h3>
              <p className="text-xs text-slate-400 flex-grow leading-relaxed font-mono border-l-2 border-slate-800 pl-3">{mode.desc}</p>

              <div className="mt-6 pt-4 border-t border-slate-800/50 flex flex-col gap-2">
                <div className="flex items-center justify-between">
                    <span className="text-[9px] text-slate-500 font-mono tracking-[0.2em] uppercase">Threat Class</span>
                    <div className="flex gap-1">
                    {Array.from({ length: 5 }).map((_, i) => (
                        <div 
                            key={i} 
                            className={`w-3 h-3 ${i < mode.threat ? (unlocked ? 'bg-rose-500 shadow-[0_0_5px_rgba(244,63,94,0.5)]' : 'bg-rose-900/30') : 'bg-slate-800/50'}`} 
                            style={{ clipPath: 'polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)' }}
                        />
                    ))}
                    </div>
                </div>
                {unlocked && (
                    <div className="w-full text-center mt-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <span className="text-[10px] font-mono font-bold text-cyan-400 bg-cyan-950/50 px-4 py-1 border border-cyan-500/30 tracking-widest uppercase">Initiate Jump</span>
                    </div>
                )}
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
