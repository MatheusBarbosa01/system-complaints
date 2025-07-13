import React, { useEffect } from 'react';
import {
  Typography, Box, CircularProgress, Alert, Paper, Select, MenuItem, Stack, Button
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import Layout from '../components/Layout';
import ComplaintCard from '../components/ComplaintCard';
import { useComplaints } from '../contexts/ComplaintsContext';

type PriorityFilter = 'todas' | 'BAIXA' | 'MEDIA' | 'ALTA';

const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const {
    list,
    status,
    page,
    totalPages,
    priorityFilter,
    setPage,
    setPriorityFilter,
  } = useComplaints();

  useEffect(() => {
    setPage(0);
  }, [priorityFilter]);

  const countByStatus = {
    total: list.length,
    abertas: list.filter(c => c.status === 'PENDENTE').length,
    resolvidas: list.filter(c => c.status === 'RESOLVIDO').length,
    canceladas: list.filter(c => c.status === 'NAO_CONCLUIDO').length,
  };

  return (
    <Layout>
      <Typography variant="h4" gutterBottom>
        Minhas Reclamações
      </Typography>
      <Typography variant="subtitle1" mb={3}>
        Aqui estão listadas todas as suas reclamações ativas.
      </Typography>

      <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} mb={3}>
        <StatusCard label="Total" value={countByStatus.total} color="#1976d2" textColor="white" />
        <StatusCard label="Abertas" value={countByStatus.abertas} color="#ffa726" textColor="black" />
        <StatusCard label="Resolvidas" value={countByStatus.resolvidas} color="#66bb6a" textColor="white" />
      </Stack>

      <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
        <Typography variant="subtitle1">Filtrar por prioridade:</Typography>
        <Select
          size="small"
          value={priorityFilter ?? 'todas'}
          onChange={(e) => setPriorityFilter(e.target.value as PriorityFilter)}
        >
          <MenuItem value="todas">Todas</MenuItem>
          <MenuItem value="BAIXA">Baixa</MenuItem>
          <MenuItem value="MEDIA">Média</MenuItem>
          <MenuItem value="ALTA">Alta</MenuItem>
        </Select>
      </Box>

      {status === 'loading' && (
        <Box textAlign="center" mt={4}>
          <CircularProgress />
          <Typography mt={2}>Carregando reclamações...</Typography>
        </Box>
      )}

      {status === 'succeeded' && list.length === 0 && (
        <Alert severity="info">Nenhuma reclamação encontrada com os filtros selecionados.</Alert>
      )}

      <Box
        display="grid"
        gridTemplateColumns={{ xs: '1fr', sm: '1fr 1fr', md: '1fr 1fr 1fr' }}
        gap={2}
      >
        {status === 'succeeded' &&
          list.map((c) => (
            <ComplaintCard
              key={c.id}
              complaint={c}
              onClick={() => navigate(`/complaints/${c.id}`)}
            />
          ))}
      </Box>
      
      {status === 'succeeded' && totalPages > 1 && (
        <Box display="flex" justifyContent="center" mt={4}>
          <Stack direction="row" spacing={1}>
            <Button
              variant="outlined"
              size="small"
              onClick={() => setPage(page - 1)}
              disabled={page === 0}
            >
              &lt;
            </Button>
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
  textColor: string;
}

const StatusCard: React.FC<StatusCardProps> = ({ label, value, color, textColor }) => (
  <Paper sx={{ flex: 1, p: 2, textAlign: 'center', bgcolor: color, color: textColor }}>
    <Typography variant="subtitle1">{label}</Typography>
    <Typography variant="h5">{value}</Typography>
  </Paper>
);

export default Dashboard;
