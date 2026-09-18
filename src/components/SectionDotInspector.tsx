import React from 'react';
import { SectionDotActivity, SECTION_DOT_ACTIVITIES } from '../data/sectionDotData';
import { ActiveView } from '../types';

interface SectionDotInspectorProps {
  selectedDotId: string | null;
  onSelectDot: (id: string | null) => void;
  onNavigateToView: (view: ActiveView) => void;
}

export const SectionDotInspector: React.FC<SectionDotInspectorProps> = ({
  selectedDotId,
  onSelectDot,
  onNavigateToView,
}) => {
  const activeDot: SectionDotActivity =
    selectedDotId && SECTION_DOT_ACTIVITIES[selectedDotId]
      ? SECTION_DOT_ACTIVITIES[selectedDotId]
      : SECTION_DOT_ACTIVITIES['H01'];

  const alphaDots = ['S01', 'S02', 'S03', 'S04', 'H01', 'H02', 'S05', 'S06', 'S07', 'S08'];
  const betaDots = ['S11', 'S12', 'S13', 'S14', 'H01', 'H02', 'S15', 'S16', 'S17', 'S18'];

  const getStatusColor = (status: SectionDotActivity['status']) => {
    switch (status) {
      case 'POSSESSION_WORKZONE':
        return {
          bg: 'bg-rose-50',
          text: 'text-rose-700',
          border: 'border-rose-200',
          dot: 'bg-rose-600',
          ping: true,
        };
      case 'APPROACHING_TRAFFIC':
        return {
          bg: 'bg-amber-50',
          text: 'text-amber-800',
          border: 'border-amber-300',
          dot: 'bg-amber-500',
          ping: true,
        };
      case 'RESTRICTED_TSR':
        return {
          bg: 'bg-amber-100/70',
          text: 'text-amber-900',
          border: 'border-amber-400',
          dot: 'bg-amber-600',
          ping: false,
        };
      case 'HOT_WORK_FUSION':
        return {
          bg: 'bg-orange-50',
          text: 'text-orange-800',
          border: 'border-orange-300',
          dot: 'bg-orange-600',
          ping: true,
        };
      case 'SWEEP_ACTIVE':
        return {
          bg: 'bg-emerald-50',
          text: 'text-emerald-800',
          border: 'border-emerald-300',
          dot: 'bg-emerald-600',
          ping: true,
        };
      case 'CLEAR':
      default:
        return {
          bg: 'bg-slate-50',
          text: 'text-slate-700',
          border: 'border-slate-200',
          dot: 'bg-emerald-500',
          ping: false,
        };
    }
  };

  const currentColors = getStatusColor(activeDot.status);

  return (
    <div className="bg-white border border-slate-200 rounded-lg p-3.5 shadow-xs flex flex-col gap-3 select-none">
      {/* Header with Title & Quick Switchers */}
      <div className="flex flex-wrap items-center justify-between gap-2 pb-2.5 border-b border-slate-200">
        <div className="flex items-center gap-2">
          <div className="flex items-center justify-center w-6 h-6 rounded bg-sky-100 text-sky-800 border border-sky-300">
            <span className="material-symbols-outlined text-[15px]">adjust</span>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-mono text-[12px] font-bold text-slate-900 uppercase tracking-wider">
                SECTION DOT TELEMETRY &amp; LIVE ACTIVITY
              </span>
              <span className="font-mono text-[9px] px-1.5 py-0.5 bg-sky-50 text-sky-800 border border-sky-200 rounded font-bold">
                18 TRACK NODES MONITORED
              </span>
            </div>
            <span className="text-[11px] text-slate-500">
              Click any station or interchange dot on the schematic above or select below to inspect real-time section conditions
            </span>
          </div>
        </div>

        {/* Selected dot summary chip */}
        <div className="flex items-center gap-2 font-mono text-[10px]">
          <span className="text-slate-500">ACTIVE SELECTION:</span>
          <span className="px-2 py-0.5 bg-slate-900 text-white font-bold rounded">
            {activeDot.id} ({activeDot.line} Line)
          </span>
        </div>
      </div>

      {/* Interactive Dot Quick-Bar for Alpha & Beta */}
      <div className="flex flex-col gap-1.5 bg-slate-50/80 p-2 rounded border border-slate-200">
        {/* Alpha Line Dots */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1">
          <span className="font-mono text-[9px] font-bold text-rose-700 w-16 shrink-0 flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-rose-600"></span>
            ALP DOTS:
          </span>
          <div className="flex items-center gap-1">
            {alphaDots.map((dotId) => {
              const dot = SECTION_DOT_ACTIVITIES[dotId];
              const isSelected = selectedDotId === dotId;
              const colorInfo = getStatusColor(dot.status);
              return (
                <button
                  key={`alp-${dotId}`}
                  type="button"
                  onClick={() => onSelectDot(dotId)}
                  className={`px-2 py-0.5 rounded font-mono text-[10px] font-bold transition-all cursor-pointer flex items-center gap-1 ${
                    isSelected
                      ? 'bg-rose-700 text-white shadow-xs scale-105'
                      : 'bg-white hover:bg-rose-50 border border-slate-200 text-slate-700 hover:border-rose-300'
                  }`}
                  title={`${dot.id} (${dot.chainage}): ${dot.statusLabel}`}
                >
                  <span
                    className={`w-1.5 h-1.5 rounded-full ${
                      isSelected ? 'bg-white' : colorInfo.dot
                    } ${colorInfo.ping && !isSelected ? 'animate-pulse' : ''}`}
                  ></span>
                  <span>{dotId}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Beta Line Dots */}
        <div className="flex items-center gap-2 overflow-x-auto">
          <span className="font-mono text-[9px] font-bold text-emerald-700 w-16 shrink-0 flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-emerald-600"></span>
            BET DOTS:
          </span>
          <div className="flex items-center gap-1">
            {betaDots.map((dotId) => {
              const dot = SECTION_DOT_ACTIVITIES[dotId];
              const isSelected = selectedDotId === dotId;
              const colorInfo = getStatusColor(dot.status);
              return (
                <button
                  key={`bet-${dotId}`}
                  type="button"
                  onClick={() => onSelectDot(dotId)}
                  className={`px-2 py-0.5 rounded font-mono text-[10px] font-bold transition-all cursor-pointer flex items-center gap-1 ${
                    isSelected
                      ? 'bg-emerald-700 text-white shadow-xs scale-105'
                      : 'bg-white hover:bg-emerald-50 border border-slate-200 text-slate-700 hover:border-emerald-300'
                  }`}
                  title={`${dot.id} (${dot.chainage}): ${dot.statusLabel}`}
                >
                  <span
                    className={`w-1.5 h-1.5 rounded-full ${
                      isSelected ? 'bg-white' : colorInfo.dot
                    } ${colorInfo.ping && !isSelected ? 'animate-pulse' : ''}`}
                  ></span>
                  <span>{dotId}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Detailed Card for the Selected Section Dot */}
      <div className="bg-slate-50 border border-slate-200 rounded-lg p-3.5 flex flex-col gap-3">
        {/* Card Header */}
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <div
              className={`w-8 h-8 rounded flex items-center justify-center font-mono text-[13px] font-extrabold text-white ${
                activeDot.line === 'Alpha' ? 'bg-rose-700' : 'bg-emerald-700'
              }`}
            >
              {activeDot.id}
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <h3 className="font-mono text-[13px] font-bold text-slate-900">
                  {activeDot.name}
                </h3>
                <span className="font-mono text-[10px] text-slate-500">
                  [{activeDot.chainage}]
                </span>
              </div>
              <span className="text-[11px] text-slate-600">
                Corridor: Metro Line {activeDot.line} • Track Circuit Sensor Node
              </span>
            </div>
          </div>

          <span
            className={`font-mono text-[10px] font-bold px-2.5 py-1 rounded border flex items-center gap-1.5 uppercase tracking-wider ${currentColors.bg} ${currentColors.text} ${currentColors.border}`}
          >
            <span
              className={`w-2 h-2 rounded-full ${currentColors.dot} ${
                currentColors.ping ? 'animate-ping' : ''
              }`}
            ></span>
            {activeDot.statusLabel}
          </span>
        </div>

        {/* Current Activity Banner */}
        <div className="p-2.5 bg-white border border-slate-200 rounded flex flex-col gap-1 shadow-2xs">
          <span className="font-mono text-[10px] text-slate-500 font-semibold uppercase flex items-center gap-1">
            <span className="material-symbols-outlined text-[13px] text-sky-700">sensors</span>
            LIVE OCCUPANCY &amp; ON-TRACK ACTIVITY
          </span>
          <p className="text-[12px] text-slate-800 leading-relaxed font-sans font-medium">
            {activeDot.currentActivity}
          </p>
        </div>

        {/* Section Technical Gauges */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 font-mono text-[10px] text-center">
          <div className="p-2 bg-white border border-slate-200 rounded shadow-2xs">
            <span className="text-slate-500 block text-[9px] uppercase">TRACTION POWER</span>
            <span
              className={`text-[12px] font-bold ${
                activeDot.tractionState.includes('ISOLATED')
                  ? 'text-rose-700'
                  : 'text-emerald-700'
              }`}
            >
              {activeDot.tractionState}
            </span>
          </div>

          <div className="p-2 bg-white border border-slate-200 rounded shadow-2xs">
            <span className="text-slate-500 block text-[9px] uppercase">CIRCUIT OCCUPANCY</span>
            <span
              className={`text-[12px] font-bold ${
                activeDot.circuitOccupancy === 'SHUNTED'
                  ? 'text-amber-700'
                  : 'text-emerald-700'
              }`}
            >
              {activeDot.circuitOccupancy}
            </span>
          </div>

          <div className="p-2 bg-white border border-slate-200 rounded shadow-2xs">
            <span className="text-slate-500 block text-[9px] uppercase">PLATFORM DOORS</span>
            <span className="text-[11px] font-bold text-slate-800">
              {activeDot.interlockPlatformDoor}
            </span>
          </div>

          <div className="p-2 bg-white border border-slate-200 rounded shadow-2xs">
            <span className="text-slate-500 block text-[9px] uppercase">ASSIGNED PERSONNEL</span>
            <span className="text-[11px] font-bold text-sky-900">
              {activeDot.workCrew ? activeDot.workCrew : 'NO GROUND CREW'}
            </span>
          </div>
        </div>

        {/* Contextual Action Links */}
        <div className="flex flex-wrap items-center justify-between gap-2 pt-1 border-t border-slate-200 text-[11px] font-mono">
          <div className="flex items-center gap-2">
            {activeDot.associatedConsist && (
              <span className="px-2 py-0.5 bg-sky-100 text-sky-900 border border-sky-300 rounded font-semibold text-[10px]">
                CONSIST: {activeDot.associatedConsist}
              </span>
            )}
            {activeDot.acousticDefect && (
              <span className="px-2 py-0.5 bg-rose-100 text-rose-900 border border-rose-300 rounded font-semibold text-[10px] animate-pulse">
                DEFECT SENSOR ACTIVE @ KM 16.420
              </span>
            )}
          </div>

          <div className="flex items-center gap-2">
            {(activeDot.id === 'H01' || activeDot.id === 'H02' || activeDot.id === 'S04') && (
              <button
                type="button"
                onClick={() => onNavigateToView('micro-spatial-gate')}
                className="px-2.5 py-1 bg-sky-700 hover:bg-sky-800 text-white rounded font-bold flex items-center gap-1 cursor-pointer transition-colors shadow-2xs"
              >
                <span>OPEN 3D SPATIAL GATE</span>
                <span className="material-symbols-outlined text-[13px]">arrow_forward</span>
              </button>
            )}

            {(activeDot.id === 'S02' || activeDot.id === 'S03') && (
              <button
                type="button"
                onClick={() => onNavigateToView('02-00-am-sandbox')}
                className="px-2.5 py-1 bg-amber-600 hover:bg-amber-700 text-white rounded font-bold flex items-center gap-1 cursor-pointer transition-colors shadow-2xs"
              >
                <span>OPEN S02 DEFECT SANDBOX</span>
                <span className="material-symbols-outlined text-[13px]">arrow_forward</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
