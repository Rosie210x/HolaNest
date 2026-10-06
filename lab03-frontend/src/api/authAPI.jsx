import axiosClient from './axiosClient';

export const authApi = {
  signin: (data) => axiosClient.post('/auth/signin', data), 

  signup: (data) => axiosClient.post('/auth/signup', data), 
};
