'use client'
import React, { useState, useEffect } from 'react';
import { 
  Card, 
  CardContent, 
  Typography, 
  Box, 
  Skeleton,
  Grid,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button
} from '@mui/material';
import { 
  IconSearch, 
  IconFilter,
  IconMapPin,
  IconClock,
  IconPaw,
  IconEye,
  IconZoom
} from '@tabler/icons-react';
import { useTodayAnimals } from '@/hooks';
import { useZones } from '@/hooks';
import { getDownloadURL, ref } from 'firebase/storage';
import { storage } from '@/lib/firebase';

const AnimalsGrid = () => {
  const { animals, loading } = useTodayAnimals();
  const { zones } = useZones();
  
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');
  const [zoneFilter, setZoneFilter] = useState('all');
  const [selectedAnimal, setSelectedAnimal] = useState<any>(null);
  const [imageDialogOpen, setImageDialogOpen] = useState(false);
  const [imageUrls, setImageUrls] = useState<Record<string, string>>({});

  // Procesar URLs de imágenes cuando cambien los animales
  useEffect(() => {
    const processImageUrls = async () => {
      if (!animals || animals.length === 0) return;
      
      const newImageUrls: Record<string, string> = {};
      
      for (const animal of animals) {
        if (animal.imageUrl) {
          const processedUrl = await getImageUrl(animal.imageUrl);
          if (processedUrl) {
            newImageUrls[animal.imageUrl] = processedUrl;
          }
        }
      }
      
      if (Object.keys(newImageUrls).length > 0) {
        setImageUrls(prev => ({ ...prev, ...newImageUrls }));
      }
    };

    processImageUrls();
  }, [animals]);

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

  // Función para formatear la fecha
  const formatDate = (timestamp: any) => {
    if (!timestamp) return 'N/A';
    const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
    return date.toLocaleString('es-ES', {
      day: '2-digit',
      month: 'long',
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

  // Función para convertir URL de Firebase Storage a URL de descarga
  const getImageUrl = async (imageUrl: string) => {
    if (!imageUrl) return '';
    
    // Si ya es una URL HTTP/HTTPS, devolverla tal como está
    if (imageUrl.startsWith('http://') || imageUrl.startsWith('https://')) {
      return imageUrl;
    }
    
    // Si es una URL de Firebase Storage (gs://), usar el SDK
    if (imageUrl.startsWith('gs://')) {
      try {
        // Extraer el path del bucket
        const path = imageUrl.replace('gs://aerosentinel-f6d8f.firebasestorage.app/', '');
        // Crear referencia al archivo
        const storageRef = ref(storage, path);
        // Obtener URL de descarga
        const downloadURL = await getDownloadURL(storageRef);
        return downloadURL;
      } catch (error) {
        console.error('Error getting download URL:', error);
        // En caso de error, devolver una cadena vacía para que se muestre el icono por defecto
        return '';
      }
    }
    
    return imageUrl;
  };

  // Asegurar que animals sea siempre un array
  const animalsArray = animals || [];
  
  // Filtrar animales
  const filteredAnimals = animalsArray.filter(animal => {
    const matchesSearch = getAnimalTypeName(animal.type).toLowerCase().includes(searchTerm.toLowerCase()) ||
                         getZoneName(animal.zoneId).toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesType = typeFilter === 'all' || animal.type === typeFilter;
    const matchesZone = zoneFilter === 'all' || animal.zoneId === zoneFilter;
    
    return matchesSearch && matchesType && matchesZone;
  });

  // Obtener tipos únicos de animales
  const uniqueTypes = Array.from(new Set(animalsArray.map(animal => animal.type)));

  if (loading) {
    return (
      <Card sx={{
        height: '100%',
        boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
        borderRadius: 2
      }}>
        <CardContent sx={{ p: 3 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                         <IconPaw size={24} color="#4CAF50" />
            <Typography variant="h6" sx={{ ml: 1, fontWeight: 'bold' }}>
              Animales Detectados
            </Typography>
          </Box>
          <Grid container spacing={2}>
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <Grid size={{ xs: 12, sm: 6, md: 4 }} key={i}>
                <Skeleton variant="rectangular" height={200} sx={{ borderRadius: 2 }} />
                <Skeleton variant="text" width="60%" height={20} sx={{ mt: 1 }} />
                <Skeleton variant="text" width="40%" height={16} />
              </Grid>
            ))}
          </Grid>
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      <Card sx={{
        height: '100%',
        boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
        borderRadius: 2
      }}>
        <CardContent sx={{ p: 3 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 3 }}>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <IconPaw size={24} color="#4CAF50" />
              <Typography variant="h6" sx={{ ml: 1, fontWeight: 'bold' }}>
                Animales Detectados
              </Typography>
            </Box>
            <Chip 
              label={`${filteredAnimals.length} animales`}
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
              <InputLabel>Tipo</InputLabel>
              <Select
                value={typeFilter}
                onChange={(e) => setTypeFilter(e.target.value)}
                label="Tipo"
              >
                <MenuItem value="all">Todos</MenuItem>
                {uniqueTypes.map(type => (
                  <MenuItem key={type} value={type}>
                    {getAnimalTypeName(type)}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <FormControl size="small" sx={{ minWidth: 120 }}>
              <InputLabel>Zona</InputLabel>
              <Select
                value={zoneFilter}
                onChange={(e) => setZoneFilter(e.target.value)}
                label="Zona"
              >
                <MenuItem value="all">Todas</MenuItem>
                {zones.map(zone => (
                  <MenuItem key={(zone as any).id} value={(zone as any).id}>
                    {zone.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Box>

          {/* Animals Grid */}
          {filteredAnimals.length > 0 ? (
            <Grid container spacing={2}>
              {filteredAnimals.map((animal, index) => (
                <Grid size={{ xs: 12, sm: 6, md: 4 }} key={index}>
                  <Card
                    sx={{
                      height: '100%',
                      cursor: 'pointer',
                      transition: 'all 0.2s',
                      '&:hover': {
                        transform: 'translateY(-2px)',
                        boxShadow: '0 4px 12px rgba(0,0,0,0.15)'
                      }
                    }}
                    onClick={() => {
                      setSelectedAnimal(animal);
                      setImageDialogOpen(true);
                    }}
                  >
                    {/* Animal Image */}
                    <Box
                      sx={{
                        height: 200,
                        bgcolor: '#f5f5f5',
                        borderRadius: '8px 8px 0 0',
                        position: 'relative',
                        overflow: 'hidden',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                      }}
                    >
                                             {animal.imageUrl ? (
                         <img
                           src={imageUrls[animal.imageUrl]}
                           alt={`${getAnimalTypeName(animal.type)}`}
                          style={{
                            width: '100%',
                            height: '100%',
                            objectFit: 'cover'
                          }}
                          onError={(e) => {
                            // Si la imagen falla al cargar, mostrar el icono por defecto
                            const target = e.target as HTMLImageElement;
                            target.style.display = 'none';
                            target.nextElementSibling?.classList.remove('hidden');
                          }}
                        />
                      ) : (
                        <IconPaw size={48} color="#ccc" className="hidden" />
                      )}
                      <IconButton
                        size="small"
                        sx={{
                          position: 'absolute',
                          top: 8,
                          right: 8,
                          bgcolor: 'rgba(255,255,255,0.8)',
                          '&:hover': { bgcolor: 'rgba(255,255,255,0.9)' }
                        }}
                      >
                        <IconZoom size={16} />
                      </IconButton>
                    </Box>

                    <CardContent sx={{ p: 2 }}>
                      {/* Animal Type */}
                      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1 }}>
                        <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                          {getAnimalTypeName(animal.type)}
                        </Typography>
                        <Chip
                          label={getAnimalTypeName(animal.type)}
                          size="small"
                          sx={{
                            bgcolor: getAnimalTypeColor(animal.type),
                            color: 'white',
                            fontSize: '0.6rem'
                          }}
                        />
                      </Box>

                      {/* Zone */}
                      <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                        <IconMapPin size={14} color="#666" />
                        <Typography variant="body2" sx={{ ml: 0.5, color: 'text.secondary' }}>
                          {getZoneName(animal.zoneId)}
                        </Typography>
                      </Box>

                      {/* Detection Time */}
                      <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                        <IconClock size={14} color="#666" />
                        <Typography variant="caption" sx={{ ml: 0.5, color: 'text.secondary' }}>
                          {getTimeAgo(animal.detectedAt)}
                        </Typography>
                      </Box>

                      {/* Coordinates */}
                      {animal.geopoint && (
                        <Typography variant="caption" sx={{ color: 'text.secondary', display: 'block' }}>
                          {animal.geopoint.latitude?.toFixed(4)}°, {animal.geopoint.longitude?.toFixed(4)}°
                        </Typography>
                      )}
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          ) : (
            <Box sx={{ textAlign: 'center', py: 4 }}>
              <IconPaw size={48} color="#ccc" />
              <Typography variant="body2" sx={{ color: 'text.secondary', mt: 2 }}>
                {animals.length === 0 
                  ? 'No hay animales detectados hoy' 
                  : 'No hay animales que coincidan con los filtros'
                }
              </Typography>
            </Box>
          )}
        </CardContent>
      </Card>

      {/* Image Dialog */}
      <Dialog
        open={imageDialogOpen}
        onClose={() => setImageDialogOpen(false)}
        maxWidth="md"
        fullWidth
      >
        {selectedAnimal && (
          <>
            <DialogTitle>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Typography variant="h6">
                  {getAnimalTypeName(selectedAnimal.type)} - {getZoneName(selectedAnimal.zoneId)}
                </Typography>
                <Chip
                  label={getAnimalTypeName(selectedAnimal.type)}
                  size="small"
                  sx={{
                    bgcolor: getAnimalTypeColor(selectedAnimal.type),
                    color: 'white'
                  }}
                />
              </Box>
            </DialogTitle>
            <DialogContent>
              <Box sx={{ mb: 2 }}>
                                 {selectedAnimal.imageUrl && imageUrls[selectedAnimal.imageUrl] && (
                   <img
                     src={imageUrls[selectedAnimal.imageUrl]}
                     alt={`${getAnimalTypeName(selectedAnimal.type)}`}
                    style={{
                      width: '100%',
                      maxHeight: 400,
                      objectFit: 'contain',
                      borderRadius: 8
                    }}
                  />
                )}
              </Box>
              <Grid container spacing={2}>
                <Grid size={6}>
                  <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                    Fecha de detección:
                  </Typography>
                  <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                    {formatDate(selectedAnimal.detectedAt)}
                  </Typography>
                </Grid>
                <Grid size={6}>
                  <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                    Zona:
                  </Typography>
                  <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                    {getZoneName(selectedAnimal.zoneId)}
                  </Typography>
                </Grid>
                {selectedAnimal.geopoint && (
                  <Grid size={12}>
                    <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                      Coordenadas:
                    </Typography>
                    <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                      Latitud: {selectedAnimal.geopoint.latitude?.toFixed(6)}°<br />
                      Longitud: {selectedAnimal.geopoint.longitude?.toFixed(6)}°
                    </Typography>
                  </Grid>
                )}
              </Grid>
            </DialogContent>
            <DialogActions>
              <Button onClick={() => setImageDialogOpen(false)}>
                Cerrar
              </Button>
            </DialogActions>
          </>
        )}
      </Dialog>
    </>
  );
};

export default AnimalsGrid;
