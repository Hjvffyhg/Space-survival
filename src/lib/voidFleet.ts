// ============================================================
//  lib/voidFleet.ts
//  Void Fleet Pack 1 — sprite loader, animator, ship renderer
//  Assets must be placed at: public/VoidFleetPack/<Ship>/<Layer>.png
// ============================================================

// ------------------------------------------------------------
//  TYPES
// ------------------------------------------------------------
export type ShipName =
  | 'Fighter'
  | 'Scout'
  | 'Bomber'
  | 'Frigate'
  | 'Support ship'
  | 'Torpedo Ship'
  | 'Battlecruiser'
  | 'Dreadnought';

export type ProjectileName =
  | 'Bullet'
  | 'Big Bullet'
  | 'Ray'
  | 'Torpedo'
  | 'Wave';

export type LayerName = 'Base' | 'Engine' | 'Shield' | 'Weapons' | 'Destruction';

export interface ShipConfig {
  /** Sprite frame size in px (both width and height — always square) */
  size: 64 | 128;
  engine:      number;
  shield:      number | null;
  weapons:     number | null;
  destruction: number;
}

export interface ProjectileConfig {
  frameW:  number;
  frameH:  number;
  frames:  number;
}

export type ShipSprites = Record<LayerName, HTMLImageElement | null>;

// ------------------------------------------------------------
//  MANIFEST
// ------------------------------------------------------------
export const SHIP_CONFIGS: Record<ShipName, ShipConfig> = {
  'Fighter':      { size: 64,  engine: 10, shield: 10, weapons: 6,    destruction: 9  },
  'Scout':        { size: 64,  engine: 10, shield: 14, weapons: 6,    destruction: 10 },
  'Bomber':       { size: 64,  engine: 10, shield: 6,  weapons: null, destruction: 8  },
  'Frigate':      { size: 64,  engine: 12, shield: 40, weapons: 6,    destruction: 9  },
  'Support ship': { size: 64,  engine: 10, shield: null, weapons: null, destruction: 10 },
  'Torpedo Ship': { size: 64,  engine: 10, shield: 10, weapons: 16,   destruction: 10 },
  'Battlecruiser':{ size: 128, engine: 12, shield: 16, weapons: 30,   destruction: 14 },
  'Dreadnought':  { size: 128, engine: 12, shield: 10, weapons: 60,   destruction: 12 },
};

export const PROJECTILE_CONFIGS: Record<ProjectileName, ProjectileConfig> = {
  'Bullet':     { frameW: 16, frameH: 16, frames: 1 },
  'Big Bullet': { frameW: 16, frameH: 16, frames: 2 },
  'Wave':       { frameW: 64, frameH: 64, frames: 6 },
  'Torpedo':    { frameW: 32, frameH: 32, frames: 1 },
  'Ray':        { frameW: 38, frameH: 38, frames: 1 },
};

// ------------------------------------------------------------
//  IMAGE LOADER
// ------------------------------------------------------------
function loadImage(src: string): Promise<HTMLImageElement | null> {
  return new Promise((resolve) => {
    const img = new Image();
    img.onload  = () => resolve(img);
    img.onerror = () => { console.warn(`[VoidFleet] Missing asset: ${src}`); resolve(null); };
    img.src = src;
  });
}

/** Load all layer PNGs for one ship. Call once and cache the result. */
export async function loadShip(name: ShipName): Promise<ShipSprites> {
  const layers: LayerName[] = ['Base', 'Engine', 'Shield', 'Weapons', 'Destruction'];
  const entries = await Promise.all(
    layers.map(async (l) => [l, await loadImage(`/VoidFleetPack/${name}/${l}.png`)] as const)
  );
  return Object.fromEntries(entries) as ShipSprites;
}

/** Load one projectile PNG. */
export async function loadProjectile(name: ProjectileName): Promise<HTMLImageElement | null> {
  return loadImage(`/VoidFleetPack/Projectiles/${name}.png`);
}

/** Load every projectile at once. */
export async function loadAllProjectiles(): Promise<Record<ProjectileName, HTMLImageElement | null>> {
  const names = Object.keys(PROJECTILE_CONFIGS) as ProjectileName[];
  const entries = await Promise.all(
    names.map(async (n) => [n, await loadProjectile(n)] as const)
  );
  return Object.fromEntries(entries) as Record<ProjectileName, HTMLImageElement | null>;
}

// ------------------------------------------------------------
//  ANIMATED SPRITE
//  Horizontal strip — all frames are frameW × frameH, left-to-right.
// ------------------------------------------------------------
export class AnimSprite {
  img:        HTMLImageElement | null;
  frameW:     number;
  frameH:     number;
  frameCount: number;
  fps:        number;
  loop:       boolean;

  frame  = 0;
  timer  = 0;
  done   = false;

  constructor(
    img:        HTMLImageElement | null,
    frameW:     number,
    frameH:     number,
    frameCount: number,
    fps    = 12,
    loop   = true,
  ) {
    this.img        = img;
    this.frameW     = frameW;
    this.frameH     = frameH;
    this.frameCount = frameCount;
    this.fps        = fps;
    this.loop       = loop;
  }

  /** Call every frame with delta-time in seconds. */
  update(dt: number): void {
    if (this.done || !this.img) return;
    this.timer += dt;
    const interval = 1 / this.fps;
    while (this.timer >= interval) {
      this.timer -= interval;
      this.frame++;
      if (this.frame >= this.frameCount) {
        if (this.loop) {
          this.frame = 0;
        } else {
          this.frame = this.frameCount - 1;
          this.done  = true;
        }
      }
    }
  }

  /** Draw centred at (x, y). scale defaults to 1. */
  draw(ctx: CanvasRenderingContext2D, x: number, y: number, scale = 1): void {
    if (!this.img) return;
    const dw = this.frameW  * scale;
    const dh = this.frameH * scale;
    ctx.drawImage(
      this.img,
      this.frame * this.frameW, 0, this.frameW, this.frameH,
      Math.round(x - dw / 2),
      Math.round(y - dh / 2),
      dw, dh,
    );
  }

  /** Restart the animation from frame 0. */
  reset(): void {
    this.frame = 0;
    this.timer = 0;
    this.done  = false;
  }
}

// ------------------------------------------------------------
//  SHIP RENDERER
//  Manages the 5-layer stack for one ship instance.
// ------------------------------------------------------------
export class ShipRenderer {
  cfg:    ShipConfig;
  scale:  number;

  base:        AnimSprite;
  engine:      AnimSprite;
  shield:      AnimSprite | null;
  weapons:     AnimSprite | null;
  destruction: AnimSprite;

  alive     = true;
  shielded  = false;
  firing    = false;

  constructor(sprites: ShipSprites, cfg: ShipConfig, scale = 3) {
    this.cfg   = cfg;
    this.scale = scale;
    const s    = cfg.size;

    this.base        = new AnimSprite(sprites.Base,        s, s, 1,                  12, true );
    this.engine      = new AnimSprite(sprites.Engine,      s, s, cfg.engine,         12, true );
    this.shield      = cfg.shield   != null
      ? new AnimSprite(sprites.Shield,      s, s, cfg.shield,      12, false)
      : null;
    this.weapons     = cfg.weapons  != null
      ? new AnimSprite(sprites.Weapons,     s, s, cfg.weapons,     12, false)
      : null;
    this.destruction = new AnimSprite(sprites.Destruction, s, s, cfg.destruction,    10, false);
  }

  /** Trigger shield-hit animation. */
  triggerShield(): void {
    if (!this.shield) return;
    this.shielded = true;
    this.shield.reset();
  }

  /** Trigger weapon-fire animation. */
  triggerWeapons(): void {
    if (!this.weapons) return;
    this.firing = true;
    this.weapons.reset();
  }

  /** Kill the ship — switches to destruction animation. */
  triggerDestruction(): void {
    this.alive = false;
    this.destruction.reset();
  }

  /** Returns true once the destruction animation has finished playing. */
  get fullyDead(): boolean {
    return !this.alive && this.destruction.done;
  }

  /** Collision radius in screen pixels. */
  get radius(): number {
    return (this.cfg.size * this.scale) / 2 - 4;
  }

  update(dt: number): void {
    this.engine.update(dt);

    if (this.alive) {
      if (this.shielded && this.shield) {
        this.shield.update(dt);
        if (this.shield.done) this.shielded = false;
      }
      if (this.firing && this.weapons) {
        this.weapons.update(dt);
        if (this.weapons.done) this.firing = false;
      }
    } else {
      this.destruction.update(dt);
    }
  }

  get hasSprites(): boolean {
    return this.base.img != null && this.base.img.naturalWidth > 0;
  }

  /**
   * Draw the ship centred at (x, y).
   * Layer order: Base → Engine → Shield → Weapons  (or Destruction when dead)
   */
  draw(ctx: CanvasRenderingContext2D, x: number, y: number): void {
    const s = this.scale;
    if (!this.hasSprites) {
        // Fallback drawing if sprites failed to load
        ctx.beginPath();
        ctx.arc(x, y, this.radius, 0, Math.PI * 2);
        ctx.fillStyle = this.alive ? '#94a3b8' : '#ef4444';
        ctx.fill();
        ctx.strokeStyle = '#F8FAFC';
        ctx.lineWidth = 2;
        ctx.stroke();
        return;
    }
    
    if (this.alive) {
      this.base.draw(ctx, x, y, s);

      this.engine.draw(ctx, x, y, s);
      if (this.shielded) this.shield?.draw(ctx, x, y, s);
      if (this.firing)   this.weapons?.draw(ctx, x, y, s);
    } else if (!this.destruction.done) {
      this.destruction.draw(ctx, x, y, s);
    }
  }
}
