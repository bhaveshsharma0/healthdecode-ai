export interface Specialist {
  name: string;
  icon: string;
  degree_needed: string;
  degree_plain: string;
  tier: "Super Specialist" | "Specialist" | "Dental" | "Allied Health" | "General";
  years_training: string;
  what_they_do: string;
  key_question: string;
  red_flags: string;
  keywords: string[];
}

export interface AnalysisResult {
  urgency: "Routine" | "Soon" | "Urgent";
  urgency_reason: string;
  urgency_color: "green" | "amber" | "red";
  see_gp_first: boolean;
  gp_reason: string;
  specialists: Array<Specialist & { rank: number; why: string }>;
  lifestyle_tip: string;
  disclaimer: string;
}

export interface PreviousSearch {
  symptomPreview: string;
  urgency: string;
  topSpecialistName: string;
  symptomsText: string;
  ageGroup: string;
  sex: string;
  duration: string;
  severity: string;
  conditions: string;
  result: AnalysisResult;
}
