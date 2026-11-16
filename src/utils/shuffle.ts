import { ChemistryTask, QuestionOption, QuestionStep } from '../types/chemistry';

/**
 * Unbiased Fisher-Yates shuffle algorithm.
 * Guarantees uniform distribution across all positions.
 */
export function fisherYatesShuffle<T>(items: readonly T[]): T[] {
  const copy = [...items];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

/**
 * Creates unique ID-tagged QuestionOption items from raw numbers and shuffles them using Fisher-Yates.
 */
export function buildShuffledOptions(
  questionKey: string,
  correctValue: number,
  rawValues: number[],
  nonce: string = ''
): { options: QuestionOption[]; correctOptionId: string } {
  // Ensure unique numeric values with correctValue included once
  const uniqueValues = Array.from(new Set([correctValue, ...rawValues])).slice(0, 4);

  const correctOptionId = `${questionKey}-opt-correct${nonce ? `-${nonce}` : ''}`;

  const untagged: QuestionOption[] = uniqueValues.map((val, idx) => {
    const isCorrect = val === correctValue;
    return {
      id: isCorrect ? correctOptionId : `${questionKey}-opt-d${idx}${nonce ? `-${nonce}` : ''}`,
      value: val,
      isCorrect,
    };
  });

  return {
    options: fisherYatesShuffle(untagged),
    correctOptionId,
  };
}

/**
 * Returns a new ChemistryTask instance where every question's options
 * have been freshly shuffled with Fisher-Yates and assigned unique option IDs.
 */
export function shuffleTaskQuestions(task: ChemistryTask, attemptSeed?: string): ChemistryTask {
  const nonce = attemptSeed ?? `${Date.now()}-${Math.floor(Math.random() * 100000)}`;
  const shuffledQuestions: QuestionStep[] = task.questions.map((q) => {
    const values = q.options.map((opt) => opt.value);
    const { options, correctOptionId } = buildShuffledOptions(
      `${task.id}-q${q.id}`,
      q.correctAnswer,
      values,
      nonce
    );
    return {
      ...q,
      options,
      correctOptionId,
    };
  });

  return {
    ...task,
    questions: shuffledQuestions,
  };
}
