import React, { useState, useEffect } from 'react';
import { ChemistryTask, QuestionOption, QuestionStep } from '../types/chemistry';
import { SphereOrb } from './SphereOrb';
import { sound } from '../utils/audio';
import confetti from 'canvas-confetti';
import {
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  ArrowRight,
  ArrowLeft,
  Sparkles,
  Trophy,
  Calculator,
  ChevronRight,
  Volume2,
  VolumeX,
  Clock,
} from 'lucide-react';

interface QuestionChallengeProps {
  task: ChemistryTask;
  attemptKey: number;
  activeQuestionIndex: number;
  isTimeExpired: boolean;
  onQuestionChange: (index: number) => void;
  onQuestionSolved: (taskId: string, questionId: number) => void;
  onTaskCompleted: (taskId: string) => void;
  onNextTask?: () => void;
  onReplayWithRandom: () => void;
  onReplayShuffled: () => void;
  onOpenDerivation: () => void;
}

export const QuestionChallenge: React.FC<QuestionChallengeProps> = ({
  task,
  attemptKey,
  activeQuestionIndex,
  isTimeExpired,
  onQuestionChange,
  onQuestionSolved,
  onTaskCompleted,
  onNextTask,
  onReplayWithRandom,
  onReplayShuffled,
  onOpenDerivation,
}) => {
  const currentQuestion: QuestionStep = task.questions[activeQuestionIndex];

  // Track selection by unique option ID (never by array index!)
  const [selectedOptionId, setSelectedOptionId] = useState<string | null>(null);
  const [isAnswerCorrect, setIsAnswerCorrect] = useState<boolean | null>(null);
  const [answeredQuestions, setAnsweredQuestions] = useState<Record<number, boolean>>({});
  const [showExplanation, setShowExplanation] = useState<boolean>(false);
  const [soundEnabled, setSoundEnabled] = useState<boolean>(true);

  // Reset per-task progress ONLY when task.id or attemptKey changes (NOT on orientation change)
  useEffect(() => {
    setAnsweredQuestions({});
    setSelectedOptionId(null);
    setIsAnswerCorrect(null);
    setShowExplanation(false);
  }, [task.id, attemptKey]);

  // Reset per-question visual feedback ONLY when switching question index or task attempt
  useEffect(() => {
    const alreadySolved = answeredQuestions[activeQuestionIndex] === true;
    if (alreadySolved) {
      setSelectedOptionId(currentQuestion.correctOptionId);
      setIsAnswerCorrect(true);
      setShowExplanation(true);
    } else {
      setSelectedOptionId(null);
      setIsAnswerCorrect(null);
      setShowExplanation(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeQuestionIndex, task.id, attemptKey]);

  const handleSelectOption = (option: QuestionOption) => {
    setSelectedOptionId(option.id);
    // Strict ID-based answer verification (independent of sphere position)
    const correct = option.id === currentQuestion.correctOptionId;

    if (correct) {
      setIsAnswerCorrect(true);
      setShowExplanation(true);
      sound.playCorrect();

      const alreadyAnswered = answeredQuestions[activeQuestionIndex] === true;
      if (!alreadyAnswered) {
        onQuestionSolved(task.id, currentQuestion.id);
      }

      const updated = { ...answeredQuestions, [activeQuestionIndex]: true };
      setAnsweredQuestions(updated);

      if (Object.keys(updated).length === task.questions.length) {
        onTaskCompleted(task.id);
        sound.playLevelComplete();

        const isReducedMotion =
          typeof window !== 'undefined' &&
          window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
        if (!isReducedMotion) {
          const isSmallScreen = typeof window !== 'undefined' && window.innerWidth < 640;
          confetti({
            particleCount: isSmallScreen ? 35 : 75,
            spread: isSmallScreen ? 55 : 70,
            origin: { y: 0.6 },
          });
        }
      }
    } else {
      setIsAnswerCorrect(false);
      setShowExplanation(true);
      sound.playIncorrect();
      // Notice: NO points deducted, following the pedagogical specification!
    }
  };

  const handleNextQuestion = () => {
    if (activeQuestionIndex < task.questions.length - 1) {
      onQuestionChange(activeQuestionIndex + 1);
    }
  };

  const handlePrevQuestion = () => {
    if (activeQuestionIndex > 0) {
      onQuestionChange(activeQuestionIndex - 1);
    }
  };

  const toggleSound = () => {
    const next = !soundEnabled;
    setSoundEnabled(next);
    sound.setEnabled(next);
  };

  const isCurrentFinished = answeredQuestions[activeQuestionIndex] === true;
  const isAllFinished = Object.keys(answeredQuestions).length === task.questions.length;

  const orbTheme: 'amber' | 'emerald' | 'blue' = task.id.includes('toluol')
    ? 'amber'
    : task.id.includes('metan')
    ? 'emerald'
    : 'blue';

  return (
    <div className="flex-1 min-w-0 flex flex-col justify-between bg-slate-900/95 border border-slate-700/80 rounded-2xl p-3.5 sm:p-6 shadow-2xl sm:backdrop-blur-md relative overflow-hidden">
      {/* Subtle ambient glow (desktop only to keep mobile GPU fast) */}
      <div
        className="hidden sm:block absolute -top-32 -right-32 w-80 h-80 rounded-full blur-3xl pointer-events-none opacity-20"
        style={{
          background: orbTheme === 'amber' ? '#f59e0b' : orbTheme === 'emerald' ? '#10b981' : '#6366f1',
        }}
      />

      {/* Top Question Status Bar */}
      <div>
        <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
          <div className="flex items-center gap-2">
            <span className="text-[11px] sm:text-xs uppercase font-extrabold tracking-wider text-slate-400">
              Kérdés:
            </span>
            <span className="px-2.5 py-0.5 rounded-full bg-slate-800 border border-slate-700 font-mono text-xs font-bold text-white">
              {activeQuestionIndex + 1} / {task.questions.length}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={toggleSound}
              className="p-1.5 rounded-lg bg-slate-800 text-slate-400 hover:text-white border border-slate-700 transition cursor-pointer"
              title={soundEnabled ? 'Hanghatások kikapcsolása' : 'Hanghatások bekapcsolása'}
              aria-label={soundEnabled ? 'Hanghatások kikapcsolása' : 'Hanghatások bekapcsolása'}
            >
              {soundEnabled ? <Volume2 className="w-4 h-4 text-emerald-400" /> : <VolumeX className="w-4 h-4" />}
            </button>

            <button
              type="button"
              onClick={onOpenDerivation}
              className="text-xs text-cyan-400 hover:text-cyan-300 flex items-center gap-1 font-semibold transition cursor-pointer px-2 py-1 rounded-lg bg-slate-800/70 border border-slate-700/70"
            >
              <Calculator className="w-3.5 h-3.5" />
              <span>Megoldás menete</span>
            </button>
          </div>
        </div>

        {/* Non-blocking time-expired gentle notice */}
        {isTimeExpired && !isAllFinished && (
          <div className="mb-3 px-3 py-2 rounded-xl bg-amber-950/40 border border-amber-600/40 text-amber-200 text-xs flex items-center gap-2">
            <Clock className="w-4 h-4 text-amber-400 shrink-0" />
            <span>Az ajánlott időkeret lejárt – nyugodtan fejezd be a feladatot időkorlát nélkül!</span>
          </div>
        )}

        {/* Question Step Pills */}
        <div
          className="grid gap-1.5 mb-4"
          style={{ gridTemplateColumns: `repeat(${task.questions.length}, minmax(0, 1fr))` }}
        >
          {task.questions.map((q, idx) => {
            const isAnswered = answeredQuestions[idx] === true;
            const isCurrent = idx === activeQuestionIndex;
            return (
              <button
                key={q.id}
                type="button"
                onClick={() => onQuestionChange(idx)}
                className={`h-2.5 rounded-full transition-all duration-200 cursor-pointer ${
                  isCurrent
                    ? 'bg-indigo-400 ring-2 ring-indigo-300 shadow-[0_0_8px_rgba(129,140,248,0.7)]'
                    : isAnswered
                    ? 'bg-emerald-500'
                    : 'bg-slate-800 hover:bg-slate-700'
                }`}
                title={`${idx + 1}. kérdés`}
                aria-label={`${idx + 1}. kérdés`}
              />
            );
          })}
        </div>

        {/* Current Question Title & Description */}
        <div className="bg-slate-950/75 border border-slate-800 rounded-2xl p-3.5 sm:p-5 mb-4 shadow-inner">
          <div className="flex items-start gap-2.5 sm:gap-3">
            <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-xl bg-indigo-500/20 text-indigo-400 flex items-center justify-center font-black font-mono shrink-0 border border-indigo-500/30 text-xs sm:text-sm mt-0.5">
              Q{activeQuestionIndex + 1}
            </div>
            <div className="flex-1 min-w-0">
              <h2 className="text-base sm:text-xl font-extrabold text-white leading-snug break-words">
                {currentQuestion.prompt}
              </h2>
              <p className="text-xs text-slate-400 mt-1 flex items-center gap-1.5">
                <HelpCircle className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                <span>Érintsd meg vagy válaszd ki a helyes 3D gömböt!</span>
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* 3D Sphere Interactive Orbs Selection Arena */}
      <div className="my-2 sm:my-4 py-2 sm:py-3 flex flex-col items-center">
        <div className="text-[11px] sm:text-xs font-bold uppercase tracking-wider text-slate-400 mb-4 sm:mb-6 flex items-center gap-2">
          <span>Interaktív 3D Gömbök</span>
          <span className="w-2 h-2 rounded-full bg-cyan-400" />
        </div>

        {/* Spheres Grid: 2x2 on portrait phone, 4-across on landscape/tablet/desktop */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-5 md:gap-7 justify-items-center items-center w-full max-w-2xl px-1">
          {currentQuestion.options.map((option, idx) => {
            const isSelected = selectedOptionId === option.id;
            const isCorrect = isSelected ? isAnswerCorrect : null;

            return (
              <SphereOrb
                key={option.id}
                option={option}
                unit={currentQuestion.unit}
                index={idx}
                isSelected={isSelected}
                isCorrect={isCorrect}
                disabled={isCurrentFinished && !isSelected}
                colorScheme={orbTheme}
                onSelect={handleSelectOption}
              />
            );
          })}
        </div>
      </div>

      {/* Dynamic Feedback Panel */}
      <div className="mt-3 sm:mt-4">
        {showExplanation && (
          <div
            className={`p-3.5 sm:p-4 rounded-xl border transition-all duration-200 ${
              isAnswerCorrect
                ? 'bg-emerald-950/45 border-emerald-500/60 text-emerald-200'
                : 'bg-rose-950/35 border-rose-500/60 text-rose-200'
            }`}
          >
            <div className="flex items-start gap-2.5 sm:gap-3">
              {isAnswerCorrect ? (
                <CheckCircle2 className="w-5 h-5 sm:w-6 sm:h-6 text-emerald-400 shrink-0 mt-0.5" />
              ) : (
                <AlertCircle className="w-5 h-5 sm:w-6 sm:h-6 text-rose-400 shrink-0 mt-0.5" />
              )}
              <div className="flex-1 min-w-0 text-xs sm:text-sm">
                <div className="font-bold mb-1 flex flex-wrap items-center justify-between gap-1.5">
                  <span className={isAnswerCorrect ? 'text-emerald-300' : 'text-rose-300'}>
                    {isAnswerCorrect ? 'Kiváló válasz! Helyes eredmény.' : 'Figyelem, ez a válasz nem pontos!'}
                  </span>
                  {!isAnswerCorrect && (
                    <span className="text-[11px] font-normal text-rose-300/90 bg-rose-900/40 px-2 py-0.5 rounded">
                      (Nincs pontlevonás – próbáld újra!)
                    </span>
                  )}
                </div>

                <p className="text-slate-200 leading-relaxed break-words">
                  {isAnswerCorrect ? currentQuestion.explanation : currentQuestion.hint}
                </p>

                {isAnswerCorrect && currentQuestion.derivation && (
                  <div className="mt-2 text-xs bg-black/30 p-2 rounded-lg border border-white/10 text-slate-200 font-mono break-words">
                    💡 <strong>Levezetés: </strong> {currentQuestion.derivation}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Task Completion Banner */}
        {isAllFinished && (
          <div className="mt-4 p-4 sm:p-5 rounded-2xl bg-linear-to-r from-indigo-950/85 to-purple-950/85 border border-indigo-500/50 shadow-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-2xl bg-amber-500/20 text-amber-400 border border-amber-500/30 shrink-0">
                <Trophy className="w-6 h-6 sm:w-7 sm:h-7" />
              </div>
              <div>
                <h3 className="text-sm sm:text-base font-extrabold text-white">
                  Gratulálunk! Mind a {task.questions.length} kérdés megoldva!
                </h3>
                <p className="text-xs text-indigo-200">
                  A reakcióelegy átalakulásait és a sztöchiometriát sikeresen teljesítetted.
                </p>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
              <button
                type="button"
                onClick={onReplayShuffled}
                className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-100 text-xs font-bold transition border border-slate-600 cursor-pointer"
              >
                <span>Újrajátszás (keverve)</span>
              </button>

              {task.levelNumber === 3 && (
                <button
                  type="button"
                  onClick={onReplayWithRandom}
                  className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold transition shadow-md cursor-pointer"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Új adatokkal</span>
                </button>
              )}

              {onNextTask && (
                <button
                  type="button"
                  onClick={onNextTask}
                  className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition shadow-md cursor-pointer"
                >
                  <span>Következő feladat</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>
        )}

        {/* Bottom Navigation Buttons */}
        <div className="mt-4 pt-3 border-t border-slate-800 flex items-center justify-between gap-2">
          <button
            type="button"
            disabled={activeQuestionIndex === 0}
            onClick={handlePrevQuestion}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold border transition ${
              activeQuestionIndex === 0
                ? 'opacity-40 cursor-not-allowed border-slate-800 text-slate-500'
                : 'bg-slate-800 hover:bg-slate-700 text-slate-200 border-slate-700 cursor-pointer'
            }`}
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Előző</span>
          </button>

          <span className="text-xs text-slate-400 font-mono">
            {activeQuestionIndex + 1} / {task.questions.length}
          </span>

          <button
            type="button"
            disabled={activeQuestionIndex === task.questions.length - 1}
            onClick={handleNextQuestion}
            className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold border transition ${
              activeQuestionIndex === task.questions.length - 1
                ? 'opacity-40 cursor-not-allowed border-slate-800 text-slate-500'
                : isCurrentFinished
                ? 'bg-indigo-600 hover:bg-indigo-500 text-white border-indigo-500 shadow-md cursor-pointer'
                : 'bg-slate-800 hover:bg-slate-700 text-slate-200 border-slate-700 cursor-pointer'
            }`}
          >
            <span>Következő</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
