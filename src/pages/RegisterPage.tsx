import React, { useState, FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';
import {
  TextField, Button, Paper, Typography, Box
} from '@mui/material';
import { toast } from 'react-toastify';

const RegisterPage: React.FC = () => {
  const [name, setName] = useState('');
  const [cpf, setCpf] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const formatCpf = (value: string) => {
    return value
      .replace(/\D/g, '')
      .replace(/(\d{3})(\d)/, '$1.$2')
      .replace(/(\d{3})(\d)/, '$1.$2')
      .replace(/(\d{3})(\d{1,2})$/, '$1-$2');
  };

  const handleCpfChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const rawValue = e.target.value;
    const formatted = formatCpf(rawValue);
    setCpf(formatted);
  };

  const handleRegister = async (e: FormEvent) => {
    e.preventDefault();

    try {
      await api.post('/users/register', {
        name,
        cpf: cpf.replace(/\D/g, ''), 
        email,
        password,
      });

      toast.success('Registro realizado com sucesso!');
      navigate('/login');
    } catch (err: any) {
      const backendMessage = err?.response?.data?.message || 'Erro ao registrar.';

      if (backendMessage.toLowerCase().includes('Cpf já cadastrado')) {
        toast.error('CPF já cadastrado!');
      } else if (backendMessage.toLowerCase().includes('email')) {
        toast.error('Email já cadastrado!');
      }else if(backendMessage.toLowerCase().includes('CPF Inválido!')){
        toast.error('CPF Inválido!')
      }
       else {
        toast.error(backendMessage);
      }
    }
  };

  return (
    <Paper elevation={3} sx={{ p: 4, maxWidth: 500, mx: 'auto', mt: 8 }}>
      <Typography variant="h4" mb={3} gutterBottom>Registro</Typography>
      <Box component="form" onSubmit={handleRegister} display="flex" flexDirection="column" gap={2}>
        <Typography fontSize={14} fontWeight="bold" >Nome:</Typography>
        <TextField
          label="Digite seu nome"
          value={name}
          onChange={e => setName(e.target.value)}
          required
        />
        <Typography fontSize={14} fontWeight="bold" >CPF:</Typography>
        <TextField
          label="Digite seu CPF"
          value={cpf}
          onChange={handleCpfChange}
          inputProps={{ maxLength: 14 }}
          required
        />
        <Typography fontSize={14} fontWeight="bold" >Email:</Typography>
        <TextField
          label="Digite seu Email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          required
        />
        <Typography fontSize={14} fontWeight="bold" >Senha:</Typography>
        <TextField
          label="Digite sua Senha"
          type="password"
          value={password}
          onChange={e => setPassword(e.target.value)}
          required
        />
        <Button type="submit" variant="contained" fullWidth>Cadastrar</Button>
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
                  onClick={() => navigate('/login')}
                >
                  Já possui uma conta? Entrar
                </Typography>
      </Box>
    </Paper>
  );
};

export default RegisterPage;
