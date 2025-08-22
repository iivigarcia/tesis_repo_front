'use client'
import { Grid, Box, Typography, TextField, Select, MenuItem, FormControl, InputLabel } from '@mui/material';
import { IconCalendar, IconArrowRight, IconSearch, IconChevronDown } from '@tabler/icons-react';
import PageContainer from '@/app/(DashboardLayout)/components/container/PageContainer';
import ReportsTable from '@/app/(DashboardLayout)/components/reportes/ReportsTable';

const ReportesPage = () => {
  return (
    <PageContainer title="Reportes" description="Gestión de reportes de AeroSentinel">
      <Box>
        {/* Page Title */}
        <Typography variant="h4" sx={{ fontWeight: 'bold', mb: 3 }}>
          Reportes
        </Typography>

        {/* Filter and Search Bar */}
        <Box sx={{ 
          display: 'flex', 
          alignItems: 'center', 
          gap: 2, 
          mb: 3,
          flexWrap: 'wrap'
        }}>
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
          <TextField
            size="small"
            placeholder="Tamaño"
            InputProps={{
              startAdornment: <IconSearch size={20} />,
            }}
            sx={{ width: 150 }}
          />
          <FormControl size="small" sx={{ width: 150 }}>
            <InputLabel>Dron</InputLabel>
            <Select
              label="Dron"
              endAdornment={<IconChevronDown size={20} />}
            >
              <MenuItem value="dron1">Dron 1</MenuItem>
              <MenuItem value="dron2">Dron 2</MenuItem>
              <MenuItem value="todos">Todos los drones</MenuItem>
            </Select>
          </FormControl>
        </Box>

        {/* Reports Table */}
        <Grid size={12}>
          <ReportsTable />
        </Grid>
      </Box>
    </PageContainer>
  );
}

export default ReportesPage;
