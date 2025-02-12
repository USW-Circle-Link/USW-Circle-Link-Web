import { createStore } from 'vuex';
import axios from 'axios';

export default createStore({
    state: {
        accessToken: localStorage.getItem('accessToken') || '',
        refreshToken: localStorage.getItem('refreshToken') || '',
        clubId: localStorage.getItem('clubId') || 0,
        role: localStorage.getItem('role') || '',
        isAgreedTerms: localStorage.getItem('isAgreedTerms') === 'true' || false,
    },
    mutations: {
        setAccessToken(state, token) {
            state.accessToken = token;
            localStorage.setItem('accessToken', token);
        },
        setRefreshToken(state, token) {
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
        setIsAgreedTerms(state, isAgreed) {
            state.isAgreedTerms = isAgreed;
            localStorage.setItem('isAgreedTerms', isAgreed);
        },
        clearAuthData(state) {
            state.accessToken = '';
            state.refreshToken = '';
            state.clubId = 0;
            state.role = '';
            state.isAgreedTerms = false;
            localStorage.removeItem('accessToken');
            localStorage.removeItem('refreshToken');
            localStorage.removeItem('clubId');
            localStorage.removeItem('role');
            localStorage.removeItem('isAgreedTerms');
        },
        setOverlappingMembers(state, members) {
            state.OverlappingMembers = members;
        }
    },
    actions: {
        async setAuthData({ commit }, { accessToken, refreshToken, role, clubId, isAgreedTerms }) {
            commit('setAccessToken', accessToken);
            commit('setRefreshToken', refreshToken);
            commit('setRole', role);
            if (clubId !== null) commit('setClubId', clubId);
            if (isAgreedTerms !== null) commit('setIsAgreedTerms', isAgreedTerms);
        },
        async refreshToken({ commit, state }) {
            try {
                let response;
                const currentRole = state.role;

                if (currentRole === 'LEADER') {
                    response = await axios.post('http://15.164.246.244:8080/club-leader/refresh-token', {
                        refreshToken: state.refreshToken
                    });
                } else if (currentRole === 'ADMIN') {
                    response = await axios.post('http://15.164.246.244:8080/admins/refresh-token', {
                        refreshToken: state.refreshToken
                    });
                } else {
                    throw new Error('Invalid role for token refresh');
                }

                if (response.data) {
                    const { accessToken, refreshToken } = response.data.data;
                    commit('setAccessToken', accessToken);
                    // 새로운 refresh token이 있다면 업데이트
                    if (refreshToken) {
                        commit('setRefreshToken', refreshToken);
                    }
                    return accessToken;
                }
            } catch (error) {
                commit('clearAuthData');
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
        role: state => state.role,
        isAgreedTerms: state => state.isAgreedTerms
    }
});