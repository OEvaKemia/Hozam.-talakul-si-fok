import React, { useRef, useState } from 'react';
import { QuestionOption } from '../types/chemistry';
import { sound } from '../utils/audio';

interface SphereOrbProps {
  option: QuestionOption;
  unit: string;
  index: number;
  isSelected: boolean;
  isCorrect?: boolean | null;
  disabled?: boolean;
  colorScheme?: 'amber' | 'emerald' | 'blue' | 'purple';
  onSelect: (option: QuestionOption) => void;
}

const OPTION_LETTERS = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J'];

export const SphereOrb: React.FC<SphereOrbProps> = ({
  option,
  unit,
  index,
  isSelected,
  isCorrect,
  disabled = false,
  colorScheme = 'blue',
  onSelect,
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const pointerStartRef = useRef<{ x: number; y: number } | null>(null);
  const didScrollRef = useRef<boolean>(false);

  // Color schemes for spheres
  const colorMaps = {
    amber: {
      light: '#fef08a',
      core: '#f59e0b',
      deep: '#b45309',
      glow: 'rgba(245, 158, 11, 0.4)',
      shadow: 'rgba(180, 83, 9, 0.45)',
    },
    emerald: {
      light: '#a7f3d0',
      core: '#10b981',
      deep: '#047857',
      glow: 'rgba(16, 185, 129, 0.4)',
      shadow: 'rgba(4, 120, 87, 0.45)',
    },
    blue: {
      light: '#bae6fd',
      core: '#0284c7',
      deep: '#0369a1',
      glow: 'rgba(2, 132, 199, 0.4)',
      shadow: 'rgba(3, 105, 161, 0.45)',
    },
    purple: {
      light: '#e9d5ff',
      core: '#9333ea',
      deep: '#6b21a8',
      glow: 'rgba(147, 51, 234, 0.4)',
      shadow: 'rgba(107, 33, 168, 0.45)',
    },
  };

  const scheme = colorMaps[colorScheme] || colorMaps.blue;
  const letter = OPTION_LETTERS[index] ?? `${index + 1}`;

  let borderHighlight = '';
  if (isCorrect === true) {
    borderHighlight = 'ring-4 ring-emerald-400 shadow-[0_0_28px_rgba(52,211,153,0.75)] scale-105';
  } else if (isCorrect === false) {
    borderHighlight = 'ring-4 ring-rose-500 shadow-[0_0_28px_rgba(244,63,94,0.75)]';
  } else if (isSelected) {
    borderHighlight = 'ring-4 ring-white shadow-[0_0_24px_rgba(255,255,255,0.55)] scale-105';
  }

  const floatDelay = `${index * 0.35}s`;

  const handlePointerDown = (e: React.PointerEvent<HTMLButtonElement>) => {
    pointerStartRef.current = { x: e.clientX, y: e.clientY };
    didScrollRef.current = false;
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLButtonElement>) => {
    if (!pointerStartRef.current) return;
    const dx = Math.abs(e.clientX - pointerStartRef.current.x);
    const dy = Math.abs(e.clientY - pointerStartRef.current.y);
    if (dx > 10 || dy > 10) {
      didScrollRef.current = true;
    }
  };

  const handleClick = () => {
    // Prevent accidental selection when user was scrolling on touch screen
    if (didScrollRef.current) {
      didScrollRef.current = false;
      pointerStartRef.current = null;
      return;
    }
    pointerStartRef.current = null;
    sound.playSphereSelect();
    onSelect(option);
  };

  return (
    <div className="flex flex-col items-center group relative select-none max-w-full">
      {/* 3D Orb Button */}
      <button
        type="button"
        disabled={disabled}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerCancel={() => {
          pointerStartRef.current = null;
          didScrollRef.current = false;
        }}
        onClick={handleClick}
        onMouseEnter={() => {
          setIsHovered(true);
          sound.playSphereHover();
        }}
        onMouseLeave={() => setIsHovered(false)}
        style={{
          animationDelay: floatDelay,
          touchAction: 'manipulation',
        }}
        className={`relative w-24 h-24 sm:w-28 sm:h-28 md:w-32 md:h-32 rounded-full transition-all duration-200 transform cursor-pointer
          ${disabled ? 'opacity-80 cursor-not-allowed' : 'sm:hover:-translate-y-1.5 sm:hover:scale-105 active:scale-95'}
          ${borderHighlight}
          focus:outline-none focus-visible:ring-4 focus-visible:ring-indigo-400`}
        aria-label={`${letter} lehetőség, ${index + 1}. gömb: ${option.value} ${unit}`}
      >
        {/* Sphere Base 3D Sphere Radial Gradient */}
        <div
          className="absolute inset-0 rounded-full overflow-hidden"
          style={{
            background: `radial-gradient(circle at 35% 30%, ${scheme.light} 0%, ${scheme.core} 42%, ${scheme.deep} 85%, #090d16 100%)`,
            boxShadow: `inset -7px -7px 16px rgba(0, 0, 0, 0.7), inset 3px 3px 9px rgba(255, 255, 255, 0.55), 0 12px 22px ${scheme.shadow}`,
          }}
        >
          {/* Specular Highlight Gloss Spot */}
          <div
            className="absolute top-2 left-3 sm:top-3 sm:left-4 w-8 h-5 sm:w-11 sm:h-7 rounded-full pointer-events-none"
            style={{
              background: 'radial-gradient(ellipse at center, rgba(255,255,255,0.88) 0%, rgba(255,255,255,0) 70%)',
              transform: 'rotate(-25deg)',
            }}
          />

          {/* Secondary Rim light reflection at bottom-right */}
          <div
            className="hidden sm:block absolute -bottom-2 -right-2 w-14 h-14 rounded-full opacity-40 pointer-events-none"
            style={{
              background: `radial-gradient(circle at bottom right, ${scheme.light} 0%, transparent 70%)`,
            }}
          />

          {/* Inner Chemical Core Value */}
          <div className="absolute inset-0 flex flex-col items-center justify-center text-white drop-shadow-[0_2px_4px_rgba(0,0,0,0.85)] z-10 px-1.5 text-center">
            <span className="text-xl sm:text-2xl md:text-3xl font-black tracking-tight font-mono text-white leading-none">
              {option.value}
            </span>
            <span className="text-[11px] sm:text-xs font-bold uppercase tracking-wider text-white/95 bg-black/40 px-2 py-0.5 rounded-full mt-1 border border-white/20">
              {unit}
            </span>
          </div>
        </div>

        {/* Ambient Ring on desktop hover only (skipped on mobile for performance) */}
        {isHovered && !disabled && (
          <div
            className="hidden md:block absolute -inset-2 rounded-full border border-white/30 animate-ping opacity-25 pointer-events-none"
            style={{ animationDuration: '2s' }}
          />
        )}
      </button>

      {/* 3D Drop Shadow on Floor */}
      <div
        className="w-16 sm:w-20 h-3 rounded-full mt-2 transition-transform duration-200 opacity-55 pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse at center, rgba(0,0,0,0.6) 0%, rgba(0,0,0,0) 75%)',
          transform: isHovered ? 'scale(0.85) translateY(3px)' : 'scale(1)',
        }}
      />

      {/* Sphere Letter & Number Indicator badge */}
      <div className="mt-1 flex items-center gap-1 text-[11px] font-semibold text-slate-300 bg-slate-900/90 px-2.5 py-0.5 rounded-md border border-slate-700/70 shadow-xs whitespace-nowrap">
        <span className="font-mono font-bold text-cyan-300">{letter}</span>
        <span className="text-slate-500">·</span>
        <span>{index + 1}. gömb</span>
      </div>
    </div>
  );
};
