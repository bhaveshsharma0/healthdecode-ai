import React, { useState, useRef, useEffect } from "react";
import { 
  Upload, 
  FileText, 
  Sparkles, 
  AlertCircle, 
  Check, 
  Copy, 
  ChevronRight, 
  Activity, 
  Stethoscope, 
  Info, 
  RefreshCcw, 
  TrendingUp, 
  TrendingDown, 
  AlertTriangle,
  HelpCircle,
  FileCheck,
  ShieldAlert,
  Edit,
  Sliders,
  Printer,
  Search,
  ChevronDown,
  ChevronUp,
  Calendar,
  Filter
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { BIOMARKERS_DATABASE, PRESET_LAB_REPORTS, Biomarker } from "../data/labReportData";
import { ReportDashboardResult } from "./ReportDashboardResult";

interface LabValueState {
  testId: string;
  name: string;
  value: number;
}

interface AnalysisDetail {
  id: string;
  name: string;
  value: number;
  unit: string;
  min: number;
  max: number;
  status: "Normal" | "Low" | "High" | "Requires Follow-up (Low)" | "Requires Follow-up (High)";
  statusColor: "green" | "amber" | "red";
  explanation: string;
  meaning: string;
  specialist: string;
  specialistReason: string;
  degreeNeeded: string;
  urgency: "Routine" | "Soon" | "Urgent";
}

const CATEGORY_MESSAGES = {
  "Complete Blood Count (CBC)": { icon: "📊", desc: "Red/white cell levels & oxygen saturation markers." },
  "Diabetes & Sugar": { icon: "🍬", desc: "Glucose regulation & average glycemic reserves." },
  "Liver Function": { icon: "🧬", desc: "Enzymatic rates & waste filtration pigments." },
  "Kidney Function": { icon: "💧", desc: "Glomerular clearance & nitrogen byproducts." },
  "Lipid / Heart Health": { icon: "❤️", desc: "Cholesterol fractions & cardiovascular transport lines." },
  "Thyroid & Hormones": { icon: "🦋", desc: "Pituitary signals & dynamic rate of oxidation." },
  "Vitamins & Nutrition": { icon: "🥬", desc: "Organic micronutrient reserves and metabolic co-factors." },
  "Infection & Immunity": { icon: "🛡️", desc: "Immune defense responders and inflammatory status." }
};

export default function LabReportDecoder() {
  // UI States
  const [activeGender, setActiveGender] = useState<"Male" | "Female">("Female");
  const [dragActive, setDragActive] = useState(false);
  const [uploadedFileName, setUploadedFileName] = useState<string | null>(null);
  
  // OCR Scan States
  const [isScanning, setIsScanning] = useState(false);
  const [scanStepText, setScanStepText] = useState("");
  const [scanPercentage, setScanPercentage] = useState(0);

  // Active Report Parameters
  const [currentValues, setCurrentValues] = useState<LabValueState[]>([]);
  const [copied, setCopied] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  // New Required Enhancements States
  const [inputMethod, setInputMethod] = useState<"file" | "text">("file");
  const [pastedText, setPastedText] = useState("");
  const [customReferenceRanges, setCustomReferenceRanges] = useState<Record<string, { min: number; max: number }>>({});
  const [expandedCardIds, setExpandedCardIds] = useState<Record<string, boolean>>({});

  // Smart UI Optimization States
  const [searchQuery, setSearchQuery] = useState("");
  const [filterMode, setFilterMode] = useState<"all" | "abnormal" | "normal" | "critical">("all");
  const [expandedCategories, setExpandedCategories] = useState<Record<string, boolean>>({
    "Complete Blood Count (CBC)": false,
    "Diabetes & Sugar": false,
    "Liver Function": false,
    "Kidney Function": false,
    "Lipid / Heart Health": false,
    "Thyroid & Hormones": false,
    "Vitamins & Nutrition": false,
    "Infection & Immunity": false
  });

  const fileInputRef = useRef<HTMLInputElement>(null);
  const resultRef = useRef<HTMLDivElement>(null);

  // Initialize with the Healthy Routine checkup values
  useEffect(() => {
    loadPreset(PRESET_LAB_REPORTS[0]);
  }, []);

  // Sync test normal ranges when gender changes
  const loadPreset = (preset: typeof PRESET_LAB_REPORTS[0]) => {
    setActiveGender(preset.gender);
    const mapped = preset.details.map(d => ({
      testId: d.testId,
      name: d.name,
      value: d.value
    }));
    setCurrentValues(mapped);
    setUploadedFileName(null);
    setCustomReferenceRanges({}); // Clear smart reference ranges upon loading presets
    setExpandedCardIds({}); // Close any previously expanded explanation cards
  };

  const toggleCardExpanded = (testId: string) => {
    setExpandedCardIds(prev => ({
      ...prev,
      [testId]: !prev[testId]
    }));
  };

  const getAdvancedDetailedFunction = (testId: string) => {
    const detailedFunctions: Record<string, string> = {
      hb: "Hemoglobin is an iron-rich protein inside red blood cells that selectively binds oxygen in tissue capillaries. Levels shift according to hydration status, elevation, oxygen demand, and marrow synthesis.",
      rbc: "Red blood cells (erythrocytes) transport respiration gases via iron-binding heme pockets. Production is mediated by renal erythropoietin signaling under oxygen-sensitive pressure sensors.",
      wbc: "White blood cells represent diverse cellular defense matrices: neutrophils, lymphocytes, monocytes, eosinophils, and basophils. They coordinate dynamic cellular signaling during ambient pathogen exposures.",
      plt: "Platelets are disk-shaped cellular fragments essential for secondary clotting pathways. They undergo active aggregation to close vascular gaps, preventing unnecessary fluid loss.",
      glucose: "Fasting glucose is the primary monosaccharide energy fuel for nervous system activities. Insulinergic and glucagon systems operate continuously to maintain steady metabolic fuel delivery.",
      hba1c: "HbA1c measures non-enzymatic glycation of Hemoglobin molecules, reflecting a continuous weighted glucose exposure average of circulating erythrocytes across their 120-day lifespan.",
      alt: "Alanine Aminotransferase is a key metabolic enzyme. Elevated bloodstream presence marks structural shifts in liver parenchymal cells and their relative metabolic workload.",
      ast: "Aspartate Aminotransferase is an intracellular catalytic enzyme mainly located in liver parenchyma, metabolic skeletal fibers, and cardiovascular myocardium. Serum spikes indicate localized cellular stress.",
      bilirubin: "Bilirubin represents the natural breakdown pigments of aging erythrocytes. Hepatocytes clear this substance through biliary canals, making it a reliable marker of clearance speed.",
      creatinine: "Creatine is an energy-storing muscle compound whose breakdown byproduct is creatinine. Since baseline muscular density changes slowly, serum levels indicate the kidney's current glomerular filtration capability.",
      urea: "Urea is the chief nitrogenous end product of complete dietary and systemic protein metabolism. Filtered continuously by glomeruli to maintain standard body toxicant margins.",
      cholesterol: "Total cholesterol is an essential steroid precursor block. It is utilized to form standard cell-membrane boundaries, maintain thermal insulation, and synthesize biological bile salts.",
      triglycerides: "Triglycerides are standard circulating glycerol esters utilized for physical mechanical insulation and muscle lipid fueling reserves. Transported in standard blood plasma inside core lipoproteic spheres.",
      tsh: "Thyroid Stimulating Hormone is the principal biochemical messenger produced by pituitary pathways to regulate iodine synthesis and rate of active cellular oxidation.",
      t3: "Triiodothyronine is the highly active main thyroid hormone regulating thermal homeostasis and nuclear receptor transcription rates of vital biological systems.",
      t4: "Thyroxine is the primary circulating thyroid hormone reserve synthesized within cellular follicles, acting as an inactive pre-hormone ready to generate cellular T3 inside peripheral tissues.",
      vitd: "Vitamin D operates as a critical nuclear steroid hormone regulating standard osteoclast activity, active gastrointestinal calcium absorptive gates, and overall innate defensive cell modulation.",
      b12: "Cobalamin is an essential organometallic cofactor that serves as a core rate-limiting regulator during nucleic acid DNA replication, erythrocyte maturation cycles, and myelin insulation synthesis.",
      iron: "Serum iron reflects the circulating fraction of active iron bound to transferrin transport globulins, used for synthesis of heme complexes during active bone marrow erythropoiesis.",
      crp: "C-Reactive Protein is an acute-phase inflammatory protein synthesized by hepatocytes in response to interleukin signaling. It binds dying cellular surfaces to facilitate standard macrophage clearance.",
      esr: "Erythrocyte Sedimentation Rate is an indirect measure of acute-phase reactant proteins. Spiked fibrinogen coats red cells to increase density and expedite sedimentation speed in tubular vials.",
      dengue: "Dengue antibodies represent humoral defense responses to flavivirus structural proteins, signaling either active immunological battles or historical, post-recovery adaptive memory.",
      allergy_ige: "Immunoglobulin E coordinates type-I immediate hypersensitivity and anti-parasitic cellular barriers, causing rapid degranulation of dynamic mast cells and systemic histamine releases."
    };
    return detailedFunctions[testId] || "Supports physiological baseline and cellular transport pathways.";
  };

  const handleStepValue = (testId: string, direction: number, isDecimal: boolean) => {
    const step = isDecimal ? 0.1 : 1;
    setCurrentValues(prev => prev.map(cv => {
      if (cv.testId === testId) {
        const newVal = Math.max(0, parseFloat((cv.value + direction * step).toFixed(2)));
        return { ...cv, value: newVal };
      }
      return cv;
    }));
  };

  // Helper to check range and determine statuses
  const analyzeParameter = (testId: string, val: number, gender: "Male" | "Female"): AnalysisDetail => {
    const rawBio = BIOMARKERS_DATABASE[testId];
    if (!rawBio) {
      return {
        id: testId,
        name: "Unknown Biomarker",
        value: val,
        unit: "",
        min: 0,
        max: 100,
        status: "Normal",
        statusColor: "green",
        explanation: "",
        meaning: "",
        specialist: "General Practitioner",
        specialistReason: "for routine healthy reviews and checking vitality.",
        degreeNeeded: "MBBS",
        urgency: "Routine"
      };
    }

    // Smart reference range detection priority logic
    const customRange = customReferenceRanges[testId];
    const min = customRange ? customRange.min : (rawBio.genderMin ? rawBio.genderMin[gender] : rawBio.normalMin);
    const max = customRange ? customRange.max : (rawBio.genderMax ? rawBio.genderMax[gender] : rawBio.normalMax);
    const unit = rawBio.unit;

    let status: "Normal" | "Low" | "High" | "Requires Follow-up (Low)" | "Requires Follow-up (High)" = "Normal";
    let statusColor: "green" | "amber" | "red" = "green";
    let explanation = "";
    let meaning = "";
    let specialist = "None needed";
    let degreeNeeded = "";
    let urgency: "Routine" | "Soon" | "Urgent" = "Routine";

    // Evaluate status thresholds
    if (val < min) {
      const isCriticalLow = 
        (testId === "hb" && val < 8.0) ||
        (testId === "wbc" && val < 2000) ||
        (testId === "plt" && val < 50000) ||
        (testId === "glucose" && val < 55) ||
        (testId === "vitd" && val < 10) ||
        (testId === "b12" && val < 100);

      if (isCriticalLow) {
        status = "Requires Follow-up (Low)";
        statusColor = "red";
        urgency = "Urgent";
      } else {
        status = "Low";
        statusColor = "amber";
        urgency = "Soon";
      }
    } else if (val > max) {
      const isCriticalHigh =
        (testId === "glucose" && val >= 250) ||
        (testId === "hba1c" && val >= 6.5) ||
        (testId === "cholesterol" && val > 300) ||
        (testId === "triglycerides" && val > 350) ||
        (testId === "alt" && val > 200) ||
        (testId === "bilirubin" && val > 3.0) ||
        (testId === "tsh" && val > 10.0) ||
        (testId === "crp" && val > 10.0);

      if (isCriticalHigh) {
        status = "Requires Follow-up (High)";
        statusColor = "red";
        urgency = "Urgent";
      } else {
        status = "High";
        statusColor = "amber";
        urgency = "Soon";
      }
    } else {
      status = "Normal";
      statusColor = "green";
      urgency = "Routine";
    }

    // Custom interpretation and short positive layman-friendly descriptions
    if (testId === "hb") {
      if (status === "Requires Follow-up (Low)") {
        explanation = "Your oxygen-carrying blood levels appear significantly lower than usual. Seeking timely medical guidance and checking iron reserves is recommended.";
        meaning = "Often points to temporary cellular/iron shifts, best discussed with a clinician for structured, gentle support.";
      } else if (status === "Low") {
        explanation = "Your oxygen-carrying blood levels are slightly below standard baselines. This can occasionally be associated with mild fatigue or simple iron variations.";
        meaning = "Commonly relates to basic nutritional balances, easily monitored with regular expert guidance.";
      } else if (status === "High") {
        explanation = "Your oxygen-carrying levels appear slightly raised. This can sometimes be associated with standard variations like low hydration or elevation shifts.";
        meaning = "Frequently represents simple blood concentration markers, normally resolved with generous fluid intake.";
      } else {
        explanation = "Your oxygen-carrying blood levels appear healthy and stable, indicating great standard energy potential.";
        meaning = "Stable, typical biological indicator.";
      }
    } else if (testId === "wbc") {
      if (status === "Requires Follow-up (Low)") {
        explanation = "Your immune cellular count is significantly lower than usual. Consulting a provider is highly recommended to protect your daily defenses nicely.";
        meaning = "Points to temporary defensive exhaustion markers, which a standard medical follow-up can review smoothly.";
      } else if (status === "Low") {
        explanation = "Your immune defense cells are slightly below typical standards, which may indicate recent minor exhaustion or standard baseline variation.";
        meaning = "Generally represents simple immune recovery states, helpful to monitor over periodic outpatient testing.";
      } else if (status === "Requires Follow-up (High)") {
        explanation = "Your body defense cell count is noticeably high. This is typically associated with an active healing demand or temporary baseline challenge.";
        meaning = "Shows a temporary rise in immune cell activity, easily discussed with a caregiver to support quick recovery.";
      } else if (status === "High") {
        explanation = "Your body defense cell count appears slightly raised. This is often the body's normal, healthy response to standard minor stress or active healing.";
        meaning = "Indicates standard defensive system mobilizations, fully managed with simple rest and nutrition.";
      } else {
        explanation = "Your immune system cells are within the standard range, indicating a healthy defensive balance.";
        meaning = "Balanced immunological indicators.";
      }
    } else if (testId === "plt") {
      if (status === "Requires Follow-up (Low)") {
        explanation = "Your platelet-forming cells are significantly below typical guidelines. It is highly recommended to consult a provider to review normal clotting metrics safely.";
        meaning = "Indicates temporary shifts in clotting components, easily overseen with outpatient advice.";
      } else if (status === "Low") {
        explanation = "Your platelet-forming indices are slightly below standard baselines, which can be easily monitored during simple annual checkups.";
        meaning = "Often reflects normal minor fluctuations, simple to track programmatically.";
      } else if (status === "High") {
        explanation = "Your platelet activity is slightly raised. This is frequently a standard response to natural cell regeneration or minor cellular healing.";
        meaning = "Usually transient biological pattern, helpful to evaluate alongside regular outpatient visits.";
      } else {
        explanation = "Your blood clotting factors are in a sweet spot, helping the body heal scrapes normally and safely.";
        meaning = "Healthy clotting and vessel maintenance capacity.";
      }
    } else if (testId === "glucose") {
      if (status === "Requires Follow-up (Low)") {
        explanation = "Your blood sugar levels are resting noticeably low. Gentle nutritional support and simple carbs can help restore comfortable physical energy.";
        meaning = "Can be associated with temporary glycemic gaps, which a simple doctor visit can outline nicely.";
      } else if (status === "Low") {
         explanation = "Your blood glucose parameters appear slightly low. Supporting daily routines with balanced meals can support healthy vitality.";
         meaning = "Usually observed after physical fasting or intense exercise, highly manageable with regular meals.";
      } else if (status === "Requires Follow-up (High)") {
        explanation = "Your blood glucose index is high. This is worth discussing with an expert to keep glucose processing and general metabolic health comfortable.";
        meaning = "Suggests active sugar transition cycles, easily structured with regular outpatient care plans.";
      } else if (status === "High") {
        explanation = "Your sugar markers are somewhat high. Modern activity patterns and gentle dietary updates can support glycemic efficiency nicely.";
        meaning = "A medical consultant can assist in identifying comfortable dietary goals for dynamic sugar balance.";
      } else {
        explanation = "Your fasting blood sugar is balanced, showing that your energy regulation operates beautifully.";
        meaning = "Optimal glycemic cell homeostasis.";
      }
    } else if (testId === "tsh") {
      if (status === "Requires Follow-up (Low)" || status === "Low") {
        explanation = "Your thyroid-related signaling indices are noticeably low. Seeking endocrine review can help support standard metabolic tempos smoothly.";
        meaning = "Typically signals hyper-active metabolic cycles, simple to manage with outpatient guidance.";
      } else if (status === "Requires Follow-up (High)" || status === "High") {
        explanation = "Your thyroid-related stimulating indicators are significantly high. Clinical care can outline balanced hormone support options nicely.";
        meaning = "Generally points to slower thyroid pacing parameters, beautifully responsive to simple nutritional or medical aid.";
      } else {
        explanation = "Your thyroid stimulant level is steady, confirming that your overall metabolism is in comfortable balance.";
        meaning = "Stable thyroid homeostasis.";
      }
    } else if (testId === "cholesterol") {
      if (status === "Requires Follow-up (High)") {
        explanation = "Your total cholesterol values lie outside typical parameters. Discussing simple cardio-protective lifestyle goals supports arterial circulation beautifully.";
        meaning = "Indicates elevated lipid concentrations, highly responsive to supportive physical exercise and fiber intake.";
      } else if (status === "High") {
        explanation = "Your cholesterol levels appear slightly elevated. Reviewing standard dietary fats can help maintain heart-friendly lipid balances.";
        meaning = "Lipids lie moderately above baseline, highly responsive to simple walking and daily olive oil/nuts options.";
      } else {
        explanation = "Your total cholesterol level is in the healthy zone, supporting general heart and blood vessel health.";
        meaning = "Healthy, protected cardiovascular balance.";
      }
    } else if (testId === "creatinine") {
      if (status === "Requires Follow-up (High)") {
        explanation = "Your kidney filtration indices are high. Gentle evaluation of bladder and kidney pathways is recommended.";
        meaning = "Reflects elevated waste accumulation, which regular professional hydration and medical checks help outline.";
      } else if (status === "High") {
        explanation = "Your kidney waste filtration markers appear slightly raised, which can sometimes simply indicate temporary minor dehydration.";
        meaning = "Often cleared quickly by establishing consistent, pure water hydration habits daily.";
      } else if (status === "Low") {
        explanation = "Your filtration indices rest slightly low, which holds zero negative health signs and suggests an active metabolism.";
        meaning = "Often matches lower muscle mass or excellent hydration, indicating safe baseline values.";
      } else {
        explanation = "Your kidney filtration values are standard, denoting very efficient waste clearance.";
        meaning = "Excellent, healthy kidney filtration performance.";
      }
    } else if (testId === "alt") {
      if (status === "Requires Follow-up (High)") {
        explanation = "Your metabolic liver enzymes are noticeably elevated. Simple outpatient tests will clarify easy supportive steps for liver tissues.";
        meaning = "Marks higher enzyme shifts inside hepatic tissue, which is best overseen periodically by an expert.";
      } else if (status === "High") {
        explanation = "Your liver enzyme parameters appear slightly elevated, which can be easily supported by limiting oily meals and certain medication stress.";
        meaning = "Indicates minor hepatocyte workload, highly responsive to pure water, rest, and limiting metabolic stressors.";
      } else {
        explanation = "Your liver enzyme output is balanced, showing clean liver metabolic activity.";
        meaning = "Nominal hepatic function indexes.";
      }
    } else if (testId === "bilirubin") {
      if (status === "Requires Follow-up (High)") {
        explanation = "Your red cell recycle pigment indicators reside somewhat high. A clinical review can evaluate gallbladder and flow channels safely.";
        meaning = "Marks raised pigment concentration, easily evaluated through uncomplicated practitioner review.";
      } else if (status === "High") {
        explanation = "Your bilirubin levels appear slightly elevated, which can sometimes happen with temporary metabolic stress or natural shifts.";
        meaning = "Suggests minor clearance variances, ideal to verify alongside standard hydration profiles.";
      } else {
        explanation = "Your bilirubin levels are normal, confirming healthy recycling pathways.";
        meaning = "Balanced biliary recycling activity.";
      }
    } else {
      // Elegant, medically informative generic fallback for expanded biomarkers (Vitamins, Infection, hormones etc.)
      if (status === "Normal") {
        explanation = `Your ${rawBio.name} is resting within standard thresholds at ${val} ${unit}, indicating reassuring cellular balance in the ${rawBio.category.toLowerCase()} pathways.`;
        meaning = "Shows stable biological synthesis, transport, and elimination capabilities.";
      } else if (statusColor === "red") {
        explanation = `Your ${rawBio.name} measures ${val} ${unit}, falling noticeably outside standard limits. Discussing this with a healthcare provider is suggested to check baseline vitality.`;
        meaning = `Reflects active physiological stress or demand in the body's ${rawBio.category.toLowerCase()} systems.`;
      } else {
        explanation = `Your ${rawBio.name} shows a minor variation at ${val} ${unit} (standard target is ${min} - ${max}). Standard diet modifications or routine checkups support this easily.`;
        meaning = "Represents minor homeostatic pacing adjustments, normally resolved with easy lifestyle focus.";
      }
    }

    // Specialist Mapping Dispatcher
    const categorySpecialists: Record<string, { specialist: string; degreeNeeded: string }> = {
      "Complete Blood Count (CBC)": { specialist: "Haematologist", degreeNeeded: "MBBS → MD PATHOLOGY → DM HAEMATOLOGY" },
      "Diabetes & Sugar": { specialist: "Endocrinologist", degreeNeeded: "MBBS → MD → DM ENDOCRINOLOGY" },
      "Liver Function": { specialist: "Gastroenterologist", degreeNeeded: "MBBS → MD → DM GASTROENTEROLOGY" },
      "Kidney Function": { specialist: "Nephrologist", degreeNeeded: "MBBS → MD → DM NEPHROLOGY" },
      "Lipid / Heart Health": { specialist: "Cardiologist", degreeNeeded: "MBBS → MD → DM CARDIOLOGY" },
      "Thyroid & Hormones": { specialist: "Endocrinologist", degreeNeeded: "MBBS → MD → DM ENDOCRINOLOGY" },
      "Vitamins & Nutrition": { specialist: "General Physician", degreeNeeded: "MBBS or MD General Medicine" },
      "Infection & Immunity": { specialist: "Immunologist", degreeNeeded: "MBBS → MD → DM IMMUNOLOGY" }
    };

    let specialistReason = "";
    if (status !== "Normal") {
      const specInfo = categorySpecialists[rawBio.category] || { specialist: "General Physician", degreeNeeded: "MBBS" };
      specialist = specInfo.specialist;
      degreeNeeded = specInfo.degreeNeeded;
      specialistReason = `because your tested ${rawBio.name} measures ${val} ${unit}, which sits outside reference ranges and warrants standard clinical checking within the ${rawBio.category.toLowerCase()} spectrum.`;
    } else {
      specialist = "None needed";
      degreeNeeded = "";
      specialistReason = "for standard healthy panel preservation guidelines.";
    }

    return {
      id: testId,
      name: rawBio.name,
      value: val,
      unit,
      min,
      max,
      status,
      statusColor,
      explanation,
      meaning,
      specialist,
      specialistReason,
      degreeNeeded,
      urgency
    };
  };

  // Compile full analysis of all active parameters
  const analyzeAll = (): AnalysisDetail[] => {
    return currentValues.map(cv => analyzeParameter(cv.testId, cv.value, activeGender));
  };

  const results = analyzeAll();

  // Aggregate stats
  const criticalItems = results.filter(r => r.status.startsWith("Requires"));
  const concernedItems = results.filter(r => r.status === "High" || r.status === "Low");
  
  // Decide overall urgency
  let overallUrgency: "Routine" | "Soon" | "Urgent" = "Routine";
  let overallColor: "green" | "amber" | "red" = "green";
  
  if (criticalItems.length > 0) {
    overallUrgency = "Urgent";
    overallColor = "red";
  } else if (concernedItems.length > 0) {
    overallUrgency = "Soon";
    overallColor = "amber";
  }

  // Handle manual input updates for real-time reactivity
  const handleValueChange = (testId: string, valStr: string) => {
    const num = parseFloat(valStr);
    if (isNaN(num)) return;
    
    setCurrentValues(prev => prev.map(cv => {
      if (cv.testId === testId) {
        return { ...cv, value: num };
      }
      return cv;
    }));
  };
  const parseReportText = (text: string) => {
    const lines = text.split(/\n/);
    const parsedValues: LabValueState[] = [];
    const newCustomRanges: Record<string, { min: number; max: number }> = {};

    // Map keywords to database biomarker IDs
    const keywordMap: Record<string, string> = {
      hb: "hb",
      hemoglobin: "hb",
      haemoglobin: "hb",
      wbc: "wbc",
      white: "wbc",
      leukocyte: "wbc",
      plt: "plt",
      platelet: "plt",
      glucose: "glucose",
      sugar: "glucose",
      glycemic: "glucose",
      tsh: "tsh",
      thyroid: "tsh",
      cholesterol: "cholesterol",
      chol: "cholesterol",
      creatinine: "creatinine",
      creat: "creatinine",
      alt: "alt",
      sgpt: "alt",
      bilirubin: "bilirubin",
      bili: "bilirubin"
    };

    lines.forEach(line => {
      const lower = line.toLowerCase();
      // Match key
      let matchedId: string | null = null;
      for (const [kw, testId] of Object.entries(keywordMap)) {
        if (lower.includes(kw)) {
          matchedId = testId;
          break; // Grab the first match
        }
      }

      if (!matchedId) return;

      // Extract all numbers on this line
      const matches = line.match(/\d+(\.\d+)?/g);
      if (!matches || matches.length === 0) return;

      // The first number matched is our measurement value
      const value = parseFloat(matches[0]);

      // Look for custom reference ranges (e.g. "4.0 - 11.0", "[4.0, 11.0]", "0.4 to 4.5")
      const rangeMatch = line.match(/(\d+(?:\.\d+)?)\s*(?:-|\bto\b)\s*(\d+(?:\.\d+)?)/);
      if (rangeMatch && rangeMatch.length >= 3) {
        const minVal = parseFloat(rangeMatch[1]);
        const maxVal = parseFloat(rangeMatch[2]);
        if (minVal < maxVal) {
          newCustomRanges[matchedId] = { min: minVal, max: maxVal };
        }
      }

      // Add to value states list
      const rawBio = BIOMARKERS_DATABASE[matchedId];
      if (rawBio && !parsedValues.some(v => v.testId === matchedId)) {
        parsedValues.push({
          testId: matchedId,
          name: rawBio.name,
          value: value
        });
      }
    });

    if (parsedValues.length > 0) {
      setCurrentValues(parsedValues);
      setCustomReferenceRanges(prev => ({ ...prev, ...newCustomRanges }));
    }
  };

  const handleDecodePastedText = () => {
    if (!pastedText.trim()) return;
    
    setIsScanning(true);
    setScanPercentage(0);
    setScanStepText("Tokenizing pasted text manual inputs...");

    const steps = [
      "Identifying matched biomarker terms...",
      "Resolving smart reference ranges...",
      "Evaluating homeostasis balances...",
      "Decoding laboratory health summary..."
    ];

    let stepIdx = 0;

    const interval = setInterval(() => {
      setScanPercentage(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setTimeout(() => {
            setIsScanning(false);
            parseReportText(pastedText);
            setTimeout(() => {
              resultRef.current?.scrollIntoView({ behavior: "smooth" });
            }, 100);
          }, 300);
          return 100;
        }

        const next = prev + Math.floor(Math.random() * 25) + 15;
        const currentPercentage = Math.min(next, 100);

        const currentStep = Math.floor((currentPercentage / 100) * steps.length);
        if (steps[currentStep] && stepIdx !== currentStep) {
          stepIdx = currentStep;
          setScanStepText(steps[currentStep]);
        }

        return currentPercentage;
      });
    }, 120);
  };

  // File Drag & Drop Handlers
  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleUploadedFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileBrowse = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleUploadedFile(e.target.files[0]);
    }
  };

  // Visual OCR Scan Simulator Timelines
  const handleUploadedFile = (file: File) => {
    setUploadedFileName(file.name);
    setIsScanning(true);
    setScanPercentage(0);

    const steps = [
      "Interpreting file dimensions...",
      "Executing high-fidelity OCR scanning layers...",
      "Isolating clinical biomarker coordinates...",
      "Mapping clinical values to baseline standards...",
      "Resolving blood pane diagnostics..."
    ];

    let stepIdx = 0;
    setScanStepText(steps[0]);

    const interval = setInterval(() => {
      setScanPercentage(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setTimeout(() => {
            setIsScanning(false);
            
            // Generate a simulated report text with custom reference ranges to demonstrate smart detection
            const simText = `
              LABORATORY RESEARCH REPORT - CLINICAL METRICS SUMMARY
              Patient ID: 94029-X  |  Filename: ${file.name}
              
              Hemoglobin: 11.2 g/dL   (Range: 12.5 - 16.5 g/dL)
              WBC: 12400 /uL         (Range: 4000 - 10500 /uL)
              Glucose: 112 mg/dL     (Range: 75 - 110 mg/dL)
              TSH: 5.8 mIU/L         (Range: 0.3 - 4.8 mIU/L)
              Cholesterol: 245 mg/dL (Range: 120 - 220 mg/dL)
            `;

            parseReportText(simText);
            setUploadedFileName(file.name);
            setTimeout(() => {
              resultRef.current?.scrollIntoView({ behavior: "smooth" });
            }, 100);
          }, 300);
          return 100;
        }
        
        const next = prev + Math.floor(Math.random() * 15) + 5;
        const currentPercentage = Math.min(next, 100);

        // Update step text at milestones
        const currentStep = Math.floor((currentPercentage / 100) * steps.length);
        if (steps[currentStep] && stepIdx !== currentStep) {
          stepIdx = currentStep;
          setScanStepText(steps[currentStep] || steps[steps.length - 1]);
        }

        return currentPercentage;
      });
    }, 150);
  };

  const handleCopySummary = () => {
    const criticalText = criticalItems.map(c => `⚠️ ${c.name}: ${c.value} ${c.unit} (${c.status})`).join("\n");
    const concernedText = concernedItems.map(c => `🔸 ${c.name}: ${c.value} ${c.unit} (${c.status})`).join("\n");
    
    let summaryText = `--- AI Lab Report Decoder Results slip ---\n`;
    summaryText += `Evaluated Gender: ${activeGender}\n`;
    summaryText += `Urgency Category: ${overallUrgency.toUpperCase()}\n\n`;
    
    if (criticalItems.length > 0) {
      summaryText += `Attention Recommended:\n${criticalText}\n\n`;
    }
    if (concernedItems.length > 0) {
      summaryText += `Mild Concerns:\n${concernedText}\n\n`;
    }
    if (criticalItems.length === 0 && concernedItems.length === 0) {
      summaryText += `✅ All tested benchmarks are healthy and nominal.\n\n`;
    }

    summaryText += `Support Advisory Disclaimer:\nThis tool simplifies reports and is NOT a medical diagnosis tool. Please confirm indices with your physician.`;

    navigator.clipboard.writeText(summaryText)
      .then(() => {
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      });
  };

  return (
    <div className="space-y-10">
      
      {/* SECTION CARD — DASHBOARD INTRO */}
      <section className="bg-slate-900/95 rounded-2xl border border-slate-800 p-6 md:p-8 shadow-xl text-left relative overflow-hidden backdrop-blur-sm max-w-4xl mx-auto">
        <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/5 rounded-full blur-3xl pointer-events-none" />
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-b border-slate-800 pb-5">
          <div className="flex items-center gap-3.5">
            <div className="w-11 h-11 rounded-xl bg-blue-950 text-blue-400 flex items-center justify-center border border-blue-900/40 shadow-md">
              <FileText size={20} />
            </div>
            <div>
              <span className="block text-[10px] font-mono text-blue-400 uppercase tracking-widest leading-none mb-1">
                FEATURE MODULE II
              </span>
              <h2 className="text-xl md:text-2xl font-sans font-bold text-slate-100">
                Lab Report Decoder
              </h2>
            </div>
          </div>
          <div className="flex items-center gap-2 bg-slate-950 px-3 py-1.5 rounded-lg border border-slate-850 font-mono text-xs text-slate-400">
            <Activity size={12} className="text-emerald-500 animate-pulse" />
            <span>Pathology Explainer</span>
          </div>
        </div>

        <p className="text-xs md:text-sm text-slate-400 font-sans leading-relaxed mt-4">
          Upload pathology reports or select standard presets below to translate biochemistry values into everyday english. 
          Use the manual inputs to test specific numbers privately and immediately.
        </p>

        {/* MEDICAL DISCLAIMER BANNER */}
        <div className="mt-5 bg-amber-950/20 border border-amber-900/30 p-4 rounded-xl flex items-start gap-3">
          <AlertCircle className="text-amber-500 shrink-0 mt-0.5" size={16} />
          <div className="space-y-0.5 text-left">
            <span className="text-[10px] font-mono text-amber-500 uppercase tracking-widest font-bold block">🚨 Important Safety Safe-Guarding Rule</span>
            <p className="text-xs text-slate-350 font-sans leading-normal">
              This tool simplifies lab reports and does <strong>NOT</strong> replace licensed medical advice or diagnostic confirmation. 
              We never prescribe medicine or write therapeutic dosages.
            </p>
          </div>
        </div>
      </section>

      {/* DUAL WORKSPACE PANEL */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 max-w-7xl mx-auto text-left items-start">
        
        {/* LEFT COLUMN: UPLOADER AND PARAMETERS PANEL (7 COLS) */}
        <div className="lg:col-span-12 xl:col-span-5 space-y-6">
          
          {/* CARD 1: DROP REPORT OR SELECT PRESET */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-5">
            <h3 className="text-slate-100 font-sans font-bold text-sm tracking-tight border-b border-slate-850 pb-2.5 flex items-center gap-2">
              📂 Step 1: Input Lab Report Details
            </h3>

            {/* Input Selection Tabs (Requirement 1) */}
            <div className="flex bg-slate-950 rounded-lg p-0.5 border border-slate-850">
              <button
                type="button"
                onClick={() => setInputMethod("file")}
                className={`flex-1 py-2 text-xs font-mono font-bold rounded-md transition flex items-center justify-center gap-1.5 ${
                  inputMethod === "file" 
                    ? "bg-slate-850 text-blue-400 border border-slate-800 shadow" 
                    : "text-slate-500 hover:text-slate-300"
                }`}
              >
                <Upload size={13} />
                <span>Upload Report</span>
              </button>
              <button
                type="button"
                onClick={() => setInputMethod("text")}
                className={`flex-1 py-1.5 text-xs font-mono font-bold rounded-md transition flex items-center justify-center gap-1.5 ${
                  inputMethod === "text" 
                    ? "bg-slate-850 text-blue-400 border border-slate-800 shadow" 
                    : "text-slate-500 hover:text-slate-300"
                }`}
              >
                <FileText size={13} />
                <span>Paste Manual Values</span>
              </button>
            </div>

            {inputMethod === "file" ? (
              /* DRAG AND DROP BOX */
              <div
                onDragEnter={handleDrag}
                onDragOver={handleDrag}
                onDragLeave={handleDrag}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
                className={`border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all ${
                  dragActive 
                    ? "border-blue-500 bg-blue-950/20 scale-[0.99]" 
                    : "border-slate-800 bg-slate-950/40 hover:border-slate-700 hover:bg-slate-950/80"
                }`}
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  className="hidden"
                  accept="image/*,application/pdf"
                  onChange={handleFileBrowse}
                />
                <div className="flex flex-col items-center space-y-3">
                  <div className="p-3 bg-slate-900 rounded-xl border border-slate-800">
                    <Upload className="text-blue-400 animate-bounce" size={20} />
                  </div>
                  <div>
                    <p className="text-xs md:text-sm font-sans font-semibold text-slate-200">
                      {uploadedFileName ? `📄 ${uploadedFileName}` : "Drag & drop report (PDF / Image)"}
                    </p>
                    <p className="text-[10px] text-slate-500 font-mono mt-1">
                      Or click to browse storage files
                    </p>
                  </div>
                  {uploadedFileName && (
                    <span className="px-2 py-0.5 text-[9px] font-mono text-emerald-400 bg-emerald-950/50 rounded border border-emerald-900">
                      File Isolated Successfully
                    </span>
                  )}
                </div>
              </div>
            ) : (
              /* MANUAL VALUE PASTE BOX */
              <div className="space-y-3 text-left">
                <textarea
                  value={pastedText}
                  onChange={(e) => setPastedText(e.target.value)}
                  placeholder={`Paste manual lab values or scanned raw text here, for example:\nHemoglobin: 9.5\nWBC: 12000 (Range: 4000 - 11000)\nTSH: 8.2\nVitamin D: 14 [Range: 20 - 50]`}
                  rows={6}
                  className="w-full text-xs font-mono p-3 bg-slate-950/80 border border-slate-850 rounded-xl text-slate-200 placeholder-slate-600 focus:outline-none focus:border-slate-700 transition resize-none leading-relaxed"
                />
                <button
                  type="button"
                  onClick={handleDecodePastedText}
                  disabled={!pastedText.trim()}
                  className={`w-full py-2.5 rounded-xl font-sans font-bold text-xs flex items-center justify-center gap-1.5 border transition cursor-pointer select-none ${
                    pastedText.trim()
                      ? "bg-blue-600/95 hover:bg-blue-600 border-blue-500/30 text-white shadow-lg shadow-blue-500/10"
                      : "bg-slate-950/80 border-slate-850 text-slate-600 pointer-events-none"
                  }`}
                >
                  <Activity size={12} className="text-blue-400 font-bold" />
                  <span>Decode Pasted Biomarkers</span>
                </button>
              </div>
            )}

            {/* PRESETS LOGIC */}
            <div className="space-y-2.5">
              <span className="block text-[10px] font-mono text-slate-500 uppercase tracking-widest">
                💡 Or Load a Pre-Configured Sample Panel:
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {PRESET_LAB_REPORTS.map((preset) => {
                  const isCur = PRESET_LAB_REPORTS.find(p => p.id === preset.id)?.id === preset.id;
                  return (
                    <button
                      key={preset.id}
                      type="button"
                      onClick={() => loadPreset(preset)}
                      className="px-3 py-2 text-xs text-left bg-slate-950 hover:bg-slate-900 text-slate-350 hover:text-white rounded-lg border border-slate-850 hover:border-slate-750 transition cursor-pointer select-none"
                    >
                      <div className="font-semibold text-slate-200 truncate">{preset.title}</div>
                      <div className="text-[9px] text-slate-500 truncate mt-0.5">{preset.description}</div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* GENDER PICKER */}
            <div className="flex items-center justify-between pt-2.5 border-t border-slate-850">
              <span className="text-xs font-semibold text-slate-350 font-sans">
                Biological Range Setting
              </span>
              <div className="flex bg-slate-950 rounded-lg p-0.5 border border-slate-850">
                <button
                  type="button"
                  onClick={() => setActiveGender("Female")}
                  className={`px-3 py-1 text-[10px] font-mono font-bold rounded-md transition ${
                    activeGender === "Female" 
                      ? "bg-slate-850 text-blue-400 border border-slate-800 shadow" 
                      : "text-slate-500 hover:text-slate-300"
                  }`}
                >
                  Female
                </button>
                <button
                  type="button"
                  onClick={() => setActiveGender("Male")}
                  className={`px-3 py-1 text-[10px] font-mono font-bold rounded-md transition ${
                    activeGender === "Male" 
                      ? "bg-slate-850 text-blue-400 border border-slate-800 shadow" 
                      : "text-slate-500 hover:text-slate-300"
                  }`}
                >
                  Male
                </button>
              </div>
            </div>

          </div>

          {/* ACTIVE OCR SCAN EFFECT OVERLAY */}
          <AnimatePresence>
            {isScanning && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="bg-blue-950/25 border border-blue-900/40 rounded-2xl p-6 space-y-4 overflow-hidden"
              >
                <div className="flex items-center justify-between">
                  <span className="font-mono text-[10px] uppercase tracking-wider text-blue-400 font-bold flex items-center gap-1.5 animate-pulse">
                    <Sparkles size={12} className="text-blue-400 shrink-0" />
                    OCR Optical Scanning Active
                  </span>
                  <span className="font-mono text-xs text-blue-400">{scanPercentage}%</span>
                </div>
                
                {/* Visual Laser Line bar animation */}
                <div className="h-1 bg-slate-900 rounded-full overflow-hidden relative">
                  <div 
                    className="h-full bg-blue-500 transition-all duration-150"
                    style={{ width: `${scanPercentage}%` }}
                  />
                  <div className="absolute top-0 bottom-0 w-20 bg-blue-300 blur-sm animate-pulse-light" />
                </div>

                <div className="text-xs text-slate-300 font-mono text-left italic">
                  &gt; {scanStepText}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* RIGHT COLUMN: ANALYSIS REPORT DISPLAY (7 COLS) */}
        <div className="lg:col-span-12 xl:col-span-7 space-y-6">
          <ReportDashboardResult
            results={results}
            criticalItems={criticalItems}
            concernedItems={concernedItems}
            overallUrgency={overallUrgency}
            overallColor={overallColor}
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            filterMode={filterMode}
            setFilterMode={setFilterMode}
            expandedCategories={expandedCategories}
            setExpandedCategories={setExpandedCategories}
            handleValueChange={handleValueChange}
            handleStepValue={handleStepValue}
            getAdvancedDetailedFunction={getAdvancedDetailedFunction}
            expandedCardIds={expandedCardIds}
            toggleCardExpanded={toggleCardExpanded}
            handleCopySummary={handleCopySummary}
            copied={copied}
            resultRef={resultRef}
            activeGender={activeGender}
          />
          {false && (
            <div>
              {/* THE MASTER ANALYSIS TABLE (Requirement 7) */}
          <div ref={resultRef} className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-5">
            <div className="flex items-center justify-between border-b border-slate-850 pb-3">
              <h3 className="text-slate-100 font-sans font-bold text-sm flex items-center gap-2">
                🔬 Step 2: Biomarker Interpretation
              </h3>
              <span className="text-[10px] text-slate-500 font-mono uppercase tracking-wide">
                Gender Reference: <span className="text-blue-400 font-bold">{activeGender}</span>
              </span>
            </div>

            {/* Overall Status Header Overview widget (Requirement 7) */}
            <div className="bg-slate-950/80 rounded-xl p-4 border border-slate-850 grid grid-cols-2 md:grid-cols-4 gap-4 items-center">
              <div className="text-left space-y-1">
                <span className="text-[10px] font-mono text-slate-500 uppercase tracking-wider block">Overall Urgent</span>
                <div className="flex items-center gap-1.5 pt-0.5">
                  <span className={`w-2 h-2 rounded-full ${criticalItems.length > 0 ? "bg-red-500 animate-pulse" : "bg-slate-800"}`} />
                  <span className="text-lg font-mono font-bold text-slate-100">{criticalItems.length}</span>
                </div>
              </div>
              <div className="text-left space-y-1">
                <span className="text-[10px] font-mono text-slate-500 uppercase tracking-wider block">Mild Shifts</span>
                <div className="flex items-center gap-1.5 pt-0.5">
                  <span className={`w-2 h-2 rounded-full ${concernedItems.length > 0 ? "bg-amber-400" : "bg-slate-800"}`} />
                  <span className="text-lg font-mono font-bold text-slate-100">{concernedItems.length}</span>
                </div>
              </div>
              <div className="text-left space-y-1">
                <span className="text-[10px] font-mono text-slate-500 uppercase tracking-wider block">Nominal Markers</span>
                <div className="flex items-center gap-1.5 pt-0.5">
                  <span className={`w-2 h-2 rounded-full ${results.length - criticalItems.length - concernedItems.length > 0 ? "bg-emerald-400" : "bg-slate-800"}`} />
                  <span className="text-lg font-mono font-bold text-slate-100">{results.length - criticalItems.length - concernedItems.length}</span>
                </div>
              </div>
              <div className="text-left space-y-1">
                <span className="text-[10px] font-mono text-slate-500 uppercase tracking-wider block">Triage Class</span>
                <div className="pt-0.5">
                  <span className={`px-2 py-0.5 rounded text-[10px] font-mono tracking-wider font-bold ${
                    overallColor === 'red' ? 'bg-red-955 text-red-400 border border-red-900/40' : 
                    overallColor === 'amber' ? 'bg-amber-955 text-amber-400 border border-amber-900/30' :
                    'bg-emerald-955 text-emerald-400 border border-emerald-900/30'
                  }`}>
                    {overallUrgency.toUpperCase()}
                  </span>
                </div>
              </div>
            </div>

            <p className="text-[11px] text-slate-400 leading-relaxed max-w-2xl font-sans mt-1">
              Click the **value box** inside any row or use the **- and + stepper buttons** to modify indicators. Try setting higher or lower numbers to see explanations refresh instantly:
            </p>

            {/* PARAMETERS LIST */}
            <div className="space-y-4 pt-1">
              {results.map((res) => (
                <div 
                  key={res.id} 
                  className={`rounded-xl border p-4 transition-all hover:bg-slate-950/[0.15] ${
                    res.status.startsWith("Requires") 
                      ? "border-red-900/50 bg-red-950/5" 
                      : res.status !== "Normal" 
                        ? "border-amber-900/30 bg-amber-950/5" 
                        : "border-slate-855 bg-slate-955"
                  }`}
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 pb-2.5 border-b border-slate-900">
                    
                    <div className="flex items-center gap-2">
                      <span className={`w-1.5 h-1.5 rounded-full ${
                        res.statusColor === "red" ? "bg-red-500 animate-pulse" :
                        res.statusColor === "amber" ? "bg-amber-400" : "bg-emerald-400"
                      }`} />
                      <div className="text-xs font-bold text-slate-100 font-sans">
                        {res.name}
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      {/* Normal range reference */}
                      <span className="text-[10px] font-mono text-slate-550 select-none">
                        Ref Range: {res.min} - {res.max} {res.unit}
                      </span>
                      
                      {/* Enhanced Input Stepper container (Requirement 13) */}
                      <div className="flex items-center bg-slate-950 border border-slate-850 hover:border-slate-750 p-1 rounded-xl gap-1">
                        <button
                          type="button"
                          onClick={() => handleStepValue(res.id, -1, res.id === "creatinine" || res.id === "tsh" || res.id === "bilirubin")}
                          className="w-5 h-5 bg-slate-900 text-slate-300 hover:text-white rounded flex items-center justify-center font-mono text-xs font-bold border border-slate-850 hover:border-slate-700 cursor-pointer select-none"
                        >
                          -
                        </button>
                        <input
                          type="number"
                          step={res.id === "creatinine" || res.id === "tsh" || res.id === "bilirubin" ? "0.1" : "1"}
                          value={res.value}
                          onChange={(e) => handleValueChange(res.id, e.target.value)}
                          className="w-12 bg-transparent outline-none border-none text-center font-mono text-xs text-slate-100 font-bold focus:ring-0 p-0"
                        />
                        <button
                          type="button"
                          onClick={() => handleStepValue(res.id, 1, res.id === "creatinine" || res.id === "tsh" || res.id === "bilirubin")}
                          className="w-5 h-5 bg-slate-900 text-slate-300 hover:text-white rounded flex items-center justify-center font-mono text-xs font-bold border border-slate-850 hover:border-slate-700 cursor-pointer select-none"
                        >
                          +
                        </button>
                      </div>

                      {/* Status badge */}
                      <span className={`px-2 py-0.5 rounded text-[9px] font-mono uppercase tracking-widest font-bold ${
                        res.statusColor === "red" ? "bg-red-950/65 text-red-400 border border-red-900/50" :
                        res.statusColor === "amber" ? "bg-amber-950/65 text-amber-400 border border-amber-900/30" :
                        "bg-emerald-950/65 text-emerald-400 border border-emerald-900/30"
                      }`}>
                        {res.status}
                      </span>
                    </div>

                  </div>

                  {/* SUB ANALYSIS DETAIL BOX */}
                  <div className="grid grid-cols-1 md:grid-cols-12 gap-3.5 pt-3 text-xs leading-relaxed font-sans">
                    <div className="md:col-span-8 space-y-1 text-left">
                      <span className="text-[9px] font-mono text-slate-500 uppercase tracking-widest block font-bold">
                        Simplified Layman Translation
                      </span>
                      <p className="text-slate-200">
                        {res.explanation}
                      </p>
                      <div className="pt-1 select-none">
                        <span className="text-[9px] font-mono text-slate-500 uppercase tracking-widest block font-bold">
                          Possible Biological Action
                        </span>
                        <p className="text-slate-400 text-[11px] leading-relaxed italic">
                          {res.meaning}
                        </p>
                      </div>
                    </div>

                    <div className="md:col-span-4 rounded-lg bg-slate-950 border border-slate-900 p-3 space-y-1.5 text-center flex flex-col justify-center">
                      <div>
                        <span className="text-[9px] font-mono text-slate-500 block uppercase tracking-wider font-bold">Suggested Consultant</span>
                        <span className="text-slate-100 text-[11px] font-semibold block mt-0.5">
                          {res.specialist === "None needed" ? "✅ Nominal (No Triage)" : `👨‍⚕️ ${res.specialist}`}
                        </span>
                      </div>
                      
                      {res.specialist !== "None needed" && (
                        <div className="border-t border-slate-900/50 pt-1.5">
                          <span className="text-[8px] font-mono text-blue-400 block uppercase tracking-wider font-bold block">Required Credentials</span>
                          <span className="text-slate-400 text-[9px] leading-tight block truncate mt-0.5">
                            {res.degreeNeeded.split("→").pop()?.trim()}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Toggle Advanced Detail Link (Requirement 10) */}
                  <div className="mt-3 pt-2 border-t border-slate-950 border-dashed flex justify-between items-center text-[10px]">
                    <button
                      type="button"
                      onClick={() => toggleCardExpanded(res.id)}
                      className="text-blue-400 hover:text-blue-300 font-mono font-bold flex items-center gap-1 cursor-pointer select-none"
                    >
                      <span>{expandedCardIds[res.id] ? "▼ Hide Advanced Scientific Detail" : "▶ View Advanced Scientific Detail"}</span>
                    </button>
                    {res.status !== "Normal" && (
                      <span className="text-slate-500 font-mono italic">
                        Follow-up Level: <strong className="text-amber-500 font-bold">{res.urgency}</strong>
                      </span>
                    )}
                  </div>

                  <AnimatePresence>
                    {expandedCardIds[res.id] && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        className="overflow-hidden mt-3 p-3 bg-slate-950/90 rounded-xl border border-slate-850 space-y-2.5 text-left"
                      >
                        <div className="space-y-1">
                          <span className="text-[8px] font-mono text-blue-400 uppercase tracking-widest block font-bold">Biochemical Matrix & Cellular Function</span>
                          <p className="text-slate-300 text-[10.5px] font-mono leading-relaxed bg-slate-900/40 p-2.5 rounded border border-slate-950">
                            {getAdvancedDetailedFunction(res.id)}
                          </p>
                        </div>
                        <div className="space-y-1">
                          <span className="text-[8px] font-mono text-emerald-400 uppercase tracking-widest block font-bold">Recommended Specialist Referral Reason</span>
                          <p className="text-slate-300 text-[11px] font-sans leading-normal">
                            A consultation with a <strong className="text-slate-100">{res.specialist}</strong> ({res.degreeNeeded}) is suggested {res.specialistReason}
                          </p>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>

                </div>
              ))}
            </div>

            {/* Overall Health Summary Card (Requirement 3) */}
            <div className="bg-slate-950/60 rounded-xl p-5 border border-slate-850 space-y-4 text-left mt-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-900 pb-3">
                <div className="flex items-center gap-2">
                  <div className={`w-2.5 h-2.5 rounded-full ${
                    overallColor === 'red' ? 'bg-red-500 animate-pulse' : 
                    overallColor === 'amber' ? 'bg-amber-400' : 'bg-emerald-400'
                  }`} />
                  <span className="text-xs font-sans font-bold uppercase tracking-wider text-slate-200">
                    Clinical Summary & Baseline Assessment
                  </span>
                </div>
                <span className={`px-2.5 py-1 rounded-full text-[10px] font-mono font-bold uppercase tracking-widest border ${
                  overallColor === 'red' ? 'bg-red-950/70 border-red-900/50 text-red-400' :
                  overallColor === 'amber' ? 'bg-amber-950/70 border-amber-900/30 text-amber-400' :
                  'bg-emerald-950/70 border-emerald-900/30 text-emerald-400'
                }`}>
                  Overall Class: {overallUrgency}
                </span>
              </div>

              <div className="space-y-3">
                <p className="text-slate-350 text-xs font-sans leading-relaxed">
                  {overallUrgency === "Urgent" ? (
                    <span>
                      A review of your active panel shows that **{criticalItems.length}** biomarker(s) reside significantly outside standard reference boundaries. Priority focus is recommended to monitor circulatory homeostatic paths. The remaining parameters suggest baseline metabolic systems are operating within standard tolerance.
                    </span>
                  ) : overallUrgency === "Soon" ? (
                    <span>
                      Your current blood indicators represent minor variations with **{concernedItems.length}** marker(s) showing slight shifts from reference baselines. The core systems for waste filtration and cellular oxygenation show high baseline integrity, making simple habit adjustments a reassuring focus.
                    </span>
                  ) : (
                    <span>
                      Excellent physiological balance observed across all **{results.length}** active parameters. Your hematological indices, glycemic regulation, and kidney/liver filtration baselines appear clinically robust, reflecting strong biological reserve capacity.
                    </span>
                  )}
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-1">
                  <div className="bg-slate-900/50 border border-slate-855 rounded-xl p-3 text-left">
                    <span className="text-[9px] font-mono text-emerald-400 block uppercase tracking-wider font-bold mb-1">💪 Tested Strengths</span>
                    <ul className="space-y-1 text-slate-355 text-[11px] leading-normal font-sans list-disc list-inside">
                      {results.filter(r => r.status === "Normal").slice(0, 3).map(r => (
                        <li key={r.id}>Healthy {r.name} regulation</li>
                      ))}
                      {results.filter(r => r.status === "Normal").length === 0 && (
                        <li>Tested indicators suggest general body metabolic activity</li>
                      )}
                      <li>Stable cardiovascular and circulatory load metrics</li>
                    </ul>
                  </div>
                  <div className="bg-slate-900/50 border border-slate-855 rounded-xl p-3 text-left">
                    <span className="text-[9px] font-mono text-amber-500 block uppercase tracking-wider font-bold mb-1">🎯 Primary Support Focus Paths</span>
                    <ul className="space-y-1 text-slate-355 text-[11px] leading-normal font-sans list-disc list-inside">
                      {results.filter(r => r.status !== "Normal").slice(0, 2).map(r => (
                        <li key={r.id}>Gently evaluate {r.name} metrics</li>
                      ))}
                      <li>Consistent pure structured water hydration</li>
                      <li>Balanced ambient physical resting cycles</li>
                    </ul>
                  </div>
                </div>
              </div>

              <div className="bg-slate-900/60 p-3 rounded-lg border border-slate-900/50 space-y-1 max-w-4xl">
                <span className="text-[9px] font-mono text-blue-400 block uppercase tracking-wider font-bold shrink-0">💬 Dynamic Question to Ask Your Doctor</span>
                <p className="text-xs text-blue-200 italic leading-snug">
                  {overallUrgency === "Urgent" 
                    ? `"Could you help me understand how to best evaluate these markers, and what general clinical follow-up is recommended?"`
                    : overallUrgency === "Soon"
                      ? `"What simple lifestyle modifications or follow-up cycles would you suggest for these values that are slightly outside the usual range?"`
                      : `"Since my routine panel check is stable, what baseline parameters should we track annually to preserve this performance?"`}
                </p>
              </div>
            </div>

            {/* General Wellness Suggestions Card (Requirement 4) */}
            <div className="bg-slate-950/60 rounded-xl p-5 border border-slate-850 space-y-3.5 text-left mt-6">
              <div className="flex items-center gap-2 border-b border-slate-900 pb-2">
                <Sparkles size={14} className="text-blue-400" />
                <span className="text-xs font-sans font-bold uppercase tracking-wider text-slate-200">
                  General Wellness Coaching & Guidance
                </span>
              </div>
              <p className="text-slate-500 text-[11px] leading-relaxed italic font-sans">
                Low-risk preventive adjustments to support overall homeostatic regulation. We never prescribe pharmaceutical dosages or treat clinical diagnoses.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-1 text-xs">
                <div className="p-3 bg-slate-900/40 rounded-xl border border-slate-855 space-y-1">
                  <span className="text-slate-200 font-bold block">🥛 Advanced Hydration</span>
                  <p className="text-slate-450 text-[11px] leading-normal font-sans">Aim for 35ml of purified water per kilogram of body weight to support renal clearance efficiency safely.</p>
                </div>
                <div className="p-3 bg-slate-900/40 rounded-xl border border-slate-855 space-y-1">
                  <span className="text-slate-200 font-bold block">🚶 Low-Impact Activity</span>
                  <p className="text-slate-455 text-[11px] leading-normal font-sans">A daily 20-30 minute outdoor walk helps regulate standard glycemic sensitivity and cardiovascular flow.</p>
                </div>
                <div className="p-3 bg-slate-900/40 rounded-xl border border-slate-855 space-y-1">
                  <span className="text-slate-200 font-bold block">🥬 Dietary Fiber</span>
                  <p className="text-slate-460 text-[11px] leading-normal font-sans">Introduce soluble fiber (oat bran, chia seeds) to gently balance lipid absorption and vascular resilience.</p>
                </div>
              </div>
            </div>

            {/* When to Visit a Doctor Card (Requirement 5) */}
            <div className="bg-red-950/10 border border-red-900/30 rounded-xl p-5 space-y-3 text-left mt-6 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-24 h-24 bg-red-500/5 rounded-full blur-2xl pointer-events-none" />
              <div className="flex items-center gap-2 border-b border-red-900/20 pb-2">
                <AlertCircle size={15} className="text-red-500" />
                <span className="text-xs font-sans font-bold uppercase tracking-wider text-red-500">
                  When to Visit a Medical Professional
                </span>
              </div>
              <p className="text-slate-300 text-xs font-sans leading-relaxed">
                To safeguard your health choices responsibly, please seek professional diagnostic support if you observe any of the following:
              </p>
              <ul className="space-y-1.5 text-[11px] text-slate-420 font-sans list-disc list-inside">
                <li>Any parsed parameters flagged as <strong>Requires Follow-up</strong> (marked in red).</li>
                <li>Persistent fatigue, unexplained weight changes, or unusual digestive shifts.</li>
                <li>To confirm baseline blood counts before starting new workout regimes or diets.</li>
                <li>A professional doctor with credentials can confirm your chemistry profiles safely.</li>
              </ul>
            </div>

            {/* ACTION FOOTER BAR */}
            <div className="flex flex-col sm:flex-row gap-4 pt-4 border-t border-slate-850 justify-between items-center bg-transparent">
              <div className="flex flex-wrap gap-2.5">
                <button
                  type="button"
                  onClick={handleCopySummary}
                  className="flex items-center gap-2 bg-slate-950 hover:bg-slate-900 hover:text-white text-slate-300 px-4 py-3 rounded-xl border border-slate-800 text-xs font-mono font-medium transition duration-150 cursor-pointer focus:outline-none"
                >
                  {copied ? (
                    <>
                      <Check size={14} className="text-emerald-400" />
                      ✓ Copied results!
                    </>
                  ) : (
                    <>
                      <Copy size={14} />
                      📋 Copy Decoder Summary
                    </>
                  )}
                </button>
                
                <button
                  type="button"
                  onClick={() => window.print()}
                  className="flex items-center gap-2 bg-slate-950 hover:bg-slate-900 hover:text-white text-slate-300 px-4 py-3 rounded-xl border border-slate-800 text-xs font-mono font-medium transition duration-150 cursor-pointer focus:outline-none"
                >
                  <Printer size={14} />
                  🖨️ Print Decoder Report
                </button>
              </div>

              <div className="text-[10px] font-mono text-slate-500 text-center sm:text-right">
                ✨ Keeping health data 100% private.
              </div>
            </div>

          </div>
          </div>
          )}

        </div>
      </div>

    </div>
  );
}
