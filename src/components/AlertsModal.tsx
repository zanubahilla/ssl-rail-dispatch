import React from 'react';
import { AlertItem, ActiveView } from '../types';

interface AlertsModalProps {
  isOpen: boolean;
  onClose: () => void;
  alerts: AlertItem[];
  onNavigateToView: (view: ActiveView) => void;
}

export const AlertsModal: React.FC<AlertsModalProps> = ({
  isOpen,
  onClose,
  alerts,
  onNavigateToView,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-xs p-4">
      <div className="bg-white border border-slate-300 rounded-lg shadow-2xl w-full max-w-xl flex flex-col overflow-hidden select-none">
        {/* Header */}
        <div className="px-4 py-3 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-rose-600 text-[20px]">warning</span>
            <span className="font-mono text-[12px] font-bold text-slate-900 tracking-wider uppercase">
              ACTIVE TELEMETRY ALERTS ({alerts.length})
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

        {/* Content */}
        <div className="p-4 flex flex-col gap-3 max-h-[70vh] overflow-y-auto">
          {alerts.map((alert) => (
            <div
              key={alert.id}
              className="p-3 bg-slate-50 border border-slate-200 rounded flex flex-col gap-1.5 hover:border-slate-300 transition-colors"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span
                    className={`font-mono text-[9px] px-1.5 py-[1px] rounded font-bold border ${
                      alert.type === 'CRIT'
                        ? 'bg-rose-100 text-rose-800 border-rose-300'
                        : 'bg-amber-100 text-amber-800 border-amber-300'
                    }`}
                  >
                    {alert.type}
                  </span>
                  <span className="font-mono text-[11px] font-bold text-slate-900">{alert.code}</span>
                </div>
                <span className="font-mono text-[9px] text-slate-500">{alert.timestamp}</span>
              </div>

              <p className="text-[11px] text-slate-700 leading-relaxed">{alert.message}</p>

              <div className="flex items-center justify-between pt-1 border-t border-slate-200 mt-1">
                <span className="font-mono text-[9px] text-slate-500 font-semibold">LOC: {alert.location}</span>
                <button
                  type="button"
                  onClick={() => {
                    onClose();
                    if (alert.code.includes('DEF')) {
                      onNavigateToView('02-00-am-sandbox');
                    } else {
                      onNavigateToView('micro-spatial-gate');
                    }
                  }}
                  className="px-2 py-0.5 bg-sky-50 hover:bg-sky-100 text-sky-800 border border-sky-200 font-mono text-[9px] font-bold rounded flex items-center gap-1 cursor-pointer transition-colors"
                >
                  <span>INVESTIGATE SECTOR</span>
                  <span className="material-symbols-outlined text-[12px]">arrow_forward</span>
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="px-4 py-2.5 bg-slate-50 border-t border-slate-200 flex items-center justify-between text-[11px] text-slate-500">
          <span>SCADA Network Synchronized</span>
          <button
            type="button"
            onClick={onClose}
            className="px-3 py-1 bg-white hover:bg-slate-100 border border-slate-300 font-mono text-[11px] font-semibold text-slate-800 rounded cursor-pointer transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
