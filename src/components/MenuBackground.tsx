import React, { useEffect, useRef, useState } from 'react';

export function MenuBackground() {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const requestRef = useRef<number>();

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      // Calculate normalized mouse position from -1 to 1
      const x = (e.clientX / window.innerWidth) * 2 - 1;
      const y = (e.clientY / window.innerHeight) * 2 - 1;
      setMousePos({ x, y });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <div className="absolute inset-0 overflow-hidden bg-slate-950">
      <style>{`
        @keyframes subtlePan {
          0% { transform: scale(1.05) translate(0%, 0%) rotate(0deg); }
          33% { transform: scale(1.1) translate(-1%, 1%) rotate(0.5deg); }
          66% { transform: scale(1.08) translate(1%, -1%) rotate(-0.5deg); }
          100% { transform: scale(1.05) translate(0%, 0%) rotate(0deg); }
        }
        .moving-illusion {
          animation: subtlePan 30s ease-in-out infinite;
          will-change: transform;
        }
      `}</style>
      
      {/* 
        The image container gets the continuous subtle pan/zoom CSS animation.
        Inside, the image acts on the mouse position for a 3D parallax illusion.
      */}
      <div className="absolute inset-0 moving-illusion flex items-center justify-center">
        <img 
          src="/assets/Mainmenu.jpg" 
          alt="Menu Background"
          className="w-[110%] h-[110%] object-cover max-w-none transition-transform duration-700 ease-out"
          style={{
            transform: `translate(${mousePos.x * -2}%, ${mousePos.y * -2}%) scale(1.05)`
          }}
        />
      </div>

      {/* Screen/scanline overlay to give it a retro/monitor vibe */}
      <div 
        className="absolute inset-0 pointer-events-none opacity-30 mix-blend-overlay"
        style={{
          backgroundImage: 'linear-gradient(transparent 50%, rgba(0, 0, 0, 0.4) 50%)',
          backgroundSize: '100% 4px',
        }}
      />
      
      {/* Light vignette overlay to blend edges */}
      <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(ellipse_at_center,_transparent_0%,_rgba(2,4,10,0.8)_100%)]" />
    </div>
  );
}

