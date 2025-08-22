import React, { useState, useEffect } from 'react';
import { 
  Card, 
  CardContent, 
  Typography, 
  Box, 
  Chip,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Alert
} from '@mui/material';
import { 
  IconMap, 
  IconDrone, 
  IconMapPin,
  IconSettings,
  IconCheck,
  IconX
} from '@tabler/icons-react';
import { useDrones, useDroneOperations } from '@/hooks';
import { useZones } from '@/hooks';
import { GeoPoint } from 'firebase/firestore';
import dynamic from 'next/dynamic';
import L from 'leaflet';

// Import Leaflet components dynamically to avoid SSR issues
const MapContainer = dynamic(() => import('react-leaflet').then(mod => mod.MapContainer), { ssr: false });
const TileLayer = dynamic(() => import('react-leaflet').then(mod => mod.TileLayer), { ssr: false });
const Marker = dynamic(() => import('react-leaflet').then(mod => mod.Marker), { ssr: false });
const Polygon = dynamic(() => import('react-leaflet').then(mod => mod.Polygon), { ssr: false });

const DronesMap = () => {
  const { drones, loading } = useDrones();
  const { updateDrone, loading: operationsLoading } = useDroneOperations();
  const { zones } = useZones();
  
  const [selectedDrone, setSelectedDrone] = useState<any>(null);
  const [showZoneDialog, setShowZoneDialog] = useState(false);
  const [selectedZoneId, setSelectedZoneId] = useState<string>('');
  const [error, setError] = useState<string | null>(null);

  // Cargar estilos de Leaflet
  useEffect(() => {
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
    link.integrity = 'sha256-p4NxAoJBhIIN+hmNHrzRCf9tD/miZyoHS5obTRR9BMY=';
    link.crossOrigin = '';
    document.head.appendChild(link);

    return () => {
      const existingLink = document.head.querySelector(`link[href="${link.href}"]`);
      if (existingLink) {
        document.head.removeChild(existingLink);
      }
    };
  }, []);

  // Función para obtener el color del estado del drone
  const getDroneStatusColor = (status: string) => {
    switch (status) {
      case 'idle':
        return '#4CAF50';
      case 'offline':
        return '#F44336';
      case 'flying':
        return '#2196F3';
      case 'charging':
        return '#FF9800';
      default:
        return '#9E9E9E';
    }
  };

  // Función para obtener el texto del estado del drone
  const getDroneStatusText = (status: string) => {
    switch (status) {
      case 'idle':
        return 'En Espera';
      case 'offline':
        return 'Desconectado';
      case 'flying':
        return 'Volando';
      case 'charging':
        return 'Mantenimiento';
      default:
        return 'Desconocido';
    }
  };

  // Función para asignar zona al drone
  const assignZoneToDrone = async () => {
    if (!selectedDrone || !selectedZoneId) return;

    try {
      await updateDrone(selectedDrone.id, {
        ...selectedDrone,
        lastZoneId: selectedZoneId
      });
      
      setShowZoneDialog(false);
      setSelectedZoneId('');
      setSelectedDrone(null);
      setError(null);
    } catch (err) {
      setError('Error al asignar la zona al drone');
    }
  };

  // Función para abrir el diálogo de asignación de zona
  const openZoneAssignment = (drone: any) => {
    setSelectedDrone(drone);
    setSelectedZoneId(drone.lastZoneId || '');
    setShowZoneDialog(true);
  };

  // Calcular el centro del mapa basado en las ubicaciones de los drones
  const calculateMapCenter = () => {
    if (drones.length === 0) return [40.7128, -74.0060]; // Nueva York por defecto
    
    const validDrones = drones.filter(drone => drone.lastLocation);
    if (validDrones.length === 0) return [40.7128, -74.0060];
    
    const totalLat = validDrones.reduce((sum, drone) => sum + drone.lastLocation.latitude, 0);
    const totalLng = validDrones.reduce((sum, drone) => sum + drone.lastLocation.longitude, 0);
    
    return [totalLat / validDrones.length, totalLng / validDrones.length];
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
              Ubicación de Drones
            </Typography>
          </Box>
          <Box sx={{
            height: 400,
            bgcolor: '#f8f9fa',
            borderRadius: 2,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <Typography variant="body2" sx={{ color: 'text.secondary' }}>
              Cargando mapa...
            </Typography>
          </Box>
        </CardContent>
      </Card>
    );
  }

  const mapCenter = calculateMapCenter();

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
              Ubicación de Drones
            </Typography>
          </Box>
          <Chip 
            label={`${drones.filter(d => d.lastLocation).length}/${drones.length} drones con ubicación`}
            color="primary"
            size="small"
          />
        </Box>

        {/* Real Map */}
        <Box
          sx={{
            position: 'relative',
            height: 400,
            borderRadius: 2,
            border: '2px solid #e0e0e0',
            overflow: 'hidden',
            mb: 3,
            '& .leaflet-container': {
              height: '100%',
              width: '100%'
            }
          }}
        >
          <MapContainer
            center={mapCenter as [number, number]}
            zoom={12}
            style={{ height: '100%', width: '100%' }}
          >
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            
            {/* Drone Markers */}
            {drones.map((drone) => {
              if (!drone.lastLocation) return null;
              
              const droneWithId = drone as any;
              const statusColor = getDroneStatusColor(drone.status);
              
              return (
                <Marker
                  key={droneWithId.id}
                  position={[drone.lastLocation.latitude, drone.lastLocation.longitude]}
                  icon={L.divIcon({
                    className: 'custom-drone-marker',
                    html: `
                      <div style="
                        width: 24px;
                        height: 24px;
                        background-color: ${statusColor};
                        border: 3px solid white;
                        border-radius: 50%;
                        box-shadow: 0 2px 8px rgba(0,0,0,0.3);
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        position: relative;
                        cursor: pointer;
                      ">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="white">
                          <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/>
                        </svg>
                        <div style="
                          position: absolute;
                          bottom: -20px;
                          left: 50%;
                          transform: translateX(-50%);
                          background-color: rgba(0,0,0,0.8);
                          color: white;
                          padding: 2px 6px;
                          border-radius: 4px;
                          font-size: 0.7rem;
                          white-space: nowrap;
                        ">${drone.name}</div>
                      </div>
                    `,
                    iconSize: [24, 24],
                    iconAnchor: [12, 12]
                  })}
                />
              );
            })}
            
            {/* Zone Polygons */}
            {zones.map((zone) => {
              const zoneWithId = zone as any;
              if (zone.bounds && zone.bounds.length >= 3) {
                const coordinates = zone.bounds.map((point: GeoPoint) => [point.latitude, point.longitude]);
                const isAssignedToSelectedDrone = selectedDrone && selectedDrone.lastZoneId === zoneWithId.id;
                
                return (
                  <Polygon
                    key={zoneWithId.id}
                    positions={coordinates}
                    pathOptions={{
                      color: isAssignedToSelectedDrone ? '#FF5722' : (zone.status === 'patrolled' ? '#4CAF50' : '#FF9800'),
                      fillColor: isAssignedToSelectedDrone ? '#FF5722' : (zone.status === 'patrolled' ? '#4CAF50' : '#FF9800'),
                      fillOpacity: isAssignedToSelectedDrone ? 0.4 : 0.2,
                      weight: isAssignedToSelectedDrone ? 3 : 2
                    }}
                  />
                );
              }
              return null;
            })}
          </MapContainer>
        </Box>

        {/* Drones List */}
        <Box>
          <Typography variant="h6" sx={{ mb: 2, fontWeight: 'bold' }}>
            Drones Activos ({drones.length})
          </Typography>
          <List sx={{ maxHeight: 300, overflowY: 'auto' }}>
            {drones.map((drone) => {
              const droneWithId = drone as any;
              const statusColor = getDroneStatusColor(drone.status);
              const assignedZone = zones.find(zone => (zone as any).id === drone.lastZoneId);
              
              return (
                <ListItem
                  key={droneWithId.id}
                  sx={{
                    mb: 1,
                    bgcolor: '#f8f9fa',
                    borderRadius: 2,
                    border: '1px solid #e0e0e0'
                  }}
                  secondaryAction={
                    <IconButton
                      edge="end"
                      onClick={() => openZoneAssignment(drone)}
                      disabled={operationsLoading}
                      sx={{ color: 'primary.main' }}
                    >
                      <IconSettings size={16} />
                    </IconButton>
                  }
                >
                  <ListItemIcon>
                    <Box sx={{
                      width: 12,
                      height: 12,
                      borderRadius: '50%',
                      bgcolor: statusColor
                    }} />
                  </ListItemIcon>
                  <ListItemText
                    primary={
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                          {drone.name}
                        </Typography>
                        <Chip
                          label={getDroneStatusText(drone.status)}
                          size="small"
                          sx={{
                            bgcolor: statusColor,
                            color: 'white',
                            fontSize: '0.6rem',
                            height: 20
                          }}
                        />
                      </Box>
                    }
                    secondary={
                      <Box>
                        <Typography variant="caption" sx={{ color: 'text.secondary', display: 'block' }}>
                          {drone.lastLocation ? 
                            `${drone.lastLocation.latitude.toFixed(4)}, ${drone.lastLocation.longitude.toFixed(4)}` : 
                            'Sin ubicación'
                          }
                        </Typography>
                        <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                          Zona asignada: {assignedZone ? assignedZone.name : 'Ninguna'}
                        </Typography>
                      </Box>
                    }
                  />
                </ListItem>
              );
            })}
          </List>
        </Box>

        {/* Zone Assignment Dialog */}
        <Dialog open={showZoneDialog} onClose={() => setShowZoneDialog(false)} maxWidth="sm" fullWidth>
          <DialogTitle>
            Asignar Zona a Drone
          </DialogTitle>
          <DialogContent>
            <Box sx={{ pt: 1 }}>
              {selectedDrone && (
                <Box sx={{ mb: 2 }}>
                  <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                    Drone: {selectedDrone.name}
                  </Typography>
                  <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                    Estado: {getDroneStatusText(selectedDrone.status)}
                  </Typography>
                </Box>
              )}
              
              <FormControl fullWidth>
                <InputLabel>Seleccionar Zona</InputLabel>
                <Select
                  value={selectedZoneId}
                  onChange={(e) => setSelectedZoneId(e.target.value)}
                  label="Seleccionar Zona"
                >
                  <MenuItem value="">
                    <em>Sin zona asignada</em>
                  </MenuItem>
                  {zones.map((zone) => {
                    const zoneWithId = zone as any;
                    return (
                      <MenuItem key={zoneWithId.id} value={zoneWithId.id}>
                        {zone.name} ({zone.status === 'patrolled' ? 'Patrullada' : 'Pendiente'})
                      </MenuItem>
                    );
                  })}
                </Select>
              </FormControl>
              
              {error && (
                <Alert severity="error" sx={{ mt: 2 }} onClose={() => setError(null)}>
                  {error}
                </Alert>
              )}
            </Box>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setShowZoneDialog(false)}>
              Cancelar
            </Button>
            <Button
              onClick={assignZoneToDrone}
              variant="contained"
              disabled={operationsLoading}
              startIcon={<IconCheck size={16} />}
            >
              Asignar
            </Button>
          </DialogActions>
        </Dialog>
      </CardContent>
    </Card>
  );
};

export default DronesMap;
