'use client'
import { Grid, Box, Typography } from '@mui/material';
import PageContainer from '@/app/(DashboardLayout)/components/container/PageContainer';
import ZonesManager from '@/app/(DashboardLayout)/components/configuraciones/ZonesManager';
import ZoneEditor from '@/app/(DashboardLayout)/components/configuraciones/ZoneEditor';

const ConfiguracionesPage = () => {
  return (
    <PageContainer title="Configuraciones" description="Gestión de zonas de cobertura de AeroSentinel">
      <Box>
        {/* Page Title */}
        <Typography variant="h4" sx={{ fontWeight: 'bold', mb: 3 }}>
          Configuraciones
        </Typography>

        {/* Main Content Grid */}
        <Grid container spacing={3}>
          {/* Zones Manager */}
          <Grid size={{ xs: 12, lg: 8 }}>
            <ZonesManager />
          </Grid>

          {/* Zone Editor */}
          <Grid size={{ xs: 12, lg: 4 }}>
            <ZoneEditor />
          </Grid>
        </Grid>
      </Box>
    </PageContainer>
  );
}

export default ConfiguracionesPage;
