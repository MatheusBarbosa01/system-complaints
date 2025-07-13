import React, { useState, FormEvent } from 'react';
import {
  TextField, Button, Paper, Typography, Box, Snackbar,
  Alert, FormControl, Select, MenuItem, LinearProgress,
  Dialog, DialogTitle, DialogContent, DialogActions
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';
import Layout from '../components/Layout';
import { formatCPF } from '../utils/formatters';
import { useAuth } from '../contexts/AuthContext';
import { ComplaintPriority } from '../features/complaints/complaintTypes';

const ComplaintForm: React.FC = () => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState<ComplaintPriority>(ComplaintPriority.MEDIA);
  const [success, setSuccess] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);

  const navigate = useNavigate();
  const { user } = useAuth();
  const name = user?.name || '';
  const cpf = user?.cpf || '';
  const email = user?.email || '';

  const resetForm = () => {
    setTitle('');
    setDescription('');
    setPriority(ComplaintPriority.MEDIA);
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    try {
      await api.post('/complaints', { title, description, priority });
      setSuccess(true);
      setOpenDialog(true);
    } catch {
      alert('Erro ao criar reclamação');
    }
  };

  const handleDialogClose = (option: 'yes' | 'no') => {
    setOpenDialog(false);
    if (option === 'yes') {
      resetForm();
    } else {
      setTimeout(() => navigate('/'), 1000); 
    }
  };

  return (
    <Layout>
      <Typography variant="h4" gutterBottom>Solicitar nova Reclamação</Typography>

      <Box mb={2}>
        <Typography fontSize={13} color="gray">Passo 1 de 1 - Preenchimento</Typography>
        <LinearProgress variant="determinate" value={100} sx={{ height: 6, borderRadius: 2 }} />
      </Box>

      <Typography variant="body2" color="gray" mb={1}>
        Data/Hora: {new Date().toLocaleString('pt-br')}
      </Typography>

      <Box display="flex" alignItems="center" gap={1} mb={1}>
        <Typography variant="h6" fontWeight="bold">Reclamação do Usuário</Typography>
      </Box>

      <Box
        display="flex"
        alignItems="center"
        justifyContent="space-between"
        flexWrap="wrap"
        mb={3}
        p={2}
        border="1px solid #1976d2"
        borderRadius={2}
        sx={{ backgroundColor: 'rgba(25, 118, 210, 0.05)' }}
      >
        <Typography variant="body2"><strong>Nome:</strong> {name}</Typography>
        <Typography variant="body2"><strong>CPF:</strong> {formatCPF(cpf)}</Typography>
        <Typography variant="body2"><strong>Email:</strong> {email}</Typography>
      </Box>

      <Paper elevation={3} sx={{ p: 4, maxWidth: 700, mx: 'auto', borderLeft: '6px solid #1976d2' }}>
        <Typography variant="subtitle1" gutterBottom>
          Olá, <strong>{name || 'usuário'}</strong>, preencha os seguintes campos para enviar sua reclamação:
        </Typography>

        <Box component="form" onSubmit={handleSubmit} display="flex" flexDirection="column" gap={3} mt={3}>
          <FormControl fullWidth>
            <Typography fontSize={14} fontWeight="bold" color="primary" mb={0.5}>Título:</Typography>
            <TextField
              value={title}
              onChange={e => setTitle(e.target.value)}
              required
              placeholder="Digite o título da sua reclamação"
            />
          </FormControl>

          <FormControl fullWidth>
            <Typography fontSize={14} fontWeight="bold" color="primary" mb={0.5}>Descrição:</Typography>
            <TextField
              multiline
              rows={4}
              value={description}
              onChange={e => setDescription(e.target.value)}
              required
              placeholder="Descreva o problema com detalhes"
            />
          </FormControl>

          <FormControl fullWidth>
            <Typography fontSize={14} fontWeight="bold" color="primary" mb={0.5}>Prioridade:</Typography>
            <Select
              value={priority}
              onChange={(e) => setPriority(e.target.value)}
              required
            >
              <MenuItem value={ComplaintPriority.BAIXA}>Baixa</MenuItem>
              <MenuItem value={ComplaintPriority.MEDIA}>Média</MenuItem>
              <MenuItem value={ComplaintPriority.ALTA}>Alta</MenuItem>
            </Select>
          </FormControl>

          <Button type="submit" variant="contained" size="large" sx={{ mt: 2 }}>
            Enviar Reclamação
          </Button>
        </Box>
      </Paper>

      <Snackbar
        open={success}
        autoHideDuration={3000}
        onClose={() => setSuccess(false)}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert severity="success" onClose={() => setSuccess(false)}>
          Reclamação enviada com sucesso!
        </Alert>
      </Snackbar>

      <Dialog open={openDialog} onClose={() => handleDialogClose('no')}>
        <DialogTitle>Deseja fazer outra reclamação?</DialogTitle>
        <DialogContent>
          <Typography>Você pode enviar outra agora ou voltar para a página inicial.</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => handleDialogClose('yes')}>Sim</Button>
          <Button onClick={() => handleDialogClose('no')} autoFocus>Não</Button>
        </DialogActions>
      </Dialog>
    </Layout>
  );
};

export default ComplaintForm;
