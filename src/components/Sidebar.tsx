import React from 'react';
import { ActiveView } from '../types';

interface SidebarProps {
  activeView: ActiveView;
  onSelectView: (view: ActiveView) => void;
  interlockSecured: boolean;
  ledgerBlock: number;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeView,
  onSelectView,
  interlockSecured,
  ledgerBlock,
}) => {
  return (
    <aside className="fixed left-0 top-14 h-[calc(100vh-3.5rem)] w-64 bg-white z-40 flex flex-col border-r border-slate-200 justify-between shadow-sm select-none">
      <div className="flex flex-col">
        {/* Navigation Desk Header */}
        <div className="px-4 py-3 border-b border-slate-200 bg-slate-50 flex items-center justify-between">
          <span className="font-mono text-[9px] uppercase tracking-widest text-slate-500 font-semibold">
            NAVIGATION DESK
          </span>
          <span className="font-mono text-[10px] text-emerald-700 font-semibold flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-pulse"></span>
            NOC-SYNC
          </span>
        </div>

        {/* Navigation items */}
        <nav className="flex flex-col py-1">
          {/* 01: Topology Command */}
          <button
            type="button"
            onClick={() => onSelectView('topology-command')}
            className={`flex flex-col px-4 py-3 text-left transition-all border-l-2 cursor-pointer group ${
              activeView === 'topology-command'
                ? 'bg-sky-50 text-sky-900 border-sky-600 font-bold'
                : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900 border-transparent'
            }`}
          >
            <div className="flex items-center justify-between mb-1">
              <span
                className={`font-mono text-[11px] tracking-wider uppercase font-semibold ${
                  activeView === 'topology-command' ? 'text-sky-800 font-bold' : ''
                }`}
              >
                Topology Command
              </span>
              <span
                className={`font-mono text-[9px] font-bold ${
                  activeView === 'topology-command'
                    ? 'text-sky-700'
                    : 'text-slate-400 group-hover:text-sky-700'
                }`}
              >
                01
              </span>
            </div>
            <span
              className={`text-[11px] leading-tight ${
                activeView === 'topology-command' ? 'text-slate-700 font-medium' : 'text-slate-500'
              }`}
            >
              Real-Time Network Dispatch &amp; Track Access
            </span>
          </button>

          {/* 02: Micro-Spatial Gate */}
          <button
            type="button"
            onClick={() => onSelectView('micro-spatial-gate')}
            className={`flex flex-col px-4 py-3 text-left transition-all border-l-2 cursor-pointer group ${
              activeView === 'micro-spatial-gate'
                ? 'bg-sky-50 text-sky-900 border-sky-600 font-bold'
                : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900 border-transparent'
            }`}
          >
            <div className="flex items-center justify-between mb-1">
              <span
                className={`font-mono text-[11px] tracking-wider uppercase font-semibold ${
                  activeView === 'micro-spatial-gate' ? 'text-sky-800 font-bold' : ''
                }`}
              >
                Micro-Spatial Gate
              </span>
              <span
                className={`font-mono text-[9px] font-bold ${
                  activeView === 'micro-spatial-gate'
                    ? 'text-sky-700'
                    : 'text-slate-400 group-hover:text-sky-700'
                }`}
              >
                02
              </span>
            </div>
            <span
              className={`text-[11px] leading-tight ${
                activeView === 'micro-spatial-gate' ? 'text-slate-700 font-medium' : 'text-slate-500'
              }`}
            >
              Volumetric Clearance &amp; Rest Guard
            </span>
          </button>

          {/* 03: 02:00 AM Sandbox */}
          <button
            type="button"
            onClick={() => onSelectView('02-00-am-sandbox')}
            className={`flex flex-col px-4 py-3 text-left transition-all border-l-2 cursor-pointer group ${
              activeView === '02-00-am-sandbox'
                ? 'bg-sky-50 text-sky-900 border-sky-600 font-bold'
                : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900 border-transparent'
            }`}
          >
            <div className="flex items-center justify-between mb-1">
              <div className="flex items-center gap-1.5">
                <span
                  className={`font-mono text-[11px] tracking-wider uppercase font-semibold ${
                    activeView === '02-00-am-sandbox' ? 'text-sky-800 font-bold' : ''
                  }`}
                >
                  02:00 AM Sandbox
                </span>
                <span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse" title="Active Incident Alert"></span>
              </div>
              <span
                className={`font-mono text-[9px] font-bold ${
                  activeView === '02-00-am-sandbox'
                    ? 'text-sky-700'
                    : 'text-slate-400 group-hover:text-sky-700'
                }`}
              >
                03
              </span>
            </div>
            <span
              className={`text-[11px] leading-tight ${
                activeView === '02-00-am-sandbox' ? 'text-slate-700 font-medium' : 'text-slate-500'
              }`}
            >
              Urgent Re-Plan Engine &amp; Trade-Off Matrix
            </span>
          </button>
        </nav>
      </div>

      {/* Bottom Status Card */}
      <div className="p-3 border-t border-slate-200 bg-slate-50">
        <div className="p-2.5 bg-white border border-slate-200 rounded flex flex-col gap-1.5 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="font-mono text-[9px] text-slate-500 uppercase font-semibold">
              INTERLOCK LOCKOUT
            </span>
            <span
              className={`font-mono text-[10px] font-bold ${
                interlockSecured ? 'text-emerald-700' : 'text-amber-600'
              }`}
            >
              {interlockSecured ? 'SECURED' : 'UNLOCKED'}
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span className="font-mono text-[9px] text-slate-500 uppercase font-semibold">
              CONSENSUS LEDGER
            </span>
            <span className="font-mono text-[10px] text-sky-700 font-bold">
              BLOCK #{ledgerBlock.toLocaleString()}
            </span>
          </div>
          <div className="w-full bg-slate-200 h-1.5 mt-1 rounded-full overflow-hidden">
            <div className="bg-sky-600 h-full w-4/5 rounded-full animate-pulse"></div>
          </div>
        </div>
      </div>
    </aside>
  );
};
