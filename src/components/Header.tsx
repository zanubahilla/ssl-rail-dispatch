import React from 'react';
import { ScheduleScenario, AlertItem } from '../types';

interface HeaderProps {
  scenario: ScheduleScenario;
  onSelectScenario: (scenario: ScheduleScenario) => void;
  alerts: AlertItem[];
  onOpenAlertsModal?: () => void;
  hh: string;
  mm: string;
  ss: string;
  amPm: string;
  is24Hour: boolean;
  onToggle24Hour: () => void;
  dateFormatted: string;
  timeZoneName: string;
  timelineMode: 'realtime' | 'nocturnal';
  onToggleTimelineMode: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  scenario,
  onSelectScenario,
  alerts,
  onOpenAlertsModal,
  hh,
  mm,
  ss,
  amPm,
  is24Hour,
  onToggle24Hour,
  dateFormatted,
  timeZoneName,
  timelineMode,
  onToggleTimelineMode,
}) => {
  const critCount = alerts.filter((a) => a.type === 'CRIT').length;
  const wrnCount = alerts.filter((a) => a.type === 'WRN').length;

  return (
    <header className="fixed top-0 left-0 w-full h-14 bg-white z-50 flex items-center justify-between px-4 border-b border-slate-200 shadow-sm select-none">
      {/* Left: Branding & Clock & Line Status */}
      <div className="flex items-center gap-3 md:gap-4">
        <div className="flex items-center gap-2">
          <div className="relative flex items-center justify-center w-7 h-7 bg-sky-50 border border-sky-200 rounded">
            <div className="w-2.5 h-2.5 bg-sky-700 rotate-45"></div>
            <span className="absolute -top-0.5 -right-0.5 flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full bg-sky-600 opacity-75"></span>
              <span className="relative inline-flex h-2 w-2 bg-sky-600 rounded-full"></span>
            </span>
          </div>
          <div className="flex flex-col">
            <span className="font-mono text-[13px] tracking-wider font-bold text-sky-800 leading-tight">
              SSL // RAIL-DISPATCH
            </span>
            <span className="font-mono text-[9px] uppercase tracking-widest text-slate-500 font-semibold">
              v4.8.2-PROD [LTA-NOC]
            </span>
          </div>
        </div>

        <div className="h-6 w-[1px] bg-slate-200"></div>

        {/* Live Actual Clock & Date */}
        <div className="flex items-center gap-2">
          <div
            onClick={onToggle24Hour}
            className="flex items-center gap-0.5 px-2.5 py-1 bg-slate-100 hover:bg-slate-200/80 border border-slate-200 rounded font-mono text-[15px] sm:text-[17px] font-bold shadow-xs cursor-pointer transition-colors"
            title="Click to toggle 12h / 24h format • Actual system clock synchronized"
          >
            <span className="text-sky-800">{hh}</span>
            <span className="text-amber-600 animate-pulse">:</span>
            <span className="text-sky-800">{mm}</span>
            <span className="text-amber-600 animate-pulse">:</span>
            <span className="text-sky-800">{ss}</span>
            {amPm && (
              <span className="text-[10px] text-slate-500 ml-1 self-end mb-0.5 font-sans font-medium">
                {amPm}
              </span>
            )}
            <span className="text-[10px] px-1 py-[1px] bg-white text-sky-800 border border-slate-200 rounded ml-1.5 font-sans font-bold">
              {timeZoneName}
            </span>
          </div>

          {/* Date Badge */}
          <div className="hidden lg:flex items-center gap-1.5 px-2 py-1 bg-slate-50 border border-slate-200 rounded font-mono text-[10px] text-slate-600">
            <span className="material-symbols-outlined text-[13px] text-slate-400">calendar_today</span>
            <span>{dateFormatted}</span>
          </div>

          {/* Timeline Mode Quick Switch */}
          <button
            type="button"
            onClick={onToggleTimelineMode}
            className={`hidden md:flex items-center gap-1 px-2 py-1 rounded font-mono text-[10px] font-bold border transition-colors cursor-pointer ${
              timelineMode === 'realtime'
                ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
                : 'bg-amber-50 text-amber-800 border-amber-300'
            }`}
            title="Toggle Timeline mode between Live Actual Time and Nocturnal Simulation (01:30 - 04:30)"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-pulse"></span>
            <span>{timelineMode === 'realtime' ? 'LIVE TIME SYNC' : 'NOCTURNAL SHIFT'}</span>
          </button>
        </div>
      </div>

      {/* Middle: Schedule Matrix Mode Selector */}
      <div className="hidden xl:flex items-center gap-1.5 bg-slate-100 p-1 border border-slate-200 rounded">
        <span className="font-mono text-[9px] uppercase tracking-widest text-slate-500 px-1 font-semibold">
          SCHEDULE MATRIX:
        </span>
        <button
          type="button"
          onClick={() => onSelectScenario('scenario-a')}
          className={`px-2.5 py-1 font-mono text-[11px] rounded transition-all cursor-pointer ${
            scenario === 'scenario-a'
              ? 'bg-sky-50 text-sky-800 border border-sky-300 font-bold shadow-xs'
              : 'text-slate-600 bg-white hover:bg-slate-50 hover:text-slate-900 border border-slate-200 font-medium'
          }`}
        >
          Scenario A: Rigid
        </button>
        <button
          type="button"
          onClick={() => onSelectScenario('scenario-b')}
          className={`px-2.5 py-1 font-mono text-[11px] rounded transition-all cursor-pointer ${
            scenario === 'scenario-b'
              ? 'bg-sky-50 text-sky-800 border border-sky-300 font-bold shadow-xs'
              : 'text-slate-600 bg-white hover:bg-slate-50 hover:text-slate-900 border border-slate-200 font-medium'
          }`}
        >
          Scenario B: Flexible Supply
        </button>
        <button
          type="button"
          onClick={() => onSelectScenario('scenario-c')}
          className={`px-2.5 py-1 font-mono text-[11px] rounded transition-all cursor-pointer flex items-center gap-1.5 ${
            scenario === 'scenario-c'
              ? 'bg-sky-50 text-sky-900 border border-sky-400 font-bold shadow-xs ring-1 ring-sky-300'
              : 'text-slate-600 bg-white hover:bg-slate-50 hover:text-slate-900 border border-slate-200 font-medium'
          }`}
        >
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-600"></span>
          Scenario C: Elastic Trade-off
        </button>
      </div>

      {/* Right: Alert Tally & User Profile */}
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-1.5 font-mono text-[11px]">
          <button
            type="button"
            onClick={onOpenAlertsModal}
            className="flex items-center gap-1 px-2 py-1 bg-slate-100 hover:bg-slate-200 border border-slate-200 rounded transition-colors cursor-pointer"
            title="Click to review system alerts"
          >
            <span className="text-slate-500 font-semibold">ALERT TALLY:</span>
            <span
              className={`px-1 rounded border text-[10px] font-bold ${
                critCount > 0
                  ? 'bg-rose-600 text-white border-rose-700'
                  : 'bg-white text-slate-700 border-slate-200'
              }`}
            >
              {critCount} CRIT
            </span>
            <span className="text-slate-400">/</span>
            <span className="px-1 bg-rose-100 text-rose-700 border border-rose-300 rounded font-bold text-[10px]">
              {wrnCount} WRN
            </span>
          </button>
        </div>

        <div className="h-6 w-[1px] bg-slate-200"></div>

        {/* Controller Badge */}
        <div className="flex items-center gap-2 pl-1">
          <div className="flex flex-col text-right hidden sm:flex">
            <span className="font-sans text-[12px] text-slate-900 leading-tight font-bold">
              Sam Chen [Controller 04]
            </span>
            <span className="font-mono text-[9px] uppercase tracking-wider text-sky-700 font-semibold">
              LTA POSSESSIONS CTRL
            </span>
          </div>
          <div
            className="w-8 h-8 rounded-full bg-sky-700 flex items-center justify-center shadow-sm text-white"
            title="Controller 04 Station Active"
          >
            <span className="material-symbols-outlined text-[18px]">person</span>
          </div>
        </div>
      </div>
    </header>
  );
};
