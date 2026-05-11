# Void OS: Space Scheduler - Game Details

## Overview
Void OS is a unique top-down 2D space shooter built with React, TypeScript, and HTML5 Canvas. The game features retro pixel art aesthetics, procedural environments, and heavily themes its mechanics around Operating System principles ("Schedulers", "CPU Cores", "Algorithms").

The core gameplay loop involves navigating a vast procedurally generated cosmic void, defeating waves of OS-themed algorithmic bosses, managing resources (Health, Shield, Stamina, Ammo), and upgrading your ship through an Armory.

## Technical Stack & Architecture
- **Framework:** React 18
- **Language:** TypeScript
- **Rendering:** HTML5 `<canvas>` using native 2D Canvas API
- **Assets:** VoidFleetPack (ships & projectiles)
- **Styling:** Tailwind CSS for UI overlays (Main Menu, HUD, Game Over screens, Armory)
- **Audio:** `SoundManager` (Web Audio API) procedurally generating synthesized sound effects (Hit, Explode, Shoot, Powerup, Error, UI Select)

## Core Mechanics

### Control Schemes
The game supports both desktop and mobile platforms seamlessly.
- **Desktop:**
  - `W A S D` - Movement
  - `Shift` - Boost (Consumes Stamina)
  - `Mouse` - Aim and Left Click to Fire
  - `Q` / `E` / `X` - Toggle weapons or use skills
  - `ESC` - Pause
- **Mobile:**
  - Independent dual virtual joysticks for decoupled movement and aiming (`VirtualJoystick.tsx`).
  - Contextual touch buttons for skills and weapons mapping.

### Stats & Resources
- **HP (Health):** The primary life resource. Reaching 0 results in Game Over. Can be restored using Health packs dropped by enemies.
- **Shield:** Regenerative barrier that absorbs damage before HP. Recharges when avoiding hits for a set duration.
- **Stamina:** Depleted while boosting. Recharges over time when not boosting.
- **Ammo:** Consumed by secondary/special weapons. Refillable via drops.

### Upgrades (Armory / Shop)
Players earn tokens matching the OS algorithmic theme, allowing them to purchase:
- Max HP increases
- Damage multiplier boosts
- Speed enhancements
- Max Stamina boosts
- Shield Capacity & Regeneration efficiency upgrades

### Boss Algorithms (CPU ALGO)
The game maps computer scheduling algorithms to boss behaviors and attack styles.
Currently represented algos:
1. **FCFS (First-Come, First-Served):** Linear, predictable, or sequential firing patterns.
2. **RR (Round-Robin):** Rotational behaviors, time-sliced attack patterns or sweeping rotating turrets.
3. **HRRN (Highest Response Ratio Next):** Implements dynamic difficulty scaling. The boss stores waiting time or dynamically calculates the `(W+S)/S` formulation to scale up power exponentially to mimic calculating CPU slice priority over time.

## Visuals & Environments
- **Procedural Backgrounds:** Utilizes generative retro pixel art backdrops spanning:
  - Deep space Starfield (with parallax tracking and chunky pixels)
  - Gas Giants with rings (Procedural off-screen canvas generation scaled with `imageSmoothingEnabled = false` for 8-bit chunky retro scaling)
  - Moons with craters
  - Synthesizing Nebulas
- **Entities:** Drawn via `ShipRenderer` integrating `AnimSprite` structures using sprite sheets extracted computationally from `.zip` via `postinstall` step.

## Ideas for Future Improvement

1. **New OS Bosses (e.g., SJF, Priority, MLFQ):**
   - *Shortest Job First (SJF):* Drops small, fast-moving swarms that prioritize weak players.
   - *Multilevel Feedback Queue (MLFQ):* A staged boss that drops tiers of queues and downgrades/upgrades aggressive behaviors based on response times.

2. **Resource Overheating (Thermal Throttling):**
   - Constant firing should generate "Heat" simulating CPU thermal throttle, forcing players to burst fire rather than hold the mouse down forever.

3. **Memory Leaks (Hazards):**
   - Environmental hazards like "Memory Leaks" (acidic nebulas) that slowly damage players moving through them unless they possess a "Garbage Collector" shield module.

4. **Multiplayer (Co-Op Threads):**
   - Supporting two ships operating as "Dual Threads" sharing the same CPU lifecycle pool.

5. **Particle Enhancements:**
   - Instead of static rendering, implement a lightweight GPU-accelerated WebGL pass or enhanced Canvas composite operation for explosions to feel more substantial.

6. **Story & Lore Datapaths:**
   - Incorporate narrative prompts where the player acts as the "Kernel", battling corrupted user-space threads attempting to crash the monolithic system.

7. **Controller Support:**
   - Hook the standard HTML5 Gamepad API for seamless Twin-Stick controls (Left thumbstick to move, Right thumbstick to aim, Right trigger to shoot, Left trigger to boost).
