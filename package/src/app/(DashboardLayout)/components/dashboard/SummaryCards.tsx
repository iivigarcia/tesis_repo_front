import React from 'react';
import { Grid, Card, CardContent, Typography, Box, Skeleton } from '@mui/material';
import { IconPaw, IconRoute, IconAlertTriangle, IconMapPin } from '@tabler/icons-react';
import { useDashboardStats, useDrones } from '@/hooks';

interface SummaryCardProps {
  title: string;
  value: string | number;
  change?: string;
  icon: React.ReactNode;
  color: string;
  loading?: boolean;
}

const SummaryCard = ({ title, value, change, icon, color, loading = false }: SummaryCardProps) => (
  <Card sx={{ 
    height: '100%', 
    boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
    borderRadius: 2
  }}>
    <CardContent sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
        <Box sx={{ 
          width: 48, 
          height: 48, 
          borderRadius: 2, 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center',
          bgcolor: `${color}.light`,
          color: `${color}.main`
        }}>
          {icon}
        </Box>
        {change && (
          <Typography variant="caption" sx={{ 
            color: change.startsWith('+') ? 'success.main' : 'error.main',
            fontWeight: 'medium'
          }}>
            {change}
          </Typography>
        )}
      </Box>
      {loading ? (
        <Skeleton variant="text" width="60%" height={40} />
      ) : (
        <Typography variant="h4" sx={{ fontWeight: 'bold', mb: 0.5 }}>
          {value}
        </Typography>
      )}
      <Typography variant="body2" sx={{ color: 'text.secondary' }}>
        {title}
      </Typography>
    </CardContent>
  </Card>
);

const SummaryCards = () => {
  const { stats, loading: statsLoading } = useDashboardStats();
  const { drones, loading: dronesLoading } = useDrones();

  const loading = statsLoading || dronesLoading;

  // Encontrar el dron actual en patrulla
  const currentDrone = drones.find(drone => (drone as any).id === stats.currentPatrol?.droneId);
  const currentZoneId = stats.currentPatrol?.zoneId;

  const cards = [
    {
      title: "Total Animales",
      value: stats.totalAnimals.toLocaleString(),
      change: stats.animalsGrowth > 0 ? `+${stats.animalsGrowth.toFixed(1)}%` : `${stats.animalsGrowth.toFixed(1)}%`,
      icon: <IconPaw size={24} />,
      color: "primary",
      loading
    },
    {
      title: "Recorridos hoy",
      value: stats.todayCounts.flights,
      change: "-1,2%", // Esto podría calcularse comparando con días anteriores
      icon: <IconRoute size={24} />,
      color: "info",
      loading
    },
    {
      title: "Alertas",
      value: stats.todayCounts.alerts,
      change: "+11%", // Esto podría calcularse comparando con días anteriores
      icon: <IconAlertTriangle size={24} />,
      color: "warning",
      loading
    },
    {
      title: "Zona Actual del Dron",
      value: currentZoneId ? `Zona ${currentZoneId.split('-').pop() || currentZoneId}` : "Sin asignar",
      icon: <IconMapPin size={24} />,
      color: "success",
      loading
    }
  ];

  return (
    <Grid container spacing={3}>
      {cards.map((card, index) => (
        <Grid size={{ xs: 12, sm: 6, md: 3 }} key={index}>
          <SummaryCard {...card} />
        </Grid>
      ))}
    </Grid>
  );
};

export default SummaryCards;
