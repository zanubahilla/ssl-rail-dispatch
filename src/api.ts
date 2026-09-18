// Thin client for the ps1_solver FastAPI backend (see /api/dashboard).
// Falls back to null on any failure so the UI can keep using mock data.

const API_BASE = (import.meta as any).env?.VITE_API_BASE || 'http://localhost:8000';

export interface ScenarioScore {
  score: number;
  overrun_days_total: number;
  contracts_overrunning: number;
  eclo_nights_total: number;
  nights_scheduled: number;
}

export interface DashboardPossession {
  id: string;
  code: string;
  contractor: string;
  workDesc: string;
  timeWindow: string;
  trackSector: string;
  status: 'QUEUED' | 'ACTIVE' | 'STANDBY';
  riskLevel: 'LOW' | 'AMBER' | 'HIGH';
}

export interface DashboardResponse {
  scenarios: Record<'A' | 'B' | 'C', ScenarioScore>;
  possessions: DashboardPossession[];
}

export async function fetchDashboard(): Promise<DashboardResponse | null> {
  try {
    const res = await fetch(`${API_BASE}/api/dashboard`);
    if (!res.ok) return null;
    return (await res.json()) as DashboardResponse;
  } catch {
    return null;
  }
}

export interface ScheduleActivity {
  activity_id: string;
  contract_number: string;
  activity_type: string;
  activity_priority: number;
  start_location_id: string;
  end_location_id: string;
  total_accesses: number;
  planned_start_week: number;
  assigned_weeks: number[];
  eclo_weeks: number[];
}

export interface ScheduleContract {
  contract_number: string;
  description: string;
  nature_of_activity: string;
  contract_priority: number;
  planned_completion_date: string;
}

export interface ScheduleLocation {
  location_id: string;
  location_kind: string;
  line_code: string;
  bound: string;
  supply_capacity: number;
}

export interface OccupancyEntry {
  activity_id: string;
  co_share_group: string;
}

export interface ScheduleResponse {
  scenario: 'A' | 'B' | 'C';
  horizon_weeks: number;
  activities: ScheduleActivity[];
  contracts: ScheduleContract[];
  locations: ScheduleLocation[];
  occupancy: Record<string, Record<string, OccupancyEntry[]>>;
}

export async function fetchSchedule(scenario: 'A' | 'B' | 'C'): Promise<ScheduleResponse | null> {
  try {
    const res = await fetch(`${API_BASE}/api/schedule?scenario=${scenario}`);
    if (!res.ok) return null;
    return (await res.json()) as ScheduleResponse;
  } catch {
    return null;
  }
}

// Calls the real solver (POST /solve) and returns the zip of
// SCHEDULE_ACCESS.csv / SCHEDULE_OCCUPANCY.csv / RESULTS.csv it produces —
// the actual submission-format output, not a mock.
export async function exportScheduleZip(scenario: 'A' | 'B' | 'C'): Promise<Blob | null> {
  try {
    const form = new FormData();
    form.append('scenario', scenario);
    form.append('use_default', 'true');
    const res = await fetch(`${API_BASE}/solve`, { method: 'POST', body: form });
    if (!res.ok) return null;
    return await res.blob();
  } catch {
    return null;
  }
}
