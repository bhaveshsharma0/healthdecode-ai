import React, { useState, useEffect, useRef } from "react";
import { 
  Heart, 
  Brain, 
  Copy, 
  Check, 
  PhoneCall, 
  Activity, 
  Clock, 
  AlertOctagon, 
  Stethoscope, 
  RotateCcw, 
  Info, 
  BookOpen, 
  ChevronDown, 
  ChevronUp, 
  ArrowRight, 
  ShieldAlert, 
  Sparkles,
  ChevronRight,
  Shield,
  Printer,
  Search,
  CheckSquare
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { Specialist, AnalysisResult, PreviousSearch } from "./types";
import { SPECIALISTS_DATABASE, EMERGENCY_KEYWORDS, MOTIVATIONAL_QUOTES, PRESET_TEMPLATES } from "./data";
import LabReportDecoder from "./components/LabReportDecoder";

export default function App() {
  // --- Active Module Navigation ---
  const [activeModule, setActiveModule] = useState<"home" | "doctor" | "lab">("home");

  // --- Form States ---
  const [symptoms, setSymptoms] = useState("");
  const [ageGroup, setAgeGroup] = useState("Adult (18–60)");
  const [sex, setSex] = useState("Prefer not to say");
  const [duration, setDuration] = useState("2–7 days");
  const [severity, setSeverity] = useState("Moderate — affecting daily life");
  const [conditions, setConditions] = useState("");

  // --- UI Control States ---
  const [quote, setQuote] = useState("");
  const [errorInput, setErrorInput] = useState("");
  const [isEmergencyModalOpen, setIsEmergencyModalOpen] = useState(false);
  const [isBypassed, setIsBypassed] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [loadingStep, setLoadingStep] = useState(0);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [copied, setCopied] = useState(false);
  const [isDegreeExplainerOpen, setIsDegreeExplainerOpen] = useState(true);
  const [previousSearches, setPreviousSearches] = useState<PreviousSearch[]>([]);
  const [isExamplesOpen, setIsExamplesOpen] = useState(false);

  // Helper to append/toggle conditions inside input
  const handleToggleCondition = (condName: string) => {
    if (condName === "None") {
      setConditions("");
      return;
    }
    const current = conditions.trim();
    if (!current) {
      setConditions(condName);
    } else {
      const parts = current.split(",").map((p) => p.trim()).filter(Boolean);
      const index = parts.findIndex((p) => p.toLowerCase() === condName.toLowerCase());
      if (index > -1) {
        parts.splice(index, 1);
        setConditions(parts.join(", "));
      } else {
        parts.push(condName);
        setConditions(parts.join(", "));
      }
    }
  };

  // Refs for scrolling and transitions
  const resultsRef = useRef<HTMLDivElement>(null);

  // Initialize Random Quote and previous searches
  useEffect(() => {
    const randomIdx = Math.floor(Math.random() * MOTIVATIONAL_QUOTES.length);
    setQuote(MOTIVATIONAL_QUOTES[randomIdx]);
    loadSavedSearches();
  }, []);

  // Sync steps text when loading starts
  useEffect(() => {
    let interval: any;
    if (isLoading) {
      setLoadingStep(0);
      interval = setInterval(() => {
        setLoadingStep((prev) => (prev < 4 ? prev + 1 : prev));
      }, 420);
    } else {
      setLoadingStep(0);
    }
    return () => clearInterval(interval);
  }, [isLoading]);

  // Load searches from sessionStorage
  const loadSavedSearches = () => {
    try {
      const stored = sessionStorage.getItem("doctorfinder_searches");
      if (stored) {
        setPreviousSearches(JSON.parse(stored));
      }
    } catch (e) {
      console.error("Failed to read sessionStorage", e);
    }
  };

  // Save search to sessionStorage
  const saveSearchToSession = (symptomPreview: string, urgencyLabel: string, topSpec: string, resObj: AnalysisResult) => {
    try {
      const stored = sessionStorage.getItem("doctorfinder_searches");
      let list: PreviousSearch[] = stored ? JSON.parse(stored) : [];
      
      // Filter out duplicates with the same symptom text to keep variety
      list = list.filter((item) => item.symptomsText.toLowerCase() !== symptoms.toLowerCase());
      
      const newSearch: PreviousSearch = {
        symptomPreview: symptomPreview.length > 25 ? `${symptomPreview.slice(0, 25)}...` : symptomPreview,
        urgency: urgencyLabel,
        topSpecialistName: topSpec,
        symptomsText: symptoms,
        ageGroup,
        sex,
        duration,
        severity,
        conditions,
        result: resObj,
      };

      const updated = [newSearch, ...list].slice(0, 5); // Keep trailing 5
      sessionStorage.setItem("doctorfinder_searches", JSON.stringify(updated));
      setPreviousSearches(updated);
    } catch (e) {
      console.error("Failed to save to sessionStorage", e);
    }
  };

  // Restore preset or clinical search chip immediately
  const handleRestoreSearch = (pastItem: PreviousSearch) => {
    setSymptoms(pastItem.symptomsText);
    setAgeGroup(pastItem.ageGroup);
    setSex(pastItem.sex);
    setDuration(pastItem.duration);
    setSeverity(pastItem.severity);
    setConditions(pastItem.conditions);
    
    // Set result sets with no loading animation to make past checks ultra fast
    setResult(pastItem.result);
    setTimeout(() => {
      resultsRef.current?.scrollIntoView({ behavior: "smooth" });
    }, 100);
  };

  // Apply quick symptom templates
  const handleApplyTemplate = (tpl: typeof PRESET_TEMPLATES[0]) => {
    setSymptoms(tpl.text);
    setAgeGroup(tpl.ageGroup);
    setSex(tpl.sex);
    setDuration(tpl.duration);
    setSeverity(tpl.severity);
    setConditions(tpl.conditions);
    setErrorInput("");
    setResult(null);
  };

  // Main submission handler
  const handleFindSpecialist = (e: React.FormEvent) => {
    e.preventDefault();
    if (!symptoms.trim()) {
      setErrorInput("⚠️ Please describe your medical symptoms so DoctorFinder can map specialists.");
      return;
    }
    setErrorInput("");

    // Check emergency triggers first unless previously bypassed
    const symLower = symptoms.toLowerCase();
    const containsEmergencyPhrase = EMERGENCY_KEYWORDS.some((phrase) => symLower.includes(phrase));

    if (containsEmergencyPhrase && !isBypassed) {
      setIsEmergencyModalOpen(true);
      return;
    }

    // Trigger local rule-based analysis engine
    executeAnalysis();
  };

  // Bypass emergency overlay and force local matching
  const handleBypassEmergency = () => {
    setIsEmergencyModalOpen(false);
    setIsBypassed(true);
    executeAnalysis();
  };

  // Runs local matching algorithm and begins animated delay state
  const executeAnalysis = () => {
    setIsLoading(true);
    setResult(null);

    // Dynamic fake database lag mapping
    setTimeout(() => {
      const finalResult = runLocalAlgorithm();
      setIsLoading(false);
      setResult(finalResult);

      // Save to previous searches
      const topSpec = finalResult.specialists.length > 0 ? finalResult.specialists[0].name : "General Physician";
      saveSearchToSession(symptoms, finalResult.urgency, topSpec, finalResult);

      // Smooth scroll layout view downwards
      setTimeout(() => {
        resultsRef.current?.scrollIntoView({ behavior: "smooth" });
      }, 100);
    }, 1800);
  };

  // Core Clinical Deterministic Logic mapping keywords to ranks
  const runLocalAlgorithm = (): AnalysisResult => {
    const sym = symptoms.toLowerCase();
    const cond = conditions.toLowerCase();

    // Map scoring variables starting at zero
    const scoreMap = new Map<string, number>();
    SPECIALISTS_DATABASE.forEach((spec) => {
      let score = 0;

      // Assign weight to explicit matches
      spec.keywords.forEach((kw) => {
        if (sym.includes(kw)) {
          // Boost weights if symptom describes highly localized keywords
          score += 4;
        }
      });

      // Scan through conditions box
      if (cond) {
        spec.keywords.forEach((kw) => {
          if (cond.includes(kw)) {
            score += 2;
          }
        });
      }

      scoreMap.set(spec.name, score);
    });

    // demographic booster calculations
    if (ageGroup === "Child (0–12)") {
      const pScore = scoreMap.get("Paediatrician") || 0;
      scoreMap.set("Paediatrician", pScore + 10);
    }
    if (ageGroup === "Senior (60+)") {
      const gScore = scoreMap.get("Geriatrician") || 0;
      scoreMap.set("Geriatrician", gScore + 6);
    }
    if (sex === "Female") {
      const femaleKeywords = ["period", "menstru", "pregnancy", "ovary", "uterus", "vagina", "pcos", "ovarian", "menopause", "cramps", "periods", "irregular period"];
      const hasFemMatches = femaleKeywords.some((fk) => sym.includes(fk) || cond.includes(fk));
      if (hasFemMatches) {
        const gynScore = scoreMap.get("Gynaecologist") || 0;
        scoreMap.set("Gynaecologist", gynScore + 12);
      }
    }

    // Sort matching results descending
    let sorted = Array.from(scoreMap.entries())
      .map(([name, score]) => {
        const base = SPECIALISTS_DATABASE.find((s) => s.name === name)!;
        return { ...base, score };
      })
      .filter((item) => item.score > 0)
      .sort((a, b) => b.score - a.score);

    // Determine Urgency
    let urgency: "Routine" | "Soon" | "Urgent" = "Routine";
    let urgency_color: "green" | "amber" | "red" = "green";
    let urgency_reason = "";

    if (severity.startsWith("Severe")) {
      urgency = "Urgent";
      urgency_color = "red";
      urgency_reason = "Severe symptom reports affect physiological stability. Please coordinate immediate clinical checks today at a care ward to prevent fast inflammation or sudden crisis.";
    } else if (severity.startsWith("Moderate")) {
      urgency = "Soon";
      urgency_color = "amber";
      urgency_reason = "Moderate symptoms are actively presenting. It is highly advised to book or present yourself for a professional consult inside 48 to 72 hours.";
    } else {
      // Mild symptoms
      if (duration === "More than a month" || duration === "Recurring") {
        urgency = "Soon";
        urgency_color = "amber";
        urgency_reason = "Even if currently mild, chronic or recurring indicators lasting above 4 weeks require clinical specialist investigation inside 3-5 days.";
      } else {
        urgency = "Routine";
        urgency_color = "green";
        urgency_reason = "Symptomatology is mild, acute, and safely manageable. Setting a normal outpatient appointment within 1–2 weeks is a suitable approach.";
      }
    }

    // Determine General Physician primary gating
    let see_gp_first = false;
    let gp_reason = "";

    const highestScoreSelected = sorted.length > 0 ? sorted[0].score : 0;

    if (sorted.length === 0) {
      see_gp_first = true;
      gp_reason = "Symptoms are generalized or didn't trigger local target keywords. A General Physician is best suited for initial triage and diagnostic testing.";
      
      const gpBase = SPECIALISTS_DATABASE.find((s) => s.name === "General Physician")!;
      sorted = [{ ...gpBase, score: 5 }];
    } else if (highestScoreSelected < 4) {
      see_gp_first = true;
      gp_reason = "Symptom matching scores are low. A General Practitioner should check baseline diagnostics to verify the correct direction beforehand.";
    } else if (severity.startsWith("Mild")) {
      see_gp_first = true;
      gp_reason = "Your markers are mild. A primary care clinic can safely resolve typical bacterial strains and write primary drugs without high specialist consulting fees.";
    } else if (ageGroup === "Child (0–12)" && sorted[0].name !== "Paediatrician") {
      see_gp_first = true;
      gp_reason = "Pediatric metabolisms require careful dosage checks. Consulting an MBBS General Doctor or Paediatrician first is critical before organ-specific surgeries.";
    } else if (ageGroup === "Senior (60+)" && sorted[0].name !== "Geriatrician") {
      see_gp_first = true;
      gp_reason = "Senior citizens often face drug interaction checks. Starting at a General Practitioner coordinates complete system safety first.";
    }

    // Slice top matched specialists (max 3)
    const topResults = sorted.slice(0, 3);

    // Map custom diagnostic reasons
    const finalSpecialists = topResults.map((spec, index) => {
      let why = "";
      if (spec.name === "Cardiologist") {
        why = "Recommended based on circulatory keywords, heartbeats, potential vascular pressures, or palpitations described.";
      } else if (spec.name === "Neurologist") {
        why = "Recommended based on neural pain thresholds, recurring headaches, dizziness, or nerve pathways in your feedback.";
      } else if (spec.name === "Gastroenterologist") {
        why = "Matched due to gastrointestinal indicators, digestion, stomach acidity, reflux or abdominal tightness.";
      } else if (spec.name === "Dermatologist") {
        why = "Matched to consult on skin layers, dry rashes, scalp irritation, hair fall, or dry cracked surface itchings.";
      } else if (spec.name === "Orthopaedician") {
        why = "Recommended to assess joint articulations, back stiffness, spinal alignment, or localized bone and ligament conditions.";
      } else if (spec.name === "ENT Specialist") {
        why = "Matched to map sinus pressure, throat tissue soreness, ear auditory paths, or throat swallowing constraints.";
      } else if (spec.name === "Ophthalmologist") {
        why = "Matched to address vision clarity, optical strain, eye surface redness, or retinal swelling concerns.";
      } else if (spec.name === "Pulmonologist") {
        why = "Recommended to evaluates airways spasms, chronic wet/dry coughs, wheezing, or chest tightness patterns.";
      } else if (spec.name === "Endocrinologist") {
        why = "Matched based on possible metabolic thyroid swaps, sugar markers, PCOS cycle, or hormonal changes.";
      } else if (spec.name === "Nephrologist") {
        why = "Matched to track kidney filtration markers, creatinine levels, or flank side discomforts.";
      } else if (spec.name === "Urologist") {
        why = "Recommended based on bladder symptoms, recurring urinary burning, or male reproductive concerns.";
      } else if (spec.name === "Gynaecologist") {
        why = "Matched list based on female cycles, pregnancy guidelines, pelvic cramps, or irregular cycles.";
      } else if (spec.name === "Psychiatrist") {
        why = "Matched to support behavioral balances, neural stress states, insomnia patterns, or panic triggers.";
      } else if (spec.name === "Oncologist") {
        why = "Consultation advised for hard, enlarging growths, unexplained weight decline, or lymph node monitors.";
      } else if (spec.name === "Rheumatologist") {
        why = "Matched based on chronic joint stiffness lasting over 1 hour, or potential systemic autoimmune attacks.";
      } else if (spec.name === "Paediatrician") {
        why = "Matched because pediatric systems need age-appropriate medication scales and development charts.";
      } else if (spec.name === "Haematologist") {
        why = "Matched to investigate low iron levels, platelet counts, unexplained skin bruising, or anemia markers.";
      } else if (spec.name === "Infectious Disease Specialist") {
        why = "Matched to trace spiking fevers, resistant bacterial bugs, or exposure to external tropical viruses.";
      } else if (spec.name === "Allergist / Immunologist") {
        why = "Matched to check airborne/diet allergies, chronic hives, sneezing, or immune triggers.";
      } else if (spec.name === "Geriatrician") {
        why = "Matched to review multi-drug overlaps, coordinate elder routines, and check balance safety.";
      } else if (spec.name === "Dentist") {
        why = "Matched based on localized tooth pains, gum bleeds, cavities, jaws, or root-canal symptoms.";
      } else if (spec.name === "Physiotherapist") {
        why = "Matched to implement stretches, posture recoveries, spine mechanics, or sciatica nerve releases.";
      } else {
        why = "Recommended for primary assessment to clarify vague indicators and safeguard clinical paths.";
      }

      return {
        rank: index + 1,
        name: spec.name,
        icon: spec.icon,
        why,
        degree_needed: spec.degree_needed,
        degree_plain: spec.degree_plain,
        tier: spec.tier,
        years_training: spec.years_training,
        what_they_do: spec.what_they_do,
        key_question: spec.key_question,
        red_flags: spec.red_flags,
        keywords: spec.keywords
      };
    });

    // Pick lifestyle safety recommendation
    let lifestyle_tip = "Keep a detailed journal tracking exactly when symptoms start, what food or posture triggers them, and what brings relief. This data is invaluable to your primary doctor.";
    if (sym.includes("stomach") || sym.includes("acid") || sym.includes("ibs") || sym.includes("vomit")) {
      lifestyle_tip = "Stick to small, frequent bland meals for the next 48 hours. Avoid carbonated beverages, excessive caffeine, and raw spices. Do not lie down within 2 hours of a meal.";
    } else if (sym.includes("joint") || sym.includes("back") || sym.includes("bone") || sym.includes("pain")) {
      lifestyle_tip = "Rest the affected joint but avoid static freezing. Apply cold packs for acute swelling or injuries, and moist warm towels for chronic, persistent morning stiffness.";
    } else if (sym.includes("skin") || sym.includes("rash") || sym.includes("itching")) {
      lifestyle_tip = "Avoid scrubbing skin or using heavily perfumed soaps during showers. Keep the area moisturized with non-fragrant barrier creams. Wear loose organic clothing.";
    } else if (sym.includes("throat") || sym.includes("cough") || sym.includes("cold")) {
      lifestyle_tip = "Practice warm saline gargling twice daily to flush throat bacteria. Maintain good air humidity and hydrate frequently with lukewarm fluids.";
    } else if (sym.includes("panic") || sym.includes("anx") || sym.includes("sleep") || sym.includes("insomnia")) {
      lifestyle_tip = "Limit electronic screen exposure strictly 1 hour before bed. Consider trying slow diaphragmatic or boxed breathing (inhale 4s, hold 4s, exhale 4s) when heart rates flutter.";
    }

    return {
      urgency,
      urgency_reason,
      urgency_color,
      see_gp_first,
      gp_reason,
      specialists: finalSpecialists,
      lifestyle_tip,
      disclaimer: "This is guidance only, not a medical diagnosis. Please consult a licensed doctor."
    };
  };

  // Clipboard copy action as defined in specification
  const handleCopySummary = () => {
    if (!result) return;
    const firstChars = symptoms.slice(0, 60);
    const names = result.specialists.map((s) => s.name).join(", ");
    const textToCopy = `I checked my symptoms on DoctorFinder.
Symptoms: ${firstChars}...
Recommended: ${names}
Urgency: ${result.urgency}
Try it free: https://doctorfinder.vercel.app`;

    navigator.clipboard.writeText(textToCopy)
      .then(() => {
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      })
      .catch((err) => {
        console.error("Failed to copy text", err);
      });
  };

  const loadingStepsTexts = [
    "Analysing your symptoms...",
    "Matching specialist database...",
    "Checking urgency level...",
    "Preparing qualification details...",
    "Almost ready..."
  ];

  return (
    <div className="dot-grid min-h-screen relative flex flex-col justify-between pb-12 pt-10">
      
      {/* ⚕️ TOP STICKY DISCLAIMER BAR */}
      <div className="fixed top-0 left-0 right-0 h-10 bg-amber-500 text-slate-950 font-medium text-xs md:text-sm flex items-center justify-center px-4 shadow-md z-40 text-center tracking-tight">
        <span>⚕️ This tool guides you — it does <strong>NOT</strong> diagnose. Always consult a licensed doctor. Emergency? Call <strong>112</strong>.</span>
      </div>

      {/* CORE CONTAINER */}
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-6 flex-1">
        
        {/* TOP COMPONENT SELECTOR / NAVIGATION TABS */}
        <div className="max-w-md mx-auto mb-8 bg-slate-900/90 border border-slate-850 p-1 rounded-2xl flex items-center gap-1 shadow-2xl justify-center z-20 relative">
          <button
            type="button"
            onClick={() => { setActiveModule("home"); setResult(null); }}
            className={`flex-1 py-2.5 px-3 rounded-xl text-xs font-sans font-bold transition flex items-center justify-center gap-2 cursor-pointer ${
              activeModule === "home"
                ? "bg-slate-800 text-blue-400 border border-slate-750 shadow-md"
                : "text-slate-400 hover:text-slate-200"
            }`}
          >
            🏠 Dashboard
          </button>
          <button
            type="button"
            onClick={() => setActiveModule("doctor")}
            className={`flex-1 py-2.5 px-3 rounded-xl text-xs font-sans font-bold transition flex items-center justify-center gap-2 cursor-pointer ${
              activeModule === "doctor"
                ? "bg-slate-800 text-blue-400 border border-slate-750 shadow-md"
                : "text-slate-400 hover:text-slate-200"
            }`}
          >
            ⚕️ Specialist Navigator
          </button>
          <button
            type="button"
            onClick={() => setActiveModule("lab")}
            className={`flex-1 py-2.5 px-3 rounded-xl text-xs font-sans font-bold transition flex items-center justify-center gap-2 cursor-pointer ${
              activeModule === "lab"
                ? "bg-slate-800 text-blue-400 border border-slate-750 shadow-md"
                : "text-slate-400 hover:text-slate-200"
            }`}
          >
            🔬 Lab Decoder
          </button>
        </div>

        {/* --- DASHBOARD LANDING SELECTION PAGE --- */}
        {activeModule === "home" && (
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            className="max-w-4xl mx-auto space-y-8 text-left mt-6"
          >
            {/* PLATFORM BRAND HERO */}
            <div className="text-center space-y-3.5">
              <span className="font-mono text-xs text-blue-400 uppercase tracking-widest bg-slate-900/80 px-3 py-1.5 rounded-full border border-slate-800">
                // AI-powered Healthcare Guidance Suite
              </span>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-sans font-extrabold text-slate-100 tracking-tight leading-none mt-2">
                Doctor<span className="text-blue-500">Finder</span> Suite
              </h1>
              <p className="max-w-xl mx-auto text-xs md:text-sm text-slate-400 font-sans leading-relaxed">
                Welcome to your client-side healthcare companion. Navigate clinical specialist degrees or decode blood indicators privately. All calculations run strictly inside your sandbox.
              </p>
            </div>

            {/* TWO DASHBOARD CARDS GRID */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4">
              
              {/* CARD 1: DOCTOR FINDER */}
              <div 
                onClick={() => setActiveModule("doctor")}
                className="group bg-slate-900 border border-slate-800 hover:border-blue-500/40 p-6 md:p-8 rounded-2xl shadow-xl transition-all duration-300 cursor-pointer flex flex-col justify-between hover:shadow-blue-950/20 relative overflow-hidden text-left"
              >
                <div className="absolute top-0 right-0 w-24 h-24 bg-blue-500/5 rounded-full blur-2xl pointer-events-none group-hover:bg-blue-500/10 transition-colors" />
                <div className="space-y-4">
                  <div className="w-12 h-12 rounded-xl bg-blue-950/60 border border-blue-900/40 flex items-center justify-center text-blue-400 shadow group-hover:scale-105 transition-transform">
                    <Stethoscope size={22} />
                  </div>
                  <div className="space-y-1.5">
                    <h3 className="text-lg md:text-xl font-sans font-bold text-slate-100 group-hover:text-blue-400 transition-colors">
                      DoctorFinder
                    </h3>
                    <span className="text-xs font-mono font-medium text-blue-400 block tracking-tight">
                      Find the right medical specialist based on symptoms
                    </span>
                    <p className="text-xs text-slate-400 font-sans leading-relaxed pt-1.5">
                      Describe your localized symptoms to learn which specialist degree pathways (MD, MS, DM, MCh) fit your profile. Features include demographics adjustment, red-flag indicators, and printable clinical visits checklists.
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-1.5 text-xs font-mono font-bold text-slate-400 group-hover:text-blue-400 pt-6 transition-transform group-hover:translate-x-1">
                  Launch Navigator <ChevronRight size={14} />
                </div>
              </div>

              {/* CARD 2: LAB REPORT DECODER */}
              <div 
                onClick={() => setActiveModule("lab")}
                className="group bg-slate-900 border border-slate-800 hover:border-blue-500/40 p-6 md:p-8 rounded-2xl shadow-xl transition-all duration-300 cursor-pointer flex flex-col justify-between hover:shadow-blue-950/20 relative overflow-hidden text-left"
              >
                <div className="absolute top-0 right-0 w-24 h-24 bg-blue-500/5 rounded-full blur-2xl pointer-events-none group-hover:bg-blue-500/10 transition-colors" />
                <div className="space-y-4">
                  <div className="w-12 h-12 rounded-xl bg-blue-950/60 border border-blue-900/40 flex items-center justify-center text-blue-400 shadow group-hover:scale-105 transition-transform">
                    <Activity size={22} />
                  </div>
                  <div className="space-y-1.5">
                    <h3 className="text-lg md:text-xl font-sans font-bold text-slate-100 group-hover:text-blue-400 transition-colors">
                      Lab Report Decoder
                    </h3>
                    <span className="text-xs font-mono font-medium text-blue-400 block tracking-tight">
                      Upload blood test reports and understand results in simple language
                    </span>
                    <p className="text-xs text-slate-400 font-sans leading-relaxed pt-1.5">
                      Input pathology reports (or select preset checkups like Anemia or Metabolic Screen) to translate complex indicators into clean layman explanations. Features color-coded dashboards and dynamic manual inputs.
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-1.5 text-xs font-mono font-bold text-slate-400 group-hover:text-blue-400 pt-6 transition-transform group-hover:translate-x-1">
                  Launch Pathology Decoder <ChevronRight size={14} />
                </div>
              </div>

            </div>

            {/* BOTTOM ADVISORY BANNER */}
            <div className="bg-slate-950/60 p-5 rounded-xl border border-slate-850 text-xs font-sans text-slate-400 leading-relaxed text-center space-y-1 max-w-2xl mx-auto pt-4">
              <span className="font-mono text-[10px] text-slate-500 uppercase tracking-widest block font-bold">⚕️ Patient Care Standard Guidance</span>
              <p>
                Both modules are configured 100% server-less and local. No personal symptoms or lab data ever leaves your device. This platform serves educational purposes only. If you experience emergency chest pains or sudden breathing deficits, phone 112 instantly.
              </p>
            </div>
          </motion.div>
        )}

        {/* --- LAB REPORT DECODER COMPONENT SCREEN --- */}
        {activeModule === "lab" && (
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
          >
            <LabReportDecoder />
          </motion.div>
        )}

        {/* --- DOCTORFINDER NAVIGATOR SCREEN GROUP --- */}
        {activeModule === "doctor" && (
          <>
            {/* HEADER SECTION */}
            <header className="text-center py-8">
              <span className="font-mono text-xs text-blue-400 uppercase tracking-widest bg-slate-900/80 px-3 py-1.5 rounded-full border border-slate-800">
                // Medical Specialist Navigator — 100% Free
              </span>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-sans font-bold text-slate-100 tracking-tight mt-4">
                Doctor<span className="text-blue-500">Finder</span>
              </h1>
          <p className="max-w-2xl mx-auto text-sm md:text-base text-slate-400 mt-3 font-sans leading-relaxed">
            Describe your symptoms. Know exactly which specialist to see and what their medical degrees actually mean.
          </p>
          <div className="inline-block mt-4">
            <span className="bg-slate-900 text-[10px] md:text-xs font-mono text-emerald-400 px-3 py-1.5 rounded border border-emerald-950 uppercase tracking-wider">
              ✦ FREE — NO SIGN UP — NOT A DIAGNOSIS TOOL ✦
            </span>
          </div>
        </header>

        {/* MOTIVATIONAL QUOTE */}
        {quote && (
          <div className="max-w-xl mx-auto bg-slate-900/40 border border-slate-800/80 hover:border-slate-800 p-4 rounded-xl text-center shadow-sm mb-8 transition-colors">
            <p className="text-xs md:text-sm font-sans italic text-slate-400">
              "{quote}"
            </p>
          </div>
        )}

        {/* PREVIOUS SEARCHES CHIPS (Up to 5) */}
        {previousSearches.length > 0 && (
          <div className="mb-8 max-w-4xl mx-auto">
            <h3 className="text-slate-500 font-mono text-xs uppercase tracking-wider mb-3">
              🕒 Previous Searches ({previousSearches.length})
            </h3>
            <div className="flex flex-wrap gap-2">
              {previousSearches.map((item, idx) => (
                <button
                  key={idx}
                  onClick={() => handleRestoreSearch(item)}
                  className="flex items-center gap-2 bg-slate-950 hover:bg-slate-900 text-slate-300 hover:text-white px-3.5 py-2 rounded-lg border border-slate-800 hover:border-slate-700 text-xs transition duration-200 cursor-pointer text-left focus:outline-none"
                >
                  <span className="text-slate-500 font-mono text-[10px]">#{idx + 1}</span>
                  <span className="truncate max-w-[140px] font-sans font-medium">{item.symptomPreview}</span>
                  <span className="px-1.5 py-0.5 rounded bg-slate-900 text-slate-400 font-mono text-[9px] uppercase border border-slate-800">
                    {item.topSpecialistName}
                  </span>
                </button>
              ))}
              <button
                onClick={() => {
                  sessionStorage.removeItem("doctorfinder_searches");
                  setPreviousSearches([]);
                }}
                className="text-slate-500 hover:text-red-400 text-xs px-2 py-2 flex items-center font-mono hover:underline cursor-pointer transition ml-auto"
              >
                Clear list
              </button>
            </div>
          </div>
        )}

        {/* MASTER STEPS FLOW CONTAINER */}
        <form onSubmit={handleFindSpecialist} className="max-w-3xl mx-auto space-y-4">
          
          {/* STEP 1: Describe Your Symptoms */}
          <div className="bg-slate-900/95 rounded-2xl border border-slate-800 p-6 shadow-xl space-y-6 relative overflow-hidden backdrop-blur-sm">
            {/* Ambient subtle glow light */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/5 rounded-full blur-3xl pointer-events-none" />
            
            <div className="flex items-start justify-between border-b border-slate-800 pb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-blue-950 text-blue-400 flex items-center justify-center font-mono text-base font-bold border border-blue-900/40 shadow-[0_0_15px_rgba(59,130,246,0.1)]">
                  01
                </div>
                <div>
                  <span className="block text-[10px] font-mono text-blue-400 uppercase tracking-widest leading-none mb-1">
                    STEP 1
                  </span>
                  <h2 className="text-xl font-sans font-bold text-slate-100">
                    Describe Your Symptoms
                  </h2>
                </div>
              </div>
              <span className="text-[10px] font-mono text-slate-500 bg-slate-950 px-2 py-1 rounded border border-slate-850 uppercase">
                Symptom Mapper
              </span>
            </div>

            <div className="space-y-4">
              <div>
                <label htmlFor="symptoms-input" className="block text-xs font-mono text-slate-400 uppercase tracking-widest mb-2.5">
                  Describe symptoms in plain English *
                </label>
                <textarea
                  id="symptoms-input"
                  value={symptoms}
                  onChange={(e) => {
                    setSymptoms(e.target.value);
                    if (e.target.value.trim()) setErrorInput("");
                  }}
                  placeholder="Example: I have chest pain, sweating, and breathlessness for 2 days..."
                  className="w-full h-48 bg-slate-950 rounded-xl border border-slate-800 hover:border-slate-700 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 px-4 py-3 placeholder-slate-600 text-sm focus:outline-none transition-all overflow-y-auto leading-relaxed text-slate-100"
                />
                <p className="text-[11px] text-slate-500 mt-2 flex items-center gap-1">
                  <span className="text-blue-400 font-mono">✦</span> Plain English descriptions help our rules-based mapper index clinical keywords securely.
                </p>
              </div>

              {/* Error boundary alert */}
              {errorInput && (
                <div role="alert" className="bg-red-950/30 border border-red-900/50 p-3 rounded-xl text-xs text-red-400 font-sans flex items-start gap-2.5 animate-pulse">
                  <span className="text-sm">⚠️</span>
                  <span>{errorInput}</span>
                </div>
              )}

              {/* COLLAPSIBLE ACCORDION FOR CHIPS DEMO */}
              <div className="border border-slate-800/60 rounded-xl bg-slate-950/40 overflow-hidden mt-2">
                <button
                  type="button"
                  onClick={() => setIsExamplesOpen(!isExamplesOpen)}
                  className="w-full text-left px-4 py-3 flex items-center justify-between hover:bg-slate-950/80 transition cursor-pointer focus:outline-none"
                >
                  <div className="flex items-center gap-2">
                    <Sparkles size={13} className="text-blue-400" />
                    <span className="font-mono text-xs uppercase tracking-wider text-slate-400 hover:text-white transition">
                      💡 Try Example Symptoms (Clinical Templates)
                    </span>
                  </div>
                  <span className="text-slate-500">
                    {isExamplesOpen ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                  </span>
                </button>

                {isExamplesOpen && (
                  <div className="p-3 border-t border-slate-850 bg-slate-950/70 space-y-2">
                    <p className="text-[10px] text-slate-500 font-mono uppercase tracking-wide">
                      Select a clinic query template to auto-populate the triage form:
                    </p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {PRESET_TEMPLATES.map((tpl, i) => (
                        <button
                          key={i}
                          type="button"
                          onClick={() => {
                            handleApplyTemplate(tpl);
                            setIsExamplesOpen(false); // tidy collapse after selecting
                          }}
                          className="bg-slate-900/60 hover:bg-slate-900 border border-slate-850 hover:border-slate-700 text-left p-2.5 rounded-lg text-xs leading-relaxed transition flex flex-col justify-between cursor-pointer focus:outline-none h-[72px]"
                        >
                          <div className="flex items-center justify-between w-full">
                            <span className="font-semibold text-slate-200 truncate pr-2">{tpl.title}</span>
                            <span className="text-[9px] font-mono text-blue-400 bg-blue-950/40 px-1 py-0.2 rounded shrink-0">{tpl.severity.split(" ")[0]}</span>
                          </div>
                          <p className="text-slate-400 line-clamp-2 text-[10px] mt-1 pr-1">{tpl.text}</p>
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* CONNECTING STEP VECTOR LINES */}
          <div className="flex flex-col items-center">
            <div className="w-0.5 h-6 bg-gradient-to-b from-blue-500/60 to-emerald-500/60 rounded-full" />
          </div>

          {/* STEP 2: Quick Patient Details */}
          <div className="bg-slate-900/95 rounded-2xl border border-slate-800 p-6 shadow-xl space-y-6 relative overflow-hidden backdrop-blur-sm">
            <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/5 rounded-full blur-3xl pointer-events-none" />
            
            <div className="flex items-start justify-between border-b border-slate-800 pb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-950 text-emerald-400 flex items-center justify-center font-mono text-base font-bold border border-emerald-900/40 shadow-[0_0_15px_rgba(16,185,129,0.1)]">
                  02
                </div>
                <div>
                  <span className="block text-[10px] font-mono text-emerald-400 uppercase tracking-widest leading-none mb-1">
                    STEP 2
                  </span>
                  <h2 className="text-xl font-sans font-bold text-slate-100">
                    Quick Patient Details
                  </h2>
                </div>
              </div>
              <span className="text-[10px] font-mono text-slate-500 bg-slate-950 px-2 py-1 rounded border border-slate-850 uppercase">
                Patient Context
              </span>
            </div>

            {/* HELPER SUBTITLE */}
            <div className="space-y-4">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-2 bg-slate-950/80 p-3 rounded-xl border border-slate-850/60">
                <div>
                  <p className="text-xs text-slate-300 font-medium">
                    Help us improve specialist matching accuracy
                  </p>
                  <p className="text-[10px] text-slate-500 font-mono mt-0.5 uppercase tracking-wider">
                    Demographics and timelines scale match ranks
                  </p>
                </div>
                <div className="text-xs font-mono text-slate-400 bg-slate-900 px-2.5 py-1 rounded border border-slate-800">
                  ⚡ Static Guidance Engine
                </div>
              </div>

              {/* ACCURACY EXPLANATION CARD */}
              <div className="bg-blue-950/10 border border-blue-900/20 p-3.5 rounded-xl text-xs text-blue-300 font-sans flex items-start gap-2.5">
                <Shield size={16} className="text-blue-400 shrink-0 mt-0.5" />
                <p className="leading-relaxed">
                  <strong>Diagnostic context:</strong> Symptoms can mean different conditions depending on age, severity, and duration.
                </p>
              </div>

              <div className="space-y-5 pt-2">
                
                {/* Age Group selects (Interactive pill chips) */}
                <div>
                  <label className="block text-xs font-mono text-slate-400 uppercase tracking-widest mb-2.5">
                    Age Group
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    {["Child (0–12)", "Teen (13–17)", "Adult (18–60)", "Senior (60+)"].map((val) => {
                      const isSelected = ageGroup === val;
                      return (
                        <button
                          type="button"
                          key={val}
                          onClick={() => setAgeGroup(val)}
                          className={`py-2 px-3 text-xs font-mono rounded-lg border text-center transition cursor-pointer focus:outline-none ${
                            isSelected
                              ? "bg-blue-600/20 text-blue-400 border-blue-500 shadow-md shadow-blue-950/50 cursor-pointer"
                              : "bg-slate-950 text-slate-400 border-slate-850 hover:border-slate-800 hover:text-slate-300 cursor-pointer"
                          }`}
                        >
                          {val}
                        </button>
                      );
                    })}
                  </div>
                  <p className="text-[10px] text-slate-500 font-mono mt-1.5 pl-0.5">
                    {ageGroup === "Child (0–12)" ? "🧒 Child criteria routes pediatric priorities" :
                     ageGroup === "Senior (60+)" ? "🧓 Senior citizen pathways evaluate prescription risks" : 
                     "👥 Regular outpatient demographics are applied"}
                  </p>
                </div>

                {/* Assigned Sex Selects (Segmented Control style) */}
                <div>
                  <label className="block text-xs font-mono text-slate-400 uppercase tracking-widest mb-2.5 font-sans font-medium text-slate-400">
                    Assigned Sex
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {["Male", "Female", "Prefer not to say"].map((val) => {
                      const isSelected = sex === val;
                      return (
                        <button
                          type="button"
                          key={val}
                          onClick={() => setSex(val)}
                          className={`py-2 px-1 text-xs font-mono rounded-lg border text-center transition cursor-pointer focus:outline-none truncate ${
                            isSelected
                              ? "bg-emerald-600/20 text-emerald-400 border-emerald-500 shadow-md shadow-emerald-950/50"
                              : "bg-slate-950 text-slate-400 border-slate-850 hover:border-slate-800 hover:text-slate-300"
                          }`}
                        >
                          {val}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Duration of Symptoms (Pill chips selector instead of dropdown select) */}
                <div>
                  <label className="block text-xs font-mono text-slate-400 uppercase tracking-widest mb-2.5 font-sans font-medium text-slate-400">
                    Duration of Symptoms
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {["Started today", "2–7 days", "1–4 weeks", "More than a month", "Recurring"].map((val) => {
                      const isSelected = duration === val;
                      return (
                        <button
                          type="button"
                          key={val}
                          onClick={() => setDuration(val)}
                          className={`px-3 py-2 text-xs font-sans rounded-xl border text-center transition cursor-pointer focus:outline-none ${
                            isSelected
                              ? "bg-slate-800 text-slate-100 border-blue-500 font-semibold"
                              : "bg-slate-950 text-slate-400 border-slate-850 hover:border-slate-800"
                          }`}
                        >
                          {val}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Severity level (Custom large interactive selector card) */}
                <div>
                  <label className="block text-xs font-mono text-slate-400 uppercase tracking-widest mb-2.5 font-sans font-medium text-slate-400">
                    Severity Level
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    {[
                      { value: "Mild — annoying but manageable", label: "Mild", desc: "Annoying but manageable", border: "border-emerald-950 hover:border-emerald-800", selectedClass: "bg-emerald-950/25 border-emerald-600/80 text-emerald-300", lightDot: "bg-emerald-500" },
                      { value: "Moderate — affecting daily life", label: "Moderate", desc: "Affecting daily routine", border: "border-amber-950 hover:border-amber-800", selectedClass: "bg-amber-950/25 border-amber-600/80 text-amber-300", lightDot: "bg-amber-500" },
                      { value: "Severe — very painful or worrying", label: "Severe", desc: "Extreme pain or worried", border: "border-red-950 hover:border-red-800", selectedClass: "bg-red-950/25 border-red-600/80 text-red-300", lightDot: "bg-red-500 animate-pulse" }
                    ].map((item) => {
                      const isSelected = severity === item.value;
                      return (
                        <button
                          type="button"
                          key={item.value}
                          onClick={() => setSeverity(item.value)}
                          className={`p-3 rounded-xl border text-left transition cursor-pointer focus:outline-none flex items-center justify-between gap-2 min-h-[58px] ${
                            isSelected ? item.selectedClass : `bg-slate-950 text-slate-400 ${item.border}`
                          }`}
                        >
                          <div>
                            <span className="block text-xs font-bold uppercase tracking-wider">{item.label}</span>
                            <span className="block text-[10px] text-slate-500 mt-0.5 leading-none">{item.desc}</span>
                          </div>
                          <span className={`w-2 h-2 rounded-full ${item.lightDot} shrink-0`} />
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Existing Medical Conditions */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="block text-xs font-mono text-slate-400 uppercase tracking-widest font-sans font-medium text-slate-400">
                      Existing Medical Conditions (Optional)
                    </label>
                    <span className="text-[10px] font-mono text-slate-500">
                      Comma separated
                    </span>
                  </div>
                  <input
                    type="text"
                    value={conditions}
                    onChange={(e) => setConditions(e.target.value)}
                    placeholder="e.g. diabetes, hypertension, thyroid, asthma..."
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl py-2.5 px-3.5 text-xs font-sans text-slate-300 placeholder-slate-600 focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all"
                  />
                  
                  {/* QUICK ADD EXAMPLES TAGS */}
                  <div className="flex flex-wrap gap-1.5 mt-2.5">
                    {["None", "Diabetes", "Hypertension", "Thyroid", "Asthma", "Heart Condition"].map((tag) => {
                      const isSelected = tag === "None" ? !conditions : conditions.toLowerCase().includes(tag.toLowerCase());
                      return (
                        <button
                          type="button"
                          key={tag}
                          onClick={() => handleToggleCondition(tag)}
                          className={`px-2.5 py-1 rounded-full text-[10px] font-mono border transition select-none cursor-pointer ${
                            isSelected
                              ? "bg-blue-600/15 text-blue-300 border-blue-500"
                              : "bg-slate-950 text-slate-500 border-slate-850 hover:border-slate-800 hover:text-slate-300"
                          }`}
                        >
                          {tag === "None" ? "✗ Clear" : `+ ${tag}`}
                        </button>
                      );
                    })}
                  </div>
                </div>

              </div>
            </div>
          </div>

          {/* CONNECTING STEP VECTOR LINES */}
          <div className="flex flex-col items-center">
            <div className="w-0.5 h-6 bg-gradient-to-b from-emerald-500/40 to-blue-500 rounded-full" />
          </div>

          {/* STEP 3: Get Specialist Recommendation & CTA AREA (Sticky on Mobile) */}
          <div className="sticky bottom-4 md:relative md:bottom-auto z-30 max-w-3xl w-full mx-auto">
            <div className="bg-slate-900/95 md:bg-slate-900/90 rounded-2xl border border-blue-900/40 p-5 md:p-6 shadow-2xl relative overflow-hidden backdrop-blur-md">
              <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/5 rounded-full blur-3xl pointer-events-none" />
              
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="flex items-center gap-3 self-start sm:self-auto">
                  <div className="w-9 h-9 rounded-xl bg-blue-950 text-blue-400 flex items-center justify-center font-mono text-sm font-bold border border-blue-900/40">
                    03
                  </div>
                  <div>
                    <span className="block text-[9px] font-mono text-blue-400 uppercase tracking-widest leading-none mb-1 font-sans font-medium text-blue-400">
                      STEP 3
                    </span>
                    <h3 className="text-sm font-sans font-bold text-slate-100">
                      Get Specialist Recommendation
                    </h3>
                  </div>
                </div>

                <div className="w-full sm:w-auto shrink-0">
                  <button
                    type="submit"
                    disabled={isLoading}
                    className={`w-full sm:w-64 py-3.5 px-6 rounded-xl font-mono text-xs uppercase tracking-widest font-bold flex items-center justify-center gap-2 transition duration-300 cursor-pointer select-none border shadow-lg ${
                      isLoading
                        ? "bg-slate-800 text-slate-500 border-slate-700 cursor-not-allowed"
                        : "bg-blue-600 hover:bg-blue-500 text-white border-blue-500 shadow-blue-500/10 hover:shadow-blue-500/20 active:translate-y-px hover:scale-[1.01]"
                    }`}
                  >
                    {isLoading ? (
                      <>
                        <LoaderIcon />
                        Processing...
                      </>
                    ) : (
                      <>
                        <Stethoscope size={14} className="text-white shrink-0 animate-pulse" />
                        Find My Specialist
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>

        </form>

        {/* 🚨 PULSING EMERGENCY OVERLAY MODAL */}
        <AnimatePresence>
          {isEmergencyModalOpen && (
            <div className="fixed inset-0 bg-black/85 flex items-center justify-center p-4 z-50 overflow-y-auto">
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="pulse-danger-card max-w-lg w-full bg-slate-950 rounded-2xl border-2 border-red-500/80 p-6 md:p-8 space-y-6 shadow-2xl relative"
                role="dialog"
                aria-modal="true"
              >
                <div className="flex items-center gap-3 text-red-500">
                  <span className="text-3xl md:text-4xl animate-bounce">🚨</span>
                  <h3 className="text-xl md:text-2xl font-sans font-bold uppercase tracking-tight">
                    EMERGENCY SYMPTOMS DETECTED
                  </h3>
                </div>

                <div className="space-y-4 text-slate-300 text-sm leading-relaxed border-y border-red-950/50 py-4">
                  <p className="font-semibold text-red-400 text-base">
                    Your described symptoms may indicate a life-threatening emergency needing immediate clinical intervention.
                  </p>
                  <ul className="space-y-2 text-xs md:text-sm font-sans list-disc pl-5 text-slate-300">
                    <li><strong className="text-white">Call 112</strong> immediately to schedule paramedics.</li>
                    <li>Go to the <strong className="text-white">nearest emergency room</strong> or medical center.</li>
                    <li>Do <strong>NOT</strong> wait for an outpatient appointment slot. Every minute matters.</li>
                  </ul>
                </div>

                <div className="flex flex-col sm:flex-row gap-3 pt-2">
                  <a
                    href="tel:112"
                    className="flex-1 bg-red-600 hover:bg-red-500 text-white py-3.5 px-4 rounded-xl text-center font-mono font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 border border-red-500 transition duration-150"
                  >
                    <PhoneCall size={14} />
                    📞 Call 112 NOW
                  </a>
                  <button
                    onClick={handleBypassEmergency}
                    className="flex-1 bg-slate-900 hover:bg-slate-850 text-slate-400 hover:text-white py-3.5 px-4 rounded-xl text-center font-mono text-xs uppercase tracking-wider border border-slate-850 transition duration-150 cursor-pointer focus:outline-none"
                  >
                    My symptoms are safe — continue
                  </button>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>

        {/* --- ROTATING LOADING ANIMATOR PANEL --- */}
        <AnimatePresence>
          {isLoading && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="my-10 max-w-2xl mx-auto bg-slate-900 border border-slate-800 p-8 rounded-2xl shadow-lg flex flex-col items-center justify-center space-y-4 min-h-[180px]"
            >
              <div className="relative w-12 h-12 flex items-center justify-center">
                <div className="absolute inset-0 border-4 border-slate-950 rounded-full"></div>
                <div className="absolute inset-0 border-4 border-blue-500 rounded-full border-t-transparent animate-spin"></div>
              </div>
              <p className="font-mono text-xs uppercase tracking-widest text-slate-500">
                Local Analysis Active
              </p>
              <AnimatePresence mode="popLayout">
                <motion.span
                  key={loadingStep}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="font-sans text-base font-medium text-blue-400"
                >
                  {loadingStepsTexts[loadingStep]}
                </motion.span>
              </AnimatePresence>
            </motion.div>
          )}
        </AnimatePresence>

        {/* --- MATCHED SCHEMAS AND RESULTS UI --- */}
        <div ref={resultsRef} className="scroll-mt-14">
          <AnimatePresence>
            {result && !isLoading && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="max-w-4xl mx-auto my-12 space-y-8"
              >
                {/* CLINICAL REPORT HEADER ACCENT */}
                <div className="bg-gradient-to-r from-blue-600/20 via-slate-900 to-emerald-500/10 p-6 rounded-2xl border border-slate-800 shadow-xl relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-44 h-44 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="space-y-1.5 animate-fade-in text-left">
                      <div className="flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                        <span className="font-mono text-xs text-blue-400 uppercase tracking-widest font-semibold font-sans font-medium">
                          PROVISIONAL OUTPATIENT REPORT
                        </span>
                      </div>
                      <h3 className="text-2xl font-sans font-extrabold text-slate-100 tracking-tight">
                        Clinical Navigation Summary
                      </h3>
                      <p className="text-xs text-slate-400 max-w-xl leading-relaxed">
                        Evaluated against static residency criteria. Review this structured lookup to match appropriate consultant degrees and prepare your diagnostic profile.
                      </p>
                    </div>

                    <div className="bg-slate-950/95 px-4 py-3.5 rounded-xl border border-slate-800 text-left shrink-0 min-w-[200px] space-y-1">
                      <span className="text-[9px] font-mono text-slate-500 uppercase block tracking-wider font-bold">
                        Patient Intake Parameters
                      </span>
                      <div className="text-[11px] font-sans text-slate-300 space-y-0.5">
                        <div className="flex justify-between gap-4"><span className="text-slate-500">Demographic:</span> <span className="font-semibold text-slate-200">{ageGroup}</span></div>
                        <div className="flex justify-between gap-4"><span className="text-slate-500">Assigned Sex:</span> <span className="font-semibold text-slate-200">{sex}</span></div>
                        <div className="flex justify-between gap-4"><span className="text-slate-500">Duration:</span> <span className="font-semibold text-slate-200">{duration}</span></div>
                        <div className="flex justify-between gap-4"><span className="text-slate-500">Conditions:</span> <span className="font-semibold text-blue-400 truncate max-w-[90px]">{conditions || "None declared"}</span></div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* DETECTED CLINICAL KEYWORD CHIPS */}
                {result.symptoms_matched && result.symptoms_matched.length > 0 && (
                  <div className="bg-slate-900/80 rounded-2xl border border-slate-800 p-5 shadow-lg space-y-3 text-left">
                    <div className="flex items-center gap-2 text-slate-400">
                      <Search size={14} className="text-blue-400" />
                      <span className="text-[10px] font-mono uppercase tracking-widest font-bold">
                        Identified Clinical Indicators Detected ({result.symptoms_matched.length})
                      </span>
                    </div>
                    <div className="flex flex-wrap gap-2 text-left">
                      {result.symptoms_matched.map((term, i) => (
                        <span
                          key={i}
                          className="px-3 py-1 bg-slate-950 text-slate-200 border border-slate-800 hover:border-slate-700 hover:text-white rounded-lg text-xs font-sans flex items-center gap-1.5 transition select-none"
                        >
                          <span className="w-1.5 h-1.5 rounded-full bg-blue-500" />
                          {term}
                        </span>
                      ))}
                    </div>
                    <p className="text-[10px] text-slate-500 leading-relaxed text-left">
                      Our static rule-based system matched these parsed symptom blocks against Indian outpatient residency standards index criteria.
                    </p>
                  </div>
                )}

                {/* CARD 1 — URGENCY ASSIGNATION */}
                <div 
                  className={`bg-slate-900 rounded-2xl border border-slate-800 p-6 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-5 relative overflow-hidden border-l-[6px] ${
                    result.urgency_color === "red" ? "border-l-red-500" :
                    result.urgency_color === "amber" ? "border-l-amber-500" : "border-l-emerald-500"
                  }`}
                >
                  <div className="space-y-2.5 text-left">
                    <span className="block font-mono text-[10px] text-slate-500 uppercase tracking-widest font-bold">
                      Urgency Evaluation
                    </span>
                    <div className="flex items-center gap-2">
                      <span className={`text-[11px] font-mono uppercase tracking-wider font-bold px-3 py-1 rounded-full border ${
                        result.urgency_color === "red" ? "bg-red-950/60 text-red-400 border-red-500/30 text-red-450" :
                        result.urgency_color === "amber" ? "bg-amber-950/60 text-amber-400 border-amber-500/30 text-amber-450" :
                        "bg-emerald-950/60 text-emerald-400 border-emerald-500/30 text-emerald-450"
                      }`}>
                        {result.urgency_color === "red" ? "🔴 Urgent triage — Seek same day evaluation" :
                         result.urgency_color === "amber" ? "🟡 Intermediate priority — Schedule soon" :
                         "🟢 Routine study — Book within standard outpatient cycle"}
                      </span>
                    </div>
                    <p className="text-slate-200 text-sm font-sans leading-relaxed">
                      {result.urgency_reason}
                    </p>
                  </div>
                  <div className="bg-slate-950 border border-slate-800 p-4 rounded-xl md:max-w-[220px] text-left shrink-0">
                    <div className="flex items-center gap-1.5 text-slate-500 uppercase font-mono text-[9px] font-bold tracking-wider mb-1.5">
                      <ShieldAlert size={12} className="text-amber-500 shrink-0" />
                      Validation Guard
                    </div>
                    <span className="text-[11px] text-slate-400 font-sans block leading-relaxed">
                      Recommendations target standard outpatient profiles only. Track structural developments closely.
                    </span>
                  </div>
                </div>

                {/* CARD 2 — GP ENTRY FIRST (CONDITIONAL) */}
                {result.see_gp_first && (
                  <div className="bg-emerald-950/15 rounded-2xl border border-emerald-800/40 p-6 shadow-lg flex items-start gap-4 hover:border-emerald-800/60 transition-colors">
                    <div className="bg-emerald-950 border border-emerald-800/60 p-3 rounded-xl text-emerald-400 mt-0.5 shrink-0 shadow-md">
                      <Stethoscope size={22} className="animate-pulse" />
                    </div>
                    <div className="space-y-2 leading-relaxed text-left">
                      <h4 className="text-base font-sans font-bold text-emerald-300 flex items-center gap-2">
                        ⚖️ Initial General Physician Assessment Recommended
                      </h4>
                      <p className="text-xs md:text-sm text-slate-300 leading-relaxed font-sans">
                        {result.gp_reason}
                      </p>
                      <div className="bg-slate-950/40 border border-emerald-900/20 p-3 rounded-lg text-xs leading-relaxed text-slate-500">
                        <strong>Clinical Gating Model:</strong> MBBS General Physicians run physical screenings, manage basic pharmacological dosing coordinates, handle laboratory matches, and issue references.
                      </div>
                    </div>
                  </div>
                )}

                {/* CARD 3 — INDIVIDUAL SPECIALISTS LISTINGS */}
                <div className="space-y-6 text-left animate-fade-in">
                  <div className="flex items-center justify-between border-b border-slate-850 pb-2 pl-1">
                    <h3 className="text-slate-400 font-mono text-xs uppercase tracking-widest font-bold flex items-center gap-2">
                      🎯 Recommended Specialist Matches ({result.specialists.length})
                    </h3>
                    <span className="text-[10px] text-slate-500 font-mono">Ranked by Clinical Probability</span>
                  </div>

                  {result.specialists.map((spec) => (
                    <div 
                      key={spec.rank}
                      className="bg-slate-900 rounded-2xl border border-slate-800 hover:border-slate-750 p-6 md:p-8 shadow-xl transition-all space-y-6 relative overflow-hidden"
                    >
                      {/* Decorative backing rank layout */}
                      <span className="absolute -bottom-10 -right-4 font-mono text-[140px] font-extrabold text-slate-950/20 leading-none select-none pointer-events-none">
                        {spec.rank}
                      </span>

                      {/* Badge / Header row */}
                      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 border-b border-slate-850 pb-4">
                        <div className="flex items-center gap-3">
                          <span className="text-3xl md:text-4xl bg-slate-950 p-2 rounded-2xl border border-slate-800">{spec.icon}</span>
                          <div>
                            <span className="text-[9px] font-mono text-blue-400 uppercase tracking-widest block font-bold font-mono">
                              {spec.rank === 1 ? "⭐ Recommended Primary Match" : `Alternative Referral Strategy #${spec.rank}`}
                            </span>
                            <h4 className="text-xl font-sans font-bold text-slate-100 flex items-center gap-1.5 mt-0.5">
                              {spec.name}
                            </h4>
                          </div>
                        </div>

                        <div className="flex flex-wrap gap-1.5">
                          <span className="px-2.5 py-1 rounded-lg bg-slate-950 text-blue-400 font-mono text-[10px] uppercase border border-slate-800 font-bold">
                            {spec.degree_plain}
                          </span>
                          <span className={`px-2.5 py-1 rounded-lg font-mono text-[10px] uppercase border font-semibold ${
                            spec.tier === "Super Specialist" ? "bg-purple-950/60 text-purple-400 border-purple-900" :
                            spec.tier === "Specialist" ? "bg-indigo-950/60 text-indigo-400 border-indigo-900" :
                            spec.tier === "Dental" ? "bg-amber-950/60 text-amber-400 border-amber-900" :
                            "bg-teal-950/60 text-teal-400 border-teal-900"
                          }`}>
                            {spec.tier}
                          </span>
                        </div>
                      </div>

                      {/* WHY SECTION */}
                      <div className="space-y-1">
                        <span className="text-[10px] font-mono text-slate-500 uppercase tracking-widest block font-bold">
                          Primary Indication for Match
                        </span>
                        <p className="text-sm text-slate-200 font-sans leading-relaxed">
                          {spec.why}
                        </p>
                      </div>

                      {/* THE MEDICAL DEGREE INFO BOX */}
                      <div className="bg-slate-950 rounded-xl p-4 md:p-5 border border-blue-900/30 grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
                        <div className="md:col-span-8 space-y-2">
                          <span className="text-[10px] font-mono text-blue-400 uppercase tracking-widest block font-bold">
                            Credentials & Professional Training Path
                          </span>
                          <div className="font-mono text-xs text-indigo-300 bg-slate-950 py-2 px-3.5 rounded-lg border border-slate-850 leading-relaxed overflow-x-auto whitespace-normal">
                            {spec.degree_needed}
                          </div>
                          <p className="text-slate-500 text-[11px] font-sans text-slate-400 font-normal">
                            {spec.name}s complete long residency milestones and board exams governed by standard medical commissions.
                          </p>
                        </div>
                        <div className="md:col-span-4 rounded-xl bg-slate-900/80 border border-slate-850 p-4 text-center">
                          <span className="text-[10px] font-mono text-slate-500 block uppercase mb-1">Required Specialization</span>
                          <span className="text-slate-100 text-lg font-sans font-extrabold block">{spec.years_training}</span>
                          <span className="text-slate-500 text-[10px] font-sans block mt-0.5 font-normal">Post-MBBS Dedicated Study</span>
                        </div>
                      </div>

                      {/* WHAT TO EXPECT / WHY VISIT BLOCK */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-1">
                        <div className="bg-slate-950/40 rounded-xl p-4 border border-slate-850 space-y-1.5 hover:border-slate-800 transition-all">
                          <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider block font-bold">Clinic Diagnostic Scope</span>
                          <p className="text-xs text-slate-300 font-sans leading-relaxed">{spec.what_they_do}</p>
                        </div>
                        <div className="bg-slate-950/40 rounded-xl p-4 border border-blue-950/20 space-y-1.5 hover:border-blue-900/30 transition-all font-sans">
                          <span className="text-[10px] font-mono text-blue-400 block font-bold uppercase tracking-wider">💬 Proactive Query to ask:</span>
                          <p className="text-xs text-blue-200 italic leading-relaxed font-bold">"{spec.key_question}"</p>
                        </div>
                      </div>

                      {/* EMBEDDED DANGER ALERTS */}
                      <div className="bg-red-950/20 border border-red-900/30 p-4 rounded-xl space-y-2 text-xs">
                        <div className="flex items-center gap-1.5 text-red-400 font-mono text-[10px] uppercase font-bold tracking-wider">
                          <ShieldAlert size={14} className="shrink-0 text-red-500" />
                          Recommended Red-Flag Self-Screening Indicators
                        </div>
                        <p className="text-slate-300 leading-relaxed font-sans text-xs">
                          Report directly to emergency casualty facilities if symptoms deteriorate, including: <strong className="text-red-350 text-red-300">{spec.red_flags}</strong>.
                        </p>
                      </div>

                    </div>
                  ))}
                </div>

                {/* THE VISUAL VISIT PLANNER CHECKLIST & CLINIC GUIDE */}
                <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4 text-left">
                  <div className="flex items-center gap-2.5 border-b border-slate-850 pb-3">
                    <CheckSquare size={18} className="text-blue-400" />
                    <h3 className="text-base font-sans font-bold text-slate-100">
                      🩺 Outpatient Appointment Preparation Checklist
                    </h3>
                  </div>
                  <p className="text-xs text-slate-400 leading-relaxed font-sans">
                    Consulting matches in busy clinics and wards is more effective when you organize symptom logs beforehand. Check off items to map your consult profile:
                  </p>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-1">
                    {[
                      { title: "Chronological Timeline", text: "Map exact hour markers, triggers, and previous pain logs for the consultant." },
                      { title: "Physical Pill Strips", text: "Bring current over-the-counter medicine scripts, diabetes parameters, or thyroid pills." },
                      { title: "Home Readings", text: "Note down your last 3 home-monitored blood sugar levels or blood pressure numbers." },
                      { title: "Degree Verification", text: "Check that the consultant OPD board has MD/MS or DM/MCh qualifications matching this report." }
                    ].map((item, idx) => (
                      <div key={idx} className="flex gap-3 p-3 rounded-xl bg-slate-950/50 border border-slate-850">
                        <input 
                          type="checkbox" 
                          id={`prep-checklist-${idx}`}
                          className="mt-0.5 rounded border-slate-800 text-blue-500 bg-slate-950 focus:ring-0 w-4 h-4 shrink-0 transition"
                        />
                        <div>
                          <label htmlFor={`prep-checklist-${idx}`} className="text-xs font-semibold text-slate-200 block cursor-pointer select-none">
                            {item.title}
                          </label>
                          <span className="text-[10px] text-slate-500 leading-tight block mt-0.5">
                            {item.text}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* CARD 4 — LIFESTYLE TIPS */}
                <div className="bg-slate-900/95 rounded-2xl border border-teal-900/30 p-5 md:p-6 shadow-xl flex items-start gap-4 hover:border-teal-900/50 transition-colors text-left">
                  <span className="text-3xl bg-slate-950 p-2 rounded-xl border border-teal-950 shrink-0">🌱</span>
                  <div className="space-y-1 bg-transparent">
                    <span className="text-[10px] font-mono text-emerald-400 uppercase tracking-widest block font-bold">
                      Patient Support Advisory Information
                    </span>
                    <h4 className="text-sm font-sans font-bold text-slate-200">
                      Supportive guidance while you arrange clinical appointments
                    </h4>
                    <p className="text-xs md:text-sm text-slate-300 font-sans leading-relaxed">
                      {result.lifestyle_tip}
                    </p>
                  </div>
                </div>

                {/* CARD 5 — COLLAPSIBLE DEGREE EXPLAINER */}
                <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl text-left">
                  <button
                    type="button"
                    onClick={() => setIsDegreeExplainerOpen(!isDegreeExplainerOpen)}
                    className="w-full text-left px-6 py-4 flex items-center justify-between bg-slate-950 border-b border-slate-850 hover:bg-slate-900/80 transition cursor-pointer focus:outline-none"
                  >
                    <div className="flex items-center gap-2">
                      <BookOpen className="text-blue-400" size={18} />
                      <span className="font-sans font-bold text-slate-200 text-sm">
                        📚 Qualification Breakdown: What do Indian Medical Degrees Mean?
                      </span>
                    </div>
                    {isDegreeExplainerOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                  </button>

                  {isDegreeExplainerOpen && (
                    <div className="p-6 space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        
                        <div className="bg-slate-950 p-4 rounded-xl border border-slate-850 space-y-2 hover:border-slate-800 transition">
                          <div className="flex items-center justify-between border-b border-slate-900 pb-1.5">
                            <span className="font-mono text-xs text-blue-400 font-bold">Foundation (6.5 yrs)</span>
                            <span className="text-emerald-400 text-[10px] bg-emerald-950 px-1.5 py-0.5 rounded font-mono">MBBS</span>
                          </div>
                          <p className="text-xs text-slate-350 font-sans leading-relaxed">
                            <strong>General Physician:</strong> Earns Bachelor of Medicine & Surgery. Qualified for primary clinical treatments, basic screening diagnostics, minor procedures, and outpatient coordination.
                          </p>
                        </div>

                        <div className="bg-slate-950 p-4 rounded-xl border border-slate-850 space-y-2 hover:border-slate-800 transition">
                          <div className="flex items-center justify-between border-b border-slate-900 pb-1.5">
                            <span className="font-mono text-xs text-indigo-400 font-bold">Specialist (~10 yrs)</span>
                            <span className="text-indigo-400 text-[10px] bg-indigo-950 px-1.5 py-0.5 rounded font-mono font-bold">MD / MS</span>
                          </div>
                          <p className="text-xs text-slate-355 font-sans leading-relaxed text-slate-300">
                            <strong>Specialist Doctor:</strong> MD (Medicine) or MS (Surgery). Undergoes 3+ years post-MBBS residency targeting systemic conditions like dermatology, pulmonology, pediatric medicine, or orthopaedics.
                          </p>
                        </div>

                        <div className="bg-slate-950 p-4 rounded-xl border border-slate-850 space-y-2 hover:border-slate-800 transition">
                          <div className="flex items-center justify-between border-b border-slate-900 pb-1.5">
                            <span className="font-mono text-xs text-purple-400 font-bold">Super Specialty (~13 yrs)</span>
                            <span className="text-purple-400 text-[10px] bg-purple-950 px-1.5 py-0.5 rounded font-mono font-bold">DM / MCh</span>
                          </div>
                          <p className="text-xs text-slate-355 font-sans leading-relaxed text-slate-300">
                            <strong>Super Specialist:</strong> DM/MCh. Years of advanced post-MD/MS clinical training focusing on highly complex organ pathways (e.g. Cardiologists, Neurosurgeons).
                          </p>
                        </div>

                      </div>

                      <div className="bg-slate-950/85 p-4 rounded-xl border border-slate-850 space-y-2 text-left">
                        <span className="text-[10px] font-mono text-slate-500 uppercase tracking-widest block font-bold">Practical Outpatient Rule of Thumb</span>
                        <p className="text-xs text-slate-400 font-sans leading-relaxed">
                          For basic or generalized conditions, consult an <strong>MBBS first contact physician</strong> first. If symptoms align with organs or chronic issues (such as skin rashes or bone pain), consult an <strong>MD/MS Specialist</strong>. Directly consult <strong>DM or MCh Super-Specialists</strong> for extreme localized dysfunction or chronic organ concerns.
                        </p>
                      </div>
                    </div>
                  )}
                </div>

                {/* COPY SUMMARY ACTIONS */}
                <div className="flex flex-col sm:flex-row gap-4 pt-4 border-t border-slate-800 justify-between items-center bg-transparent">
                  <div className="flex flex-wrap gap-2.5">
                    <button
                      type="button"
                      onClick={handleCopySummary}
                      className="flex items-center gap-2 bg-slate-950 hover:bg-slate-900 hover:text-white text-slate-300 px-4 py-3 rounded-xl border border-slate-800 text-xs font-mono font-medium transition duration-150 cursor-pointer focus:outline-none"
                    >
                      {copied ? (
                        <>
                          <Check size={14} className="text-emerald-400" />
                          ✓ Copied summary!
                        </>
                      ) : (
                        <>
                          <Copy size={14} />
                          📋 Copy Result Slip
                        </>
                      )}
                    </button>
                    
                    <button
                      type="button"
                      onClick={() => window.print()}
                      className="flex items-center gap-2 bg-slate-950 hover:bg-slate-900 hover:text-white text-slate-300 px-4 py-3 rounded-xl border border-slate-800 text-xs font-mono font-medium transition duration-150 cursor-pointer focus:outline-none"
                    >
                      <Printer size={14} />
                      🖨️ Print Clinical Slip
                    </button>
                  </div>

                  <div className="text-[11px] font-sans text-slate-500 text-center sm:text-right">
                    ✨ Evaluated inside private browser sandbox storage.
                  </div>
                </div>

              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </>
      )}

      </div>

      {/* --- SITE FOOTER --- */}
      <footer className="w-full max-w-7xl mx-auto px-4 mt-12 pt-8 border-t border-slate-900 text-center space-y-2">
        <p className="text-xs text-slate-500 font-sans leading-relaxed">
          Designed & Built by <span className="text-slate-400 font-bold">Bhavesh Sharma ✨</span> — DoctorFinder — 100% Free Forever
        </p>
        <p className="text-[10px] text-slate-600 font-mono tracking-wide max-w-3xl mx-auto">
          ⚕️ Disclaimer: This static medical helper generates general outpatient guidance coordinates through rules-based lookup mapping. It does NOT provide formal clinic diagnosis, prescription medicine dosages, or triage emergencies. Always check concerns with a registered doctor. Emergency: 112
        </p>
      </footer>

    </div>
  );
}

// Icon fallbacks inside the bundle
function LoaderIcon() {
  return (
    <svg className="animate-spin h-4 w-4 text-blue-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
    </svg>
  );
}
