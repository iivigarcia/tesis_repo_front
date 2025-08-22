import React from 'react';
import { Card, CardContent, Typography, Box, Skeleton } from '@mui/material';
import { IconMap } from '@tabler/icons-react';
import { useDashboardMetrics, useZones } from '@/hooks';

const PatrolledZones = () => {
  const { metrics, loading: metricsLoading } = useDashboardMetrics();
  const { zones, loading: zonesLoading } = useZones();

  const loading = metricsLoading || zonesLoading;

  if (loading) {
    return (
      <Card sx={{ 
        height: '100%', 
        boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
        borderRadius: 2
      }}>
        <CardContent sx={{ p: 3 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
            <IconMap size={24} color="#5D87FF" />
            <Typography variant="h6" sx={{ ml: 1, fontWeight: 'bold' }}>
              Zonas Patrulladas
            </Typography>
          </Box>
          <Skeleton variant="rectangular" height={200} sx={{ borderRadius: 2 }} />
          <Box sx={{ mt: 2 }}>
            <Skeleton variant="text" width="60%" />
            <Skeleton variant="text" width="40%" />
          </Box>
        </CardContent>
      </Card>
    );
  }

  // Obtener el estado de las zonas del mapa zonesStatus en metrics
  const zonesStatus = metrics?.zonesStatus || {};
  const alertsByZone = metrics?.alertsByZone || {};

  // Combinar datos de zonas con su estado actual
  const zonesWithStatus = zones.map(zone => {
    const zoneWithId = zone as any;
    const status = zonesStatus[zoneWithId.id] || 'pending';
    const activeAlerts = alertsByZone[zoneWithId.id] || 0;
    
    return {
      ...zone,
      id: zoneWithId.id,
      status,
      activeAlerts
    };
  });

  const patrolledZones = zonesWithStatus.filter(zone => zone.status === 'patrolled');
  const pendingZones = zonesWithStatus.filter(zone => zone.status === 'pending');

  return (
    <Card sx={{ 
      height: '100%', 
      boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
      borderRadius: 2
    }}>
      <CardContent sx={{ p: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
          <IconMap size={24} color="#5D87FF" />
          <Typography variant="h6" sx={{ ml: 1, fontWeight: 'bold' }}>
            Zonas Patrulladas
          </Typography>
        </Box>

        {/* Map Visualization */}
        <Box sx={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(4, 1fr)', 
          gap: 1, 
          mb: 3,
          p: 2,
          bgcolor: '#f8f9fa',
          borderRadius: 2,
          position: 'relative',
          minHeight: 200
        }}>
          {zonesWithStatus.length > 0 ? (
            zonesWithStatus.map((zone, index) => {
              const isPatrolled = zone.status === 'patrolled';
              
              return (
                <Box
                  key={zone.id || index}
                  sx={{
                    aspectRatio: '1',
                    border: '2px solid #666',
                    bgcolor: isPatrolled ? '#4CAF50' : '#FFC107',
                    borderRadius: 1,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    position: 'relative',
                    '&::after': {
                      content: `"${zone.name.split(' ').pop() || zone.name}"`,
                      position: 'absolute',
                      top: '50%',
                      left: '50%',
                      transform: 'translate(-50%, -50%)',
                      color: isPatrolled ? 'white' : '#333',
                      fontWeight: 'bold',
                      fontSize: '0.8rem'
                    }
                  }}
                >
                  {/* Alert indicators */}
                  {zone.activeAlerts > 0 && (
                    <Box
                      sx={{
                        position: 'absolute',
                        top: 4,
                        right: 4,
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
                      }}
                    >
                      {zone.activeAlerts > 9 ? '9+' : zone.activeAlerts}
                    </Box>
                  )}
                </Box>
              );
            })
          ) : (
            <Box sx={{
              gridColumn: '1 / -1',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              height: 200,
              color: 'text.secondary'
            }}>
              <Typography variant="body2">No hay zonas configuradas</Typography>
            </Box>
          )}
        </Box>

        {/* Legend */}
        <Box sx={{ display: 'flex', justifyContent: 'space-around', mb: 3 }}>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Box sx={{
              width: 12,
              height: 12,
              borderRadius: '50%',
              bgcolor: '#4CAF50',
              mr: 1
            }} />
            <Typography variant="body2">Patrulladas</Typography>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Box sx={{
              width: 12,
              height: 12,
              borderRadius: '50%',
              bgcolor: '#FFC107',
              mr: 1
            }} />
            <Typography variant="body2">Pendientes</Typography>
          </Box>
        </Box>

        {/* Summary */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="body2" sx={{ color: 'text.secondary' }}>
            Total de zonas: {zonesWithStatus.length}
          </Typography>
          <Typography variant="body2" sx={{ color: 'text.secondary' }}>
            Patrulladas: {patrolledZones.length}/{zonesWithStatus.length}
          </Typography>
        </Box>

        {/* Progress bar */}
        {zonesWithStatus.length > 0 && (
          <Box sx={{ mt: 2 }}>
            <Box sx={{
              width: '100%',
              height: 8,
              bgcolor: '#f0f0f0',
              borderRadius: 1,
              overflow: 'hidden'
            }}>
              <Box sx={{
                width: `${(patrolledZones.length / zonesWithStatus.length) * 100}%`,
                height: '100%',
                bgcolor: '#4CAF50',
                transition: 'width 0.3s ease'
              }} />
            </Box>
            <Typography variant="caption" sx={{ color: 'text.secondary', mt: 0.5 }}>
              {Math.round((patrolledZones.length / zonesWithStatus.length) * 100)}% completado
            </Typography>
          </Box>
        )}
      </CardContent>
    </Card>
  );
};

export default PatrolledZones;
