import React, { useState, useEffect } from 'react';
import { ActiveView } from '../types';
import { formatRelativeTimeString } from '../utils/timeUtils';

interface MicroSpatialGateProps {
  onNavigateToView: (view: ActiveView) => void;
  onVetoTriggered?: () => void;
  now?: Date;
  hh?: string;
  mm?: string;
  ss?: string;
  amPm?: string;
  is24Hour?: boolean;
}

export const MicroSpatialGate: React.FC<MicroSpatialGateProps> = ({
  onNavigateToView,
  onVetoTriggered,
  now,
  hh = '10',
  mm = '25',
  ss = '00',
  amPm = 'AM',
  is24Hour = false,
}) => {
  // Checklist states
  const [checkExhaust, setCheckExhaust] = useState(true);
  const [checkWalkway, setCheckWalkway] = useState(true);
  const [checkCatenary, setCheckCatenary] = useState(true);

  // Timer state for 15-min briefing
  const [timerSeconds, setTimerSeconds] = useState(900); // 15 mins
  const [timerRunning, setTimerRunning] = useState(false);

  useEffect(() => {
    let interval: any = null;
    if (timerRunning && timerSeconds > 0) {
      interval = setInterval(() => {
        setTimerSeconds((prev) => Math.max(0, prev - 1));
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [timerRunning, timerSeconds]);

  const formatTimer = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
  };

  // Dual auth states
  const [leadSigned, setLeadSigned] = useState(false);
  const [leadSignedTime, setLeadSignedTime] = useState<string | null>(null);
  const [coShareAuthorized, setCoShareAuthorized] = useState(false);
  const [vetoActivated, setVetoActivated] = useState(false);

  // Computed signature time for primary contractor (approx 6 mins ago in actual time)
  const pcLeadSignedTime = formatRelativeTimeString(6, is24Hour);

  // Toast notification
  const [toast, setToast] = useState<{
    show: boolean;
    type: 'success' | 'veto';
    title: string;
    message: string;
  }>({
    show: false,
    type: 'success',
    title: '',
    message: '',
  });

  const handleConfirmProceed = () => {
    const signedAt = `${hh}:${mm}:${ss}${amPm ? ' ' + amPm : ''}`;
    setLeadSigned(true);
    setLeadSignedTime(signedAt);
    setCoShareAuthorized(true);
    setVetoActivated(false);
    setToast({
      show: true,
      type: 'success',
      title: 'CO-SHARE AUTHORIZED // 0.95m BUFFER LOCKED',
      message:
        `Digital signature logged at ${signedAt} for Marcus Vance (C042). Track latch SEC:ALP:H01_H02:EB unlocked with dual possessory rights.`,
    });
  };

  const handleTriggerVeto = () => {
    setVetoActivated(true);
    setCoShareAuthorized(false);
    if (onVetoTriggered) {
      onVetoTriggered();
    }
    setToast({
      show: true,
      type: 'veto',
      title: 'SPATIAL VETO ACTIVATED // TOKEN #SVT-2024-C042-09',
      message:
        'C042 slot released. Scenario C re-planner engaged. Consist C001 restricted to single occupant status.',
    });
  };

  return (
    <div className="flex flex-col w-full gap-4 select-none">
      {/* Micro-Spatial Modal Header Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-2 bg-white p-3.5 border border-slate-200 shadow-xs rounded">
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-1.5 font-mono text-[9px] uppercase tracking-widest text-slate-500 font-semibold flex-wrap">
            <span
              onClick={() => onNavigateToView('topology-command')}
              className="text-sky-700 hover:underline cursor-pointer font-bold"
            >
              Line Alpha
            </span>
            <span>/</span>
            <span className="text-slate-700">H01-H02 Junction</span>
            <span>/</span>
            <span className="text-slate-700">Tunnel Bore B</span>
            <span>/</span>
            <span className="px-1.5 py-[1px] bg-sky-50 text-sky-800 font-bold border border-sky-200 rounded text-[9px]">
              Slot #8841
            </span>
          </div>

          <div className="flex items-center gap-3">
            <span className="inline-block w-2.5 h-2.5 bg-emerald-600 rounded-full animate-pulse shadow-sm"></span>
            <h1 className="font-sans text-[16px] tracking-tight text-slate-900 uppercase font-bold">
              Sector Inspection:{' '}
              <span className="font-mono text-sky-800 font-bold">SEC:ALP:H01_H02:EB</span> —{' '}
              <span className="text-emerald-700 font-bold">Possession Group b1</span>
            </h1>
          </div>
        </div>

        <div className="flex items-center gap-2 self-start md:self-auto flex-wrap">
          <div className="flex items-center gap-1.5 px-2.5 py-1 bg-amber-50 border border-amber-200 text-amber-900 font-mono text-[10px] rounded">
            <span className="w-2 h-2 bg-amber-500 rounded-full animate-ping"></span>
            <span className="text-amber-800 uppercase font-semibold">Spatial Mode:</span>
            <span className="font-bold text-amber-900">
              {vetoActivated ? 'VETO / DECOUPLED' : coShareAuthorized ? 'DUAL-PERMIT ACTIVE' : 'CO-SHARE RESTRICTED'}
            </span>
          </div>
          <div className="flex items-center gap-1.5 px-2.5 py-1 bg-sky-50 border border-sky-200 text-sky-800 font-mono text-[9px] uppercase rounded">
            <span className="font-semibold text-slate-500">GATE-LOCK:</span>
            <span
              className={`font-bold font-mono text-[10px] ${
                coShareAuthorized ? 'text-emerald-700' : 'text-amber-600'
              }`}
            >
              {coShareAuthorized ? 'UNLOCKED (L2-AUTH)' : 'ENGAGED (L2)'}
            </span>
          </div>
        </div>
      </div>

      {/* 3-Column High-Density Command Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-start">
        {/* Column 1: 3D Volumetric Spatial Clearance & Tunnel Envelope */}
        <div className="lg:col-span-4 flex flex-col gap-2.5 bg-white p-3.5 border border-slate-200 shadow-xs rounded">
          {/* Section Header */}
          <div className="flex items-center justify-between bg-slate-50 px-3 py-1.5 border border-slate-200 rounded">
            <div className="flex items-center gap-1.5">
              <span className="material-symbols-outlined text-sky-700 text-[16px]">view_in_ar</span>
              <span className="font-mono text-[10px] uppercase tracking-wider text-slate-800 font-bold">
                TUNNEL CROSS-SECTION SPEC // BORE: 5.60m
              </span>
            </div>
            <span className="font-mono text-[10px] text-sky-800 font-bold">CAD-REV 8.1</span>
          </div>

          {/* Tunnel Schematic SVG HUD */}
          <div className="relative bg-slate-50 border border-slate-200 p-2 overflow-hidden flex flex-col items-center justify-center rounded">
            <svg className="w-full h-auto select-none" viewBox="0 0 420 300" xmlns="http://www.w3.org/2000/svg">
              <defs>
                <radialGradient id="hazardGlowLight" cx="42%" cy="56%" r="35%">
                  <stop offset="0%" stopColor="#F59E0B" stopOpacity="0.25" />
                  <stop offset="65%" stopColor="#F59E0B" stopOpacity="0.08" />
                  <stop offset="100%" stopColor="#F59E0B" stopOpacity="0.0" />
                </radialGradient>
                <pattern id="gridPatternLight" patternUnits="userSpaceOnUse" width="16" height="16">
                  <path d="M 16 0 L 0 0 0 16" fill="none" stroke="#E2E8F0" strokeWidth="0.75" />
                </pattern>
                <pattern id="hatchPatternLight" patternUnits="userSpaceOnUse" width="6" height="6" patternTransform="rotate(45 0 0)">
                  <line x1="0" y1="0" x2="0" y2="6" stroke="#D97706" strokeWidth="1.2" opacity="0.35" />
                </pattern>
              </defs>

              {/* Background Tech Grid */}
              <rect x="0" y="0" width="420" height="300" fill="#F8FAFC" />
              <rect x="0" y="0" width="420" height="300" fill="url(#gridPatternLight)" />

              {/* Circular Tunnel Outer Bore Diameter 5.60m */}
              <circle cx="210" cy="150" r="135" fill="#FFFFFF" stroke="#CBD5E1" strokeWidth="5" strokeDasharray="4 4" />
              <circle cx="210" cy="150" r="130" fill="none" stroke="#94A3B8" strokeWidth="1.5" />

              {/* Center Axes */}
              <line x1="210" y1="18" x2="210" y2="282" stroke="#CBD5E1" strokeWidth="0.9" strokeDasharray="4 4" />
              <line x1="75" y1="150" x2="345" y2="150" stroke="#CBD5E1" strokeWidth="0.9" strokeDasharray="4 4" />

              {/* Walkway Structure */}
              <path d="M 305 200 L 338 200 L 328 238 L 305 238 Z" fill="#E2E8F0" stroke="#94A3B8" strokeWidth="1" />
              <text x="324" y="194" textAnchor="middle" fill="#475569" fontFamily="JetBrains Mono" fontSize="7.5" fontWeight="700">
                WALKWAY
              </text>

              {/* Rails & Slab Track Trackbed */}
              <rect x="110" y="240" width="180" height="12" fill="#E2E8F0" stroke="#CBD5E1" strokeWidth="1" />
              <rect x="135" y="234" width="8" height="6" fill="#475569" />
              <rect x="225" y="234" width="8" height="6" fill="#475569" />
              <line x1="100" y1="240" x2="300" y2="240" stroke="#64748B" strokeWidth="1.5" />

              {/* Exhaust Hazard Plume Radius */}
              <ellipse cx="178" cy="138" rx="55" ry="46" fill="url(#hazardGlowLight)" />
              <circle cx="178" cy="138" r="48" fill="url(#hatchPatternLight)" stroke="#D97706" strokeWidth="1" strokeDasharray="2 3" />

              {/* Footprint 1: Primary Contractor C001 Heavy Tamping Consist */}
              <rect x="132" y="125" width="102" height="108" fill="#FEF3C7" stroke="#D97706" strokeWidth="1.75" />
              <rect x="142" y="135" width="40" height="26" fill="#FFFFFF" stroke="#B45309" strokeWidth="1" />
              <circle cx="152" cy="148" r="4" fill="#DC2626" opacity="0.9" />
              <text x="183" y="178" textAnchor="middle" fill="#78350F" fontFamily="Inter" fontSize="9" fontWeight="700">
                C001 TAMPING
              </text>
              <text x="183" y="190" textAnchor="middle" fill="#92400E" fontFamily="JetBrains Mono" fontSize="7.5" fontWeight="600">
                2.40m × 3.20m
              </text>

              {/* Heavy Machinery Exhaust Stack */}
              <rect x="172" y="112" width="12" height="13" fill="#EA580C" />
              <text x="178" y="106" textAnchor="middle" fill="#C2410C" fontFamily="JetBrains Mono" fontSize="7" fontWeight="700">
                EXHAUST STACK
              </text>

              {/* Footprint 2: Subcontractor C042 Ultrasonic NDT Rig on Walkway Edge */}
              <rect x="274" y="178" width="36" height="55" fill="#D1FAE5" stroke="#059669" strokeWidth="1.75" />
              <rect x="280" y="184" width="24" height="14" fill="#FFFFFF" stroke="#059669" strokeWidth="0.75" />
              <text x="292" y="208" textAnchor="middle" fill="#065F46" fontFamily="Inter" fontSize="8" fontWeight="700">
                C042 NDT
              </text>
              <text x="292" y="218" textAnchor="middle" fill="#047857" fontFamily="JetBrains Mono" fontSize="6.5" fontWeight="600">
                0.8m × 1.6m
              </text>

              {/* Overhead Catenary System (De-energized 750V / Airgap clearance) */}
              <line x1="210" y1="20" x2="210" y2="70" stroke="#94A3B8" strokeWidth="1.5" />
              <circle cx="210" cy="74" r="5" fill="#FFFFFF" stroke="#DC2626" strokeWidth="1.75" />
              <line x1="165" y1="74" x2="255" y2="74" stroke="#DC2626" strokeWidth="1.2" strokeDasharray="3 2" />

              {/* Airgap Dimension Marker */}
              <line x1="210" y1="80" x2="210" y2="124" stroke="#0284C7" strokeWidth="1.2" strokeDasharray="2 2" />
              <path d="M 207 83 L 210 79 L 213 83 M 207 121 L 210 125 L 213 121" fill="none" stroke="#0284C7" strokeWidth="1.2" />
              <rect x="216" y="96" width="138" height="15" fill="#FFFFFF" stroke="#0284C7" strokeWidth="0.75" />
              <text x="222" y="107" fill="#0369A1" fontFamily="JetBrains Mono" fontSize="7.5" fontWeight="700">
                AIRGAP: 1.42m (PASS)
              </text>

              {/* Lateral Safety Margin Line between C001 and C042 */}
              <line x1="234" y1="170" x2="274" y2="170" stroke="#059669" strokeWidth="1.75" />
              <line x1="234" y1="162" x2="234" y2="178" stroke="#059669" strokeWidth="1.75" />
              <line x1="274" y1="162" x2="274" y2="178" stroke="#059669" strokeWidth="1.75" />
              <path d="M 238 167 L 234 170 L 238 173 M 270 167 L 274 170 L 270 173" fill="none" stroke="#059669" strokeWidth="1.5" />

              <rect x="215" y="142" width="105" height="16" fill="#ECFDF5" stroke="#059669" strokeWidth="1" />
              <text x="267" y="153" textAnchor="middle" fill="#065F46" fontFamily="JetBrains Mono" fontSize="8" fontWeight="700">
                LATERAL: 0.95m
              </text>
            </svg>

            <div className="absolute bottom-2 left-2 flex items-center gap-1 font-mono text-[9px] bg-white/95 border border-slate-200 px-1.5 py-[2px] text-slate-700 rounded shadow-xs">
              <span>COORDINATE ENVELOPE:</span>
              <span className="text-sky-800 font-bold">SEC_EB_B2_8841</span>
            </div>
          </div>

          {/* Volumetric Metrics */}
          <div className="grid grid-cols-2 gap-1.5">
            <div className="bg-slate-50 p-2 flex flex-col border border-slate-200 rounded">
              <span className="font-mono text-[9px] text-slate-500 uppercase font-semibold">LATERAL SAFETY MARGIN</span>
              <div className="flex items-baseline gap-1 mt-0.5">
                <span className="font-mono text-[18px] text-emerald-700 font-bold">0.95</span>
                <span className="font-mono text-[9px] text-emerald-700 font-bold">METERS</span>
              </div>
              <span className="font-mono text-[8px] text-slate-500 mt-0.5">Threshold: 0.80m [PASS +0.15m]</span>
            </div>

            <div className="bg-slate-50 p-2 flex flex-col border border-slate-200 rounded">
              <span className="font-mono text-[9px] text-slate-500 uppercase font-semibold">750V CATENARY AIRGAP</span>
              <div className="flex items-baseline gap-1 mt-0.5">
                <span className="font-mono text-[18px] text-sky-800 font-bold">1.42</span>
                <span className="font-mono text-[9px] text-sky-800 font-bold">METERS</span>
              </div>
              <span className="font-mono text-[8px] text-slate-500 mt-0.5">Ground lock switch #G4 confirmed</span>
            </div>
          </div>

          {/* Bore Sensor Telemetry Strip */}
          <div className="bg-slate-50 p-2 flex flex-col gap-1.5 border border-slate-200 rounded">
            <div className="flex items-center justify-between font-mono text-[9px] text-slate-500 uppercase font-bold">
              <span>BORE SENSOR TELEMETRY</span>
              <span className="text-emerald-700 flex items-center gap-1 font-bold">
                <span className="w-1.5 h-1.5 bg-emerald-600 rounded-full animate-pulse"></span>SAMPLING LIVE
              </span>
            </div>

            <div className="grid grid-cols-2 gap-1.5">
              <div className="bg-white p-1.5 flex items-center justify-between border border-slate-200 rounded">
                <div className="flex flex-col">
                  <span className="font-mono text-[8px] text-slate-500 font-semibold">CO2 AMBIENT</span>
                  <span className="font-mono text-[12px] text-slate-900 font-bold">
                    410 <span className="text-[8px] text-slate-500">ppm</span>
                  </span>
                </div>
                <span className="px-1 py-[1px] bg-emerald-50 text-emerald-700 border border-emerald-200 font-mono text-[9px] font-bold rounded">
                  NOMINAL
                </span>
              </div>

              <div className="bg-white p-1.5 flex items-center justify-between border border-slate-200 rounded">
                <div className="flex flex-col">
                  <span className="font-mono text-[8px] text-slate-500 font-semibold">EXHAUST TEMP</span>
                  <span className="font-mono text-[12px] text-amber-700 font-bold">
                    42.4 <span className="text-[8px] text-slate-500">°C</span>
                  </span>
                </div>
                <span className="px-1 py-[1px] bg-amber-50 text-amber-800 border border-amber-300 font-mono text-[9px] font-bold rounded">
                  RESTRICTED
                </span>
              </div>
            </div>

            <p className="text-[10px] text-slate-600 px-0.5">
              Plume restricted buffer requires forced air induction fans #F02/F03 active at 80% extraction rate.
            </p>
          </div>

          {/* Sector CCTV feed */}
          <div className="relative w-full h-24 bg-slate-900 border border-slate-300 overflow-hidden rounded">
            <img
              className="w-full h-full object-cover opacity-85"
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuBWUtf3IC2tQzYvsvm7_3_kXnDxO9xQSxk5uKo6otMgQybBqDYa3Dn5e13YHc30tDD7sxi7OKoylYFdrwhI3Ua8M8kYlvOHWNV1d_vrHlXg5s06l643RkiIn6DbayWwPxzZF5IxdWqhYgnNiRqaJPlCkNIeK8p4DZTJNmoRJU_NWwnPDiexoTJwou5csk7C9ba77IU2JRAdVcM0VL4dnxWOQ_wgQeHy1M1JGyuUKUIuRuLW6WhKv6_L6w"
              alt="Optical CCTV Feed #C-EB-1204"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent"></div>
            <div className="absolute bottom-1.5 left-2 flex items-center gap-1 font-mono text-[9px] text-white bg-black/70 px-1.5 py-0.5 rounded">
              <span className="material-symbols-outlined text-[12px] text-emerald-400">videocam</span>
              <span>OPTICAL CCTV FEED #C-EB-1204</span>
            </div>
          </div>
        </div>

        {/* Column 2: Biological Fatigue & Rest Guard */}
        <div className="lg:col-span-4 flex flex-col gap-2.5 bg-white p-3.5 border border-slate-200 shadow-xs rounded">
          {/* Section Header */}
          <div className="flex items-center justify-between bg-slate-50 px-3 py-1.5 border border-slate-200 rounded">
            <div className="flex items-center gap-1.5">
              <span className="material-symbols-outlined text-amber-600 text-[16px]">health_and_safety</span>
              <span className="font-mono text-[10px] uppercase tracking-wider text-slate-800 font-bold">
                BIOMETRIC REST &amp; FATIGUE // CREW 042
              </span>
            </div>
            <span className="px-1.5 py-[1px] bg-amber-100 text-amber-800 border border-amber-300 font-mono text-[9px] font-bold uppercase rounded">
              FLAGGED
            </span>
          </div>

          {/* Worker Safety Telemetry Card */}
          <div className="bg-slate-50 p-2.5 flex flex-col gap-2 border border-slate-200 rounded">
            <div className="flex items-start justify-between">
              <div>
                <span className="font-mono text-[9px] uppercase tracking-wider text-slate-500 font-semibold">
                  SUBCONTRACTOR UNIT
                </span>
                <div className="text-[13px] text-slate-900 font-bold">C042 NDT Ultrasonic Rails</div>
                <div className="font-mono text-[10px] text-sky-800 font-bold">LEAD: Marcus Vance (LTA-C042-88)</div>
              </div>
              <div className="flex flex-col items-end">
                <span className="font-mono text-[9px] text-slate-500 font-semibold">CREW ROSTER</span>
                <span className="font-mono text-[12px] text-slate-900 font-bold">6 OPERATORS</span>
              </div>
            </div>

            {/* Shift & Fatigue Stats */}
            <div className="grid grid-cols-2 gap-1.5">
              <div className="bg-white p-2 flex flex-col border border-slate-200 rounded">
                <span className="font-mono text-[9px] text-slate-500 font-semibold">SHIFT CADENCE</span>
                <div className="flex items-baseline gap-1 mt-0.5">
                  <span className="font-mono text-[16px] text-amber-800 font-bold">3 / 3</span>
                  <span className="font-mono text-[9px] text-amber-800 uppercase font-bold">CONSECUTIVE</span>
                </div>
                <span className="font-mono text-[8px] text-slate-500 mt-0.5">Maximum cap permitted: 3 nights</span>
              </div>

              <div className="bg-white p-2 flex flex-col border border-slate-200 rounded">
                <span className="font-mono text-[9px] text-slate-500 font-semibold">ECLO EXPOSURE RATIO</span>
                <div className="flex items-baseline gap-1 mt-0.5">
                  <span className="font-mono text-[16px] text-sky-800 font-bold">1.50x</span>
                  <span className="font-mono text-[9px] text-slate-500 font-semibold">OCCUPATION</span>
                </div>
                <span className="font-mono text-[8px] text-slate-500 mt-0.5">Threshold cap: 1.65x allowable</span>
              </div>
            </div>

            {/* Circadian Efficiency Meter Widget */}
            <div className="bg-white p-2.5 flex flex-col gap-1 border border-slate-200 rounded">
              <div className="flex items-center justify-between">
                <span className="font-mono text-[9px] text-slate-500 uppercase font-bold">
                  CIRCADIAN EFFICIENCY FACTOR
                </span>
                <span className="font-mono text-[11px] text-amber-800 font-bold">0.72x (DEGRADED)</span>
              </div>

              {/* Linear Gauge Bar with Zones */}
              <div className="w-full bg-slate-200 h-3 flex overflow-hidden rounded">
                {/* Critical Zone: 0.0 - 0.6 */}
                <div className="h-full w-[35%] bg-rose-200 flex items-center justify-end pr-1 border-r border-rose-300">
                  <span className="font-mono text-[8px] text-rose-800 font-bold">0.60</span>
                </div>
                {/* Warning Zone: 0.6 - 0.8 */}
                <div className="h-full w-[35%] bg-amber-200 flex items-center justify-end pr-1 relative border-r border-amber-300">
                  <div className="absolute left-[60%] top-0 bottom-0 w-1.5 bg-amber-600 shadow-xs"></div>
                  <span className="font-mono text-[8px] text-amber-800 font-bold">0.80</span>
                </div>
                {/* Optimal Zone: 0.8 - 1.0 */}
                <div className="h-full w-[30%] bg-emerald-200 flex items-center justify-end pr-1">
                  <span className="font-mono text-[8px] text-emerald-800 font-bold">1.0</span>
                </div>
              </div>

              <div className="flex items-center justify-between font-mono text-[8px] text-slate-500">
                <span className="text-rose-700 font-semibold">UNSAFE (&lt;0.65)</span>
                <span className="text-amber-800 font-bold">CURRENT: 0.72</span>
                <span className="text-emerald-700 font-semibold">OPTIMAL (&gt;0.85)</span>
              </div>
            </div>

            {/* Sleep Rest Progress Ring */}
            <div className="bg-white p-2.5 flex items-center gap-3 border border-slate-200 rounded">
              <div className="relative w-14 h-14 shrink-0 flex items-center justify-center">
                <svg className="w-full h-full -rotate-90" viewBox="0 0 36 36">
                  <path
                    className="text-slate-200"
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="3.5"
                  />
                  <path
                    className="text-amber-500"
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="3.5"
                    strokeDasharray="76, 100"
                  />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="font-mono text-[11px] text-slate-900 font-bold">6.1h</span>
                  <span className="font-mono text-[7px] text-slate-500 font-bold">REST</span>
                </div>
              </div>

              <div className="flex flex-col">
                <span className="text-[11px] text-slate-900 font-bold">Average Rest Window: 6.1 Hours</span>
                <span className="text-[10px] text-slate-600 mt-0.5">
                  Measured via telemetric bio-band sync prior to sector sign-on. Min mandated undisturbed rest is 6.0h.
                </span>
              </div>
            </div>
          </div>

          {/* High-Visibility Friction Warning Banner */}
          <div className="bg-amber-50 border border-amber-300 p-3 flex flex-col gap-1 rounded">
            <div className="flex items-center gap-1.5">
              <span className="material-symbols-outlined text-amber-800 text-[18px]">warning</span>
              <span className="font-mono text-[10px] text-amber-950 font-bold tracking-wide uppercase">
                COGNITIVE EXHAUSTION MARGIN TIGHT. FORCED BRIEFING REQUIRED.
              </span>
            </div>
            <p className="text-[11px] text-amber-950 leading-relaxed">
              Per <span className="font-mono text-sky-800 font-bold">LTA Regulation Sec 14-B</span>: Consecutive night 3 mandates a verified 15-minute micro-spatial briefing prior to electronic track latch unlock.
            </p>
            <div className="flex items-center justify-between font-mono text-[9px] text-amber-900 mt-1 pt-1 bg-white/80 border border-amber-200 p-1.5 rounded">
              <span className="font-semibold">RULE ENFORCEMENT: SEC-14B-2024</span>
              <span className="font-bold">STATUS: MANDATORY GATE</span>
            </div>
          </div>

          {/* Crew Safety Confirmation Check-in */}
          <div className="bg-slate-50 p-2 flex items-center justify-between border border-slate-200 rounded">
            <div className="flex items-center gap-1.5">
              <div className="w-3.5 h-3.5 bg-sky-700 flex items-center justify-center rounded-xs">
                <div className="w-1.5 h-1.5 bg-white"></div>
              </div>
              <span className="text-[11px] text-slate-700 font-semibold">Field Heartbeat Sensor Consensus</span>
            </div>
            <span className="font-mono text-[10px] text-emerald-700 font-bold">6/6 ONLINE (100%)</span>
          </div>
        </div>

        {/* Column 3: Positive Friction Action Box & Dual Gate Approval */}
        <div className="lg:col-span-4 flex flex-col gap-2.5 bg-white p-3.5 border border-slate-200 shadow-xs rounded">
          {/* Section Header */}
          <div className="flex items-center justify-between bg-slate-50 px-3 py-1.5 border border-slate-200 rounded">
            <div className="flex items-center gap-1.5">
              <span className="material-symbols-outlined text-emerald-700 text-[16px]">lock_person</span>
              <span className="font-mono text-[10px] uppercase tracking-wider text-slate-800 font-bold">
                POSITIVE FRICTION GATE // DUAL-AUTH
              </span>
            </div>
            <span className="font-mono text-[10px] text-sky-800 font-bold">INTERLOCK V3</span>
          </div>

          {/* Spatial Veto Token Status Card */}
          <div className="bg-slate-50 p-2.5 flex flex-col gap-1 border border-slate-200 rounded">
            <div className="flex items-center justify-between">
              <span className="font-mono text-[9px] uppercase tracking-wider text-slate-500 font-semibold">
                SPATIAL VETO TOKEN DISPOSITION
              </span>
              <span
                className={`px-1.5 py-[1px] font-mono text-[9px] font-bold border rounded ${
                  vetoActivated
                    ? 'bg-rose-100 text-rose-800 border-rose-300'
                    : 'bg-emerald-50 text-emerald-700 border-emerald-200'
                }`}
              >
                {vetoActivated ? 'TOKEN EXERCISED' : 'TOKEN ACTIVE'}
              </span>
            </div>
            <div className="flex items-baseline justify-between mt-1">
              <span className="text-[12px] text-slate-900 font-bold">Subcontractor C042 Holds 1 Waiver</span>
              <span className="font-mono text-[10px] text-sky-800 font-bold">#SVT-2024-C042-09</span>
            </div>
            <div className="p-1.5 bg-white border border-slate-200 text-[10px] text-slate-600 rounded">
              Subcontractor holds unilateral power to reject shared possession if clearance or fatigue thresholds fail on-site verification.
            </div>
          </div>

          {/* Dual Digital Signature Audit */}
          <div className="bg-slate-50 p-2.5 flex flex-col gap-1.5 border border-slate-200 rounded">
            <span className="font-mono text-[9px] uppercase tracking-wider text-slate-500 font-bold">
              DUAL DIGITAL SIGNATURE AUDIT
            </span>

            {/* Checkmark 1: PC Lead Signed */}
            <div className="bg-white p-2 flex items-center justify-between border border-slate-200 rounded">
              <div className="flex items-center gap-1.5">
                <span className="material-symbols-outlined text-emerald-600 text-[18px]">verified</span>
                <div className="flex flex-col">
                  <span className="text-[11px] text-slate-900 font-bold">PC Lead: J. Reynolds</span>
                  <span className="font-mono text-[8px] text-slate-500">C001 Heavy Tamping Corp</span>
                </div>
              </div>
              <div className="flex flex-col items-end">
                <span className="font-mono text-[10px] text-emerald-700 font-bold">SIGNED</span>
                <span className="font-mono text-[8px] text-slate-500">{pcLeadSignedTime}</span>
              </div>
            </div>

            {/* Checkmark 2: C Lead */}
            <div className="bg-white p-2 flex items-center justify-between border border-slate-200 rounded">
              <div className="flex items-center gap-1.5">
                <span
                  className={`material-symbols-outlined text-[18px] ${
                    leadSigned ? 'text-emerald-600' : 'text-amber-600 animate-pulse'
                  }`}
                >
                  {leadSigned ? 'verified' : 'pending'}
                </span>
                <div className="flex flex-col">
                  <span className="text-[11px] text-slate-900 font-bold">C Lead: M. Vance</span>
                  <span className="font-mono text-[8px] text-slate-500">C042 NDT Inspections</span>
                </div>
              </div>
              <div className="flex flex-col items-end">
                <span
                  className={`font-mono text-[10px] font-bold ${
                    leadSigned ? 'text-emerald-700' : 'text-amber-700'
                  }`}
                >
                  {leadSigned ? 'SIGNED & SYNCED' : 'PENDING BRIEF'}
                </span>
                <span className="font-mono text-[8px] text-slate-500">
                  {leadSigned ? (leadSignedTime || `${hh}:${mm}:${ss}`) : 'LATCH LOCKED'}
                </span>
              </div>
            </div>
          </div>

          {/* Interactive Micro-Spatial Briefing Checklist & Timer */}
          <div className="bg-slate-50 p-2.5 flex flex-col gap-1.5 border border-slate-200 rounded">
            <div className="flex items-center justify-between">
              <span className="font-mono text-[9px] uppercase text-slate-500 font-bold">
                ON-SITE 15-MIN BRIEFING CHECK
              </span>
              <div className="flex items-center gap-2">
                <span className="font-mono text-[10px] text-sky-800 font-bold">
                  {formatTimer(timerSeconds)} / 15:00
                </span>
                <button
                  type="button"
                  onClick={() => setTimerRunning(!timerRunning)}
                  className="px-1.5 py-[1px] bg-slate-200 hover:bg-slate-300 font-mono text-[9px] rounded font-semibold text-slate-800 cursor-pointer"
                >
                  {timerRunning ? 'PAUSE' : timerSeconds < 900 ? 'RESUME' : 'START'}
                </button>
              </div>
            </div>

            <div className="flex flex-col gap-1">
              <label className="flex items-center gap-2 text-slate-800 cursor-pointer bg-white p-1.5 border border-slate-200 rounded">
                <input
                  type="checkbox"
                  checked={checkExhaust}
                  onChange={(e) => setCheckExhaust(e.target.checked)}
                  className="w-3.5 h-3.5 accent-sky-700 rounded cursor-pointer"
                />
                <span className="text-[11px] font-medium">C001 Exhaust Plume Exclusion Zone Marked (42°C)</span>
              </label>

              <label className="flex items-center gap-2 text-slate-800 cursor-pointer bg-white p-1.5 border border-slate-200 rounded">
                <input
                  type="checkbox"
                  checked={checkWalkway}
                  onChange={(e) => setCheckWalkway(e.target.checked)}
                  className="w-3.5 h-3.5 accent-sky-700 rounded cursor-pointer"
                />
                <span className="text-[11px] font-medium">Walkway Lateral Buffer 0.95m Clear of Consist Swept Path</span>
              </label>

              <label className="flex items-center gap-2 text-slate-800 cursor-pointer bg-white p-1.5 border border-slate-200 rounded">
                <input
                  type="checkbox"
                  checked={checkCatenary}
                  onChange={(e) => setCheckCatenary(e.target.checked)}
                  className="w-3.5 h-3.5 accent-sky-700 rounded cursor-pointer"
                />
                <span className="text-[11px] font-medium">750V Overhead Line Grounding Earth Pole #E-14 Locked</span>
              </label>
            </div>
          </div>

          {/* Prominent Decision Action Buttons */}
          <div className="flex flex-col gap-2 mt-auto">
            {/* Button 1: Primary Confirmed Proceed */}
            <button
              type="button"
              onClick={handleConfirmProceed}
              className="w-full bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white px-3 py-2 flex flex-col items-center justify-center transition-colors shadow-xs rounded cursor-pointer"
            >
              <div className="flex items-center gap-1.5 font-mono text-[11px] uppercase tracking-wide font-bold">
                <span className="material-symbols-outlined text-[16px]">verified_user</span>
                <span>CONFIRM SYNCED BRIEFING &amp; PROCEED</span>
              </div>
              <span className="font-mono text-[8px] text-emerald-100 opacity-90 mt-0.5 font-medium text-center">
                Locks 0.95m lateral buffer &amp; authorizes dual possession entry
              </span>
            </button>

            {/* Button 2: Secondary Outline Veto Button */}
            <button
              type="button"
              onClick={handleTriggerVeto}
              className="w-full bg-white hover:bg-rose-50 text-slate-800 hover:text-rose-800 border border-slate-300 hover:border-rose-400 px-3 py-2 flex flex-col items-center justify-center transition-colors shadow-xs rounded cursor-pointer"
            >
              <div className="flex items-center gap-1.5 font-mono text-[11px] text-rose-700 uppercase tracking-wider font-bold">
                <span className="material-symbols-outlined text-[16px]">gavel</span>
                <span>TRIGGER SPATIAL VETO</span>
              </div>
              <span className="font-mono text-[8px] text-slate-500 opacity-90 mt-0.5 text-center font-medium">
                Decouples slot, auto-logs +1 excess night to Scenario C, releases track to single-consist only
              </span>
            </button>
          </div>

          {/* Transaction Audit Trail Footer */}
          <div className="bg-slate-50 p-2 flex items-center justify-between text-slate-500 font-mono text-[9px] border border-slate-200 rounded">
            <span className="flex items-center gap-1 font-semibold">
              <span className="material-symbols-outlined text-[12px] text-sky-700">fingerprint</span>
              LEDGER #TX-991823
            </span>
            <span className="text-sky-800 font-bold">BLOCK #891,241 [VERIFIED]</span>
          </div>
        </div>
      </div>

      {/* Sector Cross-Possession Live Fleet Telemetry Strip */}
      <div className="bg-white p-3.5 flex flex-col md:flex-row items-center justify-between gap-3 border border-slate-200 shadow-xs rounded">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-sky-50 border border-sky-200 rounded flex items-center justify-center text-sky-800 shrink-0">
            <span className="material-symbols-outlined text-[24px]">train</span>
          </div>
          <div className="flex flex-col">
            <div className="flex items-center gap-2">
              <span className="text-[12px] text-slate-900 font-bold">PLASSER &amp; THEURER 08-32U</span>
              <span className="font-mono text-[9px] text-slate-500 font-semibold">[CONSIST C001-ALPHA]</span>
            </div>
            <span className="text-[11px] text-slate-600">
              Stationary at Chainage CH 14+220 // Brake Pressure: 5.0 bar // Speed: 0.0 km/h [HELD]
            </span>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="flex flex-col text-right">
            <span className="font-mono text-[9px] text-slate-500 uppercase font-semibold">POSSESSION GRANTED BY</span>
            <span className="font-mono text-[10px] text-sky-800 font-bold">CONTROLLER 04 [Sam Chen]</span>
          </div>
          <div className="h-8 w-px bg-slate-200"></div>
          <div className="flex flex-col text-right">
            <span className="font-mono text-[9px] text-slate-500 uppercase font-semibold">SLOT EXPIRY COUNTDOWN</span>
            <span className="font-mono text-[18px] text-slate-900 font-bold">02:31:18</span>
          </div>
        </div>
      </div>

      {/* Notification Toast Modal */}
      {toast.show && (
        <div className="p-3 bg-white border border-slate-300 text-slate-900 flex items-center justify-between shadow-lg rounded">
          <div className="flex items-center gap-2.5">
            <span
              className={`material-symbols-outlined text-[24px] ${
                toast.type === 'success' ? 'text-emerald-600' : 'text-rose-600'
              }`}
            >
              {toast.type === 'success' ? 'verified_user' : 'gavel'}
            </span>
            <div className="flex flex-col">
              <span
                className={`font-mono text-[11px] font-bold ${
                  toast.type === 'success' ? 'text-emerald-700' : 'text-rose-700'
                }`}
              >
                {toast.title}
              </span>
              <span className="text-[11px] text-slate-600">{toast.message}</span>
            </div>
          </div>
          <button
            type="button"
            onClick={() => setToast({ ...toast, show: false })}
            className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 border border-slate-200 text-slate-800 font-mono text-[10px] uppercase font-semibold rounded cursor-pointer"
          >
            Dismiss
          </button>
        </div>
      )}
    </div>
  );
};
