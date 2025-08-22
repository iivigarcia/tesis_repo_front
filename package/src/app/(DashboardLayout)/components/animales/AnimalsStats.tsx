'use client'
import React from 'react';
import { 
  Card, 
  CardContent, 
  Typography, 
  Box, 
  Skeleton,
  Grid
} from '@mui/material';
import { 
  IconPaw, 
  IconCircleDot, 
  IconCircle, 
  IconHorse,
  IconMapPin
} from '@tabler/icons-react';
import { useAnimalsStats } from '@/hooks';
import { useZones } from '@/hooks';

const AnimalsStats = () => {
  const { stats, loading } = useAnimalsStats();
  const { zones } = useZones();

  // Función para obtener el icono según el tipo de animal
  const getAnimalIcon = (type: string) => {
    switch (type.toLowerCase()) {
      case 'sheep':
        return IconCircleDot;
      case 'cow':
        return IconCircle;
      case 'horse':
        return IconHorse;
      default:
        return IconPaw;
    }
  };

  // Función para obtener el nombre del tipo de animal
  const getAnimalTypeName = (type: string) => {
    switch (type.toLowerCase()) {
      case 'sheep':
        return 'Ovejas';
      case 'cow':
        return 'Vacas';
      case 'horse':
        return 'Caballos';
      default:
        return type.charAt(0).toUpperCase() + type.slice(1);
    }
  };

  // Función para obtener el nombre de la zona
  const getZoneName = (zoneId: string) => {
    const zone = zones.find(z => (z as any).id === zoneId);
    return zone ? zone.name : 'Zona desconocida';
  };

  if (loading) {
    return (
      <Grid container spacing={3}>
        {[1, 2, 3, 4].map((i) => (
          <Grid size={{ xs: 6, md: 3 }} key={i}>
            <Card sx={{
              boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
              borderRadius: 2
            }}>
              <CardContent sx={{ p: 3 }}>
                <Skeleton variant="text" width="60%" height={24} />
                <Skeleton variant="text" width="40%" height={20} />
                <Skeleton variant="rectangular" height={40} sx={{ borderRadius: 1, mt: 1 }} />
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    );
  }

  return (
    <Grid container spacing={3}>
      {/* Total Animals */}
      <Grid size={{ xs: 6, md: 3 }}>
        <Card sx={{
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
          borderRadius: 2,
          bgcolor: 'primary.main',
          color: 'white'
        }}>
          <CardContent sx={{ p: 3 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                             <IconPaw size={24} color="white" />
              <Typography variant="h6" sx={{ ml: 1, fontWeight: 'bold' }}>
                Total Animales
              </Typography>
            </Box>
            <Typography variant="h4" sx={{ fontWeight: 'bold', mb: 1 }}>
              {stats.total}
            </Typography>
            <Typography variant="body2" sx={{ opacity: 0.8 }}>
              Detectados hoy
            </Typography>
          </CardContent>
        </Card>
      </Grid>

      {/* Animals by Type */}
      {Object.entries(stats.byType).slice(0, 3).map(([type, count], index) => {
        const AnimalIcon = getAnimalIcon(type);
        const colors = ['#4CAF50', '#FF9800', '#2196F3'];
        
        return (
          <Grid size={{ xs: 6, md: 3 }} key={type}>
            <Card sx={{
              boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
              borderRadius: 2,
              bgcolor: colors[index % colors.length],
              color: 'white'
            }}>
              <CardContent sx={{ p: 3 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <AnimalIcon size={24} color="white" />
                  <Typography variant="h6" sx={{ ml: 1, fontWeight: 'bold' }}>
                    {getAnimalTypeName(type)}
                  </Typography>
                </Box>
                <Typography variant="h4" sx={{ fontWeight: 'bold', mb: 1 }}>
                  {count}
                </Typography>
                <Typography variant="body2" sx={{ opacity: 0.8 }}>
                  {count === 1 ? 'Animal' : 'Animales'}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        );
      })}

      {/* Zones with Animals */}
      {Object.entries(stats.byZone).slice(0, 1).map(([zoneId, count]) => (
        <Grid size={{ xs: 6, md: 3 }} key={zoneId}>
          <Card sx={{
            boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
            borderRadius: 2,
            bgcolor: '#9C27B0',
            color: 'white'
          }}>
            <CardContent sx={{ p: 3 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <IconMapPin size={24} color="white" />
                <Typography variant="h6" sx={{ ml: 1, fontWeight: 'bold' }}>
                  Zonas Activas
                </Typography>
              </Box>
              <Typography variant="h4" sx={{ fontWeight: 'bold', mb: 1 }}>
                {Object.keys(stats.byZone).length}
              </Typography>
              <Typography variant="body2" sx={{ opacity: 0.8 }}>
                Con animales
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      ))}
    </Grid>
  );
};

export default AnimalsStats;
