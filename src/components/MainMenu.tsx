import React from 'react';
import { cn } from '../lib/utils';
import { MenuBackground } from './MenuBackground';

const MenuButton = ({ 
  className, 
  onClick, 
  title, 
  locked = false,
  spriteIndex = 0
}: { 
  className?: string, 
  onClick?: () => void, 
  title: string, 
  locked?: boolean,
  spriteIndex?: number
}) => {
  // 4 buttons vertically stacked in Buttons.png
  // percentages for 4 items: 0%, 33.333%, 66.666%, 100%
  const bgPosY = spriteIndex * 33.3333;

  return (
    <button
      onClick={!locked ? onClick : undefined}
      className={cn(
        "relative group transition-all duration-200",
        "w-[160px] h-[40px] sm:w-[240px] sm:h-[60px] md:w-[300px] md:h-[75px]", // Auto-responsive sizing based on screen
        locked ? "cursor-not-allowed opacity-50 grayscale" : "cursor-pointer hover:scale-105 active:scale-95 hover:brightness-110 drop-shadow-xl",
        className
      )}
      title={title}
      aria-label={title}
    >
      <div 
        className="absolute inset-0 bg-no-repeat bg-[length:100%_400%]"
        style={{ 
          backgroundImage: 'url(/assets/Buttons.png)',
          backgroundPosition: `0% ${bgPosY}%`,
          imageRendering: 'pixelated'
        }}
      />
      
      {locked && (
         <div className="absolute inset-0 flex items-center justify-center bg-black/50">
           <span className="text-sm font-mono text-white tracking-widest px-2 py-1 bg-red-950 border-2 border-red-600 shadow-[2px_2px_0px_#7f1d1d]">LOCKED</span>
         </div>
      )}
    </button>
  );
};

export function MainMenu({ onStartGame, onShowReport, onShowModes, onShowShop }: { onStartGame: () => void, onShowReport: () => void, onShowModes?: () => void, onShowShop?: () => void }) {
  return (
    <div className="absolute inset-0 w-full h-full bg-slate-950 overflow-hidden">
      <div className="relative w-full h-full">
        {/* Procedural Animated Background */}
        <MenuBackground />
        
        {/* Buttons UI Overlay */}
        <div className="absolute bottom-[10%] left-[5%] md:left-[8%] flex flex-col justify-end gap-3 md:gap-4 z-10 drop-shadow-2xl">
          
          <MenuButton 
            onClick={onStartGame} 
            title="Start Game"
            spriteIndex={0}
          />
          
          <MenuButton 
            onClick={onShowShop}
            title="Armory"
            spriteIndex={1}
          />

          <MenuButton 
            onClick={onShowModes}
            title="Galaxy"
            spriteIndex={2}
          />

          {/* Map settings button to report view for now, or you can implement actual settings */}
          <MenuButton 
            onClick={onShowReport} 
            title="Settings"
            spriteIndex={3}
          />

        </div>
      </div>
    </div>
  );
}
