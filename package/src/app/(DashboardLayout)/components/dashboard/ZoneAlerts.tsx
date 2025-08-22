import React from 'react';
import { Card, CardContent, Typography, Box, Skeleton } from '@mui/material';
import { IconAlertTriangle } from '@tabler/icons-react';
import { useDashboardMetrics, useZones } from '@/hooks';

const ZoneAlerts = () => {
  const { metrics, loading: metricsLoading } = useDashboardMetrics();
  const { zones, loading: zonesLoading } = useZones();

  const loading = metricsLoading || zonesLoading;

  // Obtener alertas por zona directamente del mapa alertsByZone en metrics
  const alertsByZone = metrics?.alertsByZone || {};

  // Obtener las zonas con más alertas
  const zonesWithAlerts = zones
    .map(zone => {
      const zoneWithId = zone as any;
      const alertCount = alertsByZone[zoneWithId.id] || 0;
      
      return {
        ...zone,
        id: zoneWithId.id,
        alertCount
      };
    })
    .filter(zone => zone.alertCount > 0)
    .sort((a, b) => b.alertCount - a.alertCount)
    .slice(0, 5);

  if (loading) {
    return (
      <Card sx={{ 
        height: '100%', 
        boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
        borderRadius: 2
      }}>
        <CardContent sx={{ p: 3 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
            <IconAlertTriangle size={24} color="#5D87FF" />
            <Typography variant="h6" sx={{ ml: 1, fontWeight: 'bold' }}>
              Alertas por Zona
            </Typography>
          </Box>
          {[1, 2, 3, 4, 5].map((i) => (
            <Box key={i} sx={{ mb: 2 }}>
              <Skeleton variant="text" width="60%" height={20} />
              <Skeleton variant="rectangular" height={8} sx={{ borderRadius: 1, mt: 1 }} />
            </Box>
          ))}
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
          <IconAlertTriangle size={24} color="#5D87FF" />
          <Typography variant="h6" sx={{ ml: 1, fontWeight: 'bold' }}>
            Alertas por Zona
          </Typography>
        </Box>

        {zonesWithAlerts.length > 0 ? (
          zonesWithAlerts.map((zone, index) => {
            const maxAlerts = Math.max(...zonesWithAlerts.map(z => z.alertCount));
            const percentage = maxAlerts > 0 ? (zone.alertCount / maxAlerts) * 100 : 0;
            
            return (
              <Box key={zone.id} sx={{ mb: 2 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                  <Typography variant="body2" sx={{ fontWeight: 'medium' }}>
                    {zone.name}
                  </Typography>
                  <Typography variant="body2" sx={{ 
                    color: zone.alertCount > 5 ? 'error.main' : 'warning.main',
                    fontWeight: 'medium'
                  }}>
                    {zone.alertCount} alertas
                  </Typography>
                </Box>
                <Box sx={{ 
                  width: '100%', 
                  height: 8, 
                  bgcolor: '#f0f0f0', 
                  borderRadius: 1, 
                  overflow: 'hidden' 
                }}>
                  <Box sx={{ 
                    width: `${percentage}%`, 
                    height: '100%', 
                    bgcolor: zone.alertCount > 5 ? '#F44336' : '#FFC107',
                    transition: 'width 0.3s ease' 
                  }} />
                </Box>
              </Box>
            );
          })
        ) : (
          <Box sx={{ textAlign: 'center', py: 4 }}>
            <Typography variant="body2" sx={{ color: 'text.secondary' }}>
              No hay alertas activas
            </Typography>
          </Box>
        )}

        {/* Summary */}
        {zonesWithAlerts.length > 0 && (
          <Box sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            mt: 3,
            pt: 2,
            borderTop: '1px solid #e0e0e0'
          }}>
            <Typography variant="body2" sx={{ color: 'text.secondary' }}>
              Total de alertas: {Object.values(alertsByZone).reduce((sum, count) => sum + count, 0)}
            </Typography>
            <Typography variant="body2" sx={{ color: 'text.secondary' }}>
              Zonas con alertas: {zonesWithAlerts.length}
            </Typography>
          </Box>
        )}

        {/* Radar-like visualization */}
        {zonesWithAlerts.length > 0 && (
          <Box sx={{
            mt: 3,
            p: 2,
            bgcolor: '#f8f9fa',
            borderRadius: 2,
            position: 'relative',
            height: 120,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <Box sx={{
              width: 80,
              height: 80,
              borderRadius: '50%',
              border: '2px solid #e0e0e0',
              position: 'relative',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <Typography variant="h6" sx={{ fontWeight: 'bold', color: 'primary.main' }}>
                {Object.values(alertsByZone).reduce((sum, count) => sum + count, 0)}
              </Typography>
            </Box>

            {/* Alert indicators around the circle */}
            {zonesWithAlerts.slice(0, 4).map((zone, index) => {
              const angle = (index * 90) * (Math.PI / 180);
              const radius = 50;
              const x = Math.cos(angle) * radius;
              const y = Math.sin(angle) * radius;

              return (
                <Box
                  key={zone.id}
                  sx={{
                    position: 'absolute',
                    width: 12,
                    height: 12,
                    borderRadius: '50%',
                    bgcolor: zone.alertCount > 5 ? '#F44336' : '#FFC107',
                    left: `calc(50% + ${x}px)`,
                    top: `calc(50% + ${y}px)`,
                    transform: 'translate(-50%, -50%)',
                    border: '2px solid white',
                    boxShadow: '0 2px 4px rgba(0,0,0,0.2)'
                  }}
                />
              );
            })}
          </Box>
        )}
      </CardContent>
    </Card>
  );
};

export default ZoneAlerts;
