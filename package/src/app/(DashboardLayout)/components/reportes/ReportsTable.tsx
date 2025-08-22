import React, { useState } from 'react';
import { 
  Card, 
  CardContent, 
  Table, 
  TableBody, 
  TableCell, 
  TableContainer, 
  TableHead, 
  TableRow, 
  Checkbox, 
  Button, 
  IconButton, 
  Avatar,
  Box,
  Typography,
  Pagination,
  TablePagination,
  Skeleton
} from '@mui/material';
import { 
  IconChevronDown, 
  IconDotsVertical, 
  IconDownload 
} from '@tabler/icons-react';
import { useReports } from '@/hooks';

const ReportsTable = () => {
  const [selected, setSelected] = useState<string[]>([]);
  const [page, setPage] = useState(1);
  const [rowsPerPage] = useState(8);

  const { reports, loading } = useReports(50);

  const handleSelectAllClick = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.checked) {
      const newSelected = reports.map((n) => (n as any).id);
      setSelected(newSelected);
      return;
    }
    setSelected([]);
  };

  const handleClick = (id: string) => {
    const selectedIndex = selected.indexOf(id);
    let newSelected: string[] = [];

    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, id);
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selected.slice(1));
    } else if (selectedIndex === selected.length - 1) {
      newSelected = newSelected.concat(selected.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(
        selected.slice(0, selectedIndex),
        selected.slice(selectedIndex + 1),
      );
    }

    setSelected(newSelected);
  };

  const isSelected = (id: string) => selected.indexOf(id) !== -1;

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const formatDate = (timestamp: any) => {
    if (!timestamp) return 'N/A';
    const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
    return date.toLocaleDateString('es-ES');
  };

  const getAuthorDisplay = (author: string) => {
    // Si el autor es un UID, intentar obtener el nombre del dron
    if (author.includes('dron') || author.includes('Dron')) {
      return author;
    }
    // Si es un UID de usuario, mostrar "Usuario"
    return author.length > 20 ? 'Usuario' : author;
  };

  if (loading) {
    return (
      <Card sx={{ 
        boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
        borderRadius: 2
      }}>
        <CardContent sx={{ p: 0 }}>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow sx={{ bgcolor: '#f8f9fa' }}>
                  <TableCell padding="checkbox">
                    <Skeleton variant="rectangular" width={20} height={20} />
                  </TableCell>
                  <TableCell><Skeleton variant="text" width={80} /></TableCell>
                  <TableCell><Skeleton variant="text" width={60} /></TableCell>
                  <TableCell><Skeleton variant="text" width={80} /></TableCell>
                  <TableCell><Skeleton variant="text" width={100} /></TableCell>
                  <TableCell><Skeleton variant="text" width={40} /></TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
                  <TableRow key={i}>
                    <TableCell padding="checkbox">
                      <Skeleton variant="rectangular" width={20} height={20} />
                    </TableCell>
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                        <Skeleton variant="circular" width={32} height={32} />
                        <Skeleton variant="text" width={60} />
                      </Box>
                    </TableCell>
                    <TableCell><Skeleton variant="text" width={60} /></TableCell>
                    <TableCell><Skeleton variant="text" width={50} /></TableCell>
                    <TableCell><Skeleton variant="rectangular" width={100} height={32} /></TableCell>
                    <TableCell><Skeleton variant="circular" width={24} height={24} /></TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card sx={{ 
      boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
      borderRadius: 2
    }}>
      <CardContent sx={{ p: 0 }}>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow sx={{ bgcolor: '#f8f9fa' }}>
                <TableCell padding="checkbox">
                  <Checkbox
                    indeterminate={selected.length > 0 && selected.length < reports.length}
                    checked={reports.length > 0 && selected.length === reports.length}
                    onChange={handleSelectAllClick}
                  />
                </TableCell>
                <TableCell sx={{ fontWeight: 'bold' }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    Author
                    <IconChevronDown size={16} />
                  </Box>
                </TableCell>
                <TableCell sx={{ fontWeight: 'bold' }}>Fecha</TableCell>
                <TableCell sx={{ fontWeight: 'bold' }}>Tamaño Log</TableCell>
                <TableCell sx={{ fontWeight: 'bold' }}>Descargar</TableCell>
                <TableCell sx={{ fontWeight: 'bold' }}></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {reports.length > 0 ? (
                reports.map((report) => {
                  const reportWithId = report as any;
                  const isItemSelected = isSelected(reportWithId.id);
                  const authorDisplay = getAuthorDisplay(report.author);
                  
                  return (
                    <TableRow
                      key={reportWithId.id}
                      hover
                      selected={isItemSelected}
                      sx={{ '&:hover': { bgcolor: '#f5f5f5' } }}
                    >
                      <TableCell padding="checkbox">
                        <Checkbox
                          checked={isItemSelected}
                          onChange={() => handleClick(reportWithId.id)}
                        />
                      </TableCell>
                      <TableCell>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                          <Avatar sx={{ width: 32, height: 32, bgcolor: '#5D87FF' }}>
                            {authorDisplay.charAt(0)}
                          </Avatar>
                          {authorDisplay}
                        </Box>
                      </TableCell>
                      <TableCell>{formatDate(report.date)}</TableCell>
                      <TableCell>{formatFileSize(report.logSizeBytes)}</TableCell>
                      <TableCell>
                        <Button
                          variant="outlined"
                          size="small"
                          startIcon={<IconDownload size={16} />}
                          sx={{ 
                            textTransform: 'none',
                            borderColor: '#5D87FF',
                            color: '#5D87FF',
                            '&:hover': {
                              borderColor: '#4a6fd8',
                              bgcolor: '#f0f4ff'
                            }
                          }}
                          onClick={() => {
                            // Aquí se implementaría la lógica de descarga
                            console.log('Descargando reporte:', reportWithId.id);
                          }}
                        >
                          Descargar
                        </Button>
                      </TableCell>
                      <TableCell>
                        <IconButton size="small">
                          <IconDotsVertical size={16} />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  );
                })
              ) : (
                <TableRow>
                  <TableCell colSpan={6} sx={{ textAlign: 'center', py: 4 }}>
                    <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                      No hay reportes disponibles
                    </Typography>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>

        {/* Pagination */}
        {reports.length > 0 && (
          <Box sx={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center', 
            p: 2,
            borderTop: '1px solid #e0e0e0'
          }}>
            <Typography variant="body2" sx={{ color: 'text.secondary' }}>
              Mostrando {((page - 1) * rowsPerPage) + 1} a {Math.min(page * rowsPerPage, reports.length)} de {reports.length} reportes
            </Typography>
            
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Button
                size="small"
                disabled={page === 1}
                sx={{ color: 'text.secondary' }}
                onClick={() => setPage(page - 1)}
              >
                &lt; Previous
              </Button>
              
              <Box sx={{ display: 'flex', gap: 0.5 }}>
                {[1, 2, 3, 4, 5].map((pageNum) => (
                  <Button
                    key={pageNum}
                    size="small"
                    variant={pageNum === page ? "contained" : "text"}
                    sx={{
                      minWidth: 32,
                      height: 32,
                      borderRadius: 1,
                      bgcolor: pageNum === page ? '#5D87FF' : 'transparent',
                      color: pageNum === page ? 'white' : 'text.primary',
                      '&:hover': {
                        bgcolor: pageNum === page ? '#4a6fd8' : '#f5f5f5'
                      }
                    }}
                    onClick={() => setPage(pageNum)}
                  >
                    {pageNum}
                  </Button>
                ))}
                
                <Typography variant="body2" sx={{ px: 1, color: 'text.secondary' }}>
                  ...
                </Typography>
                
                <Button
                  size="small"
                  variant="text"
                  sx={{
                    minWidth: 32,
                    height: 32,
                    borderRadius: 1,
                    color: 'text.primary',
                    '&:hover': { bgcolor: '#f5f5f5' }
                  }}
                >
                  11
                </Button>
              </Box>
              
              <Button
                size="small"
                disabled={page === 5}
                sx={{ color: 'text.secondary' }}
                onClick={() => setPage(page + 1)}
              >
                Next &gt;
              </Button>
            </Box>
          </Box>
        )}
      </CardContent>
    </Card>
  );
};

export default ReportsTable;
