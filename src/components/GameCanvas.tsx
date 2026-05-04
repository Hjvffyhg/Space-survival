import React, { useEffect, useRef, useState } from 'react';
import { soundManager } from '../lib/audio';
import { loadShip, loadProjectile, loadAllProjectiles, ShipRenderer, SHIP_CONFIGS, PROJECTILE_CONFIGS, AnimSprite, ShipName, ShipSprites } from '../lib/voidFleet';

export type SchedulerAlgo = 'FCFS' | 'RR' | 'HRRN';


const ASSETS_CACHE: {
  ships: Partial<Record<ShipName, ShipSprites>>;
  projectiles: Record<string, HTMLImageElement> | null;
  bossImages: Record<string, HTMLImageElement>;
} = {
  ships: {},
  projectiles: null,
  bossImages: {}
};

interface GameCanvasProps {
  gameKey: number;
  onGameOver: (score: number) => void;
  onReturnMenu: () => void;
  civilizationLevel?: number;
}

export function GameCanvas({ gameKey, onGameOver, onReturnMenu, civilizationLevel = 0 }: GameCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const scoreRef = useRef<HTMLSpanElement>(null);
  const hpRef = useRef<HTMLDivElement>(null);
  const hpTextRef = useRef<HTMLSpanElement>(null);
  const waveRef = useRef<HTMLSpanElement>(null);
  const timeRef = useRef<HTMLSpanElement>(null);
  const targetsRef = useRef<HTMLSpanElement>(null);
  const notificationRef = useRef<HTMLDivElement>(null);
  const minimapRef = useRef<HTMLCanvasElement>(null);
  const ammoRef = useRef<HTMLSpanElement>(null);
  const shieldRef = useRef<HTMLDivElement>(null);
  const shieldTextRef = useRef<HTMLSpanElement>(null);
  const staminaRef = useRef<HTMLDivElement>(null);
  const staminaTextRef = useRef<HTMLSpanElement>(null);
  const powerupRef = useRef<HTMLDivElement>(null);
  const wpn1Ref = useRef<HTMLDivElement>(null);
  const wpn2Ref = useRef<HTMLDivElement>(null);
  const dshRef = useRef<HTMLDivElement>(null);
  const shdSkillRef = useRef<HTMLDivElement>(null);
  
  const onGameOverRef = useRef(onGameOver);
  const onReturnMenuRef = useRef(onReturnMenu);

  const [isPaused, setIsPaused] = useState(false);
  const isPausedRef = useRef(false);
  const isDeadRef = useRef(false);

  useEffect(() => {
    onGameOverRef.current = onGameOver;
  }, [onGameOver]);

  useEffect(() => {
    onReturnMenuRef.current = onReturnMenu;
  }, [onReturnMenu]);

  const togglePause = () => {
    if (isDeadRef.current) return;
    const newPaused = !isPausedRef.current;
    isPausedRef.current = newPaused;
    setIsPaused(newPaused);
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    ctx.imageSmoothingEnabled = false;

    let animationFrameId: number;
    let lastTime = performance.now();
    let isAssetsLoaded = false;
    let playerRenderer: ShipRenderer;

    async function initAssets() {
      if (!ASSETS_CACHE.projectiles) {
        ASSETS_CACHE.projectiles = await loadAllProjectiles();
      }
      
      const loadBossImg = (key: string, src: string) => {
          return new Promise<void>((resolve) => {
              if (ASSETS_CACHE.bossImages[key]) { resolve(); return; }
              const img = new Image();
              img.src = src;
              img.onload = () => {
                  ASSETS_CACHE.bossImages[key] = img;
                  resolve();
              };
              img.onerror = () => {
                  resolve(); // ignore error to avoid breaking loop
              }
          });
      };
      
      await Promise.all([
          loadBossImg('boss', '/assets/jboss_carrier.png'),
          loadBossImg('boss_rr', '/assets/jboss_rr.png'),
          loadBossImg('boss_hrrn', '/assets/jboss_hrrn.png')
      ]);

      const selectedShip = (localStorage.getItem('selectedShip') as ShipName) || 'Fighter';
      const neededShips: ShipName[] = [selectedShip, 'Fighter', 'Scout', 'Dreadnought', 'Battlecruiser', 'Bomber', 'Support ship'];
      for (const ship of neededShips) {
        if (!ASSETS_CACHE.ships[ship]) {
          ASSETS_CACHE.ships[ship] = await loadShip(ship);
        }
      }
      
      const pSprites = ASSETS_CACHE.ships[selectedShip]!;
      playerRenderer = new ShipRenderer(pSprites, SHIP_CONFIGS[selectedShip], (30 * 4.0) / SHIP_CONFIGS[selectedShip].size);

      // Load upgrades
      const upgrades = JSON.parse(localStorage.getItem('upgrades') || '{"hp":0,"dmg":0,"speed":0}');
      
      // Base stats by ship
      const shipStats: Record<ShipName, { maxHp: number, baseSpeed: number }> = {
          'Fighter': { maxHp: 100, baseSpeed: 450 },
          'Scout': { maxHp: 70, baseSpeed: 585 },
          'Bomber': { maxHp: 180, baseSpeed: 315 },
          'Frigate': { maxHp: 250, baseSpeed: 450 },
          'Battlecruiser': { maxHp: 400, baseSpeed: 225 },
          'Support ship': { maxHp: 100, baseSpeed: 450 },
          'Torpedo Ship': { maxHp: 100, baseSpeed: 450 },
          'Dreadnought': { maxHp: 100, baseSpeed: 450 }
      };
      
      const sStat = shipStats[selectedShip] || { maxHp: 100, baseSpeed: 450 };
      
      state.player.maxHp = sStat.maxHp + (upgrades.hp * 20);
      state.player.hp = state.player.maxHp;
      state.player.baseSpeed = sStat.baseSpeed * (1.0 + (upgrades.speed * 0.1));
      state.player.damageMult = 1.0 + (upgrades.dmg * 0.2);

      isAssetsLoaded = true;
      // Restart timing to avoid huge jump
      lastTime = performance.now();
      loop(lastTime);
    }

    const state = {
      player: { 
          x: 0, y: 0, hp: 100, maxHp: 100, radius: 30, ammo: 150, shield: 0, 
          speedTimer: 0, weaponTimer: 0, stamina: 100,
          selectedWeapon: 1, dashCooldown: 0, shieldCooldown: 0,
          baseSpeed: 450, damageMult: 1.0
      },
      bullets: [] as any[],
      enemyBullets: [] as any[],
      particles: [] as any[],
      damageNumbers: [] as any[],
      asteroids: [] as any[],
      collectibles: [] as any[],
      enemies: [] as any[],
      readyQueue: [] as number[],
      currentAlgo: 'FCFS' as SchedulerAlgo,
      activeEnemies: new Map<number, { timeRemaining: number }>(),
      isOutsideSafeZone: false,
      score: 0,
      lastSpawnTime: lastTime / 1000,
      lastItemSpawnTime: lastTime / 1000,
      diffTimer: 0,
      keys: {} as Record<string, boolean>,
      mouse: { screenX: 0, screenY: 0, x: 0, y: 0, down: false },
      lastFireTime: 0,
      isGameOver: false,
      lastWave: 1,
      notification: { time: 0, text1: '', text2: '' },
      autoPilot: false
    };

    const MAP_WIDTH = 3000;
    const MAP_HEIGHT = 3000;

    const stars = Array.from({ length: 3000 }).map(() => ({
      x: Math.random() * MAP_WIDTH * 3 - MAP_WIDTH,
      y: Math.random() * MAP_HEIGHT * 3 - MAP_HEIGHT,
      r: Math.random() * 1.5 + 0.2,
      alpha: Math.random() * 0.8 + 0.1,
      twinkle: Math.random() * Math.PI * 2,
      parallax: Math.random() * 0.6 + 0.2
    }));

    // Generate initial asteroids
    for(let i = 0; i < 30 + civilizationLevel * 15; i++) {
        state.asteroids.push({
            x: Math.random() * MAP_WIDTH,
            y: Math.random() * MAP_HEIGHT,
            vx: ((Math.random() - 0.5) * 50) * (1 + civilizationLevel * 0.5),
            vy: ((Math.random() - 0.5) * 50) * (1 + civilizationLevel * 0.5),
            radius: 20 + Math.random() * 50,
            angle: Math.random() * Math.PI * 2,
            spin: (Math.random() - 0.5) * 2,
            hp: 200 + civilizationLevel * 100
        });
    }

    const resize = () => {
      canvas.width = container.clientWidth;
      canvas.height = container.clientHeight;
      if (state.player.x === 0 && state.player.y === 0) {
        state.player.x = MAP_WIDTH / 2;
        state.player.y = MAP_HEIGHT / 2;
      }
    };
    
    window.addEventListener('resize', resize);
    resize(); // initialize bounds

    const handleKeyDown = (e: KeyboardEvent) => { 
      // If escape pressed, toggle pause
      if (e.key === 'Escape') {
          togglePause();
      }
      if (e.key.toLowerCase() === 'p') {
          state.autoPilot = !state.autoPilot;
          state.notification = { time: 4.0, text1: state.autoPilot ? 'AI TESTER ENGAGED' : 'MANUAL CONTROL', text2: state.autoPilot ? 'GameTesterAgent taking over ship controls' : '' };
      }
      state.keys[e.key.toLowerCase()] = true; 
    };
    const handleKeyUp = (e: KeyboardEvent) => { state.keys[e.key.toLowerCase()] = false; };
    
    // We attach global listeners because if the user drags mouse out of canvas, we shouldn't continue firing
    const handleMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      state.mouse.screenX = e.clientX - rect.left;
      state.mouse.screenY = e.clientY - rect.top;
    };
    const handleMouseDown = (e: MouseEvent) => { 
        if (e.target === canvas) state.mouse.down = true; 
    };
    const handleMouseUp = () => { state.mouse.down = false; };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('mouseup', handleMouseUp);

    const loop = (time: number) => {
      animationFrameId = requestAnimationFrame(loop);

      if (isPausedRef.current) {
        lastTime = time;
        return;
      }

      let dt = (time - lastTime) / 1000;
      lastTime = time;
      if (dt > 0.1) dt = 0.1; // caps deltaTime if tab is put to background

      if (state.isGameOver) {
          // just render the last frame repeatedly to prevent black flash
          const cameraX = Math.max(0, Math.min(MAP_WIDTH - canvas.width, state.player.x - canvas.width / 2));
          const cameraY = Math.max(0, Math.min(MAP_HEIGHT - canvas.height, state.player.y - canvas.height / 2));
          render(ctx, canvas, state, cameraX, cameraY);
          return;
      }

      state.diffTimer += dt;
      const now = time / 1000;

      // Calculate Camera
      const cameraX = Math.max(0, Math.min(MAP_WIDTH - canvas.width, state.player.x - canvas.width / 2));
      const cameraY = Math.max(0, Math.min(MAP_HEIGHT - canvas.height, state.player.y - canvas.height / 2));
      state.mouse.x = state.mouse.screenX + cameraX;
      state.mouse.y = state.mouse.screenY + cameraY;

      // Calculate Wave logic
      const currentWave = Math.floor(state.diffTimer / 30) + 1;
      let cfg = { algo: 'FCFS' as SchedulerAlgo, cores: 2, quantum: 0.5 };

      if (currentWave === 2) {
         cfg = { algo: 'RR', cores: 3, quantum: 0.8 };
      } else if (currentWave === 3) {
         cfg = { algo: 'RR', cores: 4, quantum: 0.4 };
      } else if (currentWave >= 4) {
         cfg = { algo: 'HRRN', cores: Math.min(8, 3 + Math.floor((currentWave - 4) / 2)), quantum: 0.5 };
      }
      
      state.currentAlgo = cfg.algo;

      // Update refs
      if (waveRef.current) waveRef.current.innerText = currentWave.toString().padStart(2, '0');
      if (timeRef.current) {
        const m = Math.floor(state.diffTimer / 60);
        const s = Math.floor(state.diffTimer % 60);
        timeRef.current.innerText = `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
      }
      if (targetsRef.current) targetsRef.current.innerText = `TARGETS: ${state.enemies.length}`;

      if (currentWave > state.lastWave) {
         state.lastWave = currentWave;
         state.notification.time = 4.0;
         soundManager.playWaveCompletion();
         if (currentWave === 2) {
             state.notification.text1 = "ROUND ROBIN ACTIVATED";
             state.notification.text2 = "+1 CPU CORE";
         } else if (currentWave === 3) {
             state.notification.text1 = "ROUND ROBIN EXPANDED";
             state.notification.text2 = "+1 CPU CORE";
         } else if (currentWave === 4) {
             state.notification.text1 = "HRRN PROTOCOL ONLINE";
             state.notification.text2 = "THREAT PRIORITIZATION ENABLED";
         } else if (currentWave > 4 && currentWave % 2 === 0) {
             state.notification.text1 = "SYSTEM SCALING";
             state.notification.text2 = "+1 CPU CORE";
         } else {
             state.notification.time = 0;
         }
      }

      if (state.notification.time > 0) {
         state.notification.time -= dt;
         if (notificationRef.current) {
            notificationRef.current.innerHTML = `
              <div class="text-3xl font-bold text-white mb-1 tracking-widest drop-shadow-[0_0_8px_rgba(255,255,255,0.8)]">WAVE ${state.lastWave}</div>
              <div class="text-sm font-bold text-[#00D9FF] uppercase tracking-widest mb-1 drop-shadow-[0_0_5px_rgba(0,217,255,0.8)]">SYSTEM UPDATE:</div>
              <div class="text-xl font-mono text-[#F59E0B] leading-tight drop-shadow-[0_0_5px_rgba(245,158,11,0.8)]">${state.notification.text1}</div>
              <div class="text-sm font-mono text-slate-300 mt-2">${state.notification.text2}</div>
            `;
            const opacity = state.notification.time > 1 ? 1 : Math.max(0, state.notification.time).toString();
             // Add a subtle scale pop when appearing
            const scale = 1 + (Math.max(0, 4.0 - state.notification.time) * 0.05);
            const yOffset = -50 + (Math.max(0, 4.0 - state.notification.time) * -2);
            notificationRef.current.style.opacity = opacity.toString();
            notificationRef.current.style.transform = `translate(-50%, ${yOffset}%) scale(${scale})`;
         }
      } else {
         if (notificationRef.current) {
             notificationRef.current.style.opacity = '0';
         }
      }

      // 1. Spawning
      let spawnInterval = Math.max(0.1, 2.0 - (state.diffTimer / 60) - (civilizationLevel * 0.2)); // harder over time
      const scaler = 1 + (civilizationLevel * 0.3) + (state.score / 5000) + (state.diffTimer / 300);

      if (now - state.lastSpawnTime > spawnInterval) {
        const side = Math.floor(Math.random() * 4);
        let ex = 0, ey = 0;
        if (side === 0) { ex = Math.random() * MAP_WIDTH; ey = -30; } 
        else if (side === 1) { ex = MAP_WIDTH + 30; ey = Math.random() * MAP_HEIGHT; } 
        else if (side === 2) { ex = Math.random() * MAP_WIDTH; ey = MAP_HEIGHT + 30; } 
        else { ex = -30; ey = Math.random() * MAP_HEIGHT; }
        
        // As time progresses, more tanks and new enemies
        const r = Math.random();
        let type = 'grunt';
        let maxHp = 30 * scaler;
        let damage = 15 * scaler;
        let S = 1.0;
        let color = '#EF4444';
        let speed = 140 * (1 + (scaler - 1) * 0.5);
        let radius = 12;

        if (state.diffTimer > 45 && Math.random() < 0.03) { // Boss spawn chance
            const bossRand = Math.random();
            if (bossRand < 0.33) {
                type = 'boss';
                maxHp = 1000 * scaler;
                radius = 45;
                speed = 25 * (1 + (scaler - 1) * 0.1);
            } else if (bossRand < 0.66) {
                type = 'boss_rr'; // Cycler
                maxHp = 3000 * scaler;
                radius = 140; // Massive
                speed = 10;
            } else {
                type = 'boss_hrrn'; // Executor
                maxHp = 3500 * scaler;
                radius = 160; // Huge
                speed = 5;
            }
            damage = 50 * scaler;
            S = type === 'boss' ? 20.0 : 40.0;
            color = '#ec4899'; // Pink
        } else if (state.diffTimer > 75 && r < 0.15) { // Turret
            type = 'turret';
            maxHp = 150 * scaler;
            damage = 15 * scaler;
            S = 5.0;
            color = '#14b8a6'; // Teal
            speed = 0; // Stationary
            radius = 20;
        } else if (state.diffTimer > 30 && r < 0.25) { // Kamikaze
            type = 'kamikaze';
            maxHp = 15 * scaler;
            damage = 80 * scaler; // High bump damage
            S = 0.5;
            color = '#f97316'; // Orange
            speed = 350 * (1 + (scaler - 1) * 0.3); // Very fast
            radius = 10;
        } else if (r > Math.max(0.3, 0.8 - (state.diffTimer / 100))) {
            type = 'tank';
            maxHp = 100 * scaler;
            damage = 25 * scaler;
            S = 3.0;
            color = '#8B5CF6'; // Purple
            speed = 60 * (1 + (scaler - 1) * 0.5);
            radius = 22;
        }

        const newId = Math.random();
        
        let shipName: ShipName | null = 'Fighter';
        if (type === 'grunt') shipName = 'Scout';
        else if (type === 'tank') shipName = 'Dreadnought';
        else if (type.startsWith('boss')) shipName = null; 
        else if (type === 'kamikaze') shipName = 'Bomber';
        else if (type === 'turret') shipName = 'Support ship';
        
        const renderer = shipName ? new ShipRenderer(ASSETS_CACHE.ships[shipName]!, SHIP_CONFIGS[shipName], (radius * 3.6) / SHIP_CONFIGS[shipName].size) : null;
        
        state.enemies.push({
          id: newId,
          type,
          x: ex, y: ey,
          maxHp, hp: maxHp,
          damage,
          W: 0, S, color, speed, radius,
          spawnScale: 0.1,
          dashTimer: 0,
          shootTimer: 0,
          renderer
        });
        state.readyQueue.push(newId);
        soundManager.playEnemySpawn();
        state.lastSpawnTime = now;
      }

      // Periodically spawn items
      if (now - state.lastItemSpawnTime > 15.0) {
          const rand = Math.random();
          let cType = 'ammo';
          if (rand < 0.25) cType = 'health';
          else if (rand < 0.5) cType = 'shield';
          else if (rand < 0.75) cType = 'speed';
          else if (rand < 0.9) cType = 'weapon';

          state.collectibles.push({
             x: 50 + Math.random() * (MAP_WIDTH - 100),
             y: 50 + Math.random() * (MAP_HEIGHT - 100),
             type: cType,
             life: 15.0
          });
          state.lastItemSpawnTime = now;
      }

      // 2. Scheduler logic
      // Increase Wait Time for enemies in ready queue (specifically for HRRN)
      state.readyQueue.forEach(id => {
         const e = state.enemies.find((x: any) => x.id === id);
         if (e) e.W += dt;
      });

      // Process currently active enemies
      for (const [id, activeData] of Array.from(state.activeEnemies.entries())) {
        const e = state.enemies.find((x: any) => x.id === id);
        if (!e) {
          state.activeEnemies.delete(id);
          continue;
        }
        
        if (cfg.algo === 'FCFS') {
          // FCFS purely processes until the entity is dead. Never preempts.
        } else if (cfg.algo === 'RR') {
          activeData.timeRemaining -= dt;
          if (activeData.timeRemaining <= 0) {
            state.activeEnemies.delete(id);
            // Re-queue explicitly to the back of the ready queue
            state.readyQueue.push(id);
          }
        } else if (cfg.algo === 'HRRN') {
           activeData.timeRemaining -= dt;
           if (activeData.timeRemaining <= 0) {
             state.activeEnemies.delete(id);
             e.W = 0; // Reset wait time
             state.readyQueue.push(id);
           }
        }
      }

      // Allocate unused Cores (CPU scheduling!)
      while(state.activeEnemies.size < cfg.cores && state.readyQueue.length > 0) {
        let nextEnemyId = null;
        
        if (cfg.algo === 'FCFS' || cfg.algo === 'RR') {
           // Queue is explicit. Grab the first element.
           nextEnemyId = state.readyQueue[0];
        } else if (cfg.algo === 'HRRN') {
           // Find ready enemy with highest response ratio
           let maxRatio = -1;
           for (const id of state.readyQueue) {
              const x = state.enemies.find((e: any) => e.id === id);
              if (x) {
                 const R = (x.W + x.S) / x.S;
                 if (R > maxRatio) {
                    maxRatio = R;
                    nextEnemyId = id;
                 }
              }
           }
        }

        if (nextEnemyId !== null) {
          // Remove from ready queue
          state.readyQueue = state.readyQueue.filter(id => id !== nextEnemyId);
          
          const nextEnemy = state.enemies.find((e: any) => e.id === nextEnemyId);
          if (nextEnemy) {
              let tr = 9999;
              if (cfg.algo === 'RR') tr = cfg.quantum;
              if (cfg.algo === 'HRRN') tr = nextEnemy.S;
              state.activeEnemies.set(nextEnemyId, { timeRemaining: tr });
          }
        } else {
          break;
        }
      }

      // Update timers
      if (playerRenderer) playerRenderer.update(dt);
      
      if (state.player.speedTimer > 0) state.player.speedTimer -= dt;
      if (state.player.weaponTimer > 0) state.player.weaponTimer -= dt;
      if (state.player.dashCooldown > 0) state.player.dashCooldown -= dt;
      if (state.player.shieldCooldown > 0) state.player.shieldCooldown -= dt;

      // Weapon Select
      if (state.keys['1']) state.player.selectedWeapon = 1;
      if (state.keys['2']) state.player.selectedWeapon = 2;

      // Skills
      if (state.keys['e'] && state.player.stamina >= 20 && state.player.shieldCooldown <= 0) {
          state.player.stamina -= 20;
          state.player.shield = Math.min(100, state.player.shield + 20);
          state.player.shieldCooldown = 5.0; // 5s cd
          soundManager.playCollect('shield');
      }

      if (state.keys['q'] && state.player.dashCooldown <= 0 && state.player.stamina >= 15) {
          state.player.stamina -= 15;
          state.player.dashCooldown = 3.0; // 3s cd
          state.player.speedTimer = Math.max(state.player.speedTimer, 0.5); // mini speed boost
          soundManager.playCollect('speed');
      }

      // 3. Player Movement
      let vx = 0; let vy = 0;
      if (state.autoPilot) {
         let closestDist = Infinity;
         let closestEnemy: any = null;
         state.enemies.forEach((e: any) => {
             const d = Math.hypot(e.x - state.player.x, e.y - state.player.y);
             if (d < closestDist) {
                 closestDist = d;
                 closestEnemy = e;
             }
         });
         if (closestEnemy) {
             const dx = closestEnemy.x - state.player.x;
             const dy = closestEnemy.y - state.player.y;
             
             state.mouse.x = closestEnemy.x;
             state.mouse.y = closestEnemy.y;
             state.mouse.down = true; // autoshoot

             if (closestDist > 500) {
                 vx += dx / closestDist;
                 vy += dy / closestDist;
             } else if (closestDist < 250) {
                 vx -= dx / closestDist;
                 vy -= dy / closestDist;
             } else {
                 vx -= dy / closestDist;
                 vy += dx / closestDist;
             }
         } else {
             state.mouse.down = false;
         }
         
         // evade bullets
         state.enemyBullets.forEach((b: any) => {
             const d = Math.hypot(b.x - state.player.x, b.y - state.player.y);
             if (d < 180) {
                 vx -= (b.x - state.player.x) / d * 1.5;
                 vy -= (b.y - state.player.y) / d * 1.5;
             }
         });
         
         // bounds check
         if (state.player.x < 150) vx += 1;
         if (state.player.x > MAP_WIDTH - 150) vx -= 1;
         if (state.player.y < 150) vy += 1;
         if (state.player.y > MAP_HEIGHT - 150) vy -= 1;
      } else {
          if (state.keys['w']) vy -= 1;
          if (state.keys['s']) vy += 1;
          if (state.keys['a']) vx -= 1;
          if (state.keys['d']) vx += 1;
      }
      const len = Math.hypot(vx, vy);
      if (len > 0) { vx /= len; vy /= len; }
      
      let pSpeed = state.player.speedTimer > 0 ? state.player.baseSpeed * 1.8 : state.player.baseSpeed;
      let isBoosting = state.keys['shift'] && len > 0;
      
      if (isBoosting) {
          if (state.player.stamina > 0) {
              pSpeed += 400; // Boost!
              state.player.stamina = Math.max(0, state.player.stamina - 40 * dt);
              
              // emit boost particles
              if (Math.random() < 0.3) {
                 state.particles.push({
                     x: state.player.x - vx * state.player.radius, 
                     y: state.player.y - vy * state.player.radius,
                     vx: -vx * 100 + (Math.random() - 0.5) * 50,
                     vy: -vy * 100 + (Math.random() - 0.5) * 50,
                     life: 0.5,
                     color: '#38bdf8'
                 });
              }
          }
      } else {
          // Recharge stamina when not using boost
          state.player.stamina = Math.min(100, state.player.stamina + 15 * dt);
      }
      
      state.player.x += vx * pSpeed * dt;
      state.player.y += vy * pSpeed * dt;
      state.player.x = Math.max(state.player.radius, Math.min(MAP_WIDTH - state.player.radius, state.player.x));
      state.player.y = Math.max(state.player.radius, Math.min(MAP_HEIGHT - state.player.radius, state.player.y));

      const BOUNDARY_MARGIN = 150;
      if (state.player.x < BOUNDARY_MARGIN || state.player.x > MAP_WIDTH - BOUNDARY_MARGIN || 
          state.player.y < BOUNDARY_MARGIN || state.player.y > MAP_HEIGHT - BOUNDARY_MARGIN) {
          state.player.hp -= 20 * dt; // Take damage over time outside safe zone
          state.isOutsideSafeZone = true;
          if (state.player.hp <= 0) {
             state.isGameOver = true;
             soundManager.playExplosion();
          }
      } else {
          state.isOutsideSafeZone = false;
      }

      // 4. Combat (Shooting)
      const isWpn1 = state.player.selectedWeapon === 1;
      const fireRate = state.player.weaponTimer > 0 
           ? (isWpn1 ? 0.08 : 0.2) 
           : (isWpn1 ? 0.15 : 0.4);

      if (state.mouse.down && state.player.ammo > 0 && now - state.lastFireTime > fireRate) { // fire rate
         const dx = state.mouse.x - state.player.x;
         const dy = state.mouse.y - state.player.y;
         const d = Math.hypot(dx, dy);
         if (d > 0) {
           const ammoCost = isWpn1 ? 1 : 3;
           if (state.player.ammo >= ammoCost) {
               state.player.ammo -= ammoCost;
               const baseAngle = Math.atan2(dy, dx);
               
               let anglesToFire = [];
               if (isWpn1) {
                   if (state.player.weaponTimer > 0) {
                       anglesToFire.push(baseAngle - 0.1, baseAngle + 0.1);
                   } else {
                       anglesToFire.push(baseAngle);
                   }
               } else {
                   // WPN-2 is spread shot
                   const spreadCount = state.player.weaponTimer > 0 ? 5 : 3;
                   const spreadAngle = 0.15;
                   const startAngle = baseAngle - (spreadCount - 1) * spreadAngle / 2;
                   for(let i=0; i<spreadCount; i++) {
                       anglesToFire.push(startAngle + i * spreadAngle);
                   }
               }

               anglesToFire.forEach(angle => {
                   state.bullets.push({
                       x: state.player.x + Math.cos(angle) * state.player.radius,
                       y: state.player.y + Math.sin(angle) * state.player.radius,
                       vx: Math.cos(angle) * (isWpn1 ? 800 : 700),
                       vy: Math.sin(angle) * (isWpn1 ? 800 : 700),
                       life: isWpn1 ? 1.5 : 1.0,
                       damageMult: (isWpn1 ? 1 : 1.5) * state.player.damageMult
                   });
               });

               soundManager.playShoot();
               if (playerRenderer) playerRenderer.triggerWeapons();
               state.lastFireTime = now;
           }
         }
      }

      state.bullets.forEach(b => {
        b.x += b.vx * dt; b.y += b.vy * dt; b.life -= dt;
      });
      state.asteroids.forEach(a => {
        a.x += a.vx * dt; a.y += a.vy * dt; a.angle += a.spin * dt;
        if (a.x < -100) a.x = MAP_WIDTH + 100;
        if (a.x > MAP_WIDTH + 100) a.x = -100;
        if (a.y < -100) a.y = MAP_HEIGHT + 100;
        if (a.y > MAP_HEIGHT + 100) a.y = -100;

        // collision with player
        if (Math.hypot(a.x - state.player.x, a.y - state.player.y) < a.radius + state.player.radius) {
            const dmg = 10 * dt;
            if (state.player.shield > 0) {
                state.player.shield -= dmg;
            } else {
                state.player.hp -= dmg;
            }
        }
      });
      state.particles.forEach((p: any) => {
        p.x += p.vx * dt; 
        p.y += p.vy * dt; 
        p.life -= dt;
        if (p.isDebris) {
            p.vy += 50 * dt; // light gravity effect
            p.vx *= (1 - 1.5 * dt); // drag
            p.vy *= (1 - 1.5 * dt);
            if (p.spin) p.angle = (p.angle || 0) + p.spin * dt;
        }
      });

      // 5. Enemy Actions
      state.enemyBullets.forEach((b: any) => {
        b.x += b.vx * dt; b.y += b.vy * dt; b.life -= dt;
        
        // hit player
        if (b.life > 0 && Math.hypot(b.x - state.player.x, b.y - state.player.y) < state.player.radius + 4) {
            if (state.player.shield > 0) {
                state.player.shield -= b.damage * 1.5;
            } else {
                state.player.hp -= b.damage;
            }
            if (state.player.shield < 0) state.player.shield = 0;
            if (state.player.hp <= 0 && playerRenderer) playerRenderer.triggerDestruction();
            else if (playerRenderer) playerRenderer.triggerShield();
            
            b.life = -1;
            soundManager.playTakeDamage();
            // add some particles for player getting hit
            for (let i = 0; i < 6; i++) {
                state.particles.push({
                   x: b.x,
                   y: b.y,
                   vx: (Math.random() - 0.5) * 300,
                   vy: (Math.random() - 0.5) * 300,
                   life: 0.2 + Math.random() * 0.2,
                   color: '#00D9FF'
                });
            }
        }
      });
      state.enemyBullets = state.enemyBullets.filter((b: any) => b.life > 0);

      state.enemies.forEach(e => {
         if (e.renderer) e.renderer.update(dt);
         if (e.flashTimer === undefined) e.flashTimer = 0;
         if (e.flashTimer > 0) e.flashTimer -= dt;

         if (e.spawnScale < 1) e.spawnScale += dt * 3;
         if (e.spawnScale > 1) e.spawnScale = 1;

         const dx = state.player.x - e.x;
         const dy = state.player.y - e.y;
         const dist = Math.hypot(dx, dy);

         if (e.type.startsWith('boss')) {
             if (e.shootTimer === undefined) e.shootTimer = 1.0;
             if (e.laserTimer === undefined) e.laserTimer = 4.0;
             if (e.minionTimer === undefined) e.minionTimer = 5.0;
             if (e.rotationAngle === undefined) e.rotationAngle = 0;
             
             // Slow move towards player but stop at distance
             if (dist > e.radius + state.player.radius + 150) {
                 e.x += (dx/dist) * e.speed * dt;
                 e.y += (dy/dist) * e.speed * dt;
             }
             
             e.shootTimer -= dt;
             e.laserTimer -= dt;
             if (e.type !== 'boss_hrrn') { // HRRN doesn't span minions
                 e.minionTimer -= dt;
             }

             if (e.type === 'boss') {
                 if (e.minionTimer <= 0) {
                     // Spawn reinforcements
                     for (let i = 0; i < 2; i++) {
                         const newId = Math.random();
                         const spawnAngle = Math.PI * 2 * Math.random();
                         state.enemies.push({
                           id: newId,
                           type: 'grunt',
                           x: e.x + Math.cos(spawnAngle) * (e.radius + 40),
                           y: e.y + Math.sin(spawnAngle) * (e.radius + 40),
                           maxHp: 20, hp: 20, damage: 10, S: 1.0, W: 0,
                           color: '#EF4444', speed: 150, radius: 12, flashTimer: 0, dashTimer: 0, shootTimer: 0
                         });
                         state.readyQueue.push(newId);
                     }
                     e.minionTimer = 6.0;
                 }
                 
                 if (e.laserTimer <= 0) {
                     for (let i = 0; i < 16; i++) {
                         const angle = (Math.PI * 2 / 16) * i;
                         state.enemyBullets.push({
                             x: e.x + Math.cos(angle) * e.radius, y: e.y + Math.sin(angle) * e.radius,
                             vx: Math.cos(angle) * 150, vy: Math.sin(angle) * 150,
                             life: 6.0, damage: e.damage, isBig: true
                         });
                     }
                     soundManager.playEnemyAttack();
                     e.laserTimer = 7.0; 
                 } else if (e.shootTimer <= 0) {
                     for (let i = -2; i <= 2; i++) {
                         const angle = Math.atan2(dy, dx) + (i * 0.20);
                         state.enemyBullets.push({
                             x: e.x + Math.cos(angle) * e.radius, y: e.y + Math.sin(angle) * e.radius,
                             vx: Math.cos(angle) * 250, vy: Math.sin(angle) * 250,
                             life: 4.0, damage: e.damage / 2
                         });
                     }
                     soundManager.playEnemyAttack();
                     e.shootTimer = 2.0;
                 }
             } else if (e.type === 'boss_rr') {
                 // Cycler Mechanic: Time-Sliced Spiral Barrage
                 e.rotationAngle += dt * 0.8;
                 
                 if (e.minionTimer <= 0) {
                     for (let i = 0; i < 4; i++) {
                         const newId = Math.random();
                         const spawnAngle = (Math.PI * 2 / 4) * i;
                         state.enemies.push({
                           id: newId, type: 'kamikaze',
                           x: e.x + Math.cos(spawnAngle) * (e.radius + 40), y: e.y + Math.sin(spawnAngle) * (e.radius + 40),
                           maxHp: 30, hp: 30, damage: 30, S: 0.5, W: 0,
                           color: '#f97316', speed: 200, radius: 10, flashTimer: 0, dashTimer: 0, shootTimer: 0
                         });
                         state.readyQueue.push(newId);
                     }
                     e.minionTimer = 8.0;
                 }

                 if (e.laserTimer <= 0) {
                     // Fast spiral slice
                     for (let i = 0; i < 4; i++) {
                         const spiralAngle = e.rotationAngle + (Math.PI / 2) * i;
                         state.enemyBullets.push({
                             x: e.x + Math.cos(spiralAngle) * e.radius, y: e.y + Math.sin(spiralAngle) * e.radius,
                             vx: Math.cos(spiralAngle) * 250, vy: Math.sin(spiralAngle) * 250,
                             life: 5.0, damage: e.damage, isBig: true
                         });
                     }
                     soundManager.playEnemyAttack();
                     e.laserTimer = 0.3; // Very rapid fire
                 }
                 if (e.shootTimer <= 0) {
                     // Huge Ring Sweep
                     for (let i = 0; i < 24; i++) {
                         const angle = (Math.PI * 2 / 24) * i;
                         state.enemyBullets.push({
                             x: e.x + Math.cos(angle) * e.radius, y: e.y + Math.sin(angle) * e.radius,
                             vx: Math.cos(angle) * 150, vy: Math.sin(angle) * 150,
                             life: 8.0, damage: e.damage / 2, isBig: false
                         });
                     }
                     soundManager.playEnemyAttack();
                     e.shootTimer = 5.0;
                 }
             } else if (e.type === 'boss_hrrn') {
                 // Executor Mechanic: Aging / Response Ratio Amplification
                 // The longer the wait time `e.W`, the faster and more devastating it becomes
                 const hrrnMultiplier = 1 + Math.min(e.W / 15, 4); // Maxes out scaling at +4x intensity

                 if (e.laserTimer <= 0) {
                     // Focused charging blast that gets wider with age
                     const spreadCount = Math.floor(1 + (hrrnMultiplier * 1.5));
                     for (let i = -spreadCount; i <= spreadCount; i++) {
                         const angle = Math.atan2(dy, dx) + (i * 0.1);
                         state.enemyBullets.push({
                             x: e.x + Math.cos(angle) * e.radius, y: e.y + Math.sin(angle) * e.radius,
                             vx: Math.cos(angle) * 350 * Math.max(1, hrrnMultiplier * 0.5), vy: Math.sin(angle) * 350 * Math.max(1, hrrnMultiplier * 0.5),
                             life: 5.0, damage: e.damage * hrrnMultiplier, isBig: true
                         });
                     }
                     soundManager.playEnemyAttack();
                     e.laserTimer = Math.max(0.6, 4.0 / hrrnMultiplier); // Cooldown strictly decreases
                 }
                 if (e.shootTimer <= 0) {
                     // High velocity snipe
                     const angle = Math.atan2(dy, dx);
                     state.enemyBullets.push({
                         x: e.x + Math.cos(angle) * e.radius, y: e.y + Math.sin(angle) * e.radius,
                         vx: Math.cos(angle) * 500, vy: Math.sin(angle) * 500,
                         life: 6.0, damage: e.damage * hrrnMultiplier * 2, isBig: true // massive damage
                     });
                     soundManager.playEnemyAttack();
                     e.shootTimer = Math.max(0.3, 2.0 / hrrnMultiplier);
                 }
             }
         } else if (e.type === 'turret') {
             if (e.shootTimer === undefined) e.shootTimer = 1.0;
             
             // Turrets don't move or move very slowly. They just shoot towards player.
             e.shootTimer -= dt;
             if (e.shootTimer <= 0 && dist < 800) {
                 state.enemyBullets.push({
                     x: e.x + (dx/dist)*e.radius,
                     y: e.y + (dy/dist)*e.radius,
                     vx: (dx/dist) * 250,
                     vy: (dy/dist) * 250,
                     life: 4.0,
                     damage: e.damage,
                     isBig: false
                 });
                 soundManager.playEnemyAttack();
                 e.shootTimer = 1.0 + Math.random() * 0.5;
             }
         } else if (e.type === 'kamikaze') {
             // Charge directly at player quickly
             e.x += (dx/dist) * e.speed * dt;
             e.y += (dy/dist) * e.speed * dt;
             
             if (dist <= e.radius + state.player.radius + 2) {
                 // Explode immediately on touch
                 const dmg = e.damage;
                 if (state.player.shield > 0) {
                     state.player.shield -= dmg * 1.5;
                     if (state.player.shield < 0) state.player.shield = 0;
                 } else {
                     state.player.hp -= dmg;
                 }
                 if (state.player.hp <= 0 && playerRenderer) playerRenderer.triggerDestruction();
                 else if (playerRenderer) playerRenderer.triggerShield();
                 
                 e.hp = 0; // kill self
                 if (e.renderer) e.renderer.triggerDestruction();
                 soundManager.playExplosion();
             }
         } else {
             if (dist > e.radius + state.player.radius + 2) {
               e.x += (dx/dist) * e.speed * dt;
               e.y += (dy/dist) * e.speed * dt;
             } else {
               // Melee damage
               const dmg = e.damage * dt;
               if (state.player.shield > 0) {
                   state.player.shield -= dmg * 1.5;
                   if (state.player.shield < 0) state.player.shield = 0;
               } else {
                   state.player.hp -= dmg;
               }
               // For continuous melee damage, we don't want to spam the sound too fast
               // We'll rely on the visual or trigger only occasionally. 
               // Let's add a small chance to play so it doesn't overwhelm
               if (Math.random() < 0.05) soundManager.playTakeDamage();
             }
         }
      });

      // Collisions
      state.bullets.forEach(b => {
         if (b.life <= 0) return;
         state.enemies.forEach(e => {
            if (e.hp <= 0) return;
            const dist = Math.hypot(b.x - e.x, b.y - e.y);
            if (dist < e.radius + 5) { // 5 is bullet radius roughly
              const dmg = 34 * (b.damageMult || 1);
              e.hp -= dmg; // approx 3 hits for tank, 1 for grunt
              if (e.hp <= 0 && e.renderer) e.renderer.triggerDestruction();
              else if (e.renderer) e.renderer.triggerShield();
              
              e.flashTimer = 0.1;
              state.damageNumbers.push({
                 x: e.x + (Math.random() - 0.5) * 20,
                 y: e.y - e.radius - 10 + (Math.random() - 0.5) * 20,
                 amount: dmg,
                 life: 1.0,
                 vy: -30
              });
              b.life = -1;
              for (let i = 0; i < 6; i++) {
                state.particles.push({
                   x: b.x,
                   y: b.y,
                   vx: (Math.random() - 0.5) * 300,
                   vy: (Math.random() - 0.5) * 300,
                   life: 0.15 + Math.random() * 0.15,
                   color: '#F59E0B'
                });
              }
            }
         });

         if (b.life > 0) {
            state.asteroids.forEach(a => {
                if (a.hp <= 0) return;
                const dist = Math.hypot(b.x - a.x, b.y - a.y);
                if (dist < a.radius) {
                    a.hp -= 34 * (b.damageMult || 1);
                    b.life = -1;
                    soundManager.playTakeDamage(); // Add a small hit sound or similar
                    for (let i = 0; i < 6; i++) {
                        const life = 0.3 + Math.random() * 0.4;
                        state.particles.push({
                           x: b.x, y: b.y,
                           vx: (Math.random() - 0.5) * 200,
                           vy: (Math.random() - 0.5) * 200,
                           life: life,
                           maxLife: life,
                           radius: Math.random() * 3 + 1,
                           color: Math.random() > 0.5 ? '#94a3b8' : '#cbd5e1',
                           spin: (Math.random() - 0.5) * 15,
                           isDebris: true,
                           angle: Math.random() * Math.PI * 2,
                           shape: Math.random() > 0.5 ? 'rect' : 'tri'
                        });
                    }
                }
            });
         }
      });
      state.asteroids = state.asteroids.filter(a => {
         if (a.hp <= 0) {
             soundManager.playExplosion();
             const debrisCount = Math.floor(Math.random() * 10) + 12; // 12-21 debris
             for (let i = 0; i < debrisCount; i++) {
                 const life = 0.6 + Math.random() * 1.5;
                 state.particles.push({
                     x: a.x + (Math.random() - 0.5) * a.radius,
                     y: a.y + (Math.random() - 0.5) * a.radius,
                     vx: a.vx * 0.5 + (Math.random() - 0.5) * 300,
                     vy: a.vy * 0.5 + (Math.random() - 0.5) * 300,
                     radius: Math.random() * 8 + 3,
                     life: life,
                     maxLife: life,
                     color: Math.random() > 0.5 ? '#64748b' : '#334155',
                     spin: (Math.random() - 0.5) * 12,
                     isDebris: true,
                     angle: Math.random() * Math.PI * 2,
                     shape: Math.random() > 0.5 ? 'rect' : 'tri'
                 });
             }
             return false;
         }
         return true;
      });

      // Cleanup & Stats
      state.bullets = state.bullets.filter(b => b.life > 0);
      state.particles = state.particles.filter((p: any) => p.life > 0);
      state.damageNumbers.forEach((d: any) => {
          d.y += d.vy * dt;
          d.life -= dt;
      });
      state.damageNumbers = state.damageNumbers.filter((d: any) => d.life > 0);
      let scoreGained = 0;
      state.enemies = state.enemies.filter(e => {
         if (e.hp <= 0) {
            if (!e.isDeadInit) {
               // First frame of death
               e.isDeadInit = true;
               scoreGained += e.type.startsWith('boss') ? (e.type === 'boss' ? 500 : 2500) : (['tank', 'turret'].includes(e.type) ? 50 : (e.type === 'kamikaze' ? 20 : 10));
               state.activeEnemies.delete(e.id);
               state.readyQueue = state.readyQueue.filter(id => id !== e.id);
               const deathParticleCount = e.type.startsWith('boss') ? (e.type === 'boss' ? 50 : 150) : 15;
               for (let i = 0; i < deathParticleCount; i++) {
                  const isMassive = e.type !== 'boss' && e.type.startsWith('boss');
                  state.particles.push({
                     x: e.x,
                     y: e.y,
                     vx: (Math.random() - 0.5) * (e.type.startsWith('boss') ? (isMassive ? 1400 : 800) : 400),
                     vy: (Math.random() - 0.5) * (e.type.startsWith('boss') ? (isMassive ? 1400 : 800) : 400),
                     life: 0.2 + Math.random() * (e.type.startsWith('boss') ? 0.6 : 0.3),
                     maxLife: 0.8,
                     radius: isMassive ? Math.random() * 8 + 3 : Math.random() * 2 + 1,
                     isDebris: isMassive && Math.random() < 0.5,
                     spin: (Math.random() - 0.5) * 15,
                     shape: Math.random() > 0.5 ? 'rect' : 'tri',
                     color: e.type.startsWith('boss') ? '#ec4899' : (e.type === 'tank' ? '#ef4444' : '#f43f5e')
                  });
               }
               if (Math.random() < 0.45) {
                   const rand = Math.random();
                   let cType = 'ammo';
                   if (rand < 0.20) cType = 'health';
                   else if (rand < 0.40) cType = 'shield';
                   else if (rand < 0.60) cType = 'speed';
                   else if (rand < 0.80) cType = 'weapon';
                   else cType = 'stamina';

                   state.collectibles.push({
                       x: e.x,
                       y: e.y,
                       type: cType,
                       life: 10.0 // stays for 10 seconds
                   });
               }
            }

            if (e.renderer && e.renderer.fullyDead) {
               return false;
            }
         }
         return true;
      });
      state.score += scoreGained;

      // Collectibles
      state.collectibles.forEach((c: any) => {
          c.life -= dt;
          if (c.life > 0) {
              const dist = Math.hypot(c.x - state.player.x, c.y - state.player.y);
              if (dist < 20 + state.player.radius) { // pickup radius
                  if (c.type === 'health') {
                      state.player.hp = Math.min(100, state.player.hp + 25);
                  } else if (c.type === 'ammo') {
                      state.player.ammo += 30;
                  } else if (c.type === 'shield') {
                      state.player.shield = Math.min(100, state.player.shield + 50);
                  } else if (c.type === 'speed') {
                      state.player.speedTimer = 10.0;
                  } else if (c.type === 'weapon') {
                      state.player.weaponTimer = 10.0;
                  } else if (c.type === 'stamina') {
                      state.player.stamina = Math.min(100, state.player.stamina + 50);
                  }
                  c.life = -1; // collect
                  soundManager.playCollect(c.type);
                  
                  let pColor = '#F59E0B'; // default ammo color
                  if (c.type === 'health') pColor = '#10b981';
                  else if (c.type === 'shield') pColor = '#3b82f6';
                  else if (c.type === 'speed') pColor = '#fbbf24';
                  else if (c.type === 'weapon') pColor = '#dc2626';
                  else if (c.type === 'stamina') pColor = '#a855f7';

                  for (let i = 0; i < 10; i++) {
                     state.particles.push({
                        x: c.x,
                        y: c.y,
                        vx: (Math.random() - 0.5) * 200,
                        vy: (Math.random() - 0.5) * 200,
                        life: 0.2 + Math.random() * 0.2,
                        color: pColor
                     });
                  }
              }
          }
      });
      state.collectibles = state.collectibles.filter((c: any) => c.life > 0);

      // Update HUD safely
      if (scoreRef.current) scoreRef.current.innerText = `${state.score}`;
      const hpPercent = Math.max(0, Math.floor((state.player.hp / state.player.maxHp) * 100));
      if (hpTextRef.current) hpTextRef.current.innerText = `${Math.floor(state.player.hp)}`;
      if (hpRef.current) hpRef.current.style.width = `${hpPercent}%`;
      const shieldPercent = Math.max(0, Math.floor(state.player.shield));
      if (shieldTextRef.current) shieldTextRef.current.innerText = `${shieldPercent}%`;
      if (shieldRef.current) shieldRef.current.style.width = `${shieldPercent}%`;
      const staminaPercent = Math.max(0, Math.floor(state.player.stamina));
      if (staminaTextRef.current) staminaTextRef.current.innerText = `${staminaPercent}%`;
      if (staminaRef.current) staminaRef.current.style.width = `${staminaPercent}%`;
      
      if (powerupRef.current) {
          let buffs = [];
          if (state.player.speedTimer > 0) buffs.push(`SPEED: ${Math.ceil(state.player.speedTimer)}s`);
          if (state.player.weaponTimer > 0) buffs.push(`WPON: ${Math.ceil(state.player.weaponTimer)}s`);
          powerupRef.current.innerText = buffs.join(' | ');
      }

      if (ammoRef.current) ammoRef.current.innerText = `${state.player.ammo}`;

      if (wpn1Ref.current && wpn2Ref.current) {
          const is1 = state.player.selectedWeapon === 1;
          wpn1Ref.current.className = `w-12 h-12 relative flex items-center justify-center font-mono text-[10px] font-bold ${is1 ? 'bg-[#0A0F1F] border-2 border-[#00D9FF] shadow-[0_0_10px_rgba(0,217,255,0.2)] text-[#00D9FF]' : 'bg-[#111827] border border-[#111827] opacity-60 text-slate-500'}`;
          wpn2Ref.current.className = `w-12 h-12 relative flex items-center justify-center font-mono text-[10px] font-bold ${!is1 ? 'bg-[#0A0F1F] border-2 border-[#00D9FF] shadow-[0_0_10px_rgba(0,217,255,0.2)] text-[#00D9FF]' : 'bg-[#111827] border border-[#111827] opacity-60 text-slate-500'}`;
      }

      if (dshRef.current) {
          const isReady = state.player.dashCooldown <= 0 && state.player.stamina >= 15;
          dshRef.current.className = `w-9 h-9 relative flex items-center justify-center font-mono text-[10px] transition-all duration-300 ${isReady ? 'bg-[#111827] border border-[#8B5CF6] text-[#8B5CF6] shadow-[0_0_10px_rgba(139,92,246,0.3)]' : 'bg-[#111827] border border-slate-700 text-slate-600 opacity-50'}`;
      }

      if (shdSkillRef.current) {
          const isReady = state.player.shieldCooldown <= 0 && state.player.stamina >= 20;
          shdSkillRef.current.className = `w-9 h-9 relative flex items-center justify-center font-mono text-[10px] transition-all duration-300 ${isReady ? 'bg-[#111827] border border-[#3b82f6] text-[#3b82f6] shadow-[0_0_10px_rgba(59,130,246,0.3)]' : 'bg-[#111827] border border-slate-700 text-slate-600 opacity-50'}`;
      }

      // Check Death
      if (state.player.hp <= 0 && !state.isGameOver) {
        state.isGameOver = true;
        isDeadRef.current = true;
        onGameOverRef.current(state.score);
      }

      // 6. Drone Auto-Turret (CPU Scheduling mechanism visualization)
      if (state.droneFireTimer === undefined) state.droneFireTimer = 0;
      state.droneFireTimer -= dt;
      if (state.droneFireTimer <= 0) {
          state.activeEnemies.forEach((_, id) => {
              const target = state.enemies.find((e: any) => e.id === id);
              if (target) {
                  const dx = target.x - state.player.x;
                  const dy = target.y - state.player.y;
                  const dist = Math.hypot(dx, dy);
                  if (dist < 1000) {
                      // Fire homing drone shot
                      state.bullets.push({
                          x: state.player.x,
                          y: state.player.y,
                          vx: (dx/dist) * 1200,
                          vy: (dy/dist) * 1200,
                          life: 1.0,
                          damageMult: 0.5 * state.player.damageMult, // Drones do less damage than main gun
                          isDrone: true
                      });
                  }
              }
          });
          state.droneFireTimer = 0.2; // Drone fire rate
      }

      // 7. RENDER
      render(ctx, canvas, state, cameraX, cameraY);
    };

    const render = (ctx: CanvasRenderingContext2D, canvas: HTMLCanvasElement, state: any, cameraX: number, cameraY: number) => {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        ctx.save();
        ctx.translate(-cameraX, -cameraY);

        // Out of bounds background
        ctx.fillStyle = '#03050a'; // darker void
        ctx.fillRect(cameraX, cameraY, canvas.width, canvas.height);

        // Playable area background (space)
        ctx.fillStyle = '#070a14'; // very dark blue space
        ctx.fillRect(0, 0, MAP_WIDTH, MAP_HEIGHT);

        // Render Stars
        const now = performance.now() / 1000;
        stars.forEach(star => {
           const px = star.x + cameraX * star.parallax;
           const py = star.y + cameraY * star.parallax;
           
           // cull offscreen stars based on parallax position
           if (px >= cameraX && px <= cameraX + canvas.width &&
               py >= cameraY && py <= cameraY + canvas.height) {
               
               const twinkleAlpha = star.alpha + Math.sin(now * 3 + star.twinkle) * 0.2;
               ctx.fillStyle = `rgba(255, 255, 255, ${Math.max(0.1, twinkleAlpha)})`;
               ctx.beginPath();
               ctx.arc(px, py, star.r, 0, Math.PI * 2);
               ctx.fill();
           }
        });

        // Grid (faint over space)
        ctx.strokeStyle = 'rgba(17, 24, 39, 0.4)';
        ctx.lineWidth = 1;
        const gridS = 50;
        ctx.beginPath();
        
        // draw grid only inside map bounds
        const startX = Math.max(0, cameraX - (cameraX % gridS));
        const startY = Math.max(0, cameraY - (cameraY % gridS));
        const endX = Math.min(MAP_WIDTH, cameraX + canvas.width + gridS);
        const endY = Math.min(MAP_HEIGHT, cameraY + canvas.height + gridS);
        
        for (let x = startX; x <= endX; x += gridS) { 
            ctx.moveTo(Math.floor(x), Math.max(0, cameraY)); 
            ctx.lineTo(Math.floor(x), Math.min(MAP_HEIGHT, cameraY + canvas.height)); 
        }
        for (let y = startY; y <= endY; y += gridS) { 
            ctx.moveTo(Math.max(0, cameraX), Math.floor(y)); 
            ctx.lineTo(Math.min(MAP_WIDTH, cameraX + canvas.width), Math.floor(y)); 
        }
        ctx.stroke();

        // Asteroids
        state.asteroids.forEach(a => {
            // Cull offscreen
            if (a.x < cameraX - a.radius || a.x > cameraX + canvas.width + a.radius || 
                a.y < cameraY - a.radius || a.y > cameraY + canvas.height + a.radius) return;

            ctx.save();
            ctx.translate(a.x, a.y);
            ctx.rotate(a.angle);
            ctx.fillStyle = '#1e293b'; // slate-800
            ctx.strokeStyle = '#334155'; // slate-700
            ctx.lineWidth = 4;
            
            ctx.beginPath();
            // Irregular shape based on their id
            const points = 7;
            for(let i=0; i<points; i++) {
                const angle = (Math.PI * 2 / points) * i;
                // Add some irregularity
                const r = a.radius * (0.8 + ((Math.sin(a.id || i + 1) + 1) / 2) * 0.4);
                if (i === 0) ctx.moveTo(r, 0);
                else ctx.lineTo(Math.cos(angle) * r, Math.sin(angle) * r);
            }
            ctx.closePath();
            ctx.fill();
            ctx.stroke();

            // Craters inside
            ctx.fillStyle = '#0f172a';
            ctx.beginPath();
            ctx.arc(-a.radius * 0.3, -a.radius * 0.2, a.radius * 0.2, 0, Math.PI * 2);
            ctx.fill();
            ctx.beginPath();
            ctx.arc(a.radius * 0.4, a.radius * 0.3, a.radius * 0.15, 0, Math.PI * 2);
            ctx.fill();

            // HP bar
            if (a.hp < 200) {
               ctx.fillStyle = 'rgba(239, 68, 68, 0.5)';
               ctx.fillRect(-a.radius, -a.radius - 15, a.radius * 2 * (a.hp / 200), 4);
            }

            ctx.restore();
        });
        
        // Safe Zone Boundary
        const BOUNDARY_MARGIN = 150;
        ctx.strokeStyle = state.isOutsideSafeZone ? '#EF4444' : 'rgba(239, 68, 68, 0.4)';
        ctx.lineWidth = state.isOutsideSafeZone ? 6 : 2;
        ctx.setLineDash([20, 20]);
        ctx.strokeRect(BOUNDARY_MARGIN, BOUNDARY_MARGIN, MAP_WIDTH - BOUNDARY_MARGIN * 2, MAP_HEIGHT - BOUNDARY_MARGIN * 2);
        ctx.setLineDash([]);
        
        // Real Map Boundary
        ctx.strokeStyle = '#991b1b';
        ctx.lineWidth = 4;
        ctx.strokeRect(0, 0, MAP_WIDTH, MAP_HEIGHT);

        // Warning Overlay
        if (state.isOutsideSafeZone) {
            ctx.fillStyle = 'rgba(239, 68, 68, 0.1)';
            ctx.fillRect(cameraX, cameraY, canvas.width, canvas.height);
            
            ctx.fillStyle = '#EF4444';
            ctx.font = 'bold 36px "Inter", sans-serif';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'top';
            ctx.fillText('WARNING: STRUCTURAL DAMAGE IMMINENT', cameraX + canvas.width / 2, cameraY + 100);
            ctx.font = '24px "Inter", sans-serif';
            ctx.fillText('RETURN TO SAFE ZONE', cameraX + canvas.width / 2, cameraY + 140);
        }

        // Enemies
        const currentWave = Math.floor(state.diffTimer / 30) + 1;
        let cfg = { algo: 'FCFS' as SchedulerAlgo, cores: 2, quantum: 0.5 };
        if (currentWave === 2) {
           cfg = { algo: 'RR', cores: 3, quantum: 0.8 };
        } else if (currentWave === 3) {
           cfg = { algo: 'RR', cores: 4, quantum: 0.4 };
        } else if (currentWave >= 4) {
           cfg = { algo: 'HRRN', cores: Math.min(8, 3 + Math.floor((currentWave - 4) / 2)), quantum: 0.5 };
        }
        
        // Draw inactive enemies first, then active to layer correctly
        const renderEnemy = (e: any, activeData: any) => {
            const isActive = !!activeData;
            ctx.save();
            ctx.translate(e.x, e.y);
            
            ctx.scale(e.spawnScale, e.spawnScale);

            // Removed specific `isActive` checks for special states because they always apply now
            const isDroneTarget = isActive;

            if (isDroneTarget) {
               ctx.beginPath();
               ctx.arc(0, 0, e.radius + 6, 0, Math.PI * 2);
               ctx.strokeStyle = '#00D9FF'; // Cyan Drone Lock
               ctx.lineWidth = 2;
               ctx.setLineDash([4, 6]);
               ctx.stroke();
               ctx.setLineDash([]);
               
               // RR Timer Bar
               if (cfg.algo === 'RR' && activeData.timeRemaining !== undefined) {
                   const ratio = Math.max(0, activeData.timeRemaining / cfg.quantum);
                   ctx.beginPath();
                   ctx.arc(0, 0, e.radius + 6, -Math.PI / 2, -Math.PI / 2 + (Math.PI * 2 * ratio));
                   ctx.strokeStyle = '#f43f5e'; // Rose
                   ctx.lineWidth = 3;
                   ctx.stroke();
               }
            } else if (e.W > 1.5 && cfg.algo === 'HRRN') {
               ctx.beginPath();
               ctx.arc(0, 0, e.radius + 3 + (Math.sin(now * 8) * 2), 0, Math.PI * 2);
               ctx.strokeStyle = '#fbbf24';
               ctx.globalAlpha = Math.min(0.8, (e.W - 1.5) / 4.0);
               ctx.lineWidth = 2;
               ctx.stroke();
               ctx.globalAlpha = 1;
            }

            // Spawn indicator
            if (e.spawnScale < 1) {
                ctx.beginPath();
                ctx.arc(0, 0, e.radius * (1 / e.spawnScale) * 1.5, 0, Math.PI * 2);
                ctx.strokeStyle = 'rgba(255, 255, 255, 0.5)';
                ctx.lineWidth = 2;
                ctx.stroke();
            }

            if (e.renderer) {
                const ex = state.player.x - e.x;
                const ey = state.player.y - e.y;
                const eAngle = Math.atan2(ey, ex) + Math.PI/2;
                
                ctx.save();
                ctx.rotate(eAngle);
                
                // Add colored glow behind the sprite depending on if targeted
                ctx.shadowBlur = isDroneTarget ? 20 : 10;
                ctx.shadowColor = isDroneTarget ? '#00D9FF' : '#be123c'; 
                
                e.renderer.draw(ctx, 0, 0);
                // reset shadow for other things
                ctx.shadowBlur = 0;
                ctx.restore();

                if (e.flashTimer > 0) {
                    ctx.save();
                    ctx.rotate(eAngle);
                    ctx.globalCompositeOperation = 'source-atop';
                    ctx.fillStyle = 'rgba(255, 255, 255, 0.7)';
                    ctx.fillRect(-e.radius * 2, -e.radius * 2, e.radius * 4, e.radius * 4);
                    ctx.restore();
                }
            } else if (e.type.startsWith('boss')) {
                const ex = state.player.x - e.x;
                const ey = state.player.y - e.y;
                let eAngle = Math.atan2(ey, ex) + Math.PI/2;
                if (e.type === 'boss_rr') eAngle = (e.rotationAngle || 0);

                ctx.save();
                ctx.rotate(eAngle);
                ctx.shadowBlur = isDroneTarget ? 40 : 20;
                ctx.shadowColor = isDroneTarget ? '#00D9FF' : '#be123c'; 

                const img = ASSETS_CACHE.bossImages[e.type];
                if (img) {
                    const drawW = e.radius * 2.5;
                    const drawH = e.radius * 2.5;
                    ctx.drawImage(img, -drawW/2, -drawH/2, drawW, drawH);
                } else {
                    ctx.beginPath();
                    ctx.arc(0, 0, e.radius, 0, Math.PI * 2);
                    ctx.fillStyle = e.color;
                    ctx.fill();
                }
                ctx.shadowBlur = 0;

                if (e.flashTimer > 0 && img) {
                    // Primitive flash (won't exactly clip to the png bounds without buffer, but works for effect)
                    ctx.beginPath();
                    ctx.arc(0, 0, e.radius, 0, Math.PI * 2);
                    ctx.fillStyle = 'rgba(255, 255, 255, 0.7)';
                    ctx.fill();
                }
                ctx.restore();
            } else {
                ctx.beginPath();
                ctx.arc(0, 0, e.radius, 0, Math.PI * 2);
                
                if (e.flashTimer > 0) {
                    ctx.fillStyle = '#ffffff';
                } else {
                    ctx.fillStyle = e.color; 
                }
                
                ctx.fill();
                ctx.strokeStyle = isDroneTarget ? '#00D9FF' : '#0A0F1F';
                ctx.lineWidth = 3;
                ctx.stroke();
            }

            // HRRN Queue Indicator
            if (!isDroneTarget && cfg.algo === 'HRRN' && e.spawnScale >= 1) {
               const priority = ((e.W + e.S) / e.S).toFixed(1);
               ctx.fillStyle = '#fbbf24';
               ctx.font = '8px monospace';
               ctx.textAlign = 'center';
               ctx.textBaseline = 'middle';
               ctx.fillText(`P:${priority}`, 0, e.radius + 14);
            } else if (!isDroneTarget && cfg.algo === 'FCFS' && e.spawnScale >= 1) {
               // FCFS Wait Time
               ctx.fillStyle = '#94a3b8';
               ctx.font = '8px monospace';
               ctx.textAlign = 'center';
               ctx.textBaseline = 'middle';
               ctx.fillText(`W:${Math.floor(e.W)}s`, 0, e.radius + 14);
            }

            // HP Bar (visible when damaged or actively engaged)
            if ((e.hp < e.maxHp || isActive) && e.hp > 0) {
               const hpWidth = e.radius * 2;
               const hpHeight = 3;
               const yOffset = -e.radius - 14;
               
               ctx.fillStyle = 'rgba(0, 0, 0, 0.8)';
               ctx.fillRect(-hpWidth/2, yOffset, hpWidth, hpHeight);
               
               const hpPct = Math.max(0, Math.min(1, e.hp / e.maxHp));
               if (hpPct > 0.6) ctx.fillStyle = '#10b981'; // Green
               else if (hpPct > 0.3) ctx.fillStyle = '#fbbf24'; // Yellow
               else ctx.fillStyle = '#ef4444'; // Red
               
               ctx.fillRect(-hpWidth/2, yOffset, hpWidth * hpPct, hpHeight);
            }
            ctx.restore();
        };

        state.enemies.forEach((e: any) => { if (!state.activeEnemies.has(e.id)) renderEnemy(e, null); });
        state.enemies.forEach((e: any) => { if (state.activeEnemies.has(e.id)) renderEnemy(e, state.activeEnemies.get(e.id)); });

        // Damage Numbers
        state.damageNumbers.forEach((d: any) => {
           ctx.save();
           ctx.translate(d.x, d.y);
           // Fade out faster towards end of life
           ctx.globalAlpha = Math.max(0, Math.min(1, d.life * 2));
           
           ctx.font = 'bold 20px "Inter", sans-serif';
           ctx.textAlign = 'center';
           ctx.textBaseline = 'middle';
           
           ctx.strokeStyle = '#000';
           ctx.lineWidth = 3;
           ctx.strokeText(d.amount.toString(), 0, 0);
           
           ctx.fillStyle = '#facc15'; // yellow text
           ctx.fillText(d.amount.toString(), 0, 0);
           
           ctx.restore();
        });

        // Player
        ctx.save();
        ctx.translate(state.player.x, state.player.y);
        
        // Aura Effects
        if (state.player.speedTimer > 0) {
            ctx.beginPath();
            ctx.arc(0, 0, state.player.radius + 12 + Math.sin(now * 15) * 2, 0, Math.PI * 2);
            ctx.strokeStyle = '#fbbf24';
            ctx.lineWidth = 2;
            ctx.stroke();
        }
        if (state.player.weaponTimer > 0) {
            ctx.beginPath();
            ctx.arc(0, 0, state.player.radius + 8 + Math.cos(now * 20) * 2, 0, Math.PI * 2);
            ctx.strokeStyle = '#dc2626';
            ctx.lineWidth = 2;
            ctx.setLineDash([5, 5]);
            ctx.stroke();
            ctx.setLineDash([]);
        }
        if (state.player.shield > 0) {
            ctx.beginPath();
            ctx.arc(0, 0, state.player.radius + 18, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(59, 130, 246, ${Math.min(0.5, state.player.shield / 100)})`;
            ctx.fill();
            ctx.strokeStyle = '#3b82f6';
            ctx.lineWidth = 2;
            ctx.stroke();
        }

        // Render Auto-Target Drones (Cores)
        for(let i = 0; i < cfg.cores; i++) {
            const angle = (now * 2) + (Math.PI * 2 / cfg.cores) * i;
            const dist = state.player.radius + 25;
            ctx.beginPath();
            ctx.arc(Math.cos(angle) * dist, Math.sin(angle) * dist, 4, 0, Math.PI * 2);
            ctx.fillStyle = '#00D9FF';
            ctx.shadowColor = '#00D9FF';
            ctx.shadowBlur = 10;
            ctx.fill();
            ctx.shadowBlur = 0; // reset
        }

        // Gun barrel / Player Sprite
        const dx = state.mouse.x - state.player.x;
        const dy = state.mouse.y - state.player.y;
        const angle = Math.atan2(dy, dx);
        
        if (playerRenderer) {
            ctx.save();
            ctx.rotate(angle + Math.PI / 2);
            
            ctx.shadowBlur = 20;
            ctx.shadowColor = '#0ea5e9'; // Cyan glow
            
            playerRenderer.draw(ctx, 0, 0);
            ctx.shadowBlur = 0;
            ctx.restore();
        } else {
            ctx.rotate(angle);
            ctx.fillStyle = '#94a3b8';
            ctx.fillRect(state.player.radius - 2, -5, 16, 10);
            
            ctx.rotate(-angle);
            ctx.beginPath();
            ctx.arc(0, 0, state.player.radius, 0, Math.PI * 2);
            ctx.fillStyle = '#00D9FF';
            ctx.fill();
            ctx.strokeStyle = '#F8FAFC';
            ctx.lineWidth = 3;
            ctx.stroke();
        }
        ctx.restore();

        // Collectibles
        state.collectibles.forEach((c: any) => {
            ctx.save();
            ctx.translate(c.x, c.y);
            ctx.globalAlpha = Math.min(1, c.life);
            if (c.type === 'health') {
                ctx.fillStyle = '#10b981'; // Green
                ctx.fillRect(-8, -8, 16, 16);
                ctx.fillStyle = '#fff';
                ctx.fillRect(-2, -6, 4, 12);
                ctx.fillRect(-6, -2, 12, 4);
                ctx.shadowColor = '#10b981';
                ctx.shadowBlur = 10;
                ctx.strokeRect(-8, -8, 16, 16);
            } else if (c.type === 'shield') {
                ctx.fillStyle = '#3b82f6'; // Blue
                ctx.beginPath();
                ctx.arc(0, 0, 8, 0, Math.PI * 2);
                ctx.fill();
                ctx.strokeStyle = '#fff';
                ctx.lineWidth = 2;
                ctx.stroke();
                ctx.shadowColor = '#3b82f6';
                ctx.shadowBlur = 10;
            } else if (c.type === 'speed') {
                ctx.fillStyle = '#fbbf24'; // Yellow
                ctx.beginPath();
                ctx.moveTo(0, -10);
                ctx.lineTo(8, 2);
                ctx.lineTo(2, 2);
                ctx.lineTo(0, 10);
                ctx.lineTo(-8, -2);
                ctx.lineTo(-2, -2);
                ctx.closePath();
                ctx.fill();
                ctx.shadowColor = '#fbbf24';
                ctx.shadowBlur = 10;
            } else if (c.type === 'weapon') {
                ctx.fillStyle = '#dc2626'; // Red
                ctx.fillRect(-8, -4, 16, 8);
                ctx.fillStyle = '#fff';
                ctx.fillRect(-4, -4, 2, 8);
                ctx.fillRect(2, -4, 2, 8);
                ctx.shadowColor = '#dc2626';
                ctx.shadowBlur = 10;
            } else if (c.type === 'stamina') {
                ctx.fillStyle = '#a855f7'; // Purple
                ctx.beginPath();
                ctx.moveTo(0, -10);
                ctx.lineTo(8, -2);
                ctx.lineTo(4, -2);
                ctx.lineTo(4, 10);
                ctx.lineTo(-4, 10);
                ctx.lineTo(-4, -2);
                ctx.lineTo(-8, -2);
                ctx.closePath();
                ctx.fill();
                ctx.shadowColor = '#a855f7';
                ctx.shadowBlur = 10;
            } else {
                ctx.fillStyle = '#F59E0B'; // Amber / Ammo
                ctx.fillRect(-8, -6, 16, 12);
                ctx.strokeStyle = '#fff';
                ctx.lineWidth = 2;
                ctx.strokeRect(-8, -6, 16, 12);
                ctx.beginPath();
                ctx.moveTo(-4, -6);
                ctx.lineTo(-4, 6);
                ctx.moveTo(4, -6);
                ctx.lineTo(4, 6);
                ctx.stroke();
                ctx.shadowColor = '#F59E0B';
                ctx.shadowBlur = 10;
            }
            ctx.restore();
        });

        // Bullets
        state.bullets.forEach((b: any) => {
           ctx.save();
           const bulletImg = ASSETS_CACHE.projectiles?.['Bullet'];
           if (bulletImg && !b.isDrone) { // Render default bullet graphic for player gun
               ctx.translate(b.x, b.y);
               ctx.rotate(Math.atan2(b.vy, b.vx) + Math.PI / 2);
               ctx.shadowBlur = 15;
               ctx.shadowColor = '#f59e0b';
               ctx.drawImage(bulletImg, 0, 0, 16, 16, -16, -16, 32, 32);
           } else {
               // Render cyan energy ball for drone lasers
               const color = b.isDrone ? '#00D9FF' : '#F59E0B';
               ctx.shadowBlur = 10;
               ctx.shadowColor = color;
               ctx.fillStyle = color;
               ctx.beginPath();
               ctx.arc(b.x, b.y, b.isDrone ? 5 : 4, 0, Math.PI * 2);
               ctx.fill();
           }
           ctx.restore();
        });

        // Enemy Bullets
        state.enemyBullets.forEach((b: any) => {
           ctx.save();
           const torpedoImg = ASSETS_CACHE.projectiles?.['Torpedo'];
           if (torpedoImg) {
               ctx.translate(b.x, b.y);
               ctx.rotate(Math.atan2(b.vy, b.vx) + Math.PI / 2);
               ctx.shadowBlur = b.isBig ? 25 : 15;
               ctx.shadowColor = b.isBig ? '#ec4899' : '#10b981';
               const w = b.isBig ? 48 : 24;
               const h = b.isBig ? 48 : 24;
               ctx.drawImage(torpedoImg, 0, 0, 32, 32, -w/2, -h/2, w, h);
           } else {
               ctx.shadowBlur = b.isBig ? 20 : 10;
               ctx.shadowColor = b.isBig ? '#ec4899' : '#34d399';
               ctx.fillStyle = b.isBig ? '#ec4899' : '#34d399';
               ctx.beginPath();
               ctx.arc(b.x, b.y, b.isBig ? 8 : 4, 0, Math.PI * 2);
               ctx.fill();
           }
           ctx.restore();
        });

        // Particles
        state.particles.forEach((p: any) => {
           ctx.save();
           ctx.fillStyle = p.color;
           ctx.globalAlpha = Math.max(0, p.maxLife ? p.life / p.maxLife : Math.min(1, p.life / 0.5)); 
           if (p.isDebris) {
               ctx.translate(p.x, p.y);
               ctx.rotate(p.angle || 0);
               ctx.beginPath();
               if (p.shape === 'rect') {
                   ctx.rect(-p.radius/2, -p.radius/2, p.radius, p.radius);
               } else {
                   ctx.moveTo(0, -p.radius);
                   ctx.lineTo(p.radius, p.radius);
                   ctx.lineTo(-p.radius, p.radius);
                   ctx.closePath();
               }
               ctx.fill();
               // Extra inner detail for depth
               ctx.fillStyle = 'rgba(0,0,0,0.3)';
               ctx.fill();
           } else {
               ctx.beginPath();
               ctx.arc(p.x, p.y, p.radius || (Math.random() * 2 + 1), 0, Math.PI * 2);
               ctx.fill();
           }
           ctx.restore();
        });
        ctx.globalAlpha = 1;

        // Crosshair
        ctx.beginPath();
        ctx.moveTo(state.mouse.x - 8, state.mouse.y);
        ctx.lineTo(state.mouse.x + 8, state.mouse.y);
        ctx.moveTo(state.mouse.x, state.mouse.y - 8);
        ctx.lineTo(state.mouse.x, state.mouse.y + 8);
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.4)';
        ctx.lineWidth = 2;
        ctx.stroke();
        ctx.restore(); // restore camera bounds

        // Minimap
        const mCanvas = minimapRef.current;
        if (mCanvas) {
           const mCtx = mCanvas.getContext('2d');
           if (mCtx) {
              mCtx.clearRect(0, 0, mCanvas.width, mCanvas.height);
              
              // Map bounds
              mCtx.strokeStyle = '#991b1b';
              mCtx.lineWidth = 1;
              mCtx.strokeRect(0, 0, mCanvas.width, mCanvas.height);
              
              // Safe Zone on Minimap
              const smx = (150 / MAP_WIDTH) * mCanvas.width;
              const smy = (150 / MAP_HEIGHT) * mCanvas.height;
              const smw = ((MAP_WIDTH - 300) / MAP_WIDTH) * mCanvas.width;
              const smh = ((MAP_HEIGHT - 300) / MAP_HEIGHT) * mCanvas.height;
              mCtx.strokeStyle = state.isOutsideSafeZone ? '#EF4444' : 'rgba(239, 68, 68, 0.4)';
              mCtx.setLineDash([5, 5]);
              mCtx.strokeRect(smx, smy, smw, smh);
              mCtx.setLineDash([]);
              
              // Draw enemies
              state.enemies.forEach((e: any) => {
                 const mx = (e.x / MAP_WIDTH) * mCanvas.width;
                 const my = (e.y / MAP_HEIGHT) * mCanvas.height;
                 
                 mCtx.fillStyle = state.activeEnemies.has(e.id) ? '#38bdf8' : '#EF4444';
                 mCtx.beginPath();
                 mCtx.arc(mx, my, state.activeEnemies.has(e.id) ? 3 : 1.5, 0, Math.PI * 2);
                 mCtx.fill();
              });

              // Collectibles
              state.collectibles.forEach((c: any) => {
                 const cx = (c.x / MAP_WIDTH) * mCanvas.width;
                 const cy = (c.y / MAP_HEIGHT) * mCanvas.height;
                 let mColor = '#F59E0B';
                 if (c.type === 'health') mColor = '#10b981';
                 else if (c.type === 'shield') mColor = '#3b82f6';
                 else if (c.type === 'speed') mColor = '#fbbf24';
                 else if (c.type === 'weapon') mColor = '#dc2626';
                 else if (c.type === 'stamina') mColor = '#a855f7';
                 
                 mCtx.fillStyle = mColor;
                 mCtx.fillRect(cx - 1.5, cy - 1.5, 3, 3);
              });

              // Draw player
              const px = (state.player.x / MAP_WIDTH) * mCanvas.width;
              const py = (state.player.y / MAP_HEIGHT) * mCanvas.height;
              mCtx.fillStyle = '#00D9FF';
              mCtx.beginPath();
              mCtx.arc(px, py, 2.5, 0, Math.PI * 2);
              mCtx.fill();
              
              // viewport rect on minimap
              const vx = (cameraX / MAP_WIDTH) * mCanvas.width;
              const vy = (cameraY / MAP_HEIGHT) * mCanvas.height;
              const vw = (canvas.width / MAP_WIDTH) * mCanvas.width;
              const vh = (canvas.height / MAP_HEIGHT) * mCanvas.height;
              mCtx.strokeStyle = 'rgba(255, 255, 255, 0.4)';
              mCtx.strokeRect(vx, vy, vw, vh);
           }
        }
    };

    initAssets();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', resize);
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [gameKey]); 

  return (
    <div ref={containerRef} className="relative w-full h-full bg-[#0A0F1F] overflow-hidden font-sans select-none border border-[#111827] rounded-xl shadow-[0_0_20px_rgba(0,217,255,0.05)]">
      {/* Top Left: HP / Stamina */}
      <div className="absolute top-4 left-4 flex flex-col gap-3 pointer-events-none z-10 w-56">
        <div className="bg-[#111827]/90 px-4 py-3 border-l-4 border-l-[#EF4444] border border-[#111827] shadow-[0_0_10px_rgba(239,68,68,0.15)]">
           <div className="flex justify-between items-center mb-1.5">
             <span className="text-[10px] text-[#F8FAFC] font-bold tracking-widest uppercase">HP</span>
             <span className="text-[10px] font-mono font-bold text-[#EF4444]" ref={hpTextRef}>100%</span>
           </div>
           <div className="w-full h-2.5 bg-[#0A0F1F] rounded-sm overflow-hidden">
              <div ref={hpRef} className="h-full bg-[#EF4444] w-full transition-all duration-75 relative shadow-[0_0_8px_rgba(239,68,68,0.8)]">
                <div className="absolute inset-0 bg-white/20 w-full"></div>
              </div>
           </div>
        </div>
        
        <div className="bg-[#111827]/90 px-4 py-3 border-l-4 border-l-[#3b82f6] border border-[#111827] shadow-[0_0_10px_rgba(59,130,246,0.15)]">
           <div className="flex justify-between items-center mb-1.5">
             <span className="text-[10px] text-[#F8FAFC] font-bold tracking-widest uppercase">Shield</span>
             <span className="text-[10px] font-mono font-bold text-[#3b82f6]" ref={shieldTextRef}>0%</span>
           </div>
           <div className="w-full h-2.5 bg-[#0A0F1F] rounded-sm overflow-hidden">
              <div ref={shieldRef} className="h-full bg-[#3b82f6] w-0 relative shadow-[0_0_8px_rgba(59,130,246,0.8)] transition-all duration-75">
              </div>
           </div>
        </div>

        <div className="bg-[#111827]/90 px-4 py-3 border-l-4 border-l-[#fbbf24] border border-[#111827] shadow-[0_0_10px_rgba(251,191,36,0.15)]">
           <div className="flex justify-between items-center mb-1.5">
             <span className="text-[10px] text-[#F8FAFC] font-bold tracking-widest uppercase">Stamina</span>
             <span className="text-[10px] font-mono font-bold text-[#fbbf24]" ref={staminaTextRef}>100%</span>
           </div>
           <div className="w-full h-2.5 bg-[#0A0F1F] rounded-sm overflow-hidden">
              <div ref={staminaRef} className="h-full bg-[#fbbf24] w-full relative shadow-[0_0_8px_rgba(251,191,36,0.8)] transition-all duration-75">
              </div>
           </div>
        </div>
        
        <div ref={powerupRef} className="text-[10px] font-mono font-bold text-[#fbbf24] mt-1 shadow-sm drop-shadow-[0_0_5px_rgba(251,191,36,0.8)]">
        </div>
      </div>

      {/* Top Center: Wave / Score / Time */}
      <div className="absolute top-4 left-1/2 -translate-x-1/2 flex flex-col items-center pointer-events-none z-10 w-48">
        <div className="bg-[#111827]/90 border border-[#00D9FF]/30 px-6 py-2 rounded-t flex flex-col items-center shadow-[0_0_15px_rgba(0,217,255,0.1)] w-full">
           <span className="text-[10px] text-[#00D9FF] font-bold tracking-widest uppercase mb-1">WAVE</span>
           <span ref={waveRef} className="text-xl font-bold text-[#F8FAFC] font-mono leading-none tracking-widest">01</span>
        </div>
        <div className="bg-[#0A0F1F]/90 border border-t-0 border-[#00D9FF]/30 px-6 py-1.5 rounded-b flex flex-col items-center w-full">
           <div className="flex justify-between w-full text-[10px] font-mono text-[#F8FAFC]">
             <span>TIME</span>
             <span ref={timeRef} className="text-[#8B5CF6]">00:00</span>
           </div>
           <div className="flex justify-between w-full text-[10px] font-mono text-[#F8FAFC] mt-0.5">
             <span>SCORE</span>
             <span ref={scoreRef} className="text-[#F59E0B]">0</span>
           </div>
        </div>
      </div>

      {/* Top Right: Minimap & Stats */}
      <div className="absolute top-4 right-4 flex gap-4 pointer-events-none z-10">
        <button 
          onClick={togglePause} 
          className="pointer-events-auto bg-[#111827]/90 hover:bg-slate-800 text-slate-400 hover:text-white border border-slate-800 px-3 py-1.5 rounded-lg shadow-lg text-[10px] font-bold tracking-widest flex items-center h-fit transition-colors"
        >
          PAUSE
        </button>
        <div className="flex flex-col items-end gap-2">
        <div className="w-28 h-28 bg-[#111827]/90 border border-[#8B5CF6]/40 p-1 flex items-center justify-center relative overlow-hidden shadow-[0_0_10px_rgba(139,92,246,0.15)]">
          {/* Minimap Canvas */}
          <canvas ref={minimapRef} width={100} height={100} className="w-full h-full bg-[#0A0F1F] border border-[#111827] relative" />
          <div className="absolute -bottom-2 -left-2 bg-[#8B5CF6] text-white text-[9px] font-mono px-1.5 py-0.5 rounded-sm">MAP</div>
        </div>
        <div className="bg-[#111827]/90 border border-[#EF4444]/40 px-3 py-1.5 shadow-[0_0_10px_rgba(239,68,68,0.1)]">
           <span ref={targetsRef} className="text-[10px] text-[#EF4444] font-mono font-bold">TARGETS: 0</span>
        </div>
        </div>
      </div>

      {/* Floating Notification */}
      <div 
        ref={notificationRef} 
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-[50%] pointer-events-none z-50 flex flex-col items-center justify-center text-center opacity-0 transition-opacity duration-300"
      >
      </div>

      {/* Controls Info overlays */}
      <div className="absolute bottom-4 left-4 text-[10px] font-mono text-slate-500 font-bold flex flex-col gap-1 pointer-events-none z-10">
          <div>[W A S D] MOVE</div>
          <div>[SHIFT]   BOOST</div>
          <div>[MOUSE]   AIM & FIRE</div>
          <div>[ESC]     PAUSE</div>
      </div>

      {/* Bottom: Weapon Slots & Ammo */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-6 items-end pointer-events-none z-10">
        {/* Weapons */}
        <div className="flex gap-2">
          <div ref={wpn1Ref} className="w-12 h-12 bg-[#0A0F1F] border-2 border-[#00D9FF] shadow-[0_0_10px_rgba(0,217,255,0.2)] relative flex items-center justify-center font-mono text-[#00D9FF] text-[10px] font-bold">
            WPN-1
            <div className="absolute -top-2 -left-2 bg-[#00D9FF] text-[#0A0F1F] px-1 text-[8px] rounded-sm">1</div>
          </div>
          <div ref={wpn2Ref} className="w-12 h-12 bg-[#111827] border border-[#111827] opacity-60 relative flex items-center justify-center font-mono text-slate-500 text-[10px] font-bold">
            WPN-2
            <div className="absolute -top-2 -left-2 bg-slate-800 text-slate-400 px-1 text-[8px] rounded-sm">2</div>
          </div>
        </div>

        {/* Ammo */}
        <div className="bg-[#111827]/90 px-6 py-1.5 border-l-4 border-[#F59E0B] flex flex-col items-center">
            <span className="text-[9px] text-[#F8FAFC] tracking-widest">AMMO</span>
            <span className="text-xl font-mono text-[#F59E0B] font-bold leading-none"><span ref={ammoRef}>150</span><span className="text-xs text-slate-500"></span></span>
        </div>

        {/* Skills */}
        <div className="flex gap-2">
          <div ref={dshRef} className="w-9 h-9 bg-[#111827] border border-[#8B5CF6] relative flex items-center justify-center font-mono text-[#8B5CF6] text-[10px]">
            DSH
            <div className="absolute -bottom-1 right-0 bg-[#8B5CF6] text-white px-1 text-[7px] rounded-sm">Q</div>
          </div>
          <div ref={shdSkillRef} className="w-9 h-9 bg-[#111827] border border-slate-700 relative flex items-center justify-center font-mono text-slate-500 text-[10px]">
            SHD
            <div className="absolute -bottom-1 right-0 bg-slate-700 text-white px-1 text-[7px] rounded-sm">E</div>
          </div>
        </div>
      </div>
      
      <canvas ref={canvasRef} className="block w-full h-full z-0 cursor-none relative" />

      {isPaused && (
        <div className="absolute inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex flex-col items-center justify-center p-6">
          <h2 className="text-4xl font-bold text-white mb-2 tracking-tight">PAUSED</h2>
          <p className="text-slate-400 mb-8 max-w-md text-center">System operation suspended.</p>

          <div className="flex gap-4">
            <button 
              onClick={togglePause}
              className="flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white px-8 py-3 rounded-xl font-bold shadow-lg transition-all focus:ring-4 focus:ring-indigo-500/20 active:scale-95"
            >
              Resume Operation
            </button>
            <button 
              onClick={onReturnMenu}
              className="flex items-center justify-center gap-2 bg-slate-800 hover:bg-slate-700 text-white px-8 py-3 rounded-xl font-bold shadow-lg transition-all focus:ring-4 focus:ring-slate-500/20 active:scale-95"
            >
              Main Menu
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
