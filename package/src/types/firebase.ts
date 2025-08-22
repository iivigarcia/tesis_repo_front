import { Timestamp, GeoPoint } from 'firebase/firestore';

// 1. Drones
export interface Drone {
  name: string;
  model: string;
  serial: string;
  status: 'idle' | 'flying' | 'charging' | 'offline';
  battery: number;
  lastLocation: GeoPoint;
  lastZoneId: string | null;
  lastHeartbeatAt: Timestamp;
  fwVersion: string;
  metrics?: Record<string, any>;
}

export interface Flight {
  startedAt: Timestamp;
  endedAt: Timestamp | null;
  zoneId: string | null;
  distanceM: number;
  coveragePct: number;
  batteryStart: number;
  batteryEnd: number | null;
  mediaCount: number;
  notes?: string;
}

export interface Log {
  type: 'flight_log' | 'image' | 'video' | 'system_log';
  sizeBytes: number;
  storagePath: string;
  createdAt: Timestamp;
  label?: string;
  checksum?: string;
  flightId?: string | null;
}

export interface Telemetry {
  ts: Timestamp;
  battery: number;
  altitudeM: number;
  speedMs: number;
  location: GeoPoint;
}

// 2. Zones
export interface Zone {
  name: string;
  status: 'patrolled' | 'pending';
  bounds: GeoPoint[] | any; // GeoJSON
  activeAlerts: number;
  lastPatrolledAt: Timestamp | null;
}

export interface Patrol {
  droneId: string;
  flightId: string | null;
  startedAt: Timestamp;
  endedAt: Timestamp;
  coveragePct: number;
  alertsDetected: number;
  notes?: string;
}

// 3. Alerts
export interface Alert {
  type: 'person' | 'animal' | 'vehicle' | 'unknown';
  critical: boolean;
  zoneId: string;
  droneId: string;
  detectedAt: Timestamp;
  frameUrl: string;
  thumbnailBase64?: string;
  location: GeoPoint;
  status: 'new' | 'ack' | 'closed';
  meta: Record<string, any>;
  ackBy?: string | null;
  ackAt?: Timestamp | null;
}

// 4. Reports
export interface Report {
  author: string;
  droneId: string | null;
  date: Timestamp;
  logSizeBytes: number;
  downloadPath: string;
  createdAt: Timestamp;
  tags: string[];
  summary: {
    alertsTotal: number;
    coveragePct: number;
    zones: Array<{ zoneId: string; coveragePct: number }>;
    flights?: string[];
  };
}

// 5. Animals Daily
export interface AnimalsDaily {
  totalAnimals: number;
  growthPct: number;
  byZone: Record<string, number>;
  updatedAt: Timestamp;
}

// 6. Dashboard Metrics
export interface DashboardMetrics {
  currentPatrol: {
    zoneId: string | null;
    droneId: string | null;
    coveragePct: number;
    updatedAt: Timestamp;
  };
  batteries: Record<string, number>;
  alertsByZone: Record<string, number>;
  zonesStatus: Record<string, 'patrolled' | 'pending'>;
  todayCounts: {
    flights: number;
    alerts: number;
    animals: number;
  };
}

// 7. Users
export interface User {
  displayName: string;
  email: string;
  role: 'admin' | 'operator' | 'viewer';
  zonesAllowed: string[];
  createdAt: Timestamp;
  lastLoginAt: Timestamp;
}

// Collection paths
export const COLLECTIONS = {
  DRONES: 'drones',
  FLIGHTS: 'flights',
  LOGS: 'logs',
  TELEMETRY: 'telemetry',
  ZONES: 'zones',
  PATROLS: 'patrols',
  ALERTS: 'alerts',
  REPORTS: 'reports',
  ANIMALS_DAILY: 'animals_daily',
  DASH_METRICS: 'dash_metrics',
  USERS: 'users',
} as const;
