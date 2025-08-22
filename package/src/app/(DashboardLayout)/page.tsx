'use client'
import { Grid, Box } from '@mui/material';
import PageContainer from '@/app/(DashboardLayout)/components/container/PageContainer';
// components
import SummaryCards from '@/app/(DashboardLayout)/components/dashboard/SummaryCards';
import RouteProgress from '@/app/(DashboardLayout)/components/dashboard/RouteProgress';
import BatteryLevel from '@/app/(DashboardLayout)/components/dashboard/BatteryLevel';
import PatrolledZones from '@/app/(DashboardLayout)/components/dashboard/PatrolledZones';
import ZonePatrol from '@/app/(DashboardLayout)/components/dashboard/ZonePatrol';
import ZoneAlerts from '@/app/(DashboardLayout)/components/dashboard/ZoneAlerts';

const Dashboard = () => {
  return (
    <PageContainer title="AeroSentinel Dashboard" description="Dashboard de monitoreo de drones">
      <Box>
        <Grid container spacing={3}>
          {/* Top Row - Summary Cards */}
          <Grid size={12}>
            <SummaryCards />
          </Grid>

          {/* Middle Row - Detailed Metrics */}
          <Grid
            size={{
              xs: 12,
              lg: 4
            }}>
            <RouteProgress />
          </Grid>
          <Grid
            size={{
              xs: 12,
              lg: 4
            }}>
            <BatteryLevel />
          </Grid>
          <Grid
            size={{
              xs: 12,
              lg: 4
            }}>
            <PatrolledZones />
          </Grid>

          {/* Bottom Row - Zone Data */}
          <Grid
            size={{
              xs: 12,
              lg: 6
            }}>
            <ZonePatrol />
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

export default Dashboard;
