import React, { useEffect, useState, useCallback } from 'react';
import {
  Typography, Box, CircularProgress, Alert, Paper, Select,
  MenuItem, Stack, InputLabel, FormControl, TextField
} from '@mui/material';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';
import { ComplaintListDto } from '../features/complaints/complaintTypes';
import Layout from '../components/Layout';
import { toast } from 'react-toastify';
import DeletedComplaintCard from '../components/DeletedComplaintCard';

const DeletedComplaintsPage: React.FC = () => {
  const navigate = useNavigate();
  const [list, setList] = useState<ComplaintListDto[]>([]);
  const [status, setStatus] = useState<'idle' | 'loading' | 'succeeded' | 'failed'>('idle');
  const [error, setError] = useState<string | null>(null);
  const [dateFilter, setDateFilter] = useState<string>('');

  const loadDeletedComplaints = useCallback(async () => {
    setStatus('loading');
    setError(null);
  
    try {
      const response = await api.get<ComplaintListDto[]>('/complaints/deleted');
  
      const formatDateOnly = (date: string | Date | null | undefined): string | null => {
        const d = new Date(date ?? '');
        return isNaN(d.getTime()) ? null : d.toISOString().split('T')[0];
      };
      
      const filtered = dateFilter
      ? response.data.filter((c) => formatDateOnly(c.deletedAt) === dateFilter)
      : response.data;
    
      setList(filtered);
      setStatus('succeeded');
    } catch (err: any) {
      const msg = err?.response?.data?.message || 'Erro ao carregar reclamações apagadas.';
      setError(msg);
      setStatus('failed');
      toast.error(msg);
    }
  }, [dateFilter]);
  
  

  useEffect(() => {
    loadDeletedComplaints();
  }, [loadDeletedComplaints]);

  const count = {
    total: list.length,
    hoje: list.filter(c => c.deletedAt && isToday(new Date(c.deletedAt))).length,
  };
  

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

      <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} mb={3}>

        <TextField
          label="Data da exclusão"
          type="date"
          size="small"
          InputLabelProps={{ shrink: true }}
          value={dateFilter}
          onChange={(e) => setDateFilter(e.target.value)}
        />
      </Stack>

      {status === 'loading' && (
        <Box textAlign="center" mt={4}>
          <CircularProgress />
          <Typography mt={2}>Carregando reclamações apagadas...</Typography>
        </Box>
      )}

      {status === 'succeeded' && list.length === 0 && (
        <Alert severity="info">Nenhuma reclamação apagada encontrada com os filtros selecionados.</Alert>
      )}

      <Box
        display="grid"
        gridTemplateColumns={{ xs: '1fr', sm: '1fr 1fr', md: '1fr 1fr 1fr' }}
        gap={2}
      >
        {status === 'succeeded' &&
          list.map((c) => (
            <DeletedComplaintCard
              key={c.id}
              complaint={c}
            />
          ))}
      </Box>
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

function isToday(date: Date): boolean {
  const today = new Date();
  return (
    date.getDate() === today.getDate() &&
    date.getMonth() === today.getMonth() &&
    date.getFullYear() === today.getFullYear()
  );
}


export default DeletedComplaintsPage;
