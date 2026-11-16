import React from 'react';
import { ChemistryTask } from '../types/chemistry';
import { Scale, Zap } from 'lucide-react';

interface MoleBalanceBarProps {
  task: ChemistryTask;
}

export const MoleBalanceBar: React.FC<MoleBalanceBarProps> = ({ task }) => {
  const unchangedComponent = task.components.find((c) => c.isUnchanged);

  const totalConvertedMoles = task.components
    .filter((c) => !c.isUnchanged)
    .reduce((sum, c) => sum + c.moles, 0);

  const totalReagentConsumed = task.components.reduce(
    (sum, c) => sum + c.moles * c.reagentMultiplier,
    0
  );

  return (
    <div className="w-full bg-slate-900/90 border border-slate-700/60 rounded-2xl p-3.5 sm:p-5 shadow-lg sm:backdrop-blur-md min-w-0">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
        <div className="flex items-center gap-2 min-w-0">
          <Scale className="w-4 h-4 text-cyan-400 shrink-0" />
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-200">
            Sztöchiometriai Anyagmérleg és Reagensigény
          </h3>
        </div>
        <span className="text-[11px] font-mono text-slate-400">
          Összes kiindulási: <strong className="text-white font-bold">{task.startingMoles} mol</strong> {task.startingSubstance.formula}
        </span>
      </div>

      <div className="space-y-4">
        <div>
          <div className="flex flex-wrap justify-between items-center gap-1 text-xs mb-1.5">
            <span className="text-slate-300 font-semibold flex flex-wrap items-center gap-1.5">
              <span>{task.startingSubstance.name} megoszlása</span>
              <span className="text-[10px] text-slate-400">
                (összátalakulás: {Math.round((totalConvertedMoles / task.startingMoles) * 100)}%)
              </span>
            </span>
            <span className="font-mono text-slate-400 text-[11px]">
              Átalakult: <strong className="text-cyan-400">{totalConvertedMoles} mol</strong> | Maradt:{' '}
              <strong className="text-slate-300">{unchangedComponent?.moles ?? 0} mol</strong>
            </span>
          </div>

          <div className="h-6 w-full rounded-xl overflow-hidden flex bg-slate-950 border border-slate-800 shadow-inner">
            {task.components.map((c) => (
              <div
                key={c.id}
                style={{
                  width: `${c.percentage}%`,
                  backgroundColor: c.color,
                }}
                className="h-full flex items-center justify-center text-[10px] font-bold text-slate-950 font-mono transition-all duration-300 px-1 truncate"
                title={`${c.name}: ${c.percentage}% (${c.moles} mol)`}
              >
                {c.percentage >= 15 && `${c.formula} (${c.moles}m)`}
              </div>
            ))}
          </div>
        </div>

        <div>
          <div className="flex flex-wrap justify-between items-center gap-1.5 text-xs mb-1.5">
            <span className="text-amber-400 font-semibold flex items-center gap-1.5">
              <Zap className="w-3.5 h-3.5 text-amber-400 shrink-0" />
              <span>
                {task.reagent.name} ({task.reagent.formula}) reagens fogyása együtthatókkal
              </span>
            </span>
            <span className="font-mono text-amber-300 font-bold text-xs bg-amber-950/60 px-2 py-0.5 rounded border border-amber-800/60">
              Összesen elfogyott: {totalReagentConsumed} mol {task.reagent.formula}
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
            {task.components
              .filter((c) => !c.isUnchanged)
              .map((c) => {
                const consumed = c.moles * c.reagentMultiplier;
                return (
                  <div
                    key={c.id}
                    className="p-2 rounded-xl bg-slate-950/80 border border-slate-800 flex flex-col justify-between min-w-0"
                  >
                    <span className="text-[11px] text-slate-300 truncate font-semibold">
                      {c.name}
                    </span>
                    <div className="flex items-center justify-between mt-1 font-mono text-[11px]">
                      <span className="text-slate-400">
                        {c.moles}m × {c.reagentMultiplier}
                      </span>
                      <span className="font-bold text-amber-400">= {consumed} mol</span>
                    </div>
                  </div>
                );
              })}
          </div>
        </div>
      </div>
    </div>
  );
};
