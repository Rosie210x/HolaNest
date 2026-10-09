import axios from 'axios';

const axiosClient = axios.create({
  baseURL: 'http://localhost:8080/api/v1',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Token do AuthContext cung cấp (giữ trong bộ nhớ, không dùng localStorage)
let accessToken = null;

export const setAccessToken = (token) => {
  accessToken = token;
};

axiosClient.interceptors.request.use(
  (config) => {
    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
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
