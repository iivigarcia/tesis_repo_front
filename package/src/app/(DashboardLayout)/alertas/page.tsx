'use client'
import { Grid, Box, Typography, TextField, IconButton } from '@mui/material';
import { IconCalendar, IconArrowRight } from '@tabler/icons-react';
import PageContainer from '@/app/(DashboardLayout)/components/container/PageContainer';
// components
import SummaryCards from '@/app/(DashboardLayout)/components/dashboard/SummaryCards';
import ZonesWithAlerts from '@/app/(DashboardLayout)/components/alertas/ZonesWithAlerts';
import AlertsList from '@/app/(DashboardLayout)/components/alertas/AlertsList';
import LastAlert from '@/app/(DashboardLayout)/components/alertas/LastAlert';
import ZoneAlerts from '@/app/(DashboardLayout)/components/dashboard/ZoneAlerts';

const AlertasPage = () => {
  return (
    <PageContainer title="Panel de Alertas" description="Panel de monitoreo de alertas">
      <Box>
        {/* Header with Date Filters */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
            Panel de Alertas
          </Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <TextField
              size="small"
              placeholder="Start date"
              InputProps={{
                startAdornment: <IconCalendar size={20} />,
              }}
              sx={{ width: 150 }}
            />
            <IconArrowRight size={20} color="#666" />
            <TextField
              size="small"
              placeholder="End date"
              InputProps={{
                startAdornment: <IconCalendar size={20} />,
              }}
              sx={{ width: 150 }}
            />
          </Box>
        </Box>

        <Grid container spacing={3}>
          {/* Top Row - Summary Cards */}
          <Grid size={12}>
            <SummaryCards />
          </Grid>

          {/* Middle Row - Zones with Alerts and Alerts List */}
          <Grid
            size={{
              xs: 12,
              lg: 6
            }}>
            <ZonesWithAlerts />
          </Grid>
          <Grid
            size={{
              xs: 12,
              lg: 6
            }}>
            <AlertsList />
          </Grid>

          {/* Bottom Row - Last Alert and Zone Alerts */}
          <Grid
            size={{
              xs: 12,
              lg: 6
            }}>
            <LastAlert />
          </Grid>
          <Grid
            size={{
              xs: 12,
              lg: 6
            }}>
            <ZoneAlerts />
          </Grid>
        </Grid>
      </Box>
    </PageContainer>
  );
}

export default AlertasPage;
