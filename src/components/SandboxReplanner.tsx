import React, { useState } from 'react';
import { PathwayId, PathwayOption } from '../types';

interface SandboxReplannerProps {
  pathways: PathwayOption[];
  selectedPathway: PathwayId;
  onSelectPathway: (id: PathwayId) => void;
  onApplyReplanConfirmed: () => void;
}

export const SandboxReplanner: React.FC<SandboxReplannerProps> = ({
  pathways,
  selectedPathway,
  onSelectPathway,
  onApplyReplanConfirmed,
}) => {
  const [isSimulating, setIsSimulating] = useState(false);
  const [simulationDone, setSimulationDone] = useState(false);
  const [applyState, setApplyState] = useState<'idle' | 'transmitting' | 'confirmed'>('idle');

  const handleSimulate = () => {
    setIsSimulating(true);
    setSimulationDone(false);
    setTimeout(() => {
      setIsSimulating(false);
      setSimulationDone(true);
      setTimeout(() => {
        setSimulationDone(false);
      }, 3000);
    }, 1200);
  };

  const handleApply = () => {
    setApplyState('transmitting');
    setTimeout(() => {
      setApplyState('confirmed');
      onApplyReplanConfirmed();
    }, 1400);
  };

  return (
    <div className="flex flex-col w-full gap-4 select-none">
      {/* Incident Telemetry Header / Urgent Banner */}
      <div className="relative overflow-hidden bg-rose-50 border border-rose-200 p-4 rounded shadow-xs flex flex-col gap-2">
        <div className="absolute -right-16 -top-16 w-80 h-80 bg-rose-200/40 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-rose-600"></div>

        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-rose-100 border border-rose-200 rounded flex items-center justify-center shrink-0">
              <span className="material-symbols-outlined text-rose-700 text-[26px]">warning</span>
            </div>
            <div className="flex flex-col">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="font-mono text-[10px] uppercase tracking-widest px-1.5 py-[2px] bg-rose-200 text-rose-900 font-bold rounded">
                  CRITICAL ANOMALY DETECTED
                </span>
                <span className="font-mono text-[9px] uppercase tracking-widest text-slate-600 font-semibold">
                  POSSESSION CODE: DEF-S02-S03-WB
                </span>
                <span className="font-mono text-[9px] px-1.5 py-[1px] bg-white border border-rose-200 text-emerald-700 font-bold rounded">
                  SOLVER ACTIVE: DUAL-SIMPLEX
                </span>
              </div>
              <h1 className="text-[17px] text-rose-950 font-bold tracking-tight mt-0.5">
                Urgent Re-Plan Engine — Incident: Unscheduled Rail Defect at S02–S03
              </h1>
            </div>
          </div>

          {/* Quick Ticker Stats */}
          <div className="flex items-center gap-2 shrink-0">
            <div className="flex flex-col px-3 py-1.5 bg-white border border-rose-200 rounded min-w-[130px] shadow-xs">
              <span className="font-mono text-[9px] uppercase text-slate-500 font-semibold">CAPACITY DROP</span>
              <div className="flex items-baseline gap-1">
                <span className="font-mono text-[18px] text-rose-600 font-bold">4 → 1</span>
                <span className="font-mono text-[10px] text-slate-500 font-medium">NIGHT CONSISTS</span>
              </div>
            </div>

            <div className="flex flex-col px-3 py-1.5 bg-white border border-rose-200 rounded min-w-[120px] shadow-xs">
              <span className="font-mono text-[9px] uppercase text-slate-500 font-semibold">SOLVER LATENCY</span>
              <div className="flex items-baseline gap-1">
                <span className="font-mono text-[18px] text-sky-800 font-bold">4.2</span>
                <span className="font-mono text-[10px] text-sky-800 font-medium">SEC (4,096 P)</span>
              </div>
            </div>
          </div>
        </div>

        {/* Alert Strip Message */}
        <div className="flex items-center gap-2.5 px-3 py-1.5 bg-white border border-rose-200 rounded text-slate-700 text-[11px] shadow-xs">
          <span className="w-2.5 h-2.5 rounded-full bg-rose-600 animate-pulse shrink-0"></span>
          <p className="truncate">
            <span className="font-mono text-[11px] text-rose-900 font-bold">ALERT //</span>{' '}
            S02-S03 WB Ultrasonics identified micro-fissure at KM 16.420. Night possession capacity curtailed immediately from 4 concurrent consists to 1 isolated consist. Solver re-calculated 3 mitigation pathways in 4.2 seconds.
          </p>
        </div>
      </div>

      {/* Real-time Defect & Ultrasonic Context Visual Deck */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        {/* Visual 1: Defect Sonogram Scan */}
        <div className="relative bg-white border border-slate-200 rounded p-3 flex flex-col justify-between overflow-hidden shadow-xs">
          <div className="flex items-center justify-between mb-1.5">
            <span className="font-mono text-[9px] text-slate-500 uppercase tracking-wider font-semibold">
              ULTRASONIC B-SCAN // PROBE 04
            </span>
            <span className="font-mono text-[10px] text-rose-700 font-bold px-1.5 bg-rose-50 border border-rose-200 rounded">
              FISSURE 12.4mm
            </span>
          </div>
          <div className="h-24 w-full relative rounded overflow-hidden border border-slate-200">
            <img
              className="w-full h-full object-cover"
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuC5m3GD5HXeZQEMYRxwdrDjhz8sbPkLUz9Al3n9s0vpakoE0mwKx9iThbL9jwmiHGLmVOSV3P1mDtN3is_8FI7xopq0S4lEvFvKMx-gRnFxaj025rxiKMwjVyxo3yNbB2TemTp7-X6kUTpymdXtc_ZDfjwIUtS5q-o-CejGMnRYt84UolvZ3aEZ2c-CVaILg1u-CfMlMImEU2V8UU9jIcRX0V7JCf3c_i9KpQgOrekMXpC23XeyIkIKKw"
              alt="Ultrasonic B-scan display"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-transparent to-transparent"></div>
            <div className="absolute bottom-2 left-2 flex items-center gap-1">
              <span className="font-mono text-[9px] text-sky-300 font-bold">KM 16.420</span>
              <span className="font-mono text-[9px] text-slate-300 font-medium">| DEFECT DEPTH: 14.8MM</span>
            </div>
          </div>
        </div>

        {/* Visual 2: Schematic Vector / Spatial Blockade */}
        <div className="relative bg-white border border-slate-200 rounded p-3 flex flex-col justify-between overflow-hidden shadow-xs">
          <div className="flex items-center justify-between mb-1.5">
            <span className="font-mono text-[9px] text-slate-500 uppercase tracking-wider font-semibold">
              INTERLOCK STATE // BLOCK S02-S03
            </span>
            <span className="font-mono text-[10px] text-emerald-700 font-bold px-1.5 bg-emerald-50 border border-emerald-200 rounded">
              ISOLATION SECURED
            </span>
          </div>
          <div className="h-24 w-full relative flex items-center justify-center bg-slate-50 border border-slate-200 rounded px-3">
            <svg className="w-full h-16" viewBox="0 0 320 60" fill="none" xmlns="http://www.w3.org/2000/svg">
              <line x1="10" y1="20" x2="310" y2="20" stroke="#94A3B8" strokeWidth="2" strokeDasharray="4 4" />
              <line x1="80" y1="20" x2="220" y2="20" stroke="#DC2626" strokeWidth="3.5" />
              <line x1="10" y1="44" x2="310" y2="44" stroke="#059669" strokeWidth="2.5" />
              <path d="M70 20 L90 44" stroke="#0284C7" strokeWidth="2" />
              <path d="M210 44 L230 20" stroke="#0284C7" strokeWidth="2" />
              <circle cx="150" cy="20" r="5" fill="#DC2626" className="animate-ping" />
              <circle cx="150" cy="20" r="4" fill="#DC2626" />
              <text x="15" y="14" fill="#64748B" fontFamily="JetBrains Mono" fontSize="8" fontWeight="600">
                TRK-A (WB)
              </text>
              <text x="15" y="55" fill="#059669" fontFamily="JetBrains Mono" fontSize="8" fontWeight="600">
                TRK-B (EB) [RELIEF PATH]
              </text>
              <text x="135" y="12" fill="#DC2626" fontFamily="JetBrains Mono" fontSize="8" fontWeight="700">
                KM 16.420
              </text>
            </svg>
          </div>
        </div>

        {/* Visual 3: Consist Crew Deployment Status */}
        <div className="relative bg-white border border-slate-200 rounded p-3 flex flex-col justify-between overflow-hidden shadow-xs">
          <div className="flex items-center justify-between mb-1.5">
            <span className="font-mono text-[9px] text-slate-500 uppercase tracking-wider font-semibold">
              CREW WORKFORCE MATRIX
            </span>
            <span className="font-mono text-[10px] text-sky-800 font-bold px-1.5 bg-sky-50 border border-sky-200 rounded">
              4 CONSISTS STANDBY
            </span>
          </div>
          <div className="h-24 w-full relative rounded overflow-hidden border border-slate-200">
            <img
              className="w-full h-full object-cover"
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuCzp2Jsz-2GLim7O4CtkkRwC6HpB0fCnTzW7bGzeqHZE5jxobbIZx-OnaOyqxTFBTTwIkHtpYw-ZzD4B6xxxzYZDyQXxajQS0Axk3AxQtDCF1xgz0NC0vxRgUwgz_QiO2sCcCzCYNNGYVk2XHrRbqevXQmCOyFaOyKJNxxHmRs6QkY1QXsjoahd0CVcvjFinFtnXMagzajpwrI9lj6t4fDYApXk1BpGAKSNC6UC_kC_9hOFCiQNwlfViw"
              alt="Night track maintenance crew"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-transparent to-transparent"></div>
            <div className="absolute bottom-2 left-2 flex items-center gap-1">
              <span className="font-mono text-[9px] text-emerald-400 font-bold">42 OPERATIVES</span>
              <span className="font-mono text-[9px] text-slate-300 font-medium">| DEPOT STAGED S01</span>
            </div>
          </div>
        </div>
      </div>

      {/* Pathway Matrix Header Label */}
      <div className="flex items-center justify-between mt-1 px-1">
        <div className="flex items-center gap-2">
          <span className="material-symbols-outlined text-sky-700 text-[20px]">alt_route</span>
          <span className="text-[14px] text-slate-900 font-bold">MITIGATION PATHWAYS COMPARISON MATRIX</span>
          <span className="font-mono text-[10px] text-slate-600 font-semibold uppercase ml-1 px-1.5 py-0.5 bg-slate-200 rounded">
            SELECT ACTIVE DISPATCH STRATEGY
          </span>
        </div>
        <div className="font-mono text-[9px] text-slate-500 uppercase tracking-widest hidden md:block font-semibold">
          CRITERIA: COMMUTER DELAY • PENALTY COST • RE-CERTIFICATION WINDOW
        </div>
      </div>

      {/* Main Comparison Grid: Three Distinct Scenario Recommendation Cards (3 Columns) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-3 items-stretch">
        {pathways.map((pathway, idx) => {
          const isSelected = selectedPathway === pathway.id;
          const isRecommended = pathway.recommended;

          return (
            <div
              key={pathway.id}
              onClick={() => onSelectPathway(pathway.id)}
              className={`relative rounded flex flex-col justify-between p-4 transition-all cursor-pointer ${
                isSelected
                  ? 'bg-emerald-50/50 border-2 border-emerald-500 shadow-md'
                  : 'bg-white border border-slate-200 hover:border-slate-300 hover:shadow-sm'
              }`}
            >
              {/* Top Accent Strip */}
              <div
                className={`absolute top-0 left-0 right-0 rounded-t ${
                  isSelected
                    ? 'h-1.5 bg-emerald-600'
                    : pathway.id === 'beta'
                    ? 'h-1 bg-amber-500'
                    : 'h-1 bg-slate-300'
                }`}
              ></div>

              {/* Recommended Badge */}
              {isRecommended && (
                <div className="absolute top-2 right-2 flex items-center gap-1 px-1.5 py-[2px] bg-emerald-100 text-emerald-800 border border-emerald-300 rounded font-mono text-[9px] font-bold">
                  <span className="material-symbols-outlined text-[13px]">verified</span>
                  <span>RECOMMENDED</span>
                </div>
              )}

              <div className="flex flex-col gap-3">
                {/* Top Pill & Title */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    <span
                      className={`px-1.5 py-[2px] font-mono text-[9px] rounded uppercase font-bold border ${
                        isSelected
                          ? 'bg-emerald-600 text-white border-emerald-600'
                          : pathway.id === 'beta'
                          ? 'bg-amber-100 text-amber-800 border-amber-300'
                          : 'bg-slate-100 text-slate-700 border-slate-200'
                      }`}
                    >
                      {pathway.pill}
                    </span>
                    <span className="font-mono text-[9px] text-slate-500 font-semibold">
                      PATHWAY {pathway.id.toUpperCase()}
                    </span>
                  </div>

                  {!isRecommended && (
                    <span className="w-6 h-6 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-600 font-mono text-[10px] font-bold">
                      0{idx + 1}
                    </span>
                  )}
                </div>

                <div>
                  <h2 className="text-[14px] text-slate-900 leading-snug font-bold">{pathway.title}</h2>
                  <span className="font-mono text-[10px] text-sky-800 font-semibold uppercase tracking-wider block mt-0.5">
                    {pathway.protocolSubtitle}
                  </span>
                  <p className="text-[11px] text-slate-600 mt-2 leading-relaxed">{pathway.description}</p>
                </div>

                {/* Core Metrics Cluster */}
                <div className="grid grid-cols-2 gap-2 pt-1">
                  <div className="bg-slate-50 border border-slate-200 p-2 rounded flex flex-col">
                    <span className="font-mono text-[8px] uppercase text-slate-500 font-semibold">
                      COMMUTER IMPACT
                    </span>
                    <span
                      className={`font-mono text-[11px] font-bold mt-0.5 ${
                        pathway.id === 'beta' ? 'text-rose-700' : 'text-emerald-700'
                      }`}
                    >
                      {pathway.commuterImpact}
                    </span>
                    <span className="text-[10px] text-slate-500">{pathway.commuterSubtitle}</span>
                  </div>

                  <div className="bg-slate-50 border border-slate-200 p-2 rounded flex flex-col">
                    <span className="font-mono text-[8px] uppercase text-slate-500 font-semibold">
                      PENALTY POINTS
                    </span>
                    <span className="font-mono text-[11px] text-amber-700 font-bold mt-0.5">
                      {pathway.penaltyPoints}
                    </span>
                    <span className="text-[10px] text-slate-500">{pathway.penaltySubtitle}</span>
                  </div>

                  <div className="bg-slate-50 border border-slate-200 p-2 rounded flex flex-col">
                    <span className="font-mono text-[8px] uppercase text-slate-500 font-semibold">
                      ECLO / OVERRUN
                    </span>
                    <span className="font-mono text-[11px] text-slate-900 font-bold mt-0.5">
                      {pathway.ecloUtilization}
                    </span>
                    <span className="text-[10px] text-slate-500">{pathway.ecloSubtitle}</span>
                  </div>

                  <div className="bg-slate-50 border border-slate-200 p-2 rounded flex flex-col">
                    <span className="font-mono text-[8px] uppercase text-slate-500 font-semibold">
                      EFFICIENCY / REG
                    </span>
                    <span className="font-mono text-[11px] text-sky-800 font-bold mt-0.5">
                      {pathway.efficiencyScore}
                    </span>
                    <span className="text-[10px] text-slate-500">{pathway.efficiencySubtitle}</span>
                  </div>
                </div>

                {/* Impacted Contracts & Risk Profile */}
                <div className="flex flex-col gap-1 pt-1 bg-slate-50 border border-slate-200 p-2 rounded">
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-[9px] text-slate-500 uppercase font-semibold">
                      IMPACTED CONTRACTS
                    </span>
                    <span className="text-[11px] text-slate-800 font-medium">{pathway.impactedContracts}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-[9px] text-slate-500 uppercase font-semibold">
                      PLATFORM / BUFFER
                    </span>
                    <span className="text-[11px] text-slate-600 font-medium">{pathway.platformAccess}</span>
                  </div>
                  <div className="flex items-center justify-between pt-1 border-t border-slate-200">
                    <span className="font-mono text-[9px] text-slate-500 uppercase font-semibold">RISK PROFILE</span>
                    <span
                      className={`font-mono text-[10px] font-bold flex items-center gap-1 ${
                        pathway.riskLevel === 'MED-HIGH'
                          ? 'text-amber-700'
                          : 'text-emerald-700'
                      }`}
                    >
                      <span
                        className={`w-1.5 h-1.5 rounded-full ${
                          pathway.riskLevel === 'MED-HIGH' ? 'bg-amber-500' : 'bg-emerald-600'
                        }`}
                      ></span>
                      {pathway.riskProfile}
                    </span>
                  </div>
                </div>
              </div>

              {/* Action Button */}
              <button
                type="button"
                className={`mt-4 w-full py-2 px-3 font-mono text-[11px] rounded flex items-center justify-center gap-1.5 transition-all shadow-xs cursor-pointer ${
                  isSelected
                    ? 'bg-emerald-600 hover:bg-emerald-700 text-white font-bold'
                    : 'bg-white hover:bg-slate-100 text-slate-800 border border-slate-300 font-semibold'
                }`}
              >
                <span className="material-symbols-outlined text-[16px]">
                  {isSelected ? 'radio_button_checked' : 'radio_button_unchecked'}
                </span>
                <span>
                  Select Pathway {pathway.id.toUpperCase()}{' '}
                  {isRecommended ? '(Recommended)' : ''}
                </span>
              </button>
            </div>
          );
        })}
      </div>

      {/* Predecessor Activity Dependency Live Graph */}
      <div className="bg-white border border-slate-200 rounded p-3.5 flex flex-col gap-2 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-1">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-sky-700 text-[18px]">account_tree</span>
            <span className="font-mono text-[11px] text-slate-900 uppercase tracking-wider font-bold">
              PREDECESSOR ACTIVITY DEPENDENCY LIVE GRAPH
            </span>
            <span className="font-mono text-[9px] text-slate-600 px-1.5 py-0.5 bg-slate-100 border border-slate-200 rounded font-semibold">
              CASCADE ANALYSIS FOR PATHWAY {selectedPathway.toUpperCase()}
            </span>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1 font-mono text-[9px] text-slate-600 font-semibold">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span> 02:00 AM BASELINE
            </div>
            <div className="flex items-center gap-1 font-mono text-[9px] text-slate-600 font-semibold">
              <span className="w-2.5 h-2.5 rounded-full bg-sky-500"></span> EXTENDED BUFFER
            </div>
            <div className="flex items-center gap-1 font-mono text-[9px] text-slate-600 font-semibold">
              <span className="w-2.5 h-2.5 rounded-full bg-rose-500"></span> INTERLOCK LOCKOUT CUTOFF (04:30 AM)
            </div>
          </div>
        </div>

        {/* Timeline Tracks */}
        <div className="flex flex-col gap-1.5 bg-slate-50 border border-slate-200 p-3 rounded">
          {/* Act 104 */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between py-1 gap-1">
            <div className="flex items-center gap-2 w-72 shrink-0">
              <span className="font-mono text-[10px] text-emerald-800 px-1.5 bg-emerald-100 border border-emerald-300 rounded font-bold">
                ACT 104
              </span>
              <span className="text-[11px] text-slate-800 font-medium">Track Ultrasonic Grinding</span>
            </div>
            <div className="grow flex items-center gap-2">
              <div className="relative w-full h-5 bg-slate-200 rounded overflow-hidden">
                <div className="absolute left-[15%] w-[35%] h-full bg-emerald-500 text-white flex items-center justify-center font-mono text-[9px] font-bold rounded shadow-xs">
                  02:15 AM – 03:20 AM
                </div>
              </div>
            </div>
            <div className="w-44 text-right shrink-0">
              <span className="font-mono text-[10px] text-emerald-700 font-bold">UNAFFECTED (SHIFT 0)</span>
            </div>
          </div>

          {/* Act 105 */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between py-1 gap-1">
            <div className="flex items-center gap-2 w-72 shrink-0">
              <span className="font-mono text-[10px] text-sky-800 px-1.5 bg-sky-100 border border-sky-300 rounded font-bold">
                ACT 105
              </span>
              <span className="text-[11px] text-slate-800 font-medium">Overhead Catenary Tensioning</span>
            </div>
            <div className="grow flex items-center gap-2">
              <div className="relative w-full h-5 bg-slate-200 rounded overflow-hidden">
                <div className="absolute left-[50%] w-[25%] h-full bg-sky-700 text-white flex items-center justify-center font-mono text-[9px] font-bold rounded shadow-xs">
                  03:20 AM – 04:05 AM
                </div>
                <div className="absolute left-[75%] w-[7%] h-full bg-sky-200 text-sky-900 border-l border-sky-400 flex items-center justify-center font-mono text-[8px] font-bold">
                  +15M
                </div>
              </div>
            </div>
            <div className="w-44 text-right shrink-0">
              <span className="font-mono text-[10px] text-sky-800 font-bold">+15 MIN BUFFER ADDED</span>
            </div>
          </div>

          {/* Act 106 */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between py-1 gap-1">
            <div className="flex items-center gap-2 w-72 shrink-0">
              <span className="font-mono text-[10px] text-rose-800 px-1.5 bg-rose-100 border border-rose-300 rounded font-bold">
                ACT 106
              </span>
              <span className="text-[11px] text-slate-800 font-medium">Signal Interlocking Re-Test</span>
            </div>
            <div className="grow flex items-center gap-2">
              <div className="relative w-full h-5 bg-slate-200 rounded overflow-hidden">
                <div className="absolute left-[82%] w-[15%] h-full bg-slate-500 text-white flex items-center justify-center font-mono text-[9px] font-bold rounded shadow-xs">
                  04:15 AM – 04:30 AM
                </div>
              </div>
            </div>
            <div className="w-44 text-right shrink-0">
              <span className="font-mono text-[10px] text-slate-700 font-bold">SHIFTED TO 04:15 AM</span>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Command Action Footer */}
      <div className="sticky bottom-0 bg-white border border-slate-200 p-3 rounded flex flex-col md:flex-row md:items-center justify-between gap-3 shadow-lg z-30">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded bg-sky-50 border border-sky-200 flex items-center justify-center text-sky-700 shrink-0">
            <span className="material-symbols-outlined text-[20px]">memory</span>
          </div>
          <div className="flex flex-col">
            <div className="flex items-center gap-2">
              <span className="font-mono text-[11px] font-bold text-slate-900">SSL DUAL-SIMPLEX ENGINE v2.4</span>
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
              <span className="font-mono text-[9px] text-emerald-700 uppercase font-bold">
                CONVERGED IN 4,096 STEPS
              </span>
            </div>
            <span className="text-[11px] text-slate-500">
              Deterministic proof generated. Interlocking route clearance ready for block broadcast.
            </span>
          </div>
        </div>

        {/* Action Group Buttons */}
        <div className="flex items-center gap-2 shrink-0">
          <button
            type="button"
            onClick={handleSimulate}
            disabled={isSimulating}
            className="px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 border border-slate-300 font-mono text-[11px] font-semibold rounded flex items-center gap-1.5 transition-colors shadow-xs cursor-pointer"
          >
            {isSimulating ? (
              <>
                <span className="material-symbols-outlined text-[16px] animate-spin text-sky-700">refresh</span>
                <span>Running Simulation (4,096 cycles)...</span>
              </>
            ) : simulationDone ? (
              <>
                <span className="material-symbols-outlined text-[16px] text-emerald-600">check_circle</span>
                <span className="text-emerald-700 font-bold">Simulation Verified (0 Conflicts)</span>
              </>
            ) : (
              <>
                <span className="material-symbols-outlined text-[16px]">play_circle</span>
                <span>Simulate Micro-Step Dispatch</span>
              </>
            )}
          </button>

          <button
            type="button"
            onClick={handleApply}
            disabled={applyState === 'transmitting'}
            className={`px-4 py-2 font-mono text-[11px] font-bold rounded flex items-center gap-2 shadow-sm transition-all cursor-pointer ${
              applyState === 'confirmed'
                ? 'bg-sky-800 text-white'
                : 'bg-emerald-600 hover:bg-emerald-700 text-white'
            }`}
          >
            {applyState === 'transmitting' ? (
              <>
                <span className="material-symbols-outlined text-[18px] animate-spin">sync</span>
                <span>TRANSMITTING INTERLOCK OVERRIDE...</span>
              </>
            ) : applyState === 'confirmed' ? (
              <>
                <span className="material-symbols-outlined text-[18px]">verified</span>
                <span>POSSESSIONS RE-ROUTED TO S03 • CONFIRMED</span>
              </>
            ) : (
              <>
                <span className="material-symbols-outlined text-[18px]">done_all</span>
                <span>
                  {selectedPathway === 'gamma'
                    ? 'APPLY RE-OPTIMIZATION & RE-ROUTE POSSESSIONS'
                    : `APPLY PATHWAY ${selectedPathway.toUpperCase()} MITIGATION`}
                </span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
