export type HudElementId = 'moveJoystick' | 'aimJoystick' | 'wpnBtn' | 'shdBtn' | 'dshBtn' | 'hpBar';

export interface HudElementState {
  x: number; // percentage (0-100)
  y: number; // percentage (0-100)
  scale: number;
  opacity: number;
}

export type HudLayout = Record<HudElementId, HudElementState>;

export const DEFAULT_LAYOUT: HudLayout = {
  moveJoystick: { x: 15, y: 75, scale: 1, opacity: 0.7 },
  aimJoystick: { x: 85, y: 75, scale: 1, opacity: 0.8 },
  wpnBtn: { x: 75, y: 55, scale: 1, opacity: 0.9 },
  shdBtn: { x: 65, y: 68, scale: 1, opacity: 0.9 },
  dshBtn: { x: 60, y: 88, scale: 1, opacity: 0.9 },
  hpBar: { x: 50, y: 92, scale: 1, opacity: 1 },
};

export function getSavedLayout(): HudLayout {
  const saved = localStorage.getItem('hudLayout');
  if (saved) {
    try {
      const parsed = JSON.parse(saved);
      return { ...DEFAULT_LAYOUT, ...parsed };
    } catch (e) {}
  }
  return DEFAULT_LAYOUT;
}

export function saveLayout(layout: HudLayout) {
  localStorage.setItem('hudLayout', JSON.stringify(layout));
}
