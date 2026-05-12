import React, { useState, useEffect } from 'react';
import { ArrowLeft, Shield, Zap, Wind, Lock } from 'lucide-react';
import { ShipName } from '../lib/voidFleet';
import { soundManager } from '../lib/audio';

const SHIPS: { id: ShipName; name: string; cost: number; desc: string; stats: { hp: number, speed: string, type: string } }[] = [
  { id: 'Fighter', name: 'Fighter', cost: 0, desc: 'Standard issue all-rounder.', stats: { hp: 100, speed: 'Normal', type: 'Balanced' } },
  { id: 'Scout', name: 'Scout', cost: 2000, desc: 'High speed, fragile hull. Hit and run tactics.', stats: { hp: 70, speed: 'Very Fast', type: 'Agility' } },
  { id: 'Bomber', name: 'Bomber', cost: 5000, desc: 'Heavy armor, low speed. Payload specialist.', stats: { hp: 180, speed: 'Slow', type: 'Tank' } },
  { id: 'Frigate', name: 'Frigate', cost: 12000, desc: 'Advanced military vessel. Superior shields.', stats: { hp: 250, speed: 'Normal', type: 'Balanced' } },
  { id: 'Battlecruiser', name: 'Battlecruiser', cost: 30000, desc: 'Massive capital ship. Slow but devastating.', stats: { hp: 400, speed: 'Very Slow', type: 'Juggernaut' } },
];

const UPGRADES = [
  { id: 'hp', name: 'Hull Reinforcement', icon: Shield, desc: '+20 Max HP per level', maxLevel: 10, baseCost: 500, costMult: 1.5, color: 'cyan' },
  { id: 'dmg', name: 'Weapon Overclock', icon: Zap, desc: '+20% Damage per level', maxLevel: 10, baseCost: 1000, costMult: 1.8, color: 'rose' },
  { id: 'speed', name: 'Advanced Thrusters', icon: Wind, desc: '+10% Speed per level', maxLevel: 5, baseCost: 800, costMult: 1.4, color: 'amber' },
];

export function ShopScreen({ onBack }: { onBack: () => void }) {
  const [credits, setCredits] = useState(0);
  const [unlocked, setUnlocked] = useState<string[]>(['Fighter']);
  const [selected, setSelected] = useState<ShipName>('Fighter');
  const [upgrades, setUpgrades] = useState<Record<string, number>>({ hp: 0, dmg: 0, speed: 0 });

  useEffect(() => {
    setCredits(parseInt(localStorage.getItem('credits') || '0', 10));
    setUnlocked(JSON.parse(localStorage.getItem('unlockedShips') || '["Fighter"]'));
    setSelected((localStorage.getItem('selectedShip') as ShipName) || 'Fighter');
    setUpgrades(JSON.parse(localStorage.getItem('upgrades') || '{"hp":0,"dmg":0,"speed":0}'));
  }, []);

  const saveState = (c: number, u: string[], s: ShipName, up: Record<string, number>) => {
    localStorage.setItem('credits', c.toString());
    localStorage.setItem('unlockedShips', JSON.stringify(u));
    localStorage.setItem('selectedShip', s);
    localStorage.setItem('upgrades', JSON.stringify(up));
    setCredits(c);
    setUnlocked(u);
    setSelected(s);
    setUpgrades(up);
  };

  const handleBuyShip = (ship: typeof SHIPS[0]) => {
    if (unlocked.includes(ship.id)) {
      saveState(credits, unlocked, ship.id, upgrades);
      soundManager.playUISelect();
    } else if (credits >= ship.cost) {
      const newU = [...unlocked, ship.id];
      saveState(credits - ship.cost, newU, ship.id, upgrades);
      soundManager.playPowerup();
    } else {
      (soundManager as any).playError?.() || soundManager.playTakeDamage();
    }
  };

  const handleBuyUpgrade = (upg: typeof UPGRADES[0]) => {
    const lvl = upgrades[upg.id] || 0;
    if (lvl >= upg.maxLevel) return;
    const cost = Math.floor(upg.baseCost * Math.pow(upg.costMult, lvl));
    if (credits >= cost) {
      const newUp = { ...upgrades, [upg.id]: lvl + 1 };
      saveState(credits - cost, unlocked, selected, newUp);
      soundManager.playCollect('weapon');
    } else {
      (soundManager as any).playError?.() || soundManager.playTakeDamage();
    }
  };

  return (
    <div className="absolute inset-0 w-full h-full bg-[#020617] overflow-hidden flex flex-col font-sans">
      {/* Background Grid */}
      <div className="absolute inset-0 pointer-events-none opacity-10 bg-[linear-gradient(rgba(6,182,212,0.2)_1px,transparent_1px),linear-gradient(90deg,rgba(6,182,212,0.2)_1px,transparent_1px)] bg-[size:40px_40px] z-0"></div>
      <div className="absolute inset-0 pointer-events-none opacity-20 bg-[radial-gradient(circle_at_center,_transparent_0%,_#020617_100%)] z-0"></div>

      {/* Header Area */}
      <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-end p-6 md:p-8 md:pt-12 border-b border-cyan-900/50 bg-slate-950/80 backdrop-blur-md shadow-[0_10px_30px_rgba(6,182,212,0.05)]">
        
        <div className="flex flex-col gap-4">
          <button 
            onClick={onBack}
            className="flex items-center gap-2 px-4 py-2 bg-slate-900 border border-cyan-900/50 hover:border-cyan-500 text-cyan-500 hover:text-cyan-300 transition-all font-mono text-xs tracking-widest uppercase w-max"
            style={{ clipPath: 'polygon(10% 0, 100% 0, 90% 100%, 0% 100%)' }}
          >
            <ArrowLeft size={14} /> Exit Hangar
          </button>
          
          <div>
            <div className="flex items-center gap-3">
              <div className="w-3 h-3 bg-cyan-500 animate-pulse"></div>
              <h1 className="text-3xl md:text-5xl font-black text-white tracking-[0.2em] uppercase font-mono drop-shadow-[0_0_15px_rgba(6,182,212,0.5)]">
                PROTOTYPE HANGAR
              </h1>
            </div>
            <p className="text-cyan-500/70 font-mono text-sm tracking-widest mt-1 ml-6">EARTH DEFENSE INITIATIVE // ENGINEERING BAY</p>
          </div>
        </div>

        {/* Currency Databank */}
        <div className="mt-6 md:mt-0 bg-slate-900/80 px-6 py-3 border border-amber-500/30 w-full md:w-auto flex flex-col items-start md:items-end relative overflow-hidden" style={{ clipPath: 'polygon(5% 0, 100% 0, 100% 100%, 0 100%)' }}>
          <div className="absolute top-0 right-0 w-8 h-8 bg-amber-500/10" style={{ clipPath: 'polygon(100% 0, 0 0, 100% 100%)' }}></div>
          <div className="text-[10px] text-amber-500 font-bold tracking-[0.3em] uppercase mb-1">Available Resources</div>
          <div className="text-2xl md:text-3xl font-mono font-bold text-amber-400 drop-shadow-[0_0_10px_rgba(245,158,11,0.5)]">
            {credits.toLocaleString()} <span className="text-sm text-amber-500/70">CTR</span>
          </div>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-6 p-6 md:p-8 flex-1 min-h-0 overflow-y-auto custom-scrollbar">
        
        {/* SHIPS PANEL */}
        <div className="flex flex-col gap-4">
          <div className="flex items-center gap-2 border-b border-cyan-900/50 pb-2">
            <span className="text-xs font-mono font-bold text-cyan-500 tracking-widest uppercase">Select Chassis</span>
          </div>
          
          {SHIPS.map(ship => {
            const isUnlocked = unlocked.includes(ship.id);
            const isSelected = selected === ship.id;
            
            return (
              <div 
                key={ship.id}
                className={`relative p-5 transition-all duration-300 backdrop-blur-md ${isSelected ? 'bg-cyan-950/30 border border-cyan-400 shadow-[0_0_20px_rgba(6,182,212,0.15)]' : isUnlocked ? 'bg-slate-900/60 border border-slate-700 hover:border-cyan-500/50' : 'bg-slate-950/80 border border-slate-800 opacity-80'}`}
                style={{ clipPath: 'polygon(0 0, 97% 0, 100% 10%, 100% 100%, 3% 100%, 0 90%)' }}
              >
                {/* Decorative Tech Elements */}
                {isSelected && <div className="absolute top-0 left-0 w-1 h-full bg-cyan-400 shadow-[0_0_10px_#22d3ee]"></div>}
                <div className="absolute top-2 right-2 text-[8px] font-mono text-slate-600 tracking-widest">ID:{ship.id.toUpperCase()}</div>

                <div className="flex justify-between items-start mb-3">
                  <h3 className={`text-xl font-mono font-bold flex items-center gap-3 tracking-widest uppercase ${isSelected ? 'text-white' : 'text-slate-300'}`}>
                    {ship.name}
                    {!isUnlocked && <Lock size={14} className="text-rose-500" />}
                    {isSelected && <span className="text-[10px] bg-cyan-500/20 text-cyan-300 border border-cyan-500/50 px-2 py-0.5 tracking-widest uppercase">Active</span>}
                  </h3>
                  {!isUnlocked && (
                    <div className="font-mono text-rose-400 font-bold text-sm tracking-widest">{ship.cost.toLocaleString()} CTR</div>
                  )}
                </div>
                
                <p className="text-slate-400 text-xs font-mono mb-4 border-l-2 border-slate-700 pl-3">{ship.desc}</p>
                
                <div className="grid grid-cols-3 gap-3 mb-5 text-[10px] font-mono tracking-widest uppercase">
                  <div className="bg-slate-950/50 p-2 border border-slate-800/50">
                    <span className="text-slate-500 block mb-1">Base HP</span>
                    <span className="text-cyan-400 text-sm font-bold">{ship.stats.hp}</span>
                  </div>
                  <div className="bg-slate-950/50 p-2 border border-slate-800/50">
                    <span className="text-slate-500 block mb-1">Speed</span>
                    <span className="text-amber-400 text-sm font-bold">{ship.stats.speed}</span>
                  </div>
                  <div className="bg-slate-950/50 p-2 border border-slate-800/50">
                    <span className="text-slate-500 block mb-1">Class</span>
                    <span className="text-rose-400 text-sm font-bold">{ship.stats.type}</span>
                  </div>
                </div>
                
                <button
                  onClick={() => handleBuyShip(ship)}
                  disabled={isSelected}
                  className={`w-full py-2.5 font-mono font-bold text-xs tracking-[0.2em] transition-all uppercase flex items-center justify-center gap-2 ${
                    isSelected ? 'bg-cyan-900/20 text-cyan-500/50 border border-cyan-900/30 cursor-default' 
                    : isUnlocked ? 'bg-cyan-500/10 hover:bg-cyan-500 text-cyan-400 hover:text-slate-950 border border-cyan-500' 
                    : credits >= ship.cost ? 'bg-amber-500/10 hover:bg-amber-500 text-amber-400 hover:text-slate-950 border border-amber-500' 
                    : 'bg-slate-900 text-slate-600 border border-slate-800 cursor-not-allowed'
                  }`}
                  style={{ clipPath: 'polygon(2% 0, 98% 0, 100% 50%, 98% 100%, 2% 100%, 0% 50%)' }}
                >
                  {isSelected ? 'System Engaged' : isUnlocked ? 'Initialize' : 'Authorize Build'}
                </button>
              </div>
            );
          })}
        </div>

        {/* UPGRADES PANEL */}
        <div className="flex flex-col gap-4">
          <div className="flex items-center gap-2 border-b border-rose-900/50 pb-2 mt-6 lg:mt-0">
            <span className="text-xs font-mono font-bold text-rose-500 tracking-widest uppercase">Sub-System Overrides</span>
          </div>

          {UPGRADES.map(upg => {
            const currentLvl = upgrades[upg.id] || 0;
            const isMax = currentLvl >= upg.maxLevel;
            const cost = Math.floor(upg.baseCost * Math.pow(upg.costMult, currentLvl));
            const canAfford = credits >= cost && !isMax;
            const Icon = upg.icon;
            
            // Color mapping
            const themeColors = {
                cyan: { text: 'text-cyan-400', border: 'border-cyan-500/30', bg: 'bg-cyan-500', glow: 'shadow-[0_0_10px_rgba(34,211,238,0.5)]' },
                rose: { text: 'text-rose-400', border: 'border-rose-500/30', bg: 'bg-rose-500', glow: 'shadow-[0_0_10px_rgba(244,63,94,0.5)]' },
                amber: { text: 'text-amber-400', border: 'border-amber-500/30', bg: 'bg-amber-500', glow: 'shadow-[0_0_10px_rgba(245,158,11,0.5)]' }
            };
            const theme = themeColors[upg.color as keyof typeof themeColors] || themeColors.cyan;

            return (
              <div key={upg.id} className="relative p-5 bg-slate-900/60 border border-slate-700/50 backdrop-blur-sm" style={{ clipPath: 'polygon(0 0, 100% 0, 100% 85%, 95% 100%, 0 100%)' }}>
                <div className="flex items-start gap-4 mb-5">
                  <div className={`p-3 bg-slate-950 border ${theme.border} flex items-center justify-center`} style={{ clipPath: 'polygon(20% 0, 80% 0, 100% 20%, 100% 80%, 80% 100%, 20% 100%, 0 80%, 0 20%)' }}>
                    <Icon size={20} className={theme.text} />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-mono font-bold text-white tracking-widest uppercase">{upg.name}</h3>
                    <p className="text-slate-400 text-xs font-mono">{upg.desc}</p>
                  </div>
                </div>

                <div className="flex flex-col gap-3">
                  <div className="flex justify-between items-end">
                    <span className="text-[10px] text-slate-500 font-mono font-bold tracking-widest uppercase">Integration Level</span>
                    <span className={`text-xs font-mono font-bold ${theme.text}`}>LVL {currentLvl} / {upg.maxLevel}</span>
                  </div>
                  
                  {/* High-Tech Progress Bar */}
                  <div className="flex gap-1 bg-slate-950 p-1 border border-slate-800/50">
                    {Array.from({ length: upg.maxLevel }).map((_, i) => (
                      <div 
                        key={i} 
                        className={`flex-1 h-2 transition-all ${i < currentLvl ? `${theme.bg} ${theme.glow}` : 'bg-slate-800'}`} 
                        style={{ clipPath: 'polygon(10% 0, 100% 0, 90% 100%, 0 100%)' }}
                      />
                    ))}
                  </div>
                </div>

                <div className="mt-5">
                  <button
                    onClick={() => handleBuyUpgrade(upg)}
                    disabled={!canAfford || isMax}
                    className={`w-full py-3 font-mono font-bold text-xs tracking-widest uppercase transition-all flex justify-between items-center px-4 ${
                      isMax ? 'bg-slate-950/50 text-slate-600 border border-slate-800 cursor-default' 
                      : canAfford ? `bg-slate-800 hover:${theme.bg} text-white border ${theme.border} hover:border-transparent ${theme.glow}` 
                      : 'bg-slate-900 text-slate-600 border border-slate-800 cursor-not-allowed'
                    }`}
                    style={{ clipPath: 'polygon(0 0, 95% 0, 100% 50%, 95% 100%, 0 100%)' }}
                  >
                    <span>{isMax ? 'OPTIMIZATION COMPLETE' : 'Execute Upgrade'}</span>
                    {!isMax && <span className={canAfford ? 'text-amber-400' : 'text-rose-900'}>{cost.toLocaleString()} CTR</span>}
                  </button>
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </div>
  );
}
