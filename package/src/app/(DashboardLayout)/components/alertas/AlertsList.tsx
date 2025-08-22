import React, { useState } from 'react';
import { 
  Card, 
  CardContent, 
  Typography, 
  Box, 
  Chip,
  Skeleton,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  IconButton,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Pagination
} from '@mui/material';
import { 
  IconAlertTriangle, 
  IconAlertCircle,
  IconAlertOctagon,
  IconSearch,
  IconFilter,
  IconClock,
  IconMapPin,
  IconEye
} from '@tabler/icons-react';
import { useAlerts } from '@/hooks';
import { useZones } from '@/hooks';

const AlertsList = () => {
  const { alerts, loading } = useAlerts();
  const { zones } = useZones();
  
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [criticalFilter, setCriticalFilter] = useState('all');
  const [page, setPage] = useState(1);
  const itemsPerPage = 10;

  // Función para obtener el color de la severidad
  const getSeverityColor = (critical: boolean) => {
    return critical ? '#F44336' : '#FF9800';
  };

  // Función para obtener el texto de la severidad
  const getSeverityText = (critical: boolean) => {
    return critical ? 'Crítico' : 'No Crítico';
  };

  // Función para obtener el icono de la severidad
  const getSeverityIcon = (critical: boolean) => {
    return critical ? IconAlertOctagon : IconAlertTriangle;
  };

  // Función para obtener el color del estado
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'new':
        return '#F44336';
      case 'ack':
        return '#FF9800';
      case 'closed':
        return '#4CAF50';
      default:
        return '#9E9E9E';
    }
  };

  // Función para obtener el texto del estado
  const getStatusText = (status: string) => {
    switch (status) {
      case 'new':
        return 'Nueva';
      case 'ack':
        return 'Reconocida';
      case 'closed':
        return 'Cerrada';
      default:
        return 'Desconocido';
    }
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

  // Filtrar alertas
  const filteredAlerts = alerts.filter(alert => {
    const matchesSearch = alert.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         getZoneName(alert.zoneId).toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || alert.status === statusFilter;
    const matchesCritical = criticalFilter === 'all' || 
                           (criticalFilter === 'critical' && alert.critical) ||
                           (criticalFilter === 'nonCritical' && !alert.critical);
    
    return matchesSearch && matchesStatus && matchesCritical;
  });

  // Ordenar por fecha (más recientes primero)
  const sortedAlerts = filteredAlerts.sort((a, b) => {
    const dateA = a.detectedAt.toDate ? a.detectedAt.toDate() : new Date(a.detectedAt);
    const dateB = b.detectedAt.toDate ? b.detectedAt.toDate() : new Date(b.detectedAt);
    return dateB.getTime() - dateA.getTime();
  });

  // Paginación
  const totalPages = Math.ceil(sortedAlerts.length / itemsPerPage);
  const paginatedAlerts = sortedAlerts.slice((page - 1) * itemsPerPage, page * itemsPerPage);

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
              Lista de Alertas
            </Typography>
          </Box>
          {[1, 2, 3, 4, 5].map((i) => (
            <Box key={i} sx={{ mb: 2 }}>
              <Skeleton variant="text" width="60%" height={20} />
              <Skeleton variant="text" width="40%" height={16} />
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
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 3 }}>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <IconAlertTriangle size={24} color="#FF5722" />
            <Typography variant="h6" sx={{ ml: 1, fontWeight: 'bold' }}>
              Lista de Alertas
            </Typography>
          </Box>
          <Chip 
            label={`${alerts.length} alertas totales`}
            color="primary"
            size="small"
          />
        </Box>

        {/* Filters */}
        <Box sx={{ display: 'flex', gap: 2, mb: 3, flexWrap: 'wrap' }}>
          <TextField
            size="small"
            placeholder="Buscar por tipo o zona..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            InputProps={{
              startAdornment: <IconSearch size={16} />,
            }}
            sx={{ minWidth: 200 }}
          />
          
          <FormControl size="small" sx={{ minWidth: 120 }}>
            <InputLabel>Estado</InputLabel>
            <Select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              label="Estado"
            >
              <MenuItem value="all">Todos</MenuItem>
              <MenuItem value="new">Nuevas</MenuItem>
              <MenuItem value="ack">Reconocidas</MenuItem>
              <MenuItem value="closed">Cerradas</MenuItem>
            </Select>
          </FormControl>

          <FormControl size="small" sx={{ minWidth: 120 }}>
            <InputLabel>Severidad</InputLabel>
            <Select
              value={criticalFilter}
              onChange={(e) => setCriticalFilter(e.target.value)}
              label="Severidad"
            >
              <MenuItem value="all">Todas</MenuItem>
              <MenuItem value="critical">Críticas</MenuItem>
              <MenuItem value="nonCritical">No Críticas</MenuItem>
            </Select>
          </FormControl>
        </Box>

        {/* Alerts List */}
        {paginatedAlerts.length > 0 ? (
          <List sx={{ maxHeight: 600, overflowY: 'auto' }}>
            {paginatedAlerts.map((alert, index) => {
              const alertWithId = alert as any;
              const SeverityIcon = getSeverityIcon(alert.critical);
              
              return (
                <ListItem
                  key={alertWithId.id}
                  sx={{
                    mb: 1,
                    bgcolor: '#f8f9fa',
                    borderRadius: 2,
                    border: '1px solid #e0e0e0',
                    '&:hover': {
                      bgcolor: '#f0f0f0'
                    }
                  }}
                >
                  <ListItemIcon>
                    <SeverityIcon size={20} color={getSeverityColor(alert.critical)} />
                  </ListItemIcon>
                  
                  <ListItemText
                    primary={
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                        <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                          {getTypeText(alert.type)}
                        </Typography>
                        <Chip
                          label={getSeverityText(alert.critical)}
                          size="small"
                          sx={{
                            bgcolor: getSeverityColor(alert.critical),
                            color: 'white',
                            fontSize: '0.6rem',
                            height: 18
                          }}
                        />
                        <Chip
                          label={getStatusText(alert.status)}
                          size="small"
                          sx={{
                            bgcolor: getStatusColor(alert.status),
                            color: 'white',
                            fontSize: '0.6rem',
                            height: 18
                          }}
                        />
                      </Box>
                    }
                    secondary={
                      <Box>
                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 0.5 }}>
                          <IconMapPin size={14} color="#666" />
                          <Typography variant="caption" sx={{ ml: 0.5, color: 'text.secondary' }}>
                            {getZoneName(alert.zoneId)}
                          </Typography>
                        </Box>
                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 0.5 }}>
                          <IconClock size={14} color="#666" />
                          <Typography variant="caption" sx={{ ml: 0.5, color: 'text.secondary' }}>
                            {formatDate(alert.detectedAt)} ({getTimeAgo(alert.detectedAt)})
                          </Typography>
                        </Box>
                        {alert.location && (
                          <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                            Ubicación: {alert.location.latitude?.toFixed(4)}, {alert.location.longitude?.toFixed(4)}
                          </Typography>
                        )}
                      </Box>
                    }
                  />
                  
                  <IconButton size="small" sx={{ color: 'primary.main' }}>
                    <IconEye size={16} />
                  </IconButton>
                </ListItem>
              );
            })}
          </List>
        ) : (
          <Box sx={{ textAlign: 'center', py: 4 }}>
            <IconAlertTriangle size={48} color="#ccc" />
            <Typography variant="body2" sx={{ color: 'text.secondary', mt: 2 }}>
              {filteredAlerts.length === 0 && alerts.length > 0 
                ? 'No hay alertas que coincidan con los filtros' 
                : 'No hay alertas registradas'
              }
            </Typography>
          </Box>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <Box sx={{ display: 'flex', justifyContent: 'center', mt: 3 }}>
            <Pagination
              count={totalPages}
              page={page}
              onChange={(_, value) => setPage(value)}
              color="primary"
              size="small"
            />
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
            <Box sx={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: 1 }}>
              <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                Total: {alerts.length}
              </Typography>
              <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                Críticas: {alerts.filter(a => a.critical).length}
              </Typography>
              <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                Nuevas: {alerts.filter(a => a.status === 'new').length}
              </Typography>
              <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                Cerradas: {alerts.filter(a => a.status === 'closed').length}
              </Typography>
            </Box>
          </Box>
        )}
      </CardContent>
    </Card>
  );
};

export default AlertsList;
