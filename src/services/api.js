import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:8081', // URL do seu backend
});

// Exemplo de interceptor para injetar o token de autenticação (futuro)
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;