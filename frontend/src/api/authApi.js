import axiosClient from './axiosClient';

export const authApi = {
  signin: (data) => axiosClient.post('/auth/signin', data),

  signup: (data) => axiosClient.post('/auth/signup', data),

  signout: () => axiosClient.post('/auth/signout'),

  me: () => axiosClient.get('/auth/me'),

  checkLandlord: () => axiosClient.get('/landlord/access-check'),

  checkAdmin: () => axiosClient.get('/admin/access-check'),
};
