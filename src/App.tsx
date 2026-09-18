import { useState, useEffect } from 'react';
import { ActiveView, ScheduleScenario, PathwayId, QueuedPossession, PathwayOption } from './types';
import { INITIAL_ALERTS, QUEUED_POSSESSIONS, PATHWAYS } from './data/mockData';
import { fetchDashboard, ScenarioScore } from './api';
import { Header } from './components/Header';
import { Sidebar } from './components/Sidebar';
import { TopologyCommand } from './components/TopologyCommand';
import { MicroSpatialGate } from './components/MicroSpatialGate';
import { SandboxReplanner } from './components/SandboxReplanner';
import { ScheduleCalendar } from './components/ScheduleCalendar';
import { KanbanBoard } from './components/KanbanBoard';
import { AlertsModal } from './components/AlertsModal';
import { useRealTime, formatRelativeTimeString } from './utils/timeUtils';

const SCENARIO_TO_LETTER: Record<ScheduleScenario, 'A' | 'B' | 'C'> = {
  'scenario-a': 'A',
  'scenario-b': 'B',
  'scenario-c': 'C',
};
const LETTER_TO_SCENARIO: Record<'A' | 'B' | 'C', ScheduleScenario> = {
  A: 'scenario-a',
  B: 'scenario-b',
  C: 'scenario-c',
};
const PATHWAY_TO_LETTER: Record<PathwayId, 'A' | 'B' | 'C'> = { alpha: 'A', beta: 'B', gamma: 'C' };
const LETTER_TO_PATHWAY: Record<'A' | 'B' | 'C', PathwayId> = { A: 'alpha', B: 'beta', C: 'gamma' };

export default function App() {
  const [activeView, setActiveView] = useState<ActiveView>('topology-command');
  const [scenario, setScenario] = useState<ScheduleScenario>('scenario-c');
  const [selectedPathway, setSelectedPathway] = useState<PathwayId>('gamma');
  const [timelineMode, setTimelineMode] = useState<'realtime' | 'nocturnal'>('realtime');

  // Actual Real-Time state
  const timeState = useRealTime(false);

  // Initialize alerts with timestamps relative to actual current time
  const [alerts, setAlerts] = useState(() =>
    INITIAL_ALERTS.map((alert, idx) => ({
      ...alert,
      timestamp: formatRelativeTimeString(idx === 0 ? 12 : 5, false),
    }))
  );

  const [possessions, setPossessions] = useState<QueuedPossession[]>(QUEUED_POSSESSIONS);
  const [pathways, setPathways] = useState<PathwayOption[]>(PATHWAYS);
  const [scenarioScores, setScenarioScores] = useState<Record<'A' | 'B' | 'C', ScenarioScore> | null>(null);
  const [interlockSecured, setInterlockSecured] = useState(true);
  const [isAlertsModalOpen, setIsAlertsModalOpen] = useState(false);

  // Pull real scheduler output from ps1_solver's FastAPI backend when it's reachable.
  // Falls back to the static mock data (set above) if the backend isn't running.
  useEffect(() => {
    fetchDashboard().then((dash) => {
      if (!dash) return;

      setScenarioScores(dash.scenarios);

      if (dash.possessions.length > 0) {
        setPossessions(
          dash.possessions.map((p) => ({
            id: p.id,
            code: p.code,
            contractor: p.contractor,
            workDesc: p.workDesc,
            timeWindow: p.timeWindow,
            trackSector: p.trackSector,
            status: p.status,
            riskLevel: p.riskLevel,
          }))
        );
      }

      const scenarioByPathway: Record<PathwayId, 'A' | 'B' | 'C'> = {
        alpha: 'A',
        beta: 'B',
        gamma: 'C',
      };
      setPathways((prev) =>
        prev.map((pathway) => {
          const sc = dash.scenarios[scenarioByPathway[pathway.id]];
          if (!sc) return pathway;
          return {
            ...pathway,
            penaltyPoints: `${sc.score} PTS`,
            penaltySubtitle: `Scenario score (live)`,
            efficiencyScore: `${sc.overrun_days_total}d`,
            efficiencySubtitle: `Overrun across ${sc.contracts_overrunning} contracts`,
            ecloUtilization: `${sc.eclo_nights_total} ECLO`,
            ecloSubtitle: `${sc.nights_scheduled} nights scheduled`,
          };
        })
      );
    });
  }, []);

  // Single source of truth for "which scenario is active" — keeps the Header
  // selector, Sandbox pathway cards, and Schedule Calendar / Kanban Board in sync.
  const handleSelectScenario = (sc: ScheduleScenario) => {
    setScenario(sc);
    setSelectedPathway(LETTER_TO_PATHWAY[SCENARIO_TO_LETTER[sc]]);
  };

  const handleSelectPathway = (id: PathwayId) => {
    setSelectedPathway(id);
    setScenario(LETTER_TO_SCENARIO[PATHWAY_TO_LETTER[id]]);
  };

  const handleVetoTriggered = () => {
    // When spatial veto is triggered in Micro-Spatial Gate, ensure Scenario C is active
    // and note down the mitigation in 02:00 AM Sandbox
    handleSelectScenario('scenario-c');
    setInterlockSecured(true);
  };

  const handleApplyReplanConfirmed = () => {
    // Confirming re-plan re-routes possessions
    handleSelectScenario('scenario-c');
    // Can auto update alerts or acknowledge
    setAlerts((prev) =>
      prev.map((a) =>
        a.id === 'alt-1'
          ? {
              ...a,
              message:
                'S02-S03 WB Defect Mitigation Applied via Scenario C (+1 Excess Night). Relief corridor active.',
            }
          : a
      )
    );
  };

  return (
    <div className="bg-slate-50 font-sans text-slate-900 select-none antialiased min-h-screen">
      {/* Top Header */}
      <Header
        scenario={scenario}
        onSelectScenario={handleSelectScenario}
        alerts={alerts}
        onOpenAlertsModal={() => setIsAlertsModalOpen(true)}
        hh={timeState.hh}
        mm={timeState.mm}
        ss={timeState.ss}
        amPm={timeState.amPm}
        is24Hour={timeState.is24Hour}
        onToggle24Hour={() => timeState.setIs24Hour(!timeState.is24Hour)}
        dateFormatted={timeState.dateFormatted}
        timeZoneName={timeState.timeZoneName}
        timelineMode={timelineMode}
        onToggleTimelineMode={() =>
          setTimelineMode((prev) => (prev === 'realtime' ? 'nocturnal' : 'realtime'))
        }
      />

      {/* Fixed Left Navigation Sidebar */}
      <Sidebar
        activeView={activeView}
        onSelectView={setActiveView}
        interlockSecured={interlockSecured}
      />

      {/* Main Content Area (offset left by 64 = 16rem for sidebar) */}
      <div className="pl-64">
        <main className="relative pt-14 w-full min-h-screen bg-slate-50 px-3.5 py-3.5">
          {activeView === 'topology-command' && (
            <TopologyCommand
              onNavigateToView={setActiveView}
              scenario={SCENARIO_TO_LETTER[scenario]}
              scenarioScore={scenarioScores?.[SCENARIO_TO_LETTER[scenario]] ?? null}
              possessions={possessions}
              now={timeState.now}
              hh={timeState.hh}
              mm={timeState.mm}
              ss={timeState.ss}
              amPm={timeState.amPm}
              is24Hour={timeState.is24Hour}
              timeZoneName={timeState.timeZoneName}
              timelineMode={timelineMode}
              onToggleTimelineMode={() =>
                setTimelineMode((prev) => (prev === 'realtime' ? 'nocturnal' : 'realtime'))
              }
            />
          )}

          {activeView === 'micro-spatial-gate' && (
            <MicroSpatialGate
              onNavigateToView={setActiveView}
              onVetoTriggered={handleVetoTriggered}
              now={timeState.now}
              hh={timeState.hh}
              mm={timeState.mm}
              ss={timeState.ss}
              amPm={timeState.amPm}
              is24Hour={timeState.is24Hour}
            />
          )}

          {activeView === '02-00-am-sandbox' && (
            <SandboxReplanner
              pathways={pathways}
              selectedPathway={selectedPathway}
              onSelectPathway={handleSelectPathway}
              onApplyReplanConfirmed={handleApplyReplanConfirmed}
            />
          )}

          {activeView === 'schedule-calendar' && (
            <ScheduleCalendar
              scenario={SCENARIO_TO_LETTER[scenario]}
              onScenarioChange={(sc) => handleSelectScenario(LETTER_TO_SCENARIO[sc])}
            />
          )}

          {activeView === 'kanban-board' && (
            <KanbanBoard
              scenario={SCENARIO_TO_LETTER[scenario]}
              onScenarioChange={(sc) => handleSelectScenario(LETTER_TO_SCENARIO[sc])}
            />
          )}
        </main>
      </div>

      {/* Alerts Investigation Modal */}
      <AlertsModal
        isOpen={isAlertsModalOpen}
        onClose={() => setIsAlertsModalOpen(false)}
        alerts={alerts}
        onNavigateToView={setActiveView}
      />
    </div>
  );
}
