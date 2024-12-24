'use client'

import React, { useState, useEffect } from 'react';

const CURSOR_Z_INDEX = 51

interface MousePosition {
    x: number;
    y: number;
}

declare global {
    interface Window {
        mousePos: MousePosition;
    }
}

const CursorTrialEffect = () => {
    const [positions, setPositions] = useState([
        { x: 0, y: 0 },
        { x: 0, y: 0 },
        { x: 0, y: 0 }
    ]);
    const [isOverDialog, setIsOverDialog] = useState(false);
    const [zoomLevel, setZoomLevel] = useState(1);
    const [isIBeam, setIsIBeam] = useState(false);
    const [shouldRender, setShouldRender] = useState(false);

    useEffect(() => {
        const checkDevice = () => {
            const isTouch = window.matchMedia('(hover: none), (pointer: coarse)').matches;
            const isSmallScreen = window.matchMedia('(max-width: 768px)').matches;
            setShouldRender(!isTouch && !isSmallScreen);
        };

        checkDevice();
        window.addEventListener('resize', checkDevice);
        return () => window.removeEventListener('resize', checkDevice);
    }, []);

    useEffect(() => {
        const lerp = (start: number, end: number, t: number): number => start * (1 - t) + end * t;
        const smoothing = 0.15;

        const updatePositions = () => {
            setPositions(prevPositions => {
                const newPositions = [...prevPositions];

                const mousePos = window.mousePos || { x: 0, y: 0 };
                newPositions[0] = {
                    x: lerp(prevPositions[0].x, mousePos.x, smoothing),
                    y: lerp(prevPositions[0].y, mousePos.y, smoothing)
                };

                for (let i = 1; i < newPositions.length; i++) {
                    newPositions[i] = {
                        x: lerp(prevPositions[i].x, newPositions[i - 1].x, smoothing),
                        y: lerp(prevPositions[i].y, newPositions[i - 1].y, smoothing)
                    };
                }

                return newPositions;
            });

            requestAnimationFrame(updatePositions);
        };

        const handleMouseMove = (e: MouseEvent): void => {
            const target = e.target as HTMLElement;
            const isOverOverlay = Boolean(
                document.querySelector('[role="dialog"]')
            ) && !target.closest('[data-cursor-passthrough]');

            const isInputElement = target.tagName.toLowerCase() === 'input' ||
                target.tagName.toLowerCase() === 'textarea' ||
                target.isContentEditable;

            setIsOverDialog(isOverOverlay);
            setIsIBeam(isInputElement);
            window.mousePos = { x: e.clientX, y: e.clientY };
        };

        window.addEventListener('mousemove', handleMouseMove);
        updatePositions();

        return () => {
            window.removeEventListener('mousemove', handleMouseMove);
        };
    }, []);

    useEffect(() => {
        const handleZoom = () => {
            setZoomLevel(window.visualViewport?.scale || 1);
        };

        window.visualViewport?.addEventListener('resize', handleZoom);
        return () => {
            window.visualViewport?.removeEventListener('resize', handleZoom);
        };
    }, []);

    if (isIBeam || !shouldRender) return null;

    return (
        <div className="fixed inset-0 pointer-events-none z-50" style={{ zIndex: CURSOR_Z_INDEX }}>
            {positions.map((pos, index) => (
                <div
                    key={index}
                    className="absolute w-2 h-2 rounded-full bg-[#69d4ff]"
                    style={{
                        left: `${pos.x}px`,
                        top: `${pos.y}px`,
                        opacity: isOverDialog ? 0 : 1 - index * 0.3,
                        transform: `scale(${(1 - index * 0.2) / zoomLevel})`,
                        transformOrigin: 'center',
                        transition: 'opacity 0.15s ease-out',
                        pointerEvents: 'none'
                    }}
                />))}        </div>);
}; export default CursorTrialEffect;

