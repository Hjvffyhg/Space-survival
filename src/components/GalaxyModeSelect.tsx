import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { ArrowLeft, Lock, Star, Globe2 } from 'lucide-react';
import { cn } from '../lib/utils';

interface GalaxyModeSelectProps {
  onBack: () => void;
  onSelectMode: (mode: number) => void;
}

const MODES = [
  { level: 0, title: "Type 0", subtitle: "Terrestrial", req: 0, desc: "Standard combat. Learn the basics of survival." },
  { level: 1, title: "Type 1", subtitle: "Planetary", req: 5000, desc: "Harness a planet's energy. Faster enemies, more asteroids." },
  { level: 2, title: "Type 2", subtitle: "Stellar", req: 15000, desc: "Dyson Sphere construction zone. Extreme asteroid density." },
  { level: 3, title: "Type 3", subtitle: "Galactic", req: 30000, desc: "Control the galaxy. Bosses spawn more frequently." },
  { level: 4, title: "Type 4", subtitle: "Universal", req: 50000, desc: "Mastery of the universe. Constant elite enemy spawns." },
  { level: 5, title: "Type 5", subtitle: "Multiversal", req: 75000, desc: "Traverse realities. Unpredictable enemy variations." },
  { level: 6, title: "Type 6", subtitle: "Omniversal", req: 100000, desc: "Control over timeline and space. The ultimate challenge." },
  { level: 7, title: "Type 7", subtitle: "God Tier", req: 200000, desc: "Creator of realities. Endless hellfire." }
];

export function GalaxyModeSelect({ onBack, onSelectMode }: GalaxyModeSelectProps) {
  const [highScore, setHighScore] = useState(0);

  useEffect(() => {
    const saved = localStorage.getItem('maxScore');
    if (saved) setHighScore(parseInt(saved, 10));
  }, []);

  return (
    <div className="absolute inset-0 bg-slate-950 flex flex-col p-4 pt-12 md:p-8 text-white h-full overflow-y-auto">
      {/* Background stars effect */}
      <div className="absolute inset-0 z-0 opacity-20 pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle at center, #1e293b 0%, #020617 100%)' }} />
      
      <button 
        onClick={onBack}
        className="relative z-10 flex items-center gap-2 text-slate-400 hover:text-white transition-colors mb-4 md:mb-8 w-max text-sm md:text-base border border-slate-800 md:border-transparent bg-slate-900 md:bg-transparent px-3 py-2 md:px-0 md:py-0 rounded-lg md:rounded-none"
      >
        <ArrowLeft size={20} /> Back to Menu
      </button>

      <div className="relative z-10 text-center mb-8 md:mb-12">
        <h1 className="text-2xl md:text-4xl font-bold tracking-widest text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-indigo-400 uppercase">
          Galaxy Modes
        </h1>
        <p className="text-sm md:text-base text-slate-400 mt-2 font-mono">Current High Score: <span className="text-indigo-400">{highScore}</span></p>
        <p className="text-xs md:text-sm text-slate-500 mt-1 max-w-sm md:max-w-none mx-auto">Unlock new Kardashev Scale civilization modes by reaching score requirements.</p>
      </div>

      <div className="relative z-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 max-w-7xl mx-auto w-full pb-10">
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
                "relative p-6 rounded-2xl border flex flex-col transition-all duration-300",
                unlocked 
                  ? "border-slate-700 bg-slate-900 hover:border-cyan-500/50 hover:bg-slate-800 cursor-pointer hover:-translate-y-1 hover:shadow-[0_0_30px_rgba(34,211,238,0.15)]"
                  : "border-slate-800/50 bg-slate-950/50 cursor-not-allowed grayscale opacity-60"
              )}
            >
              {!unlocked && (
                <div className="absolute inset-0 bg-slate-950/40 backdrop-blur-[2px] z-20 flex flex-col items-center justify-center rounded-2xl">
                  <Lock size={32} className="text-slate-500 mb-2" />
                  <div className="text-xs font-mono text-slate-400 uppercase tracking-widest">Requires Code {mode.req}</div>
                </div>
              )}

              <div className="flex justify-between items-start mb-4">
                <div className="w-12 h-12 rounded-full bg-slate-950 border border-slate-800 flex items-center justify-center">
                  <Globe2 size={24} className={unlocked ? "text-cyan-400" : "text-slate-600"} />
                </div>
                <div className="text-right">
                  <div className="text-sm font-bold text-slate-500">TYPE {mode.level}</div>
                  <div className="text-xs font-mono text-slate-600">CIVILIZATION</div>
                </div>
              </div>

              <h3 className="text-xl font-bold text-slate-100 mb-1">{mode.subtitle}</h3>
              <p className="text-sm text-slate-400 flex-grow leading-relaxed">{mode.desc}</p>

              <div className="mt-6 pt-4 border-t border-slate-800 flex items-center justify-between">
                <span className="text-xs text-slate-500 font-mono tracking-wider">THREAT LEVEL</span>
                <div className="flex gap-1">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star 
                      key={i} 
                      size={12} 
                      className={i < Math.ceil((mode.level + 1) / 1.6) ? "text-rose-500 fill-rose-500" : "text-slate-800"} 
                    />
                  ))}
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
