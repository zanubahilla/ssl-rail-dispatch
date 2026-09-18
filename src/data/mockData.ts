import { AlertItem, QueuedPossession, PathwayOption } from '../types';

export const INITIAL_ALERTS: AlertItem[] = [
  {
    id: 'alt-1',
    type: 'WRN',
    code: 'DEF-S02-S03-WB',
    message: 'S02-S03 WB Ultrasonics identified micro-fissure at KM 16.420. Night possession capacity curtailed 4 -> 1.',
    timestamp: '01:42:10 AM',
    location: 'KM 16.420 (TRK-A WB)',
  },
  {
    id: 'alt-2',
    type: 'WRN',
    code: 'REST-C042-CIRC',
    message: 'Subcontractor C042 at 82% fatigue limit (3/3 consecutive nocturnal shifts). Mandatory 15-min briefing latch required.',
    timestamp: '01:50:33 AM',
    location: 'SEC:ALP:H01_H02:EB',
  },
];

export const QUEUED_POSSESSIONS: QueuedPossession[] = [
  {
    id: 'q-1',
    code: '#8842-BET:EB',
    contractor: 'C019 • Welder Rig',
    workDesc: 'Autonomous Flash-Butt Joint Repair',
    timeWindow: '02:15 - 04:00',
    trackSector: 'Line Beta EB Interchange',
    status: 'ACTIVE',
    riskLevel: 'AMBER',
  },
  {
    id: 'q-2',
    code: '#8843-ALP:WB',
    contractor: 'C031 • Ultrasonic Rail Scan',
    workDesc: 'Secondary Verification B-Scan Calibration',
    timeWindow: '03:30 - 04:45',
    trackSector: 'Line Alpha WB S04-S05',
    status: 'QUEUED',
    riskLevel: 'LOW',
  },
  {
    id: 'q-3',
    code: '#8844-BET:WB',
    contractor: 'C007 • Catenary Isolator Test',
    workDesc: 'Routine 750V DC Tension & Airgap Audit',
    timeWindow: '04:00 - 04:30',
    trackSector: 'Line Beta WB S15-S17',
    status: 'STANDBY',
    riskLevel: 'LOW',
  },
];

export const PATHWAYS: PathwayOption[] = [
  {
    id: 'alpha',
    pill: 'LOWEST COST',
    title: 'Delay Priority-3 Contract C009 by 7 days',
    protocolSubtitle: 'Schedule Absorption Protocol',
    description: 'Pushes non-critical rail grinding to the following weekend window. Consists consolidated at S02 siding.',
    commuterImpact: '0 DELAYS',
    commuterSubtitle: '100% on-time rev',
    penaltyPoints: '+7 PTS',
    penaltySubtitle: 'Deferral fee',
    ecloUtilization: '0 ECLO USED',
    ecloSubtitle: 'Standard hours',
    efficiencyScore: '94.2%',
    efficiencySubtitle: 'Crew re-alloc',
    impactedContracts: 'C009 (Ballast Tamping)',
    platformAccess: 'S02 Rescheduled +7d',
    riskProfile: 'LOW • Minimal Friction',
    riskLevel: 'LOW',
  },
  {
    id: 'beta',
    pill: 'SPEED OPTIMIZED',
    title: 'Trigger Line Alpha 2-Week ECLO Window',
    protocolSubtitle: 'Temporal Compression Blitz',
    description: 'Compresses 6 nights of heavy maintenance into a 2-week ECLO window with triple contractor overlap.',
    commuterImpact: '-20 MIN ECLO',
    commuterSubtitle: '~4,200 pax delayed',
    penaltyPoints: '+5 PTS/NIGHT',
    penaltySubtitle: 'Variance tally',
    ecloUtilization: '1.5x YIELD',
    ecloSubtitle: '120m replacement/h',
    efficiencyScore: '1.35x INDEX',
    efficiencySubtitle: 'Elevation caution',
    impactedContracts: 'C001, C042, C019',
    platformAccess: '14 Nocturnal Slots',
    riskProfile: 'MED-HIGH • Public Notice',
    riskLevel: 'MED-HIGH',
  },
  {
    id: 'gamma',
    pill: 'BALANCED // OPTIMAL',
    title: 'Allocate +1 Excess Access-Night under Scenario C',
    protocolSubtitle: 'Dynamic Slack Corridor Re-Route',
    description: 'Redistributes slot b1 into a spare slack corridor on Line Beta while honoring safety clearances.',
    commuterImpact: '0 IMPACT',
    commuterSubtitle: 'Returned 04:30 AM',
    penaltyPoints: '+7 PTS',
    penaltySubtitle: 'Soft trade-off safe',
    ecloUtilization: '0 OVERRUN',
    ecloSubtitle: '4 teams retained',
    efficiencyScore: 'COMPLIANT',
    efficiencySubtitle: 'LTA Rule 28.4',
    impactedContracts: 'Group b1 → S03 Siding',
    platformAccess: '+15 Min Shift Offset',
    riskProfile: 'BALANCED • Optimal NOC Rec',
    riskLevel: 'BALANCED',
    recommended: true,
  },
];

export const ACCESS_CSV = `POSSESSION_ID,LINE,SECTOR,CHAINAGE_START,CHAINAGE_END,CONTRACTOR_PRIMARY,CONTRACTOR_SUB,START_TIME,END_TIME,TRACTION_750V_STATUS,INTERLOCK_KEY
8841-ALP,LINE_ALP,SEC:ALP:H01_H02:EB,KM 16.420,KM 18.150,C001,C042,01:45:00,03:45:00,ISOLATED_DEAD,TL-9021-X
8842-BET,LINE_BET,SEC:BET:H01_H02:EB,KM 17.200,KM 18.900,C019,,02:15:00,04:00:00,ENERGIZED_SPEED_RESTRICTED,TL-9022-Y
8843-ALP,LINE_ALP,SEC:ALP:S04_S05:WB,KM 15.800,KM 17.000,C031,,03:30:00,04:45:00,ENERGIZED_NORMAL,TL-9023-Z
`;

export const OCCUPANCY_CSV = `BLOCK_REF,TRACK_DESIGNATOR,TIME_BUCKET,OCCUPANT,PERMITTED_SPEED_KMH,LATERAL_BUFFER_M,REST_GUARD_CLEARANCE
SEC_EB_B2_8841,ALP_EB,01:45-02:00,C001_TAMPING,0.0,0.95,APPROVED
SEC_EB_B2_8841,ALP_EB,02:00-02:15,C001_TAMPING+C042_NDT,0.0,0.95,APPROVED_BRIEFED
SEC_EB_B2_8841,ALP_EB,02:15-03:45,C001_TAMPING+C042_NDT,0.0,0.95,APPROVED_DUAL
SEC_WB_B2_8841,ALP_WB,01:45-03:45,CLEAR_PASS_THROUGH,25.0,2.10,ADJACENT_PROTECTED
`;

export const RESULTS_CSV = `SCENARIO,HARD_CONSTRAINTS_VIOLATIONS,SOFT_PENALTY_SCORE,SOLVER_STEPS,CONVERGENCE_TIME_SEC,RECOMMENDED_PATHWAY
SCENARIO_C,0,18470.6,4096,4.2,GAMMA_DYNAMIC_SLACK
SCENARIO_A,2,24190.2,3120,5.8,ALPHA_ABSORPTION
SCENARIO_B,1,21050.4,3800,4.9,BETA_COMPRESSION
`;
