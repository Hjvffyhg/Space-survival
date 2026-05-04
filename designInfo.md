# Visual Design Spec: 2D Space Combat-Survival Game

**SURVIVAL: AI Enemy Scheduling**

**Executive Summary:** This report details the visual asset requirements for a 2D space shooter action-survival game where a lone space fighter faces off against the relentless Kla'ed armada. We cover **player character (spaceship)** and **enemy ships** (art style, animation, hitboxes, color palettes, silhouettes, equipment), **environment** (deep space, parallax stars, destructible asteroids), **UI/HUD** elements, **VFX/SFX cues**, **camera**, and performance/asset pipelines. Overall vibe: dark deep space adventure, sci-fi dogfights, advanced galactic civilizations. The game features Kardashev Scale "Civilization Modes" (Type 0-7) to scale difficulty. Enemy spawning logic uses FCFS/RR/HRRN algorithms representing the enemy fleet's tactical AI.

- **Player/Character:** **Cyan Sci-Fi Fighter Ship**. Distinct silhouette, fast and maneuverable. Includes thruster particles for movement and boost, shield aura effects, and dual weapon modes (single shot and spread shot).

- **Enemy Archetypes (Kla'ed Armada):**
  1. **Scout/Grunt:** Fast, low HP, direct chase. (Algorithm: First-Come, First-Served).
  2. **Kamikaze (Bomber):** Charges directly at player speed and explodes on impact. (Algorithm: Round-Robin or grouped).
  3. **Turret (Support):** Stationary or slow, high HP, fires heavy projectiles. 
  4. **Tank:** Heavy attacker, medium speed, absorbs damage.
  5. **Dreadnought / Battlecruiser (Boss):** Massive health, spawns minions, fires 360-degree laser bursts. High threat.

- **Environment & Hazards:** Deep space with multiple layers of parallax stars and nebulas. Destructible expanding asteroid fields that damage ships and block projectiles, bouncing around the playfield. A definitive "Safe Zone" boundary; venturing out into deep space causes structural damage.

- **UI/HUD Elements (Outer Space Layout):** 
  - **Top Left:** HP Bar and Shield Bar.
  - **Top Center:** Wave Number, Score, Current Time, Kardashev Civilization Type, Timer.
  - **Top Right:** Minimap showing player, enemies, asteroids, and safe zone boundary.
  - **Bottom Center HUD:**
    - Ammo Count.
    - Weapon Slots (WPN-1, WPN-2) mapped to '1' and '2'.
    - Skills: Dash (DSH) on 'Q' (speed burst) and Shield (SHD) on 'E' (instant shield regen), consuming Stamina.
    - Stamina Bar draining on shifts/dodges and regenerating over time.

- **VFX & SFX Cues:** Exhaust plumes, laser impacts, asteroid cratering, shield hit visual ripple. Glowing bullets, expanding shockwaves on ship explosion, and floating damage numbers. Screen shake on heavy impacts or boss attacks. Parallax starfield for depth.

- **Camera & Resolution:** Top-down perspective following the player. Base Resolution: 1280x720 scaled dynamically to fit the viewport. 

- **Color Palette (Deep Space Sci-Fi):**
  - Primary Background (Deep Space): `#070a14`
  - Deep Void (Out of Bounds): `#03050a`
  - HUD Panels: `#111827` / `#0A0F1F`
  - Player/Cyan Accent: `#00D9FF`
  - Shield/Blue Accent: `#3b82f6`
  - Danger/Enemy Red: `#EF4444` / `#dc2626`
  - Energy/Purple (Stamina): `#a855f7` / `#8B5CF6`
  - Ammo/Gold: `#F59E0B` / `#fbbf24`

## Asset List & Priority
* Player Fighter (Cyan, standard, boost, shield active)
* Kla'ed Armada: Grunt, Tank, Bomber/Kamikaze, Support/Turret, Battlecruiser (Boss)
* Projectiles: Player lasers (blue/cyan), Enemy plasma (red, green)
* Asteroids: Irregular procedural rock shapes with craters
* Collectibles: Ammo crates, shield batteries, speed boots, health packs

**UI/HUD Layout Diagram:**
```
 -------------------------------------------------------------
| HP: [██████░░░]     WAVE 03      Minimap tracking ships/rocks|
| SHD:[████░░░░░]   TIME 02:41                                |
|                   SCORE 1450      CIVILIZATION: TYPE 2      |
|                                                             |
|                      (Top-down Space View)                  |
|                                                             |
|                 [WPN-1][WPN-2] |AMMO| [DSH:Q][SHD:E]        |
|                                [150]                        |
|                     Stamina: [████░░░░░]                    |
 -------------------------------------------------------------
```