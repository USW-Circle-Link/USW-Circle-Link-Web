import store from './store/store';
import router from './router/index';
import axios from 'axios';

const instance = axios.create({
    baseURL: `${store.state.apiBaseUrl}`, // 실제 백엔드 URL로 교체
    // headers: {
    //     'Content-Type': 'application/json'
    // }
});
instance.interceptors.request.use(config => {
  const url = config.url || '';
  const isS3Presigned =
    /amazonaws\.com/.test(url) &&
    (config.method || 'get').toLowerCase() === 'put' &&
    /X-Amz-Algorithm=AWS4-HMAC-SHA256/.test(url);

  if (isS3Presigned) {
    // 프리사인 요청엔 토큰/쿠키/불필요 헤더 금지
    const ct = config.headers?.['Content-Type'];
    config.headers = ct ? { 'Content-Type': ct } : {};
    config.withCredentials = false;
    return config;
  }

  // 평소 API 요청엔 토큰 부착
  const token = store.state.accessToken;
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});
instance.interceptors.request.use(config => {
    const token = store.state.accessToken;
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
}, error => {
    return Promise.reject(error);
});

instance.interceptors.response.use(response => {
    return response;
}, async error => {
    const originalRequest = error.config;

    if (error.response && error.response.status === 401 && !originalRequest._retry) {
        originalRequest._retry = true;
        try {
            const newAccessToken = await store.dispatch('refreshToken');
            originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
            return axios(originalRequest); // 실패했던 요청을 새로운 토큰으로 재시도
        } catch (refreshError) {
            store.dispatch('logout'); // refreshToken 실패 시 로그아웃 처리
            router.push({ name: 'login' });
            return Promise.reject(refreshError);
        }
    }

    // 액세스 토큰 불일치 시 로그아웃 처리
    if (error.response && error.response.status === 403) {
        store.dispatch('logout');
        router.push({ name: 'login' });
    }

    return Promise.reject(error);
});

export default instance;