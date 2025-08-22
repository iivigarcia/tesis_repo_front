import React from 'react';
import { Card, CardContent, Typography, Box, Skeleton, Chip, LinearProgress } from '@mui/material';
import { IconDrone, IconBattery, IconWifi, IconMapPin, IconClock, IconCode } from '@tabler/icons-react';
import { useDrones, useZones } from '@/hooks';

const DronesStatus = () => {
  const { drones, loading } = useDrones();
  const { zones } = useZones();

  // Función para obtener el color del estado del dron
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'flying': return 'success';
      case 'idle': return 'warning';
      case 'charging': return 'info';
      case 'offline': return 'error';
      default: return 'default';
    }
  };

  // Función para obtener el texto del estado
  const getStatusText = (status: string) => {
    switch (status) {
      case 'flying': return 'Volando';
      case 'idle': return 'En Espera ';
      case 'charging': return 'Cargando';
      case 'offline': return 'Desconectado';
      default: return 'Desconocido';
    }
  };

  // Función para obtener el color de la batería
  const getBatteryColor = (level: number) => {
    if (level > 60) return 'success';
    if (level > 30) return 'warning';
    return 'error';
  };

  // Función para formatear la fecha del último heartbeat
  const formatLastHeartbeat = (timestamp: any) => {
    if (!timestamp) return 'N/A';
    const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    
    if (diffMins < 1) return 'Ahora';
    if (diffMins < 60) return `${diffMins}m atrás`;
    const diffHours = Math.floor(diffMins / 60);
    if (diffHours < 24) return `${diffHours}h atrás`;
    const diffDays = Math.floor(diffHours / 24);
    return `${diffDays}d atrás`;
  };

  // Función para verificar si el dron está online (último heartbeat en los últimos 5 minutos)
  const isDroneOnline = (timestamp: any) => {
    if (!timestamp) return false;
    const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    return diffMs < 5 * 60 * 1000; // 5 minutos
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
            <IconDrone size={24} color="#5D87FF" />
            <Typography variant="h6" sx={{ ml: 1, fontWeight: 'bold' }}>
              Estado de Drones
            </Typography>
          </Box>
          {[1, 2, 3].map((i) => (
            <Box key={i} sx={{ mb: 2 }}>
              <Skeleton variant="text" width="60%" height={20} />
              <Skeleton variant="text" width="40%" height={16} />
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
          <IconDrone size={24} color="#5D87FF" />
          <Typography variant="h6" sx={{ ml: 1, fontWeight: 'bold' }}>
            Estado de Drones
          </Typography>
        </Box>

        {drones.length > 0 ? (
          <Box sx={{ maxHeight: 600, overflowY: 'auto' }}>
            {drones.map((drone, index) => {
              const droneWithId = drone as any;
              const isOnline = isDroneOnline(drone.lastHeartbeatAt);
              
              return (
                <Box
                  key={droneWithId.id}
                  sx={{
                    p: 2,
                    mb: 2,
                    bgcolor: '#f8f9fa',
                    borderRadius: 2,
                    border: '1px solid #e0e0e0',
                    '&:last-child': { mb: 0 }
                  }}
                >
                  {/* Header */}
                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <IconDrone size={20} color="#5D87FF" />
                      <Typography variant="h6" sx={{ ml: 1, fontWeight: 'bold' }}>
                        {drone.name}
                      </Typography>
                    </Box>
                    <Chip
                      label={getStatusText(drone.status)}
                      color={getStatusColor(drone.status)}
                      size="small"
                    />
                  </Box>

                  {/* Model and Serial */}
                  <Box sx={{ mb: 2 }}>
                    <Typography variant="body2" sx={{ color: 'text.secondary', mb: 0.5 }}>
                      {drone.model} • {drone.serial}
                    </Typography>
                  </Box>

                  {/* Battery */}
                  <Box sx={{ mb: 2 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                      <IconBattery size={16} color="#666" />
                      <Typography variant="body2" sx={{ ml: 1, fontWeight: 'medium' }}>
                        Batería: {drone.battery}%
                      </Typography>
                    </Box>
                    <LinearProgress
                      variant="determinate"
                      value={drone.battery}
                      color={getBatteryColor(drone.battery)}
                      sx={{ height: 6, borderRadius: 3 }}
                    />
                  </Box>

                  {/* Last Heartbeat */}
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <IconClock size={16} color="#666" />
                    <Typography variant="body2" sx={{ ml: 1, color: 'text.secondary' }}>
                      Último contacto: {formatLastHeartbeat(drone.lastHeartbeatAt)}
                    </Typography>
                  </Box>

                  {/* Current Zone */}
                  {drone.lastZoneId && (
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                      <IconMapPin size={16} color="#666" />
                      <Typography variant="body2" sx={{ ml: 1, color: 'text.secondary' }}>
                        Zona actual: {(() => {
                          const zone = zones.find(z => (z as any).id === drone.lastZoneId);
                          return zone ? zone.name : 'Zona desconocida';
                        })()}
                      </Typography>
                    </Box>
                  )}

                  {/* Firmware Version */}
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <IconCode size={16} color="#666" />
                    <Typography variant="body2" sx={{ ml: 1, color: 'text.secondary' }}>
                      FW: {drone.fwVersion}
                    </Typography>
                  </Box>

                  {/* Location Info */}
                  {drone.lastLocation && (
                    <Box sx={{ mt: 2, p: 1, bgcolor: 'white', borderRadius: 1, border: '1px solid #e0e0e0' }}>
                      <Typography variant="caption" sx={{ color: 'text.secondary', display: 'block' }}>
                        Última ubicación:
                      </Typography>
                      <Typography variant="caption" sx={{ color: 'text.primary' }}>
                        Lat: {drone.lastLocation.latitude?.toFixed(6)}, 
                        Lng: {drone.lastLocation.longitude?.toFixed(6)}
                      </Typography>
                    </Box>
                  )}
                </Box>
              );
            })}
          </Box>
        ) : (
          <Box sx={{ textAlign: 'center', py: 4 }}>
            <IconDrone size={48} color="#ccc" />
            <Typography variant="body2" sx={{ color: 'text.secondary', mt: 2 }}>
              No hay drones disponibles
            </Typography>
          </Box>
        )}

        {/* Summary */}
        {drones.length > 0 && (
          <Box sx={{
            mt: 3,
            pt: 2,
            borderTop: '1px solid #e0e0e0'
          }}>
            <Typography variant="body2" sx={{ color: 'text.secondary', mb: 1 }}>
              Resumen:
            </Typography>
            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
              <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                Online: {drones.filter(d => isDroneOnline(d.lastHeartbeatAt)).length}
              </Typography>
              <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                Batería baja: {drones.filter(d => d.battery < 30).length}
              </Typography>
            </Box>
          </Box>
        )}
      </CardContent>
    </Card>
  );
};

export default DronesStatus;
