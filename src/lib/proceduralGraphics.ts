// src/lib/proceduralGraphics.ts

export function generateNebula(width: number, height: number): HTMLCanvasElement {
  const canvas = document.createElement('canvas');
  // Higher resolution for smooth gradients
  canvas.width = Math.floor(width / 3);
  canvas.height = Math.floor(height / 3);
  const ctx = canvas.getContext('2d')!;
  
  // Deep space void background
  ctx.fillStyle = '#020617'; 
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  
  // Smooth, deep nebula gas clouds
  for (let i = 0; i < 60; i++) {
    const cx = Math.random() * canvas.width;
    const cy = Math.random() * canvas.height;
    const r = Math.random() * 300 + 100;
    const grad = ctx.createRadialGradient(cx, cy, 0, cx, cy, r);
    
    // Using our sleek UI Palette: Cyan, Indigo, Rose
    const colorType = Math.random();
    let rColor, gColor, bColor;
    if (colorType < 0.4) { rColor = 6; gColor = 182; bColor = 212; } // Cyan
    else if (colorType < 0.7) { rColor = 79; gColor = 70; bColor = 229; } // Indigo
    else { rColor = 225; gColor = 29; bColor = 72; } // Rose
    
    grad.addColorStop(0, `rgba(${rColor}, ${gColor}, ${bColor}, 0.08)`);
    grad.addColorStop(1, `rgba(${rColor}, ${gColor}, ${bColor}, 0)`);
    
    ctx.fillStyle = grad;
    ctx.beginPath(); 
    ctx.arc(cx, cy, r, 0, Math.PI * 2); 
    ctx.fill();
  }
  return canvas;
}

export type RetroPlanetType = 'blue-ring' | 'purple-ring' | 'orange-gas' | 'red-planet' | 'green-earth';

export function generatePlanet(type: RetroPlanetType | 'gas-giant' | 'desert' | 'ice'): HTMLCanvasElement {
  // We use a high-res 512x512 canvas for smooth 3D rendering instead of pixel art
  const size = 512; 
  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext('2d')!;
  
  const cx = size / 2;
  const cy = size / 2;
  let radius = 120;

  // Setup planet thematic colors
  let colorStops = ['#60a5fa', '#1e3a8a', '#0f172a'];
  let glowColor = 'rgba(96, 165, 250, 0.4)';
  let hasRing = false;
  let ringColor = 'rgba(147, 197, 253, 0.6)';

  if (type === 'orange-gas') {
      radius = 160;
      colorStops = ['#fb923c', '#c2410c', '#431407'];
      glowColor = 'rgba(251, 146, 60, 0.4)';
  } else if (type === 'purple-ring') {
      radius = 140;
      colorStops = ['#c084fc', '#6b21a8', '#2e1065'];
      glowColor = 'rgba(192, 132, 252, 0.4)';
      hasRing = true;
      ringColor = 'rgba(232, 121, 249, 0.5)';
  } else if (type === 'blue-ring') {
      radius = 120;
      colorStops = ['#22d3ee', '#0369a1', '#082f49'];
      glowColor = 'rgba(34, 211, 238, 0.4)';
      hasRing = true;
      ringColor = 'rgba(125, 211, 252, 0.5)';
  } else if (type === 'red-planet') {
      radius = 90;
      colorStops = ['#fb7185', '#be123c', '#4c0519'];
      glowColor = 'rgba(251, 113, 133, 0.4)';
  } else if (type === 'green-earth') {
      radius = 100;
      colorStops = ['#34d399', '#047857', '#022c22'];
      glowColor = 'rgba(52, 211, 153, 0.4)';
  }

  // 1. Outer Atmosphere Glow
  const glow = ctx.createRadialGradient(cx, cy, radius * 0.9, cx, cy, radius * 1.3);
  glow.addColorStop(0, glowColor);
  glow.addColorStop(1, 'rgba(0,0,0,0)');
  ctx.fillStyle = glow;
  ctx.fillRect(0, 0, size, size);

  // 2. Planet Base Sphere
  ctx.beginPath();
  ctx.arc(cx, cy, radius, 0, Math.PI * 2);

  // 3. 3D Lighting/Shading Gradient
  const sphereGrad = ctx.createRadialGradient(cx - radius*0.3, cy - radius*0.3, 0, cx, cy, radius);
  sphereGrad.addColorStop(0, colorStops[0]); // Highlight
  sphereGrad.addColorStop(0.5, colorStops[1]); // Midtone
  sphereGrad.addColorStop(1, colorStops[2]); // Core Shadow
  ctx.fillStyle = sphereGrad;
  ctx.fill();

  // 4. Atmospheric Gas Bands / Surface Texture
  ctx.save();
  ctx.clip(); // Keep textures strictly inside the sphere
  ctx.globalAlpha = 0.15;
  for(let i = 0; i < 15; i++) {
      ctx.beginPath();
      // Ellipses to simulate spherical wrapping
      const yOff = cy - radius + (i * (radius * 2 / 15));
      ctx.ellipse(cx, yOff, radius, radius * 0.2, 0, 0, Math.PI * 2);
      ctx.fillStyle = i % 2 === 0 ? '#ffffff' : '#000000';
      ctx.fill();
  }
  ctx.restore();

  // 5. Deep Inner Shadow (Enhances the 3D popping effect)
  const innerShadow = ctx.createRadialGradient(cx, cy, radius * 0.7, cx, cy, radius);
  innerShadow.addColorStop(0, 'rgba(0,0,0,0)');
  innerShadow.addColorStop(1, 'rgba(0,0,0,0.8)');
  ctx.fillStyle = innerShadow;
  ctx.beginPath();
  ctx.arc(cx, cy, radius, 0, Math.PI * 2);
  ctx.fill();

  // 6. High-Tech Orbital Rings
  if (hasRing) {
      ctx.save();
      const angle = type === 'blue-ring' ? Math.PI / 6 : -Math.PI / 8;
      ctx.translate(cx, cy);
      ctx.rotate(angle);

      // Render the back half of the ring (Behind planet)
      ctx.beginPath();
      ctx.ellipse(0, 0, radius * 1.8, radius * 0.4, 0, Math.PI, Math.PI * 2);
      ctx.lineWidth = 15;
      ctx.strokeStyle = ringColor;
      ctx.stroke();

      // Render the front half of the ring (In front of planet)
      ctx.beginPath();
      ctx.ellipse(0, 0, radius * 1.8, radius * 0.4, 0, 0, Math.PI);
      
      const ringGrad = ctx.createLinearGradient(-radius * 2, 0, radius * 2, 0);
      ringGrad.addColorStop(0, 'rgba(255,255,255,0.1)');
      ringGrad.addColorStop(0.2, ringColor);
      ringGrad.addColorStop(0.8, ringColor);
      ringGrad.addColorStop(1, 'rgba(255,255,255,0.1)');
      
      ctx.lineWidth = 15;
      ctx.strokeStyle = ringGrad;
      ctx.shadowBlur = 15;
      ctx.shadowColor = ringColor; // Glow effect
      ctx.stroke();

      // Thinner, brighter inner division ring
      ctx.beginPath();
      ctx.ellipse(0, 0, radius * 1.4, radius * 0.3, 0, 0, Math.PI);
      ctx.lineWidth = 3;
      ctx.strokeStyle = 'rgba(255,255,255,0.6)';
      ctx.stroke();

      ctx.restore();
  }

  return canvas;
}

