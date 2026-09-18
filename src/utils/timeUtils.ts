import { useState, useEffect } from 'react';

export interface TimeState {
  now: Date;
  hh: string;
  mm: string;
  ss: string;
  amPm: string;
  is24Hour: boolean;
  setIs24Hour: (val: boolean) => void;
  dateFormatted: string;
  isoString: string;
  timeZoneName: string;
}

export function formatTimeComponents(date: Date, is24Hour: boolean = false) {
  let hours = date.getHours();
  const minutes = date.getMinutes();
  const seconds = date.getSeconds();

  let amPm = '';
  if (!is24Hour) {
    amPm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12;
    if (hours === 0) hours = 12;
  }

  const hh = String(hours).padStart(2, '0');
  const mm = String(minutes).padStart(2, '0');
  const ss = String(seconds).padStart(2, '0');

  return { hh, mm, ss, amPm };
}

export function getSystemTimeZone(): string {
  try {
    const tz = Intl.DateTimeFormat().resolvedOptions().timeZone;
    // Shorten or return nice string
    const offsetMinutes = new Date().getTimezoneOffset();
    const offsetHours = Math.abs(Math.floor(offsetMinutes / 60));
    const offsetSign = offsetMinutes <= 0 ? '+' : '-';
    const offsetString = `UTC${offsetSign}${offsetHours}`;
    
    // Try to get short name like PDT, SGT, EST, etc.
    const formatter = new Intl.DateTimeFormat('en-US', { timeZoneName: 'short' });
    const parts = formatter.formatToParts(new Date());
    const tzPart = parts.find((p) => p.type === 'timeZoneName');
    return tzPart?.value || offsetString || tz;
  } catch {
    return 'UTC';
  }
}

export function formatRelativeTimeString(minutesAgo: number, is24Hour: boolean = false): string {
  const d = new Date(Date.now() - minutesAgo * 60 * 1000);
  const { hh, mm, ss, amPm } = formatTimeComponents(d, is24Hour);
  return `${hh}:${mm}:${ss}${amPm ? ' ' + amPm : ''}`;
}

export function useRealTime(initial24Hour = false) {
  const [now, setNow] = useState<Date>(() => new Date());
  const [is24Hour, setIs24Hour] = useState<boolean>(initial24Hour);

  useEffect(() => {
    // Sync immediately and on every second boundary
    const update = () => setNow(new Date());
    update();
    const interval = setInterval(update, 1000);
    return () => clearInterval(interval);
  }, []);

  const { hh, mm, ss, amPm } = formatTimeComponents(now, is24Hour);

  const dateFormatted = now.toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });

  const timeZoneName = getSystemTimeZone();

  return {
    now,
    hh,
    mm,
    ss,
    amPm,
    is24Hour,
    setIs24Hour,
    dateFormatted,
    isoString: now.toISOString(),
    timeZoneName,
  };
}

/**
 * Calculates a 3-hour operational timeline window dynamically around the current time.
 * e.g., starts ~30 minutes before now, rounded to 15-min boundary, and generates 12 15-min slices.
 */
export function getOperationalTimeline(now: Date) {
  // Round now down to nearest 15 mins
  const currentMinutes = now.getHours() * 60 + now.getMinutes();
  const roundedMins = Math.floor(currentMinutes / 15) * 15;
  // Start 30 minutes before current rounded slot
  const startMins = Math.max(0, roundedMins - 30);
  
  // 12 slices of 15 minutes each = 180 minutes (3 hours)
  const slices: string[] = [];
  for (let i = 0; i <= 12; i++) {
    const m = (startMins + i * 15) % (24 * 60);
    const h = Math.floor(m / 60);
    const min = m % 60;
    slices.push(`${String(h).padStart(2, '0')}:${String(min).padStart(2, '0')}`);
  }

  // Calculate cursor position in this 180 minute window
  const totalWindowSeconds = 180 * 60;
  const startTimestampMs = new Date(now).setHours(Math.floor(startMins / 60), startMins % 60, 0, 0);
  const elapsedSeconds = (now.getTime() - startTimestampMs) / 1000;
  let cursorPct = (elapsedSeconds / totalWindowSeconds) * 100;
  cursorPct = Math.max(2, Math.min(98, cursorPct)); // keep visible inside frame

  return {
    startMins,
    slices,
    cursorPct,
  };
}
