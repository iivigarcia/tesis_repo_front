'use client'
import { Grid, Box, Typography, TextField, FormControl, InputLabel, Select, MenuItem } from '@mui/material';
import { IconSearch, IconFilter } from '@tabler/icons-react';
import PageContainer from '@/app/(DashboardLayout)/components/container/PageContainer';
import AnimalsGrid from '@/app/(DashboardLayout)/components/animales/AnimalsGrid';
import AnimalsMap from '@/app/(DashboardLayout)/components/animales/AnimalsMap';
import AnimalsStats from '@/app/(DashboardLayout)/components/animales/AnimalsStats';

const AnimalesPage = () => {
  return (
    <PageContainer title="Animales de la Hacienda" description="Monitoreo y gestión de animales detectados en la hacienda">
      <Box>
        {/* Page Title */}
        <Typography variant="h4" sx={{ fontWeight: 'bold', mb: 3 }}>
          Animales de la Hacienda
        </Typography>

        {/* Main Content Grid */}
        <Grid container spacing={3}>
          {/* Statistics Cards */}
          <Grid size={12}>
            <AnimalsStats />
          </Grid>

          {/* Animals Grid */}
          <Grid size={{ xs: 12, lg: 8 }}>
            <AnimalsGrid />
          </Grid>

          {/* Animals Map */}
          <Grid size={{ xs: 12, lg: 4 }}>
            <AnimalsMap />
          </Grid>
        </Grid>
      </Box>
    </PageContainer>
  );
}

export default AnimalesPage;
