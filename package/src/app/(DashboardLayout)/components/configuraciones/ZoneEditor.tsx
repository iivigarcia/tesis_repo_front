import React, { useState } from 'react';
import { 
  Card, 
  CardContent, 
  Typography, 
  Box, 
  TextField, 
  FormControl, 
  InputLabel, 
  Select, 
  MenuItem, 
  Button, 
  Chip, 
  Divider,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  IconButton,
  Alert,
  Skeleton
} from '@mui/material';
import { 
  IconSettings, 
  IconMapPin, 
  IconClock, 
  IconEdit, 
  IconTrash,
  IconSave,
  IconX
} from '@tabler/icons-react';
import { useZones } from '@/hooks';

const ZoneEditor = () => {
  const { zones, loading } = useZones();
  const [selectedZone, setSelectedZone] = useState<any>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState({
    name: '',
    status: 'pending' as 'patrolled' | 'pending'
  });

  // Función para formatear la fecha
  const formatDate = (timestamp: any) => {
    if (!timestamp) return 'Nunca';
    const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
    return date.toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Función para calcular el área aproximada de la zona
  const calculateArea = (bounds: any[]) => {
    if (!bounds || bounds.length < 3) return 0;
    
    // Algoritmo simple para calcular área de polígono
    let area = 0;
    for (let i = 0; i < bounds.length; i++) {
      const j = (i + 1) % bounds.length;
      area += bounds[i].latitude * bounds[j].longitude;
      area -= bounds[j].latitude * bounds[i].longitude;
    }
    return Math.abs(area) / 2;
  };

  // Función para seleccionar zona
  const selectZone = (zone: any) => {
    setSelectedZone(zone);
    setEditData({
      name: zone.name,
      status: zone.status
    });
    setIsEditing(false);
  };

  // Función para iniciar edición
  const startEdit = () => {
    setIsEditing(true);
  };

  // Función para cancelar edición
  const cancelEdit = () => {
    setEditData({
      name: selectedZone.name,
      status: selectedZone.status
    });
    setIsEditing(false);
  };

  // Función para guardar cambios
  const saveChanges = async () => {
    // Aquí se implementaría la lógica para guardar los cambios
    console.log('Guardando cambios:', editData);
    setIsEditing(false);
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
            <IconSettings size={24} color="#5D87FF" />
            <Typography variant="h6" sx={{ ml: 1, fontWeight: 'bold' }}>
              Editor de Zonas
            </Typography>
          </Box>
          {[1, 2, 3, 4].map((i) => (
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
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
          <IconSettings size={24} color="#5D87FF" />
          <Typography variant="h6" sx={{ ml: 1, fontWeight: 'bold' }}>
            Editor de Zonas
          </Typography>
        </Box>

        {selectedZone ? (
          <Box>
            {/* Zone Header */}
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
              <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                {selectedZone.name}
              </Typography>
              <Box sx={{ display: 'flex', gap: 1 }}>
                {!isEditing ? (
                  <IconButton size="small" onClick={startEdit}>
                    <IconEdit size={16} />
                  </IconButton>
                ) : (
                  <>
                    <IconButton size="small" onClick={saveChanges} color="primary">
                      <IconSave size={16} />
                    </IconButton>
                    <IconButton size="small" onClick={cancelEdit}>
                      <IconX size={16} />
                    </IconButton>
                  </>
                )}
              </Box>
            </Box>

            {/* Zone Status */}
            <Box sx={{ mb: 3 }}>
              <Chip
                label={selectedZone.status === 'patrolled' ? 'Patrullada' : 'Pendiente'}
                color={selectedZone.status === 'patrolled' ? 'success' : 'warning'}
                size="small"
              />
            </Box>

            {/* Zone Details */}
            <Box sx={{ mb: 3 }}>
              <Typography variant="body2" sx={{ color: 'text.secondary', mb: 2 }}>
                Detalles de la Zona
              </Typography>
              
              <List dense>
                <ListItem>
                  <ListItemIcon>
                    <IconMapPin size={16} />
                  </ListItemIcon>
                  <ListItemText
                    primary="Puntos de límite"
                    secondary={`${selectedZone.bounds?.length || 0} puntos`}
                  />
                </ListItem>
                
                <ListItem>
                  <ListItemIcon>
                    <IconClock size={16} />
                  </ListItemIcon>
                  <ListItemText
                    primary="Última patrulla"
                    secondary={formatDate(selectedZone.lastPatrolledAt)}
                  />
                </ListItem>
              </List>
            </Box>

            <Divider sx={{ my: 2 }} />

            {/* Edit Form */}
            {isEditing ? (
              <Box>
                <Typography variant="body2" sx={{ color: 'text.secondary', mb: 2 }}>
                  Editar Zona
                </Typography>
                
                <TextField
                  fullWidth
                  label="Nombre de la Zona"
                  value={editData.name}
                  onChange={(e) => setEditData(prev => ({ ...prev, name: e.target.value }))}
                  sx={{ mb: 2 }}
                  size="small"
                />
                
                <FormControl fullWidth size="small">
                  <InputLabel>Estado</InputLabel>
                  <Select
                    value={editData.status}
                    onChange={(e) => setEditData(prev => ({ ...prev, status: e.target.value as 'patrolled' | 'pending' }))}
                    label="Estado"
                  >
                    <MenuItem value="pending">Pendiente</MenuItem>
                    <MenuItem value="patrolled">Patrullada</MenuItem>
                  </Select>
                </FormControl>
              </Box>
            ) : (
              <Box>
                <Typography variant="body2" sx={{ color: 'text.secondary', mb: 2 }}>
                  Información de la Zona
                </Typography>
                
                <Box sx={{ mb: 2 }}>
                  <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                    Nombre
                  </Typography>
                  <Typography variant="body2">
                    {selectedZone.name}
                  </Typography>
                </Box>
                
                <Box sx={{ mb: 2 }}>
                  <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                    Estado
                  </Typography>
                  <Typography variant="body2">
                    {selectedZone.status === 'patrolled' ? 'Patrullada' : 'Pendiente'}
                  </Typography>
                </Box>
                
                <Box sx={{ mb: 2 }}>
                  <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                    Área aproximada
                  </Typography>
                  <Typography variant="body2">
                    {calculateArea(selectedZone.bounds).toFixed(2)} km²
                  </Typography>
                </Box>
              </Box>
            )}

            <Divider sx={{ my: 2 }} />

            {/* Actions */}
            <Box sx={{ display: 'flex', gap: 1 }}>
              <Button
                variant="outlined"
                fullWidth
                onClick={() => setSelectedZone(null)}
              >
                Cerrar
              </Button>
              <Button
                variant="outlined"
                color="error"
                fullWidth
                startIcon={<IconTrash size={16} />}
              >
                Eliminar
              </Button>
            </Box>
          </Box>
        ) : (
          <Box>
            <Alert severity="info" sx={{ mb: 3 }}>
              Selecciona una zona del mapa para ver sus detalles y editarla.
            </Alert>
            
            <Typography variant="body2" sx={{ color: 'text.secondary', mb: 2 }}>
              Zonas Disponibles ({zones.length})
            </Typography>
            
            <Box sx={{ maxHeight: 300, overflowY: 'auto' }}>
              {zones.length > 0 ? (
                zones.map((zone) => {
                  const zoneWithId = zone as any;
                  return (
                    <Box
                      key={zoneWithId.id}
                      sx={{
                        p: 2,
                        mb: 1,
                        bgcolor: '#f8f9fa',
                        borderRadius: 2,
                        border: '1px solid #e0e0e0',
                        cursor: 'pointer',
                        '&:hover': {
                          bgcolor: '#e3f2fd'
                        }
                      }}
                      onClick={() => selectZone(zoneWithId)}
                    >
                      <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                        {zone.name}
                      </Typography>
                      <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                        {zone.bounds?.length || 0} puntos • {zone.status === 'patrolled' ? 'Patrullada' : 'Pendiente'}
                      </Typography>
                    </Box>
                  );
                })
              ) : (
                <Box sx={{ textAlign: 'center', py: 4 }}>
                  <IconMapPin size={48} color="#ccc" />
                  <Typography variant="body2" sx={{ color: 'text.secondary', mt: 2 }}>
                    No hay zonas configuradas
                  </Typography>
                </Box>
              )}
            </Box>
          </Box>
        )}
      </CardContent>
    </Card>
  );
};

export default ZoneEditor;
