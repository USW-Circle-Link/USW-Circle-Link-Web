import { createStore } from 'vuex';
import axios from 'axios';

export default createStore({
    state: {
        accessToken: localStorage.getItem('accessToken') || '',
        refreshToken: localStorage.getItem('refreshToken') || '', // refreshToken 추가
        clubId: localStorage.getItem('clubId') || 0,
        role: localStorage.getItem('role') || '',
    },
    mutations: {
        setAccessToken(state, token) {
            state.accessToken = token;
            localStorage.setItem('accessToken', token);
        },
        setRefreshToken(state, token) { // refreshToken 저장
            state.refreshToken = token;
            localStorage.setItem('refreshToken', token);
        },
        setClubId(state, clubId) {
            state.clubId = clubId;
            localStorage.setItem('clubId', clubId);
        },
        setRole(state, role) {
            state.role = role;
            localStorage.setItem('role', role);
        },
        clearAuthData(state) {
            state.accessToken = '';
            state.refreshToken = ''; // refreshToken 제거
            state.clubId = 0;
            state.role = '';
            localStorage.removeItem('accessToken');
            localStorage.removeItem('refreshToken'); // refreshToken 제거
            localStorage.removeItem('clubId');
            localStorage.removeItem('role');
        }
    },
    actions: {
        async setAuthData({ commit }, { accessToken, refreshToken, role, clubId }) {
            commit('setAccessToken', accessToken);
            commit('setRefreshToken', refreshToken); // refreshToken 저장
            commit('setClubId', clubId);
            commit('setRole', role);
        },
        async refreshToken({ commit, state }) {
            try {
                const response = await axios.post('http://15.164.246.244:8080/integrate/refresh-token', {
                    refreshToken: state.refreshToken
                });

                const { accessToken } = response.data;
                commit('setAccessToken', accessToken);
                return accessToken;
            } catch (error) {
                commit('clearAuthData'); // refreshToken 실패 시 로그아웃 처리
                throw error;
            }
        },
        logout({ commit }) {
            commit('clearAuthData');
        }
    },
    getters: {
        isAuthenticated: state => !!state.accessToken,
        clubId: state => state.clubId,
        role: state => state.role
    }
});
