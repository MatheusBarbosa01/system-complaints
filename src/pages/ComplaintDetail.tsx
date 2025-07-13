/* eslint-disable no-restricted-globals */

import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../api/axios';
import { ComplaintDetailDto } from '../features/complaints/complaintTypes';
import {
  Box, Typography, Button, Paper, CircularProgress, Divider, Chip,
  Snackbar, Alert,
  Tooltip
} from '@mui/material';
import HomeOutlinedIcon from '@mui/icons-material/HomeOutlined';
import { ChatBubble } from '../components/ChatBubble';
import { formatCPF } from '../utils/formatters';
import { EditComplaintModal } from '../components/EditComplaintModal';
import { useAuth } from '../contexts/AuthContext';
import { useComplaints } from '../contexts/ComplaintsContext';

const ComplaintDetail: React.FC = () => {
  const { user } = useAuth();
  const { list, fetchComplaints } = useComplaints();

  const [userName, setUserName] = useState('');
  const { id } = useParams<{ id: string }>();
  const [complaint, setComplaint] = useState<ComplaintDetailDto | null>(null);
  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);

  const handleSaveComplaint = async (desc: string, stat: string) => {
    setIsUpdating(true);
    try {
      await api.put(`/complaints/${id}`, {
        description: desc,
        status: stat,
      });
      const res = await api.get<ComplaintDetailDto>(`/complaints/${id}`);
      setComplaint(res.data);
      setSnackbarOpen(true);
      setIsModalOpen(false);
    } catch (err) {
      console.error('Erro ao atualizar', err);
    } finally {
      setIsUpdating(false);
    }
  };

  useEffect(() => {
    fetchComplaints();
  }, []);
  

  useEffect(() => {
    api.get<ComplaintDetailDto>(`/complaints/${id}`).then(res => setComplaint(res.data));
  }, [id]);

  const handleDelete = async () => {
    if (confirm('Deseja excluir?')) {
      await api.delete(`/complaints/${id}`);
      navigate('/');
    }
  };

  useEffect(() => {
    if (user?.name) setUserName(user.name);
  }, [user]);

  if (!complaint) return <CircularProgress />;

  return (
    <Box sx={{ height: '100%', p: 2 }}>
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          mb: 2,
          px: 2,
          borderRadius: 2,
          boxShadow: 1,
          height: 64,
        }}
      >
        <Button
          variant="outlined"
          startIcon={<HomeOutlinedIcon />}
          onClick={() => navigate('/')}
          sx={{ position: 'absolute', left: 24 }}
        >
          Home
        </Button>
        <Typography variant="h5" sx={{ mx: 'auto' }}>
          UNIDADE DE RECLAMAÇÕES
        </Typography>
      </Box>

      <Box sx={{ display: 'flex', gap: 2 }}>
        <Box sx={{ width: 220 }}>
          <Paper sx={{ p: 2, height: '100%' }}>
            <Typography variant="h6" gutterBottom>Reclamações</Typography>
            <Divider />
            <Box sx={{ mt: 1 }}>
              {list.map((complaint) => (
                <Typography
                  key={complaint.id}
                  onClick={() => navigate(`/complaints/${complaint.id}`)}
                  sx={{
                    my: 1,
                    cursor: 'pointer',
                    fontSize: '0.75rem',
                    color: String(complaint.id) === id ? '#1976d2' : 'white',
                    fontWeight: String(complaint.id) === id ? 'bold' : 'normal',
                    '&:hover': {
                      textDecoration: 'underline',
                    }
                  }}
                >
                  {complaint.title}
                </Typography>
              ))}
            </Box>
          </Paper>
        </Box>

        <Box sx={{ flex: 1 }}>
          <Paper sx={{ p: 2, height: '100%' }}>
            <ChatBubble>
              <Tooltip
                title={
                  complaint.status !== 'PENDENTE'
                    ? 'Edição indisponível para reclamações resolvidas ou não concluídas.'
                    : 'Editar reclamação'
                }
                placement="left-end"
                arrow
              >
                <Box
                  onClick={() => {
                    if (complaint.status === 'PENDENTE') setIsModalOpen(true);
                  }}
                  sx={{
                    position: 'absolute',
                    top: 12,
                    right: 24,
                    px: 2,
                    py: 0.5,
                    border: '1px solid',
                    borderColor: 'primary.main',
                    borderRadius: 1,
                    fontSize: '0.75rem',
                    color: complaint.status === 'PENDENTE' ? 'primary.main' : 'grey.500',
                    cursor: complaint.status === 'PENDENTE' ? 'pointer' : 'not-allowed',
                    opacity: complaint.status === 'PENDENTE' ? 1 : 0.5,
                    transition: '0.3s',
                    '&:hover': {
                      backgroundColor:
                        complaint.status === 'PENDENTE' ? 'primary.dark' : 'transparent',
                      color:
                        complaint.status === 'PENDENTE' ? 'white' : 'grey.500',
                    },
                  }}
                >
                  Editar
                </Box>
              </Tooltip>

              <Chip
                label={`Criado em: ${new Date(complaint.createdAt).toLocaleDateString('pt-br')} por ${complaint.email}`}
                size="small"
                sx={{ fontSize: 8 }}
              />
              <Typography variant="h4" sx={{ mt: 4, mb: 1 }}>{complaint.title}</Typography>
              <Typography variant="body2" sx={{ whiteSpace: 'pre-line' }}>{complaint.description}</Typography>
              {complaint.updatedAt &&
                complaint.updatedAt !== complaint.createdAt && (
                  <Typography
                    textAlign="end"
                    fontStyle="italic"
                    fontSize={9}
                  >
                    Última atualização feita em: {new Date(complaint.updatedAt).toLocaleDateString('pt-BR')} às {new Date(complaint.updatedAt).toLocaleTimeString('pt-br')}
                  </Typography>
              )}
            </ChatBubble>
          </Paper>
        </Box>

        <Box sx={{ width: 260 }}>
          <Paper sx={{ p: 2, height: '100%' }}>
            <Typography variant="h6" gutterBottom>Relatório</Typography>
            <Divider sx={{ mb: 2 }} />
            <Typography variant="body2" fontSize='0.75rem'><strong>Entidade:</strong> {userName}</Typography>
            <Typography variant="body2" fontSize='0.75rem'><strong>CPF:</strong> {formatCPF(complaint.cpf)}</Typography>
            <Typography variant="body2" fontSize='0.75rem'><strong>Data de abertura:</strong> {new Date(complaint.createdAt).toLocaleDateString('pt-br')}</Typography>
            <Typography variant="body2" fontSize='0.75rem'><strong>Horário de abertura:</strong> {new Date(complaint.createdAt).toLocaleTimeString('pt-br')}</Typography>
            <Typography variant="body2" fontSize='0.75rem'>
              <strong>Status:</strong>{' '}
              <Chip
                label={(complaint.status).replace(/_/g, ' ')}
                size="small"
                color={
                  complaint.status === 'PENDENTE'
                    ? 'warning'
                    : complaint.status === 'RESOLVIDO'
                      ? 'success'
                      : complaint.status === 'NAO_CONCLUIDO'
                        ? 'error'
                        : 'default'
                }
              />
            </Typography>
            <Box mt={2}>
              <Tooltip
                title={
                  complaint.status !== 'PENDENTE'
                    ? 'Você só pode excluir reclamações com status PENDENTE.'
                    : 'Excluir reclamação'
                }
                placement="bottom"
                arrow
              >
                <Box
                  onClick={() => {
                    if (complaint.status === 'PENDENTE') {
                      handleDelete();
                    }
                  }}
                  sx={{
                    width: '100%',
                    textAlign: 'center',
                    backgroundColor:
                      complaint.status === 'PENDENTE' ? 'error.main' : 'grey.700',
                    color: 'white',
                    py: 1,
                    borderRadius: 1,
                    cursor: complaint.status === 'PENDENTE' ? 'pointer' : 'not-allowed',
                    opacity: complaint.status === 'PENDENTE' ? 1 : 0.6,
                    transition: '0.3s',
                    '&:hover': {
                      backgroundColor:
                        complaint.status === 'PENDENTE' ? 'error.dark' : 'grey.700',
                    },
                  }}
                >
                  Excluir
                </Box>
              </Tooltip>

            </Box>
          </Paper>
        </Box>
      </Box>

      {complaint && (
        <EditComplaintModal
          open={isModalOpen}
          initialDescription={complaint.description}
          initialStatus={complaint.status}
          onClose={() => setIsModalOpen(false)}
          onSave={handleSaveComplaint}
          loading={isUpdating}
        />
      )}

      <Snackbar
        open={snackbarOpen}
        autoHideDuration={3000}
        onClose={() => setSnackbarOpen(false)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert severity="success" sx={{ width: '100%' }}>
          Reclamação atualizada com sucesso!
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default ComplaintDetail;
