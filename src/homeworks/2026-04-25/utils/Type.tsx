interface Question {
  id: number;
  text: string;
  options: string[];
  correct: string;
}

interface SelectingOption {
  [key: number]: number | null;
}

export type { Question, SelectingOption };
