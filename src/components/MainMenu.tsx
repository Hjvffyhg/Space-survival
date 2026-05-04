import React from 'react';
import { cn } from '../lib/utils';

const MenuButton = ({ 
  className, 
  onClick, 
  title, 
  locked = false,
  color = 'cyan'
}: { 
  className?: string, 
  onClick?: () => void, 
  title: string, 
  locked?: boolean,
  color?: 'cyan' | 'indigo' | 'rose'
}) => {
  const colors = {
    cyan: {
      shadow: 'hover:shadow-[0_0_20px_rgba(0,217,255,0.4)]',
      border: 'group-hover:border-[#00D9FF]/60',
      accent: 'group-hover:border-[#00D9FF]',
      glow: 'via-[#00D9FF]/40',
      bgHover: 'hover:bg-[#00D9FF]/10'
    },
    indigo: {
      shadow: 'hover:shadow-[0_0_20px_rgba(99,102,241,0.4)]',
      border: 'group-hover:border-indigo-500/60',
      accent: 'group-hover:border-indigo-400',
      glow: 'via-indigo-500/40',
      bgHover: 'hover:bg-indigo-500/10'
    },
    rose: {
      shadow: 'hover:shadow-[0_0_20px_rgba(244,63,94,0.4)]',
      border: 'group-hover:border-rose-500/60',
      accent: 'group-hover:border-rose-400',
      glow: 'via-rose-500/40',
      bgHover: 'hover:bg-rose-500/10'
    }
  };

  const c = colors[color];

  return (
    <button
      onClick={!locked ? onClick : undefined}
      className={cn(
        "absolute group overflow-hidden transition-all duration-300 rounded",
        className,
        locked ? "cursor-not-allowed" : `cursor-pointer ${c.shadow} hover:scale-[1.01] active:scale-[0.99] ${c.bgHover}`
      )}
      title={title}
      aria-label={title}
    >
      {!locked && (
         <>
           {/* Scanline Gradient */}
           <div className={cn("absolute inset-0 bg-gradient-to-r from-transparent to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000 ease-in-out", c.glow)} />
           
           {/* Border box */}
           <div className={cn("absolute inset-0 border border-transparent transition-colors duration-300 rounded", c.border)} />
           
           {/* Sci-fi corner brackets */}
           <div className={cn("absolute top-0 left-0 w-3 h-3 border-t-2 border-l-2 border-transparent transition-all duration-300 -translate-x-2 -translate-y-2 opacity-0 group-hover:opacity-100 group-hover:translate-x-0 group-hover:translate-y-0", c.accent)} />
           <div className={cn("absolute top-0 right-0 w-3 h-3 border-t-2 border-r-2 border-transparent transition-all duration-300 translate-x-2 -translate-y-2 opacity-0 group-hover:opacity-100 group-hover:translate-x-0 group-hover:translate-y-0", c.accent)} />
           <div className={cn("absolute bottom-0 left-0 w-3 h-3 border-b-2 border-l-2 border-transparent transition-all duration-300 -translate-x-2 translate-y-2 opacity-0 group-hover:opacity-100 group-hover:translate-x-0 group-hover:translate-y-0", c.accent)} />
           <div className={cn("absolute bottom-0 right-0 w-3 h-3 border-b-2 border-r-2 border-transparent transition-all duration-300 translate-x-2 translate-y-2 opacity-0 group-hover:opacity-100 group-hover:translate-x-0 group-hover:translate-y-0", c.accent)} />
         </>
      )}
      {locked && (
         <div className="absolute inset-0 border border-transparent hover:border-slate-500/30 rounded transition-colors bg-slate-900/40 opacity-0 hover:opacity-100 flex items-center justify-center backdrop-blur-[1px]">
           <span className="text-[10px] font-mono text-slate-400/80 tracking-widest px-2 py-1 bg-slate-900/80 rounded border border-slate-700/50">LOCKED</span>
         </div>
      )}
    </button>
  );
};

export function MainMenu({ onStartGame, onShowReport, onShowModes, onShowShop }: { onStartGame: () => void, onShowReport: () => void, onShowModes?: () => void, onShowShop?: () => void }) {
  return (
    <div className="absolute inset-0 w-full h-full bg-slate-950 overflow-hidden">
      <div className="relative w-full h-full">
        <img 
          src="/assets/newMainmenu.png" 
          alt="Survival Menu" 
          className="w-full h-full object-fill block"
        />
        
        {/* Invisible Image Map Overlays with Sci-Fi Effects */}
        <MenuButton 
          onClick={onStartGame} 
          className="left-[35%] top-[31.5%] w-[30%] h-[7%]"
          title="Start Game"
          color="cyan"
        />
        
        <MenuButton 
          onClick={onShowModes}
          className="left-[35%] top-[39.5%] w-[30%] h-[7%]"
          title="Game Modes"
          color="indigo"
        />

        <MenuButton 
          onClick={onShowShop}
          className="left-[35%] top-[47.5%] w-[30%] h-[7%]"
          title="Upgrades / Shop"
          color="cyan"
        />

        {/* We map "Read Report" to "HOW TO PLAY" */}
        <MenuButton 
          onClick={onShowReport} 
          className="left-[35%] top-[55.5%] w-[30%] h-[7%]"
          title="How to Play"
          color="indigo"
        />

        <MenuButton 
          className="left-[35%] top-[63.5%] w-[30%] h-[7%]"
          title="Leaderboards"
          locked
        />

        <MenuButton 
          className="left-[35%] top-[71.5%] w-[30%] h-[7%]"
          title="Exit Game"
          locked
        />
      </div>
    </div>
  );
}
