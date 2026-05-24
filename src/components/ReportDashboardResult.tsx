import React from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  Search, 
  ChevronDown, 
  ChevronUp, 
  Calendar, 
  Sparkles, 
  AlertCircle, 
  Check, 
  Copy, 
  Printer 
} from "lucide-react";
export interface AnalysisDetail {
  id: string;
  name: string;
  value: number;
  unit: string;
  min: number;
  max: number;
  status: string;
  statusColor: "red" | "amber" | "green";
  explanation: string;
  meaning: string;
  specialist: string;
  specialistReason: string;
  degreeNeeded: string;
  urgency: string;
}
import { BIOMARKERS_DATABASE, CATEGORY_MESSAGES } from "../data/labReportData";

interface ReportDashboardResultProps {
  results: AnalysisDetail[];
  criticalItems: AnalysisDetail[];
  concernedItems: AnalysisDetail[];
  overallUrgency: string;
  overallColor: string;
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  filterMode: "all" | "abnormal" | "normal" | "critical";
  setFilterMode: (mode: "all" | "abnormal" | "normal" | "critical") => void;
  expandedCategories: Record<string, boolean>;
  setExpandedCategories: React.Dispatch<React.SetStateAction<Record<string, boolean>>>;
  handleValueChange: (id: string, value: string) => void;
  handleStepValue: (id: string, delta: number, isDecimalStep: boolean) => void;
  getAdvancedDetailedFunction: (id: string) => string;
  expandedCardIds: Record<string, boolean>;
  toggleCardExpanded: (id: string) => void;
  handleCopySummary: () => void;
  copied: boolean;
  resultRef: React.RefObject<HTMLDivElement | null>;
  activeGender: string;
}

export const ReportDashboardResult: React.FC<ReportDashboardResultProps> = ({
  results,
  criticalItems,
  concernedItems,
  overallUrgency,
  overallColor,
  searchQuery,
  setSearchQuery,
  filterMode,
  setFilterMode,
  expandedCategories,
  setExpandedCategories,
  handleValueChange,
  handleStepValue,
  getAdvancedDetailedFunction,
  expandedCardIds,
  toggleCardExpanded,
  handleCopySummary,
  copied,
  resultRef,
  activeGender,
}) => {
  return (
    <div className="space-y-6">
      {/* THE MASTER REPORT DASHBOARD (Requirement 7 & Smart UI) */}
      <div ref={resultRef} className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-5 relative overflow-hidden text-left">
        {/* Ambient biological aura effect based on report severity */}
        <div className={`absolute top-0 right-0 w-48 h-48 rounded-full blur-3xl pointer-events-none transition-all ${
          overallColor === "red" ? "bg-red-500/[0.04]" :
          overallColor === "amber" ? "bg-amber-400/[0.04]" : "bg-emerald-400/[0.04]"
        }`} />

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-850 pb-4 relative z-10 font-sans">
          <div>
            <span className="text-[9px] font-mono text-blue-400 uppercase tracking-widest block font-bold mb-0.5 animate-pulse">
              Decoded Medical Summary
            </span>
            <h3 className="text-slate-100 font-sans font-bold text-base flex items-center gap-2">
              🩺 Pathology Analysis Dashboard
            </h3>
          </div>
          <div className="flex items-center gap-2 text-[10px] font-mono text-slate-400 bg-slate-950 px-3 py-1.5 rounded-xl border border-slate-850 self-start sm:self-auto">
            <Calendar size={11} className="text-blue-400" />
            <span>Report Date: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
          </div>
        </div>

        {/* Smart 4-Column Stat Matrix Widget */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 relative z-10 font-sans">
          <div className="bg-slate-950/50 border border-slate-850/80 rounded-xl p-3 text-left">
            <span className="text-[9px] font-mono text-slate-500 uppercase tracking-wider block font-bold">Overall Urgency</span>
            <div className="flex items-center gap-1.5 pt-1.5">
              <span className={`w-2 h-2 rounded-full ${overallColor === "red" ? "bg-red-500 animate-pulse" : "bg-amber-400"}`} />
              <span className={`text-xs font-sans font-extrabold uppercase tracking-widest ${
                overallColor === "red" ? "text-red-400" :
                overallColor === "amber" ? "text-amber-400" : "text-emerald-400"
              }`}>
                {overallUrgency}
              </span>
            </div>
          </div>

          <div className="bg-slate-950/50 border border-slate-850/80 rounded-xl p-3 text-left">
            <span className="text-[9px] font-mono text-slate-500 uppercase tracking-wider block font-bold">Calculated Tests</span>
            <div className="flex items-baseline gap-1 pt-1">
              <span className="text-base font-mono font-bold text-slate-100">{results.length}</span>
              <span className="text-[9px] font-mono text-slate-500">active</span>
            </div>
          </div>

          <div className="bg-slate-950/50 border border-slate-850/80 rounded-xl p-3 text-left">
            <span className="text-[9px] font-mono text-slate-500 uppercase tracking-wider block font-bold">Shifts Detected</span>
            <div className="flex items-baseline gap-1 pt-1">
              <span className={`text-base font-mono font-bold ${criticalItems.length + concernedItems.length > 0 ? "text-amber-400" : "text-emerald-400"}`}>
                {criticalItems.length + concernedItems.length}
              </span>
              <span className="text-[9px] font-mono text-slate-500">markers</span>
            </div>
          </div>

          <div className="bg-slate-950/50 border border-slate-850/80 rounded-xl p-3 text-left">
            <span className="text-[9px] font-mono text-slate-500 uppercase tracking-wider block font-bold">Triage Specialist</span>
            <div className="pt-1.5 truncate text-[11px] font-semibold text-slate-350">
              {criticalItems.length > 0 ? "🩺 " + criticalItems[0].specialist : concernedItems.length > 0 ? "🩺 " + concernedItems[0].specialist : "✅ Default Review"}
            </div>
          </div>
        </div>

        {/* Quick Human-Centric Medical Summary */}
        <div className="p-4 bg-slate-950/40 border border-slate-855 rounded-xl text-left relative z-10 font-sans">
          <span className="text-[9px] font-mono text-slate-400 uppercase tracking-widest block font-bold mb-1">
            Executive Health Translation
          </span>
          <p className="text-xs text-slate-300 leading-relaxed font-sans">
            {overallUrgency === "Urgent" ? (
              <span>
                Your active biology profile represents significant offsets that sit outside common guideline baselines. Prompt care is advised to support your <strong className="text-red-400 font-bold">{criticalItems.map(c => c.name).join(', ')}</strong> pathways. A structured consultation with a credentialed doctor can safely confirm these indices.
              </span>
            ) : overallUrgency === "Soon" ? (
              <span>
                Your pathology report indicators represent mild shifts in <strong className="text-amber-400 font-bold">{concernedItems.map(c => c.name).slice(0, 3).join(', ')}</strong> reserves. Standard adjustments in regular dietary fiber, mild daily exercise, and consistent hydration are helpful tools to support your homeostatic balance.
              </span>
            ) : (
              <span>
                Exceptional laboratory profile. All tested biomarker pathways reside comfortably within default biological boundaries, denoting excellent metabolic clearance speed, balanced cellular defense, and strong baseline physiological vitality reserves.
              </span>
            )}
          </p>
        </div>

        {/* Doctor/Specialist Priority Recommendations */}
        {(criticalItems.length > 0 || concernedItems.length > 0) && (
          <div className="p-4 bg-blue-955/10 border border-blue-900/30 rounded-xl text-left space-y-3 relative z-10 font-sans">
            <div className="flex items-center gap-2">
              <span className="text-xs">👨‍⚕️</span>
              <span className="text-[10px] font-mono text-blue-400 uppercase tracking-wider font-bold">Recommended Specialist Diagnostics</span>
            </div>
            <div className="space-y-2">
              {[...criticalItems, ...concernedItems].slice(0, 2).map((item) => (
                <div key={item.id} className="flex flex-col md:flex-row md:items-center justify-between gap-1.5 bg-slate-950/60 p-2.5 rounded-xl border border-slate-900">
                  <div>
                    <span className="text-[9px] font-mono text-slate-500 block">Tested Biomarker</span>
                    <span className="text-slate-100 font-sans font-bold text-xs">{item.name} Referral Specialist</span>
                  </div>
                  <div className="text-left md:text-right">
                    <span className="text-[9px] font-mono text-blue-400 block font-bold">{item.specialist}</span>
                    <span className="text-slate-400 font-mono text-[9px]">{item.degreeNeeded.split('→').pop()?.trim()}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* KEY FINDINGS ALERT PANEL (Requirement 7 - Abnormal Markers Placed On Top) */}
      {(criticalItems.length > 0 || concernedItems.length > 0) && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4 font-sans">
          <div className="flex items-center justify-between border-b border-slate-855 pb-2.5">
            <h4 className="text-slate-100 font-sans font-bold text-sm tracking-tight flex items-center gap-2">
              🚨 Priority Findings ({criticalItems.length + concernedItems.length} Marked Indicators)
            </h4>
            <span className="px-2 py-0.5 rounded bg-red-950 text-[9px] font-mono uppercase tracking-widest text-red-400 border border-red-900/10 font-bold animate-pulse">
              Support Advised
            </span>
          </div>
          
          <p className="text-[11px] text-slate-400 leading-relaxed font-sans text-left">
            The indices below are resting outside common biological boundaries. Discussing these specific areas with a medical provider will assist in designing comfortable protection steps:
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5 pt-1">
            {[...criticalItems, ...concernedItems].map((item) => (
              <div key={item.id} className="p-3.5 bg-slate-950/80 rounded-xl border border-slate-850 hover:border-slate-800 transition flex flex-col justify-between text-left space-y-2.5">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-sans font-bold text-slate-200">{item.name}</span>
                  <span className={`px-2 py-0.5 rounded-full text-[9px] font-mono font-bold ${
                    item.statusColor === 'red' ? 'bg-red-950/60 text-red-400 border border-red-900/40' : 'bg-amber-950/60 text-amber-500 border border-amber-900/25'
                  }`}>
                    {item.value} {item.unit}
                  </span>
                </div>
                
                <p className="text-[11px] text-slate-350 leading-relaxed font-sans">
                  <strong className="text-slate-200 font-mono text-[9px] uppercase tracking-wider block mb-0.5">Simplified Layman:</strong> {item.explanation}
                </p>

                <div className="pt-2 border-t border-slate-900 flex justify-between items-center text-[9px] font-mono text-slate-550">
                  <span>Guidelines: {item.min} - {item.max}</span>
                  <span className="text-slate-400 font-sans font-semibold">👨‍⚕️ {item.specialist}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* SEARCH & DYNAMIC FILTER SEGMENTED RAILS (Smart Navigation - Requirement 7) */}
      <div className="bg-slate-900 border border-slate-800 p-4 rounded-2xl flex flex-col lg:flex-row items-center gap-4 shadow-xl">
        {/* Realtime Search Bar */}
        <div className="relative w-full lg:flex-1">
          <Search size={13} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none" />
          <input
            type="text"
            placeholder="Search biomarkers by name or shorthand (e.g., ALT, T3)..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-slate-950 border border-slate-855 hover:border-slate-800 focus:border-blue-500 text-xs text-slate-200 placeholder-slate-500 rounded-xl outline-none font-sans transition-all"
          />
        </div>

        {/* Filter Pill Segments */}
        <div className="flex flex-wrap gap-1.5 w-full lg:w-auto font-sans">
          {(["all", "abnormal", "normal", "critical"] as const).map((mode) => {
            const labels = {
              all: "All Tests",
              abnormal: "Unusual",
              normal: "Nominal",
              critical: "Urgent Only"
            };
            const count = mode === "all" ? results.length :
                          mode === "abnormal" ? (criticalItems.length + concernedItems.length) :
                          mode === "normal" ? results.filter(r => r.status === "Normal").length :
                          criticalItems.length;

            return (
              <button
                key={mode}
                type="button"
                onClick={() => setFilterMode(mode)}
                className={`px-3 py-1.5 text-[10px] font-sans font-bold rounded-lg transition border cursor-pointer select-none flex items-center gap-1.5 ${
                  filterMode === mode 
                    ? "bg-blue-900/20 border-blue-500/40 text-blue-400 shadow-md font-extrabold" 
                    : "bg-slate-950 border-slate-850 text-slate-400 hover:text-slate-200"
                }`}
              >
                <span>{labels[mode]}</span>
                <span className="text-[8px] bg-slate-900/85 px-1.5 py-[1px] rounded font-mono text-slate-500">
                  {count}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* DENSE SECTORS PANEL (Requirement 7 & Collapsible Accordions) */}
      <div className="space-y-4">
        {Object.entries(
          results.reduce((acc, res) => {
            const bio = BIOMARKERS_DATABASE[res.id];
            const cat = bio ? bio.category : "Infection & Immunity";
            
            // Matches active search queries
            const matchesSearch = res.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                                  res.id.toLowerCase().includes(searchQuery.toLowerCase());
            
            // Matches active filters selected
            const matchesFilter = filterMode === "all" ||
                                  (filterMode === "abnormal" && res.status !== "Normal") ||
                                  (filterMode === "normal" && res.status === "Normal") ||
                                  (filterMode === "critical" && res.status.startsWith("Requires"));

            if (matchesSearch && matchesFilter) {
              if (!acc[cat]) acc[cat] = [];
              acc[cat].push(res);
            }
            return acc;
          }, {} as Record<string, AnalysisDetail[]>)
        ).map(([category, catItemsRaw]) => {
          const catItems = catItemsRaw as AnalysisDetail[];
          const isExpanded = expandedCategories[category];
          const hasAbnormal = catItems.some(i => i.status !== "Normal");
          const hasCritical = catItems.some(i => i.status.startsWith("Requires"));
          const catMeta = CATEGORY_MESSAGES[category] || { icon: "🧬", subtitle: "Specialized biochemistry indices pathways." };

          return (
            <div 
              key={category} 
              className={`bg-slate-900 rounded-2xl border transition-all overflow-hidden ${
                isExpanded 
                  ? "border-slate-700 shadow-lg" 
                  : hasCritical 
                    ? "border-red-900/40 hover:border-red-800/60 shadow-md hover:bg-slate-900/90" 
                    : hasAbnormal 
                      ? "border-amber-900/30 hover:border-amber-800/50 shadow hover:bg-slate-900/90" 
                      : "border-slate-855 hover:border-slate-800 hover:bg-slate-900/90"
              }`}
            >
              {/* Category Clickable Accordion Bar */}
              <button
                type="button"
                onClick={() => setExpandedCategories(prev => ({ ...prev, [category]: !prev[category] }))}
                className="w-full p-4 flex items-center justify-between text-left cursor-pointer transition-all focus:outline-none"
              >
                <div className="flex items-center gap-3 w-[85%]">
                  <span className="text-xl shrink-0 select-none pb-0.5">{catMeta.icon}</span>
                  <div className="truncate">
                    <div className="flex flex-wrap items-center gap-1.5">
                      <span className="font-sans font-extrabold text-xs md:text-sm text-slate-100">{category}</span>
                      <span className="px-1.5 py-[0.5px] bg-slate-950 border border-slate-850 text-[8px] font-mono text-slate-500 rounded block shrink-0">
                        {catItems.length} tests
                      </span>
                      {hasCritical && (
                        <span className="px-1.5 py-[1px] bg-red-955 border border-red-900/35 text-[7px] font-mono tracking-widest text-red-400 rounded uppercase font-bold animate-pulse block shrink-0">
                          Urgent
                        </span>
                      )}
                      {!hasCritical && hasAbnormal && (
                        <span className="px-1.5 py-[1px] bg-amber-955 border border-amber-900/20 text-[7px] font-mono tracking-widest text-amber-500 rounded uppercase font-bold block shrink-0">
                          Concern
                        </span>
                      )}
                    </div>
                    <p className="text-[10px] text-slate-500 font-sans mt-0.5 truncate max-w-sm md:max-w-lg">
                      {catMeta.subtitle}
                    </p>
                  </div>
                </div>
                
                <div className="text-slate-400">
                  {isExpanded ? (
                    <ChevronUp size={14} />
                  ) : (
                    <ChevronDown size={14} />
                  )}
                </div>
              </button>

              {/* Sibling Accordion Body Content */}
              <AnimatePresence initial={false}>
                {isExpanded && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className="overflow-hidden border-t border-slate-950 bg-slate-955/5"
                  >
                    <div className="p-4 space-y-3.5 bg-slate-950/35">
                      {catItems.map((item) => (
                        <div 
                          key={item.id}
                          className={`p-3.5 rounded-xl border transition text-xs leading-relaxed text-slate-200 font-sans ${
                            item.status.startsWith("Requires") 
                              ? "border-red-950/80 bg-red-950/10" 
                              : item.status !== "Normal" 
                                ? "border-amber-955/65 bg-amber-950/10" 
                                : "border-slate-855 bg-slate-900/15"
                          }`}
                        >
                          {/* Biomarker Header Row with Step Steppers nestled seamlessly */}
                          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 pb-2 border-b border-slate-950/75">
                            <div className="flex items-center gap-1.5">
                              <span className={`w-1.5 h-1.5 rounded-full ${
                                item.statusColor === 'red' ? 'bg-red-500 animate-pulse' :
                                item.statusColor === 'amber' ? 'bg-amber-400' : 'bg-emerald-400'
                              }`} />
                              <span className="font-extrabold text-slate-100">{item.name}</span>
                              <span className="text-[9px] font-mono text-slate-500 uppercase">({item.id.toUpperCase()})</span>
                            </div>
                            <div className="flex items-center gap-3 flex-wrap">
                              <span className="text-[9px] font-mono text-slate-500">Ref: {item.min} - {item.max} {item.unit}</span>
                              
                              {/* Interactive Steppers */}
                              <div className="flex items-center bg-slate-950 border border-slate-850 hover:border-slate-750 p-0.5 rounded-lg gap-1">
                                <button
                                  type="button"
                                  onClick={() => handleStepValue(item.id, -1, item.id === "creatinine" || item.id === "tsh" || item.id === "bilirubin")}
                                  className="w-4.5 h-4.5 bg-slate-900 text-slate-350 hover:text-white rounded flex items-center justify-center font-mono text-[10px] border border-slate-800 hover:border-slate-700 cursor-pointer select-none"
                                >
                                  -
                                </button>
                                <input
                                  type="number"
                                  step={item.id === "creatinine" || item.id === "tsh" || item.id === "bilirubin" ? "0.1" : "1"}
                                  value={item.value}
                                  onChange={(e) => handleValueChange(item.id, e.target.value)}
                                  className="w-10 bg-transparent text-center font-mono text-[10px] text-slate-150 font-bold focus:outline-none p-0 border-none"
                                />
                                <button
                                  type="button"
                                  onClick={() => handleStepValue(item.id, 1, item.id === "creatinine" || item.id === "tsh" || item.id === "bilirubin")}
                                  className="w-4.5 h-4.5 bg-slate-900 text-slate-350 hover:text-white rounded flex items-center justify-center font-mono text-[10px] border border-slate-800 hover:border-slate-700 cursor-pointer select-none"
                                >
                                  +
                                </button>
                              </div>

                              <span className={`px-2 py-[1.5px] rounded text-[8px] font-mono font-bold uppercase tracking-widest ${
                                item.statusColor === 'red' ? 'bg-red-950 text-red-400 border border-red-900/30' :
                                item.statusColor === 'amber' ? 'bg-amber-950 text-amber-500 border border-amber-900/20' :
                                'bg-emerald-950 text-emerald-400 border border-emerald-950/20'
                              }`}>
                                {item.status} ({item.value} {item.unit})
                              </span>
                            </div>
                          </div>

                          {/* Layman focus explanation */}
                          <div className="pt-2 text-[11px] leading-relaxed text-slate-350 space-y-2 text-left">
                            <p>
                              <strong className="text-slate-200 block text-[9px] font-mono uppercase tracking-wider text-blue-400">Layman Discussion:</strong> 
                              <span className="mt-0.5 block">{item.explanation}</span>
                            </p>
                            <p className="text-[10.5px] italic text-slate-400 leading-relaxed pt-1.5 border-t border-slate-900/50">
                              <strong className="text-slate-300 block text-[9px] font-mono uppercase not-italic tracking-wider text-emerald-400 mb-0.5">Biochemical Action Pathway:</strong> 
                              {getAdvancedDetailedFunction(item.id)}
                            </p>
                            {item.status !== "Normal" && (
                              <div className="pt-2 flex flex-col md:flex-row md:items-center justify-between gap-1 border-t border-slate-900/40 mt-2 font-mono text-[9px]">
                                <span className="text-blue-400 block uppercase tracking-wide font-extrabold flex items-center gap-1">👨‍⚕️ Suggest Referral:<span className="text-slate-200 font-sans text-[11px] inline-block font-extrabold normal-case ml-1">👨‍⚕️ {item.specialist}</span></span>
                                <span className="text-slate-500 mr-1">Target Specialist: <strong className="text-slate-400 font-medium">{item.degreeNeeded.split('→').pop()?.trim()}</strong></span>
                              </div>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          );
        })}
      </div>

      {/* GENERAL PREVENTIVE WELLNESS & OUTCOME ROADBLOCK */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4 text-left font-sans">
        <div className="flex items-center gap-2 border-b border-slate-850 pb-2.5">
          <Sparkles size={14} className="text-blue-400 animate-pulse" />
          <span className="text-xs font-sans font-bold uppercase tracking-wider text-slate-200">
            General Wellness Support & Outcome Paths
          </span>
        </div>
        <p className="text-slate-500 text-[11px] leading-relaxed italic font-sans font-medium">
          Low-risk preventative adjustments designed to support standard circulatory clearing speeds and vital capillary filtration perfectly.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-1 text-xs">
          <div className="p-3 bg-slate-950/50 rounded-xl border border-slate-850 space-y-1">
            <span className="text-slate-200 font-bold block">🥛 Advanced Hydration</span>
            <p className="text-slate-400 text-[11px] leading-relaxed font-sans">Aim for 35ml of purified water per kilogram of body mass to facilitate renal waste clearing cycles smoothly.</p>
          </div>
          <div className="p-3 bg-slate-950/50 rounded-xl border border-slate-850 space-y-1">
            <span className="text-slate-200 font-bold block">🚶 Low-Impact Activity</span>
            <p className="text-slate-400 text-[11px] leading-relaxed font-sans">A supportive 25-minute walk in natural daylight optimizes muscle sugar extraction and vascular elasticity baseline metrics.</p>
          </div>
          <div className="p-3 bg-slate-950/50 rounded-xl border border-slate-850 space-y-1">
            <span className="text-slate-200 font-bold block">🥬 Dietary Fiber</span>
            <p className="text-slate-400 text-[11px] leading-relaxed font-sans font-sans">Introduce soluble fiber (oat bran, chia seeds) to gently balance lipid absorption and vascular resilience.</p>
          </div>
        </div>
      </div>

      {/* CLINICAL TIMING REFERENCE GUIDELINES */}
      <div className="bg-red-950/10 border border-red-900/20 rounded-2xl p-6 space-y-3.5 text-left relative overflow-hidden font-sans">
        <div className="absolute top-0 right-0 w-24 h-24 bg-red-500/5 rounded-full blur-2xl pointer-events-none" />
        <div className="flex items-center gap-2 border-b border-red-900/20 pb-2.5">
          <AlertCircle size={14} className="text-red-550" />
          <span className="text-xs font-sans font-bold uppercase tracking-wider text-red-500">
            Safe Clinical Checkup Reference Guidelines
          </span>
        </div>
        <p className="text-slate-300 text-xs font-sans leading-relaxed">
          We guide choice patterns carefully: consider evaluating clinical panels with professional credentials under any of the circumstances below:
        </p>
        <ul className="space-y-1.5 text-[11px] text-slate-400 font-sans list-disc list-inside">
          <li>When any mapped indicators display an urgent <strong>Requires Follow-up</strong> status badge.</li>
          <li>Under active physical fatigue, weight variations, or sustained core cellular recovery.</li>
          <li>To establish verified biochemical baselines preceding changes to high-intensity training.</li>
          <li>Whenever a credentialed doctor recommends diagnostic reassurance.</li>
        </ul>
      </div>

      {/* MASTER ACTIONS FOOTER BAR */}
      <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl flex flex-col sm:flex-row gap-4 justify-between items-center bg-transparent text-left shadow-xl">
        <div className="flex flex-wrap gap-2.5 w-full sm:w-auto">
          <button
            type="button"
            onClick={handleCopySummary}
            className="flex items-center gap-2 bg-slate-950 hover:bg-slate-900 hover:text-white text-slate-300 px-4 py-3 rounded-xl border border-slate-800 text-xs font-mono font-medium transition cursor-pointer select-none focus:outline-none w-full sm:w-auto justify-center"
          >
            {copied ? (
              <>
                <Check size={13} className="text-emerald-400" />
                <span className="text-emerald-400">✓ Copied summary data!</span>
              </>
            ) : (
              <>
                <Copy size={13} />
                <span>📋 Copy Summary Digest</span>
              </>
            )}
          </button>
          
          <button
            type="button"
            onClick={() => window.print()}
            className="flex items-center gap-2 bg-slate-950 hover:bg-slate-900 hover:text-white text-slate-300 px-4 py-3 rounded-xl border border-slate-800 text-xs font-mono font-medium transition cursor-pointer select-none focus:outline-none w-full sm:w-auto justify-center"
          >
            <Printer size={13} />
            <span>🖨️ Print Decoder Report</span>
          </button>
        </div>

        <div className="text-[10px] font-mono text-slate-500 text-center sm:text-right">
          ✨ Encrypted locally, keeping medical data 100% private.
        </div>
      </div>
    </div>
  );
};
