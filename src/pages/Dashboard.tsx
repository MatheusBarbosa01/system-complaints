import React, { useEffect } from 'react';
import { Typography, Box, CircularProgress, Alert, Grid } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchComplaints } from '../features/complaints/complaintsSlice';
import { RootState, AppDispatch } from '../app/store';
import { ComplaintListDto } from '../features/complaints/complaintTypes';
import Layout from '../components/Layout';
import ComplaintCard from '../components/ComplaintCard';

const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const { list, status, error } = useSelector((state: RootState) => state.complaints);

  useEffect(() => {
    dispatch(fetchComplaints());
  }, [dispatch]);

  return (
    <Layout>
      <Typography variant="h4" gutterBottom>Minhas Reclamações</Typography>
      {status === 'loading' && (
        <Box textAlign="center" mt={4}>
          <CircularProgress />
          <Typography mt={2}>Carregando reclamações...</Typography>
        </Box>
      )}

      {status === 'failed' && (
        <Alert severity="error" sx={{ mb: 2 }}>
          Ocorreu um erro: {error}
        </Alert>
      )}

      {status === 'succeeded' && list.length === 0 && (
        <Alert severity="info">Nenhuma reclamação registrada.</Alert>
      )}

      <Grid container spacing={2}>
        {status === 'succeeded' &&
          list.map((c: ComplaintListDto) => (
            <Grid key={c.id} sx={{ width: '100%', maxWidth: 400, flexGrow: 1 }}>
              <ComplaintCard complaint={c} onClick={() => navigate(`/complaints/${c.id}`)} />
            </Grid>
          ))}
      </Grid>
    </Layout>
  );
};

export default Dashboard;
