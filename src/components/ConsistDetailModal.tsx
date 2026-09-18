import React from 'react';
import { ActiveConsist, ActiveView } from '../types';

interface ConsistDetailModalProps {
  consist: ActiveConsist | null;
  onClose: () => void;
  onNavigateToView: (view: ActiveView) => void;
}

export const ConsistDetailModal: React.FC<ConsistDetailModalProps> = ({
  consist,
  onClose,
  onNavigateToView,
}) => {
  if (!consist) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4 animate-in fade-in duration-200">
      <div className="bg-white border border-slate-300 rounded-lg shadow-2xl w-full max-w-xl flex flex-col overflow-hidden select-none">
        {/* Modal Header */}
        <div className="px-4 py-3 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-600 animate-pulse"></span>
            <span className="font-mono text-[12px] font-bold text-slate-900 tracking-wider uppercase">
              ROUTE TELEMETRY // {consist.code}
            </span>
            <span className="font-mono text-[10px] px-1.5 py-0.5 bg-sky-100 text-sky-800 border border-sky-300 rounded font-bold">
              {consist.routeId}
            </span>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-slate-400 hover:text-slate-700 p-1 rounded transition-colors cursor-pointer"
          >
            <span className="material-symbols-outlined text-[18px]">close</span>
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-4 flex flex-col gap-3.5 max-h-[75vh] overflow-y-auto">
          {/* Main Unit Card */}
          <div className="p-3 bg-slate-50 border border-slate-200 rounded flex flex-col gap-2">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-mono text-[13px] font-bold text-slate-900">{consist.name}</h3>
                <span className="text-[11px] text-slate-600">Lead: {consist.crewLead}</span>
              </div>
              <span
                className={`font-mono text-[10px] font-bold px-2 py-0.5 rounded border ${
                  consist.status === 'STATIONARY_WORK'
                    ? 'bg-rose-50 text-rose-700 border-rose-200'
                    : consist.status === 'CAUTION_CRAWL'
                    ? 'bg-amber-50 text-amber-700 border-amber-200'
                    : 'bg-emerald-50 text-emerald-700 border-emerald-200'
                }`}
              >
                {consist.status.replace('_', ' ')}
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-2 border-t border-slate-200 text-center font-mono">
              <div className="p-1.5 bg-white border border-slate-200 rounded shadow-2xs">
                <span className="text-[9px] text-slate-500 uppercase block">SPEED</span>
                <span className="text-[13px] font-bold text-slate-900">
                  {consist.speedKmh.toFixed(1)} <span className="text-[9px] text-slate-500">KM/H</span>
                </span>
              </div>
              <div className="p-1.5 bg-white border border-slate-200 rounded shadow-2xs">
                <span className="text-[9px] text-slate-500 uppercase block">LIMIT</span>
                <span className="text-[13px] font-bold text-slate-900">
                  {consist.speedLimitKmh} <span className="text-[9px] text-slate-500">KM/H</span>
                </span>
              </div>
              <div className="p-1.5 bg-white border border-slate-200 rounded shadow-2xs">
                <span className="text-[9px] text-slate-500 uppercase block">TRACTION</span>
                <span
                  className={`text-[12px] font-bold ${
                    consist.tractionStatus === 'ISOLATED' ? 'text-rose-700' : 'text-emerald-700'
                  }`}
                >
                  {consist.tractionVoltage}
                </span>
              </div>
              <div className="p-1.5 bg-white border border-slate-200 rounded shadow-2xs">
                <span className="text-[9px] text-slate-500 uppercase block">SIGNAL</span>
                <span
                  className={`text-[11px] font-bold ${
                    consist.signalAspect === 'RED_STOP'
                      ? 'text-rose-700'
                      : consist.signalAspect === 'YELLOW_CAUTION' || consist.signalAspect === 'AMBER_PULSE'
                      ? 'text-amber-700'
                      : 'text-emerald-700'
                  }`}
                >
                  {consist.signalAspect.replace('_', ' ')}
                </span>
              </div>
            </div>
          </div>

          {/* Current Operation Description */}
          <div className="p-3 bg-white border border-slate-200 rounded flex flex-col gap-1.5">
            <span className="font-mono text-[10px] text-slate-500 font-semibold uppercase">
              ACTIVE DISPATCH MANDATE // MISSION PROFILE
            </span>
            <p className="text-[12px] text-slate-800 leading-relaxed font-sans">{consist.currentTask}</p>
            <div className="flex flex-wrap items-center gap-3 pt-2 text-[10px] font-mono text-slate-600 border-t border-slate-100 mt-1">
              <span>LOC: <strong className="text-slate-900">{consist.chainageKm}</strong></span>
              <span>SECTOR: <strong className="text-slate-900">{consist.adjacentStation}</strong></span>
              <span>BUFFER: <strong className="text-sky-800">{consist.headwayBufferMeters.toLocaleString()}m</strong></span>
              <span>CREW SIZE: <strong className="text-slate-900">{consist.crewCount} TECHS</strong></span>
            </div>
          </div>

          {/* Safety & Spatial Compliance Status */}
          <div className="p-3 bg-slate-50 border border-slate-200 rounded flex flex-col gap-2">
            <span className="font-mono text-[10px] text-slate-500 font-semibold uppercase">
              DYNAMIC INTERLOCK &amp; HEADWAY VALIDATION
            </span>
            <div className="flex flex-col gap-1 text-[11px]">
              <div className="flex items-center justify-between">
                <span className="text-slate-600">ATP Transponder Shunt Telemetry:</span>
                <span className="font-mono font-bold text-emerald-700">VERIFIED (12ms POLLING)</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-600">Adjacent Track Buffer Protection:</span>
                <span className="font-mono font-bold text-emerald-700">ACTIVE (0.95m METRIC GUARD)</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-600">Earthing Clamps / Voltage Bleed:</span>
                <span className="font-mono font-bold text-slate-800">
                  {consist.tractionStatus === 'ISOLATED' ? 'PORTABLE CLAMP ENGAGED' : 'NOT REQUIRED (LIVE)'}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="px-4 py-3 bg-slate-50 border-t border-slate-200 flex items-center justify-between">
          <div className="flex items-center gap-2">
            {consist.routeId === 'ALP-EB' && (
              <button
                type="button"
                onClick={() => {
                  onClose();
                  onNavigateToView('micro-spatial-gate');
                }}
                className="px-3 py-1.5 bg-sky-700 hover:bg-sky-800 text-white font-mono text-[11px] font-bold rounded flex items-center gap-1.5 cursor-pointer shadow-xs transition-colors"
              >
                <span>INSPECT 3D CLEARANCE GATE</span>
                <span className="material-symbols-outlined text-[14px]">arrow_forward</span>
              </button>
            )}
            {consist.routeId === 'ALP-WB' && (
              <button
                type="button"
                onClick={() => {
                  onClose();
                  onNavigateToView('02-00-am-sandbox');
                }}
                className="px-3 py-1.5 bg-amber-600 hover:bg-amber-700 text-white font-mono text-[11px] font-bold rounded flex items-center gap-1.5 cursor-pointer shadow-xs transition-colors"
              >
                <span>VIEW S02 DEFECT SANDBOX</span>
                <span className="material-symbols-outlined text-[14px]">arrow_forward</span>
              </button>
            )}
          </div>

          <button
            type="button"
            onClick={onClose}
            className="px-3 py-1.5 bg-white hover:bg-slate-100 border border-slate-300 font-mono text-[11px] font-semibold text-slate-800 rounded cursor-pointer transition-colors"
          >
            Close Telemetry
          </button>
        </div>
      </div>
    </div>
  );
};
