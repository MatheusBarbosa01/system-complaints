import { createContext, useContext, useState, ReactNode } from 'react';
import api from '../api/axios';
import { ComplaintListDto } from '../features/complaints/complaintTypes';
import { Page } from '../features/Page/PageType';

interface ComplaintsContextType {
  list: ComplaintListDto[];
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
  page: number;
  totalPages: number;
  pageSize: number;
  priorityFilter?: string;
  fetchComplaints: (options?: { page?: number; priority?: string }) => Promise<void>;
  fetchDeletedComplaints: (options?: { page?: number; priority?: string }) => Promise<void>;
  setPriorityFilter: (priority?: string) => void;
  setPage: (page: number) => void;
}

const ComplaintsContext = createContext<ComplaintsContextType | undefined>(undefined);

export const ComplaintsProvider = ({ children }: { children: ReactNode }) => {
  const [list, setList] = useState<ComplaintListDto[]>([]);
  const [status, setStatus] = useState<'idle' | 'loading' | 'succeeded' | 'failed'>('idle');
  const [error, setError] = useState<string | null>(null);
  const [page, setPageState] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [pageSize] = useState(9);
  const [priorityFilter, setPriorityFilterState] = useState<string | undefined>(undefined);

  const fetchComplaints = async (options?: { page?: number; priority?: string }) => {
    setStatus('loading');
    setError(null);
  
    const currentPage = options?.page ?? page;
    const currentPriority = options?.priority ?? priorityFilter;
  
    try {
      let response;
      if (currentPriority && currentPriority !== 'todas') {
        response = await api.post<Page<ComplaintListDto>>('/complaints/filter',
          { priority: currentPriority },
          { params: { page: currentPage, size: pageSize } }
        );
      } else {
        response = await api.get<Page<ComplaintListDto>>('/complaints', {
          params: { page: currentPage, size: pageSize }
        });
      }
  
      setList(Array.isArray(response.data.content) ? response.data.content : []);
      setTotalPages(response.data.totalPages);
      setPageState(currentPage); 
      setStatus('succeeded');
      setError(null);
    } catch (err: any) {
      const msg = err?.response?.data?.message || err.message || 'Erro ao buscar reclamações.';
      setStatus('failed');
      setError(msg);
    }
  };
  
  const fetchDeletedComplaints = async (options?: { page?: number; priority?: string }) => {
    setStatus('loading');
    setError(null);
    const currentPage = options?.page ?? page;
  
    try {
      const response = await api.get<Page<ComplaintListDto>>('/complaints/deleted', {
        params: { page: currentPage, size: pageSize }
      });
  
      setList(Array.isArray(response.data.content) ? response.data.content : []);
      setTotalPages(response.data.totalPages);
      setPageState(currentPage);
      setStatus('succeeded');
    } catch (err: any) {
      const msg = err?.response?.data?.message || err.message || 'Erro ao buscar reclamações.';
      setStatus('failed');
      setError(msg);
    }
  };
  
  const setPriorityFilter = (priority?: string) => {
    setPriorityFilterState(priority);
  };

  const setPage = (page: number) => {
    setPageState(page);
    fetchComplaints({ page });
  };

  return (
    <ComplaintsContext.Provider
      value={{
        list,
        status,
        error,
        page,
        totalPages,
        pageSize,
        priorityFilter,
        fetchComplaints,
        fetchDeletedComplaints,
        setPriorityFilter,
        setPage,
      }}
    >
      {children}
    </ComplaintsContext.Provider>
  );
};

export const useComplaints = (): ComplaintsContextType => {
  const context = useContext(ComplaintsContext);
  if (!context) throw new Error('useComplaints must be used within ComplaintsProvider');
  return context;
};
