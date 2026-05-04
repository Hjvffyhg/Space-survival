// ============================================================
//  EXAMPLE: How to use lib/voidFleet.ts inside GameCanvas.tsx
//  This is a usage guide — adapt it to fit your existing GameCanvas.
// ============================================================

import { useEffect, useRef } from 'react';
import {
  loadShip,
  loadAllProjectiles,
  ShipRenderer,
  AnimSprite,
  SHIP_CONFIGS,
  PROJECTILE_CONFIGS,
} from '../lib/voidFleet';

export default function GameCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current!;
    const ctx    = canvas.getContext('2d')!;

    // CRITICAL: always set this for pixel art
    ctx.imageSmoothingEnabled = false;

    let animId: number;
    let lastTime = performance.now();

    async function init() {
      // 1. Load ship sprites (do this once, then cache / pass via props/context)
      const fighterSprites     = await loadShip('Fighter');
      const dreadnoughtSprites = await loadShip('Dreadnought');
      const projectiles        = await loadAllProjectiles();

      // 2. Create ship renderers
      //    ShipRenderer(sprites, config, scale)
      const player = new ShipRenderer(fighterSprites,     SHIP_CONFIGS['Fighter'],     3);
      const boss   = new ShipRenderer(dreadnoughtSprites, SHIP_CONFIGS['Dreadnought'], 2);

      // 3. Create a bullet AnimSprite
      const bulletCfg = PROJECTILE_CONFIGS['Bullet'];
      const bullet = new AnimSprite(
        projectiles['Bullet'],
        bulletCfg.frameW,
        bulletCfg.frameH,
        bulletCfg.frames,
        12, true,
      );

      // 4. Demo: trigger effects
      setTimeout(() => player.triggerWeapons(),     500);
      setTimeout(() => boss.triggerShield(),       1200);
      setTimeout(() => boss.triggerDestruction(),  2500);

      // 5. Game loop
      function loop(now: number) {
        const dt = Math.min((now - lastTime) / 1000, 0.05);
        lastTime = now;

        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // Update
        player.update(dt);
        boss.update(dt);
        bullet.update(dt);

        // Draw — pass canvas centre positions
        player.draw(ctx, 240, 480);
        boss.draw(ctx,   240, 160);
        bullet.draw(ctx, 240, 300, 2); // x, y, scale

        animId = requestAnimationFrame(loop);
      }

      animId = requestAnimationFrame(loop);
    }

    init();
    return () => cancelAnimationFrame(animId);
  }, []);

  return (
    <canvas
      ref={canvasRef}
      width={480}
      height={640}
      style={{ imageRendering: 'pixelated' }}
    />
  );
}

// ============================================================
//  QUICK REFERENCE — common operations
// ============================================================

/*
  LOAD A SHIP:
    const sprites = await loadShip('Torpedo Ship');
    const ship    = new ShipRenderer(sprites, SHIP_CONFIGS['Torpedo Ship'], 3);

  EACH FRAME:
    ship.update(dt);
    ship.draw(ctx, x, y);

  TRIGGER EFFECTS:
    ship.triggerShield();        // play shield-hit once
    ship.triggerWeapons();       // play fire animation once
    ship.triggerDestruction();   // switch to death animation

  CHECK IF FULLY DEAD:
    if (ship.fullyDead) { ... remove from game ... }

  COLLISION RADIUS:
    const r = ship.radius; // screen pixels, accounts for scale

  LOAD A PROJECTILE:
    const img    = await loadProjectile('Wave');
    const cfg    = PROJECTILE_CONFIGS['Wave'];
    const sprite = new AnimSprite(img, cfg.frameW, cfg.frameH, cfg.frames, 12, true);
    // each frame: sprite.update(dt);  sprite.draw(ctx, x, y, scale);
*/
