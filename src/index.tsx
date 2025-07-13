import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';

import { CssBaseline, ThemeProvider } from '@mui/material';

import theme from './theme';
import { ToastContainer } from 'react-toastify';

const root = ReactDOM.createRoot(document.getElementById('root')!);
root.render(
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <App />
      <ToastContainer position="top-center" autoClose={3000} />
    </ThemeProvider>
);
