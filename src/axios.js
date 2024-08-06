// src/axios.js
import axios from 'axios';

const instance = axios.create({
    baseURL: 'https://7f3ee9de-97fd-4e90-8d39-9dd706fe01ea.mock.pstmn.io/api/login', // 백엔드 URL로 교체하세요.
    headers: {
        'Content-Type': 'application/json'
    }
});

instance.interceptors.request.use(config => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
}, error => {
    return Promise.reject(error);
});

instance.interceptors.response.use(response => {
    return response;
}, error => {
    if (error.response && error.response.status === 401) {
        // 401 Unauthorized 에러 처리
        localStorage.removeItem('token');
        window.location = '/login'; // 로그인 페이지로 리다이렉트
    }
    return Promise.reject(error);
});

export default instance;
