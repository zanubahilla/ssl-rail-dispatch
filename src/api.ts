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
