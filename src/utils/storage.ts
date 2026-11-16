import { BadgeDefinition, PlayerProgress } from '../types/chemistry';

const STORAGE_KEY = 'reakcio_mestere_player_progress_v1';

export const BADGE_DEFINITIONS: BadgeDefinition[] = [
  {
    id: 'alapok-bajnoka',
    title: 'Alapozó',
    description: '1. Szint: Ammóniaszintézis sikeres teljesítése',
    levelNumber: 1,
    color: 'sky',
  },
  {
    id: 'konverzio-szakerto',
    title: 'Gyakorló',
    description: '2. Szint: Etilén hidratálása sikeres teljesítése',
    levelNumber: 2,
    color: 'emerald',
  },
  {
    id: 'nitralas-mestere',
    title: 'Nitrálás Mestere',
    description: '3. Szint – 1. feladat (Toluol nitrálása) teljesítése',
    levelNumber: 3,
    color: 'amber',
  },
  {
    id: 'klorozas-mestere',
    title: 'Klórozás Mestere',
    description: '3. Szint – 2. feladat (Metán klórozása) teljesítése',
    levelNumber: 3,
    color: 'teal',
  },
  {
    id: 'reakcio-mestere',
    title: 'Reakció Mestere',
    description: 'A 3. szint mindkét kötelező feladatának sikeres teljesítése',
    levelNumber: 3,
    color: 'purple',
  },
  {
    id: 'veletlen-kihivo',
    title: 'Kísérletező',
    description: 'Véletlenszerű adatokkal generált feladat sikeres megoldása',
    levelNumber: 3,
    color: 'indigo',
  },
];

const DEFAULT_PROGRESS: PlayerProgress = {
  score: 0,
  completedTaskIds: [],
  earnedBadgeIds: [],
  randomTasksCompleted: 0,
};

export function loadPlayerProgress(): PlayerProgress {
  if (typeof window === 'undefined') return { ...DEFAULT_PROGRESS };
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return { ...DEFAULT_PROGRESS };
    const parsed = JSON.parse(raw) as Partial<PlayerProgress>;
    return {
      score: typeof parsed.score === 'number' && parsed.score >= 0 ? parsed.score : 0,
      completedTaskIds: Array.isArray(parsed.completedTaskIds) ? parsed.completedTaskIds : [],
      earnedBadgeIds: Array.isArray(parsed.earnedBadgeIds) ? parsed.earnedBadgeIds : [],
      randomTasksCompleted:
        typeof parsed.randomTasksCompleted === 'number' ? parsed.randomTasksCompleted : 0,
    };
  } catch {
    return { ...DEFAULT_PROGRESS };
  }
}

export function savePlayerProgress(progress: PlayerProgress): void {
  if (typeof window === 'undefined') return;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
  } catch {
    // Ignore storage quota or sandbox restrictions (e.g. private browsing / iframe)
  }
}

export function computeEarnedBadges(
  completedIds: Set<string>,
  randomCount: number,
  existingBadges: string[]
): string[] {
  const badges = new Set<string>(existingBadges);
  if (completedIds.has('level-1-ammonia')) badges.add('alapok-bajnoka');
  if (completedIds.has('level-2-etanol')) badges.add('konverzio-szakerto');
  if (completedIds.has('toluol-nitralas-benchmark')) badges.add('nitralas-mestere');
  if (completedIds.has('metan-klorozas-benchmark')) badges.add('klorozas-mestere');
  if (
    completedIds.has('toluol-nitralas-benchmark') &&
    completedIds.has('metan-klorozas-benchmark')
  ) {
    badges.add('reakcio-mestere');
  }
  if (randomCount > 0) badges.add('veletlen-kihivo');
  return Array.from(badges);
}
