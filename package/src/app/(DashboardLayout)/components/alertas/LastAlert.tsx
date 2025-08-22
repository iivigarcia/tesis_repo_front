import React from 'react';
import { 
  Card, 
  CardContent, 
  Typography, 
  Box, 
  Chip,
  Skeleton,
  Alert
} from '@mui/material';
import { 
  IconAlertTriangle, 
  IconClock, 
  IconMapPin,
  IconEye
} from '@tabler/icons-react';
import { useAlerts } from '@/hooks';
import { useZones } from '@/hooks';

const LastAlert = () => {
  const { alerts, loading } = useAlerts();
  const { zones } = useZones();

  // Función para obtener el color de la severidad
  const getSeverityColor = (critical: boolean) => {
    return critical ? '#F44336' : '#FF9800';
  };

  // Función para obtener el texto de la severidad
  const getSeverityText = (critical: boolean) => {
    return critical ? 'Crítico' : 'No Crítico';
  };

  // Función para obtener el texto del tipo
  const getTypeText = (type: string) => {
    switch (type) {
      case 'person':
        return 'Persona';
      case 'animal':
        return 'Animal';
      case 'vehicle':
        return 'Vehículo';
      case 'unknown':
        return 'Desconocido';
      default:
        return type;
    }
  };

  // Función para formatear la fecha
  const formatDate = (timestamp: any) => {
    if (!timestamp) return 'N/A';
    const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
    return date.toLocaleString('es-ES', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Función para obtener el tiempo transcurrido
  const getTimeAgo = (timestamp: any) => {
    if (!timestamp) return 'N/A';
    const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    
    if (diffMins < 1) return 'Ahora mismo';
    if (diffMins < 60) return `Hace ${diffMins} minutos`;
    const diffHours = Math.floor(diffMins / 60);
    if (diffHours < 24) return `Hace ${diffHours} horas`;
    const diffDays = Math.floor(diffHours / 24);
    return `Hace ${diffDays} días`;
  };

  // Función para obtener el nombre de la zona
  const getZoneName = (zoneId: string) => {
    const zone = zones.find(z => (z as any).id === zoneId);
    return zone ? zone.name : 'Zona desconocida';
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
            <IconAlertTriangle size={24} color="#FF5722" />
            <Typography variant="h6" sx={{ ml: 1, fontWeight: 'bold' }}>
              Última Alerta
            </Typography>
          </Box>
          <Skeleton variant="text" width="80%" height={24} />
          <Skeleton variant="text" width="60%" height={20} />
          <Skeleton variant="text" width="40%" height={16} />
          <Skeleton variant="rectangular" height={60} sx={{ borderRadius: 1, mt: 2 }} />
        </CardContent>
      </Card>
    );
  }

  // Obtener la alerta más reciente
  const lastAlert = alerts.length > 0 ? alerts[0] : null;

  return (
    <Card sx={{
      height: '100%',
      boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
      borderRadius: 2
    }}>
      <CardContent sx={{ p: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
          <IconAlertTriangle size={24} color="#FF5722" />
          <Typography variant="h6" sx={{ ml: 1, fontWeight: 'bold' }}>
            Última Alerta
          </Typography>
        </Box>

        {lastAlert ? (
          <>
                         {/* Alert Header */}
             <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
               <Typography variant="h6" sx={{ fontWeight: 'bold', color: getSeverityColor(lastAlert.critical) }}>
                 {getTypeText(lastAlert.type)}
               </Typography>
               <Chip
                 label={getSeverityText(lastAlert.critical)}
                 size="small"
                 sx={{
                   bgcolor: getSeverityColor(lastAlert.critical),
                   color: 'white',
                   fontWeight: 'bold'
                 }}
               />
             </Box>

             {/* Alert Description */}
             <Typography variant="body2" sx={{ color: 'text.secondary', mb: 2 }}>
               Alerta detectada en {getZoneName(lastAlert.zoneId)}
             </Typography>

            {/* Alert Details */}
            <Box sx={{ mb: 2 }}>
              {/* Zone */}
              {lastAlert.zoneId && (
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                  <IconMapPin size={16} color="#666" />
                  <Typography variant="body2" sx={{ ml: 1, color: 'text.secondary' }}>
                    Zona: {getZoneName(lastAlert.zoneId)}
                  </Typography>
                </Box>
              )}

                             {/* Timestamp */}
               <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                 <IconClock size={16} color="#666" />
                 <Typography variant="body2" sx={{ ml: 1, color: 'text.secondary' }}>
                   {formatDate(lastAlert.detectedAt)}
                 </Typography>
               </Box>

               {/* Time Ago */}
               <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                 {getTimeAgo(lastAlert.detectedAt)}
               </Typography>
            </Box>

                         {/* Alert Status */}
             <Box sx={{ 
               p: 2, 
               bgcolor: lastAlert.status === 'closed' ? '#E8F5E8' : '#FFF3E0',
               borderRadius: 1,
               border: `1px solid ${lastAlert.status === 'closed' ? '#4CAF50' : '#FF9800'}`
             }}>
               <Box sx={{ display: 'flex', alignItems: 'center' }}>
                 <IconEye size={16} color={lastAlert.status === 'closed' ? '#4CAF50' : '#FF9800'} />
                 <Typography variant="body2" sx={{ ml: 1, fontWeight: 'medium' }}>
                   Estado: {lastAlert.status === 'closed' ? 'Cerrada' : 'Pendiente'}
                 </Typography>
               </Box>
             </Box>
          </>
        ) : (
          <Box sx={{ textAlign: 'center', py: 4 }}>
            <IconAlertTriangle size={48} color="#ccc" />
            <Typography variant="body2" sx={{ color: 'text.secondary', mt: 2 }}>
              No hay alertas registradas
            </Typography>
          </Box>
        )}

        {/* Summary */}
        {alerts.length > 0 && (
          <Box sx={{
            mt: 3,
            pt: 2,
            borderTop: '1px solid #e0e0e0'
          }}>
            <Typography variant="body2" sx={{ color: 'text.secondary', mb: 1 }}>
              Resumen de alertas:
            </Typography>
            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
              <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                Total: {alerts.length}
              </Typography>
                             <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                 Críticas: {alerts.filter(a => a.critical).length}
               </Typography>
               <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                 Pendientes: {alerts.filter(a => a.status !== 'closed').length}
               </Typography>
            </Box>
          </Box>
        )}
      </CardContent>
    </Card>
  );
};

export default LastAlert;
