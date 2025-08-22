import React from 'react';
import { Card, CardContent, Typography, Box, LinearProgress, Skeleton } from '@mui/material';
import { IconBattery } from '@tabler/icons-react';
import { useDashboardMetrics, useDrones } from '@/hooks';

const BatteryLevel = () => {
  const { metrics, loading: metricsLoading } = useDashboardMetrics();
  const { drones, loading: dronesLoading } = useDrones();

  const loading = metricsLoading || dronesLoading;

  const getBatteryColor = (level: number) => {
    if (level > 60) return 'success';
    if (level > 30) return 'warning';
    return 'error';
  };

  const getBatteryText = (level: number) => {
    if (level > 60) return 'Bueno';
    if (level > 30) return 'Medio';
    return 'Bajo';
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
            <IconBattery size={24} color="#5D87FF" />
            <Typography variant="h6" sx={{ ml: 1, fontWeight: 'bold' }}>
              Nivel de Batería
            </Typography>
          </Box>
          {[1, 2].map((i) => (
            <Box key={i} sx={{ mb: 2 }}>
              <Skeleton variant="text" width="40%" height={20} />
              <Skeleton variant="rectangular" height={8} sx={{ borderRadius: 1, mt: 1 }} />
            </Box>
          ))}
        </CardContent>
      </Card>
    );
  }

  // Obtener los niveles de batería del mapa batteries en metrics
  const batteries = metrics?.batteries || {};
  const batteryEntries = Object.entries(batteries);

  return (
    <Card sx={{ 
      height: '100%', 
      boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
      borderRadius: 2
    }}>
      <CardContent sx={{ p: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
          <IconBattery size={24} color="#5D87FF" />
          <Typography variant="h6" sx={{ ml: 1, fontWeight: 'bold' }}>
            Nivel de Batería
          </Typography>
        </Box>

        {batteryEntries.length > 0 ? (
          batteryEntries.map(([droneId, batteryLevel]) => {
            const batteryPercentage = Math.round(batteryLevel * 100);
            const batteryColor = getBatteryColor(batteryPercentage);
            const batteryText = getBatteryText(batteryPercentage);

            // Buscar el nombre del dron en la colección drones
            const drone = drones.find(d => (d as any).id === droneId);
            const droneName = drone?.name || `Dron ${droneId}`;

            return (
              <Box key={droneId} sx={{ mb: 2 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                  <Typography variant="body2" sx={{ fontWeight: 'medium' }}>
                    {droneName}
                  </Typography>
                  <Typography variant="body2" sx={{ 
                    color: `${batteryColor}.main`,
                    fontWeight: 'medium'
                  }}>
                    {batteryPercentage}% - {batteryText}
                  </Typography>
                </Box>
                <LinearProgress
                  variant="determinate"
                  value={batteryPercentage}
                  sx={{
                    height: 8,
                    borderRadius: 1,
                    bgcolor: 'grey.200',
                    '& .MuiLinearProgress-bar': {
                      bgcolor: `${batteryColor}.main`,
                      borderRadius: 1
                    }
                  }}
                />
              </Box>
            );
          })
        ) : (
          <Box sx={{ textAlign: 'center', py: 4 }}>
            <Typography variant="body2" sx={{ color: 'text.secondary' }}>
              No hay datos de batería disponibles
            </Typography>
          </Box>
        )}

        {/* Summary */}
        {batteryEntries.length > 0 && (
          <Box sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            mt: 3,
            pt: 2,
            borderTop: '1px solid #e0e0e0'
          }}>
            <Typography variant="body2" sx={{ color: 'text.secondary' }}>
              Promedio: {Math.round(Object.values(batteries).reduce((sum, level) => sum + (level * 100), 0) / batteryEntries.length)}%
            </Typography>
            <Typography variant="body2" sx={{ color: 'text.secondary' }}>
              {Object.values(batteries).filter(level => (level * 100) < 30).length} drones con batería baja
            </Typography>
          </Box>
        )}
      </CardContent>
    </Card>
  );
};

export default BatteryLevel;
