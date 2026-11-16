export interface ReactionEquation {
  reactants: string;
  products: string;
  reagentMultiplier: number; // e.g. 1 for mono, 2 for di, 3 for tri
  productName: string;
  formula: string;
}

export interface MixtureComponent {
  id: string;
  name: string;
  formula: string;
  percentage: number; // percentage of original substance molecules (mol%)
  moles: number;
  reagentMultiplier: number; // stoichiometric coefficient for consumed reagent (0 for unchanged)
  isDesired?: boolean;
  isUnchanged?: boolean;
  color: string;
}

export interface QuestionOption {
  id: string; // Unique option identifier independent of array position
  value: number;
  isCorrect: boolean;
}

export interface QuestionStep {
  id: number;
  prompt: string;
  unit: string;
  correctAnswer: number;
  correctOptionId: string;
  options: QuestionOption[]; // Shuffled via Fisher-Yates
  hint: string;
  explanation: string;
  derivation: string; // Detailed mathematical derivation
  pedagogicalTip?: string;
}

export interface ChemistryTask {
  id: string;
  levelNumber: number;
  title: string;
  subtitle: string;
  description: string;
  timeLimitSeconds: number;
  startingMoles: number;
  startingSubstance: {
    name: string;
    formula: string;
  };
  reagent: {
    name: string;
    formula: string;
  };
  desiredProduct: {
    name: string;
    formula: string;
  };
  equations: ReactionEquation[];
  components: MixtureComponent[];
  questions: QuestionStep[];
}

export interface LevelInfo {
  id: number;
  title: string;
  subtitle: string;
  description: string;
  badge: string;
  isCompleted?: boolean;
}

export interface BadgeDefinition {
  id: string;
  title: string;
  description: string;
  levelNumber: number;
  color: string;
}

export interface PlayerProgress {
  score: number;
  completedTaskIds: string[];
  earnedBadgeIds: string[];
  randomTasksCompleted: number;
}
