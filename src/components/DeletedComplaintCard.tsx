import React from 'react';
import { Card, CardContent, Typography, Stack, Fade } from '@mui/material';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import { ComplaintListDto } from '../features/complaints/complaintTypes';

interface Props {
  complaint: ComplaintListDto;
}

const DeletedComplaintCard: React.FC<Props> = ({ complaint }) => {
  return (
    <Fade in timeout={500}>
      <Card
        sx={{
          background: 'linear-gradient(145deg, #1e1e1e, #2a2a2a)',
          color: '#fff',
          boxShadow: '0 4px 20px rgba(0,0,0,0.3)',
          borderRadius: 2,
          transition: 'transform 0.3s ease',
        }}
      >
        <CardContent>
          <Stack direction="row" alignItems="center" spacing={1} mb={1}>
            <DeleteOutlineIcon color="error" />
            <Typography variant="h6" noWrap color="inherit">
              {complaint.title}
            </Typography>
          </Stack>
          <Typography variant="body2" color="gray">
            Resumo: {complaint.resumedDescription}
          </Typography>
          <Typography variant="body2" color="gray">
            Status: {complaint.status.replace(/_/g, ' ')}
          </Typography>
          <Typography variant="body2" color="gray">
            Prioridade: {complaint.priority}
          </Typography>
        </CardContent>
      </Card>
    </Fade>
  );
};

export default DeletedComplaintCard;
