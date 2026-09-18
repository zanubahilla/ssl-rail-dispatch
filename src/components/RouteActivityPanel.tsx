import React, { useState } from 'react';
import { RailwayRoute, ActiveConsist, ActiveView } from '../types';

interface RouteActivityPanelProps {
  routes: RailwayRoute[];
  selectedRouteId: string | null;
  onSelectRoute: (routeId: 'ALP-EB' | 'ALP-WB' | 'BET-EB' | 'BET-WB' | null) => void;
  onSelectConsist: (consist: ActiveConsist) => void;
  onNavigateToView: (view: ActiveView) => void;
}

export const RouteActivityPanel: React.FC<RouteActivityPanelProps> = ({
  routes,
  selectedRouteId,
  onSelectRoute,
  onSelectConsist,
  onNavigateToView,
}) => {
  const [filterMode, setFilterMode] = useState<string>('ALL');

  const filteredRoutes =
    filterMode === 'ALL'
      ? routes
      : routes.filter((r) => r.id === filterMode);

  // High-level statistics
  const totalConsists = routes.reduce((acc, r) => acc + r.activeConsists.length, 0);
  const totalIsolated = routes.filter((r) => r.catenaryStatus.includes('DE-ENERGIZED')).length;
  const totalRestricted = routes.filter((r) => r.status === 'SPEED_RESTRICTED').length;

  return (
    <div className="bg-white border border-slate-200 rounded-lg p-3.5 shadow-xs flex flex-col gap-3 select-none">
      {/* Header & Metric Ticker */}
      <div className="flex flex-wrap items-center justify-between gap-2 pb-2.5 border-b border-slate-200">
        <div className="flex items-center gap-2.5">
          <div className="flex items-center justify-center w-6 h-6 rounded bg-sky-100 text-sky-800 border border-sky-300">
            <span className="material-symbols-outlined text-[15px]">traffic</span>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-mono text-[12px] font-bold text-slate-900 uppercase tracking-wider">
                CURRENT RAILWAY ROUTE ACTIVITIES
              </span>
              <span className="font-mono text-[9px] px-1.5 py-0.5 bg-emerald-50 text-emerald-800 border border-emerald-300 rounded font-bold flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-pulse"></span>
                LIVE DISPATCH
              </span>
            </div>
            <span className="text-[11px] text-slate-500">
              Real-time consist tracking, speed restrictions, traction isolation &amp; circuit occupancy
            </span>
          </div>
        </div>

        {/* Global Route Metrics */}
        <div className="flex items-center gap-2 font-mono text-[10px]">
          <div className="flex items-center gap-1 px-2 py-1 bg-slate-50 border border-slate-200 rounded text-slate-700">
            <span className="font-bold text-slate-900">{totalConsists}</span>
            <span className="text-slate-500">CONSISTS ACTIVE</span>
          </div>
          <div className="flex items-center gap-1 px-2 py-1 bg-rose-50 border border-rose-200 rounded text-rose-800">
            <span className="font-bold text-rose-700">{totalIsolated}</span>
            <span className="text-rose-600">ISOLATION</span>
          </div>
          <div className="flex items-center gap-1 px-2 py-1 bg-amber-50 border border-amber-200 rounded text-amber-800">
            <span className="font-bold text-amber-700">{totalRestricted}</span>
            <span className="text-amber-600">TSR ACTIVE</span>
          </div>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-1 bg-slate-100 p-1 rounded border border-slate-200 overflow-x-auto">
        <button
          type="button"
          onClick={() => {
            setFilterMode('ALL');
            onSelectRoute(null);
          }}
          className={`px-3 py-1 font-mono text-[10px] font-bold rounded transition-all cursor-pointer whitespace-nowrap ${
            filterMode === 'ALL'
              ? 'bg-white text-sky-900 shadow-xs border border-slate-200'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          ALL CORRIDORS ({routes.length})
        </button>

        {routes.map((r) => (
          <button
            key={r.id}
            type="button"
            onClick={() => {
              setFilterMode(r.id);
              onSelectRoute(r.id);
            }}
            className={`px-2.5 py-1 font-mono text-[10px] rounded transition-all cursor-pointer whitespace-nowrap flex items-center gap-1.5 ${
              filterMode === r.id
                ? 'bg-white text-slate-900 font-bold shadow-xs border border-slate-200'
                : 'text-slate-600 hover:text-slate-900 font-medium'
            }`}
          >
            <span
              className="w-2 h-2 rounded-full"
              style={{ backgroundColor: r.color }}
            ></span>
            <span>{r.trackCode}</span>
            <span className="text-[9px] px-1 py-[0.5px] rounded bg-slate-100 text-slate-600 font-semibold">
              {r.activeConsists.length}
            </span>
          </button>
        ))}
      </div>

      {/* Route Activity Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
        {filteredRoutes.map((route) => {
          const isSelected = selectedRouteId === route.id;
          return (
            <div
              key={route.id}
              className={`p-3 rounded-lg border transition-all flex flex-col justify-between gap-2.5 ${
                isSelected
                  ? 'bg-sky-50/50 border-sky-500 ring-2 ring-sky-200 shadow-sm'
                  : 'bg-slate-50/60 hover:bg-slate-50 border-slate-200'
              }`}
            >
              {/* Route Header */}
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-center gap-2">
                  <div
                    className="w-7 h-7 rounded flex items-center justify-center text-white font-mono text-[10px] font-extrabold shrink-0"
                    style={{ backgroundColor: route.color }}
                  >
                    {route.lineId}
                  </div>
                  <div>
                    <div className="flex items-center gap-1.5">
                      <h4 className="font-mono text-[12px] font-bold text-slate-900">
                        {route.trackCode}
                      </h4>
                      <span className="font-mono text-[9px] text-slate-500 font-semibold">
                        ({route.direction})
                      </span>
                    </div>
                    <span className="text-[10px] text-slate-500 block truncate">
                      {route.lineName} • {route.totalDistanceKm} km
                    </span>
                  </div>
                </div>

                {/* Status Badge */}
                <div className="flex flex-col items-end">
                  <span
                    className={`font-mono text-[9px] font-bold px-2 py-0.5 rounded border uppercase tracking-wider ${
                      route.status === 'MAINTENANCE_POSSESSION'
                        ? 'bg-rose-50 text-rose-700 border-rose-200'
                        : route.status === 'SPEED_RESTRICTED'
                        ? 'bg-amber-50 text-amber-700 border-amber-200'
                        : route.status === 'HOT_WORK_WELDING'
                        ? 'bg-amber-100 text-amber-900 border-amber-300'
                        : 'bg-emerald-50 text-emerald-700 border-emerald-200'
                    }`}
                  >
                    {route.status.replace(/_/g, ' ')}
                  </span>
                  <span className="font-mono text-[9px] text-slate-500 mt-0.5">
                    {route.activeSector.split(' ')[0]}
                  </span>
                </div>
              </div>

              {/* Route Telemetry Gauges */}
              <div className="grid grid-cols-3 gap-1.5 font-mono text-[9px] text-center">
                <div className="p-1.5 bg-white border border-slate-200 rounded shadow-2xs">
                  <span className="text-slate-500 block">SPEED LIMIT</span>
                  <span className="text-[11px] font-bold text-slate-900">
                    {route.speedLimitKmh === 0 ? (
                      <span className="text-rose-700">0 (LOCKED)</span>
                    ) : (
                      `${route.speedLimitKmh} km/h`
                    )}
                  </span>
                </div>
                <div className="p-1.5 bg-white border border-slate-200 rounded shadow-2xs">
                  <span className="text-slate-500 block">CATENARY</span>
                  <span
                    className={`text-[11px] font-bold ${
                      route.catenaryStatus.includes('0.00')
                        ? 'text-rose-700'
                        : 'text-emerald-700'
                    }`}
                  >
                    {route.catenaryStatus.split(' ')[0]} {route.catenaryStatus.split(' ')[1]}
                  </span>
                </div>
                <div className="p-1.5 bg-white border border-slate-200 rounded shadow-2xs">
                  <span className="text-slate-500 block">INTERLOCK</span>
                  <span
                    className={`text-[11px] font-bold ${
                      route.trackCircuitStatus === 'POSSESSION_LOCKED'
                        ? 'text-rose-700'
                        : route.trackCircuitStatus === 'CAUTION_SHUNTED'
                        ? 'text-amber-700'
                        : 'text-emerald-700'
                    }`}
                  >
                    {route.trackCircuitStatus.replace('_', ' ')}
                  </span>
                </div>
              </div>

              {/* Active Consists on This Route */}
              <div className="flex flex-col gap-1.5 mt-1">
                <span className="font-mono text-[9px] text-slate-500 font-semibold uppercase flex items-center justify-between">
                  <span>ACTIVE UNITS &amp; TRAFFIC ON ROUTE</span>
                  <span>{route.activeConsists.length} CONSIST(S)</span>
                </span>

                {route.activeConsists.map((consist) => (
                  <div
                    key={consist.id}
                    onClick={() => onSelectConsist(consist)}
                    className="p-2 bg-white hover:bg-slate-100/80 border border-slate-200 rounded flex flex-col gap-1 cursor-pointer transition-colors shadow-2xs group"
                    title="Click to open comprehensive telemetry for this consist"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1.5">
                        <span
                          className={`w-2 h-2 rounded-full ${
                            consist.status === 'STATIONARY_WORK'
                              ? 'bg-rose-600 animate-ping'
                              : consist.status === 'CAUTION_CRAWL'
                              ? 'bg-amber-500 animate-pulse'
                              : 'bg-emerald-600'
                          }`}
                        ></span>
                        <span className="font-mono text-[11px] font-bold text-slate-900 group-hover:text-sky-800 transition-colors">
                          {consist.code}
                        </span>
                        <span className="font-mono text-[9px] text-slate-500">
                          [{consist.type.replace(/_/g, ' ')}]
                        </span>
                      </div>
                      <div className="flex items-center gap-1.5 font-mono text-[10px]">
                        <span className="font-bold text-slate-800">
                          {consist.speedKmh.toFixed(1)} km/h
                        </span>
                        <span className="material-symbols-outlined text-[14px] text-slate-400 group-hover:text-sky-700">
                          visibility
                        </span>
                      </div>
                    </div>

                    <div className="text-[10px] text-slate-600 font-sans line-clamp-1">
                      {consist.currentTask}
                    </div>

                    <div className="flex items-center justify-between font-mono text-[9px] text-slate-500 pt-1 border-t border-slate-100">
                      <span>{consist.chainageKm} • {consist.adjacentStation}</span>
                      <span className="text-sky-800 font-semibold">{consist.crewLead.split('[')[0]}</span>
                    </div>
                  </div>
                ))}
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-between pt-1 border-t border-slate-200/80 font-mono text-[9px]">
                <button
                  type="button"
                  onClick={() => onSelectRoute(route.id)}
                  className={`px-2 py-1 rounded font-bold transition-colors cursor-pointer flex items-center gap-1 ${
                    isSelected
                      ? 'bg-sky-700 text-white'
                      : 'bg-white hover:bg-slate-200 border border-slate-300 text-slate-700'
                  }`}
                >
                  <span className="material-symbols-outlined text-[13px]">my_location</span>
                  <span>{isSelected ? 'TRACK HIGHLIGHTED' : 'HIGHLIGHT ON SCHEMATIC'}</span>
                </button>

                {route.id === 'ALP-EB' && (
                  <button
                    type="button"
                    onClick={() => onNavigateToView('micro-spatial-gate')}
                    className="px-2 py-1 bg-sky-50 hover:bg-sky-100 text-sky-800 border border-sky-200 rounded font-bold flex items-center gap-0.5 cursor-pointer transition-colors"
                  >
                    <span>3D GATE</span>
                    <span className="material-symbols-outlined text-[12px]">open_in_new</span>
                  </button>
                )}

                {route.id === 'ALP-WB' && (
                  <button
                    type="button"
                    onClick={() => onNavigateToView('02-00-am-sandbox')}
                    className="px-2 py-1 bg-amber-50 hover:bg-amber-100 text-amber-800 border border-amber-200 rounded font-bold flex items-center gap-0.5 cursor-pointer transition-colors"
                  >
                    <span>RE-PLAN SANDBOX</span>
                    <span className="material-symbols-outlined text-[12px]">open_in_new</span>
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
