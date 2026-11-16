import React from 'react';
import { ChemistryTask } from '../types/chemistry';
import { X, CheckCircle, Calculator, BookOpen, AlertCircle } from 'lucide-react';

interface DerivationModalProps {
  isOpen: boolean;
  onClose: () => void;
  task: ChemistryTask;
  activeQuestionIndex: number;
}

export const DerivationModal: React.FC<DerivationModalProps> = ({
  isOpen,
  onClose,
  task,
  activeQuestionIndex,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/75 animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl max-h-[88vh] overflow-y-auto overscroll-contain bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl p-4 sm:p-6 text-slate-100">
        {/* Header */}
        <div className="flex items-center justify-between gap-2 pb-4 border-b border-slate-800">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="p-2 rounded-xl bg-cyan-500/20 text-cyan-400 border border-cyan-500/30 shrink-0">
              <Calculator className="w-5 h-5" />
            </div>
            <div className="min-w-0">
              <h2 className="text-base sm:text-lg font-bold text-white">Számítások Levezetése és Magyarázata</h2>
              <p className="text-xs text-slate-400 truncate">{task.title}</p>
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

        {/* List of all questions with their mathematical derivations */}
        <div className="mt-4 space-y-4">
          {task.questions.map((q, idx) => {
            const isCurrent = idx === activeQuestionIndex;
            return (
              <div
                key={q.id}
                className={`p-4 rounded-xl border transition-all ${
                  isCurrent
                    ? 'bg-indigo-950/40 border-indigo-500/80 shadow-[0_0_15px_rgba(99,102,241,0.2)]'
                    : 'bg-slate-950/60 border-slate-800'
                }`}
              >
                <div className="flex items-start justify-between gap-3 mb-2">
                  <div className="flex items-center gap-2">
                    <span
                      className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold font-mono ${
                        isCurrent
                          ? 'bg-indigo-500 text-white'
                          : 'bg-slate-800 text-slate-300'
                      }`}
                    >
                      {idx + 1}
                    </span>
                    <h3 className="text-sm font-semibold text-slate-200">{q.prompt}</h3>
                  </div>
                  <span className="font-mono font-bold text-sm text-emerald-400 bg-emerald-950/60 px-2.5 py-0.5 rounded-md border border-emerald-800/60 shrink-0">
                    {q.correctAnswer} {q.unit}
                  </span>
                </div>

                <div className="space-y-2 text-xs">
                  <div className="bg-slate-900 p-2.5 rounded-lg border border-slate-800 font-mono text-cyan-300">
                    <span className="text-slate-400 block text-[10px] uppercase font-sans font-bold mb-0.5">
                      Matematikai levezetés:
                    </span>
                    {q.derivation}
                  </div>

                  <p className="text-slate-300 leading-relaxed">
                    <strong className="text-indigo-300">Magyarázat: </strong>
                    {q.explanation}
                  </p>

                  {q.pedagogicalTip && (
                    <p className="text-amber-300/90 bg-amber-950/20 p-2 rounded border border-amber-800/40 text-[11px] flex items-start gap-1.5">
                      <AlertCircle className="w-3.5 h-3.5 shrink-0 mt-0.5 text-amber-400" />
                      <span>{q.pedagogicalTip}</span>
                    </p>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Footer */}
        <div className="mt-5 pt-3 border-t border-slate-800 flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold shadow-lg transition"
          >
            Vissza a feladathoz
          </button>
        </div>
      </div>
    </div>
  );
};
