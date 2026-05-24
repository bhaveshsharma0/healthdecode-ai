export interface Biomarker {
  id: string;
  name: string;
  unit: string;
  normalMin: number;
  normalMax: number;
  genderMin?: { Male: number; Female: number };
  genderMax?: { Male: number; Female: number };
  category: 
    | "Complete Blood Count (CBC)"
    | "Diabetes & Sugar"
    | "Liver Function"
    | "Kidney Function"
    | "Lipid / Heart Health"
    | "Thyroid & Hormones"
    | "Vitamins & Nutrition"
    | "Infection & Immunity";
}

export interface PresetReportDetail {
  testId: string;
  name: string;
  value: number;
}

export interface PresetReport {
  id: string;
  title: string;
  description: string;
  category: string;
  gender: "Male" | "Female";
  details: PresetReportDetail[];
}

export const BIOMARKERS_DATABASE: Record<string, Biomarker> = {
  // CBC
  hb: {
    id: "hb",
    name: "Hemoglobin (Hb)",
    unit: "g/dL",
    normalMin: 12.0,
    normalMax: 17.5,
    genderMin: { Male: 13.5, Female: 12.0 },
    genderMax: { Male: 17.5, Female: 16.0 },
    category: "Complete Blood Count (CBC)",
  },
  rbc: {
    id: "rbc",
    name: "Red Blood Cell Count (RBC)",
    unit: "million/mcL",
    normalMin: 4.2,
    normalMax: 5.9,
    genderMin: { Male: 4.5, Female: 4.2 },
    genderMax: { Male: 5.9, Female: 5.4 },
    category: "Complete Blood Count (CBC)",
  },
  wbc: {
    id: "wbc",
    name: "White Blood Cell Count (WBC)",
    unit: "cells/mcL",
    normalMin: 4000,
    normalMax: 11000,
    category: "Complete Blood Count (CBC)",
  },
  plt: {
    id: "plt",
    name: "Platelet Count",
    unit: "cells/mcL",
    normalMin: 150000,
    normalMax: 450000,
    category: "Complete Blood Count (CBC)",
  },

  // Diabetes & Sugar
  glucose: {
    id: "glucose",
    name: "Fasting Blood Sugar (Glucose)",
    unit: "mg/dL",
    normalMin: 70,
    normalMax: 100,
    category: "Diabetes & Sugar",
  },
  hba1c: {
    id: "hba1c",
    name: "Hemoglobin A1c (Average Sugar)",
    unit: "%",
    normalMin: 4.0,
    normalMax: 5.6,
    category: "Diabetes & Sugar",
  },

  // Liver
  alt: {
    id: "alt",
    name: "Alanine Aminotransferase (ALT/SGPT)",
    unit: "U/L",
    normalMin: 7,
    normalMax: 56,
    category: "Liver Function",
  },
  ast: {
    id: "ast",
    name: "Aspartate Aminotransferase (AST/SGOT)",
    unit: "U/L",
    normalMin: 8,
    normalMax: 48,
    category: "Liver Function",
  },
  bilirubin: {
    id: "bilirubin",
    name: "Total Bilirubin (Liver Clearance)",
    unit: "mg/dL",
    normalMin: 0.2,
    normalMax: 1.2,
    category: "Liver Function",
  },

  // Kidney
  creatinine: {
    id: "creatinine",
    name: "Serum Creatinine (Kidney Filtration)",
    unit: "mg/dL",
    normalMin: 0.6,
    normalMax: 1.2,
    category: "Kidney Function",
  },
  urea: {
    id: "urea",
    name: "Blood Urea Nitrogen (BUN)",
    unit: "mg/dL",
    normalMin: 7,
    normalMax: 20,
    category: "Kidney Function",
  },

  // Lipids
  cholesterol: {
    id: "cholesterol",
    name: "Total Cholesterol",
    unit: "mg/dL",
    normalMin: 100,
    normalMax: 200,
    category: "Lipid / Heart Health",
  },
  triglycerides: {
    id: "triglycerides",
    name: "Triglycerides",
    unit: "mg/dL",
    normalMin: 50,
    normalMax: 150,
    category: "Lipid / Heart Health",
  },

  // Thyroid
  tsh: {
    id: "tsh",
    name: "Thyroid Stimulating Hormone (TSH)",
    unit: "mIU/L",
    normalMin: 0.45,
    normalMax: 4.5,
    category: "Thyroid & Hormones",
  },
  t3: {
    id: "t3",
    name: "Triiodothyronine (Total T3)",
    unit: "ng/dL",
    normalMin: 80,
    normalMax: 200,
    category: "Thyroid & Hormones",
  },
  t4: {
    id: "t4",
    name: "Thyroxine (Total T4)",
    unit: "mcg/dL",
    normalMin: 4.5,
    normalMax: 11.5,
    category: "Thyroid & Hormones",
  },

  // Vitamins
  vitd: {
    id: "vitd",
    name: "Vitamin D (25-Hydroxy)",
    unit: "ng/mL",
    normalMin: 30,
    normalMax: 100,
    category: "Vitamins & Nutrition",
  },
  b12: {
    id: "b12",
    name: "Vitamin B12 (Cobalamin)",
    unit: "pg/mL",
    normalMin: 200,
    normalMax: 900,
    category: "Vitamins & Nutrition",
  },
  iron: {
    id: "iron",
    name: "Serum Iron (Micronutrient)",
    unit: "mcg/dL",
    normalMin: 50,
    normalMax: 170,
    category: "Vitamins & Nutrition",
  },

  // Infection / Immunity
  crp: {
    id: "crp",
    name: "C-Reactive Protein (CRP)",
    unit: "mg/L",
    normalMin: 0,
    normalMax: 3.0,
    category: "Infection & Immunity",
  },
  esr: {
    id: "esr",
    name: "Erythrocyte Sedimentation Rate (ESR)",
    unit: "mm/hr",
    normalMin: 0,
    normalMax: 15,
    genderMin: { Male: 0, Female: 0 },
    genderMax: { Male: 15, Female: 20 },
    category: "Infection & Immunity",
  },
  dengue: {
    id: "dengue",
    name: "Dengue Antibodies (IgG/IgM Ratio)",
    unit: "index",
    normalMin: 0,
    normalMax: 0.9,
    category: "Infection & Immunity",
  },
  allergy_ige: {
    id: "allergy_ige",
    name: "Allergy Immunoglobulin E (Total IgE)",
    unit: "kU/L",
    normalMin: 0,
    normalMax: 100,
    category: "Infection & Immunity",
  }
};

export const PRESET_LAB_REPORTS: PresetReport[] = [
  {
    id: "routine_healthy",
    title: "🟢 Healthy General Fitness Check (23 Tests)",
    description: "Ideal routine blood panel showing all vital parameters inside standard optimal thresholds.",
    category: "Routine Checkup",
    gender: "Female",
    details: [
      { testId: "hb", name: "Hemoglobin (Hb)", value: 13.8 },
      { testId: "rbc", name: "Red Blood Cell Count (RBC)", value: 4.6 },
      { testId: "wbc", name: "White Blood Cell Count (WBC)", value: 6500 },
      { testId: "plt", name: "Platelet Count", value: 250000 },
      { testId: "glucose", name: "Fasting Blood Sugar (Glucose)", value: 85 },
      { testId: "hba1c", name: "Hemoglobin A1c (Average Sugar)", value: 5.1 },
      { testId: "alt", name: "Alanine Aminotransferase (ALT/SGPT)", value: 24 },
      { testId: "ast", name: "Aspartate Aminotransferase (AST/SGOT)", value: 20 },
      { testId: "bilirubin", name: "Total Bilirubin (Liver Clearance)", value: 0.6 },
      { testId: "creatinine", name: "Serum Creatinine (Kidney Filtration)", value: 0.8 },
      { testId: "urea", name: "Blood Urea Nitrogen (BUN)", value: 12 },
      { testId: "cholesterol", name: "Total Cholesterol", value: 175 },
      { testId: "triglycerides", name: "Triglycerides", value: 110 },
      { testId: "tsh", name: "Thyroid Stimulating Hormone (TSH)", value: 1.8 },
      { testId: "t3", name: "Triiodothyronine (Total T3)", value: 120 },
      { testId: "t4", name: "Thyroxine (Total T4)", value: 7.5 },
      { testId: "vitd", name: "Vitamin D (25-Hydroxy)", value: 42 },
      { testId: "b12", name: "Vitamin B12 (Cobalamin)", value: 450 },
      { testId: "iron", name: "Serum Iron (Micronutrient)", value: 105 },
      { testId: "crp", name: "C-Reactive Protein (CRP)", value: 1.1 },
      { testId: "esr", name: "Erythrocyte Sedimentation Rate (ESR)", value: 7 },
      { testId: "dengue", name: "Dengue Antibodies (IgG/IgM Ratio)", value: 0.2 },
      { testId: "allergy_ige", name: "Allergy Immunoglobulin E (Total IgE)", value: 45 }
    ]
  },
  {
    id: "anemic_fatigue",
    title: "🔴 Fatigue & Chronic Anemia Report (23 Tests)",
    description: "Highlights lower hemoglobin and diminished red components, typical of fatigue or iron stress.",
    category: "Hematology Concern",
    gender: "Female",
    details: [
      { testId: "hb", name: "Hemoglobin (Hb)", value: 9.2 },
      { testId: "rbc", name: "Red Blood Cell Count (RBC)", value: 3.4 },
      { testId: "wbc", name: "White Blood Cell Count (WBC)", value: 5800 },
      { testId: "plt", name: "Platelet Count", value: 180000 },
      { testId: "glucose", name: "Fasting Blood Sugar (Glucose)", value: 92 },
      { testId: "hba1c", name: "Hemoglobin A1c (Average Sugar)", value: 5.3 },
      { testId: "alt", name: "Alanine Aminotransferase (ALT/SGPT)", value: 18 },
      { testId: "ast", name: "Aspartate Aminotransferase (AST/SGOT)", value: 16 },
      { testId: "bilirubin", name: "Total Bilirubin (Liver Clearance)", value: 0.5 },
      { testId: "creatinine", name: "Serum Creatinine (Kidney Filtration)", value: 0.7 },
      { testId: "urea", name: "Blood Urea Nitrogen (BUN)", value: 10 },
      { testId: "cholesterol", name: "Total Cholesterol", value: 160 },
      { testId: "triglycerides", name: "Triglycerides", value: 95 },
      { testId: "tsh", name: "Thyroid Stimulating Hormone (TSH)", value: 2.1 },
      { testId: "t3", name: "Triiodothyronine (Total T3)", value: 110 },
      { testId: "t4", name: "Thyroxine (Total T4)", value: 6.8 },
      { testId: "vitd", name: "Vitamin D (25-Hydroxy)", value: 14.5 },
      { testId: "b12", name: "Vitamin B12 (Cobalamin)", value: 185 },
      { testId: "iron", name: "Serum Iron (Micronutrient)", value: 24 },
      { testId: "crp", name: "C-Reactive Protein (CRP)", value: 1.5 },
      { testId: "esr", name: "Erythrocyte Sedimentation Rate (ESR)", value: 12 },
      { testId: "dengue", name: "Dengue Antibodies (IgG/IgM Ratio)", value: 0.1 },
      { testId: "allergy_ige", name: "Allergy Immunoglobulin E (Total IgE)", value: 60 }
    ]
  },
  {
    id: "metabolic_prediabetes",
    title: "🟡 Metabolic Screening & Thyroid (23 Tests)",
    description: "Presents slightly elevated blood sugar and thyroid signaling, suggesting glucose caution.",
    category: "Endocrinology Concern",
    gender: "Male",
    details: [
      { testId: "hb", name: "Hemoglobin (Hb)", value: 14.5 },
      { testId: "rbc", name: "Red Blood Cell Count (RBC)", value: 4.9 },
      { testId: "wbc", name: "White Blood Cell Count (WBC)", value: 7200 },
      { testId: "plt", name: "Platelet Count", value: 220000 },
      { testId: "glucose", name: "Fasting Blood Sugar (Glucose)", value: 114 },
      { testId: "hba1c", name: "Hemoglobin A1c (Average Sugar)", value: 6.1 },
      { testId: "alt", name: "Alanine Aminotransferase (ALT/SGPT)", value: 35 },
      { testId: "ast", name: "Aspartate Aminotransferase (AST/SGOT)", value: 28 },
      { testId: "bilirubin", name: "Total Bilirubin (Liver Clearance)", value: 0.8 },
      { testId: "creatinine", name: "Serum Creatinine (Kidney Filtration)", value: 0.9 },
      { testId: "urea", name: "Blood Urea Nitrogen (BUN)", value: 14 },
      { testId: "cholesterol", name: "Total Cholesterol", value: 195 },
      { testId: "triglycerides", name: "Triglycerides", value: 140 },
      { testId: "tsh", name: "Thyroid Stimulating Hormone (TSH)", value: 5.6 },
      { testId: "t3", name: "Triiodothyronine (Total T3)", value: 72 },
      { testId: "t4", name: "Thyroxine (Total T4)", value: 4.1 },
      { testId: "vitd", name: "Vitamin D (25-Hydroxy)", value: 25 },
      { testId: "b12", name: "Vitamin B12 (Cobalamin)", value: 280 },
      { testId: "iron", name: "Serum Iron (Micronutrient)", value: 80 },
      { testId: "crp", name: "C-Reactive Protein (CRP)", value: 0.9 },
      { testId: "esr", name: "Erythrocyte Sedimentation Rate (ESR)", value: 8 },
      { testId: "dengue", name: "Dengue Antibodies (IgG/IgM Ratio)", value: 0.3 },
      { testId: "allergy_ige", name: "Allergy Immunoglobulin E (Total IgE)", value: 50 }
    ]
  },
  {
    id: "lipid_cardio",
    title: "🟡 Elevated Cholesterol & Lipid Strain (23 Tests)",
    description: "Features raised cholesterol parameters indicating cardiovascular screening or lifestyle focus.",
    category: "Lipid Profile Concern",
    gender: "Male",
    details: [
      { testId: "hb", name: "Hemoglobin (Hb)", value: 15.2 },
      { testId: "rbc", name: "Red Blood Cell Count (RBC)", value: 5.1 },
      { testId: "wbc", name: "White Blood Cell Count (WBC)", value: 8900 },
      { testId: "plt", name: "Platelet Count", value: 290000 },
      { testId: "glucose", name: "Fasting Blood Sugar (Glucose)", value: 89 },
      { testId: "hba1c", name: "Hemoglobin A1c (Average Sugar)", value: 5.4 },
      { testId: "alt", name: "Alanine Aminotransferase (ALT/SGPT)", value: 42 },
      { testId: "ast", name: "Aspartate Aminotransferase (AST/SGOT)", value: 36 },
      { testId: "bilirubin", name: "Total Bilirubin (Liver Clearance)", value: 0.7 },
      { testId: "creatinine", name: "Serum Creatinine (Kidney Filtration)", value: 1.0 },
      { testId: "urea", name: "Blood Urea Nitrogen (BUN)", value: 16 },
      { testId: "cholesterol", name: "Total Cholesterol", value: 265 },
      { testId: "triglycerides", name: "Triglycerides", value: 245 },
      { testId: "tsh", name: "Thyroid Stimulating Hormone (TSH)", value: 1.4 },
      { testId: "t3", name: "Triiodothyronine (Total T3)", value: 115 },
      { testId: "t4", name: "Thyroxine (Total T4)", value: 7.2 },
      { testId: "vitd", name: "Vitamin D (25-Hydroxy)", value: 32 },
      { testId: "b12", name: "Vitamin B12 (Cobalamin)", value: 390 },
      { testId: "iron", name: "Serum Iron (Micronutrient)", value: 95 },
      { testId: "crp", name: "C-Reactive Protein (CRP)", value: 2.5 },
      { testId: "esr", name: "Erythrocyte Sedimentation Rate (ESR)", value: 13 },
      { testId: "dengue", name: "Dengue Antibodies (IgG/IgM Ratio)", value: 0.2 },
      { testId: "allergy_ige", name: "Allergy Immunoglobulin E (Total IgE)", value: 125 }
    ]
  },
  {
    id: "viral_infection",
    title: "🔴 Inflammatory & Immune Reaction (23 Tests)",
    description: "Captures spiking white cell levels and minor hepatic stress indicators, characteristic of active immune response.",
    category: "Infectious Response",
    gender: "Female",
    details: [
      { testId: "hb", name: "Hemoglobin (Hb)", value: 12.8 },
      { testId: "rbc", name: "Red Blood Cell Count (RBC)", value: 4.1 },
      { testId: "wbc", name: "White Blood Cell Count (WBC)", value: 14500 },
      { testId: "plt", name: "Platelet Count", value: 380000 },
      { testId: "glucose", name: "Fasting Blood Sugar (Glucose)", value: 105 },
      { testId: "hba1c", name: "Hemoglobin A1c (Average Sugar)", value: 5.6 },
      { testId: "alt", name: "Alanine Aminotransferase (ALT/SGPT)", value: 68 },
      { testId: "ast", name: "Aspartate Aminotransferase (AST/SGOT)", value: 54 },
      { testId: "bilirubin", name: "Total Bilirubin (Liver Clearance)", value: 1.5 },
      { testId: "creatinine", name: "Serum Creatinine (Kidney Filtration)", value: 0.85 },
      { testId: "urea", name: "Blood Urea Nitrogen (BUN)", value: 12 },
      { testId: "cholesterol", name: "Total Cholesterol", value: 180 },
      { testId: "triglycerides", name: "Triglycerides", value: 130 },
      { testId: "tsh", name: "Thyroid Stimulating Hormone (TSH)", value: 2.3 },
      { testId: "t3", name: "Triiodothyronine (Total T3)", value: 130 },
      { testId: "t4", name: "Thyroxine (Total T4)", value: 8.2 },
      { testId: "vitd", name: "Vitamin D (25-Hydroxy)", value: 28 },
      { testId: "b12", name: "Vitamin B12 (Cobalamin)", value: 320 },
      { testId: "iron", name: "Serum Iron (Micronutrient)", value: 75 },
      { testId: "crp", name: "C-Reactive Protein (CRP)", value: 24.5 },
      { testId: "esr", name: "Erythrocyte Sedimentation Rate (ESR)", value: 32 },
      { testId: "dengue", name: "Dengue Antibodies (IgG/IgM Ratio)", value: 1.8 },
      { testId: "allergy_ige", name: "Allergy Immunoglobulin E (Total IgE)", value: 290 }
    ]
  }
];

export const CATEGORY_MESSAGES: Record<string, { icon: string; subtitle: string; guidance: string }> = {
  "Complete Blood Count (CBC)": {
    icon: "🩸",
    subtitle: "Oxygen transport capacity, cellular defense barriers, coagulation thresholds",
    guidance: "Assesses cellular bloodstream structures, red and white count capacities, and active platelet counts."
  },
  "Diabetes & Sugar": {
    icon: "🍬",
    subtitle: "Pancreatic insulin response, glycemic stability, chronic glycation bounds",
    guidance: "Tracks current serum sugar limits and three-month historical cell glycation percentages."
  },
  "Liver Function": {
    icon: "🌱",
    subtitle: "Serum enzyme integrity, biological filtration, clearance reserves",
    guidance: "Traces metabolic transaminases and bilirubin clearance ratios for active homeostatic tracking."
  },
  "Kidney Function": {
    icon: "💧",
    subtitle: "Glomerular filtration rate, organic metabolite clearance, fluid balancing",
    guidance: "Monitors nitrogen clearance pathways and active creatinine serum density."
  },
  "Lipid / Heart Health": {
    icon: "❤️",
    subtitle: "Circulatory structural fats, vascular flexibility, coronary baseline profile",
    guidance: "Measures total system cholesterol and fat storage triglycerides tracking relative cardiovascular wellness."
  },
  "Thyroid & Hormones": {
    icon: "🦋",
    subtitle: "Endocrine signal cascades, systemic firebox control, metabolism indicators",
    guidance: "Correlates brain-to-endocrine stimulant pathways to track default energetic pacing."
  },
  "Vitamins & Nutrition": {
    icon: "🔋",
    subtitle: "Vital micronutrient reserves, nerve pathway integrity, biochemical cofactors",
    guidance: "Screens essential neural vitamin stores and structural cell-building bone matrix inputs."
  },
  "Infection & Immunity": {
    icon: "🛡️",
    subtitle: "Circulatory reactive defense systems, acute phase responses, inflammatory levels",
    guidance: "Measures inflammation proteins, white cell settling rates, and antibody balance triggers."
  }
};
