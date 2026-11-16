import React from 'react';
import { Award, CheckCircle2, Lock, RotateCcw, X } from 'lucide-react';
import { BADGE_DEFINITIONS } from '../utils/storage';

interface BadgesModalProps {
  isOpen: boolean;
  onClose: () => void;
  earnedBadgeIds: string[];
  totalScore: number;
  randomTasksCompleted: number;
  onResetProgress: () => void;
}

export const BadgesModal: React.FC<BadgesModalProps> = ({
  isOpen,
  onClose,
  earnedBadgeIds,
  totalScore,
  randomTasksCompleted,
  onResetProgress,
}) => {
  if (!isOpen) return null;

  const earnedSet = new Set(earnedBadgeIds);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/75 animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl max-h-[88vh] overflow-y-auto overscroll-contain bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl p-4 sm:p-6 text-slate-100">
        {/* Header */}
        <div className="flex items-center justify-between gap-2 pb-4 border-b border-slate-800">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="p-2 rounded-xl bg-amber-500/20 text-amber-400 border border-amber-500/30 shrink-0">
              <Award className="w-5 h-5" />
            </div>
            <div className="min-w-0">
              <h2 className="text-base sm:text-lg font-bold text-white">
                Saját Jelvények és Eredmények
              </h2>
              <p className="text-xs text-slate-400">
                Az eredményeid helyben, ezen az eszközön tárolódnak (bejelentkezés nélkül).
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition shrink-0"
            aria-label="Bezárás"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Summary Metrics */}
        <div className="grid grid-cols-3 gap-2 sm:gap-3 mt-4 text-center">
          <div className="bg-slate-950/70 border border-slate-800 rounded-xl p-3">
            <span className="text-[11px] text-slate-400 block">Összpontszám</span>
            <span className="text-lg sm:text-xl font-black font-mono text-amber-400">
              {totalScore}
            </span>
          </div>
          <div className="bg-slate-950/70 border border-slate-800 rounded-xl p-3">
            <span className="text-[11px] text-slate-400 block">Jelvények</span>
            <span className="text-lg sm:text-xl font-black font-mono text-emerald-400">
              {earnedBadgeIds.length} / {BADGE_DEFINITIONS.length}
            </span>
          </div>
          <div className="bg-slate-950/70 border border-slate-800 rounded-xl p-3">
            <span className="text-[11px] text-slate-400 block">Véletlen feladatok</span>
            <span className="text-lg sm:text-xl font-black font-mono text-purple-400">
              {randomTasksCompleted}
            </span>
          </div>
        </div>

        {/* Badge Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-4">
          {BADGE_DEFINITIONS.map((badge) => {
            const isEarned = earnedSet.has(badge.id);
            return (
              <div
                key={badge.id}
                className={`p-3.5 rounded-xl border flex items-start gap-3 transition ${
                  isEarned
                    ? 'bg-emerald-950/30 border-emerald-500/50 text-white'
                    : 'bg-slate-950/50 border-slate-800 text-slate-400 opacity-75'
                }`}
              >
                <div
                  className={`p-2 rounded-xl border shrink-0 ${
                    isEarned
                      ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40'
                      : 'bg-slate-800/80 text-slate-500 border-slate-700'
                  }`}
                >
                  {isEarned ? <CheckCircle2 className="w-5 h-5" /> : <Lock className="w-5 h-5" />}
                </div>
                <div className="min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h3 className="text-sm font-bold">{badge.title}</h3>
                    <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700">
                      {badge.levelNumber}. szint
                    </span>
                  </div>
                  <p className="text-xs text-slate-300/90 mt-1 leading-snug">
                    {badge.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Footer */}
        <div className="mt-5 pt-3 border-t border-slate-800 flex flex-wrap items-center justify-between gap-2">
          <button
            type="button"
            onClick={onResetProgress}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-800 hover:bg-rose-950/60 hover:text-rose-300 hover:border-rose-700/60 text-slate-300 border border-slate-700 text-xs font-semibold transition"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Helyi eredmények nullázása</span>
          </button>

          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold shadow-lg transition"
          >
            Bezárás
          </button>
        </div>
      </div>
    </div>
  );
};
