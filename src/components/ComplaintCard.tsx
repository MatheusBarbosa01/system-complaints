import React from 'react';
import { Card, CardContent, Typography, Stack, Fade } from '@mui/material';
import ReportProblemIcon from '@mui/icons-material/ReportProblem';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import HourglassTopIcon from '@mui/icons-material/HourglassTop';
import { ComplaintListDto } from '../features/complaints/complaintTypes';

interface Props {
  complaint: ComplaintListDto;
  onClick: () => void;
}

const ComplaintCard: React.FC<Props> = ({ complaint, onClick }) => {
  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'PENDENTE': return <HourglassTopIcon color="warning" />;
      case 'RESOLVIDO': return <CheckCircleIcon color="success" />;
      default: return <ReportProblemIcon color="error" />;
    }
  };

  return (
    <Fade in timeout={500}>
      <Card
        onClick={onClick}
        sx={{
          background: 'linear-gradient(145deg, #1e1e1e, #2a2a2a)',
          color: '#fff',
          boxShadow: '0 4px 20px rgba(0,0,0,0.3)',
          borderRadius: 2,
          cursor: 'pointer',
          transition: 'transform 0.3s ease',
          '&:hover': {
            transform: 'scale(1.03)',
            boxShadow: '0 6px 30px rgba(0,0,0,0.4)',
          },
        }}
      >
        <CardContent>
          <Stack direction="row" alignItems="center" spacing={1} mb={1}>
            {getStatusIcon(complaint.status)}
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

export default ComplaintCard;
