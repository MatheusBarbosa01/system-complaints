import React, { useEffect, useState, useCallback } from 'react';
import {
  Typography, Box, CircularProgress, Alert, Paper, Stack,
  TextField, Button
} from '@mui/material';
import Layout from '../components/Layout';
import { useComplaints } from '../contexts/ComplaintsContext';
import DeletedComplaintCard from '../components/DeletedComplaintCard';

function isToday(date: Date): boolean {
  const today = new Date();
  return (
    date.getDate() === today.getDate() &&
    date.getMonth() === today.getMonth() &&
    date.getFullYear() === today.getFullYear()
  );
}

const formatDateOnly = (date: string | Date | null | undefined): string | null => {
  const d = new Date(date ?? '');
  return isNaN(d.getTime()) ? null : d.toISOString().split('T')[0];
};

const DeletedComplaintsPage: React.FC = () => {
  const {
    list,
    status,
    page,
    totalPages,
    fetchComplaints,
    setPage,
  } = useComplaints();

  const [dateFilter, setDateFilter] = useState('');

  const filteredList = list.filter((c) => {
    if (!dateFilter) return true;
    return formatDateOnly(c.deletedAt) === dateFilter;
  });

  const count = {
    total: filteredList.length,
    hoje: filteredList.filter(c => c.deletedAt && isToday(new Date(c.deletedAt))).length,
  };

  useEffect(() => {
    setPage(0); 
  }, [dateFilter]);

  useEffect(() => {
    fetchComplaints({ page });
  }, [fetchComplaints, page]);

  return (
    <Layout>
      <Stack direction="row" alignItems="center" spacing={1} mb={2}>
        <Typography variant="h4">Reclamações Apagadas</Typography>
      </Stack>

      <Typography variant="subtitle1" mb={3}>
        Aqui estão listadas as reclamações que foram apagadas.
      </Typography>

      <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} mb={3}>
        <StatusCard label="Hoje" value={count.hoje} color="#ef5350" />
        <StatusCard label="Total" value={count.total} color="#9e9e9e" />
      </Stack>

      <TextField
        label="Data da exclusão"
        type="date"
        size="small"
        InputLabelProps={{ shrink: true }}
        value={dateFilter}
        onChange={(e) => setDateFilter(e.target.value)}
        sx={{ mb: 3 }}
      />

      {status === 'loading' && (
        <Box textAlign="center" mt={4}>
          <CircularProgress />
          <Typography mt={2}>Carregando reclamações apagadas...</Typography>
        </Box>
      )}

      {status === 'succeeded' && filteredList.length === 0 && (
        <Alert severity="info">Nenhuma reclamação encontrada com os filtros selecionados.</Alert>
      )}

      <Box
        display="grid"
        gridTemplateColumns={{ xs: '1fr', sm: '1fr 1fr', md: '1fr 1fr 1fr' }}
        gap={2}
      >
        {status === 'succeeded' &&
          filteredList.map((c) => (
            <DeletedComplaintCard key={c.id} complaint={c} />
          ))}
      </Box>

      {status === 'succeeded' && totalPages > 1 && (
        <Box display="flex" justifyContent="center" mt={4}>
          <Stack direction="row" spacing={1} alignItems="center">
            <Button
              variant="outlined"
              size="small"
              onClick={() => setPage(page - 1)}
              disabled={page === 0}
            >
              &lt;
            </Button>
            <Typography variant="body1">
              Página {page + 1} de {totalPages}
            </Typography>
            <Button
              variant="outlined"
              size="small"
              onClick={() => setPage(page + 1)}
              disabled={page + 1 >= totalPages}
            >
              &gt;
            </Button>
          </Stack>
        </Box>
      )}
    </Layout>
  );
};

interface StatusCardProps {
  label: string;
  value: number;
  color: string;
}

const StatusCard: React.FC<StatusCardProps> = ({ label, value, color }) => (
  <Paper sx={{ flex: 1, p: 2, textAlign: 'center', bgcolor: color, color: 'white' }}>
    <Typography variant="subtitle1">{label}</Typography>
    <Typography variant="h5">{value}</Typography>
  </Paper>
);

export default DeletedComplaintsPage;
