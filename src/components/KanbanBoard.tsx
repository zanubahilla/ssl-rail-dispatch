import React, { useEffect, useMemo, useState } from 'react';
import { fetchSchedule, ScheduleResponse } from '../api';

interface KanbanBoardProps {
  scenario: 'A' | 'B' | 'C';
  onScenarioChange: (scenario: 'A' | 'B' | 'C') => void;
}

const TYPE_COLOR: Record<string, string> = {
  PM: 'bg-rose-50 border-rose-300 text-rose-800',
  PC: 'bg-sky-50 border-sky-300 text-sky-800',
  C: 'bg-slate-50 border-slate-300 text-slate-700',
};

const PRIORITY_BADGE: Record<number, string> = {
  1: 'bg-rose-100 text-rose-800 border-rose-300',
  2: 'bg-amber-100 text-amber-800 border-amber-300',
  3: 'bg-slate-100 text-slate-600 border-slate-300',
};

export const KanbanBoard: React.FC<KanbanBoardProps> = ({ scenario, onScenarioChange }) => {
  const [data, setData] = useState<ScheduleResponse | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    fetchSchedule(scenario).then((res) => {
      setData(res);
      setLoading(false);
    });
  }, [scenario]);

  const columns = useMemo(() => {
    if (!data) return [];
    const activitiesByContract = new Map<string, ScheduleResponse['activities']>();
    data.activities.forEach((a) => {
      const list = activitiesByContract.get(a.contract_number) ?? [];
      list.push(a);
      activitiesByContract.set(a.contract_number, list);
    });

    return [...data.contracts]
      .sort((a, b) => a.contract_priority - b.contract_priority || a.contract_number.localeCompare(b.contract_number))
      .map((c) => ({
        contract: c,
        activities: (activitiesByContract.get(c.contract_number) ?? []).sort(
          (a, b) => a.planned_start_week - b.planned_start_week
        ),
      }));
  }, [data]);

  return (
    <div className="flex flex-col w-full gap-4 select-none">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-2 bg-white p-3.5 border border-slate-200 shadow-xs rounded">
        <div className="flex flex-col gap-0.5">
          <span className="font-mono text-[11px] font-bold uppercase tracking-wider text-slate-900">
            KANBAN BOARD
          </span>
          <span className="text-[11px] text-slate-500">
            Every activity, grouped by contract, with its scheduled duration across the {data?.horizon_weeks ?? '…'}-week horizon.
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
        <div className="flex gap-3 overflow-x-auto pb-2">
          {columns.map(({ contract, activities }) => (
            <div
              key={contract.contract_number}
              className="shrink-0 w-72 bg-white border border-slate-200 rounded-lg shadow-xs flex flex-col"
            >
              {/* Column header */}
              <div className="p-2.5 border-b border-slate-200 bg-slate-50 rounded-t-lg flex flex-col gap-1">
                <div className="flex items-center justify-between gap-2">
                  <span className="font-mono text-[11px] font-bold text-slate-900">{contract.contract_number}</span>
                  <span
                    className={`font-mono text-[9px] px-1.5 py-[1px] border rounded font-bold ${
                      PRIORITY_BADGE[contract.contract_priority] ?? PRIORITY_BADGE[3]
                    }`}
                  >
                    P{contract.contract_priority}
                  </span>
                </div>
                <span className="text-[10px] text-slate-500 truncate" title={contract.description}>
                  {contract.description}
                </span>
                <div className="flex items-center justify-between font-mono text-[9px] text-slate-500">
                  <span>{contract.nature_of_activity}</span>
                  <span>{activities.length} activities</span>
                </div>
              </div>

              {/* Cards */}
              <div className="flex flex-col gap-2 p-2 max-h-[560px] overflow-y-auto">
                {activities.map((act) => {
                  const firstWeek = act.assigned_weeks[0] ?? act.planned_start_week;
                  const lastWeek = act.assigned_weeks[act.assigned_weeks.length - 1] ?? act.planned_start_week;
                  const horizon = data.horizon_weeks || 1;
                  const leftPct = ((firstWeek - 1) / horizon) * 100;
                  const widthPct = Math.max(((lastWeek - firstWeek + 1) / horizon) * 100, 3);

                  return (
                    <div key={act.activity_id} className="p-2 bg-slate-50 border border-slate-200 rounded flex flex-col gap-1.5">
                      <div className="flex items-center justify-between gap-2">
                        <span className="font-mono text-[10px] font-bold text-slate-900">{act.activity_id}</span>
                        <span
                          className={`font-mono text-[9px] px-1.5 py-[1px] border rounded font-bold ${
                            TYPE_COLOR[act.activity_type] ?? TYPE_COLOR.C
                          }`}
                        >
                          {act.activity_type}
                        </span>
                      </div>

                      <span className="font-mono text-[9px] text-slate-500">
                        {act.start_location_id.split(':').slice(1).join(':')} → {act.end_location_id.split(':').slice(1).join(':')}
                      </span>

                      {/* Duration bar across the horizon */}
                      <div className="relative h-2.5 bg-slate-200 rounded-full overflow-hidden">
                        <div
                          className="absolute top-0 bottom-0 bg-sky-600 rounded-full"
                          style={{ left: `${leftPct}%`, width: `${widthPct}%` }}
                          title={`Week ${firstWeek} → ${lastWeek}`}
                        />
                      </div>

                      <div className="flex items-center justify-between font-mono text-[9px] text-slate-500">
                        <span>Wk {firstWeek}–{lastWeek} • {act.total_accesses} nights</span>
                        {act.eclo_weeks.length > 0 && (
                          <span className="px-1 bg-amber-100 text-amber-800 border border-amber-300 rounded font-bold">
                            {act.eclo_weeks.length} ECLO
                          </span>
                        )}
                      </div>
                    </div>
                  );
                })}
                {activities.length === 0 && (
                  <span className="text-[10px] text-slate-400 px-1 py-2">No activities scheduled.</span>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
