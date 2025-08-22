import React from 'react';
import { Grid, Card, CardContent, Typography, Box, Skeleton } from '@mui/material';
import { IconDrone, IconBattery, IconWifi, IconActivity } from '@tabler/icons-react';
import { useDrones } from '@/hooks';

interface OverviewCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  color: string;
  loading?: boolean;
}

const OverviewCard = ({ title, value, icon, color, loading = false }: OverviewCardProps) => (
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

const DronesOverview = () => {
  const { drones, loading } = useDrones();

  // Calcular estadísticas
  const totalDrones = drones.length;
  const activeDrones = drones.filter(drone => drone.status === 'flying').length;
  const onlineDrones = drones.filter(drone => drone.status !== 'offline').length;
  const averageBattery = drones.length > 0 
    ? Math.round(drones.reduce((sum, drone) => sum + drone.battery, 0) / drones.length)
    : 0;

  const cards = [
    {
      title: "Total de Drones",
      value: totalDrones,
      icon: <IconDrone size={24} />,
      color: "primary",
      loading
    },
    {
      title: "Drones Activos",
      value: activeDrones,
      icon: <IconActivity size={24} />,
      color: "success",
      loading
    },
    {
      title: "Drones Online",
      value: onlineDrones,
      icon: <IconWifi size={24} />,
      color: "info",
      loading
    },
    {
      title: "Batería Promedio",
      value: `${averageBattery}%`,
      icon: <IconBattery size={24} />,
      color: "warning",
      loading
    }
  ];

  return (
    <Grid container spacing={3}>
      {cards.map((card, index) => (
        <Grid size={{ xs: 12, sm: 6, md: 3 }} key={index}>
          <OverviewCard {...card} />
        </Grid>
      ))}
    </Grid>
  );
};

export default DronesOverview;
