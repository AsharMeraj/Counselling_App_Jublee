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
    title: "Work Stress",
    description: "The Workplace Stress Scale",
    route: "/workStress",
  },
  // {
  //   title: "PHQ-9",
  //   description: "Patient Health Questionnaire Depression",
  //   route: "/phq9",
  // },
  {
    title: "GAD-7",
    description: "General Anxiety Disorder Screening",
    route: "/gad7",
  },
];
