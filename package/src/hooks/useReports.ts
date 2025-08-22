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
import { Report, COLLECTIONS } from '@/types/firebase';

// Hook para obtener todos los reportes
export const useReports = (limitCount: number = 20) => {
  const [reports, setReports] = useState<Report[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const reportsRef = collection(db, COLLECTIONS.REPORTS);
    const q = query(
      reportsRef,
      orderBy('createdAt', 'desc'),
      limit(limitCount)
    );

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const reportsData: Report[] = [];
        snapshot.forEach((doc) => {
          reportsData.push({ id: doc.id, ...doc.data() } as Report & { id: string });
        });
        setReports(reportsData);
        setLoading(false);
      },
      (err) => {
        setError(err.message);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, [limitCount]);

  return { reports, loading, error };
};

// Hook para obtener un reporte específico
export const useReport = (reportId: string) => {
  const [report, setReport] = useState<Report | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!reportId) {
      setLoading(false);
      return;
    }

    const reportRef = doc(db, COLLECTIONS.REPORTS, reportId);
    const unsubscribe = onSnapshot(
      reportRef,
      (doc) => {
        if (doc.exists()) {
          setReport({ id: doc.id, ...doc.data() } as Report & { id: string });
        } else {
          setReport(null);
        }
        setLoading(false);
      },
      (err) => {
        setError(err.message);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, [reportId]);

  return { report, loading, error };
};

// Hook para obtener reportes por dron
export const useReportsByDrone = (droneId: string, limitCount: number = 20) => {
  const [reports, setReports] = useState<Report[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!droneId) {
      setLoading(false);
      return;
    }

    const reportsRef = collection(db, COLLECTIONS.REPORTS);
    const q = query(
      reportsRef,
      where('droneId', '==', droneId),
      orderBy('createdAt', 'desc'),
      limit(limitCount)
    );

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const reportsData: Report[] = [];
        snapshot.forEach((doc) => {
          reportsData.push({ id: doc.id, ...doc.data() } as Report & { id: string });
        });
        setReports(reportsData);
        setLoading(false);
      },
      (err) => {
        setError(err.message);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, [droneId, limitCount]);

  return { reports, loading, error };
};

// Hook para obtener reportes por autor
export const useReportsByAuthor = (author: string, limitCount: number = 20) => {
  const [reports, setReports] = useState<Report[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!author) {
      setLoading(false);
      return;
    }

    const reportsRef = collection(db, COLLECTIONS.REPORTS);
    const q = query(
      reportsRef,
      where('author', '==', author),
      orderBy('createdAt', 'desc'),
      limit(limitCount)
    );

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const reportsData: Report[] = [];
        snapshot.forEach((doc) => {
          reportsData.push({ id: doc.id, ...doc.data() } as Report & { id: string });
        });
        setReports(reportsData);
        setLoading(false);
      },
      (err) => {
        setError(err.message);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, [author, limitCount]);

  return { reports, loading, error };
};

// Hook para obtener reportes por fecha
export const useReportsByDate = (date: Date, limitCount: number = 20) => {
  const [reports, setReports] = useState<Report[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!date) {
      setLoading(false);
      return;
    }

    const startOfDay = new Date(date);
    startOfDay.setHours(0, 0, 0, 0);
    
    const endOfDay = new Date(date);
    endOfDay.setHours(23, 59, 59, 999);

    const reportsRef = collection(db, COLLECTIONS.REPORTS);
    const q = query(
      reportsRef,
      where('date', '>=', Timestamp.fromDate(startOfDay)),
      where('date', '<=', Timestamp.fromDate(endOfDay)),
      orderBy('date', 'desc'),
      limit(limitCount)
    );

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const reportsData: Report[] = [];
        snapshot.forEach((doc) => {
          reportsData.push({ id: doc.id, ...doc.data() } as Report & { id: string });
        });
        setReports(reportsData);
        setLoading(false);
      },
      (err) => {
        setError(err.message);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, [date, limitCount]);

  return { reports, loading, error };
};

// Hook para obtener reportes por rango de fechas
export const useReportsByDateRange = (startDate: Date, endDate: Date, limitCount: number = 50) => {
  const [reports, setReports] = useState<Report[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!startDate || !endDate) {
      setLoading(false);
      return;
    }

    const reportsRef = collection(db, COLLECTIONS.REPORTS);
    const q = query(
      reportsRef,
      where('date', '>=', Timestamp.fromDate(startDate)),
      where('date', '<=', Timestamp.fromDate(endDate)),
      orderBy('date', 'desc'),
      limit(limitCount)
    );

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const reportsData: Report[] = [];
        snapshot.forEach((doc) => {
          reportsData.push({ id: doc.id, ...doc.data() } as Report & { id: string });
        });
        setReports(reportsData);
        setLoading(false);
      },
      (err) => {
        setError(err.message);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, [startDate, endDate, limitCount]);

  return { reports, loading, error };
};

// Hook para obtener reportes por etiquetas
export const useReportsByTags = (tags: string[], limitCount: number = 20) => {
  const [reports, setReports] = useState<Report[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!tags || tags.length === 0) {
      setLoading(false);
      return;
    }

    const reportsRef = collection(db, COLLECTIONS.REPORTS);
    const q = query(
      reportsRef,
      where('tags', 'array-contains-any', tags),
      orderBy('createdAt', 'desc'),
      limit(limitCount)
    );

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const reportsData: Report[] = [];
        snapshot.forEach((doc) => {
          reportsData.push({ id: doc.id, ...doc.data() } as Report & { id: string });
        });
        setReports(reportsData);
        setLoading(false);
      },
      (err) => {
        setError(err.message);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, [tags, limitCount]);

  return { reports, loading, error };
};

// Funciones para operaciones CRUD
export const useReportOperations = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const createReport = async (reportData: Omit<Report, 'createdAt'>) => {
    setLoading(true);
    setError(null);
    try {
      const reportWithTimestamp = {
        ...reportData,
        createdAt: Timestamp.now()
      };
      const docRef = await addDoc(collection(db, COLLECTIONS.REPORTS), reportWithTimestamp);
      return docRef.id;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error creating report');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const updateReport = async (reportId: string, updates: Partial<Report>) => {
    setLoading(true);
    setError(null);
    try {
      const reportRef = doc(db, COLLECTIONS.REPORTS, reportId);
      await updateDoc(reportRef, updates);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error updating report');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const deleteReport = async (reportId: string) => {
    setLoading(true);
    setError(null);
    try {
      const reportRef = doc(db, COLLECTIONS.REPORTS, reportId);
      await deleteDoc(reportRef);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error deleting report');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return {
    createReport,
    updateReport,
    deleteReport,
    loading,
    error
  };
};
