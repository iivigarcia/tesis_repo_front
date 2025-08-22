import { useState, useEffect } from 'react';
import { 
  doc, 
  onSnapshot, 
  updateDoc,
  getDoc,
  Timestamp 
} from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { DashboardMetrics, AnimalsDaily, COLLECTIONS } from '@/types/firebase';

// Hook para obtener métricas actuales del dashboard
export const useDashboardMetrics = () => {
  const [metrics, setMetrics] = useState<DashboardMetrics | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const metricsRef = doc(db, COLLECTIONS.DASH_METRICS, 'current');
    const unsubscribe = onSnapshot(
      metricsRef,
      (doc) => {
        if (doc.exists()) {
          setMetrics(doc.data() as DashboardMetrics);
        } else {
          setMetrics(null);
        }
        setLoading(false);
      },
      (err) => {
        setError(err.message);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, []);

  return { metrics, loading, error };
};

// Hook para obtener métricas de animales diarias
export const useAnimalsDaily = (date: string) => {
  const [animalsData, setAnimalsData] = useState<AnimalsDaily | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!date) {
      setLoading(false);
      return;
    }

    const animalsRef = doc(db, COLLECTIONS.ANIMALS_DAILY, date);
    const unsubscribe = onSnapshot(
      animalsRef,
      (doc) => {
        if (doc.exists()) {
          setAnimalsData(doc.data() as AnimalsDaily);
        } else {
          setAnimalsData(null);
        }
        setLoading(false);
      },
      (err) => {
        setError(err.message);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, [date]);

  return { animalsData, loading, error };
};

// Hook para obtener métricas de animales de hoy
export const useTodayAnimals = () => {
  const today = new Date().toISOString().slice(0, 10).replace(/-/g, '');
  return useAnimalsDaily(today);
};

// Funciones para actualizar métricas del dashboard
export const useDashboardOperations = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const updateCurrentPatrol = async (patrolData: DashboardMetrics['currentPatrol']) => {
    setLoading(true);
    setError(null);
    try {
      const metricsRef = doc(db, COLLECTIONS.DASH_METRICS, 'current');
      await updateDoc(metricsRef, {
        currentPatrol: {
          ...patrolData,
          updatedAt: Timestamp.now()
        }
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error updating current patrol');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const updateBatteryLevel = async (droneId: string, batteryLevel: number) => {
    setLoading(true);
    setError(null);
    try {
      const metricsRef = doc(db, COLLECTIONS.DASH_METRICS, 'current');
      await updateDoc(metricsRef, {
        [`batteries.${droneId}`]: batteryLevel
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error updating battery level');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const updateAlertsByZone = async (zoneId: string, alertCount: number) => {
    setLoading(true);
    setError(null);
    try {
      const metricsRef = doc(db, COLLECTIONS.DASH_METRICS, 'current');
      await updateDoc(metricsRef, {
        [`alertsByZone.${zoneId}`]: alertCount
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error updating alerts by zone');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const updateZoneStatus = async (zoneId: string, status: 'patrolled' | 'pending') => {
    setLoading(true);
    setError(null);
    try {
      const metricsRef = doc(db, COLLECTIONS.DASH_METRICS, 'current');
      await updateDoc(metricsRef, {
        [`zonesStatus.${zoneId}`]: status
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error updating zone status');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const updateTodayCounts = async (counts: Partial<DashboardMetrics['todayCounts']>) => {
    setLoading(true);
    setError(null);
    try {
      const metricsRef = doc(db, COLLECTIONS.DASH_METRICS, 'current');
      const updates: any = {};
      Object.entries(counts).forEach(([key, value]) => {
        updates[`todayCounts.${key}`] = value;
      });
      await updateDoc(metricsRef, updates);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error updating today counts');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const incrementTodayCount = async (countType: keyof DashboardMetrics['todayCounts'], increment: number = 1) => {
    setLoading(true);
    setError(null);
    try {
      const metricsRef = doc(db, COLLECTIONS.DASH_METRICS, 'current');
      // Primero obtenemos el valor actual
      const currentDoc = await getDoc(metricsRef);
      if (currentDoc.exists()) {
        const currentData = currentDoc.data() as DashboardMetrics;
        const currentValue = currentData.todayCounts?.[countType] || 0;
        const newValue = currentValue + increment;
        
        await updateDoc(metricsRef, {
          [`todayCounts.${countType}`]: newValue
        });
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error incrementing today count');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return {
    updateCurrentPatrol,
    updateBatteryLevel,
    updateAlertsByZone,
    updateZoneStatus,
    updateTodayCounts,
    incrementTodayCount,
    loading,
    error
  };
};

// Hook para obtener estadísticas resumidas
export const useDashboardStats = () => {
  const { metrics, loading: metricsLoading, error: metricsError } = useDashboardMetrics();
  const { animalsData, loading: animalsLoading, error: animalsError } = useTodayAnimals();

  const loading = metricsLoading || animalsLoading;
  const error = metricsError || animalsError;

  const stats = {
    totalAnimals: animalsData?.totalAnimals || 0,
    animalsGrowth: animalsData?.growthPct || 0,
    currentPatrol: metrics?.currentPatrol || null,
    batteries: metrics?.batteries || {},
    alertsByZone: metrics?.alertsByZone || {},
    zonesStatus: metrics?.zonesStatus || {},
    todayCounts: metrics?.todayCounts || {
      flights: 0,
      alerts: 0,
      animals: 0
    }
  };

  return { stats, loading, error };
};
