import React, { useEffect, useMemo, useState } from 'react';
import { fetchSchedule, ScheduleResponse } from '../api';

interface ScheduleCalendarProps {
  scenario: 'A' | 'B' | 'C';
  onScenarioChange: (scenario: 'A' | 'B' | 'C') => void;
}

const PRIORITY_LABEL: Record<number, string> = { 1: 'HIGH', 2: 'DEFAULT', 3: 'LOW' };

export const ScheduleCalendar: React.FC<ScheduleCalendarProps> = ({ scenario, onScenarioChange }) => {
  const [data, setData] = useState<ScheduleResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedLocation, setSelectedLocation] = useState<string | null>(null);
  const [selectedWeek, setSelectedWeek] = useState<number | null>(null);

  useEffect(() => {
    setLoading(true);
    fetchSchedule(scenario).then((res) => {
      setData(res);
      setLoading(false);
      if (res) {
        const firstOccupied = res.locations.find((l) => res.occupancy[l.location_id]);
        setSelectedLocation(firstOccupied ? firstOccupied.location_id : res.locations[0]?.location_id ?? null);
        setSelectedWeek(null);
      }
    });
  }, [scenario]);

  const activityById = useMemo(() => {
    const map = new Map<string, ScheduleResponse['activities'][number]>();
    data?.activities.forEach((a) => map.set(a.activity_id, a));
    return map;
  }, [data]);

  const contractById = useMemo(() => {
    const map = new Map<string, ScheduleResponse['contracts'][number]>();
    data?.contracts.forEach((c) => map.set(c.contract_number, c));
    return map;
  }, [data]);

  const filteredLocations = useMemo(() => {
    if (!data) return [];
    const q = search.trim().toUpperCase();
    return data.locations
      .filter((l) => !q || l.location_id.toUpperCase().includes(q))
      .sort((a, b) => a.location_id.localeCompare(b.location_id));
  }, [data, search]);

  const locationsByLine = useMemo(() => {
    const groups: Record<string, typeof filteredLocations> = {};
    filteredLocations.forEach((l) => {
      const key = l.line_code || 'OTHER';
      (groups[key] ||= []).push(l);
    });
    return groups;
  }, [filteredLocations]);

  const occupancyForSelected = selectedLocation ? data?.occupancy[selectedLocation] : undefined;
  const weekEntries = selectedWeek != null ? occupancyForSelected?.[String(selectedWeek)] ?? [] : [];

  return (
    <div className="flex flex-col w-full gap-4 select-none">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-2 bg-white p-3.5 border border-slate-200 shadow-xs rounded">
        <div className="flex flex-col gap-0.5">
          <span className="font-mono text-[11px] font-bold uppercase tracking-wider text-slate-900">
            SCHEDULE CALENDAR
          </span>
          <span className="text-[11px] text-slate-500">
            Pick a tunnel or platform sector to see which activity occupies it, week by week.
          </span>
        </div>
        <div className="flex items-center gap-1.5 bg-slate-100 p-1 border border-slate-200 rounded self-start md:self-auto">
          {(['A', 'B', 'C'] as const).map((sc) => (
            <button
              key={sc}
              type="button"
              onClick={() => onScenarioChange(sc)}
              className={`px-2.5 py-1 font-mono text-[11px] rounded transition-all cursor-pointer ${
                scenario === sc
                  ? 'bg-white text-sky-800 border border-sky-300 font-bold shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 font-medium'
              }`}
            >
              Scenario {sc}
            </button>
          ))}
        </div>
      </div>

      {loading && (
        <div className="bg-white border border-slate-200 rounded p-6 text-center text-[12px] text-slate-500">
          Loading schedule…
        </div>
      )}

      {!loading && !data && (
        <div className="bg-white border border-slate-200 rounded p-6 text-center text-[12px] text-rose-700">
          Couldn't reach the scheduler backend (ps1_solver on :8000). Start it and reload this page.
        </div>
      )}

      {!loading && data && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-start">
          {/* Location picker */}
          <div className="lg:col-span-3 bg-white border border-slate-200 rounded-lg p-3.5 shadow-xs flex flex-col gap-2.5">
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Filter sectors (e.g. S01, PLAT, H01)"
              className="w-full px-2.5 py-1.5 text-[11px] font-mono bg-slate-50 border border-slate-200 rounded outline-none focus:border-sky-400"
            />
            <div className="flex flex-col gap-2.5 max-h-[520px] overflow-y-auto pr-1">
              {Object.entries(locationsByLine).map(([line, locs]) => (
                <div key={line} className="flex flex-col gap-1">
                  <span className="font-mono text-[9px] uppercase tracking-widest text-slate-400 font-bold px-1">
                    {line} • {locs.length}
                  </span>
                  {locs.map((loc) => {
                    const occWeeks = data.occupancy[loc.location_id];
                    const occCount = occWeeks ? Object.keys(occWeeks).length : 0;
                    const isSelected = selectedLocation === loc.location_id;
                    return (
                      <button
                        key={loc.location_id}
                        type="button"
                        onClick={() => {
                          setSelectedLocation(loc.location_id);
                          setSelectedWeek(null);
                        }}
                        className={`text-left px-2 py-1.5 rounded border font-mono text-[10px] transition-colors cursor-pointer ${
                          isSelected
                            ? 'bg-sky-50 border-sky-300 text-sky-900 font-bold'
                            : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                        }`}
                      >
                        <div className="flex items-center justify-between gap-2">
                          <span className="truncate">{loc.location_id}</span>
                          {occCount > 0 && (
                            <span className="shrink-0 px-1 bg-emerald-100 text-emerald-800 border border-emerald-300 rounded text-[9px] font-bold">
                              {occCount}w
                            </span>
                          )}
                        </div>
                      </button>
                    );
                  })}
                </div>
              ))}
              {filteredLocations.length === 0 && (
                <span className="text-[11px] text-slate-400 px-1">No sectors match.</span>
              )}
            </div>
          </div>

          {/* Weekly calendar for selected location */}
          <div className="lg:col-span-9 flex flex-col gap-4">
            <div className="bg-white border border-slate-200 rounded-lg p-3.5 shadow-xs flex flex-col gap-3">
              <div className="flex items-center justify-between flex-wrap gap-2">
                <span className="font-mono text-[11px] font-bold text-slate-900">
                  {selectedLocation || 'Select a sector'}
                </span>
                <span className="font-mono text-[9px] text-slate-500">
                  {data.horizon_weeks}-week horizon • Scenario {scenario}
                </span>
              </div>

              {selectedLocation && (
                <div className="grid grid-cols-6 sm:grid-cols-10 gap-1.5">
                  {Array.from({ length: data.horizon_weeks }, (_, i) => i + 1).map((wk) => {
                    const entries = occupancyForSelected?.[String(wk)];
                    const occupied = !!entries && entries.length > 0;
                    const isSelectedWeek = selectedWeek === wk;
                    return (
                      <button
                        key={wk}
                        type="button"
                        disabled={!occupied}
                        onClick={() => setSelectedWeek(occupied ? wk : null)}
                        className={`flex flex-col items-center justify-center h-14 rounded border font-mono text-[9px] transition-colors ${
                          !occupied
                            ? 'bg-slate-50 border-slate-200 text-slate-300 cursor-default'
                            : isSelectedWeek
                            ? 'bg-sky-600 border-sky-700 text-white font-bold cursor-pointer'
                            : 'bg-emerald-50 border-emerald-300 text-emerald-800 font-bold hover:bg-emerald-100 cursor-pointer'
                        }`}
                        title={occupied ? `${entries!.length} activity access(es) in week ${wk}` : `Week ${wk}: free`}
                      >
                        <span>W{wk}</span>
                        {occupied && <span className="text-[8px] mt-0.5">{entries!.length} act</span>}
                      </button>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Detail panel for the clicked week */}
            {selectedWeek != null && weekEntries.length > 0 && (
              <div className="bg-white border border-slate-200 rounded-lg p-3.5 shadow-xs flex flex-col gap-2">
                <span className="font-mono text-[10px] font-bold uppercase tracking-wider text-slate-600">
                  {selectedLocation} — Week {selectedWeek}
                </span>
                {weekEntries.map((entry, idx) => {
                  const act = activityById.get(entry.activity_id);
                  const contract = act ? contractById.get(act.contract_number) : undefined;
                  return (
                    <div
                      key={`${entry.activity_id}-${idx}`}
                      className="p-2.5 bg-slate-50 border border-slate-200 rounded flex items-center justify-between gap-3"
                    >
                      <div className="flex flex-col">
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-[11px] font-bold text-slate-900">{entry.activity_id}</span>
                          <span className="font-mono text-[9px] px-1.5 py-[1px] bg-white border border-slate-300 rounded text-slate-700 font-bold">
                            {act?.activity_type ?? '—'}
                          </span>
                          <span className="font-mono text-[9px] text-slate-500">
                            co-share: {entry.co_share_group}
                          </span>
                        </div>
                        <span className="text-[11px] text-slate-600 mt-0.5">
                          {contract ? `${contract.contract_number} • ${contract.description}` : act?.contract_number}
                        </span>
                      </div>
                      {act && (
                        <span className="shrink-0 font-mono text-[9px] px-1.5 py-[2px] bg-white border border-slate-300 rounded text-slate-600 font-bold">
                          PRIORITY {PRIORITY_LABEL[act.activity_priority] ?? act.activity_priority}
                        </span>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
