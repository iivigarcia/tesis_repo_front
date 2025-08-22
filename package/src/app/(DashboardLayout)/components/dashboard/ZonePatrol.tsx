import React from 'react';
import { Card, CardContent, Typography, Box, LinearProgress, Skeleton } from '@mui/material';
import { IconShield } from '@tabler/icons-react';
import { useDashboardMetrics, useZones } from '@/hooks';

const ZonePatrol = () => {
  const { metrics, loading: metricsLoading } = useDashboardMetrics();
  const { zones, loading: zonesLoading } = useZones();

  const loading = metricsLoading || zonesLoading;

  // Calcular el progreso de cada zona basado en su estado
  const getZoneProgress = (zoneId: string) => {
    const status = metrics?.zonesStatus?.[zoneId];
    const alertCount = metrics?.alertsByZone?.[zoneId] || 0;
    
    if (status === 'patrolled') {
      return 100; // Zona completamente patrullada
    } else if (status === 'pending') {
      return alertCount > 0 ? 25 : 0; // Zona pendiente con alertas = 25%, sin alertas = 0%
    }
    return 0;
  };

  // Obtener el color del progreso
  const getProgressColor = (progress: number) => {
    if (progress === 100) return '#4CAF50';
    if (progress > 50) return '#FF9800';
    return '#F44336';
  };

  if (loading) {
    return (
      <Card sx={{ 
        height: '100%', 
        boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
        borderRadius: 2
      }}>
        <CardContent sx={{ p: 3 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
            <IconShield size={24} color="#5D87FF" />
            <Typography variant="h6" sx={{ ml: 1, fontWeight: 'bold' }}>
              Patrullaje Por Zonas
            </Typography>
          </Box>
          <Box sx={{ maxHeight: 300, overflowY: 'auto' }}>
            {[1, 2, 3, 4, 5, 6, 7].map((i) => (
              <Box key={i} sx={{ mb: 2 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                  <Skeleton variant="text" width={60} />
                  <Skeleton variant="text" width={40} />
                </Box>
                <Skeleton variant="rectangular" height={8} sx={{ borderRadius: 1 }} />
              </Box>
            ))}
          </Box>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card sx={{ 
      height: '100%', 
      boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
      borderRadius: 2
    }}>
      <CardContent sx={{ p: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
          <IconShield size={24} color="#5D87FF" />
          <Typography variant="h6" sx={{ ml: 1, fontWeight: 'bold' }}>
            Patrullaje Por Zonas
          </Typography>
        </Box>

        <Box sx={{ maxHeight: 300, overflowY: 'auto' }}>
          {zones.length > 0 ? (
            zones.map((zone, index) => {
              const zoneWithId = zone as any;
              const progress = getZoneProgress(zoneWithId.id);
              const alertCount = metrics?.alertsByZone?.[zoneWithId.id] || 0;
              const status = metrics?.zonesStatus?.[zoneWithId.id] || 'pending';

              return (
                <Box key={zoneWithId.id || index} sx={{ mb: 2 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                    <Typography variant="body2" sx={{ fontWeight: 'medium' }}>
                      {zone.name}
                    </Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                        {progress}%
                      </Typography>
                      {alertCount > 0 && (
                        <Box sx={{
                          width: 16,
                          height: 16,
                          borderRadius: '50%',
                          bgcolor: '#F44336',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontSize: '0.7rem',
                          color: 'white',
                          fontWeight: 'bold'
                        }}>
                          {alertCount > 9 ? '9+' : alertCount}
                        </Box>
                      )}
                    </Box>
                  </Box>
                  <LinearProgress
                    variant="determinate"
                    value={progress}
                    sx={{
                      height: 8,
                      borderRadius: 4,
                      bgcolor: '#f0f0f0',
                      '& .MuiLinearProgress-bar': {
                        borderRadius: 4,
                        bgcolor: getProgressColor(progress)
                      }
                    }}
                  />
                  <Typography variant="caption" sx={{ color: 'text.secondary', mt: 0.5 }}>
                    Estado: {status === 'patrolled' ? 'Patrullada' : 'Pendiente'}
                  </Typography>
                </Box>
              );
            })
          ) : (
            <Box sx={{ textAlign: 'center', py: 4 }}>
              <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                No hay zonas configuradas
              </Typography>
            </Box>
          )}
        </Box>

        {/* Resumen */}
        {zones.length > 0 && (
          <Box sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            mt: 3,
            pt: 2,
            borderTop: '1px solid #e0e0e0'
          }}>
            <Typography variant="body2" sx={{ color: 'text.secondary' }}>
              Total zonas: {zones.length}
            </Typography>
            <Typography variant="body2" sx={{ color: 'text.secondary' }}>
              Patrulladas: {Object.values(metrics?.zonesStatus || {}).filter(status => status === 'patrolled').length}
            </Typography>
          </Box>
        )}
      </CardContent>
    </Card>
  );
};

export default ZonePatrol;
