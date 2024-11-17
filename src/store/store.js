// Vuex를 사용하여 상태 관리를 구현
import { createStore } from 'vuex';
import axios from 'axios'; // 서버와 통신을 위해 Axios를 임포트

export default createStore({
    state: {
        // 상태(state) 정의: 애플리케이션 전역에서 사용할 데이터 저장
        accessToken: localStorage.getItem('accessToken') || '', // 로컬 스토리지에서 accessToken 가져옴, 없으면 빈 문자열
        refreshToken: localStorage.getItem('refreshToken') || '', // 로컬 스토리지에서 refreshToken 가져옴, 없으면 빈 문자열
        clubId: localStorage.getItem('clubId') || 0, // 클럽 ID (기본값: 0)
        role: localStorage.getItem('role') || '' // 사용자 역할 (기본값: 빈 문자열)
    },
    mutations: {
        // 상태를 동기적으로 수정하는 메서드
        setAccessToken(state, token) {
            state.accessToken = token; // state의 accessToken을 갱신
            localStorage.setItem('accessToken', token); // 로컬 스토리지에 accessToken 저장
        },
        setRefreshToken(state, token) { // refreshToken 저장 로직
            state.refreshToken = token; // state의 refreshToken을 갱신
            localStorage.setItem('refreshToken', token); // 로컬 스토리지에 refreshToken 저장
        },
        setClubId(state, clubId) {
            state.clubId = clubId; // state의 clubId를 갱신
            localStorage.setItem('clubId', clubId); // 로컬 스토리지에 clubId 저장
        },
        setRole(state, role) {
            state.role = role; // state의 role을 갱신
            localStorage.setItem('role', role); // 로컬 스토리지에 role 저장
        },
        clearAuthData(state) {
            // 인증 데이터 초기화
            state.accessToken = ''; // accessToken 삭제
            state.refreshToken = ''; // refreshToken 삭제
            state.clubId = 0; // clubId 초기화
            state.role = ''; // role 초기화
            localStorage.removeItem('accessToken'); // 로컬 스토리지에서 accessToken 제거
            localStorage.removeItem('refreshToken'); // 로컬 스토리지에서 refreshToken 제거
            localStorage.removeItem('clubId'); // 로컬 스토리지에서 clubId 제거
            localStorage.removeItem('role'); // 로컬 스토리지에서 role 제거
        }
    },
    actions: {
        // mutations를 호출하는 메서드
        async setAuthData({ commit }, { accessToken, refreshToken, role, clubId }) {
            // 로그인 후 인증 데이터를 설정
            commit('setAccessToken', accessToken); // accessToken 저장
            commit('setRefreshToken', refreshToken); // refreshToken 저장
            commit('setClubId', clubId); // clubId 저장
            commit('setRole', role); // role 저장
        },
        async refreshToken({ commit, state }) {
            // 서버에 refreshToken을 사용하여 accessToken 갱신 요청
            try {
                const response = await axios.post('http://15.164.246.244:8080/integrate/refresh-token', {
                    refreshToken: state.refreshToken // 상태에 저장된 refreshToken 사용
                });

                const { accessToken } = response.data; // 새로 받은 accessToken
                commit('setAccessToken', accessToken); // accessToken 갱신
                return accessToken; // 새 accessToken 반환
            } catch (error) {
                commit('clearAuthData'); // refreshToken 갱신 실패 시 인증 데이터 초기화
                throw error; // 에러를 상위로 전달
            }
        },
        logout({ commit }) {
            // 로그아웃 처리
            commit('clearAuthData'); // 인증 데이터를 초기화
        }
    },
    getters: {
        // 상태를 기반으로 한 값을 반환하는 메서드
        isAuthenticated: state => !!state.accessToken, // 인증 여부 (accessToken이 존재하면 true)
        clubId: state => state.clubId, // 클럽 ID 반환
        role: state => state.role // 사용자 역할 반환
    }
});
