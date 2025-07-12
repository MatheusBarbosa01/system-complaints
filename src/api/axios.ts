import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:8080/api/',
});

let requestInterceptorId: number | undefined;
let responseInterceptorId: number | undefined;

export const setupAxiosInterceptors = (token: string | null, logout: () => void) => {
  if (requestInterceptorId !== undefined) {
    api.interceptors.request.eject(requestInterceptorId);
  }
  if (responseInterceptorId !== undefined) {
    api.interceptors.response.eject(responseInterceptorId);
  }

  requestInterceptorId = api.interceptors.request.use(config => {
    if (token && config.headers && !config.url?.includes('/login')) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  });

  responseInterceptorId = api.interceptors.response.use(
    response => response,
    error => {
      const status = error?.response?.status;
      if (status === 401 || status === 403) {
        error.response.data = {
          ...error.response.data,
          message: 'Sessão expirada. Faça login novamente.',
        };
        logout();
      }
      return Promise.reject(error);
    }
  );
};

export default api;
