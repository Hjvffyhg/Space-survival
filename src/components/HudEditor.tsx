import React, { useState, useRef } from 'react';
import { ArrowUp, ArrowDown, ArrowLeft, ArrowRight } from 'lucide-react';
import { DEFAULT_LAYOUT, getSavedLayout, saveLayout, HudLayout, HudElementId } from '../lib/hudLayout';

export function HudEditor({ onExit }: { onExit: () => void }) {
  const [layout, setLayout] = useState<HudLayout>(getSavedLayout());
  const [selectedId, setSelectedId] = useState<HudElementId | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const handlePointerDown = (id: HudElementId, e: React.PointerEvent) => {
    setSelectedId(id);
    e.stopPropagation();
    
    const startX = e.clientX;
    const startY = e.clientY;
    const startLayoutX = layout[id].x;
    const startLayoutY = layout[id].y;
    
    const onPointerMove = (evt: PointerEvent) => {
        if (!containerRef.current) return;
        const rect = containerRef.current.getBoundingClientRect();
        const dx = ((evt.clientX - startX) / rect.width) * 100;
        const dy = ((evt.clientY - startY) / rect.height) * 100;
        
        setLayout(prev => ({
            ...prev,
            [id]: {
                ...prev[id],
                x: Math.max(0, Math.min(100, startLayoutX + dx)),
                y: Math.max(0, Math.min(100, startLayoutY + dy))
            }
        }));
    };
    
    const onPointerUp = () => {
        window.removeEventListener('pointermove', onPointerMove);
        window.removeEventListener('pointerup', onPointerUp);
    };
    
    window.addEventListener('pointermove', onPointerMove);
    window.addEventListener('pointerup', onPointerUp);
  };

  const updateSelected = (updates: Partial<HudElementState>) => {
      if (!selectedId) return;
      setLayout(prev => ({
          ...prev,
          [selectedId]: { ...prev[selectedId], ...updates }
      }));
  };

  const nudge = (dx: number, dy: number) => {
      if (!selectedId) return;
      const step = 0.5; // smaller step for precision
      setLayout(prev => ({
          ...prev,
          [selectedId]: {
              ...prev[selectedId],
              x: Math.max(0, Math.min(100, prev[selectedId].x + (dx * step))),
              y: Math.max(0, Math.min(100, prev[selectedId].y + (dy * step)))
          }
      }));
  };

  // Render elements mock
  const renderElement = (id: HudElementId, content: React.ReactNode, name: string) => {
      const state = layout[id];
      const isSelected = selectedId === id;
      return (
          <div 
             key={id}
             onPointerDown={(e) => handlePointerDown(id, e)}
             className={`absolute flex items-center justify-center cursor-move touch-none ${isSelected ? 'ring-2 ring-yellow-400 bg-yellow-400/20 z-40' : 'z-30'}`}
             style={{
                 left: `${state.x}%`,
                 top: `${state.y}%`,
                 transform: `translate(-50%, -50%) scale(${state.scale})`,
                 opacity: state.opacity,
             }}
          >
              {content}
              {isSelected && <div className="absolute -top-6 text-[10px] text-yellow-400 font-bold bg-black/80 px-2 py-0.5 whitespace-nowrap rounded">{name}</div>}
          </div>
      );
  };

  return (
      <div className="absolute inset-0 bg-slate-950 z-50 overflow-hidden select-none font-sans" ref={containerRef} onPointerDown={() => setSelectedId(null)}>
          <div className="absolute inset-0 pointer-events-none opacity-20 bg-[radial-gradient(circle_at_center,_#3b82f6_0%,_#0f172a_100%)]"></div>
          
          <div className="absolute top-4 left-4 text-white/50 text-sm font-mono pointer-events-none z-10 bg-black/50 px-2 py-1 rounded">HUD LAYOUT EDITOR</div>

          {/* Canvas mockup bounds */}
          <div className="absolute inset-x-8 inset-y-8 border-2 border-dashed border-white/10 pointer-events-none z-0 rounded-2xl"></div>

          {/* Elements */}
          {renderElement('moveJoystick', 
            <div className="w-[120px] h-[120px] rounded-full border-2 border-red-500/50 bg-red-500/20 flex items-center justify-center shadow-[0_0_20px_rgba(239,68,68,0.2)]">
                <div className="w-10 h-10 rounded-full bg-red-500/50 pointer-events-none"></div>
            </div>, 
          'MOVE JOYSTICK')}
          
          {renderElement('aimJoystick', 
            <div className="w-[120px] h-[120px] rounded-full border-2 border-sky-500/50 bg-sky-500/20 flex items-center justify-center shadow-[0_0_20px_rgba(14,165,233,0.2)]">
                <div className="w-10 h-10 rounded-full bg-sky-500/50 pointer-events-none"></div>
            </div>, 
          'AIM JOYSTICK')}
          
          {renderElement('wpnBtn', 
            <div className="w-14 h-14 rounded-full border-2 border-amber-500 bg-slate-900/90 flex items-center justify-center text-amber-500 font-bold text-xs shadow-[0_0_15px_rgba(245,158,11,0.4)] backdrop-blur-sm">WPN</div>, 
          'WEAPONS')}
          
          {renderElement('shdBtn', 
            <div className="w-16 h-16 rounded-full border-2 border-[#8B5CF6] bg-slate-900/90 flex items-center justify-center text-[#8B5CF6] font-bold text-xs shadow-[0_0_15px_rgba(139,92,246,0.4)] backdrop-blur-sm">SHD</div>, 
          'SHIELD')}
          
          {renderElement('dshBtn', 
            <div className="w-16 h-16 rounded-full border-2 border-slate-300 bg-slate-900/90 flex items-center justify-center text-white font-bold text-xs shadow-[0_0_15px_rgba(255,255,255,0.2)] backdrop-blur-sm">DASH</div>, 
          'DASH')}

          {renderElement('hpBar', (
              <div className="flex flex-col gap-1 w-48 bg-[#111827]/90 px-3 py-2 border-l-4 border-l-[#EF4444] border border-[#111827] shadow-[0_0_10px_rgba(239,68,68,0.3)]">
                  <div className="flex justify-between items-center"><span className="text-[10px] text-white font-bold tracking-widest">HP</span><span className="text-[10px] text-[#EF4444] font-mono">100%</span></div>
                  <div className="w-full h-2 bg-slate-800"><div className="w-full h-full bg-[#EF4444]"></div></div>
                  
                  <div className="flex justify-between items-center mt-1"><span className="text-[10px] text-white font-bold tracking-widest">STM</span><span className="text-[10px] text-amber-400 font-mono">100%</span></div>
                  <div className="w-full h-2 bg-slate-800"><div className="w-full h-full bg-amber-400"></div></div>
              </div>
          ), 'PLAYER STATS')}

          {/* Editor Dialog */}
          {selectedId && (
              <div 
                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[340px] bg-slate-800/95 border-2 border-slate-600 shadow-2xl flex flex-col pointer-events-auto z-50 rounded-lg overflow-hidden backdrop-blur-md"
                onPointerDown={(e) => e.stopPropagation()}
              >
                  <div className="bg-slate-900 px-4 py-3 flex justify-between items-center border-b border-slate-700">
                      <span className="font-bold text-sm text-slate-200 tracking-wider">ELEMENT PROPERTIES</span>
                      <span className="text-[10px] text-cyan-400 bg-cyan-900/30 px-2 py-1 rounded font-mono border border-cyan-800">HUD LAYOUT</span>
                  </div>
                  
                  <div className="p-5 flex gap-5">
                      {/* Sliders */}
                      <div className="flex-1 flex flex-col gap-5">
                          <div>
                              <div className="flex justify-between text-xs font-bold text-slate-400 mb-2 uppercase">
                                  <span>Scale</span>
                                  <span className="text-yellow-400 font-mono">{Math.round(layout[selectedId].scale * 100)}%</span>
                              </div>
                              <input type="range" min="0.5" max="2" step="0.05" value={layout[selectedId].scale} onChange={e => updateSelected({ scale: parseFloat(e.target.value) })} className="w-full accent-yellow-400 h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer" />
                          </div>
                          <div>
                              <div className="flex justify-between text-xs font-bold text-slate-400 mb-2 uppercase">
                                  <span>Opacity</span>
                                  <span className="text-yellow-400 font-mono">{Math.round(layout[selectedId].opacity * 100)}%</span>
                              </div>
                              <input type="range" min="0.1" max="1" step="0.05" value={layout[selectedId].opacity} onChange={e => updateSelected({ opacity: parseFloat(e.target.value) })} className="w-full accent-yellow-400 h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer" />
                          </div>
                      </div>

                      {/* D-Pad */}
                      <div className="w-24 grid grid-cols-3 grid-rows-3 gap-1 content-center">
                          <button onClick={() => nudge(0, -1)} className="col-start-2 bg-slate-700 hover:bg-slate-600 flex items-center justify-center rounded active:scale-95 transition-transform"><ArrowUp size={16} className="text-white"/></button>
                          <button onClick={() => nudge(-1, 0)} className="row-start-2 col-start-1 bg-slate-700 hover:bg-slate-600 flex items-center justify-center rounded active:scale-95 transition-transform"><ArrowLeft size={16} className="text-white"/></button>
                          <button onClick={() => nudge(0, 1)} className="row-start-3 col-start-2 bg-slate-700 hover:bg-slate-600 flex items-center justify-center rounded active:scale-95 transition-transform"><ArrowDown size={16} className="text-white"/></button>
                          <button onClick={() => nudge(1, 0)} className="row-start-2 col-start-3 bg-slate-700 hover:bg-slate-600 flex items-center justify-center rounded active:scale-95 transition-transform"><ArrowRight size={16} className="text-white"/></button>
                      </div>
                  </div>

                  <div className="flex border-t border-slate-700 font-bold text-xs text-center">
                      <button onClick={() => {
                          setLayout(prev => ({ ...prev, [selectedId]: DEFAULT_LAYOUT[selectedId] }));
                      }} className="flex-1 py-4 text-red-400 hover:bg-red-500/20 transition-colors">RESET</button>
                      
                      <button onClick={() => {
                          onExit();
                      }} className="flex-1 py-4 text-cyan-400 hover:bg-cyan-500/20 border-l border-r border-slate-700 transition-colors">EXIT</button>
                      
                      <button onClick={() => {
                          saveLayout(layout);
                          onExit();
                      }} className="flex-[1.8] py-4 text-slate-900 bg-yellow-400 hover:bg-yellow-300 transition-colors uppercase tracking-tight">Save and Use</button>
                  </div>
              </div>
          )}
      </div>
  );
}

interface HudElementState {
    x: number;
    y: number;
    scale: number;
    opacity: number;
}
