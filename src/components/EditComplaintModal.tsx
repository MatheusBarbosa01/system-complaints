import React, { useState, useEffect } from 'react';
import {
  Box, Typography, TextField, Button, MenuItem, Modal
} from '@mui/material';
import { ComplaintStatusEnum } from '../features/complaints/complaintTypes';

interface EditComplaintModalProps {
  open: boolean;
  initialDescription: string;
  initialStatus: string;
  onClose: () => void;
  onSave: (description: string, status: string) => void;
  loading?: boolean;
}

export const statusOptions = Object.entries(ComplaintStatusEnum).map(([key, value]) => ({
    value,
    label: key.replace(/_/g, ' '),
  }));

export const EditComplaintModal: React.FC<EditComplaintModalProps> = ({
  open,
  initialDescription,
  initialStatus,
  onClose,
  onSave,
  loading = false,
}) => {
  const [description, setDescription] = useState(initialDescription);
  const [status, setStatus] = useState(initialStatus);

  useEffect(() => {
    if (open) {
      setDescription(initialDescription);
      setStatus(initialStatus);
    }
  }, [open, initialDescription, initialStatus]);

  const handleSave = () => {
    onSave(description, status);
  };

  return (
    <Modal open={open} onClose={onClose}>
      <Box sx={{
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: 400,
        bgcolor: 'background.paper',
        p: 4,
        borderRadius: 2,
        boxShadow: 24,
      }}>
        <Typography variant="h6" gutterBottom>Editar Reclamação</Typography>

        <TextField
          fullWidth
          multiline
          rows={4}
          label="Descrição"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          sx={{ mb: 2 }}
        />

        <TextField
          select
          fullWidth
          label="Status"
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          sx={{ mb: 2 }}
        >
          {statusOptions.map(option => (
            <MenuItem key={option.value} value={option.value}>
              {option.label}
            </MenuItem>
          ))}
        </TextField>

        <Button
          variant="contained"
          fullWidth
          onClick={handleSave}
          disabled={loading}
        >
          {loading ? 'Atualizando...' : 'Salvar'}
        </Button>
      </Box>
    </Modal>
  );
};
