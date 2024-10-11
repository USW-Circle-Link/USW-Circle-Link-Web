import store from './store/store';
import router from './router/index';
import axios from 'axios';

const instance = axios.create({
    baseURL: 'http://15.164.246.244:8080', // 실제 백엔드 URL로 교체
    headers: {
        'Content-Type': 'application/json'
    }
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