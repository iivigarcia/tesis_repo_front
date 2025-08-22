import React, { useState, useRef, useEffect } from 'react';
import { 
  Card, 
  CardContent, 
  Typography, 
  Box, 
  Button, 
  IconButton, 
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Alert,
  Skeleton
} from '@mui/material';
import { 
  IconMap, 
  IconPlus, 
  IconEdit, 
  IconTrash, 
  IconDeviceFloppy, 
  IconX,
  IconMapPin
} from '@tabler/icons-react';
import { useZones, useZoneOperations } from '@/hooks';
import { GeoPoint } from 'firebase/firestore';
import dynamic from 'next/dynamic';

// Import Leaflet components dynamically to avoid SSR issues
const MapContainer = dynamic(() => import('react-leaflet').then(mod => mod.MapContainer), { ssr: false });
const TileLayer = dynamic(() => import('react-leaflet').then(mod => mod.TileLayer), { ssr: false });
const Marker = dynamic(() => import('react-leaflet').then(mod => mod.Marker), { ssr: false });
const Polygon = dynamic(() => import('react-leaflet').then(mod => mod.Polygon), { ssr: false });

// Componente para manejar eventos del mapa
const MapClickHandler = ({ onMapClick, isDrawing }: { onMapClick: (event: any) => void; isDrawing: boolean }) => {
  const { useMapEvents } = require('react-leaflet');
  useMapEvents({
    click: (e: any) => {
      if (isDrawing) {
        onMapClick(e);
      }
    },
  });
  return null;
};

interface MapPoint {
  id: string;
  lat: number;
  lng: number;
}

interface ZoneFormData {
  name: string;
  status: 'patrolled' | 'pending';
  bounds: GeoPoint[];
}

const ZonesManager = () => {
  const { zones, loading } = useZones();
  const { createZone, updateZone, deleteZone, loading: operationsLoading } = useZoneOperations();
  
  const [selectedZone, setSelectedZone] = useState<any>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [mapPoints, setMapPoints] = useState<MapPoint[]>([]);
  const [isDrawing, setIsDrawing] = useState(false);
  const [showZoneDialog, setShowZoneDialog] = useState(false);
  const [zoneFormData, setZoneFormData] = useState<ZoneFormData>({
    name: '',
    status: 'pending',
    bounds: []
  });
  const [error, setError] = useState<string | null>(null);
  const [mapLoaded, setMapLoaded] = useState(false);
  const mapRef = useRef<any>(null);

  // Función para convertir GeoPoints a puntos del mapa
  const geoPointsToMapPoints = (geoPoints: GeoPoint[]): MapPoint[] => {
    return geoPoints.map((point, index) => ({
      id: `point-${index}`,
      lat: point.latitude,
      lng: point.longitude
    }));
  };

  // Función para convertir puntos del mapa a GeoPoints
  const mapPointsToGeoPoints = (points: MapPoint[]): GeoPoint[] => {
    return points.map(point => new GeoPoint(point.lat, point.lng));
  };

  // Función para manejar clics en el mapa
  const handleMapClick = (event: any) => {
    if (!isDrawing) return;

    const { lat, lng } = event.latlng;
    const newPoint: MapPoint = {
      id: `point-${Date.now()}`,
      lat,
      lng
    };

    setMapPoints(prev => [...prev, newPoint]);
  };

  // Función para eliminar un punto
  const removePoint = (pointId: string) => {
    setMapPoints(prev => prev.filter(point => point.id !== pointId));
  };

  // Función para limpiar el mapa
  const clearMap = () => {
    setMapPoints([]);
    setIsDrawing(false);
    setSelectedZone(null);
  };

  // Función para crear nueva zona
  const startNewZone = () => {
    setSelectedZone(null);
    setMapPoints([]);
    setZoneFormData({
      name: '',
      status: 'pending',
      bounds: []
    });
    setIsEditing(false);
    setIsDrawing(true);
  };

  // Función para guardar zona
  const saveZone = async () => {
    if (mapPoints.length < 3) {
      setError('Se necesitan al menos 3 puntos para crear una zona');
      return;
    }

    if (!zoneFormData.name.trim()) {
      setError('El nombre de la zona es requerido');
      return;
    }

    try {
      const geoPoints = mapPointsToGeoPoints(mapPoints);
      const zoneData = {
        ...zoneFormData,
        bounds: geoPoints,
        lastPatrolledAt: null
      };

      if (isEditing && selectedZone) {
        await updateZone(selectedZone.id, zoneData);
      } else {
        await createZone(zoneData);
      }

      setShowZoneDialog(false);
      clearMap();
      setError(null);
    } catch (err) {
      setError('Error al guardar la zona');
    }
  };

  // Función para eliminar zona
  const handleDeleteZone = async (zoneId: string) => {
    if (window.confirm('¿Estás seguro de que quieres eliminar esta zona?')) {
      try {
        await deleteZone(zoneId);
      } catch (err) {
        setError('Error al eliminar la zona');
      }
    }
  };

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
              Gestor de Zonas
            </Typography>
          </Box>
          <Skeleton variant="rectangular" height={400} sx={{ borderRadius: 2 }} />
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
              Gestor de Zonas
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', gap: 1 }}>
            <Button
              variant="outlined"
              startIcon={<IconPlus size={16} />}
              onClick={startNewZone}
              disabled={operationsLoading}
            >
              Nueva Zona
            </Button>
            {isDrawing && (
              <Button
                variant="contained"
                startIcon={<IconDeviceFloppy size={16} />}
                onClick={() => setShowZoneDialog(true)}
                disabled={mapPoints.length < 3}
              >
                Guardar Zona
              </Button>
            )}
            {(isDrawing || isEditing) && (
              <Button
                variant="outlined"
                startIcon={<IconX size={16} />}
                onClick={clearMap}
              >
                Cancelar
              </Button>
            )}
          </Box>
        </Box>

        {/* Status Bar */}
        <Box sx={{ mb: 2 }}>
          {isDrawing && (
            <Alert severity="info" sx={{ mb: 2 }}>
              Modo dibujo activo. Haz clic en el mapa para agregar puntos a la nueva zona.
            </Alert>
          )}
          {isEditing && (
            <Alert severity="warning" sx={{ mb: 2 }}>
              Editando zona: {selectedZone?.name}
            </Alert>
          )}
          {error && (
            <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError(null)}>
              {error}
            </Alert>
          )}
        </Box>

        {/* Real Map */}
        <Box
          sx={{
            position: 'relative',
            height: 400,
            borderRadius: 2,
            border: '2px solid #e0e0e0',
            overflow: 'hidden',
            '& .leaflet-container': {
              height: '100%',
              width: '100%'
            }
          }}
        >
          <MapContainer
            center={[40.7128, -74.0060]} // Nueva York como centro por defecto
            zoom={10}
            style={{ height: '100%', width: '100%' }}
            ref={mapRef}
            whenReady={() => setMapLoaded(true)}
          >
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            
            {/* Event handler for map clicks */}
            <MapClickHandler onMapClick={handleMapClick} isDrawing={isDrawing} />
            
            {/* Drawing Points */}
            {mapPoints.map((point, index) => (
              <Marker
                key={point.id}
                position={[point.lat, point.lng]}
                eventHandlers={{
                  click: () => removePoint(point.id)
                }}
              />
            ))}
            
            {/* Existing Zones */}
            {zones.map((zone) => {
              const zoneWithId = zone as any;
              if (zone.bounds && zone.bounds.length >= 3) {
                const coordinates = zone.bounds.map((point: GeoPoint) => [point.latitude, point.longitude]);
                return (
                  <Polygon
                    key={zoneWithId.id}
                    positions={coordinates}
                    pathOptions={{
                      color: zone.status === 'patrolled' ? '#4CAF50' : '#FF9800',
                      fillColor: zone.status === 'patrolled' ? '#4CAF50' : '#FF9800',
                      fillOpacity: 0.2,
                      weight: 2
                    }}
                  />
                );
              }
              return null;
            })}
          </MapContainer>
        </Box>

        {/* Zones List */}
        <Box sx={{ mt: 3 }}>
          <Typography variant="h6" sx={{ mb: 2, fontWeight: 'bold' }}>
            Zonas Configuradas ({zones.length})
          </Typography>
          <Box sx={{ maxHeight: 200, overflowY: 'auto' }}>
            {zones.length > 0 ? (
              zones.map((zone) => {
                const zoneWithId = zone as any;
                return (
                  <Box
                    key={zoneWithId.id}
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      p: 2,
                      mb: 1,
                      bgcolor: '#f8f9fa',
                      borderRadius: 2,
                      border: '1px solid #e0e0e0'
                    }}
                  >
                    <Box sx={{ flex: 1 }}>
                      <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                        {zone.name}
                      </Typography>
                      <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                        {zone.bounds?.length || 0} puntos • Última patrulla: {zone.lastPatrolledAt ? 'Hace 2h' : 'Nunca'}
                      </Typography>
                    </Box>
                    <Chip
                      label={zone.status === 'patrolled' ? 'Patrullada' : 'Pendiente'}
                      color={zone.status === 'patrolled' ? 'success' : 'warning'}
                      size="small"
                      sx={{ mr: 1 }}
                    />
                    <IconButton
                      size="small"
                      onClick={() => handleDeleteZone(zoneWithId.id)}
                      disabled={operationsLoading}
                      sx={{ color: 'error.main' }}
                    >
                      <IconTrash size={16} />
                    </IconButton>
                  </Box>
                );
              })
            ) : (
              <Box sx={{ textAlign: 'center', py: 4 }}>
                <IconMap size={48} color="#ccc" />
                <Typography variant="body2" sx={{ color: 'text.secondary', mt: 2 }}>
                  No hay zonas configuradas
                </Typography>
              </Box>
            )}
          </Box>
        </Box>

        {/* Zone Dialog */}
        <Dialog open={showZoneDialog} onClose={() => setShowZoneDialog(false)} maxWidth="sm" fullWidth>
          <DialogTitle>
            {isEditing ? 'Editar Zona' : 'Crear Nueva Zona'}
          </DialogTitle>
          <DialogContent>
            <Box sx={{ pt: 1 }}>
              <TextField
                fullWidth
                label="Nombre de la Zona"
                value={zoneFormData.name}
                onChange={(e) => setZoneFormData(prev => ({ ...prev, name: e.target.value }))}
                sx={{ mb: 2 }}
              />
              <FormControl fullWidth>
                <InputLabel>Estado</InputLabel>
                <Select
                  value={zoneFormData.status}
                  onChange={(e) => setZoneFormData(prev => ({ ...prev, status: e.target.value as 'patrolled' | 'pending' }))}
                  label="Estado"
                >
                  <MenuItem value="pending">Pendiente</MenuItem>
                  <MenuItem value="patrolled">Patrullada</MenuItem>
                </Select>
              </FormControl>
              <Box sx={{ mt: 2 }}>
                <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                  Puntos seleccionados: {mapPoints.length}
                </Typography>
                {mapPoints.length < 3 && (
                  <Typography variant="caption" sx={{ color: 'error.main' }}>
                    Se necesitan al menos 3 puntos para crear una zona
                  </Typography>
                )}
              </Box>
            </Box>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setShowZoneDialog(false)}>
              Cancelar
            </Button>
            <Button
              onClick={saveZone}
              variant="contained"
              disabled={mapPoints.length < 3 || !zoneFormData.name.trim() || operationsLoading}
            >
              {isEditing ? 'Actualizar' : 'Crear'}
            </Button>
          </DialogActions>
        </Dialog>
      </CardContent>
    </Card>
  );
};

export default ZonesManager;