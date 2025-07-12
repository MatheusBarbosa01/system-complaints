import { createContext, useContext, useState, ReactNode } from 'react';
import api from '../api/axios';
import { ComplaintListDto } from '../features/complaints/complaintTypes';

interface ComplaintsContextType {
  list: ComplaintListDto[];
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
  fetchComplaints: (filters?: { priority?: string }) => Promise<void>;
}

const ComplaintsContext = createContext<ComplaintsContextType | undefined>(undefined);

export const ComplaintsProvider = ({ children }: { children: ReactNode }) => {
  const [list, setList] = useState<ComplaintListDto[]>([]);
  const [status, setStatus] = useState<'idle' | 'loading' | 'succeeded' | 'failed'>('idle');
  const [error, setError] = useState<string | null>(null);

  const fetchComplaints = async (filters?: { priority?: string }) => {
    setStatus('loading');
    try {
      const response =
        filters && filters.priority && filters.priority !== 'todas'
          ? await api.post<ComplaintListDto[]>('/complaints/filter', { priority: filters.priority })
          : await api.get<ComplaintListDto[]>('/complaints');

      setList(response.data);
      setStatus('succeeded');
      setError(null);
    } catch (err: any) {
      const msg = err?.response?.data?.message || err.message || 'Erro ao buscar reclamações.';
      setStatus('failed');
      setError(msg);
    }
  };

  return (
    <ComplaintsContext.Provider value={{ list, status, error, fetchComplaints }}>
      {children}
    </ComplaintsContext.Provider>
  );
};

export const useComplaints = (): ComplaintsContextType => {
  const context = useContext(ComplaintsContext);
  if (!context) throw new Error('useComplaints must be used within ComplaintsProvider');
  return context;
};
