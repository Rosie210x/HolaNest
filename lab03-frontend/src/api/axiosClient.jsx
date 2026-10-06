import axios from 'axios';

const axiosClient = axios.create({
  baseURL: 'http://localhost:8080/api/v1',
  headers: {
    'Content-Type': 'application/json',
  },
});

axiosClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

axiosClient.interceptors.response.use(
  (response) => response.data,
  (error) => {
    const errorData = error.response?.data || {};
    
    return Promise.reject({
      status: error.response?.status,
      message: errorData.message || 'Có lỗi xảy ra, vui lòng thử lại',
      fieldErrors: errorData.fieldErrors || null,
      error: errorData.error || null,
    });
  }
);

export default axiosClient;
