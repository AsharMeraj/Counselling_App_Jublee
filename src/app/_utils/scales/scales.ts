export interface ScaleItem {
  title: string;
  description: string;
  route: string;
}

export const scales = [
  {
    title: "GHQ-12",
    description: "Short General Health Questionnaire",
    route: "/ghq",
  },
  {
    title: "Work-Stress",
    description: "The Workplace Stress Scale",
    route: "/workStress",
  },
  {
    title: "EPDS",
    description: "EPDS Questionnaire",
    route: "/epds",
  },
  {
    title: "GAD-7",
    description: "General Anxiety Disorder Screening",
    route: "/gad7",
  },
];
