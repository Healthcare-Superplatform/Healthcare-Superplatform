import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:5001/api',
  timeout: 10000
});

// Request interceptor
api.interceptors.request.use(config => {
  console.log('[API Request]', config.method?.toUpperCase(), config.url);
  return config;
});

// Response interceptor
api.interceptors.response.use(
  response => response.data,
  error => {
    const errorInfo = {
      status: error.response?.status || 500,
      message: error.response?.data?.message || 'Network Error',
      url: error.config?.url
    };
    
    console.error('[API Error]', errorInfo);
    return Promise.reject(errorInfo);
  }
);

// Encapsulate common API calls
export const apiClient = {
  getHealth: () => api.get('/health'),
  getUsers: () => api.get('/users'),
  getMedicalList: (location) => 
    api.get('/medical_list', { params: { location } }),
  getPersonalRecords: (ssn) => 
    api.get(`/own_medical?ssn=${encodeURIComponent(ssn)}`),
  searchMedicine: (disease) => 
    api.get(`/search_medicine?disease=${encodeURIComponent(disease)}`),
  getRecommendations: (ssn) => 
    api.get(`/recommendations/${ssn}`)
};
