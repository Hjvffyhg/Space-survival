export function generateNebula(width: number, height: number): HTMLCanvasElement {
  const canvas = document.createElement('canvas');
  canvas.width = Math.floor(width / 6);
  canvas.height = Math.floor(height / 6);
  const ctx = canvas.getContext('2d')!;
  
  for (let i = 0; i < 40; i++) {
    const cx = Math.random() * canvas.width;
    const cy = Math.random() * canvas.height;
    const r = Math.random() * 100 + 30;
    const grad = ctx.createRadialGradient(cx, cy, 0, cx, cy, r);
    const colorType = Math.random();
    let rColor, gColor, bColor;
    if (colorType < 0.33) { rColor = 45; gColor = 212; bColor = 191; } 
    else if (colorType < 0.66) { rColor = 99; gColor = 102; bColor = 241; } 
    else { rColor = 168; gColor = 85; bColor = 247; } 
    
    grad.addColorStop(0, `rgba(${rColor}, ${gColor}, ${bColor}, 0.1)`);
    grad.addColorStop(1, `rgba(${rColor}, ${gColor}, ${bColor}, 0)`);
    ctx.fillStyle = grad;
    ctx.beginPath(); ctx.arc(cx, cy, r, 0, Math.PI * 2); ctx.fill();
  }
  return canvas;
}

export type RetroPlanetType = 'blue-ring' | 'purple-ring' | 'orange-gas' | 'red-planet' | 'green-earth';

export function generatePlanet(type: RetroPlanetType | 'gas-giant' | 'desert' | 'ice'): HTMLCanvasElement {
  // Let's implement chunky pixel generation for retro planets
  let size = 32;
  let radius = 10;
  
  if (type === 'orange-gas') { size = 32; radius = 14; }
  else if (type === 'purple-ring') { size = 48; radius = 14; }
  else if (type === 'blue-ring') { size = 48; radius = 10; }
  else if (type === 'red-planet') { size = 16; radius = 7; }
  else if (type === 'green-earth') { size = 16; radius = 6; }
  else { type = 'blue-ring'; size = 48; radius = 10; } // Fallback

  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext('2d')!;
  
  const cx = size / 2;
  const cy = size / 2;
  
  // Pixel loop to generate chunky circles
  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      const dx = x - cx + 0.5;
      const dy = y - cy + 0.5;
      const dist = Math.sqrt(dx*dx + dy*dy);
      
      let painted = false;
      let color = '';

      // Base planet body
      if (dist <= radius) {
        painted = true;
        
        // Striping / details based on planet type
        if (type === 'orange-gas') {
          // Orange gas stripes
          const stripeY = y % 8;
          if (stripeY < 2) color = '#fed7aa'; // light
          else if (stripeY < 4) color = '#f97316'; // orange
          else if (stripeY < 6) color = '#ea580c'; // darker orange
          else color = '#9a3412'; // brown
        }
        else if (type === 'purple-ring') {
          const stripeY = y % 12;
          if (stripeY < 3) color = '#e879f9'; // pink
          else if (stripeY < 6) color = '#c084fc'; // purple
          else if (stripeY < 9) color = '#93c5fd'; // light blue
          else color = '#3b82f6'; // deep blue
        }
        else if (type === 'blue-ring') {
           color = '#60a5fa'; // light blue core
           if (y > cy) color = '#2563eb'; // dark blue shadow
           if (y < cy - 4) color = '#93c5fd'; // highlight
        }
        else if (type === 'red-planet') {
           color = '#ef4444'; // red
           if (y > cy + 1 || x > cx + 1) color = '#991b1b'; // strong shadow
        }
        else if (type === 'green-earth') {
           // procedural chunky continents relative to center
           // use some math layout
           const island = Math.sin(x*1.5) * Math.cos(y*1.5);
           color = island > 0 ? '#4ade80' : '#3b82f6';
           if (y > cy + 1 || x > cx + 1) color = island > 0 ? '#166534' : '#1d4ed8'; // shadow
        }
        
        // Global spherical shadow check for larger planets
        if ((type === 'orange-gas' || type === 'purple-ring') && (x > cx + radius*0.3 || y > cy + radius*0.3)) {
           // darken the color
           ctx.fillStyle = color;
           ctx.fillRect(x, y, 1, 1);
           ctx.fillStyle = 'rgba(0,0,0,0.4)';
           ctx.fillRect(x, y, 1, 1);
           continue;
        }
      }
      
      // Rings (back half rendered behind, front half rendered in front... wait we render it manually here!)
      if (type === 'purple-ring' || type === 'blue-ring') {
        const angle = type === 'blue-ring' ? Math.PI / 4 : 0; // Rotate blue ring slightly
        
        // Transform dx, dy for ring ellipse
        const rCos = Math.cos(-angle);
        const rSin = Math.sin(-angle);
        const tx = dx * rCos - dy * rSin;
        const ty = dx * rSin + dy * rCos;
        
        // Check if inside ring formula (outer and inner radius)
        const outerR = radius * 1.8;
        const innerR = radius * 1.3;
        
        const scaledY = ty * 3.5; // flatten the circle into an ellipse
        const ringDist = Math.sqrt(tx*tx + scaledY*scaledY);
        
        if (ringDist <= outerR && ringDist >= innerR) {
          // If we hit the ring!
          // We need to determine if the ring is IN FRONT of or BEHIND the planet
          // The front of the ring is where scaledY > 0 (or ty > 0). If back, and planet painted, planet occludes.
          const isFront = ty > 0;
          if (!painted || isFront) {
            painted = true;
            if (type === 'purple-ring') color = '#93c5fd'; // light blue ring
            else color = '#e0f2fe'; // icy blue ring
            
            // Add some ring shadowing
            if (ringDist > outerR - 2) {
               ctx.fillStyle = color;
               ctx.fillRect(x, y, 1, 1);
               ctx.fillStyle = 'rgba(0,0,0,0.2)';
               ctx.fillRect(x, y, 1, 1);
               continue;
            }
          }
        }
      }
      
      if (painted && color) {
         ctx.fillStyle = color;
         ctx.fillRect(x, y, 1, 1);
      }
    }
  }
  
  return canvas;
}
