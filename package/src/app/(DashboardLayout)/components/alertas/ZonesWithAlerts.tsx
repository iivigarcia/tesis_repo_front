import React from 'react';
import {
  Card,
  CardContent,
  Typography,
  Box,
  Chip,
  Skeleton,
  Grid
} from '@mui/material';
import {
  IconMap,
  IconAlertTriangle,
  IconAlertCircle,
  IconAlertOctagon
} from '@tabler/icons-react';
import { useZones } from '@/hooks';
import { useAlerts } from '@/hooks';

const ZonesWithAlerts = () => {
  const { zones, loading: zonesLoading } = useZones();
  const { alerts, loading: alertsLoading } = useAlerts();

  const loading = zonesLoading || alertsLoading;

  // Función para contar alertas por zona y severidad
  const getAlertsByZone = (zoneId: string) => {
    const zoneAlerts = alerts.filter(alert => alert.zoneId === zoneId);
    return {
      critical: zoneAlerts.filter(alert => alert.critical).length,
      nonCritical: zoneAlerts.filter(alert => !alert.critical).length,
      total: zoneAlerts.length
    };
  };

  // Función para obtener el color de la zona basado en las alertas
  const getZoneColor = (zoneId: string) => {
    const alertCounts = getAlertsByZone(zoneId);
    if (alertCounts.critical > 0) return '#F44336';
    if (alertCounts.nonCritical > 0) return '#FF9800';
    return '#9E9E9E';
  };

  // Función para obtener el estado de la zona
  const getZoneStatus = (zoneId: string) => {
    const alertCounts = getAlertsByZone(zoneId);
    if (alertCounts.critical > 0) return 'Crítico';
    if (alertCounts.nonCritical > 0) return 'No Crítico';
    return 'Sin alertas';
  };

  // Función para obtener el icono de la zona
  const getZoneIcon = (zoneId: string) => {
    const alertCounts = getAlertsByZone(zoneId);
    if (alertCounts.critical > 0) return IconAlertOctagon;
    if (alertCounts.nonCritical > 0) return IconAlertTriangle;
    return IconMap;
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
            <IconMap size={24} color="#5D87FF" />
            <Typography variant="h6" sx={{ ml: 1, fontWeight: 'bold' }}>
              Zonas con Alertas
            </Typography>
          </Box>
          <Grid container spacing={2}>
            {[1, 2, 3, 4].map((i) => (
              <Grid size={{ xs: 6, md: 3 }} key={i}>
                <Skeleton variant="rectangular" height={120} sx={{ borderRadius: 2 }} />
              </Grid>
            ))}
          </Grid>
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
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 3 }}>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <IconMap size={24} color="#5D87FF" />
            <Typography variant="h6" sx={{ ml: 1, fontWeight: 'bold' }}>
              Zonas con Alertas
            </Typography>
          </Box>
          <Chip
            label={`${zones.length} zonas`}
            color="primary"
            size="small"
          />
        </Box>

        {zones.length > 0 ? (
          <Grid container spacing={2}>
            {zones.map((zone) => {
              const zoneWithId = zone as any;
              const alertCounts = getAlertsByZone(zoneWithId.id);
              const zoneColor = getZoneColor(zoneWithId.id);
              const zoneStatus = getZoneStatus(zoneWithId.id);
              const ZoneIcon = getZoneIcon(zoneWithId.id);

              return (
                <Grid size={{ xs: 6, md: 3 }} key={zoneWithId.id}>
                  <Box
                    sx={{
                      p: 2,
                      bgcolor: '#f8f9fa',
                      borderRadius: 2,
                      border: `2px solid ${zoneColor}`,
                      textAlign: 'center',
                      cursor: 'pointer',
                      transition: 'all 0.2s',
                      '&:hover': {
                        transform: 'translateY(-2px)',
                        boxShadow: '0 4px 12px rgba(0,0,0,0.15)'
                      }
                    }}
                  >
                    {/* Zone Icon */}
                    <Box sx={{ mb: 1 }}>
                      <ZoneIcon size={32} color={zoneColor} />
                    </Box>

                    {/* Zone Name */}
                    <Typography variant="body2" sx={{ fontWeight: 'bold', mb: 1 }}>
                      {zone.name}
                    </Typography>

                    {/* Zone Status */}
                    <Chip
                      label={zoneStatus}
                      size="small"
                      sx={{
                        bgcolor: zoneColor,
                        color: 'white',
                        fontSize: '0.7rem',
                        height: 20,
                        mb: 1
                      }}
                    />

                    {/* Alert Counts */}
                    {alertCounts.total > 0 && (
                      <Box sx={{ mt: 1 }}>
                        <Typography variant="caption" sx={{ color: 'text.secondary', display: 'block' }}>
                          Alertas: {alertCounts.total}
                        </Typography>
                                                 <Box sx={{ display: 'flex', justifyContent: 'center', gap: 0.5, mt: 0.5 }}>
                           {alertCounts.critical > 0 && (
                             <Box sx={{ width: 8, height: 8, borderRadius: '50%', bgcolor: '#F44336' }} />
                           )}
                           {alertCounts.nonCritical > 0 && (
                             <Box sx={{ width: 8, height: 8, borderRadius: '50%', bgcolor: '#FF9800' }} />
                           )}
                         </Box>
                      </Box>
                    )}

                    {/* Zone Status */}
                    <Typography variant="caption" sx={{ color: 'text.secondary', display: 'block', mt: 1 }}>
                      Estado: {zone.status === 'patrolled' ? 'Patrullada' : 'Pendiente'}
                    </Typography>
                  </Box>
                </Grid>
              );
            })}
          </Grid>
        ) : (
          <Box sx={{ textAlign: 'center', py: 4 }}>
            <IconMap size={48} color="#ccc" />
            <Typography variant="body2" sx={{ color: 'text.secondary', mt: 2 }}>
              No hay zonas configuradas
            </Typography>
          </Box>
        )}

        {/* Summary */}
        {zones.length > 0 && (
          <Box sx={{
            mt: 3,
            pt: 2,
            borderTop: '1px solid #e0e0e0'
          }}>
            <Typography variant="body2" sx={{ color: 'text.secondary', mb: 1 }}>
              Resumen de alertas por zona:
            </Typography>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: 1 }}>
              <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                Zonas críticas: {zones.filter(z => getAlertsByZone((z as any).id).critical > 0).length}
              </Typography>
              <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                Zonas con alertas: {zones.filter(z => getAlertsByZone((z as any).id).total > 0).length}
              </Typography>
              <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                Total alertas: {alerts.length}
              </Typography>
            </Box>
          </Box>
        )}
      </CardContent>
    </Card>
  );
};

export default ZonesWithAlerts;
