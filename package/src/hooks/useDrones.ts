import { useState, useEffect } from 'react';
import { 
  collection, 
  doc, 
  getDocs, 
  getDoc, 
  onSnapshot, 
  query, 
  where, 
  orderBy,
  limit,
  addDoc,
  updateDoc,
  deleteDoc,
  Timestamp 
} from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Drone, Flight, Log, Telemetry, COLLECTIONS } from '@/types/firebase';

// Hook para obtener todos los drones
export const useDrones = () => {
  const [drones, setDrones] = useState<Drone[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const dronesRef = collection(db, COLLECTIONS.DRONES);
    const unsubscribe = onSnapshot(
      dronesRef,
      (snapshot) => {
        const dronesData: Drone[] = [];
        snapshot.forEach((doc) => {
          dronesData.push({ id: doc.id, ...doc.data() } as Drone & { id: string });
        });
        setDrones(dronesData);
        setLoading(false);
      },
      (err) => {
        setError(err.message);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, []);

  return { drones, loading, error };
};

// Hook para obtener un dron específico
export const useDrone = (droneId: string) => {
  const [drone, setDrone] = useState<Drone | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!droneId) {
      setLoading(false);
      return;
    }

    const droneRef = doc(db, COLLECTIONS.DRONES, droneId);
    const unsubscribe = onSnapshot(
      droneRef,
      (doc) => {
        if (doc.exists()) {
          setDrone({ id: doc.id, ...doc.data() } as Drone & { id: string });
        } else {
          setDrone(null);
        }
        setLoading(false);
      },
      (err) => {
        setError(err.message);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, [droneId]);

  return { drone, loading, error };
};

// Hook para obtener vuelos de un dron
export const useDroneFlights = (droneId: string, limitCount: number = 10) => {
  const [flights, setFlights] = useState<Flight[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!droneId) {
      setLoading(false);
      return;
    }

    const flightsRef = collection(db, COLLECTIONS.DRONES, droneId, COLLECTIONS.FLIGHTS);
    const q = query(
      flightsRef,
      orderBy('startedAt', 'desc'),
      limit(limitCount)
    );

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const flightsData: Flight[] = [];
        snapshot.forEach((doc) => {
          flightsData.push({ id: doc.id, ...doc.data() } as Flight & { id: string });
        });
        setFlights(flightsData);
        setLoading(false);
      },
      (err) => {
        setError(err.message);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, [droneId, limitCount]);

  return { flights, loading, error };
};

// Hook para obtener logs de un dron
export const useDroneLogs = (droneId: string, limitCount: number = 20) => {
  const [logs, setLogs] = useState<Log[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!droneId) {
      setLoading(false);
      return;
    }

    const logsRef = collection(db, COLLECTIONS.DRONES, droneId, COLLECTIONS.LOGS);
    const q = query(
      logsRef,
      orderBy('createdAt', 'desc'),
      limit(limitCount)
    );

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const logsData: Log[] = [];
        snapshot.forEach((doc) => {
          logsData.push({ id: doc.id, ...doc.data() } as Log & { id: string });
        });
        setLogs(logsData);
        setLoading(false);
      },
      (err) => {
        setError(err.message);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, [droneId, limitCount]);

  return { logs, loading, error };
};

// Hook para obtener telemetría de un dron
export const useDroneTelemetry = (droneId: string, limitCount: number = 100) => {
  const [telemetry, setTelemetry] = useState<Telemetry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!droneId) {
      setLoading(false);
      return;
    }

    const telemetryRef = collection(db, COLLECTIONS.DRONES, droneId, COLLECTIONS.TELEMETRY);
    const q = query(
      telemetryRef,
      orderBy('ts', 'desc'),
      limit(limitCount)
    );

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const telemetryData: Telemetry[] = [];
        snapshot.forEach((doc) => {
          telemetryData.push({ id: doc.id, ...doc.data() } as Telemetry & { id: string });
        });
        setTelemetry(telemetryData);
        setLoading(false);
      },
      (err) => {
        setError(err.message);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, [droneId, limitCount]);

  return { telemetry, loading, error };
};

// Funciones para operaciones CRUD
export const useDroneOperations = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const createDrone = async (droneData: Omit<Drone, 'lastHeartbeatAt'>) => {
    setLoading(true);
    setError(null);
    try {
      const droneWithTimestamp = {
        ...droneData,
        lastHeartbeatAt: Timestamp.now()
      };
      const docRef = await addDoc(collection(db, COLLECTIONS.DRONES), droneWithTimestamp);
      return docRef.id;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error creating drone');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const updateDrone = async (droneId: string, updates: Partial<Drone>) => {
    setLoading(true);
    setError(null);
    try {
      const droneRef = doc(db, COLLECTIONS.DRONES, droneId);
      await updateDoc(droneRef, updates);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error updating drone');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const deleteDrone = async (droneId: string) => {
    setLoading(true);
    setError(null);
    try {
      const droneRef = doc(db, COLLECTIONS.DRONES, droneId);
      await deleteDoc(droneRef);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error deleting drone');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return {
    createDrone,
    updateDrone,
    deleteDrone,
    loading,
    error
  };
};

// Hook para operaciones de drones (plural - alias para consistencia)
export const useDronesOperations = useDroneOperations;
