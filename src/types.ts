export type ActiveView = 'topology-command' | 'micro-spatial-gate' | '02-00-am-sandbox';

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

export interface SubstationFeeder {
  id: string;
  name: string;
  cbCode: string;
  lineDesc?: string;
  status: 'TRIPPED' | 'ENERGIZED';
  leakageOrLoad: string;
  voltage: string;
}

export interface ActiveConsist {
  id: string;
  code: string;
  name: string;
  type: 'MAINTENANCE_TAMPING' | 'ULTRASONIC_NDT' | 'FLASH_BUTT_WELDER' | 'TEST_PATROL' | 'REVENUE_SWEEP';
  crewLead: string;
  crewCount: number;
  speedKmh: number;
  speedLimitKmh: number;
  chainageKm: string;
  adjacentStation: string;
  routeId: 'ALP-EB' | 'ALP-WB' | 'BET-EB' | 'BET-WB';
  tractionVoltage: string;
  tractionStatus: 'ISOLATED' | 'ENERGIZED';
  signalAspect: 'RED_STOP' | 'YELLOW_CAUTION' | 'GREEN_PROCEED' | 'AMBER_PULSE';
  headwayBufferMeters: number;
  currentTask: string;
  status: 'STATIONARY_WORK' | 'IN_TRANSIT' | 'CAUTION_CRAWL';
  coordinates: { x: number; y: number };
  heading: 'EB' | 'WB';
}

export interface RailwayRoute {
  id: 'ALP-EB' | 'ALP-WB' | 'BET-EB' | 'BET-WB';
  lineId: 'ALP' | 'BET';
  lineName: string;
  trackCode: string;
  direction: 'EASTBOUND' | 'WESTBOUND';
  color: string;
  status: 'MAINTENANCE_POSSESSION' | 'SPEED_RESTRICTED' | 'HOT_WORK_WELDING' | 'REVENUE_CLEARANCE';
  speedLimitKmh: number;
  nominalSpeedKmh: number;
  catenaryStatus: string;
  trackCircuitStatus: 'POSSESSION_LOCKED' | 'CAUTION_SHUNTED' | 'NORMAL_SHUNT' | 'CLEAR_RESERVED';
  activeConsists: ActiveConsist[];
  totalDistanceKm: number;
  activeSector: string;
  notes: string;
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
