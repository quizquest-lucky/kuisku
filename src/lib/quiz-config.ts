export type TierId = "SD" | "SMP" | "SMA";

export type Subject =
  | "Matematika"
  | "IPA"
  | "Bahasa Indonesia"
  | "Bahasa Inggris"
  | "PAI"
  | "Umum";

export interface Tier {
  id: TierId;
  name: string;
  subtitle: string;
  timer: number;
  classes: number[];
  gradient: string;
}

export const TIERS: Tier[] = [
  {
    id: "SD",
    name: "SD",
    subtitle: "Sekolah Dasar",
    timer: 20,
    classes: [1, 2, 3, 4, 5, 6],
    gradient: "var(--gradient-sd)",
  },
  {
    id: "SMP",
    name: "SMP",
    subtitle: "Sekolah Menengah Pertama",
    timer: 20,
    classes: [7, 8, 9],
    gradient: "var(--gradient-smp)",
  },
  {
    id: "SMA",
    name: "SMA",
    subtitle: "Sekolah Menengah Atas",
    timer: 30,
    classes: [10, 11, 12],
    gradient: "var(--gradient-sma)",
  },
];

export const SUBJECTS: Subject[] = [
  "Matematika",
  "IPA",
  "Bahasa Indonesia",
  "Bahasa Inggris",
  "PAI",
  "Umum",
];

export const QUESTIONS_PER_SESSION = 20;
export const POINTS_PER_CORRECT = 5;
export const AD_MILESTONE = 10;
export const MILESTONE_BONUS = 25;

export interface QuizQuestion {
  question: string;
  options: string[];
  answer: string;
}

export function getTier(id: TierId): Tier {
  return TIERS.find((t) => t.id === id) ?? TIERS[0];
}
