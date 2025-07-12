import React, { useState, useEffect } from 'react';
import {
  AppBar as MuiAppBar, Toolbar, IconButton, Typography, Box, CssBaseline,
  Drawer, List, ListItemButton, ListItemText, Divider, Menu, MenuItem, Avatar
} from '@mui/material';
import MarkChatReadRoundedIcon from '@mui/icons-material/MarkChatReadRounded';
import PlaylistAddRoundedIcon from '@mui/icons-material/PlaylistAddRounded';
import DeleteSweepRoundedIcon from '@mui/icons-material/DeleteSweepRounded';
import { styled } from '@mui/material/styles';
import MenuIcon from '@mui/icons-material/Menu';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext'; 
import api from '../api/axios';

const drawerWidth = 240;

const AppBar = styled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== 'open',
})<{ open?: boolean }>(({ theme, open }) => ({
  zIndex: theme.zIndex.drawer + 1,
  backgroundColor: '#1f1f1f',
  color: '#fff',
  boxShadow: '0 2px 10px rgba(0,0,0,0.3)',
  transition: theme.transitions.create(['width', 'margin'], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  ...(open && {
    marginLeft: drawerWidth,
    width: `calc(100% - ${drawerWidth}px)`,
  }),
}));

const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [open, setOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [userName, setUserName] = useState('');
  const { token, logout } = useAuth(); 
  const navigate = useNavigate();

  const handleMenuClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => setAnchorEl(null);

  const handleLogout = () => {
    handleClose();
    logout(); 
  };

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await api.get('/users/me');
        setUserName(res.data.name);
      } catch (err) {
        console.error('Erro ao buscar usuário logado', err);
      }
    };

    if (token) fetchUser();
  }, [token]);

  return (
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />

      <AppBar position="fixed" open={open}>
        <Toolbar sx={{ display: 'flex', justifyContent: 'space-between' }}>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <IconButton color="inherit" onClick={() => setOpen(!open)}>
              {open ? <ChevronLeftIcon /> : <MenuIcon />}
            </IconButton>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Typography variant="subtitle1" sx={{ mr: 1 }}>
              {userName}
            </Typography>
            <IconButton onClick={handleMenuClick}>
              <Avatar sx={{ width: 32, height: 32 }}>
                {userName ? userName.charAt(0) : 'U'}
              </Avatar>
            </IconButton>
            <Menu
              anchorEl={anchorEl}
              open={Boolean(anchorEl)}
              onClose={handleClose}
              anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
              transformOrigin={{ vertical: 'top', horizontal: 'right' }}
            >
              <MenuItem onClick={handleLogout}>Sair</MenuItem>
            </Menu>
          </Box>
        </Toolbar>
      </AppBar>

      <Drawer
        variant="persistent"
        anchor="left"
        open={open}
        sx={{
          '& .MuiDrawer-paper': {
            width: drawerWidth,
            backgroundColor: '#1e1e1e',
            color: '#fff',
          },
        }}
      >
        <Typography variant="h5" align="center" sx={{ p: 2 }}>
          Sistema de Reclamações
        </Typography>
        <Divider sx={{ borderColor: '#333' }} />
        <List>
          <ListItemButton onClick={() => navigate('/')}>
            <Box mr={3}>
              <MarkChatReadRoundedIcon fontSize='small' />
            </Box>
            <ListItemText secondary="Minhas Reclamações" />
          </ListItemButton>

          <ListItemButton onClick={() => navigate('/complaints/new')}>
            <Box mr={3}>
              <PlaylistAddRoundedIcon fontSize='small' />
            </Box>
            <ListItemText secondary="Nova Reclamação" />
          </ListItemButton>

          <ListItemButton onClick={() => navigate('/complaints/new')}>
            <Box mr={3}>
              <DeleteSweepRoundedIcon fontSize='small' />
            </Box>
            <ListItemText secondary="Reclamações Excluídas" />
          </ListItemButton>
        </List>
      </Drawer>

      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          transition: (theme) =>
            theme.transitions.create('margin', {
              easing: theme.transitions.easing.sharp,
              duration: theme.transitions.duration.leavingScreen,
            }),
          marginLeft: open ? 30 : 0,
        }}
      >
        <Toolbar />
        {children}
      </Box>
    </Box>
  );
};

export default Layout;
