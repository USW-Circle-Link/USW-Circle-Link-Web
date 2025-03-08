import { createStore } from 'vuex';
import axios from 'axios';

export default createStore({
    state: {
        accessToken: localStorage.getItem('accessToken') || '',
        refreshToken: localStorage.getItem('refreshToken') || '',
        clubUUID: localStorage.getItem('clubUUID') || 0,
        role: localStorage.getItem('role') || '',
        isAgreedTerms: localStorage.getItem('isAgreedTerms') === 'true' || false,
        shouldUpdateSidebar: false,
        apiBaseUrl: 'http://15.164.246.244:8080'
    },
    mutations: {
        SET_SIDEBAR_UPDATE(state, value) {
            state.shouldUpdateSidebar = value;
        },
        setAccessToken(state, token) {
            state.accessToken = token;
            localStorage.setItem('accessToken', token);
        },
        setRefreshToken(state, token) {
            state.refreshToken = token;
            localStorage.setItem('refreshToken', token);
        },
        setClubId(state, clubUUID) {
            state.clubUUID = clubUUID;
            localStorage.setItem('clubUUID', clubUUID);
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
            state.clubUUID = 0;
            state.role = '';
            state.isAgreedTerms = false;
            localStorage.removeItem('accessToken');
            localStorage.removeItem('refreshToken');
            localStorage.removeItem('clubUUID');
            localStorage.removeItem('role');
            localStorage.removeItem('isAgreedTerms');
            localStorage.removeItem('addedMembers');
            localStorage.removeItem('requestedMembers');
            localStorage.removeItem('firstVisit');
        },
        setOverlappingMembers(state, members) {
            state.OverlappingMembers = members;
        }
    },
    actions: {
        triggerSidebarUpdate({ commit }) {
            commit('SET_SIDEBAR_UPDATE', true);
        },
        async setAuthData({ commit }, { accessToken, refreshToken, role, clubUUID, isAgreedTerms }) {
            commit('setAccessToken', accessToken);
            commit('setRefreshToken', refreshToken);
            commit('setRole', role);
            if (clubUUID !== null) commit('setClubId', clubUUID);
            if (isAgreedTerms !== null) commit('setIsAgreedTerms', isAgreedTerms);
        },
        async refreshToken({ commit, state }) {
            try {
                let response;
                const currentRole = state.role;

                if (currentRole === 'LEADER') {
                    response = await axios.post(`${state.apiBaseUrl}/club-leader/refresh-token`, {
                        refreshToken: state.refreshToken
                    });
                } else if (currentRole === 'ADMIN') {
                    response = await axios.post(`${state.apiBaseUrl}/admins/refresh-token`, {
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
        clubUUID: state => state.clubUUID,
        role: state => state.role,
        isAgreedTerms: state => state.isAgreedTerms
    }
});