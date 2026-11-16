import React, { useState } from 'react';
import { ChemistryTask } from '../types/chemistry';
import { FlaskConical, Target, Info, ChevronDown, ChevronUp } from 'lucide-react';

interface ReactionMixtureCardProps {
  task: ChemistryTask;
  activeQuestionIndex: number;
}

export const ReactionMixtureCard: React.FC<ReactionMixtureCardProps> = ({
  task,
  activeQuestionIndex,
}) => {
  const [isMobileExpanded, setIsMobileExpanded] = useState<boolean>(true);
  const desiredComponent = task.components.find((c) => c.isDesired);

  return (
    <aside className="w-full lg:w-96 shrink-0 flex flex-col gap-3 sm:gap-4 bg-slate-900/95 border border-slate-700/80 rounded-2xl p-3.5 sm:p-5 text-slate-100 shadow-2xl sm:backdrop-blur-md min-w-0">
      {/* Header & Initial Conditions */}
      <div className="border-b border-slate-800 pb-3">
        <div className="flex items-center justify-between gap-2 mb-1.5">
          <div className="flex items-center gap-2 min-w-0">
            <div className="p-2 rounded-xl bg-indigo-500/20 text-indigo-400 border border-indigo-500/30 shrink-0">
              <FlaskConical className="w-5 h-5" />
            </div>
            <div className="min-w-0">
              <span className="text-[11px] sm:text-xs uppercase font-bold tracking-wider text-indigo-400 block">
                Folyamatos Reakcióelegy
              </span>
              <h2 className="text-sm sm:text-base font-bold text-white leading-tight break-words">
                {task.startingSubstance.name} ({task.startingSubstance.formula})
              </h2>
            </div>
          </div>

          <div className="flex items-center gap-1.5 shrink-0">
            <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-slate-800 border border-slate-700 text-slate-300">
              {task.levelNumber}. szint
            </span>
            <button
              type="button"
              onClick={() => setIsMobileExpanded((v) => !v)}
              className="lg:hidden p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-300"
              aria-label={isMobileExpanded ? 'Panel összecsukása' : 'Panel kibontása'}
            >
              {isMobileExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {/* Dedicated vertically scrollable task description panel */}
        <div className="mt-2 max-h-24 overflow-y-auto overscroll-contain rounded-xl bg-slate-950/60 border border-slate-800/80 p-2.5 text-xs text-slate-300 leading-relaxed">
          {task.description}
        </div>

        {/* Starting Material Banner */}
        <div className="mt-2.5 grid grid-cols-2 gap-2 text-xs">
          <div className="bg-slate-950/70 p-2 sm:p-2.5 rounded-xl border border-slate-800 min-w-0">
            <span className="text-slate-400 block text-[11px]">Kiindulási anyag</span>
            <span className="font-extrabold text-xs sm:text-sm text-cyan-400 font-mono break-words">
              {task.startingMoles} mol {task.startingSubstance.formula}
            </span>
          </div>
          <div className="bg-slate-950/70 p-2 sm:p-2.5 rounded-xl border border-slate-800 min-w-0">
            <span className="text-slate-400 block text-[11px]">Reagens</span>
            <span className="font-extrabold text-xs sm:text-sm text-amber-400 font-mono break-words">
              {task.reagent.formula} ({task.reagent.name})
            </span>
          </div>
        </div>
      </div>

      {/* Collapsible details on mobile/tablet; always visible on desktop */}
      <div className={`${isMobileExpanded ? 'flex' : 'hidden'} lg:flex flex-col gap-3 sm:gap-4 min-w-0`}>
        {/* Target desired product indicator */}
        {desiredComponent && (
          <div className="bg-amber-500/10 border border-amber-500/30 rounded-xl p-2.5 flex items-center gap-2.5">
            <Target className="w-4 h-4 text-amber-400 shrink-0" />
            <div className="text-xs min-w-0 break-words">
              <span className="text-amber-300 font-bold">Kívánt termék: </span>
              <span className="text-white font-semibold">
                {desiredComponent.name} ({desiredComponent.formula})
              </span>
            </div>
          </div>
        )}

        {/* Reaction Mixture Composition Table */}
        <div className="min-w-0">
          <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
              <span>Reakcióelegy Összetétele</span>
              <span className="text-[10px] text-slate-400 font-normal lowercase">(mólarányok)</span>
            </h3>
            <span className="text-[11px] font-mono text-emerald-400 bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-800/60">
              Összesen: 100%
            </span>
          </div>

          {/* Molar Percentage Stacked Bar */}
          <div className="h-3 w-full rounded-full overflow-hidden flex bg-slate-950 mb-3 border border-slate-800">
            {task.components.map((comp) => (
              <div
                key={comp.id}
                style={{
                  width: `${comp.percentage}%`,
                  backgroundColor: comp.color,
                }}
                title={`${comp.name}: ${comp.percentage}% (${comp.moles} mol)`}
                className="h-full transition-all duration-300 relative"
              />
            ))}
          </div>

          {/* Components List */}
          <div className="space-y-1.5 max-h-48 sm:max-h-56 overflow-y-auto overscroll-contain pr-1 text-xs">
            {task.components.map((comp) => {
              const isHighlight =
                (activeQuestionIndex === 0 && comp.isUnchanged) ||
                (activeQuestionIndex === 3 && comp.isDesired) ||
                (activeQuestionIndex === 4 && comp.isDesired);

              return (
                <div
                  key={comp.id}
                  className={`p-2 rounded-xl border transition-all duration-200 flex items-center justify-between gap-2 min-w-0
                    ${
                      isHighlight
                        ? 'bg-indigo-950/60 border-indigo-500 shadow-[0_0_12px_rgba(99,102,241,0.25)]'
                        : comp.isDesired
                        ? 'bg-amber-950/20 border-amber-600/30'
                        : comp.isUnchanged
                        ? 'bg-slate-950/40 border-slate-800 text-slate-300'
                        : 'bg-slate-800/40 border-slate-700/50'
                    }`}
                >
                  <div className="flex items-center gap-2 min-w-0">
                    <div
                      className="w-2.5 h-2.5 rounded-full shrink-0"
                      style={{ backgroundColor: comp.color }}
                    />
                    <div className="min-w-0">
                      <div className="font-semibold text-white flex flex-wrap items-center gap-1">
                        <span className="break-words">{comp.name}</span>
                        {comp.isDesired && (
                          <span className="text-[9px] font-bold uppercase tracking-wider bg-amber-500 text-slate-950 px-1.5 py-0.5 rounded font-mono shrink-0">
                            Kívánt
                          </span>
                        )}
                        {comp.isUnchanged && (
                          <span className="text-[9px] font-bold uppercase tracking-wider bg-slate-700 text-slate-300 px-1 py-0.5 rounded font-mono shrink-0">
                            Maradék
                          </span>
                        )}
                      </div>
                      <span className="text-[11px] font-mono text-slate-400 block">
                        {comp.formula}
                      </span>
                    </div>
                  </div>

                  <div className="text-right shrink-0">
                    <span className="font-mono font-bold text-white text-sm">
                      {comp.percentage}%
                    </span>
                    <span className="block text-[10px] text-slate-400 font-mono">
                      ({comp.moles} mol)
                    </span>
                  </div>
                </div>
              );
            })}
          </div>

          <p className="mt-2 text-[11px] text-slate-400 italic leading-snug">
            * A százalékok a reakcióelegy {task.startingSubstance.name.toLowerCase()}ból származó molekuláinak mólarányát jelentik, nem tömegszázalékot.
          </p>
        </div>

        {/* Simplified Chemical Equations */}
        <div className="border-t border-slate-800 pt-3 min-w-0">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-300 mb-2 flex flex-wrap items-center justify-between gap-1">
            <span>Sztöchiometriai Egyenletek</span>
            <span className="text-[10px] text-amber-400 font-mono">
              {task.reagent.formula} együtthatók
            </span>
          </h3>
          <div className="space-y-1.5 text-xs">
            {task.equations.map((eq, idx) => (
              <div
                key={idx}
                className="p-2 rounded-lg bg-slate-950/70 border border-slate-800/90 font-mono flex flex-wrap items-center justify-between gap-1.5 text-[11px] sm:text-xs"
              >
                <div className="text-slate-200 flex flex-wrap items-center gap-1 min-w-0">
                  <span className="text-cyan-300 whitespace-nowrap">{eq.reactants}</span>
                  <span className="text-slate-500">→</span>
                  <span className="text-emerald-300 whitespace-nowrap">{eq.products}</span>
                </div>
                <span className="font-bold text-amber-400 bg-amber-950/50 px-1.5 py-0.5 rounded border border-amber-800/60 shrink-0">
                  ×{eq.reagentMultiplier} {task.reagent.formula}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Key Pedagogical Clarification Notice */}
        <div className="bg-indigo-950/40 border border-indigo-700/40 rounded-xl p-3 text-xs text-indigo-200 flex items-start gap-2">
          <Info className="w-4 h-4 text-indigo-400 shrink-0 mt-0.5" />
          <div className="leading-snug">
            <strong className="text-indigo-300 block mb-0.5 font-semibold">
              Pedagógiai tanács:
            </strong>
            Ne keverd össze a termékek mólarányát a felhasznált {task.reagent.name.toLowerCase()} mólarányával! A reagensfogyáshoz szorozni kell a sztöchiometriai együtthatókkal.
          </div>
        </div>
      </div>
    </aside>
  );
};
