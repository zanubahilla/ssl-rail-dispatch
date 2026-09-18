import React, { useState } from 'react';
import { QueuedPossession, ActiveView } from '../types';
import { ACCESS_CSV, OCCUPANCY_CSV, RESULTS_CSV } from '../data/mockData';
import { SECTION_DOT_ACTIVITIES } from '../data/sectionDotData';
import { getOperationalTimeline } from '../utils/timeUtils';
import { SectionDotInspector } from './SectionDotInspector';

interface TopologyCommandProps {
  onNavigateToView: (view: ActiveView) => void;
  possessions: QueuedPossession[];
  now: Date;
  hh: string;
  mm: string;
  ss: string;
  amPm: string;
  is24Hour: boolean;
  timeZoneName: string;
  timelineMode: 'realtime' | 'nocturnal';
  onToggleTimelineMode: () => void;
}

export const TopologyCommand: React.FC<TopologyCommandProps> = ({
  onNavigateToView,
  possessions,
  now,
  hh,
  mm,
  ss,
  amPm,
  timeZoneName,
  timelineMode,
  onToggleTimelineMode,
}) => {
  const [viewMode, setViewMode] = useState<'VECTOR' | 'CIRCUITS' | 'SENSORS' | 'ACTIVITIES'>('ACTIVITIES');
  const [selectedStation, setSelectedStation] = useState<string | null>(null);
  const [selectedRouteId] = useState<'ALP-EB' | 'ALP-WB' | 'BET-EB' | 'BET-WB' | null>(null);
  const [dispatchState, setDispatchState] = useState<'idle' | 'transmitting' | 'confirmed'>('idle');
  const [complianceChecks, setComplianceChecks] = useState({
    workload: true,
    predecessor: true,
    legalMix: true,
    traction: true,
    restMargin: true,
  });

  const timelineData = getOperationalTimeline(now);
  const nocturnalSlices = [
    '01:30', '01:45', '02:00', '02:15', '02:30', '02:45',
    '03:00', '03:15', '03:30', '03:45', '04:00', '04:15', '04:30'
  ];
  const activeSlices = timelineMode === 'realtime' ? timelineData.slices : nocturnalSlices;
  const activeCursorPct = timelineMode === 'realtime' ? timelineData.cursorPct : 19;

  const handleDownloadCsv = (filename: string, content: string) => {
    const blob = new Blob([content], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', filename);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleDispatchAuth = () => {
    setDispatchState('transmitting');
    setTimeout(() => {
      setDispatchState('confirmed');
      // Download all manifests
      handleDownloadCsv('RESULTS_DISPATCH_CONFIRMED.csv', RESULTS_CSV);
      setTimeout(() => {
        setDispatchState('idle');
      }, 3000);
    }, 1400);
  };

  return (
    <div className="flex flex-col w-full gap-4 select-none">
      {/* TOP: INTERACTIVE DUAL-TRACK TOPOLOGY HUD & SCHEMATIC */}
      <section className="grid grid-cols-1 xl:grid-cols-12 gap-4 w-full items-start">
        {/* Left Stack: Schematic Canvas + Section Dot Telemetry (9 cols) */}
        <div className="xl:col-span-9 flex flex-col gap-4">
        <div className="bg-white border border-slate-200 rounded-lg p-4 flex flex-col gap-2 shadow-xs relative overflow-hidden">
          {/* Subtle Ambient Gradients */}
          <div className="absolute top-0 right-0 w-96 h-96 bg-sky-600/5 rounded-full blur-3xl pointer-events-none"></div>
          <div className="absolute bottom-0 left-1/3 w-80 h-80 bg-rose-600/5 rounded-full blur-3xl pointer-events-none"></div>

          {/* Canvas Header Bar */}
          <div className="flex flex-wrap items-center justify-between gap-2 pb-2 bg-slate-50 border border-slate-200 rounded p-2.5 mb-2">
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1.5 px-2.5 py-1 bg-sky-50 border border-sky-200 rounded text-sky-800">
                <span className="material-symbols-outlined text-[16px]">device_hub</span>
                <span className="font-mono text-[11px] font-bold uppercase tracking-wider">
                  SCHEMATIC CANVAS // SEC:ALP-BET-GEO
                </span>
              </div>
              <span className="font-mono text-[9px] text-slate-500 uppercase tracking-widest font-semibold hidden md:inline">
                CHAINAGE: KM 14.200 → KM 19.850 [REVERSIBLE ABS DUAL-BLOCK]
              </span>
            </div>

            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1.5 px-2 py-1 bg-white border border-slate-300 rounded text-slate-900">
                <span className="w-2 h-2 rounded-full bg-emerald-600 animate-ping"></span>
                <span className="text-[11px] text-slate-700">
                  SCADA POLLING: <strong className="text-emerald-700 font-mono font-bold">12ms</strong>
                </span>
              </div>
              <div className="flex items-center gap-1 px-2 py-1 bg-rose-50 border border-rose-200 rounded text-rose-700">
                <span className="material-symbols-outlined text-[14px]">bolt</span>
                <span className="text-[11px] font-bold tracking-tight">TRACTION ISOLATED: 1 SECTOR</span>
              </div>
              <div className="flex items-center gap-0.5 bg-white border border-slate-300 rounded p-[2px]">
                {(['ACTIVITIES', 'VECTOR', 'CIRCUITS', 'SENSORS'] as const).map((mode) => (
                  <button
                    key={mode}
                    type="button"
                    onClick={() => setViewMode(mode)}
                    className={`px-2 py-[2px] font-mono text-[10px] rounded transition-all cursor-pointer flex items-center gap-1 ${
                      viewMode === mode
                        ? 'bg-sky-700 text-white font-bold shadow-xs'
                        : 'bg-transparent text-slate-600 hover:text-slate-900 font-medium'
                    }`}
                  >
                    {mode === 'ACTIVITIES' && (
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                    )}
                    <span>{mode}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Interactive SVG Network Schematic */}
          <div className="relative w-full bg-slate-50/80 border border-slate-200 rounded p-2 flex flex-col justify-center min-h-[380px] overflow-x-auto">
            {/* Overlay Hazard Badge for SEC:ALP:H01_H02:EB */}
            <div className="absolute top-6 left-[34%] z-30 flex items-center gap-2 bg-rose-50 border-2 border-rose-600 text-rose-800 px-3 py-1.5 shadow-md rounded">
              <span className="material-symbols-outlined text-[18px] text-rose-600 font-bold">bolt</span>
              <div className="flex flex-col">
                <span className="font-mono text-[11px] font-bold tracking-wider text-rose-700 leading-tight">
                  750V TRACTION DISENGAGED // DEAD-RAIL CONFIRMED
                </span>
                <span className="font-mono text-[9px] text-rose-900 uppercase font-semibold">
                  ISOLATION TICKET: #TL-9021-X • SEC:ALP:H01_H02:EB (0.00 kV)
                </span>
              </div>
            </div>

            {/* Active Track Possession Callout with Quick Jump to Micro-Spatial Gate */}
            <div className="absolute bottom-6 left-[36%] z-30 flex items-center gap-3 bg-white border-2 border-sky-600 text-sky-800 px-3 py-1.5 shadow-md rounded">
              <span className="w-2.5 h-2.5 rounded-full bg-sky-600 shadow-[0_0_8px_rgba(2,132,199,0.6)]"></span>
              <div className="flex flex-col">
                <div className="flex items-center gap-2">
                  <span className="font-mono text-[11px] font-bold text-sky-900">
                    POSS-ID: #8841-ALP [ACTIVE 01:45 → 04:15]
                  </span>
                  <button
                    type="button"
                    onClick={() => onNavigateToView('micro-spatial-gate')}
                    className="px-1.5 py-[1px] bg-sky-700 hover:bg-sky-800 text-white font-mono text-[9px] font-bold rounded flex items-center gap-0.5 cursor-pointer shadow-xs"
                    title="Jump into micro-spatial clearance verification desk"
                  >
                    <span>INSPECT 3D GATE</span>
                    <span className="material-symbols-outlined text-[12px]">open_in_new</span>
                  </button>
                </div>
                <span className="font-mono text-[9px] text-slate-700 font-medium">
                  WORKGROUP: b1 [C001 + C042] • TRACK ACCESS GRANTED
                </span>
              </div>
            </div>

            {/* SVG Track Schematic */}
            <svg
              className="w-full h-auto min-w-[900px] select-none text-slate-500"
              viewBox="0 0 1100 320"
              xmlns="http://www.w3.org/2000/svg"
            >
              <defs>
                <pattern id="hazardHatch" patternTransform="rotate(45 0 0)" patternUnits="userSpaceOnUse" width="12" height="12">
                  <line x1="0" y1="0" x2="0" y2="12" stroke="#DC2626" strokeOpacity="0.35" strokeWidth="3" />
                </pattern>
                <pattern id="clearanceHatch" patternTransform="rotate(-45 0 0)" patternUnits="userSpaceOnUse" width="8" height="8">
                  <line x1="0" y1="0" x2="0" y2="8" stroke="#DC2626" strokeOpacity="0.2" strokeWidth="1.5" />
                </pattern>
                <filter id="cyanGlow" x="-20%" y="-20%" width="140%" height="140%">
                  <feDropShadow dx="0" dy="1" stdDeviation="2" floodColor="#0284C7" floodOpacity="0.3" />
                </filter>
                <filter id="redGlow" x="-20%" y="-20%" width="140%" height="140%">
                  <feDropShadow dx="0" dy="1" stdDeviation="3" floodColor="#DC2626" floodOpacity="0.5" />
                </filter>
                <filter id="goldGlow" x="-30%" y="-30%" width="160%" height="160%">
                  <feDropShadow dx="0" dy="1" stdDeviation="3" floodColor="#D97706" floodOpacity="0.5" />
                </filter>
                <filter id="emeraldGlow" x="-30%" y="-30%" width="160%" height="160%">
                  <feDropShadow dx="0" dy="1" stdDeviation="3" floodColor="#059669" floodOpacity="0.5" />
                </filter>
                <marker id="arrowRedEB" markerWidth="8" markerHeight="6" refX="7" refY="3" orient="auto">
                  <polygon points="0 0, 8 3, 0 6" fill="#DC2626" />
                </marker>
                <marker id="arrowRedWB" markerWidth="8" markerHeight="6" refX="1" refY="3" orient="auto">
                  <polygon points="8 0, 0 3, 8 6" fill="#DC2626" />
                </marker>
                <marker id="arrowGreenEB" markerWidth="8" markerHeight="6" refX="7" refY="3" orient="auto">
                  <polygon points="0 0, 8 3, 0 6" fill="#059669" />
                </marker>
                <marker id="arrowGreenWB" markerWidth="8" markerHeight="6" refX="1" refY="3" orient="auto">
                  <polygon points="8 0, 0 3, 8 6" fill="#059669" />
                </marker>
              </defs>

              {/* Chainage Ruler */}
              <g fill="#64748B" fontSize="9" fontFamily="JetBrains Mono" opacity="0.85">
                <line x1="60" y1="20" x2="1040" y2="20" stroke="#CBD5E1" strokeWidth="1" strokeDasharray="4 4" />
                <text x="60" y="14">KM 14.200</text>
                <text x="210" y="14">KM 15.100</text>
                <text x="360" y="14">KM 16.400</text>
                <text x="520" y="14">KM 17.200 [INTERCHANGE H01]</text>
                <text x="690" y="14">KM 18.150 [INTERCHANGE H02]</text>
                <text x="880" y="14">KM 19.000</text>
                <text x="1010" y="14">KM 19.850</text>
              </g>

              {/* Line Alpha (Red Line) */}
              <g id="line-alpha">
                <rect x="10" y="50" width="52" height="22" rx="4" fill="#DC2626" />
                <text x="36" y="65" textAnchor="middle" fill="#FFFFFF" fontFamily="Inter" fontSize="11" fontWeight="800">
                  ALP
                </text>
                <text x="70" y="54" fill="#DC2626" fontFamily="Inter" fontSize="11" fontWeight="700">
                  Metro Line Alpha (Red Line)
                </text>
                <text x="70" y="72" fill="#DC2626" fontFamily="JetBrains Mono" fontSize="10" fontWeight="700">
                  ALP:EB
                </text>

                {/* Track Alpha EB */}
                {selectedRouteId === 'ALP-EB' && (
                  <path d="M 120 68 L 1030 68" fill="none" stroke="#0284C7" strokeWidth="9" strokeOpacity="0.45" strokeDasharray="8 4" />
                )}
                <path d="M 120 68 L 440 68" fill="none" stroke="#DC2626" strokeWidth="3.5" />
                {/* Possession Sector Hatch */}
                <rect x="440" y="55" width="280" height="26" fill="url(#hazardHatch)" />
                <path d="M 440 68 L 720 68" fill="none" stroke="#DC2626" strokeWidth="4.5" filter="url(#redGlow)" />
                <path d="M 720 68 L 1030 68" fill="none" stroke="#DC2626" strokeWidth="3.5" markerEnd="url(#arrowRedEB)" />
                <text x="1042" y="72" fill="#DC2626" fontFamily="JetBrains Mono" fontSize="10" fontWeight="700">
                  EB
                </text>

                {/* Track Alpha WB */}
                <text x="70" y="122" fill="#DC2626" fontFamily="JetBrains Mono" fontSize="10" fontWeight="700">
                  ALP:WB
                </text>
                {selectedRouteId === 'ALP-WB' && (
                  <path d="M 120 118 L 1030 118" fill="none" stroke="#0284C7" strokeWidth="9" strokeOpacity="0.45" strokeDasharray="8 4" />
                )}
                <rect x="420" y="107" width="320" height="22" fill="url(#clearanceHatch)" />
                <path d="M 120 118 L 1030 118" fill="none" stroke="#DC2626" strokeWidth="3" strokeDasharray="6 4" />
                <path d="M 128 118 L 118 118" fill="none" stroke="#DC2626" strokeWidth="3" markerStart="url(#arrowRedWB)" />
                <text x="98" y="122" fill="#DC2626" fontFamily="JetBrains Mono" fontSize="10" fontWeight="700">
                  WB
                </text>

                {/* Crossover Turnouts Alpha */}
                <path d="M 400 68 L 440 118" stroke="#DC2626" strokeWidth="2" strokeDasharray="3 3" opacity="0.6" />
                <path d="M 720 118 L 760 68" stroke="#DC2626" strokeWidth="2" strokeDasharray="3 3" opacity="0.6" />
                <polygon points="400,68 405,64 410,68 405,72" fill="#DC2626" />
                <polygon points="755,68 760,64 765,68 760,72" fill="#DC2626" />

                {/* Alpha Stations S01 to S08 */}
                {[
                  { id: 'S01', cx: 190 },
                  { id: 'S02', cx: 270 },
                  { id: 'S03', cx: 350 },
                  { id: 'S04', cx: 430 },
                  { id: 'S05', cx: 770 },
                  { id: 'S06', cx: 840 },
                  { id: 'S07', cx: 910 },
                  { id: 'S08', cx: 980 },
                ].map((st) => {
                  const act = SECTION_DOT_ACTIVITIES[st.id];
                  const isSelected = selectedStation === st.id;
                  const isPossession = act?.status === 'POSSESSION_WORKZONE';
                  const isApproaching = act?.status === 'APPROACHING_TRAFFIC';
                  const isTSR = act?.status === 'RESTRICTED_TSR';

                  return (
                    <g
                      key={st.id}
                      className="cursor-pointer group"
                      onClick={() => setSelectedStation(st.id)}
                    >
                      {/* Selection Halo */}
                      {isSelected && (
                        <circle
                          cx={st.cx}
                          cy="93"
                          r="34"
                          fill="none"
                          stroke="#0284C7"
                          strokeWidth="2.5"
                          strokeDasharray="4 3"
                          className="animate-spin"
                          style={{ transformOrigin: `${st.cx}px 93px`, animationDuration: '6s' }}
                        />
                      )}

                      {/* Live Activity Pulsing Ring */}
                      {isPossession && (
                        <circle cx={st.cx} cy="68" r="10" fill="#DC2626" opacity="0.35" className="animate-ping" />
                      )}
                      {isApproaching && (
                        <circle cx={st.cx} cy="118" r="10" fill="#D97706" opacity="0.4" className="animate-ping" />
                      )}

                      {/* Station Track Dots */}
                      <circle
                        cx={st.cx}
                        cy="68"
                        r={isSelected ? 7.5 : 6}
                        fill={isPossession ? '#FEE2E2' : '#FFFFFF'}
                        stroke={isPossession ? '#DC2626' : isSelected ? '#0284C7' : '#DC2626'}
                        strokeWidth={isPossession || isSelected ? 3.5 : 3}
                        className="group-hover:scale-125 transition-transform"
                      />
                      <circle
                        cx={st.cx}
                        cy="118"
                        r={isSelected ? 7.5 : 6}
                        fill={isApproaching || isTSR ? '#FEF3C7' : '#FFFFFF'}
                        stroke={isApproaching ? '#D97706' : isSelected ? '#0284C7' : '#DC2626'}
                        strokeWidth={isApproaching || isSelected ? 3.5 : 3}
                      />

                      {/* Station Label & Activity Indicator Badge */}
                      <text
                        x={st.cx}
                        y="46"
                        textAnchor="middle"
                        fill={isSelected ? '#0284C7' : isPossession ? '#DC2626' : '#0F172A'}
                        fontFamily="JetBrains Mono"
                        fontSize={isSelected ? '11' : '10'}
                        fontWeight="700"
                      >
                        {st.id}
                      </text>
                      {/* Sub-label showing dot status icon/badge */}
                      {act && (
                        <text
                          x={st.cx}
                          y="56"
                          textAnchor="middle"
                          fill={isPossession ? '#DC2626' : isApproaching ? '#B45309' : '#64748B'}
                          fontFamily="JetBrains Mono"
                          fontSize="7"
                          fontWeight="bold"
                        >
                          {isPossession ? '●POSS' : isApproaching ? '●APPR' : isTSR ? '●TSR' : '○OK'}
                        </text>
                      )}
                      <title>{`${act?.name || st.id}: ${act?.currentActivity || 'Normal nominal operation'}`}</title>
                    </g>
                  );
                })}

                {/* Alpha Interchange Stations H01 & H02 */}
                <g
                  className="cursor-pointer group"
                  onClick={() => setSelectedStation('H01')}
                >
                  {selectedStation === 'H01' && (
                    <rect x="490" y="48" width="38" height="90" rx="6" fill="none" stroke="#0284C7" strokeWidth="2.5" strokeDasharray="4 3" />
                  )}
                  <circle cx="509" cy="68" r="10" fill="#DC2626" opacity="0.4" className="animate-ping" />
                  <rect x="495" y="54" width="28" height="78" rx="4" fill="#FEF2F2" stroke="#DC2626" strokeWidth="2" />
                  <text x="509" y="44" textAnchor="middle" fill="#DC2626" fontFamily="JetBrains Mono" fontSize="10" fontWeight="700">
                    H01
                  </text>
                  <text x="509" y="52" textAnchor="middle" fill="#B91C1C" fontFamily="JetBrains Mono" fontSize="6.5" fontWeight="bold">
                    ●TAMP
                  </text>
                  <circle cx="509" cy="68" r="5" fill="#DC2626" />
                  <circle cx="509" cy="118" r="4.5" fill="#DC2626" />
                  <title>H01 Interchange: Ballast Vibration Tamping Active (Consist C001, Workgroup b1)</title>
                </g>

                <g
                  className="cursor-pointer group"
                  onClick={() => setSelectedStation('H02')}
                >
                  {selectedStation === 'H02' && (
                    <rect x="675" y="48" width="38" height="90" rx="6" fill="none" stroke="#0284C7" strokeWidth="2.5" strokeDasharray="4 3" />
                  )}
                  <circle cx="694" cy="68" r="10" fill="#DC2626" opacity="0.4" className="animate-ping" />
                  <rect x="680" y="54" width="28" height="78" rx="4" fill="#FEF2F2" stroke="#DC2626" strokeWidth="2" />
                  <text x="694" y="44" textAnchor="middle" fill="#DC2626" fontFamily="JetBrains Mono" fontSize="10" fontWeight="700">
                    H02
                  </text>
                  <text x="694" y="52" textAnchor="middle" fill="#B91C1C" fontFamily="JetBrains Mono" fontSize="6.5" fontWeight="bold">
                    ●SCAN
                  </text>
                  <circle cx="694" cy="68" r="5" fill="#DC2626" />
                  <circle cx="694" cy="118" r="4.5" fill="#DC2626" />
                  <title>H02 Interchange: Ultrasonic NDT Probing Active (Consist C042, Workgroup b1)</title>
                </g>
              </g>

              {/* Interchange Connecting Box */}
              <g id="crossover-interchange">
                <rect
                  x="475"
                  y="44"
                  width="250"
                  height="180"
                  rx="6"
                  fill="#1E293B"
                  fillOpacity="0.04"
                  stroke="#94A3B8"
                  strokeWidth="1.5"
                  strokeDasharray="4 4"
                />
                <rect x="525" y="138" width="150" height="24" rx="4" fill="#1E293B" stroke="#334155" strokeWidth="1" />
                <text x="600" y="150" textAnchor="middle" fill="#FFFFFF" fontFamily="JetBrains Mono" fontSize="9" fontWeight="700">
                  Live-only crossover
                </text>
                <text x="600" y="158" textAnchor="middle" fill="#94A3B8" fontFamily="JetBrains Mono" fontSize="7.5">
                  Non-Live: fully independent
                </text>
                <path d="M 509 132 L 509 196" stroke="#0284C7" strokeWidth="1.5" strokeDasharray="3 3" />
                <path d="M 694 132 L 694 196" stroke="#0284C7" strokeWidth="1.5" strokeDasharray="3 3" />
              </g>

              {/* Line Beta (Green Line) */}
              <g id="line-beta">
                <rect x="10" y="206" width="52" height="22" rx="4" fill="#059669" />
                <text x="36" y="221" textAnchor="middle" fill="#FFFFFF" fontFamily="Inter" fontSize="11" fontWeight="800">
                  BET
                </text>
                <text x="70" y="210" fill="#059669" fontFamily="Inter" fontSize="11" fontWeight="700">
                  Metro Line Beta (Green Line)
                </text>
                <text x="70" y="228" fill="#059669" fontFamily="JetBrains Mono" fontSize="10" fontWeight="700">
                  BET:EB
                </text>
                {selectedRouteId === 'BET-EB' && (
                  <path d="M 120 224 L 1030 224" fill="none" stroke="#0284C7" strokeWidth="9" strokeOpacity="0.45" strokeDasharray="8 4" />
                )}
                <path d="M 120 224 L 1030 224" fill="none" stroke="#059669" strokeWidth="3.5" markerEnd="url(#arrowGreenEB)" />
                <text x="1042" y="228" fill="#059669" fontFamily="JetBrains Mono" fontSize="10" fontWeight="700">
                  EB
                </text>

                <text x="70" y="274" fill="#059669" fontFamily="JetBrains Mono" fontSize="10" fontWeight="700">
                  BET:WB
                </text>
                {selectedRouteId === 'BET-WB' && (
                  <path d="M 120 270 L 1030 270" fill="none" stroke="#0284C7" strokeWidth="9" strokeOpacity="0.45" strokeDasharray="8 4" />
                )}
                <path d="M 120 270 L 1030 270" fill="none" stroke="#059669" strokeWidth="3" strokeDasharray="6 4" />
                <path d="M 128 270 L 118 270" fill="none" stroke="#059669" strokeWidth="3" markerStart="url(#arrowGreenWB)" />
                <text x="98" y="274" fill="#059669" fontFamily="JetBrains Mono" fontSize="10" fontWeight="700">
                  WB
                </text>

                {/* Beta Stations S11 to S18 */}
                {[
                  { id: 'S11', cx: 190 },
                  { id: 'S12', cx: 270 },
                  { id: 'S13', cx: 350 },
                  { id: 'S14', cx: 430 },
                  { id: 'S15', cx: 770 },
                  { id: 'S16', cx: 840 },
                  { id: 'S17', cx: 910 },
                  { id: 'S18', cx: 980 },
                ].map((st) => {
                  const act = SECTION_DOT_ACTIVITIES[st.id];
                  const isSelected = selectedStation === st.id;
                  const isSweep = act?.status === 'SWEEP_ACTIVE';
                  const isHotWork = act?.status === 'HOT_WORK_FUSION';

                  return (
                    <g
                      key={st.id}
                      className="cursor-pointer group"
                      onClick={() => setSelectedStation(st.id)}
                    >
                      {/* Selection Halo */}
                      {isSelected && (
                        <circle
                          cx={st.cx}
                          cy="247"
                          r="34"
                          fill="none"
                          stroke="#0284C7"
                          strokeWidth="2.5"
                          strokeDasharray="4 3"
                          className="animate-spin"
                          style={{ transformOrigin: `${st.cx}px 247px`, animationDuration: '6s' }}
                        />
                      )}

                      {/* Live Activity Pulsing Ring */}
                      {isSweep && (
                        <circle cx={st.cx} cy="270" r="10" fill="#059669" opacity="0.4" className="animate-ping" />
                      )}
                      {isHotWork && (
                        <circle cx={st.cx} cy="224" r="10" fill="#D97706" opacity="0.4" className="animate-ping" />
                      )}

                      {/* Station Track Dots */}
                      <circle
                        cx={st.cx}
                        cy="224"
                        r={isSelected ? 7.5 : 6}
                        fill={isHotWork ? '#FEF3C7' : '#FFFFFF'}
                        stroke={isHotWork ? '#D97706' : isSelected ? '#0284C7' : '#059669'}
                        strokeWidth={isHotWork || isSelected ? 3.5 : 3}
                        className="group-hover:scale-125 transition-transform"
                      />
                      <circle
                        cx={st.cx}
                        cy="270"
                        r={isSelected ? 7.5 : 6}
                        fill={isSweep ? '#D1FAE5' : '#FFFFFF'}
                        stroke={isSweep ? '#059669' : isSelected ? '#0284C7' : '#059669'}
                        strokeWidth={isSweep || isSelected ? 3.5 : 3}
                      />

                      {/* Station Label & Activity Indicator Badge */}
                      <text
                        x={st.cx}
                        y="292"
                        textAnchor="middle"
                        fill={isSelected ? '#0284C7' : isSweep ? '#047857' : isHotWork ? '#B45309' : '#0F172A'}
                        fontFamily="JetBrains Mono"
                        fontSize={isSelected ? '11' : '10'}
                        fontWeight="700"
                      >
                        {st.id}
                      </text>
                      {/* Sub-label showing dot status icon/badge */}
                      {act && (
                        <text
                          x={st.cx}
                          y="302"
                          textAnchor="middle"
                          fill={isSweep ? '#047857' : isHotWork ? '#B45309' : '#64748B'}
                          fontFamily="JetBrains Mono"
                          fontSize="7"
                          fontWeight="bold"
                        >
                          {isSweep ? '●SWEEP' : isHotWork ? '●WELD' : '○OK'}
                        </text>
                      )}
                      <title>{`${act?.name || st.id}: ${act?.currentActivity || 'Normal nominal operation'}`}</title>
                    </g>
                  );
                })}

                {/* Beta Interchange Stations H01 & H02 */}
                <g
                  className="cursor-pointer group"
                  onClick={() => setSelectedStation('H01')}
                >
                  {selectedStation === 'H01' && (
                    <rect x="490" y="200" width="38" height="90" rx="6" fill="none" stroke="#0284C7" strokeWidth="2.5" strokeDasharray="4 3" />
                  )}
                  <rect x="495" y="206" width="28" height="78" rx="4" fill="#D97706" stroke="#B45309" strokeWidth="2" />
                  <text x="509" y="300" textAnchor="middle" fill="#D97706" fontFamily="JetBrains Mono" fontSize="10" fontWeight="700">
                    H01
                  </text>
                  <text x="509" y="308" textAnchor="middle" fill="#B45309" fontFamily="JetBrains Mono" fontSize="6.5" fontWeight="bold">
                    HUB
                  </text>
                  <circle cx="509" cy="224" r="4.5" fill="#059669" />
                  <circle cx="509" cy="270" r="4.5" fill="#059669" />
                  <title>Beta H01 Interchange Platform: Nominal Transfer Routing</title>
                </g>

                <g
                  className="cursor-pointer group"
                  onClick={() => setSelectedStation('H02')}
                >
                  {selectedStation === 'H02' && (
                    <rect x="675" y="200" width="38" height="90" rx="6" fill="none" stroke="#0284C7" strokeWidth="2.5" strokeDasharray="4 3" />
                  )}
                  <circle cx="694" cy="224" r="10" fill="#D97706" opacity="0.4" className="animate-ping" />
                  <rect x="680" y="206" width="28" height="78" rx="4" fill="#D97706" stroke="#B45309" strokeWidth="2" />
                  <text x="694" y="300" textAnchor="middle" fill="#D97706" fontFamily="JetBrains Mono" fontSize="10" fontWeight="700">
                    H02
                  </text>
                  <text x="694" y="308" textAnchor="middle" fill="#B45309" fontFamily="JetBrains Mono" fontSize="6.5" fontWeight="bold">
                    ●WELD-X
                  </text>
                  <circle cx="694" cy="224" r="5" fill="#059669" />
                  <circle cx="694" cy="270" r="4.5" fill="#059669" />
                  <title>Beta H02 Platform: Adjacent Flash-Butt Rail Welding (Rig C019)</title>
                </g>
              </g>

              {/* Route Activity Overlays when in ACTIVITIES mode */}
              {viewMode === 'ACTIVITIES' && (
                <g id="activities-overlay">
                  {/* ALP:EB Possession zone flag */}
                  <rect x="440" y="32" width="280" height="18" rx="3" fill="#FEF2F2" stroke="#EF4444" strokeWidth="1" />
                  <text x="580" y="44" textAnchor="middle" fill="#B91C1C" fontFamily="JetBrains Mono" fontSize="8" fontWeight="bold">
                    ROUTE ALP:EB // POSSESSION #8841 (KM 16.420 - 18.150) • ZERO TRAFFIC PERMITTED
                  </text>

                  {/* ALP:WB TSR flag */}
                  <rect x="220" y="138" width="260" height="18" rx="3" fill="#FFFBEB" stroke="#F59E0B" strokeWidth="1" />
                  <text x="350" y="150" textAnchor="middle" fill="#B45309" fontFamily="JetBrains Mono" fontSize="8" fontWeight="bold">
                    ROUTE ALP:WB // TSR 25 KM/H ACTIVE (ADJACENT CORRIDOR WORKERS)
                  </text>

                  {/* BET:EB Hot-Work flag */}
                  <rect x="680" y="194" width="220" height="16" rx="3" fill="#FFFBEB" stroke="#D97706" strokeWidth="1" />
                  <text x="790" y="205" textAnchor="middle" fill="#B45309" fontFamily="JetBrains Mono" fontSize="7.5" fontWeight="bold">
                    BET:EB // SEC:BET:H02 FLASH-BUTT WELDING
                  </text>

                  {/* BET:WB Sweep flag */}
                  <rect x="800" y="294" width="230" height="16" rx="3" fill="#ECFDF5" stroke="#10B981" strokeWidth="1" />
                  <text x="915" y="305" textAnchor="middle" fill="#047857" fontFamily="JetBrains Mono" fontSize="7.5" fontWeight="bold">
                    BET:WB // DYNAMIC SHUNT SWEEP PASSING S17
                  </text>
                </g>
              )}

              {/* Circuits or Sensor Overlays if active */}
              {viewMode === 'CIRCUITS' && (
                <g id="circuits-overlay">
                  <line x1="440" y1="36" x2="720" y2="36" stroke="#DC2626" strokeWidth="2" strokeDasharray="2 2" />
                  <text x="580" y="32" textAnchor="middle" fill="#DC2626" fontFamily="JetBrains Mono" fontSize="8" fontWeight="bold">
                    DC ISOLATION ZONE #ISO-ALP-42
                  </text>
                </g>
              )}

              {viewMode === 'SENSORS' && (
                <g id="sensors-overlay">
                  <circle cx="360" cy="118" r="8" fill="#DC2626" opacity="0.3" className="animate-ping" />
                  <circle cx="360" cy="118" r="4" fill="#DC2626" />
                  <text x="360" y="104" textAnchor="middle" fill="#DC2626" fontFamily="JetBrains Mono" fontSize="8" fontWeight="bold">
                    DEFECT KM 16.420
                  </text>
                </g>
              )}
            </svg>

            {/* Dynamic Sensor Strip Overlay under Schematic */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mt-2 pt-1 bg-white border border-slate-200 rounded p-1.5 shadow-xs">
              <div className="flex items-center justify-between px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded">
                <span className="font-mono text-[10px] text-slate-500 font-semibold">ALP:EB (H01-H02)</span>
                <span className="font-mono text-[11px] font-bold text-rose-700">0.00 kV [ISO]</span>
              </div>
              <div className="flex items-center justify-between px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded">
                <span className="font-mono text-[10px] text-slate-500 font-semibold">ALP:WB (CLEARANCE)</span>
                <span className="font-mono text-[11px] font-bold text-emerald-700">752.4 V [NOM]</span>
              </div>
              <div className="flex items-center justify-between px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded">
                <span className="font-mono text-[10px] text-slate-500 font-semibold">BET:EB (TRUNK)</span>
                <span className="font-mono text-[11px] font-bold text-sky-800">748.9 V [NOM]</span>
              </div>
              <div className="flex items-center justify-between px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded">
                <span className="font-mono text-[10px] text-slate-500 font-semibold">INTERLOCK STATUS</span>
                <span className="font-mono text-[11px] font-bold text-emerald-700 flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-emerald-600"></span>LOCKED #TL-9021
                </span>
              </div>
            </div>

            {/* Station Inspection Telemetry Strip when selected */}
            {selectedStation && (
              <div className="mt-2 p-2 bg-sky-50 border border-sky-300 rounded flex flex-wrap items-center justify-between gap-2 text-[11px] font-mono animate-in fade-in">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-sky-600 animate-ping"></span>
                  <span className="font-bold text-sky-900">STATION {selectedStation} TELEMETRY:</span>
                  <span className="text-slate-700">
                    Platform Screen Doors: SECURED • Nearest Traffic:{' '}
                    {selectedStation === 'S02' || selectedStation === 'S03'
                      ? 'Scout TR-402 (Approaching, WB 24.8 km/h • TSR)'
                      : selectedStation === 'H01' || selectedStation === 'H02'
                      ? 'Workgroup b1 C001+C042 (Isolated Workzone KM 17.320)'
                      : selectedStation === 'S17' || selectedStation === 'S16'
                      ? 'Sweep Train RV-108 (Passing S17, WB 58.5 km/h)'
                      : 'Route Nominal (Normal ATP Shunt Polling)'}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => setSelectedStation(null)}
                  className="text-sky-700 hover:text-sky-900 font-bold px-1.5 py-0.5 rounded cursor-pointer hover:bg-sky-100"
                >
                  ✕ Close
                </button>
              </div>
            )}
          </div>
        </div>

        <SectionDotInspector
          selectedDotId={selectedStation}
          onSelectDot={(dotId) => setSelectedStation(dotId)}
          onNavigateToView={onNavigateToView}
        />
        </div>

        {/* Right Telemetry & Track Access Monitor (3 cols) */}
        <div className="xl:col-span-3 flex flex-col gap-4">
          {/* Sector Possession Queue Ticker */}
          <div className="bg-white border border-slate-200 rounded-lg p-3.5 shadow-xs flex-1 flex flex-col justify-between">
            <div className="flex items-center justify-between pb-1.5 border-b border-slate-100">
              <span className="font-mono text-[11px] font-bold uppercase tracking-wider text-slate-600">
                UPCOMING POSSESSIONS (02:00-05:00)
              </span>
              <span className="font-mono text-[9px] text-sky-800 font-bold">{possessions.length} SLOTS QUEUED</span>
            </div>

            <div className="flex flex-col gap-1.5 my-2">
              {possessions.map((q) => (
                <div key={q.id} className="p-2 bg-slate-50 border border-slate-200 rounded flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span
                      className={`w-1.5 h-6 rounded-sm ${
                        q.riskLevel === 'AMBER' ? 'bg-amber-500' : 'bg-slate-400'
                      }`}
                    ></span>
                    <div>
                      <span className="font-mono text-[11px] text-slate-900 font-bold block">{q.code}</span>
                      <span className="font-mono text-[9px] text-slate-500 block">{q.contractor}</span>
                    </div>
                  </div>
                  <span className="font-mono text-[11px] text-sky-800 font-bold">{q.timeWindow}</span>
                </div>
              ))}
            </div>

            <div className="bg-slate-50 border border-slate-200 rounded p-2 flex items-center justify-between">
              <span className="font-mono text-[9px] text-slate-500 uppercase font-semibold">
                POSSESSION HANDOVER PROTOCOL
              </span>
              <span className="font-mono text-[10px] text-sky-800 font-bold">STANDARD B-3</span>
            </div>
          </div>
        </div>
      </section>

      {/* BOTTOM: GANTT POSSESSION TIMELINE & RIGHT DISPATCH VALIDATION PANEL */}
      <section className="grid grid-cols-1 xl:grid-cols-12 gap-4 w-full">
        {/* Gantt-Style Possession Timeline (8 cols) */}
        <div className="xl:col-span-8 self-start bg-white border border-slate-200 rounded-lg p-4 shadow-xs flex flex-col gap-2">
          {/* Gantt Header & Legend */}
          <div className="flex flex-wrap items-center justify-between gap-2 pb-2 bg-slate-50 border border-slate-200 rounded p-2 mb-2">
            <div className="flex items-center gap-3">
              <span className="font-mono text-[11px] font-bold uppercase tracking-wider text-sky-800 flex items-center gap-1">
                <span className="material-symbols-outlined text-[16px]">view_timeline</span>
                OCCUPANCY DISPATCH TIMELINE // SCENARIO C
              </span>
              <span className="font-mono text-[9px] text-slate-500 hidden sm:inline">
                RESOLUTION: 15-MIN BUCKETS • WINDOW: {activeSlices[0]} → {activeSlices[12]} ({timelineMode === 'realtime' ? 'LIVE SYNC' : 'NOCTURNAL'})
              </span>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={onToggleTimelineMode}
                className={`px-2 py-0.5 rounded font-mono text-[9px] font-bold border transition-colors cursor-pointer flex items-center gap-1 ${
                  timelineMode === 'realtime'
                    ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
                    : 'bg-white text-slate-700 hover:bg-slate-100 border-slate-300'
                }`}
                title="Toggle between Actual Real-Time window and Nocturnal Maintenance Shift"
              >
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-pulse"></span>
                <span>{timelineMode === 'realtime' ? 'ACTUAL TIME: ACTIVE' : 'USE ACTUAL TIME'}</span>
              </button>

              <div className="flex items-center gap-3 font-mono text-[9px] hidden lg:flex">
                <span className="flex items-center gap-1 text-slate-700 font-semibold">
                  <span className="w-2.5 h-2.5 bg-emerald-100 border border-emerald-600 rounded-sm"></span> [PC] Primary Contractor
                </span>
                <span className="flex items-center gap-1 text-slate-700 font-semibold">
                  <span className="w-2.5 h-2.5 bg-sky-700 rounded-sm"></span> [C] Subcontractor
                </span>
                <span className="flex items-center gap-1 text-slate-700 font-semibold">
                  <span className="w-2.5 h-2.5 bg-rose-100 border border-rose-500 rounded-sm"></span> [BUFF] Traction Iso Buffer
                </span>
              </div>
            </div>
          </div>

          {/* Timeline Main Grid Container */}
          <div className="relative w-full overflow-x-auto bg-slate-50 border border-slate-200 rounded p-3">
            {/* 15-Minute Header Increments = 12 slices */}
            <div className="grid grid-cols-12 gap-0 border-b border-slate-300 pb-1.5 text-center font-mono text-[9px] text-slate-500 font-semibold">
              <div className="text-left">{activeSlices[0]}</div>
              <div>{activeSlices[1]}</div>
              <div>{activeSlices[2]}</div>
              <div>{activeSlices[3]}</div>
              <div>{activeSlices[4]}</div>
              <div>{activeSlices[5]}</div>
              <div>{activeSlices[6]}</div>
              <div>{activeSlices[7]}</div>
              <div>{activeSlices[8]}</div>
              <div>{activeSlices[9]}</div>
              <div>{activeSlices[10]}</div>
              <div className="text-right">{activeSlices[12]}</div>
            </div>

            {/* Background Vertical Timeline Guides */}
            <div className="absolute inset-x-3 top-8 bottom-3 grid grid-cols-12 pointer-events-none opacity-40">
              {Array.from({ length: 12 }).map((_, i) => (
                <div key={i} className="border-r border-slate-300 h-full"></div>
              ))}
            </div>

            {/* DYNAMIC LIVE TIME CURSOR: Real-time updated every second using actual time */}
            <div
              className="absolute top-2 bottom-3 w-[2px] bg-rose-600 z-30 pointer-events-none shadow-[0_0_6px_rgba(220,38,38,0.6)] transition-all duration-500"
              style={{ left: `${activeCursorPct}%` }}
            >
              <div className="absolute -top-3.5 -left-8 px-1.5 py-0.5 bg-rose-600 text-white font-mono text-[9px] font-bold rounded shadow-xs whitespace-nowrap flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-white animate-ping"></span>
                <span>{hh}:{mm}:{ss}{amPm ? ' ' + amPm : ''}</span>
              </div>
            </div>

            {/* Timeline Rows */}
            <div className="flex flex-col gap-2.5 mt-3 relative z-10">
              {/* Lane 1: LINE ALP - SEC:H01_H02 (EB) */}
              <div className="flex items-center gap-2">
                <div className="w-48 shrink-0 flex flex-col">
                  <span className="font-mono text-[10px] font-bold text-rose-700 truncate flex items-center gap-1">
                    <span className="w-2 h-2 rounded-full bg-rose-600"></span>LINE ALP - SEC:H01_H02
                  </span>
                  <span className="font-mono text-[9px] text-slate-500">EASTBOUND (EB)</span>
                </div>
                <div className="flex-1 relative h-10 bg-white border border-slate-300 rounded overflow-hidden">
                  {/* Buffer Exclusion 01:30 - 01:45 */}
                  <div className="absolute left-0 top-0 bottom-0 w-[8.33%] bg-rose-100 flex items-center justify-center border-r border-rose-300">
                    <span className="font-mono text-[8px] text-rose-800 font-bold tracking-tighter">BUFF</span>
                  </div>
                  {/* Main Slot Block b1: 01:45 - 03:45 */}
                  <div
                    onClick={() => onNavigateToView('micro-spatial-gate')}
                    className="absolute left-[8.33%] top-1 bottom-1 w-[66.67%] bg-emerald-100/90 border border-emerald-600 text-emerald-950 px-2 flex items-center justify-between shadow-xs group cursor-pointer hover:bg-emerald-200 transition-colors rounded"
                    title="Click to inspect micro-spatial 3D envelope for group b1"
                  >
                    <div className="flex items-center gap-2 overflow-hidden">
                      <span className="material-symbols-outlined text-[16px] text-emerald-700">handshake</span>
                      <div className="flex flex-col min-w-0">
                        <span className="font-mono text-[10px] font-bold truncate text-slate-900">
                          co_share_group: &quot;b1: C001 [PC] + C042 [C]&quot;
                        </span>
                        <span className="font-mono text-[8px] text-emerald-800 font-semibold truncate">
                          LEGAL CO-SHARING COMPLIANT • RAIL GRINDING &amp; ULTRASONIC CHECK
                        </span>
                      </div>
                    </div>
                    <div className="hidden sm:flex items-center gap-1 shrink-0">
                      <span className="px-1.5 py-[1px] bg-white border border-emerald-300 text-emerald-800 font-mono text-[9px] font-bold rounded">
                        POSS-8841
                      </span>
                      <span className="px-1.5 py-[1px] bg-white border border-emerald-300 text-sky-800 font-mono text-[9px] font-bold rounded">
                        2h 00m
                      </span>
                    </div>
                  </div>
                  {/* Post Buffer Exclusion 03:45 - 04:00 */}
                  <div className="absolute left-[75%] top-0 bottom-0 w-[8.33%] bg-rose-100 flex items-center justify-center border-l border-r border-rose-300">
                    <span className="font-mono text-[8px] text-rose-800 font-bold tracking-tighter">BUFF</span>
                  </div>
                </div>
              </div>

              {/* Lane 2: LINE ALP - SEC:H01_H02 (WB) */}
              <div className="flex items-center gap-2">
                <div className="w-48 shrink-0 flex flex-col">
                  <span className="font-mono text-[10px] font-bold text-slate-900 truncate">LINE ALP - SEC:H01_H02</span>
                  <span className="font-mono text-[9px] text-slate-500">WESTBOUND (WB)</span>
                </div>
                <div className="flex-1 relative h-10 bg-white border border-slate-300 rounded flex items-center">
                  <div className="absolute left-0 right-0 top-1 bottom-1 bg-slate-100 border border-slate-200 rounded flex items-center px-3 justify-between">
                    <span className="font-mono text-[9px] text-slate-600 font-medium truncate">
                      SPEED RESTRICTION 25 KM/H ACTIVE FOR ADJACENT WORKERS • NO TRACK POSSESSION
                    </span>
                    <span className="font-mono text-[9px] text-emerald-700 font-bold shrink-0">PASS-THROUGH CLEAR</span>
                  </div>
                </div>
              </div>

              {/* Lane 3: LINE BET - INTERCHANGE (EB) */}
              <div className="flex items-center gap-2">
                <div className="w-48 shrink-0 flex flex-col">
                  <span className="font-mono text-[10px] font-bold text-emerald-700 truncate">LINE BET - INTERCHANGE</span>
                  <span className="font-mono text-[9px] text-slate-500">EASTBOUND (EB)</span>
                </div>
                <div className="flex-1 relative h-10 bg-white border border-slate-300 rounded">
                  <div className="absolute left-[25%] top-1 bottom-1 w-[58.33%] bg-amber-100 border border-amber-400 text-slate-900 px-2 flex items-center justify-between shadow-xs rounded">
                    <div className="flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-amber-600 animate-pulse"></span>
                      <div className="flex flex-col">
                        <span className="font-mono text-[10px] font-bold text-amber-900">
                          b2: C019 [Heavy Rail Welder Rig]
                        </span>
                        <span className="font-mono text-[8px] text-amber-800 font-medium">
                          AUTONOMOUS FLASH-BUTT JOINT REPAIR • AMBER NOTICE
                        </span>
                      </div>
                    </div>
                    <span className="font-mono text-[10px] text-amber-900 font-bold">02:15 → 04:00</span>
                  </div>
                </div>
              </div>

              {/* Lane 4: LINE BET - INTERCHANGE (WB) */}
              <div className="flex items-center gap-2">
                <div className="w-48 shrink-0 flex flex-col">
                  <span className="font-mono text-[10px] font-bold text-slate-900 truncate">LINE BET - INTERCHANGE</span>
                  <span className="font-mono text-[9px] text-slate-500">WESTBOUND (WB)</span>
                </div>
                <div className="flex-1 relative h-10 bg-white border border-slate-300 rounded flex items-center px-3 justify-between">
                  <span className="font-mono text-[9px] text-slate-500 font-medium">
                    REVENUE RECOVERY CORRIDOR • CONTINGENCY BUFFER OPEN
                  </span>
                  <span className="font-mono text-[9px] text-slate-600 font-semibold">NO CONFLICT</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Dispatch Control & Validation Panel (4 cols) */}
        <div className="xl:col-span-4 bg-white border border-slate-200 rounded-lg p-4 shadow-xs flex flex-col justify-between gap-3">
          {/* Validation KPI Card */}
          <div className="bg-slate-50 border border-slate-200 rounded-lg p-3 flex flex-col gap-2">
            <div className="flex items-center justify-between">
              <span className="font-mono text-[11px] font-bold uppercase tracking-wider text-slate-900">
                PRE-DISPATCH VALIDATOR
              </span>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div className="bg-white border border-slate-200 rounded p-2.5 flex flex-col justify-between shadow-xs">
                <span className="font-mono text-[9px] text-slate-500 uppercase font-semibold">HARD CONSTRAINTS</span>
                <div className="flex items-center gap-1.5 my-1">
                  <span className="material-symbols-outlined text-[24px] text-emerald-600 font-bold">verified</span>
                  <span className="font-mono text-[22px] font-bold text-emerald-700 leading-none">0</span>
                </div>
                <span className="font-mono text-[9px] text-emerald-700 uppercase font-bold">ALL GATES CLEARED</span>
              </div>

              <div className="bg-white border border-slate-200 rounded p-2.5 flex flex-col justify-between shadow-xs">
                <span className="font-mono text-[9px] text-slate-500 uppercase font-semibold">SOFT PENALTY SCORE</span>
                <div className="my-1">
                  <span className="font-mono text-[16px] font-bold text-sky-800 leading-none">18,470.6</span>
                </div>
                <span className="font-mono text-[9px] text-amber-700 font-bold">+142.3 vs Baseline</span>
              </div>
            </div>

            {/* Compliance Checklist */}
            <div className="flex flex-col gap-1 bg-white border border-slate-200 rounded p-2">
              <div
                onClick={() => setComplianceChecks((c) => ({ ...c, workload: !c.workload }))}
                className="flex items-center justify-between p-1 hover:bg-slate-50 transition-colors rounded cursor-pointer"
              >
                <div className="flex items-center gap-1.5">
                  <span
                    className={`material-symbols-outlined text-[15px] font-bold ${
                      complianceChecks.workload ? 'text-emerald-600' : 'text-slate-400'
                    }`}
                  >
                    {complianceChecks.workload ? 'check_circle' : 'radio_button_unchecked'}
                  </span>
                  <span className="text-[11px] font-bold text-slate-900">Workload Baseline 100%</span>
                </div>
                <span className="font-mono text-[9px] text-emerald-700 font-bold">100% Sched</span>
              </div>

              <div
                onClick={() => setComplianceChecks((c) => ({ ...c, predecessor: !c.predecessor }))}
                className="flex items-center justify-between p-1 hover:bg-slate-50 transition-colors rounded cursor-pointer"
              >
                <div className="flex items-center gap-1.5">
                  <span
                    className={`material-symbols-outlined text-[15px] font-bold ${
                      complianceChecks.predecessor ? 'text-emerald-600' : 'text-slate-400'
                    }`}
                  >
                    {complianceChecks.predecessor ? 'check_circle' : 'radio_button_unchecked'}
                  </span>
                  <span className="text-[11px] font-bold text-slate-900">Predecessor Dependencies</span>
                </div>
                <span className="font-mono text-[9px] text-emerald-700 font-bold">FS+0 Verified</span>
              </div>

              <div
                onClick={() => setComplianceChecks((c) => ({ ...c, legalMix: !c.legalMix }))}
                className="flex items-center justify-between p-1 hover:bg-slate-50 transition-colors rounded cursor-pointer"
              >
                <div className="flex items-center gap-1.5">
                  <span
                    className={`material-symbols-outlined text-[15px] font-bold ${
                      complianceChecks.legalMix ? 'text-emerald-600' : 'text-slate-400'
                    }`}
                  >
                    {complianceChecks.legalMix ? 'check_circle' : 'radio_button_unchecked'}
                  </span>
                  <span className="text-[11px] font-bold text-slate-900">Legal Mix: 1 PC + 3 C</span>
                </div>
                <span className="font-mono text-[9px] text-emerald-700 font-bold">b1: 1PC + 1C (OK)</span>
              </div>

              <div
                onClick={() => setComplianceChecks((c) => ({ ...c, traction: !c.traction }))}
                className="flex items-center justify-between p-1 hover:bg-slate-50 transition-colors rounded cursor-pointer"
              >
                <div className="flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-[15px] text-sky-700 font-bold">bolt</span>
                  <span className="text-[11px] font-bold text-sky-800">Traction Power Isolation</span>
                </div>
                <span className="font-mono text-[9px] text-sky-700 font-bold">Locked #TL-9021</span>
              </div>

              <div
                onClick={() => onNavigateToView('micro-spatial-gate')}
                className="flex items-center justify-between p-1 hover:bg-amber-50/70 transition-colors bg-amber-50/40 border border-amber-200 rounded cursor-pointer"
                title="Click to check rest margins in Micro-Spatial Gate"
              >
                <div className="flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-[15px] text-amber-600 font-bold">warning</span>
                  <span className="text-[11px] font-bold text-amber-900">Rest Margin Threshold</span>
                </div>
                <span className="font-mono text-[9px] text-amber-800 font-bold">C042 @ 82% Lim →</span>
              </div>
            </div>
          </div>

          {/* Manifest CSV Downloads & Master Dispatch CTA */}
          <div className="flex flex-col gap-2.5">
            {/* Ready Manifests - Real Interactive Downloads */}
            <div className="grid grid-cols-3 gap-1.5 font-mono text-[9px]">
              <button
                type="button"
                onClick={() => handleDownloadCsv('ACCESS.csv', ACCESS_CSV)}
                className="p-1.5 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded flex flex-col text-left transition-colors cursor-pointer"
                title="Download ACCESS.csv manifest"
              >
                <span className="text-slate-600 truncate font-semibold">ACCESS.csv</span>
                <span className="text-emerald-700 font-bold flex items-center gap-0.5">
                  <span className="material-symbols-outlined text-[10px]">download</span> READY
                </span>
              </button>

              <button
                type="button"
                onClick={() => handleDownloadCsv('OCCUPANCY.csv', OCCUPANCY_CSV)}
                className="p-1.5 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded flex flex-col text-left transition-colors cursor-pointer"
                title="Download OCCUPANCY.csv manifest"
              >
                <span className="text-slate-600 truncate font-semibold">OCCUPANCY.csv</span>
                <span className="text-emerald-700 font-bold flex items-center gap-0.5">
                  <span className="material-symbols-outlined text-[10px]">download</span> READY
                </span>
              </button>

              <button
                type="button"
                onClick={() => handleDownloadCsv('RESULTS.csv', RESULTS_CSV)}
                className="p-1.5 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded flex flex-col text-left transition-colors cursor-pointer"
                title="Download RESULTS.csv manifest"
              >
                <span className="text-slate-600 truncate font-semibold">RESULTS.csv</span>
                <span className="text-sky-800 font-bold flex items-center gap-0.5">
                  <span className="material-symbols-outlined text-[10px]">download</span> READY
                </span>
              </button>
            </div>

            {/* Master Authorization CTA */}
            <button
              type="button"
              onClick={handleDispatchAuth}
              disabled={dispatchState !== 'idle'}
              className={`w-full py-2.5 px-4 font-mono text-[12px] font-bold uppercase tracking-wider flex items-center justify-center gap-2 shadow-sm transition-all rounded cursor-pointer ${
                dispatchState === 'confirmed'
                  ? 'bg-emerald-600 text-white'
                  : dispatchState === 'transmitting'
                  ? 'bg-sky-800 text-white'
                  : 'bg-sky-700 hover:bg-sky-800 text-white active:scale-[0.99]'
              }`}
            >
              {dispatchState === 'transmitting' ? (
                <>
                  <span className="material-symbols-outlined text-[18px] animate-spin">sync</span>
                  <span>DISPATCHING PACKETS TO ATS/SCADA...</span>
                </>
              ) : dispatchState === 'confirmed' ? (
                <>
                  <span className="material-symbols-outlined text-[18px]">task_alt</span>
                  <span>TRANSMITTED // MANIFEST SAVED</span>
                </>
              ) : (
                <>
                  <span className="material-symbols-outlined text-[18px]">rocket_launch</span>
                  <span>AUTHORIZE &amp; EXPORT CSV</span>
                  <span className="material-symbols-outlined text-[16px]">double_arrow</span>
                </>
              )}
            </button>

            {/* Controller Stamp */}
            <div className="flex items-center justify-between font-mono text-[9px] text-slate-500 px-1">
              <span>STAMP: AUTH_BY_S_CHEN</span>
              <span>NOC_WORKSTATION_04 • LTA_SECURED</span>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
