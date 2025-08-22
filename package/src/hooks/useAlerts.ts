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
import { Alert, COLLECTIONS } from '@/types/firebase';

// Hook para obtener todas las alertas
export const useAlerts = (limitCount: number = 50) => {
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const alertsRef = collection(db, COLLECTIONS.ALERTS);
    const q = query(
      alertsRef,
      orderBy('detectedAt', 'desc'),
      limit(limitCount)
    );

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const alertsData: Alert[] = [];
        snapshot.forEach((doc) => {
          alertsData.push({ id: doc.id, ...doc.data() } as Alert & { id: string });
        });
        setAlerts(alertsData);
        setLoading(false);
      },
      (err) => {
        setError(err.message);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, [limitCount]);

  return { alerts, loading, error };
};

// Hook para obtener una alerta específica
export const useAlert = (alertId: string) => {
  const [alert, setAlert] = useState<Alert | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!alertId) {
      setLoading(false);
      return;
    }

    const alertRef = doc(db, COLLECTIONS.ALERTS, alertId);
    const unsubscribe = onSnapshot(
      alertRef,
      (doc) => {
        if (doc.exists()) {
          setAlert({ id: doc.id, ...doc.data() } as Alert & { id: string });
        } else {
          setAlert(null);
        }
        setLoading(false);
      },
      (err) => {
        setError(err.message);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, [alertId]);

  return { alert, loading, error };
};

// Hook para obtener alertas por zona
export const useAlertsByZone = (zoneId: string, limitCount: number = 20) => {
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!zoneId) {
      setLoading(false);
      return;
    }

    const alertsRef = collection(db, COLLECTIONS.ALERTS);
    const q = query(
      alertsRef,
      where('zoneId', '==', zoneId),
      orderBy('detectedAt', 'desc'),
      limit(limitCount)
    );

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const alertsData: Alert[] = [];
        snapshot.forEach((doc) => {
          alertsData.push({ id: doc.id, ...doc.data() } as Alert & { id: string });
        });
        setAlerts(alertsData);
        setLoading(false);
      },
      (err) => {
        setError(err.message);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, [zoneId, limitCount]);

  return { alerts, loading, error };
};

// Hook para obtener alertas por tipo
export const useAlertsByType = (type: 'person' | 'animal' | 'vehicle' | 'unknown', limitCount: number = 20) => {
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const alertsRef = collection(db, COLLECTIONS.ALERTS);
    const q = query(
      alertsRef,
      where('type', '==', type),
      orderBy('detectedAt', 'desc'),
      limit(limitCount)
    );

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const alertsData: Alert[] = [];
        snapshot.forEach((doc) => {
          alertsData.push({ id: doc.id, ...doc.data() } as Alert & { id: string });
        });
        setAlerts(alertsData);
        setLoading(false);
      },
      (err) => {
        setError(err.message);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, [type, limitCount]);

  return { alerts, loading, error };
};

// Hook para obtener alertas por estado
export const useAlertsByStatus = (status: 'new' | 'ack' | 'closed', limitCount: number = 20) => {
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const alertsRef = collection(db, COLLECTIONS.ALERTS);
    const q = query(
      alertsRef,
      where('status', '==', status),
      orderBy('detectedAt', 'desc'),
      limit(limitCount)
    );

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const alertsData: Alert[] = [];
        snapshot.forEach((doc) => {
          alertsData.push({ id: doc.id, ...doc.data() } as Alert & { id: string });
        });
        setAlerts(alertsData);
        setLoading(false);
      },
      (err) => {
        setError(err.message);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, [status, limitCount]);

  return { alerts, loading, error };
};

// Hook para obtener alertas críticas
export const useCriticalAlerts = (limitCount: number = 20) => {
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const alertsRef = collection(db, COLLECTIONS.ALERTS);
    const q = query(
      alertsRef,
      where('critical', '==', true),
      orderBy('detectedAt', 'desc'),
      limit(limitCount)
    );

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const alertsData: Alert[] = [];
        snapshot.forEach((doc) => {
          alertsData.push({ id: doc.id, ...doc.data() } as Alert & { id: string });
        });
        setAlerts(alertsData);
        setLoading(false);
      },
      (err) => {
        setError(err.message);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, [limitCount]);

  return { alerts, loading, error };
};

// Hook para obtener alertas recientes (últimas 24 horas)
export const useRecentAlerts = (hours: number = 24, limitCount: number = 20) => {
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const alertsRef = collection(db, COLLECTIONS.ALERTS);
    const cutoffTime = new Date();
    cutoffTime.setHours(cutoffTime.getHours() - hours);
    
    const q = query(
      alertsRef,
      where('detectedAt', '>=', Timestamp.fromDate(cutoffTime)),
      orderBy('detectedAt', 'desc'),
      limit(limitCount)
    );

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const alertsData: Alert[] = [];
        snapshot.forEach((doc) => {
          alertsData.push({ id: doc.id, ...doc.data() } as Alert & { id: string });
        });
        setAlerts(alertsData);
        setLoading(false);
      },
      (err) => {
        setError(err.message);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, [hours, limitCount]);

  return { alerts, loading, error };
};

// Funciones para operaciones CRUD
export const useAlertOperations = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const createAlert = async (alertData: Omit<Alert, 'detectedAt' | 'status' | 'ackBy' | 'ackAt'>) => {
    setLoading(true);
    setError(null);
    try {
      const alertWithDefaults = {
        ...alertData,
        detectedAt: Timestamp.now(),
        status: 'new' as const,
        ackBy: null,
        ackAt: null
      };
      const docRef = await addDoc(collection(db, COLLECTIONS.ALERTS), alertWithDefaults);
      return docRef.id;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error creating alert');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const updateAlert = async (alertId: string, updates: Partial<Alert>) => {
    setLoading(true);
    setError(null);
    try {
      const alertRef = doc(db, COLLECTIONS.ALERTS, alertId);
      await updateDoc(alertRef, updates);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error updating alert');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const deleteAlert = async (alertId: string) => {
    setLoading(true);
    setError(null);
    try {
      const alertRef = doc(db, COLLECTIONS.ALERTS, alertId);
      await deleteDoc(alertRef);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error deleting alert');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const acknowledgeAlert = async (alertId: string, userId: string) => {
    setLoading(true);
    setError(null);
    try {
      const alertRef = doc(db, COLLECTIONS.ALERTS, alertId);
      await updateDoc(alertRef, {
        status: 'ack',
        ackBy: userId,
        ackAt: Timestamp.now()
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error acknowledging alert');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const closeAlert = async (alertId: string) => {
    setLoading(true);
    setError(null);
    try {
      const alertRef = doc(db, COLLECTIONS.ALERTS, alertId);
      await updateDoc(alertRef, {
        status: 'closed'
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error closing alert');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return {
    createAlert,
    updateAlert,
    deleteAlert,
    acknowledgeAlert,
    closeAlert,
    loading,
    error
  };
};
