'use client'
import React, { useState, useEffect } from 'react';
import { 
  Card, 
  CardContent, 
  Typography, 
  Box, 
  Skeleton,
  Chip,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  IconButton
} from '@mui/material';
import { 
  IconMap, 
  IconPaw,
  IconMapPin,
  IconClock,
  IconEye
} from '@tabler/icons-react';
import { useTodayAnimals } from '@/hooks';
import { useZones } from '@/hooks';

// Dynamic imports for Leaflet
const AnimalsMap = () => {
  const { animals, loading } = useTodayAnimals();
  const { zones } = useZones();
  const [MapContainer, setMapContainer] = useState<any>(null);
  const [TileLayer, setTileLayer] = useState<any>(null);
  const [Marker, setMarker] = useState<any>(null);
  const [Popup, setPopup] = useState<any>(null);
  const [L, setL] = useState<any>(null);

  useEffect(() => {
    // Dynamic imports
    const loadLeaflet = async () => {
      const L = await import('leaflet');
      const { MapContainer, TileLayer, Marker, Popup } = await import('react-leaflet');
      
      setL(L);
      setMapContainer(MapContainer);
      setTileLayer(TileLayer);
      setMarker(Marker);
      setPopup(Popup);
    };

    loadLeaflet();
  }, []);

  // Función para obtener el nombre del tipo de animal
  const getAnimalTypeName = (type: string) => {
    switch (type.toLowerCase()) {
      case 'sheep':
        return 'Oveja';
      case 'cow':
        return 'Vaca';
      case 'horse':
        return 'Caballo';
      default:
        return type.charAt(0).toUpperCase() + type.slice(1);
    }
  };

  // Función para obtener el color del tipo de animal
  const getAnimalTypeColor = (type: string) => {
    switch (type.toLowerCase()) {
      case 'sheep':
        return '#4CAF50';
      case 'cow':
        return '#FF9800';
      case 'horse':
        return '#2196F3';
      default:
        return '#9E9E9E';
    }
  };

  // Función para obtener el nombre de la zona
  const getZoneName = (zoneId: string) => {
    const zone = zones.find(z => (z as any).id === zoneId);
    return zone ? zone.name : 'Zona desconocida';
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
              Ubicación de Animales
            </Typography>
          </Box>
          <Skeleton variant="rectangular" height={300} sx={{ borderRadius: 2 }} />
        </CardContent>
      </Card>
    );
  }

  if (!MapContainer || !L) {
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
              Ubicación de Animales
            </Typography>
          </Box>
          <Box sx={{ textAlign: 'center', py: 4 }}>
            <IconMap size={48} color="#ccc" />
            <Typography variant="body2" sx={{ color: 'text.secondary', mt: 2 }}>
              Cargando mapa...
            </Typography>
          </Box>
        </CardContent>
      </Card>
    );
  }

  // Filtrar animales con coordenadas válidas
  const animalsWithLocation = animals.filter(animal => 
    animal.geopoint && 
    animal.geopoint.latitude && 
    animal.geopoint.longitude
  );

  // Calcular el centro del mapa
  const center = animalsWithLocation.length > 0 
    ? [animalsWithLocation[0].geopoint.latitude, animalsWithLocation[0].geopoint.longitude]
    : [-34.7043, -58.3891]; // Coordenadas por defecto

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
              Ubicación de Animales
            </Typography>
          </Box>
          <Chip 
            label={`${animalsWithLocation.length} ubicaciones`}
            color="primary"
            size="small"
          />
        </Box>

        {animalsWithLocation.length > 0 ? (
          <Box sx={{ height: 400, borderRadius: 2, overflow: 'hidden' }}>
            <MapContainer
              center={center as [number, number]}
              zoom={13}
              style={{ height: '100%', width: '100%' }}
            >
              <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              />
              
              {animalsWithLocation.map((animal, index) => (
                <Marker
                  key={index}
                  position={[animal.geopoint.latitude, animal.geopoint.longitude]}
                  icon={L.divIcon({
                    className: 'custom-marker',
                    html: `
                      <div style="
                        background-color: ${getAnimalTypeColor(animal.type)};
                        width: 20px;
                        height: 20px;
                        border-radius: 50%;
                        border: 2px solid white;
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        color: white;
                        font-size: 10px;
                        font-weight: bold;
                        box-shadow: 0 2px 4px rgba(0,0,0,0.3);
                      ">
                        ${getAnimalTypeName(animal.type).charAt(0)}
                      </div>
                    `,
                    iconSize: [20, 20],
                    iconAnchor: [10, 10]
                  })}
                >
                  <Popup>
                    <Box sx={{ p: 1, minWidth: 200 }}>
                      <Typography variant="subtitle2" sx={{ fontWeight: 'bold', mb: 1 }}>
                        {getAnimalTypeName(animal.type)}
                      </Typography>
                      <Typography variant="body2" sx={{ mb: 0.5 }}>
                        <strong>Zona:</strong> {getZoneName(animal.zoneId)}
                      </Typography>
                      <Typography variant="body2" sx={{ mb: 0.5 }}>
                        <strong>Detectado:</strong> {formatDate(animal.detectedAt)}
                      </Typography>
                      <Typography variant="body2" sx={{ mb: 0.5 }}>
                        <strong>Hace:</strong> {getTimeAgo(animal.detectedAt)}
                      </Typography>
                      <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                        {animal.geopoint.latitude?.toFixed(6)}°, {animal.geopoint.longitude?.toFixed(6)}°
                      </Typography>
                    </Box>
                  </Popup>
                </Marker>
              ))}
            </MapContainer>
          </Box>
        ) : (
          <Box sx={{ textAlign: 'center', py: 4 }}>
            <IconMap size={48} color="#ccc" />
            <Typography variant="body2" sx={{ color: 'text.secondary', mt: 2 }}>
              No hay animales con ubicación disponible
            </Typography>
          </Box>
        )}

        {/* Animals List */}
        {animalsWithLocation.length > 0 && (
          <Box sx={{ mt: 3 }}>
            <Typography variant="body2" sx={{ fontWeight: 'bold', mb: 2 }}>
              Animales detectados:
            </Typography>
            <List sx={{ maxHeight: 200, overflowY: 'auto' }}>
              {animalsWithLocation.slice(0, 5).map((animal, index) => (
                <ListItem key={index} sx={{ px: 0, py: 0.5 }}>
                  <ListItemIcon sx={{ minWidth: 32 }}>
                    <Box
                      sx={{
                        width: 16,
                        height: 16,
                        borderRadius: '50%',
                        bgcolor: getAnimalTypeColor(animal.type),
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                      }}
                    >
                      <Typography variant="caption" sx={{ color: 'white', fontSize: '0.6rem', fontWeight: 'bold' }}>
                        {getAnimalTypeName(animal.type).charAt(0)}
                      </Typography>
                    </Box>
                  </ListItemIcon>
                  <ListItemText
                    primary={
                      <Typography variant="body2" sx={{ fontWeight: 'medium' }}>
                        {getAnimalTypeName(animal.type)} - {getZoneName(animal.zoneId)}
                      </Typography>
                    }
                    secondary={
                      <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                        {getTimeAgo(animal.detectedAt)}
                      </Typography>
                    }
                  />
                </ListItem>
              ))}
              {animalsWithLocation.length > 5 && (
                <ListItem sx={{ px: 0, py: 0.5 }}>
                  <ListItemText
                    secondary={
                      <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                        Y {animalsWithLocation.length - 5} más...
                      </Typography>
                    }
                  />
                </ListItem>
              )}
            </List>
          </Box>
        )}
      </CardContent>
    </Card>
  );
};

export default AnimalsMap;
