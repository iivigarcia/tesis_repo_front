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
import { Zone, Patrol, COLLECTIONS } from '@/types/firebase';

// Hook para obtener todas las zonas
export const useZones = () => {
  const [zones, setZones] = useState<Zone[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const zonesRef = collection(db, COLLECTIONS.ZONES);
    const unsubscribe = onSnapshot(
      zonesRef,
      (snapshot) => {
        const zonesData: Zone[] = [];
        snapshot.forEach((doc) => {
          zonesData.push({ id: doc.id, ...doc.data() } as Zone & { id: string });
        });
        setZones(zonesData);
        setLoading(false);
      },
      (err) => {
        setError(err.message);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, []);

  return { zones, loading, error };
};

// Hook para obtener una zona específica
export const useZone = (zoneId: string) => {
  const [zone, setZone] = useState<Zone | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!zoneId) {
      setLoading(false);
      return;
    }

    const zoneRef = doc(db, COLLECTIONS.ZONES, zoneId);
    const unsubscribe = onSnapshot(
      zoneRef,
      (doc) => {
        if (doc.exists()) {
          setZone({ id: doc.id, ...doc.data() } as Zone & { id: string });
        } else {
          setZone(null);
        }
        setLoading(false);
      },
      (err) => {
        setError(err.message);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, [zoneId]);

  return { zone, loading, error };
};

// Hook para obtener patrullas de una zona
export const useZonePatrols = (zoneId: string, limitCount: number = 10) => {
  const [patrols, setPatrols] = useState<Patrol[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!zoneId) {
      setLoading(false);
      return;
    }

    const patrolsRef = collection(db, COLLECTIONS.ZONES, zoneId, COLLECTIONS.PATROLS);
    const q = query(
      patrolsRef,
      orderBy('startedAt', 'desc'),
      limit(limitCount)
    );

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const patrolsData: Patrol[] = [];
        snapshot.forEach((doc) => {
          patrolsData.push({ id: doc.id, ...doc.data() } as Patrol & { id: string });
        });
        setPatrols(patrolsData);
        setLoading(false);
      },
      (err) => {
        setError(err.message);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, [zoneId, limitCount]);

  return { patrols, loading, error };
};

// Hook para obtener zonas por estado
export const useZonesByStatus = (status: 'patrolled' | 'pending') => {
  const [zones, setZones] = useState<Zone[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const zonesRef = collection(db, COLLECTIONS.ZONES);
    const q = query(zonesRef, where('status', '==', status));

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const zonesData: Zone[] = [];
        snapshot.forEach((doc) => {
          zonesData.push({ id: doc.id, ...doc.data() } as Zone & { id: string });
        });
        setZones(zonesData);
        setLoading(false);
      },
      (err) => {
        setError(err.message);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, [status]);

  return { zones, loading, error };
};

// Hook para obtener zonas con alertas activas
export const useZonesWithAlerts = () => {
  const [zones, setZones] = useState<Zone[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const zonesRef = collection(db, COLLECTIONS.ZONES);
    const q = query(zonesRef, where('activeAlerts', '>', 0));

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const zonesData: Zone[] = [];
        snapshot.forEach((doc) => {
          zonesData.push({ id: doc.id, ...doc.data() } as Zone & { id: string });
        });
        setZones(zonesData);
        setLoading(false);
      },
      (err) => {
        setError(err.message);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, []);

  return { zones, loading, error };
};

// Funciones para operaciones CRUD
export const useZoneOperations = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const createZone = async (zoneData: Omit<Zone, 'activeAlerts' | 'lastPatrolledAt'>) => {
    setLoading(true);
    setError(null);
    try {
      const zoneWithDefaults = {
        ...zoneData,
        activeAlerts: 0,
        lastPatrolledAt: null
      };
      const docRef = await addDoc(collection(db, COLLECTIONS.ZONES), zoneWithDefaults);
      return docRef.id;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error creating zone');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const updateZone = async (zoneId: string, updates: Partial<Zone>) => {
    setLoading(true);
    setError(null);
    try {
      const zoneRef = doc(db, COLLECTIONS.ZONES, zoneId);
      await updateDoc(zoneRef, updates);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error updating zone');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const deleteZone = async (zoneId: string) => {
    setLoading(true);
    setError(null);
    try {
      const zoneRef = doc(db, COLLECTIONS.ZONES, zoneId);
      await deleteDoc(zoneRef);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error deleting zone');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const updateZoneStatus = async (zoneId: string, status: 'patrolled' | 'pending') => {
    setLoading(true);
    setError(null);
    try {
      const zoneRef = doc(db, COLLECTIONS.ZONES, zoneId);
      const updates: Partial<Zone> = { 
        status,
        lastPatrolledAt: status === 'patrolled' ? Timestamp.now() : null
      };
      await updateDoc(zoneRef, updates);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error updating zone status');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const incrementActiveAlerts = async (zoneId: string, increment: number = 1) => {
    setLoading(true);
    setError(null);
    try {
      const zoneRef = doc(db, COLLECTIONS.ZONES, zoneId);
      const zoneDoc = await getDoc(zoneRef);
      if (zoneDoc.exists()) {
        const currentAlerts = zoneDoc.data().activeAlerts || 0;
        const newAlerts = Math.max(0, currentAlerts + increment);
        await updateDoc(zoneRef, { activeAlerts: newAlerts });
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error updating active alerts');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return {
    createZone,
    updateZone,
    deleteZone,
    updateZoneStatus,
    incrementActiveAlerts,
    loading,
    error
  };
};
