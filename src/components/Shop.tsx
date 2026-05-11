import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { ArrowLeft, Shield, Zap, Wind, Lock, Unlock } from 'lucide-react';
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
  { id: 'hp', name: 'Hull Reinforcement', icon: Shield, desc: '+20 Max HP per level', maxLevel: 10, baseCost: 500, costMult: 1.5 },
  { id: 'dmg', name: 'Weapon Overclock', icon: Zap, desc: '+20% Damage per level', maxLevel: 10, baseCost: 1000, costMult: 1.8 },
  { id: 'speed', name: 'Advanced Thrusters', icon: Wind, desc: '+10% Speed per level', maxLevel: 5, baseCost: 800, costMult: 1.4 },
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
    <div className="w-full h-full flex flex-col p-4 pt-20 md:p-8 md:pt-20 max-w-6xl mx-auto text-slate-200">
      <button 
        onClick={onBack}
        className="absolute top-4 left-4 md:top-6 md:left-6 flex items-center gap-2 p-2 px-3 md:p-3 bg-slate-900 border border-slate-800 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors shadow-lg text-sm md:text-base z-10"
      >
        <ArrowLeft size={18} /> Exit Hangar
      </button>

      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 mb-4 md:mb-8 border-b border-indigo-900/50 pb-4 shrink-0">
        <div className="mt-4 md:mt-0">
          <h1 className="text-2xl md:text-4xl font-bold text-white tracking-tight uppercase">Fleet Hangar</h1>
          <p className="text-xs md:text-base text-slate-400">Upgrade your vessel and unlock advanced ships.</p>
        </div>
        <div className="text-left md:text-right bg-slate-900 px-4 md:px-6 py-2 md:py-3 rounded-xl border border-indigo-500/30 w-full md:w-auto flex flex-row md:flex-col justify-between md:justify-start items-center md:items-end">
          <div className="text-xs md:text-sm text-indigo-400 font-bold tracking-widest uppercase md:mb-1">Credits</div>
          <div className="text-xl md:text-3xl font-mono text-cyan-400 drop-shadow-[0_0_8px_rgba(34,211,238,0.5)]">{credits.toLocaleString()} CTR</div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-8 flex-1 min-h-0 overflow-y-auto lg:overflow-hidden">
        
        {/* SHIPS PANEL */}
        <div className="flex flex-col gap-4 lg:overflow-y-auto pr-2 custom-scrollbar">
          <h2 className="text-xl md:text-2xl font-bold text-indigo-300 shrink-0">Vessels</h2>
          {SHIPS.map(ship => {
            const isUnlocked = unlocked.includes(ship.id);
            const isSelected = selected === ship.id;
            
            return (
              <div 
                key={ship.id}
                className={`p-5 rounded-xl border transition-all ${isSelected ? 'bg-indigo-900/40 border-indigo-400 shadow-[0_0_15px_rgba(99,102,241,0.3)]' : isUnlocked ? 'bg-slate-800/60 border-slate-700 hover:border-slate-500' : 'bg-slate-900/80 border-slate-800'}`}
              >
                <div className="flex justify-between items-start mb-2">
                  <h3 className="text-xl font-bold flex items-center gap-2">
                    {ship.name}
                    {!isUnlocked && <Lock size={16} className="text-rose-400" />}
                    {isSelected && <span className="text-xs bg-indigo-500 text-white px-2 py-0.5 rounded font-bold uppercase">Active</span>}
                  </h3>
                  {!isUnlocked && (
                    <div className="font-mono text-rose-400 font-bold">{ship.cost.toLocaleString()} CTR</div>
                  )}
                </div>
                <p className="text-slate-400 text-sm mb-4">{ship.desc}</p>
                <div className="grid grid-cols-3 gap-2 mb-4 text-xs">
                  <div className="bg-slate-950 p-2 rounded border border-slate-800">
                    <span className="text-slate-500 block">Base HP</span>
                    <span className="font-mono text-cyan-300">{ship.stats.hp}</span>
                  </div>
                  <div className="bg-slate-950 p-2 rounded border border-slate-800">
                    <span className="text-slate-500 block">Speed</span>
                    <span className="font-mono text-indigo-300">{ship.stats.speed}</span>
                  </div>
                  <div className="bg-slate-950 p-2 rounded border border-slate-800">
                    <span className="text-slate-500 block">Class</span>
                    <span className="font-mono text-purple-300">{ship.stats.type}</span>
                  </div>
                </div>
                
                <button
                  onClick={() => handleBuyShip(ship)}
                  disabled={isSelected}
                  className={`w-full py-3 rounded-lg font-bold transition-all ${isSelected ? 'bg-indigo-500/20 text-indigo-300 cursor-default' : isUnlocked ? 'bg-indigo-600 hover:bg-indigo-500 text-white' : credits >= ship.cost ? 'bg-cyan-600 hover:bg-cyan-500 text-white' : 'bg-slate-800 text-slate-500 cursor-not-allowed'}`}
                >
                  {isSelected ? 'Equipped' : isUnlocked ? 'Equip' : 'Purchase Vessel'}
                </button>
              </div>
            );
          })}
        </div>

        {/* UPGRADES PANEL */}
        <div className="flex flex-col gap-4 lg:overflow-y-auto pr-2 custom-scrollbar">
          <h2 className="text-xl md:text-2xl font-bold text-rose-300 mt-4 md:mt-0 shrink-0">System Upgrades</h2>
          {UPGRADES.map(upg => {
            const currentLvl = upgrades[upg.id] || 0;
            const isMax = currentLvl >= upg.maxLevel;
            const cost = Math.floor(upg.baseCost * Math.pow(upg.costMult, currentLvl));
            const canAfford = credits >= cost && !isMax;
            const Icon = upg.icon;

            return (
              <div key={upg.id} className="p-5 bg-slate-800/60 rounded-xl border border-slate-700">
                <div className="flex items-center gap-4 mb-4">
                  <div className="p-3 bg-slate-900 rounded-lg border border-slate-700">
                    <Icon size={24} className="text-rose-400" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-bold">{upg.name}</h3>
                    <p className="text-slate-400 text-sm">{upg.desc}</p>
                  </div>
                  <div className="text-right">
                    <div className="text-xs text-slate-500 uppercase tracking-widest font-bold mb-1">Level {currentLvl}/{upg.maxLevel}</div>
                    <div className="flex gap-1">
                      {Array.from({ length: upg.maxLevel }).map((_, i) => (
                        <div key={i} className={`w-2 h-4 rounded-sm ${i < currentLvl ? 'bg-rose-500 shadow-[0_0_5px_rgba(244,63,94,0.5)]' : 'bg-slate-800'}`} />
                      ))}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <button
                    onClick={() => handleBuyUpgrade(upg)}
                    disabled={!canAfford || isMax}
                    className={`flex-1 py-3 rounded-lg font-bold transition-all flex justify-center items-center gap-2 ${isMax ? 'bg-slate-800 text-slate-500 cursor-default' : canAfford ? 'bg-rose-600 hover:bg-rose-500 text-white shadow-[0_0_15px_rgba(244,63,94,0.3)]' : 'bg-slate-800 text-slate-500 cursor-not-allowed border border-slate-700'}`}
                  >
                    {isMax ? 'MAX LEVEL' : <>Upgrade ({cost.toLocaleString()} CTR)</>}
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
