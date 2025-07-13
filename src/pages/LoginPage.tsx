import React, { useState, FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';
import { useAuth } from '../contexts/AuthContext';
import {
  TextField, Button, Paper, Typography, Box
} from '@mui/material';

const LoginPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();
  const { setToken } = useAuth();

  const handleLogin = async (e: FormEvent) => {
    e.preventDefault();
    try {
      const res = await api.post<{ token: string }>('/login', { email, password });
      setToken(res.data.token); 
      navigate('/');
    } catch {
      alert('Erro ao logar');
    }
  };

  return (
    <Paper elevation={3} sx={{ p: 4, maxWidth: 400, mx: 'auto', mt: 8 }}>
      <Typography variant="h4" mb={3} gutterBottom>Login</Typography>
      <Box component="form" onSubmit={handleLogin} display="flex" flexDirection="column" gap={2}>
        <Typography fontSize={14} fontWeight="bold" >Email:</Typography>
        <TextField
          label="Digite seu Email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          required
        />
        <Typography fontSize={14} fontWeight="bold" >Senha:</Typography>
        <TextField
          label="Digite sua senha"
          type="password"
          value={password}
          onChange={e => setPassword(e.target.value)}
          required
        />
        <Button type="submit" variant="contained" fullWidth>Entrar</Button>
        <Typography
          variant="body2"
          sx={{
            mt: 2,
            color: 'primary.main',
            cursor: 'pointer',
            textDecoration: 'underline',
            '&:hover': { opacity: 0.8 },
            textAlign: 'center',
            fontSize:'10px'
          }}
          onClick={() => navigate('/register')}
        >
          Não é registrado? Cadastre-se
        </Typography>
      </Box>
    </Paper>
  );
};

export default LoginPage;
