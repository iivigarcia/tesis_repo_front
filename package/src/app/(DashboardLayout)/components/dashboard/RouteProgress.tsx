import React from 'react';
import { Card, CardContent, Typography, Box, Skeleton } from '@mui/material';
import { IconRoute } from '@tabler/icons-react';
import { useDashboardMetrics } from '@/hooks';

const RouteProgress = () => {
  const { metrics, loading } = useDashboardMetrics();
  
  // Obtener el progreso de cobertura del patrullaje actual
  const progress = metrics?.currentPatrol?.coveragePct 
    ? Math.round(metrics.currentPatrol.coveragePct * 100) 
    : 0;

  if (loading) {
    return (
      <Card sx={{ 
        height: '100%', 
        boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
        borderRadius: 2
      }}>
        <CardContent sx={{ p: 3 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
            <IconRoute size={24} color="#5D87FF" />
            <Typography variant="h6" sx={{ ml: 1, fontWeight: 'bold' }}>
              Total Del Recorrido Actual
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', mb: 3 }}>
            <Skeleton variant="circular" width={120} height={120} />
          </Box>
          <Box sx={{ display: 'flex', justifyContent: 'space-around' }}>
            <Skeleton variant="text" width={80} />
            <Skeleton variant="text" width={80} />
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
          <IconRoute size={24} color="#5D87FF" />
          <Typography variant="h6" sx={{ ml: 1, fontWeight: 'bold' }}>
            Total Del Recorrido Actual
          </Typography>
        </Box>

        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', mb: 3 }}>
          <Box sx={{ position: 'relative', display: 'inline-flex' }}>
            <Box
              sx={{
                width: 120,
                height: 120,
                borderRadius: '50%',
                background: `conic-gradient(#4CAF50 ${progress * 3.6}deg, #e0e0e0 0deg)`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Box
                sx={{
                  width: 80,
                  height: 80,
                  borderRadius: '50%',
                  bgcolor: 'white',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <Typography variant="h4" sx={{ fontWeight: 'bold', color: '#4CAF50' }}>
                  {progress}%
                </Typography>
              </Box>
            </Box>
          </Box>
        </Box>

        {/* Información adicional del patrullaje */}
        {metrics?.currentPatrol && (
          <Box sx={{ mb: 3, p: 2, bgcolor: '#f8f9fa', borderRadius: 2 }}>
            <Typography variant="body2" sx={{ color: 'text.secondary', mb: 1 }}>
              Dron: {metrics.currentPatrol.droneId}
            </Typography>
            <Typography variant="body2" sx={{ color: 'text.secondary', mb: 1 }}>
              Zona: {metrics.currentPatrol.zoneId}
            </Typography>
            <Typography variant="body2" sx={{ color: 'text.secondary' }}>
              Última actualización: {metrics.currentPatrol.updatedAt?.toDate?.()?.toLocaleTimeString() || 'N/A'}
            </Typography>
          </Box>
        )}

        <Box sx={{ display: 'flex', justifyContent: 'space-around' }}>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Box sx={{ 
              width: 12, 
              height: 12, 
              borderRadius: '50%', 
              bgcolor: '#4CAF50', 
              mr: 1 
            }} />
            <Typography variant="body2">Completado</Typography>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Box sx={{ 
              width: 12, 
              height: 12, 
              borderRadius: '50%', 
              bgcolor: '#e0e0e0', 
              mr: 1 
            }} />
            <Typography variant="body2">Faltante</Typography>
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
};

export default RouteProgress;
