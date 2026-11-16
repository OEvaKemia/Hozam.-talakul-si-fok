import React from 'react';
import { LevelInfo } from '../types/chemistry';
import {
  CheckCircle2,
  RotateCw,
  Sparkles,
  Layers,
  BookMarked,
  Clock,
  Trophy,
  Award,
} from 'lucide-react';

interface TaskNavigatorProps {
  levels: LevelInfo[];
  selectedLevel: number;
  onSelectLevel: (levelId: number) => void;
  activeTaskId: string;
  onSelectTask: (taskId: string) => void;
  completedTasks: Set<string>;
  score: number;
  remainingSeconds: number;
  earnedBadgesCount: number;
  totalBadgesCount: number;
  onRandomizeCurrentTask: () => void;
  onResetBenchmarkTask: () => void;
  onOpenGlossary: () => void;
  onOpenDerivation: () => void;
  onOpenBadges: () => void;
}

function formatTime(totalSeconds: number): string {
  const safe = Math.max(0, Math.floor(totalSeconds));
  const mins = Math.floor(safe / 60);
  const secs = safe % 60;
  return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
}

export const TaskNavigator: React.FC<TaskNavigatorProps> = ({
  levels,
  selectedLevel,
  onSelectLevel,
  activeTaskId,
  onSelectTask,
  completedTasks,
  score,
  remainingSeconds,
  earnedBadgesCount,
  totalBadgesCount,
  onRandomizeCurrentTask,
  onResetBenchmarkTask,
  onOpenGlossary,
  onOpenDerivation,
  onOpenBadges,
}) => {
  const isTimeLow = remainingSeconds > 0 && remainingSeconds <= 30;
  const isTimeExpired = remainingSeconds <= 0;

  return (
    <div className="w-full bg-slate-900/95 border border-slate-700/80 rounded-2xl p-3 sm:p-4 shadow-xl sm:backdrop-blur-md min-w-0">
      {/* Top Level Bar + Mobile-Visible HUD */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 pb-3 border-b border-slate-800">
        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <span className="inline-block h-2 w-2 rounded-full bg-emerald-400 shrink-0" />
            <span className="text-[11px] sm:text-xs uppercase font-extrabold tracking-widest text-indigo-400 truncate">
              Kémiai Feladatmegoldó
            </span>
          </div>
          <h1 className="text-lg sm:text-2xl font-black text-white tracking-tight flex flex-wrap items-center gap-2 mt-0.5">
            <span>REAKCIÓ MESTERE</span>
            <span className="text-xs font-bold uppercase tracking-wider bg-linear-to-r from-amber-500 to-orange-500 text-slate-950 px-2.5 py-0.5 rounded-full font-mono shadow-sm">
              {selectedLevel}. Szint
            </span>
          </h1>
        </div>

        {/* Player HUD (Score, Time, Badges) + Utility Buttons */}
        <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
          {/* Score pill */}
          <div
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-slate-950/90 border border-slate-700/80 text-xs font-bold"
            title="Saját pontszám"
          >
            <Trophy className="w-3.5 h-3.5 text-amber-400 shrink-0" />
            <span className="text-slate-400 hidden xs:inline">Pont:</span>
            <span className="font-mono text-amber-300">{score}</span>
          </div>

          {/* Timer pill */}
          <div
            className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl border text-xs font-bold font-mono ${
              isTimeExpired
                ? 'bg-amber-950/60 border-amber-600/60 text-amber-300'
                : isTimeLow
                ? 'bg-rose-950/70 border-rose-500/70 text-rose-300'
                : 'bg-slate-950/90 border-slate-700/80 text-cyan-300'
            }`}
            title="Hátralévő ajánlott idő"
          >
            <Clock className="w-3.5 h-3.5 shrink-0" />
            <span>{formatTime(remainingSeconds)}</span>
          </div>

          {/* Badges button */}
          <button
            type="button"
            onClick={onOpenBadges}
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-100 border border-slate-700 text-xs font-semibold transition cursor-pointer"
            title="Saját jelvények és eredmények"
          >
            <Award className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
            <span className="font-mono">
              {earnedBadgesCount}/{totalBadgesCount}
            </span>
          </button>

          <button
            type="button"
            onClick={onOpenGlossary}
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-semibold transition cursor-pointer"
            title="Fogalomtár és Képletek"
          >
            <BookMarked className="w-3.5 h-3.5 text-amber-400 shrink-0" />
            <span className="hidden sm:inline">Képlettár</span>
          </button>

          <button
            type="button"
            onClick={onOpenDerivation}
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-semibold transition cursor-pointer"
            title="Számítások Levezetése"
          >
            <Layers className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
            <span className="hidden sm:inline">Levezetés</span>
          </button>
        </div>
      </div>

      {/* Level Tabs */}
      <div className="flex flex-wrap items-center gap-2 mt-3">
        {levels.map((lvl) => {
          const isSelected = selectedLevel === lvl.id;
          return (
            <button
              key={lvl.id}
              type="button"
              onClick={() => onSelectLevel(lvl.id)}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold transition-all duration-200 border cursor-pointer max-w-full
                ${
                  isSelected
                    ? 'bg-indigo-600 text-white border-indigo-500 shadow-md shadow-indigo-600/30'
                    : 'bg-slate-950/60 text-slate-300 border-slate-800 hover:bg-slate-800 hover:text-white'
                }`}
            >
              <span className="text-left leading-tight">{lvl.title}</span>
              {lvl.id === 3 && (
                <span className="bg-amber-400 text-slate-950 text-[10px] px-1.5 py-0.5 rounded font-extrabold uppercase shrink-0">
                  Kötelező
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Task Tabs within Level 3 */}
      {selectedLevel === 3 && (
        <div className="mt-3 pt-3 border-t border-slate-800 flex flex-col lg:flex-row lg:items-center justify-between gap-2.5">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-[11px] sm:text-xs font-semibold text-slate-400 uppercase tracking-wider mr-1">
              Kötelező feladatok:
            </span>

            {/* Task 1 Button */}
            <button
              type="button"
              onClick={() => onSelectTask('toluol-nitralas-benchmark')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold border transition cursor-pointer ${
                activeTaskId.includes('toluol')
                  ? 'bg-amber-500/20 text-amber-300 border-amber-500 shadow-[0_0_12px_rgba(245,158,11,0.2)]'
                  : 'bg-slate-950/70 text-slate-300 border-slate-800 hover:bg-slate-800'
              }`}
            >
              {completedTasks.has('toluol-nitralas-benchmark') && (
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
              )}
              <span>1. Toluol nitrálása</span>
            </button>

            {/* Task 2 Button */}
            <button
              type="button"
              onClick={() => onSelectTask('metan-klorozas-benchmark')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold border transition cursor-pointer ${
                activeTaskId.includes('metan')
                  ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500 shadow-[0_0_12px_rgba(16,185,129,0.2)]'
                  : 'bg-slate-950/70 text-slate-300 border-slate-800 hover:bg-slate-800'
              }`}
            >
              {completedTasks.has('metan-klorozas-benchmark') && (
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
              )}
              <span>2. Metán klórozása</span>
            </button>
          </div>

          {/* Randomizer & Reset controls */}
          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={onRandomizeCurrentTask}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-purple-950/60 hover:bg-purple-900/80 text-purple-200 border border-purple-700/60 text-xs font-semibold shadow-xs transition cursor-pointer"
              title="Újrajátszás véletlenszerű adatokkal (100% ellenőrzött)"
            >
              <Sparkles className="w-3.5 h-3.5 text-purple-400 shrink-0" />
              <span>Véletlenszerű adatok</span>
            </button>

            <button
              type="button"
              onClick={onResetBenchmarkTask}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-semibold transition cursor-pointer"
              title="Visszaállítás és válaszok újrakeverése"
            >
              <RotateCw className="w-3.5 h-3.5 text-slate-300 shrink-0" />
              <span>Újra (kevert sorrend)</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
