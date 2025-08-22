'use client'
import { Grid, Box, Typography } from '@mui/material';
import PageContainer from '@/app/(DashboardLayout)/components/container/PageContainer';
import DronesOverview from '@/app/(DashboardLayout)/components/drones/DronesOverview';
import DronesMap from '@/app/(DashboardLayout)/components/drones/DronesMap';
import DronesStatus from '@/app/(DashboardLayout)/components/drones/DronesStatus';

const DronesPage = () => {
  return (
    <PageContainer title="Mis Drones" description="Gestión y monitoreo de drones de AeroSentinel">
      <Box>
        {/* Page Title */}
        <Typography variant="h4" sx={{ fontWeight: 'bold', mb: 3 }}>
          Mis Drones
        </Typography>

        {/* Drones Overview Cards */}
        <Grid size={12} sx={{ mb: 3 }}>
          <DronesOverview />
        </Grid>

        {/* Main Content Grid */}
        <Grid container spacing={3}>
          {/* Drones Map */}
          <Grid size={{ xs: 12, lg: 8 }}>
            <DronesMap />
          </Grid>

          {/* Drones Status */}
          <Grid size={{ xs: 12, lg: 4 }}>
            <DronesStatus />
          </Grid>
        </Grid>
      </Box>
    </PageContainer>
  );
}

export default DronesPage;
