import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Cpu, Target, Clock, ShieldAlert, Settings, Info, Play, RefreshCw, BookOpen, Gamepad2, ArrowLeft } from 'lucide-react';
import { cn } from './lib/utils';
import { GameCanvas, SchedulerAlgo } from './components/GameCanvas';
import { Report } from './components/Report';
import { MainMenu } from './components/MainMenu';
import { GalaxyModeSelect } from './components/GalaxyModeSelect';
import { ShopScreen } from './components/Shop';
import { soundManager } from './lib/audio';

export default function App() {
  const [view, setView] = useState<'menu' | 'game' | 'report' | 'modes' | 'shop'>('menu');
  const [gameKey, setGameKey] = useState(0);
  const [isGameOver, setIsGameOver] = useState(false);
  const [finalScore, setFinalScore] = useState(0);
  const [civilizationLevel, setCivilizationLevel] = useState(0);

  const handleGameOver = (score: number) => {
    setFinalScore(score);
    setIsGameOver(true);
    soundManager.playGameOver();
    
    // Save high score
    const saved = localStorage.getItem('maxScore');
    if (!saved || score > parseInt(saved, 10)) {
        localStorage.setItem('maxScore', score.toString());
    }

    // Save credits
    const currentCredits = parseInt(localStorage.getItem('credits') || '0', 10);
    localStorage.setItem('credits', (currentCredits + score).toString());
  };

  const restart = () => {
    soundManager.init();
    setIsGameOver(false);
    setGameKey(k => k + 1);
  };

  const backToMenu = () => {
    setView('menu');
    setIsGameOver(false);
  };

  const startGame = () => {
    soundManager.init();
    setView('game');
  };

  const handleSelectMode = (level: number) => {
    setCivilizationLevel(level);
    startGame();
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-50 font-sans selection:bg-indigo-500/30 overflow-hidden h-screen relative">
      <AnimatePresence mode="wait">
        {view === 'menu' ? (
          <motion.div 
            key="menu" 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            exit={{ opacity: 0 }}
            className="absolute inset-0 z-50 bg-slate-950"
          >
            <MainMenu 
              onStartGame={() => {
                setCivilizationLevel(0); // Type 0 default
                startGame();
              }}
              onShowReport={() => setView('report')} 
              onShowModes={() => setView('modes')}
              onShowShop={() => setView('shop')}
            />
          </motion.div>
        ) : view === 'modes' ? (
          <motion.div 
            key="modes"
            initial={{ opacity: 0, x: 50 }} 
            animate={{ opacity: 1, x: 0 }} 
            exit={{ opacity: 0, x: -50 }}
            className="absolute inset-0 z-50"
          >
             <GalaxyModeSelect 
                onBack={backToMenu} 
                onSelectMode={handleSelectMode} 
             />
          </motion.div>
        ) : view === 'shop' ? (
          <motion.div 
            key="shop"
            initial={{ opacity: 0, scale: 0.9 }} 
            animate={{ opacity: 1, scale: 1 }} 
            exit={{ opacity: 0, scale: 0.9 }}
            className="absolute inset-0 z-50 bg-slate-950"
          >
             <ShopScreen onBack={backToMenu} />
          </motion.div>
        ) : (
          <motion.div 
            key="app" 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            className="w-full h-full"
          >
            {view === 'game' ? (
              <div className="h-full w-full relative bg-slate-900">
                <GameCanvas 
                  gameKey={gameKey}
                  onGameOver={handleGameOver}
                  onReturnMenu={backToMenu}
                  civilizationLevel={civilizationLevel}
                />

                {isGameOver && (
                  <div className="absolute inset-0 z-50 flex items-center justify-center p-6">
                    <div className="absolute inset-0 bg-slate-950/60 backdrop-blur-sm"></div>
                    <motion.div 
                      initial={{ scale: 0.9, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      className="relative bg-slate-900 border border-slate-700/50 rounded-3xl p-10 max-w-lg w-full flex flex-col items-center justify-center shadow-[0_0_50px_rgba(30,27,75,0.8)] overflow-hidden z-10"
                    >
                      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-rose-500 to-transparent"></div>
                      <ShieldAlert size={64} className="text-rose-500 mb-6 drop-shadow-[0_0_15px_rgba(244,63,94,0.5)]" />
                      <h2 className="text-4xl font-bold text-white mb-2 tracking-tight text-center">SHIP DESTROYED</h2>
                      <p className="text-slate-400 mb-8 max-w-md text-center">Your fighter was overwhelmed by the Kla'ed armada.</p>
                      
                      <div className="bg-slate-950/50 border border-slate-800/80 rounded-2xl p-6 mb-8 w-full text-center shadow-inner">
                        <div className="text-sm font-semibold text-slate-500 uppercase tracking-widest mb-1">Final Score</div>
                        <div className="text-5xl font-mono font-bold text-indigo-400 drop-shadow-[0_0_10px_rgba(129,140,248,0.5)]">{finalScore}</div>
                      </div>

                      <div className="flex flex-col sm:flex-row gap-4 w-full">
                        <button 
                          onClick={restart}
                          className="flex-1 flex items-center justify-center gap-3 bg-indigo-600/90 hover:bg-indigo-500 text-white px-6 py-4 rounded-xl font-bold shadow-lg shadow-indigo-900/20 transition-all focus:ring-4 focus:ring-indigo-500/20 active:scale-95 border border-indigo-500/30 hover:border-indigo-400/50"
                        >
                          <RefreshCw size={20} /> Launch Again
                        </button>
                        <button 
                          onClick={backToMenu}
                          className="flex-[0.8] flex items-center justify-center gap-3 bg-slate-800/80 hover:bg-slate-700 text-white px-6 py-4 rounded-xl font-bold shadow-lg transition-all focus:ring-4 focus:ring-slate-500/20 active:scale-95 border border-slate-700 hover:border-slate-600"
                        >
                          <ArrowLeft size={20} /> Main Menu
                        </button>
                      </div>
                    </motion.div>
                  </div>
                )}
              </div>
            ) : (
              <div className="h-full w-full relative">
                <button 
                  onClick={backToMenu}
                  className="absolute top-6 left-6 z-50 flex items-center gap-2 p-3 bg-slate-900 border border-slate-800 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors shadow-lg"
                >
                  <ArrowLeft size={18} /> Back to Menu
                </button>
                <Report />
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

