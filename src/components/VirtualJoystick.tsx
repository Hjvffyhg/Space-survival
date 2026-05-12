import React, { useRef, useState, useEffect } from 'react';

interface JoystickProps {
    onMove: (x: number, y: number, active: boolean) => void;
    size?: number;
    color?: string; // e.g., 'rgba(6, 182, 212, 1)' for Cyan, 'rgba(244, 63, 94, 1)' for Rose
}

export const VirtualJoystick: React.FC<JoystickProps> = ({ 
    onMove, 
    size = 120, 
    color = 'rgba(6, 182, 212, 1)' // Default to Cyan
}) => {
    const handleSize = size * 0.35;
    const maxDist = size / 2 - handleSize / 2;

    const baseRef = useRef<HTMLDivElement>(null);
    const [handlePos, setHandlePos] = useState({ x: 0, y: 0 });
    const [active, setActive] = useState(false);

    const updatePosition = (clientX: number, clientY: number) => {
        if (!baseRef.current) return;
        const rect = baseRef.current.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;

        let dx = clientX - centerX;
        let dy = clientY - centerY;
        const dist = Math.hypot(dx, dy);

        if (dist > maxDist) {
            dx = (dx / dist) * maxDist;
            dy = (dy / dist) * maxDist;
        }

        setHandlePos({ x: dx, y: dy });

        const nx = dx / maxDist;
        const ny = dy / maxDist;
        onMove(nx, ny, true);
    };

    const onPointerDown = (e: React.PointerEvent) => {
        baseRef.current?.setPointerCapture(e.pointerId);
        setActive(true);
        updatePosition(e.clientX, e.clientY);
    };

    const onPointerMove = (e: React.PointerEvent) => {
        if (!active) return;
        updatePosition(e.clientX, e.clientY);
    };

    const onPointerUp = (e: React.PointerEvent) => {
        baseRef.current?.releasePointerCapture(e.pointerId);
        setActive(false);
        setHandlePos({ x: 0, y: 0 });
        onMove(0, 0, false);
    };

    // Extract raw RGB for alpha manipulation
    const rgb = color.replace(/rgba?\(|\)|\s/g, '').split(',').slice(0, 3).join(',');

    return (
        <div
            ref={baseRef}
            onPointerDown={onPointerDown}
            onPointerMove={onPointerMove}
            onPointerUp={onPointerUp}
            onPointerCancel={onPointerUp}
            className="rounded-full flex items-center justify-center touch-none backdrop-blur-sm relative"
            style={{
                width: size,
                height: size,
                backgroundColor: `rgba(${rgb}, ${active ? '0.15' : '0.05'})`,
                border: `1px solid rgba(${rgb}, ${active ? '0.5' : '0.2'})`,
                boxShadow: active ? `0 0 20px rgba(${rgb}, 0.3)` : 'none',
                transition: 'background-color 0.2s, box-shadow 0.2s'
            }}
        >
            {/* Holographic Spinning Rings */}
            <div 
                className="absolute inset-1 rounded-full border border-dashed pointer-events-none"
                style={{ 
                    borderColor: `rgba(${rgb}, 0.4)`,
                    animation: `spin ${active ? '10s' : '30s'} linear infinite`
                }}
            />
            <div 
                className="absolute inset-3 rounded-full border border-dotted pointer-events-none"
                style={{ 
                    borderColor: `rgba(${rgb}, 0.2)`,
                    animation: `spin ${active ? '15s' : '40s'} linear infinite reverse`
                }}
            />

            {/* Tactical Crosshairs */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-50">
                <div className="w-full h-[1px]" style={{ backgroundColor: `rgba(${rgb}, 0.3)` }}></div>
                <div className="absolute h-full w-[1px]" style={{ backgroundColor: `rgba(${rgb}, 0.3)` }}></div>
            </div>

            {/* The Joystick Handle */}
            <div
                className="rounded-full pointer-events-none absolute"
                style={{
                    width: handleSize,
                    height: handleSize,
                    backgroundColor: `rgba(${rgb}, ${active ? '0.4' : '0.1'})`,
                    border: `2px solid rgba(${rgb}, ${active ? '0.8' : '0.4'})`,
                    boxShadow: `0 0 15px rgba(${rgb}, 0.5)`,
                    transform: `translate(${handlePos.x}px, ${handlePos.y}px) ${active ? 'scale(1.1)' : 'scale(1)'}`,
                    transition: active ? 'transform 0.05s linear' : 'transform 0.2s cubic-bezier(0.175, 0.885, 0.32, 1.275)'
                }}
            >
                 <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-2 h-2 rounded-full" style={{ backgroundColor: `rgba(${rgb}, 0.8)` }}></div>
                 </div>
            </div>
        </div>
    );
};
