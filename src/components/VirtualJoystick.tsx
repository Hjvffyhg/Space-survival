import React, { useRef, useState, useEffect } from 'react';

interface JoystickProps {
    onMove: (x: number, y: number, active: boolean) => void;
    size?: number;
    color?: string;
}

export const VirtualJoystick: React.FC<JoystickProps> = ({ onMove, size = 120, color = 'rgba(0, 217, 255, 0.3)' }) => {
    const defaultColor = 'rgba(255, 255, 255, 0.15)';
    const handleSize = size * 0.4;
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

        // Normalize
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

    return (
        <div
            ref={baseRef}
            onPointerDown={onPointerDown}
            onPointerMove={onPointerMove}
            onPointerUp={onPointerUp}
            onPointerCancel={onPointerUp}
            className="rounded-full flex items-center justify-center touch-none backdrop-blur-sm"
            style={{
                width: size,
                height: size,
                backgroundColor: active ? color : defaultColor,
                border: `2px solid ${active ? color.replace('0.3', '0.6') : 'rgba(255,255,255,0.2)'}`,
                transition: active ? 'none' : 'background-color 0.2s, border 0.2s'
            }}
        >
            <div
                className="rounded-full shadow-lg pointer-events-none"
                style={{
                    width: handleSize,
                    height: handleSize,
                    backgroundColor: active ? color.replace('0.3', '0.8') : 'rgba(255,255,255,0.5)',
                    transform: `translate(${handlePos.x}px, ${handlePos.y}px)`,
                    transition: active ? 'none' : 'transform 0.1s ease-out, background-color 0.2s'
                }}
            />
        </div>
    );
};
