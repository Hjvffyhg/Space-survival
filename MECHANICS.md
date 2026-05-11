# MECHANICS.md

## Overview
**Void OS: Space Scheduler** is a top-down, survival space shooter that ties standard arcade mechanics to underlying CPU scheduling logic. You pilot an experimental vessel—the "Kernel"—maneuvering through hostile space while managing vital statistics, upgrading equipment, and destroying algorithmic alien swarms.

---

## 1. Core Resources

- **HP (Hull Integrity):** Your primary health pool. If it drops to `0`, the ship is destroyed, triggering a Game Over.
- **Energy Shield (Blue Aura):** A regenerative barrier surrounding your ship. It absorbs physical collision and projectile damage before HP is affected. It recharges automatically after avoiding damage for a set duration.
- **Stamina (Yellow Bar):** Used for boosting and advanced evasive maneuvers. Recharges naturally over time.
- **Ammo:** A finite resource consumed by heavy secondary weapons (e.g., Missiles). Restored via pickups.

---

## 2. Controls & Movement

*   **PC / Desktop:**
    *   **W, A, S, D** or **Arrow Keys:** Movement
    *   **Shift:** Boost / Dash (Consumes Stamina)
    *   **Mouse Cursor:** Aim the ship's turrets
    *   **Left Click:** Fire selected weapon
    *   **1, 2 / Q, E:** Swap weapon systems
    *   **P:** Enter Autopilot Sandbox Mode
    *   **ESC:** Pause / Open Menu

*   **Mobile / Touch:**
    *   **Left Virtual Joystick:** Omni-directional thrust/movement
    *   **Right Virtual Joystick:** Independent 360-degree aiming (Twin-stick style)
    *   **On-Screen Buttons:** Trigger Boost, toggle Shields, swap Weapons.

---

## 3. The Alien Swarm & Combat AI

The alien faction uses advanced "Operating System" scheduling patterns to direct combat. 

### Enemy Types:
- **Grunts (Scouts):** Small, aggressive fighters that charge or flank in basic patterns. High numbers, low health. 
- **Tanks (Dreadnoughts):** Slow, heavily armored juggernauts shooting wider, devastating spreads. 
- **Kamikaze (Bombers):** Extremely fast units that attempt to ram the player for massive collision damage.
- **Turrets (Support Ships):** Stationary or slow-moving platforms outputting sustained suppressing fire. 
- **Bosses:** Massive capital ships combining multiple bullet-hell attacks (sweeping lasers, bursts, homing swarms) scaled by the AI algorithm.

### Bullet Behaviors (The AI Director)
Bullet patterns and speeds dynamically shift based on the currently active CPU scheduling algorithm in the top-right HUD:
1. **First-Come, First-Served (FCFS):** Linear and predictive patterns. Grunts fire fast shots, while Bosses shoot massive slow-moving linear fireballs.
2. **Round-Robin (RR):** Rotational patterns. Enemies deploy sweeping radial fire, alternating turrets, and clustered bursts over time quantums.
3. **Highest Response Ratio Next (HRRN):** Advanced predictive targeting. Enemies scale up their damage and velocity over time, mimicking an exponentially increasing processing priority. Bosses fire continuous sweeping lasers or heavy targeted snipes.

---

## 4. Hangar (Shop & Upgrades)

Players accumulate **Credits (CTR)** through gameplay, based on high scores and survival. In the Armory/Hangar, CTR can be spent to permanently upgrade your vessel or purchase entirely new ships.

### Ship Types
- **Fighter:** Standard issue all-rounder. (Default)
- **Scout:** High speed, fragile hull. Hit and run tactics.
- **Bomber:** Heavy armor, low speed. Payload specialist.
- **Frigate:** Advanced military vessel. Superior shields.
- **Battlecruiser:** Massive capital ship. Slow but devastating.

### Upgrades
- **Hull Reinforcement:** Increases max HP per level.
- **Weapon Overclock:** Increases raw damage output per level.
- **Advanced Thrusters:** Increases base movement speed per level.

---

## 5. Environmental Hazards

- **Asteroid Belts:** Floating rock fields. Asteroids vary in size and mass. Colliding with them deals kinetic damage to shields and hull. They can also absorb weapon fire, acting as dynamic cover.
- **The Safe Zone:** Extending too far outwards triggers a visual warning ("STRUCTURAL DAMAGE IMMINENT"). Staying outside the map boundaries causes rapid continuous damage to your HP.

---

## 6. Powerups & Pickups

During combat, destroying alien ships yields floating tech debris:
- **Green Cross (+):** Health pickup, instantly repairs a portion of Hull HP.
- **Blue Circle with Outline:** Shield pickup, restores a portion of energy shield capacity.
- **Yellow Arrows (>>):** Speed pickup, temporarily overloads thrusters for increased movement speed.
- **Red Icon (W):** Weapon pickup, overdrives weapon systems for increased fire rate.
- **Purple Icon (Stamina):** Stamina pickup, restores Stamina used for boosting.
- **Orange Cubes:** Ammo drop, restoring secondary weapon reserves.

---

## 7. CPU Cores (Auto-Turret Drones)

Surrounding your ship are friendly **Drones** acting as independent auto-turrets. The number of active drones visually correlates to the "CPU Cores" configured in the underlying scheduling algorithm simulation. They orbit your ship and intelligently acquire and fire upon threats according to the active algorithm's logic.

---

## 8. AutoPilot Sandbox Agent

Pressing `P` (or the equivalent toggle button) hands over control to the **AI TESTER**. 
The AI handles navigation, aiming, dodging, and shooting based on priority metrics. It dynamically calculates intercept vectors for incoming projectiles and calculates optimal paths to avoid collisions, letting the player or developers observe optimized gameplay.
