import React from 'react';
import { Paper, Typography, Box } from '@mui/material';

export const ChatBubble = ({ children }: { children: React.ReactNode }) => (
  <Box sx={{ position: 'relative', mb: 3 }}>
    <Paper
      sx={{
        p: 2,
        borderRadius: 2,
        maxWidth: '100%',
        position: 'relative',
      }}
    >
      {children}
    </Paper>
    <Box
      sx={{
        position: 'absolute',
        left: -5,
        top: 0,
        width: 0,
        height: 0,
        borderTop: '8px solid transparent',
        borderBottom: '8px solid transparent',
        borderRight: '10px solid #292929',
      }}
    />
  </Box>
);
