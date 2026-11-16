import { ChemistryTask, LevelInfo, QuestionOption } from '../types/chemistry';
import { buildShuffledOptions, fisherYatesShuffle } from '../utils/shuffle';

export const LEVELS: LevelInfo[] = [
  {
    id: 1,
    title: '1. Szint: Kémiai Alapok',
    subtitle: 'Reakcióegyenletek és Sztöchiometria',
    description: 'Ismerd meg az egyenletek együtthatóit és a reagensek mólarányait egyszerű reakciókban.',
    badge: 'Alapozó',
  },
  {
    id: 2,
    title: '2. Szint: Átalakulás és Hozam',
    subtitle: 'Konverzió és hatásfok',
    description: 'Gyakorold az átalakulási fok (α) és a termelési hozam (η) alapszámításait egytermékes reakciókban.',
    badge: 'Gyakorló',
  },
  {
    id: 3,
    title: '3. Szint: REAKCIÓ MESTERE',
    subtitle: 'Összetett számítási feladatok',
    description: 'Párhuzamos és konszekutív szubsztitúciós reakciók: összátalakulási fok, hasznos átalakulási fok, hozam és reagensfogyás.',
    badge: 'Mester',
  },
];

// Helper to generate distinct options including distractors, shuffled via Fisher-Yates
export function generateSmartOptions(
  questionKey: string,
  correct: number,
  distractors: number[]
): { options: QuestionOption[]; correctOptionId: string } {
  const set = new Set<number>();
  set.add(correct);
  for (const d of distractors) {
    if (d > 0 && d !== correct && set.size < 4) {
      set.add(Math.round(d * 10) / 10);
    }
  }
  const step = correct > 50 ? 10 : correct > 10 ? 5 : 2;
  let attempts = 0;
  while (set.size < 4 && attempts < 25) {
    attempts++;
    const offset = (Math.random() > 0.5 ? 1 : -1) * (Math.floor(Math.random() * 3) + 1) * step;
    const candidate = correct + offset;
    if (candidate > 0 && candidate !== correct) {
      set.add(Math.round(candidate * 10) / 10);
    }
  }
  return buildShuffledOptions(questionKey, correct, fisherYatesShuffle(Array.from(set)));
}

/**
 * Task 1: Toluol nitrálása (Benchmark standard task)
 */
export function createTask1Toluene(): ChemistryTask {
  const taskId = 'toluol-nitralas-benchmark';
  const q1 = buildShuffledOptions(`${taskId}-q1`, 10, [10, 20, 40, 5]);
  const q2 = buildShuffledOptions(`${taskId}-q2`, 90, [90, 80, 100, 70]);
  const q3 = buildShuffledOptions(`${taskId}-q3`, 90, [90, 80, 100, 70]);
  const q4 = buildShuffledOptions(`${taskId}-q4`, 20, [20, 22.2, 90, 30]);
  const q5 = buildShuffledOptions(`${taskId}-q5`, 20, [20, 22.2, 90, 40]);
  const q6 = buildShuffledOptions(`${taskId}-q6`, 160, [160, 90, 200, 270]);

  return {
    id: taskId,
    levelNumber: 3,
    title: '1. Feladat – Toluol nitrálása',
    subtitle: 'Mono-, di- és trinitrotoluol képződése',
    description:
      '100 mol toluolt nitrálunk salétromsavval. A reakció végén mono-, di- és trinitrotoluol keletkezik, miközben a toluol egy része változatlan marad. A kívánt termék a trinitrotoluol (TNT).',
    timeLimitSeconds: 360,
    startingMoles: 100,
    startingSubstance: {
      name: 'Toluol',
      formula: 'C₇H₈',
    },
    reagent: {
      name: 'Salétromsav',
      formula: 'HNO₃',
    },
    desiredProduct: {
      name: 'Trinitrotoluol (TNT)',
      formula: 'C₇H₅N₃O₆',
    },
    equations: [
      {
        reactants: 'C₇H₈ + HNO₃',
        products: 'C₇H₇NO₂ + H₂O',
        reagentMultiplier: 1,
        productName: 'Mononitrotoluol (MNT)',
        formula: 'C₇H₇NO₂',
      },
      {
        reactants: 'C₇H₈ + 2HNO₃',
        products: 'C₇H₆N₂O₄ + 2H₂O',
        reagentMultiplier: 2,
        productName: 'Dinitrotoluol (DNT)',
        formula: 'C₇H₆N₂O₄',
      },
      {
        reactants: 'C₇H₈ + 3HNO₃',
        products: 'C₇H₅N₃O₆ + 3H₂O',
        reagentMultiplier: 3,
        productName: 'Trinitrotoluol (TNT)',
        formula: 'C₇H₅N₃O₆',
      },
    ],
    components: [
      {
        id: 'mnt',
        name: 'Mononitrotoluol (MNT)',
        formula: 'C₇H₇NO₂',
        percentage: 40,
        moles: 40,
        reagentMultiplier: 1,
        color: '#38bdf8',
      },
      {
        id: 'dnt',
        name: 'Dinitrotoluol (DNT)',
        formula: 'C₇H₆N₂O₄',
        percentage: 30,
        moles: 30,
        reagentMultiplier: 2,
        color: '#818cf8',
      },
      {
        id: 'tnt',
        name: 'Trinitrotoluol (TNT)',
        formula: 'C₇H₅N₃O₆',
        percentage: 20,
        moles: 20,
        reagentMultiplier: 3,
        isDesired: true,
        color: '#f59e0b',
      },
      {
        id: 'unchanged-tol',
        name: 'Változatlan toluol',
        formula: 'C₇H₈',
        percentage: 10,
        moles: 10,
        reagentMultiplier: 0,
        isUnchanged: true,
        color: '#94a3b8',
      },
    ],
    questions: [
      {
        id: 1,
        prompt: 'Hány mol toluol maradt változatlanul?',
        unit: 'mol',
        correctAnswer: 10,
        correctOptionId: q1.correctOptionId,
        options: q1.options,
        hint: 'A táblázatban a változatlan toluol mólaránya 10%. A kiindulási anyag 100 mol volt.',
        explanation: 'A reakcióelegy toluolból származó molekuláinak 10%-a nem reagált: 100 mol × 10% = 10 mol.',
        derivation: 'n(változatlan C₇H₈) = n_kiindulási × 10% = 100 mol × 0,10 = 10 mol.',
        pedagogicalTip: 'A megmaradt anyagmennyiség közvetlenül leolvasható a változatlan toluol mólarányából.',
      },
      {
        id: 2,
        prompt: 'Hány mol toluol alakult át összesen?',
        unit: 'mol',
        correctAnswer: 90,
        correctOptionId: q2.correctOptionId,
        options: q2.options,
        hint: 'Az összesen átalakult toluol a kiindulási mennyiség és a megmaradt mennyiség különbsége (vagy a keletkezett termékek összege).',
        explanation: '100 mol kiindulási toluolból 10 mol maradt változatlanul, így 100 - 10 = 90 mol toluol alakult át összesen (40 + 30 + 20 = 90 mol).',
        derivation: 'n_átalakult = n_kiindulási - n_változatlan = 100 mol - 10 mol = 90 mol (vagy: 40 + 30 + 20 = 90 mol).',
        pedagogicalTip: 'Ne feledd: a mononitro-, dinitro- és trinitrotoluol mindegyike egy-egy mol toluolból keletkezett!',
      },
      {
        id: 3,
        prompt: 'Mennyi az összátalakulási fok?',
        unit: '%',
        correctAnswer: 90,
        correctOptionId: q3.correctOptionId,
        options: q3.options,
        hint: 'Az összátalakulási fok (α_össz) az összesen átalakult toluol és a kiindulási toluol hányadosa százalékban.',
        explanation: 'Összátalakulási fok: α_össz = (összesen átalakult / kiindulási) × 100% = (90 mol / 100 mol) × 100% = 90%.',
        derivation: 'α_össz = (n_átalakult / n_kiindulási) × 100% = (90 mol / 100 mol) × 100% = 90%.',
        pedagogicalTip: 'Az összátalakulási fok a kiindulási anyag teljes átalakulási mértékét fejezi ki, függetlenül attól, hogy melyik termék képződött.',
      },
      {
        id: 4,
        prompt: 'Mennyi a trinitrotoluolra vonatkozó hasznos átalakulási fok?',
        unit: '%',
        correctAnswer: 20,
        correctOptionId: q4.correctOptionId,
        options: q4.options,
        hint: 'A hasznos átalakulási fok (α_hasznos) azt mutatja meg, hogy a kiindulási toluol hány százaléka alakult a KÍVÁNT termékké (TNT).',
        explanation: 'A kívánt termék a trinitrotoluol. 20 mol toluolból lett TNT a 100 mol kiindulásiból, így a hasznos átalakulási fok 20%.',
        derivation: 'α_hasznos = (n_kívánt termékké alakult / n_kiindulási) × 100% = (20 mol / 100 mol) × 100% = 20%.',
        pedagogicalTip: 'Figyelem! Ne az összesen átalakulthoz viszonyíts, hanem mindig a KIINDULÁSI toluolhoz!',
      },
      {
        id: 5,
        prompt: 'Mennyi a trinitrotoluolra vonatkozó hozam?',
        unit: '%',
        correctAnswer: 20,
        correctOptionId: q5.correctOptionId,
        options: q5.options,
        hint: 'A hozam (η) a ténylegesen képződött kívánt termék és az elméletileg elérhető maximális mennyiség aránya.',
        explanation: '100 mol toluolból elméletileg maximum 100 mol TNT keletkezhetne. Ténylegesen 20 mol képződött, ezért a hozam: (20 / 100) × 100% = 20%.',
        derivation: 'η = (n_tényleges kívánt termék / n_elméleti maximum) × 100% = (20 mol / 100 mol) × 100% = 20%.',
        pedagogicalTip: '1:1 szénváz-sztöchiometria esetén (1 mol toluolból 1 mol TNT keletkezik elméletileg) a hasznos átalakulási fok és a hozam megegyezik: 20%.',
      },
      {
        id: 6,
        prompt: 'Hány mol salétromsav fogyott el összesen?',
        unit: 'mol',
        correctAnswer: 160,
        correctOptionId: q6.correctOptionId,
        options: q6.options,
        hint: 'Figyelj! A trinitrotoluol képződéséhez három mol salétromsav szükséges egy mol toluolra, a dinitrotoluolhoz kettő, a mononitrotoluolhoz egy.',
        explanation: 'Minden termékhez más mennyiségű HNO₃ kell: 40×1 (MNT) + 30×2 (DNT) + 20×3 (TNT) = 40 + 60 + 60 = 160 mol salétromsav.',
        derivation: 'n(HNO₃) = (40 mol × 1) + (30 mol × 2) + (20 mol × 3) = 40 + 60 + 60 = 160 mol HNO₃.',
        pedagogicalTip: 'Nagyon fontos! A diákok gyakran összekeverik a termékek anyagmennyiségét a felhasznált reagenssel. A sztöchiometriai együtthatókat (1, 2, 3) mindig szorozni kell!',
      },
    ],
  };
}

/**
 * Task 2: Metán klórozása (Benchmark standard task)
 */
export function createTask2Methane(): ChemistryTask {
  const taskId = 'metan-klorozas-benchmark';
  const q1 = buildShuffledOptions(`${taskId}-q1`, 20, [20, 10, 40, 15]);
  const q2 = buildShuffledOptions(`${taskId}-q2`, 180, [180, 190, 160, 200]);
  const q3 = buildShuffledOptions(`${taskId}-q3`, 90, [90, 80, 100, 85]);
  const q4 = buildShuffledOptions(`${taskId}-q4`, 30, [30, 33.3, 60, 25]);
  const q5 = buildShuffledOptions(`${taskId}-q5`, 30, [30, 33.3, 90, 60]);
  const q6 = buildShuffledOptions(`${taskId}-q6`, 400, [400, 470, 180, 540]);

  return {
    id: taskId,
    levelNumber: 3,
    title: '2. Feladat – Metán klórozása',
    subtitle: 'Klórmetán, di-, tri- és tetraklórmetán szubsztitúciója',
    description:
      '200 mol metánt klórozunk klórgázzal. A reakció végén különböző mértékben klórozott származékok keletkeznek, és a metán egy része változatlan marad. A kívánt termék a klórmetán (CH₃Cl).',
    timeLimitSeconds: 360,
    startingMoles: 200,
    startingSubstance: {
      name: 'Metán',
      formula: 'CH₄',
    },
    reagent: {
      name: 'Klór',
      formula: 'Cl₂',
    },
    desiredProduct: {
      name: 'Klórmetán',
      formula: 'CH₃Cl',
    },
    equations: [
      {
        reactants: 'CH₄ + Cl₂',
        products: 'CH₃Cl + HCl',
        reagentMultiplier: 1,
        productName: 'Klórmetán',
        formula: 'CH₃Cl',
      },
      {
        reactants: 'CH₄ + 2Cl₂',
        products: 'CH₂Cl₂ + 2HCl',
        reagentMultiplier: 2,
        productName: 'Diklórmetán',
        formula: 'CH₂Cl₂',
      },
      {
        reactants: 'CH₄ + 3Cl₂',
        products: 'CHCl₃ + 3HCl',
        reagentMultiplier: 3,
        productName: 'Triklórmetán (Kloroform)',
        formula: 'CHCl₃',
      },
      {
        reactants: 'CH₄ + 4Cl₂',
        products: 'CCl₄ + 4HCl',
        reagentMultiplier: 4,
        productName: 'Tetraklórmetán (Szén-tetraklorid)',
        formula: 'CCl₄',
      },
    ],
    components: [
      {
        id: 'ch3cl',
        name: 'Klórmetán',
        formula: 'CH₃Cl',
        percentage: 30,
        moles: 60,
        reagentMultiplier: 1,
        isDesired: true,
        color: '#10b981',
      },
      {
        id: 'ch2cl2',
        name: 'Diklórmetán',
        formula: 'CH₂Cl₂',
        percentage: 25,
        moles: 50,
        reagentMultiplier: 2,
        color: '#06b6d4',
      },
      {
        id: 'chcl3',
        name: 'Triklórmetán',
        formula: 'CHCl₃',
        percentage: 20,
        moles: 40,
        reagentMultiplier: 3,
        color: '#6366f1',
      },
      {
        id: 'ccl4',
        name: 'Tetraklórmetán',
        formula: 'CCl₄',
        percentage: 15,
        moles: 30,
        reagentMultiplier: 4,
        color: '#a855f7',
      },
      {
        id: 'unchanged-ch4',
        name: 'Változatlan metán',
        formula: 'CH₄',
        percentage: 10,
        moles: 20,
        reagentMultiplier: 0,
        isUnchanged: true,
        color: '#94a3b8',
      },
    ],
    questions: [
      {
        id: 1,
        prompt: 'Hány mol metán maradt változatlanul?',
        unit: 'mol',
        correctAnswer: 20,
        correctOptionId: q1.correctOptionId,
        options: q1.options,
        hint: 'A kiindulási metán 200 mol volt, és a reakcióelegy 10%-a változatlan metán.',
        explanation: 'A 200 mol kiindulási metán 10%-a maradt meg változatlanul: 200 mol × 0,10 = 20 mol.',
        derivation: 'n(változatlan CH₄) = n_kiindulási × 10% = 200 mol × 0,10 = 20 mol.',
        pedagogicalTip: 'Ügyelj arra, hogy most a kiindulási anyag 200 mol, nem 100 mol, így a 10% az 20 mol-t jelent!',
      },
      {
        id: 2,
        prompt: 'Hány mol metán alakult át összesen?',
        unit: 'mol',
        correctAnswer: 180,
        correctOptionId: q2.correctOptionId,
        options: q2.options,
        hint: 'Az összes átalakult metán = kiindulási metán (200 mol) - változatlanul maradt metán (20 mol).',
        explanation: 'A 200 mol metánból 20 mol maradt változatlanul, így 200 - 20 = 180 mol metán alakult át termékekké (60 + 50 + 40 + 30 = 180 mol).',
        derivation: 'n_átalakult = n_kiindulási - n_változatlan = 200 mol - 20 mol = 180 mol (vagy: 60 + 50 + 40 + 30 = 180 mol).',
        pedagogicalTip: 'Az átalakult anyagmennyiség a keletkezett származékok mólszámának összege.',
      },
      {
        id: 3,
        prompt: 'Mennyi az összátalakulási fok?',
        unit: '%',
        correctAnswer: 90,
        correctOptionId: q3.correctOptionId,
        options: q3.options,
        hint: 'Az összátalakulási fok: az összesen átalakult metán (180 mol) és a kiindulási metán (200 mol) aránya százalékban.',
        explanation: 'Összátalakulási fok: α_össz = (180 mol / 200 mol) × 100% = 90%.',
        derivation: 'α_össz = (n_átalakult / n_kiindulási) × 100% = (180 mol / 200 mol) × 100% = 90%.',
        pedagogicalTip: 'A termékek mólarányainak összege (30% + 25% + 20% + 15% = 90%) közvetlenül megadja az összátalakulási fokot!',
      },
      {
        id: 4,
        prompt: 'Mennyi a klórmetánra vonatkozó hasznos átalakulási fok?',
        unit: '%',
        correctAnswer: 30,
        correctOptionId: q4.correctOptionId,
        options: q4.options,
        hint: 'A kívánt termék a klórmetán (CH₃Cl). A hasznos átalakulási fok azt adja meg, hogy a kiindulási metán mekkora hányadából lett klórmetán.',
        explanation: 'A 200 mol kiindulási metánból 60 mol klórmetán keletkezett: (60 mol / 200 mol) × 100% = 30%.',
        derivation: 'α_hasznos = (n_CH₃Cl / n_kiindulási) × 100% = (60 mol / 200 mol) × 100% = 30%.',
        pedagogicalTip: 'A hasznos átalakulási fok mindig a kívánt termékre vonatkozik a kiindulási anyaghoz viszonyítva.',
      },
      {
        id: 5,
        prompt: 'Mennyi a klórmetánra vonatkozó hozam?',
        unit: '%',
        correctAnswer: 30,
        correctOptionId: q5.correctOptionId,
        options: q5.options,
        hint: 'Hozam (η): a ténylegesen képződött klórmetán (60 mol) és az elméletileg lehetséges maximum (200 mol) hányadosa.',
        explanation: 'Mivel 1 mol metánból maximum 1 mol klórmetán képződhetne, a 200 mol-ból elméletileg 200 mol képződhetne. Hozam = (60 / 200) × 100% = 30%.',
        derivation: 'η = (n_tényleges CH₃Cl / n_elméleti maximum) × 100% = (60 mol / 200 mol) × 100% = 30%.',
        pedagogicalTip: 'Figyeld meg: 1:1 sztöchiometria esetén az elméleti maximum megegyezik a kiindulási anyagmennyiséggel, így a hozam 30%.',
      },
      {
        id: 6,
        prompt: 'Hány mol klór fogyott el összesen?',
        unit: 'mol',
        correctAnswer: 400,
        correctOptionId: q6.correctOptionId,
        options: q6.options,
        hint: 'Figyelj a sztöchiometriára! CH₃Cl-hez 1 Cl₂, CH₂Cl₂-höz 2 Cl₂, CHCl₃-hoz 3 Cl₂, CCl₄-hez pedig 4 Cl₂ szükséges!',
        explanation: 'Klórfogyás: 60×1 (CH₃Cl) + 50×2 (CH₂Cl₂) + 40×3 (CHCl₃) + 30×4 (CCl₄) = 60 + 100 + 120 + 120 = 400 mol Cl₂.',
        derivation: 'n(Cl₂) = (60 mol × 1) + (50 mol × 2) + (40 mol × 3) + (30 mol × 4) = 60 + 100 + 120 + 120 = 400 mol Cl₂.',
        pedagogicalTip: 'Helyes eredmény: 400 mol Cl₂! A diákok gyakran elfelejtik a tetraklórmetán 4-es vagy a kloroform 3-as szorzóját!',
      },
    ],
  };
}

export const TASK_1_TOLUENE: ChemistryTask = createTask1Toluene();
export const TASK_2_METHANE: ChemistryTask = createTask2Methane();

/**
 * Procedural Generator for Replaying with dynamic randomized, 100%-verified numbers.
 * Supports toluene nitration or methane chlorination with new random percentages that sum to 100%.
 */
export function generateRandomLevel3Task(type: 'toluene' | 'methane'): ChemistryTask {
  if (type === 'toluene') {
    const startMolesChoices = [100, 150, 200, 250, 300];
    const n_start = startMolesChoices[Math.floor(Math.random() * startMolesChoices.length)];

    const unchangedPct = 5 + Math.floor(Math.random() * 3) * 5; // 5, 10, or 15%
    const tntPct = 15 + Math.floor(Math.random() * 4) * 5; // 15, 20, 25, 30%
    const dntPct = 20 + Math.floor(Math.random() * 4) * 5; // 20, 25, 30, 35%
    const mntPct = 100 - (unchangedPct + tntPct + dntPct);

    const n_mnt = (n_start * mntPct) / 100;
    const n_dnt = (n_start * dntPct) / 100;
    const n_tnt = (n_start * tntPct) / 100;
    const n_unchanged = (n_start * unchangedPct) / 100;
    const n_converted = n_start - n_unchanged;

    const alpha_total = (n_converted / n_start) * 100;
    const alpha_useful = (n_tnt / n_start) * 100;
    const yield_pct = (n_tnt / n_start) * 100;

    const n_hno3 = n_mnt * 1 + n_dnt * 2 + n_tnt * 3;
    const taskId = `toluol-random-${Date.now()}`;

    const q1 = generateSmartOptions(`${taskId}-q1`, n_unchanged, [n_start * 0.1, n_start * 0.2, n_unchanged + 10, Math.max(5, n_unchanged - 10)]);
    const q2 = generateSmartOptions(`${taskId}-q2`, n_converted, [n_start, n_converted - 20, n_converted + 15, n_start * 0.8]);
    const q3 = generateSmartOptions(`${taskId}-q3`, alpha_total, [alpha_total - 10, 100, alpha_useful, alpha_total - 20]);
    const q4 = generateSmartOptions(`${taskId}-q4`, alpha_useful, [alpha_total, alpha_useful + 10, alpha_useful - 5, 50]);
    const q5 = generateSmartOptions(`${taskId}-q5`, yield_pct, [alpha_total, yield_pct + 10, yield_pct - 5, 60]);
    const q6 = generateSmartOptions(`${taskId}-q6`, n_hno3, [n_converted, n_hno3 + 30, n_hno3 - 40, n_converted * 2]);

    return {
      id: taskId,
      levelNumber: 3,
      title: '1. Feladat – Toluol nitrálása (Véletlenszerű adatokkal)',
      subtitle: 'Dinamikusan generált feladat ellenőrzött levezetéssel',
      description: `${n_start} mol toluolt nitrálunk salétromsavval. A kívánt termék a trinitrotoluol (TNT). Határozd meg az átalakulási mutatókat és a reagensfogyást!`,
      timeLimitSeconds: 360,
      startingMoles: n_start,
      startingSubstance: { name: 'Toluol', formula: 'C₇H₈' },
      reagent: { name: 'Salétromsav', formula: 'HNO₃' },
      desiredProduct: { name: 'Trinitrotoluol (TNT)', formula: 'C₇H₅N₃O₆' },
      equations: TASK_1_TOLUENE.equations,
      components: [
        {
          id: 'mnt',
          name: 'Mononitrotoluol (MNT)',
          formula: 'C₇H₇NO₂',
          percentage: mntPct,
          moles: n_mnt,
          reagentMultiplier: 1,
          color: '#38bdf8',
        },
        {
          id: 'dnt',
          name: 'Dinitrotoluol (DNT)',
          formula: 'C₇H₆N₂O₄',
          percentage: dntPct,
          moles: n_dnt,
          reagentMultiplier: 2,
          color: '#818cf8',
        },
        {
          id: 'tnt',
          name: 'Trinitrotoluol (TNT)',
          formula: 'C₇H₅N₃O₆',
          percentage: tntPct,
          moles: n_tnt,
          reagentMultiplier: 3,
          isDesired: true,
          color: '#f59e0b',
        },
        {
          id: 'unchanged-tol',
          name: 'Változatlan toluol',
          formula: 'C₇H₈',
          percentage: unchangedPct,
          moles: n_unchanged,
          reagentMultiplier: 0,
          isUnchanged: true,
          color: '#94a3b8',
        },
      ],
      questions: [
        {
          id: 1,
          prompt: 'Hány mol toluol maradt változatlanul?',
          unit: 'mol',
          correctAnswer: n_unchanged,
          correctOptionId: q1.correctOptionId,
          options: q1.options,
          hint: `A táblázat szerint a változatlan toluol mólaránya ${unchangedPct}%. A kiindulási toluol ${n_start} mol volt.`,
          explanation: `A reakcióelegy toluolból származó molekuláinak ${unchangedPct}%-a maradt meg: ${n_start} mol × ${unchangedPct}% = ${n_unchanged} mol.`,
          derivation: `n(változatlan) = ${n_start} mol × ${unchangedPct / 100} = ${n_unchanged} mol.`,
        },
        {
          id: 2,
          prompt: 'Hány mol toluol alakult át összesen?',
          unit: 'mol',
          correctAnswer: n_converted,
          correctOptionId: q2.correctOptionId,
          options: q2.options,
          hint: `Összesen átalakult = kiindulási (${n_start} mol) - megmaradt (${n_unchanged} mol).`,
          explanation: `${n_start} mol - ${n_unchanged} mol = ${n_converted} mol toluol alakult át összesen.`,
          derivation: `n_átalakult = ${n_start} mol - ${n_unchanged} mol = ${n_converted} mol.`,
        },
        {
          id: 3,
          prompt: 'Mennyi az összátalakulási fok?',
          unit: '%',
          correctAnswer: alpha_total,
          correctOptionId: q3.correctOptionId,
          options: q3.options,
          hint: `Összátalakulási fok = (összesen átalakult toluol / kiindulási toluol) × 100%.`,
          explanation: `α_össz = (${n_converted} / ${n_start}) × 100% = ${alpha_total}%.`,
          derivation: `α_össz = (${n_converted} mol / ${n_start} mol) × 100% = ${alpha_total}%.`,
        },
        {
          id: 4,
          prompt: 'Mennyi a trinitrotoluolra vonatkozó hasznos átalakulási fok?',
          unit: '%',
          correctAnswer: alpha_useful,
          correctOptionId: q4.correctOptionId,
          options: q4.options,
          hint: `A kívánt termék a TNT. Hasznos átalakulási fok = (TNT-vé alakult toluol / kiindulási toluol) × 100%.`,
          explanation: `${n_tnt} mol toluolból lett TNT a ${n_start} mol kiindulásiból: (${n_tnt} / ${n_start}) × 100% = ${alpha_useful}%.`,
          derivation: `α_hasznos = (${n_tnt} mol / ${n_start} mol) × 100% = ${alpha_useful}%.`,
        },
        {
          id: 5,
          prompt: 'Mennyi a trinitrotoluolra vonatkozó hozam?',
          unit: '%',
          correctAnswer: yield_pct,
          correctOptionId: q5.correctOptionId,
          options: q5.options,
          hint: `Hozam = (képződött TNT / elméleti maximális TNT) × 100%. Mivel 1:1 a sztöchiometria, az elméleti maximum ${n_start} mol.`,
          explanation: `(${n_tnt} mol képződött TNT / ${n_start} mol elméleti max) × 100% = ${yield_pct}%.`,
          derivation: `η = (${n_tnt} mol / ${n_start} mol) × 100% = ${yield_pct}%.`,
        },
        {
          id: 6,
          prompt: 'Hány mol salétromsav fogyott el összesen?',
          unit: 'mol',
          correctAnswer: n_hno3,
          correctOptionId: q6.correctOptionId,
          options: q6.options,
          hint: `Minden MNT-hez 1 mol HNO₃, minden DNT-hez 2 mol HNO₃, minden TNT-hez 3 mol HNO₃ kell!`,
          explanation: `Salétromsavfogyás: ${n_mnt}×1 + ${n_dnt}×2 + ${n_tnt}×3 = ${n_mnt} + ${n_dnt * 2} + ${n_tnt * 3} = ${n_hno3} mol HNO₃.`,
          derivation: `n(HNO₃) = (${n_mnt} mol × 1) + (${n_dnt} mol × 2) + (${n_tnt} mol × 3) = ${n_hno3} mol.`,
        },
      ],
    };
  } else {
    const startMolesChoices = [100, 200, 300, 400];
    const n_start = startMolesChoices[Math.floor(Math.random() * startMolesChoices.length)];

    const unchangedPct = 10;
    const ccl4Pct = 10 + Math.floor(Math.random() * 2) * 5;
    const chcl3Pct = 15 + Math.floor(Math.random() * 2) * 5;
    const ch2cl2Pct = 20 + Math.floor(Math.random() * 2) * 5;
    const ch3clPct = 100 - (unchangedPct + ccl4Pct + chcl3Pct + ch2cl2Pct);

    const n_ch3cl = (n_start * ch3clPct) / 100;
    const n_ch2cl2 = (n_start * ch2cl2Pct) / 100;
    const n_chcl3 = (n_start * chcl3Pct) / 100;
    const n_ccl4 = (n_start * ccl4Pct) / 100;
    const n_unchanged = (n_start * unchangedPct) / 100;
    const n_converted = n_start - n_unchanged;

    const alpha_total = (n_converted / n_start) * 100;
    const alpha_useful = (n_ch3cl / n_start) * 100;
    const yield_pct = (n_ch3cl / n_start) * 100;

    const n_cl2 = n_ch3cl * 1 + n_ch2cl2 * 2 + n_chcl3 * 3 + n_ccl4 * 4;
    const taskId = `metan-random-${Date.now()}`;

    const q1 = generateSmartOptions(`${taskId}-q1`, n_unchanged, [unchangedPct, n_start * 0.2, n_unchanged + 10, 10]);
    const q2 = generateSmartOptions(`${taskId}-q2`, n_converted, [n_start, n_converted - 20, n_converted + 20, n_start * 0.8]);
    const q3 = generateSmartOptions(`${taskId}-q3`, alpha_total, [alpha_total - 10, 100, alpha_useful, alpha_total - 20]);
    const q4 = generateSmartOptions(`${taskId}-q4`, alpha_useful, [alpha_total, alpha_useful + 10, alpha_useful - 5, 45]);
    const q5 = generateSmartOptions(`${taskId}-q5`, yield_pct, [alpha_total, yield_pct + 10, yield_pct - 5, 50]);
    const q6 = generateSmartOptions(`${taskId}-q6`, n_cl2, [n_converted, n_cl2 + 50, n_cl2 - 60, n_converted * 2]);

    return {
      id: taskId,
      levelNumber: 3,
      title: '2. Feladat – Metán klórozása (Véletlenszerű adatokkal)',
      subtitle: 'Dinamikusan generált feladat ellenőrzött levezetéssel',
      description: `${n_start} mol metánt klórozunk klórgázzal. A kívánt termék a klórmetán (CH₃Cl). Számítsd ki az átalakulásokat és a klórgáz fogyását!`,
      timeLimitSeconds: 360,
      startingMoles: n_start,
      startingSubstance: { name: 'Metán', formula: 'CH₄' },
      reagent: { name: 'Klór', formula: 'Cl₂' },
      desiredProduct: { name: 'Klórmetán', formula: 'CH₃Cl' },
      equations: TASK_2_METHANE.equations,
      components: [
        {
          id: 'ch3cl',
          name: 'Klórmetán',
          formula: 'CH₃Cl',
          percentage: ch3clPct,
          moles: n_ch3cl,
          reagentMultiplier: 1,
          isDesired: true,
          color: '#10b981',
        },
        {
          id: 'ch2cl2',
          name: 'Diklórmetán',
          formula: 'CH₂Cl₂',
          percentage: ch2cl2Pct,
          moles: n_ch2cl2,
          reagentMultiplier: 2,
          color: '#06b6d4',
        },
        {
          id: 'chcl3',
          name: 'Triklórmetán',
          formula: 'CHCl₃',
          percentage: chcl3Pct,
          moles: n_chcl3,
          reagentMultiplier: 3,
          color: '#6366f1',
        },
        {
          id: 'ccl4',
          name: 'Tetraklórmetán',
          formula: 'CCl₄',
          percentage: ccl4Pct,
          moles: n_ccl4,
          reagentMultiplier: 4,
          color: '#a855f7',
        },
        {
          id: 'unchanged-ch4',
          name: 'Változatlan metán',
          formula: 'CH₄',
          percentage: unchangedPct,
          moles: n_unchanged,
          reagentMultiplier: 0,
          isUnchanged: true,
          color: '#94a3b8',
        },
      ],
      questions: [
        {
          id: 1,
          prompt: 'Hány mol metán maradt változatlanul?',
          unit: 'mol',
          correctAnswer: n_unchanged,
          correctOptionId: q1.correctOptionId,
          options: q1.options,
          hint: `A kiindulási metán ${n_start} mol, ennek ${unchangedPct}%-a maradt változatlanul.`,
          explanation: `${n_start} mol × ${unchangedPct}% = ${n_unchanged} mol metán maradt változatlanul.`,
          derivation: `n(változatlan) = ${n_start} mol × ${unchangedPct / 100} = ${n_unchanged} mol.`,
        },
        {
          id: 2,
          prompt: 'Hány mol metán alakult át összesen?',
          unit: 'mol',
          correctAnswer: n_converted,
          correctOptionId: q2.correctOptionId,
          options: q2.options,
          hint: `Összes átalakult = kiindulási (${n_start} mol) - megmaradt (${n_unchanged} mol).`,
          explanation: `${n_start} mol - ${n_unchanged} mol = ${n_converted} mol metán alakult át.`,
          derivation: `n_átalakult = ${n_start} mol - ${n_unchanged} mol = ${n_converted} mol.`,
        },
        {
          id: 3,
          prompt: 'Mennyi az összátalakulási fok?',
          unit: '%',
          correctAnswer: alpha_total,
          correctOptionId: q3.correctOptionId,
          options: q3.options,
          hint: `Összátalakulási fok = (${n_converted} mol átalakult / ${n_start} mol kiindulási) × 100%.`,
          explanation: `α_össz = (${n_converted} / ${n_start}) × 100% = ${alpha_total}%.`,
          derivation: `α_össz = (${n_converted} mol / ${n_start} mol) × 100% = ${alpha_total}%.`,
        },
        {
          id: 4,
          prompt: 'Mennyi a klórmetánra vonatkozó hasznos átalakulási fok?',
          unit: '%',
          correctAnswer: alpha_useful,
          correctOptionId: q4.correctOptionId,
          options: q4.options,
          hint: `A kívánt termék a klórmetán. Hasznos átalakulási fok = (klórmetánná alakult metán / kiindulási metán) × 100%.`,
          explanation: `${n_ch3cl} mol metánból lett klórmetán a ${n_start} mol-ból: (${n_ch3cl} / ${n_start}) × 100% = ${alpha_useful}%.`,
          derivation: `α_hasznos = (${n_ch3cl} mol / ${n_start} mol) × 100% = ${alpha_useful}%.`,
        },
        {
          id: 5,
          prompt: 'Mennyi a klórmetánra vonatkozó hozam?',
          unit: '%',
          correctAnswer: yield_pct,
          correctOptionId: q5.correctOptionId,
          options: q5.options,
          hint: `Hozam = (képződött klórmetán / elméleti maximum) × 100%. Elméleti maximum = ${n_start} mol.`,
          explanation: `(${n_ch3cl} mol / ${n_start} mol) × 100% = ${yield_pct}%.`,
          derivation: `η = (${n_ch3cl} mol / ${n_start} mol) × 100% = ${yield_pct}%.`,
        },
        {
          id: 6,
          prompt: 'Hány mol klór fogyott el összesen?',
          unit: 'mol',
          correctAnswer: n_cl2,
          correctOptionId: q6.correctOptionId,
          options: q6.options,
          hint: `Sztöchiometriai együtthatók: CH₃Cl (×1), CH₂Cl₂ (×2), CHCl₃ (×3), CCl₄ (×4)!`,
          explanation: `Klórfogyás: ${n_ch3cl}×1 + ${n_ch2cl2}×2 + ${n_chcl3}×3 + ${n_ccl4}×4 = ${n_cl2} mol Cl₂.`,
          derivation: `n(Cl₂) = (${n_ch3cl}×1) + (${n_ch2cl2}×2) + (${n_chcl3}×3) + (${n_ccl4}×4) = ${n_cl2} mol Cl₂.`,
        },
      ],
    };
  }
}

/**
 * Level 1 & Level 2 tasks for complete curriculum progression
 */
export function createLevel1Task(): ChemistryTask {
  const taskId = 'level-1-ammonia';
  const q1 = buildShuffledOptions(`${taskId}-q1`, 40, [40, 50, 10, 30]);
  const q2 = buildShuffledOptions(`${taskId}-q2`, 120, [120, 40, 80, 150]);
  const q3 = buildShuffledOptions(`${taskId}-q3`, 80, [80, 40, 120, 60]);

  return {
    id: taskId,
    levelNumber: 1,
    title: '1. Szint – Ammóniaszintézis és Sztöchiometria',
    subtitle: 'Együtthatók és reagensarányok',
    description:
      'N₂ + 3H₂ ⇌ 2NH₃ reakcióban vizsgáljuk a sztöchiometriai arányokat és a reagensfogyást.',
    timeLimitSeconds: 180,
    startingMoles: 50,
    startingSubstance: { name: 'Nitrogén', formula: 'N₂' },
    reagent: { name: 'Hidrogén', formula: 'H₂' },
    desiredProduct: { name: 'Ammónia', formula: 'NH₃' },
    equations: [
      {
        reactants: 'N₂ + 3H₂',
        products: '2NH₃',
        reagentMultiplier: 3,
        productName: 'Ammónia',
        formula: 'NH₃',
      },
    ],
    components: [
      {
        id: 'nh3',
        name: 'Ammónia',
        formula: 'NH₃',
        percentage: 80,
        moles: 80,
        reagentMultiplier: 3,
        isDesired: true,
        color: '#38bdf8',
      },
      {
        id: 'unchanged-n2',
        name: 'Változatlan N₂',
        formula: 'N₂',
        percentage: 20,
        moles: 10,
        reagentMultiplier: 0,
        isUnchanged: true,
        color: '#94a3b8',
      },
    ],
    questions: [
      {
        id: 1,
        prompt: 'Hány mol N₂ alakult át 50 mol kiindulásiból, ha 10 mol maradt meg?',
        unit: 'mol',
        correctAnswer: 40,
        correctOptionId: q1.correctOptionId,
        options: q1.options,
        hint: 'Átalakult = kiindulási (50 mol) - megmaradt (10 mol).',
        explanation: '50 mol - 10 mol = 40 mol N₂ alakult át ammóniává.',
        derivation: 'n(N₂ átalakult) = 50 mol - 10 mol = 40 mol.',
      },
      {
        id: 2,
        prompt: 'Hány mol H₂ fogyott el a 40 mol N₂ átalakulásához?',
        unit: 'mol',
        correctAnswer: 120,
        correctOptionId: q2.correctOptionId,
        options: q2.options,
        hint: 'A sztöchiometriai egyenlet szerint 1 mol N₂-hez 3 mol H₂ szükséges (N₂ + 3H₂ → 2NH₃).',
        explanation: '40 mol N₂ × 3 = 120 mol H₂ fogyott el.',
        derivation: 'n(H₂) = 40 mol N₂ × 3 = 120 mol H₂.',
      },
      {
        id: 3,
        prompt: 'Hány mol NH₃ képződött a reakció során?',
        unit: 'mol',
        correctAnswer: 80,
        correctOptionId: q3.correctOptionId,
        options: q3.options,
        hint: '1 mol N₂ átalakulásából 2 mol NH₃ keletkezik.',
        explanation: '40 mol N₂ × 2 = 80 mol NH₃ képződött.',
        derivation: 'n(NH₃) = 40 mol × 2 = 80 mol.',
      },
    ],
  };
}

export function createLevel2Task(): ChemistryTask {
  const taskId = 'level-2-etanol';
  const q1 = buildShuffledOptions(`${taskId}-q1`, 75, [75, 25, 100, 80]);
  const q2 = buildShuffledOptions(`${taskId}-q2`, 75, [75, 100, 50, 90]);

  return {
    id: taskId,
    levelNumber: 2,
    title: '2. Szint – Etilén hidratálása és Konverzió',
    subtitle: 'Átalakulási fok és Hozamszámítás',
    description:
      'C₂H₄ + H₂O → C₂H₅OH reakcióban 100 mol etilénből 75 mol alakult át etanollá.',
    timeLimitSeconds: 180,
    startingMoles: 100,
    startingSubstance: { name: 'Etilén', formula: 'C₂H₄' },
    reagent: { name: 'Vízgőz', formula: 'H₂O' },
    desiredProduct: { name: 'Etanol', formula: 'C₂H₅OH' },
    equations: [
      {
        reactants: 'C₂H₄ + H₂O',
        products: 'C₂H₅OH',
        reagentMultiplier: 1,
        productName: 'Etanol',
        formula: 'C₂H₅OH',
      },
    ],
    components: [
      {
        id: 'ethanol',
        name: 'Etanol',
        formula: 'C₂H₅OH',
        percentage: 75,
        moles: 75,
        reagentMultiplier: 1,
        isDesired: true,
        color: '#10b981',
      },
      {
        id: 'unchanged-ethene',
        name: 'Változatlan etilén',
        formula: 'C₂H₄',
        percentage: 25,
        moles: 25,
        reagentMultiplier: 0,
        isUnchanged: true,
        color: '#94a3b8',
      },
    ],
    questions: [
      {
        id: 1,
        prompt: 'Mennyi az etilén átalakulási foka (α)?',
        unit: '%',
        correctAnswer: 75,
        correctOptionId: q1.correctOptionId,
        options: q1.options,
        hint: 'α = (átalakult etilén / kiindulási etilén) × 100%.',
        explanation: 'α = (75 mol / 100 mol) × 100% = 75%.',
        derivation: 'α = (75 mol / 100 mol) × 100% = 75%.',
      },
      {
        id: 2,
        prompt: 'Mennyi az etanolra vonatkozó termelési hozam (η)?',
        unit: '%',
        correctAnswer: 75,
        correctOptionId: q2.correctOptionId,
        options: q2.options,
        hint: 'Mivel mellékreakció nem történt és 1:1 az átalakulás, az elméleti maximum 100 mol etanol.',
        explanation: 'η = (75 mol / 100 mol elméleti) × 100% = 75%.',
        derivation: 'η = (75 mol / 100 mol) × 100% = 75%.',
      },
    ],
  };
}

export const LEVEL_1_TASK: ChemistryTask = createLevel1Task();
export const LEVEL_2_TASK: ChemistryTask = createLevel2Task();
