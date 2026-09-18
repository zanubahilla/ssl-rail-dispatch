export type ActiveView =
  | 'topology-command'
  | 'micro-spatial-gate'
  | '02-00-am-sandbox'
  | 'schedule-calendar'
  | 'kanban-board';

export type ScheduleScenario = 'scenario-a' | 'scenario-b' | 'scenario-c';

export type PathwayId = 'alpha' | 'beta' | 'gamma';

export interface AlertItem {
  id: string;
  type: 'CRIT' | 'WRN' | 'INFO';
  code: string;
  message: string;
  timestamp: string;
  location: string;
}

export interface QueuedPossession {
  id: string;
  code: string;
  contractor: string;
  workDesc: string;
  timeWindow: string;
  trackSector: string;
  status: 'QUEUED' | 'ACTIVE' | 'STANDBY';
  riskLevel: 'LOW' | 'AMBER' | 'HIGH';
}

export interface ActivityDependency {
  id: string;
  code: string;
  title: string;
  startWindow: string;
  endWindow: string;
  statusText: string;
  startPct: number;
  widthPct: number;
  color: string;
  bufferPct?: number;
  bufferText?: string;
}

export interface PathwayOption {
  id: PathwayId;
  pill: string;
  title: string;
  protocolSubtitle: string;
  description: string;
  commuterImpact: string;
  commuterSubtitle: string;
  penaltyPoints: string;
  penaltySubtitle: string;
  ecloUtilization: string;
  ecloSubtitle: string;
  efficiencyScore: string;
  efficiencySubtitle: string;
  impactedContracts: string;
  platformAccess: string;
  riskProfile: string;
  riskLevel: 'LOW' | 'MED-HIGH' | 'BALANCED';
  recommended?: boolean;
}
