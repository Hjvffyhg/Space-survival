#  Progress Report #2
## "Gameplay"

### A. How to Play

#### Mechanics
You pilot an advanced experimental spacecraft using either mouse/keyboard or touch joysticks. Your primary objective is to maneuver through deep space, dodge incoming projectiles, manage your stamina, and utilize your arsenal to destroy the alien threat.

**Controls:**
*   **Movement:** WASD / Arrow Keys (Desktop) or Left Virtual Joystick (Mobile)
*   **Aim/Fire:** Mouse Cursor (Desktop) or Right Virtual Joystick (Mobile)
*   **Weapons & Abilities:** 
    *   **Primary Fire:** Auto-fires towards the crosshair/aim direction.
    *   **Missiles (Secondary / WPN):** Homing projectiles that deal explosive area damage.
    *   **Shield (SHD / Q / Shift):** Deploys a temporary energy barrier absorbing all damage.
    *   **Dash (Space / DASH):** Consumes Stamina for a rapid evasive burst.
    *   **Pause (P / Esc):** Suspends the game and opens the menu.

**Environmental Hazards:**
*   **Asteroid Fields:** Massive floating rocks that can block your shots and deal severe damage on impact. Maneuver carefully through dense belts.
*   **Radiation Zones:** Staying out of the designated "Safe Zone" border for too long will slowly damage your hull.

**In-Game Visuals & Feedback:**
*   **Player Response to Aliens:** As you engage the horde, your weapons emit brilliant projectiles and cause explosions generating screen shake. Picking up power-ups visually alters your ship. When hull integrity drops, red flashing borders warn of critical damage.
*   **The Blue Circle (Energy Shield):** The glowing translucent blue circle encompassing your ship is your active Shield. This absorbs collision and blaster damage. As it takes damage, it depletes until shattered.
*   **The Boss Encounters:** A massive, blaring red "WARNING" banner overtakes the screen when a Boss jumps into the sector. Bosses are significantly larger, possess unique attack patterns, and take concerted firepower to bring down.
*   **The Wave Progression:** Located at the top of your HUD, the Wave Counter tracks your survival depth. The environment scales alien spawn rates and health based on your current Wave.

#### 1. How to Win
This is an endless survival and progression game. "Winning" is defined by surviving increasingly difficult waves, defeating massive bosses, and accumulating a high score to unlock higher Kardashev Scale "Galaxy Modes" (up to God Tier). Every run earns you Credits (CTR) to permanently upgrade your ships in the Fleet Hangar.

#### 2. How to Lose
Your run ends when your ship's HP (Hull Integrity) drops to 0. You can take damage by getting hit by alien fire, crashing into asteroids, getting rammed by alien vessels, or staying outside the designated Safe Zone for too long.

#### 3. How to Try Again
When your ship is destroyed, a "SHIP DESTROYED" transmission modal will appear. You can immediately jump back into the action by pressing the **Launch Again** button, which throws you right back into wave 1 with your currently equipped ship.

#### 4. How to Restart
If you wish to change your loadout, upgrade your ship, or select a different Galaxy Mode, you can click the **Main Menu** button from the Game Over screen. Alternatively, you can restart at any time during gameplay by opening the **PAUSE** menu and selecting **Abort Mission**.

---

### B. Powerups / Rewards / Points

*   **Credits (CTR):** The primary currency. Earned by destroying enemies and surviving. Spend CTR in the Armory/Hangar to upgrade stats (HP, Speed, Damage) and unlock new vessels.
*   **High Score:** Your best run determines your Galaxy Mode unlocks. Destroying elite enemies and bosses yields massive score points.
*   **Health Kits (+):** Green drops from destroyed targets that instantly heal a portion of your Hull Integrity.
*   **Speed Boosts (>>):** Blue drops that temporarily overload your thrusters, giving you massive speed to escape crossfire.
*   **Weapon Overdrives (W):** Red drops that supercharge your cannons for rapid, devastating attacks.
*   **Combat Drones:** Deployable automated units that orbit your ship and provide covering fire against nearby targets.

---

### C. Story Mode

The Earth is in danger. A big alien spaceship is coming from space. They want to take over our planet. So, all the countries on Earth worked together. 

A man named Mr. Daniel Pads had a great idea. He made a plan and started building a spaceship. This spaceship would stop the aliens and their bad plans. 

You are the pilot chosen for this experimental vessel. Your mission: intersect the Kla'ed armada before they reach Earth's atmosphere, and ensure humanity's survival.

---

### D. Alien AI & Scheduling Algorithms

This game uses advanced CPU Operating System scheduling paradigms (such as **FCFS**, **RR**, and **HRRN**) to dictate how the alien horde spawns and attacks you! 

You can view these Three Scheduling Algorithms in two specific locations:

1. **The In-Game HUD (Top Right):** During any gameplay run, look underneath your Minimap in the top-right corner. There is a **CPU ALGO** widget that actively displays which of the three algorithms the director is currently using to control the horde.
2. **The "Settings / Systems Report" (Main Menu):** Click the **Settings** button from the Main Menu. Once inside, click the **AI System Docs** or **Tech Tree** tabs on the left sidebar. This area serves as a detailed encyclopedia and contains interactive breakdowns, visualizations, and comprehensive explanations of how **FCFS** (First-Come, First-Served), **RR** (Round Robin), and **HRRN** (Highest Response Ratio Next) govern alien behavior in the game.

---

### E. What is "AI" in this Game?

In this game, Artificial Intelligence (AI) takes on two primary roles:

1. **The Alien Swarm Director (CPU Scheduling AI):** Instead of using standard, simple "move towards player" scripts, the alien enemies' spawns and attacks are governed by an overarching AI director running on CPU Scheduling Algorithms (*FCFS*, *RR*, *HRRN*). The AI acts like an operating system determining which alien gets the "CPU time" to attack or spawn based on its priority metrics, creating mathematically diverse swarms and difficulty spikes.
2. **The AutoPilot Sandbox Agent:** Pressing the `P` key engages the **AI TESTER**. This is an automated algorithmic agent that takes over the player's ship, calculating vectors to dodge damage, target priority threats, and manage resources automatically. It allows players or developers to witness the game playing itself optimally through the environment.
