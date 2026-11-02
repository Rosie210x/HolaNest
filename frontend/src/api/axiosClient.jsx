import axios from 'axios';

// Tokens are in httpOnly cookies that the browser sends by itself; this code never sees them.
// axios copies the XSRF-TOKEN cookie into the X-XSRF-TOKEN header on state-changing requests.
const axiosClient = axios.create({
  baseURL: '/api/v1',
  withCredentials: true,
  withXSRFToken: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

const NO_REFRESH_PATHS = ['/auth/signin', '/auth/signup', '/auth/signout', '/auth/refresh'];

// One refresh at a time: parallel 401s share it, because a refresh token works only once
let refreshing = null;

const refreshSession = () => {
  refreshing ??= axiosClient.post('/auth/refresh').finally(() => {
    refreshing = null;
  });
  return refreshing;
};

axiosClient.interceptors.response.use(
  (response) => response.data,
  async (error) => {
    const original = error.config;
    if (
      error.response?.status === 401 &&
      original &&
      !original.retried &&
      !NO_REFRESH_PATHS.includes(original.url)
    ) {
      original.retried = true;
      try {
        await refreshSession();
      } catch {
        return Promise.reject(toApiError(error));
      }
      return axiosClient(original);
    }
    return Promise.reject(toApiError(error));
  }
);

function toApiError(error) {
  // Already converted when it comes from the nested refresh call
  if (!error.isAxiosError) {
    return error;
  }
  const errorData = error.response?.data || {};
  return {
    status: error.response?.status,
    code: errorData.code || null,
    message: errorData.message || 'Đã có lỗi xảy ra. Vui lòng thử lại sau.',
    fieldErrors: errorData.fieldErrors || null,
  };
}

export default axiosClient;
