export const questionnairesConfig: Record<
  string,
  {
    maxScore: number;
    scoreRanges: { min: number; max: number; classification: string; color: string }[];
  }
> = {
  "GAD": {
    maxScore: 21,
    scoreRanges: [
      { min: 0, max: 4, classification: "Minimal anxiety", color: "text-green-500" },
      { min: 5, max: 9, classification: "Mild anxiety", color: "text-yellow-800" },
      { min: 10, max: 14, classification: "Moderate anxiety", color: "text-orange-500" },
      { min: 15, max: 21, classification: "Severe anxiety", color: "text-red-500" }
    ]
  },
  "GHQ": {
    maxScore: 36,
    scoreRanges: [
      { min: 0, max: 11, classification: "Normal / No distress", color: "text-green-500" },
      { min: 12, max: 19, classification: "Mild distress", color: "text-yellow-800" },
      { min: 20, max: 27, classification: "Moderate distress", color: "text-orange-500" },
      { min: 28, max: 36, classification: "Severe distress", color: "text-red-500" }
    ]
  },
  "Work-Stress": {
    maxScore: 40,
    scoreRanges: [
      { min: 8, max: 15, classification: "Chilled out", color: "text-green-500" },
      { min: 16, max: 20, classification: "Fairly low", color: "text-yellow-800" },
      { min: 21, max: 25, classification: "Moderate stress", color: "text-orange-500" },
      { min: 26, max: 40, classification: "Severe", color: "text-red-500" }
    ]
  }
};