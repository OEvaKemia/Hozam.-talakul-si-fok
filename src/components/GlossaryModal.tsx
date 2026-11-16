import React from 'react';
import { X, BookOpen, AlertTriangle, Check, Sparkles, Scale, Percent } from 'lucide-react';

interface GlossaryModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const GlossaryModal: React.FC<GlossaryModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/75 animate-in fade-in duration-200">
      <div className="relative w-full max-w-3xl max-h-[90vh] overflow-y-auto overscroll-contain bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl p-4 sm:p-7 text-slate-100">
        {/* Header */}
        <div className="flex items-center justify-between gap-2 pb-4 border-b border-slate-800">
          <div className="flex items-center gap-3 min-w-0">
            <div className="p-2.5 rounded-xl bg-amber-500/20 text-amber-400 border border-amber-500/30 shrink-0">
              <BookOpen className="w-6 h-6" />
            </div>
            <div className="min-w-0">
              <h2 className="text-lg sm:text-xl font-bold text-white">
                Kémiai Fogalomtár & Számítási Útmutató
              </h2>
              <p className="text-xs text-slate-400">
                A 3. szint: „A Reakció Mestere” elméleti háttere és képletei
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

        <div className="mt-5 space-y-5 text-sm">
          {/* Key Difference Section */}
          <div className="p-4 rounded-xl bg-amber-950/30 border border-amber-600/40">
            <h3 className="font-bold text-amber-400 flex items-center gap-2 mb-2 text-base">
              <AlertTriangle className="w-5 h-5 shrink-0" />
              <span>Fontos Pedagógiai Figyelmeztetés</span>
            </h3>
            <p className="text-slate-300 leading-relaxed text-xs sm:text-sm">
              <strong>Ne keverd össze a termékek mólarányát a felhasznált reagens mólarányával!</strong>
              <br />
              Például trinitrotoluol (TNT) képződésekor 1 mol toluolhoz <strong>3 mol salétromsav</strong> szükséges. 
              Ugyanígy a tetraklórmetán (CCl₄) előállításához 1 mol metánra <strong>4 mol klórgáz</strong> fogy!
            </p>
          </div>

          {/* 4 Pillars Comparison Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
            {/* 1. Összesen átalakult */}
            <div className="p-4 rounded-xl bg-slate-950/70 border border-slate-800">
              <div className="flex items-center gap-2 text-cyan-400 font-bold mb-1">
                <Scale className="w-4 h-4 shrink-0" />
                <h4>1. Összesen átalakult kiindulási anyag (n_átalakult)</h4>
              </div>
              <p className="text-xs text-slate-300 mb-2">
                A kiindulási molekulák azon része, amely valamilyen reakcióban részt vett.
              </p>
              <div className="p-2 rounded bg-slate-900 border border-slate-800 font-mono text-xs text-cyan-300 break-words">
                n_átalakult = n_kiindulási - n_változatlan
              </div>
            </div>

            {/* 2. Kívánt termékké alakult */}
            <div className="p-4 rounded-xl bg-slate-950/70 border border-slate-800">
              <div className="flex items-center gap-2 text-emerald-400 font-bold mb-1">
                <Check className="w-4 h-4 shrink-0" />
                <h4>2. Kívánt termékké alakult anyag (n_kívánt)</h4>
              </div>
              <p className="text-xs text-slate-300 mb-2">
                A kiindulási molekulák azon része, amely kizárólag a célépületté (pl. TNT vagy CH₃Cl) alakult.
              </p>
              <div className="p-2 rounded bg-slate-900 border border-slate-800 font-mono text-xs text-emerald-300 break-words">
                n_kívánt = n_kiindulási × (kívánt termék mol%)
              </div>
            </div>

            {/* 3. Változatlanul maradt */}
            <div className="p-4 rounded-xl bg-slate-950/70 border border-slate-800">
              <div className="flex items-center gap-2 text-slate-400 font-bold mb-1">
                <Percent className="w-4 h-4 shrink-0" />
                <h4>3. Változatlanul maradt kiindulási anyag</h4>
              </div>
              <p className="text-xs text-slate-300 mb-2">
                A reagálatlanul a rendszerben maradt kiindulási anyag.
              </p>
              <div className="p-2 rounded bg-slate-900 border border-slate-800 font-mono text-xs text-slate-300 break-words">
                n_változatlan = n_kiindulási × (maradék mol%)
              </div>
            </div>

            {/* 4. Felhasznált reagens */}
            <div className="p-4 rounded-xl bg-slate-950/70 border border-slate-800">
              <div className="flex items-center gap-2 text-purple-400 font-bold mb-1">
                <Sparkles className="w-4 h-4 shrink-0" />
                <h4>4. Felhasznált reagens (HNO₃ vagy Cl₂)</h4>
              </div>
              <p className="text-xs text-slate-300 mb-2">
                A sztöchiometriai együtthatókkal súlyozott termékmennyiségek összege!
              </p>
              <div className="p-2 rounded bg-slate-900 border border-slate-800 font-mono text-xs text-purple-300 break-words">
                n_reagens = Σ (n_termék,i × ν_i)
              </div>
            </div>
          </div>

          {/* Formulas Detail */}
          <div className="space-y-3 pt-2">
            <h3 className="font-bold text-white text-base">Alapvető Hatásfok-mutatók</h3>

            <div className="p-3.5 rounded-xl bg-slate-950/50 border border-slate-800 space-y-1.5">
              <div className="flex flex-wrap justify-between items-center gap-2 text-xs sm:text-sm font-semibold text-sky-300">
                <span>Összátalakulási fok (α_össz):</span>
                <span className="font-mono text-white bg-slate-800 px-2 py-0.5 rounded text-xs">
                  (n_átalakult / n_kiindulási) × 100%
                </span>
              </div>
              <p className="text-xs text-slate-400">
                A kiindulási molekulák összes átalakulási aránya, függetlenül attól, hogy melyik termék képződött.
              </p>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-950/50 border border-slate-800 space-y-1.5">
              <div className="flex flex-wrap justify-between items-center gap-2 text-xs sm:text-sm font-semibold text-emerald-300">
                <span>Hasznos átalakulási fok (α_hasznos):</span>
                <span className="font-mono text-white bg-slate-800 px-2 py-0.5 rounded text-xs">
                  (n_kívánt termékké alakult / n_kiindulási) × 100%
                </span>
              </div>
              <p className="text-xs text-slate-400">
                A kiindulási molekulák azon aránya, amely a megcélzott hasznos termékké alakult.
              </p>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-950/50 border border-slate-800 space-y-1.5">
              <div className="flex flex-wrap justify-between items-center gap-2 text-xs sm:text-sm font-semibold text-amber-300">
                <span>Hozam (η):</span>
                <span className="font-mono text-white bg-slate-800 px-2 py-0.5 rounded text-xs">
                  (n_tényleges kívánt termék / n_elméleti maximum) × 100%
                </span>
              </div>
              <p className="text-xs text-slate-400">
                A ténylegesen nyert kívánt termék aránya ahhoz képest, amennyi akkor képződne, ha az összes kiindulási anyag 100%-ban melléktermékek nélkül alakulna át.
              </p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-6 pt-4 border-t border-slate-800 flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow-lg transition"
          >
            Értem, folytatom a játékot
          </button>
        </div>
      </div>
    </div>
  );
};
