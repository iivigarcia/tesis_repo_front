import { useState, useEffect } from 'react';
import { collection, doc, getDoc, onSnapshot, query, orderBy, limit } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { AnimalsDaily } from '@/types/firebase';

// Hook para obtener los datos de animales del día actual
export const useAnimalsDaily = () => {
  const [animalsDaily, setAnimalsDaily] = useState<AnimalsDaily | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Obtener la fecha actual en formato YYYYMMDD
    const today = new Date();
    const dateString = today.getFullYear().toString() + 
                      (today.getMonth() + 1).toString().padStart(2, '0') + 
                      today.getDate().toString().padStart(2, '0');

    const docRef = doc(db, 'animals_daily', dateString);

    const unsubscribe = onSnapshot(
      docRef,
      (doc) => {
        if (doc.exists()) {
          setAnimalsDaily(doc.data() as AnimalsDaily);
        } else {
          setAnimalsDaily(null);
        }
        setLoading(false);
        setError(null);
      },
      (err) => {
        console.error('Error fetching animals daily:', err);
        setError(err.message);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, []);

  return { animalsDaily, loading, error };
};

// Hook para obtener los animales del día actual
export const useTodayAnimals = () => {
  const { animalsDaily, loading, error } = useAnimalsDaily();
  
  // Asegurar que siempre devuelva un array, incluso durante la carga inicial
  const animals = animalsDaily?.animals ?? [];
  
  return { animals, loading, error };
};

// Hook para obtener animales por tipo
export const useAnimalsByType = (type: string) => {
  const { animals, loading, error } = useTodayAnimals();
  
  const filteredAnimals = animals.filter(animal => animal.type === type);
  
  return { animals: filteredAnimals, loading, error };
};

// Hook para obtener animales por zona
export const useAnimalsByZone = (zoneId: string) => {
  const { animals, loading, error } = useTodayAnimals();
  
  const filteredAnimals = animals.filter(animal => animal.zoneId === zoneId);
  
  return { animals: filteredAnimals, loading, error };
};

// Hook para obtener estadísticas de animales
export const useAnimalsStats = () => {
  const { animals, loading, error } = useTodayAnimals();
  
  const stats = {
    total: animals.length,
    byType: animals.reduce((acc, animal) => {
      acc[animal.type] = (acc[animal.type] || 0) + 1;
      return acc;
    }, {} as Record<string, number>),
    byZone: animals.reduce((acc, animal) => {
      acc[animal.zoneId] = (acc[animal.zoneId] || 0) + 1;
      return acc;
    }, {} as Record<string, number>)
  };
  
  return { stats, loading, error };
};
