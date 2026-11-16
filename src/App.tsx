/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useRef, useState } from 'react';
import {
  LEVELS,
  createTask1Toluene,
  createTask2Methane,
  createLevel1Task,
  createLevel2Task,
  generateRandomLevel3Task,
} from './data/tasks';
import { ChemistryTask, PlayerProgress } from './types/chemistry';
import { shuffleTaskQuestions } from './utils/shuffle';
import {
  BADGE_DEFINITIONS,
  computeEarnedBadges,
  loadPlayerProgress,
  savePlayerProgress,
} from './utils/storage';
import { ReactionMixtureCard } from './components/ReactionMixtureCard';
import { QuestionChallenge } from './components/QuestionChallenge';
import { TaskNavigator } from './components/TaskNavigator';
import { MoleBalanceBar } from './components/MoleBalanceBar';
import { DerivationModal } from './components/DerivationModal';
import { GlossaryModal } from './components/GlossaryModal';
import { BadgesModal } from './components/BadgesModal';
import { Award } from 'lucide-react';

export default function App() {
  const [selectedLevel, setSelectedLevel] = useState<number>(3);
  const [activeTaskId, setActiveTaskId] = useState<string>('toluol-nitralas-benchmark');
  const [attemptKey, setAttemptKey] = useState<number>(1);

  // Initialize tasks with freshly Fisher-Yates shuffled options
  const [customTasks, setCustomTasks] = useState<Record<string, ChemistryTask>>(() => ({
    'toluol-nitralas-benchmark': createTask1Toluene(),
    'metan-klorozas-benchmark': createTask2Methane(),
    'level-1-ammonia': createLevel1Task(),
    'level-2-etanol': createLevel2Task(),
  }));

  const [activeQuestionIndex, setActiveQuestionIndex] = useState<number>(0);
  const visitedQuestionsRef = useRef<Set<string>>(new Set(['1:toluol-nitralas-benchmark:0']));

  // LocalStorage-persisted player progress (no login, no public leaderboard)
  const [progress, setProgress] = useState<PlayerProgress>(() => loadPlayerProgress());
  const completedTasks = new Set(progress.completedTaskIds);

  // Modals state
  const [isDerivationOpen, setIsDerivationOpen] = useState<boolean>(false);
  const [isGlossaryOpen, setIsGlossaryOpen] = useState<boolean>(false);
  const [isBadgesOpen, setIsBadgesOpen] = useState<boolean>(false);

  const currentTask: ChemistryTask =
    customTasks[activeTaskId] || customTasks['toluol-nitralas-benchmark'];

  // Accurate timestamp-based countdown timer (resilient to mobile sleep & orientation changes)
  const [remainingSeconds, setRemainingSeconds] = useState<number>(currentTask.timeLimitSeconds);
  const [isTimerPaused, setIsTimerPaused] = useState<boolean>(false);
  const deadlineRef = useRef<number>(Date.now() + currentTask.timeLimitSeconds * 1000);

  // Reset timer ONLY when switching task or explicitly replaying (never on window resize / rotation)
  useEffect(() => {
    const limit = currentTask.timeLimitSeconds;
    deadlineRef.current = Date.now() + limit * 1000;
    setRemainingSeconds(limit);
    setIsTimerPaused(false);
  }, [activeTaskId, attemptKey, currentTask.timeLimitSeconds]);

  useEffect(() => {
    if (isTimerPaused) return;
    const interval = window.setInterval(() => {
      const diffSec = Math.max(0, Math.ceil((deadlineRef.current - Date.now()) / 1000));
      setRemainingSeconds(diffSec);
    }, 500);
    return () => window.clearInterval(interval);
  }, [isTimerPaused, activeTaskId, attemptKey]);

  // Persist progress whenever it changes
  useEffect(() => {
    savePlayerProgress(progress);
  }, [progress]);

  // Shuffle a question's options on first visit to that question in the current attempt
  const handleQuestionChange = (nextIdx: number) => {
    const visitKey = `${attemptKey}:${activeTaskId}:${nextIdx}`;
    if (!visitedQuestionsRef.current.has(visitKey)) {
      visitedQuestionsRef.current.add(visitKey);
      setCustomTasks((prev) => {
        const t = prev[activeTaskId];
        if (!t) return prev;
        const reshuffled = shuffleTaskQuestions(t);
        const updatedQuestions = t.questions.map((q, i) =>
          i === nextIdx ? reshuffled.questions[i] : q
        );
        return {
          ...prev,
          [activeTaskId]: { ...t, questions: updatedQuestions },
        };
      });
    }
    setActiveQuestionIndex(nextIdx);
  };

  const handleSelectLevel = (levelId: number) => {
    setSelectedLevel(levelId);
    setActiveQuestionIndex(0);
    const nextAttempt = attemptKey + 1;
    setAttemptKey(nextAttempt);
    if (levelId === 1) {
      visitedQuestionsRef.current = new Set([`${nextAttempt}:level-1-ammonia:0`]);
      setCustomTasks((prev) => ({
        ...prev,
        'level-1-ammonia': shuffleTaskQuestions(prev['level-1-ammonia'] ?? createLevel1Task()),
      }));
      setActiveTaskId('level-1-ammonia');
    } else if (levelId === 2) {
      visitedQuestionsRef.current = new Set([`${nextAttempt}:level-2-etanol:0`]);
      setCustomTasks((prev) => ({
        ...prev,
        'level-2-etanol': shuffleTaskQuestions(prev['level-2-etanol'] ?? createLevel2Task()),
      }));
      setActiveTaskId('level-2-etanol');
    } else {
      visitedQuestionsRef.current = new Set([`${nextAttempt}:toluol-nitralas-benchmark:0`]);
      setCustomTasks((prev) => ({
        ...prev,
        'toluol-nitralas-benchmark': shuffleTaskQuestions(
          prev['toluol-nitralas-benchmark'] ?? createTask1Toluene()
        ),
      }));
      setActiveTaskId('toluol-nitralas-benchmark');
    }
  };

  const handleSelectTask = (taskId: string) => {
    const nextAttempt = attemptKey + 1;
    visitedQuestionsRef.current = new Set([`${nextAttempt}:${taskId}:0`]);
    setCustomTasks((prev) => ({
      ...prev,
      [taskId]: prev[taskId] ? shuffleTaskQuestions(prev[taskId]) : prev[taskId],
    }));
    setActiveTaskId(taskId);
    setActiveQuestionIndex(0);
    setAttemptKey(nextAttempt);
  };

  const handleQuestionSolved = (_taskId: string, _questionId: number) => {
    setProgress((prev) => ({
      ...prev,
      score: prev.score + 100,
    }));
  };

  const handleTaskCompleted = (taskId: string) => {
    setIsTimerPaused(true);
    setProgress((prev) => {
      const isRandom = taskId.includes('random');
      const nextCompleted = new Set(prev.completedTaskIds);
      const isFirstCompletion = !nextCompleted.has(taskId);
      nextCompleted.add(taskId);

      const nextRandomCount = isRandom ? prev.randomTasksCompleted + 1 : prev.randomTasksCompleted;
      const nextBadges = computeEarnedBadges(nextCompleted, nextRandomCount, prev.earnedBadgeIds);
      const completionBonus = isFirstCompletion ? 200 : 50;

      return {
        score: prev.score + completionBonus,
        completedTaskIds: Array.from(nextCompleted),
        earnedBadgeIds: nextBadges,
        randomTasksCompleted: nextRandomCount,
      };
    });
  };

  const handleNextTaskInLevel3 = () => {
    if (activeTaskId.includes('toluol')) {
      handleSelectTask('metan-klorozas-benchmark');
    } else {
      handleRandomizeTask();
    }
  };

  // Randomized replay with guaranteed 100% sum, verified derivations, and fresh Fisher-Yates shuffle
  const handleRandomizeTask = () => {
    const isToluene = activeTaskId.includes('toluol');
    const newTask = generateRandomLevel3Task(isToluene ? 'toluene' : 'methane');
    const newTaskId = newTask.id;
    const nextAttempt = attemptKey + 1;
    visitedQuestionsRef.current = new Set([`${nextAttempt}:${newTaskId}:0`]);

    setCustomTasks((prev) => ({
      ...prev,
      [newTaskId]: newTask,
    }));
    setActiveTaskId(newTaskId);
    setActiveQuestionIndex(0);
    setAttemptKey(nextAttempt);
  };

  // Replay current task (or reset benchmark) with newly shuffled option positions
  const handleResetBenchmarkTask = () => {
    const isToluene = activeTaskId.includes('toluol');
    const benchmarkTask = isToluene
      ? createTask1Toluene()
      : activeTaskId.includes('metan')
      ? createTask2Methane()
      : activeTaskId === 'level-1-ammonia'
      ? createLevel1Task()
      : createLevel2Task();

    const benchmarkId = benchmarkTask.id;
    const nextAttempt = attemptKey + 1;
    visitedQuestionsRef.current = new Set([`${nextAttempt}:${benchmarkId}:0`]);
    setCustomTasks((prev) => ({
      ...prev,
      [benchmarkId]: benchmarkTask,
    }));
    setActiveTaskId(benchmarkId);
    setActiveQuestionIndex(0);
    setAttemptKey(nextAttempt);
  };

  const handleReplayCurrentShuffled = () => {
    const nextAttempt = attemptKey + 1;
    visitedQuestionsRef.current = new Set([`${nextAttempt}:${activeTaskId}:0`]);
    setCustomTasks((prev) => ({
      ...prev,
      [activeTaskId]: shuffleTaskQuestions(currentTask),
    }));
    setActiveQuestionIndex(0);
    setAttemptKey(nextAttempt);
  };

  const handleResetProgress = () => {
    const empty: PlayerProgress = {
      score: 0,
      completedTaskIds: [],
      earnedBadgeIds: [],
      randomTasksCompleted: 0,
    };
    setProgress(empty);
    savePlayerProgress(empty);
  };

  return (
    <div className="min-h-screen w-full overflow-x-hidden bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-indigo-500 selection:text-white">
      {/* Top Ambient Glow Bar */}
      <div className="h-1 w-full bg-linear-to-r from-cyan-500 via-indigo-500 to-amber-500 shadow-md shrink-0" />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-2.5 sm:p-5 md:p-6 flex flex-col gap-3.5 sm:gap-5 min-w-0">
        {/* Navigation, Score, Timer, Badges & Level Header */}
        <TaskNavigator
          levels={LEVELS}
          selectedLevel={selectedLevel}
          onSelectLevel={handleSelectLevel}
          activeTaskId={activeTaskId}
          onSelectTask={handleSelectTask}
          completedTasks={completedTasks}
          score={progress.score}
          remainingSeconds={remainingSeconds}
          earnedBadgesCount={progress.earnedBadgeIds.length}
          totalBadgesCount={BADGE_DEFINITIONS.length}
          onRandomizeCurrentTask={handleRandomizeTask}
          onResetBenchmarkTask={handleResetBenchmarkTask}
          onOpenGlossary={() => setIsGlossaryOpen(true)}
          onOpenDerivation={() => setIsDerivationOpen(true)}
          onOpenBadges={() => setIsBadgesOpen(true)}
        />

        {/* Level 3 Mandatory Tasks Info Banner */}
        {selectedLevel === 3 && (
          <div className="bg-linear-to-r from-amber-950/40 via-indigo-950/40 to-slate-900 border border-amber-600/30 rounded-2xl p-3 sm:p-4 flex flex-col md:flex-row items-start md:items-center justify-between gap-3 text-xs shadow-md min-w-0">
            <div className="flex items-start sm:items-center gap-3 min-w-0">
              <div className="p-2 rounded-xl bg-amber-500/20 text-amber-400 border border-amber-500/30 shrink-0">
                <Award className="w-5 h-5" />
              </div>
              <div className="min-w-0">
                <h2 className="font-bold text-white text-xs sm:text-sm">
                  3. Szint: REAKCIÓ MESTERE – 2 Kötelező összetett számítási feladat
                </h2>
                <p className="text-slate-300 mt-0.5 leading-relaxed">
                  Ebben a szintben a kiindulási anyag különböző mértékben szubsztituált termékekké alakul, egy része változatlan marad.
                  Cél: összátalakulási fok, hasznos átalakulási fok, hozam és a reagensfogyás meghatározása.
                </p>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2 shrink-0">
              <span className="bg-slate-900 text-slate-300 font-mono px-2.5 py-1 rounded-lg border border-slate-700 text-[11px] sm:text-xs">
                1. feladat: Toluol nitrálása
              </span>
              <span className="bg-slate-900 text-slate-300 font-mono px-2.5 py-1 rounded-lg border border-slate-700 text-[11px] sm:text-xs">
                2. feladat: Metán klórozása
              </span>
            </div>
          </div>
        )}

        {/* Game Arena Layout: Reaction Mixture Sidebar on one side, Question Challenge on the other */}
        <div className="flex flex-col lg:flex-row gap-4 sm:gap-5 items-stretch min-w-0">
          <ReactionMixtureCard
            task={currentTask}
            activeQuestionIndex={activeQuestionIndex}
          />

          <QuestionChallenge
            task={currentTask}
            attemptKey={attemptKey}
            activeQuestionIndex={activeQuestionIndex}
            isTimeExpired={remainingSeconds <= 0}
            onQuestionChange={handleQuestionChange}
            onQuestionSolved={handleQuestionSolved}
            onTaskCompleted={handleTaskCompleted}
            onNextTask={selectedLevel === 3 ? handleNextTaskInLevel3 : undefined}
            onReplayWithRandom={handleRandomizeTask}
            onReplayShuffled={handleReplayCurrentShuffled}
            onOpenDerivation={() => setIsDerivationOpen(true)}
          />
        </div>

        {/* Stoichiometric Mole Balance & Reagent Consumption Visualizer */}
        <MoleBalanceBar task={currentTask} />
      </main>

      {/* Footer */}
      <footer className="mt-auto border-t border-slate-900 py-4 px-4 sm:px-6 text-center text-xs text-slate-400">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
          <span>
            Reakció Mestere – Kémiai Számítások & Sztöchiometriai Tréner
          </span>
          <div className="flex flex-wrap items-center justify-center gap-4">
            <button
              type="button"
              onClick={() => setIsBadgesOpen(true)}
              className="hover:text-emerald-400 transition cursor-pointer"
            >
              Jelvények
            </button>
            <button
              type="button"
              onClick={() => setIsGlossaryOpen(true)}
              className="hover:text-indigo-400 transition cursor-pointer"
            >
              Fogalomtár
            </button>
            <button
              type="button"
              onClick={() => setIsDerivationOpen(true)}
              className="hover:text-cyan-400 transition cursor-pointer"
            >
              Levezetések
            </button>
            <span className="text-slate-400 font-mono">100%-os mólarány ellenőrzés</span>
          </div>
        </div>
      </footer>

      {/* Modals */}
      <DerivationModal
        isOpen={isDerivationOpen}
        onClose={() => setIsDerivationOpen(false)}
        task={currentTask}
        activeQuestionIndex={activeQuestionIndex}
      />

      <GlossaryModal
        isOpen={isGlossaryOpen}
        onClose={() => setIsGlossaryOpen(false)}
      />

      <BadgesModal
        isOpen={isBadgesOpen}
        onClose={() => setIsBadgesOpen(false)}
        earnedBadgeIds={progress.earnedBadgeIds}
        totalScore={progress.score}
        randomTasksCompleted={progress.randomTasksCompleted}
        onResetProgress={handleResetProgress}
      />
    </div>
  );
}
