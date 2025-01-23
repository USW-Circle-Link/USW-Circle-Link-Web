<template>
  <div class="login-container">
    <div class="header">
      <p class="subtitle">수원대학교 동아리 통합 관리 서비스</p>
      <div class="logo-container">
        <img src="@/assets/dongurami_logo.png" alt="Dongurami Logo" class="logo" />
        <span class="logo-text">동구라미</span>
      </div>
    </div>
    <div class="login-box">
      <form @submit.prevent="login">
        <div class="input-container" :class="{ 'focused': focusedElement === 'id' }">
          <span class="icon vector"></span>
          <input
              type="text"
              placeholder="아이디"
              v-model="id"
              required
              @focus="focusedElement = 'id'"
              @blur="focusedElement = null"
          />
        </div>
        <div class="input-container" :class="{ 'focused': focusedElement === 'password' }">
          <span class="icon password"></span>
          <input
              type="password"
              placeholder="비밀번호"
              v-model="password"
              required
              @focus="focusedElement = 'password'"
              @blur="focusedElement = null"
          />
        </div>

        <div class="custom-dropdown"
             @click="toggleDropdown"
             :class="{ 'focused': focusedElement === 'dropdown' }">
          <div class="dropdown-selected">
            {{ selectedOption || '동아리 관리자' }}
          </div>
          <span class="dropdown-icon">&#9662;</span>
          <ul v-if="isOpen" class="dropdown-options">
            <li
                v-for="option in options"
                :key="option"
                :class="{ 'dropdown-option-selected': option === selectedOption }"
                @click="selectOption(option)"
            >
              {{ option }}
            </li>
          </ul>
        </div>
        <button type="submit" class="login-button">로그인</button>
      </form>
    </div>
  </div>
  <div class="custom-popup" v-if="showFailurePopup">
    <div class="popup-content">
      <div class="popup-header">
        <p class="popup-title">로그인 실패</p>
      </div>
      <div class="popup-separator"></div>
      <div class="popup-body">
        <p class="popup-message">{{ failureMessage }}</p>
      </div>
      <button @click="showFailurePopup = false" class="close-button">확인</button>
    </div>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  name: "Login",
  data() {
    return {
      id: "", // 사용자 ID
      password: "", // 사용자 비밀번호
      loginType: "LEADER", // 로그인 타입 (기본값: LEADER)
      error: "", // 오류 메시지
      selectedOption: '동아리 관리자', // 드롭다운 기본값
      options: ['동아리 관리자', '동아리 연합회 / 개발팀'], // 드롭다운 옵션
      isOpen: false, // 드롭다운 열림 여부
      showFailurePopup: false, // 로그인 실패 팝업 표시 여부
      failureMessage: "", // 로그인 실패 메시지 종류
      focusedElement: null,
    };
  },
  methods: {
    toggleDropdown() { // 드롭다운 열기/닫기
      this.isOpen = !this.isOpen;
      this.focusedElement = this.isOpen ? 'dropdown' : null;
    },
    selectOption(option) { // 드롭다운 옵션 선택
      this.selectedOption = option;
      this.isOpen = false;
      this.focusedElement = null;

    },
    // 입력 값 검증: SQL 키워드 및 공백 검사
    validateInput(value) {
      const sqlKeywords = ["select", "insert", "update", "delete"];
      const regex = new RegExp(sqlKeywords.join("|"), "i"); // 대소문자 구분하지 않음

      // SQL 키워드가 포함된 경우와 공백이 포함된 경우 검사
      if (regex.test(value) || /\s/.test(value)) {
        return false;
      }
      return true;
    },

    async login() {
      // ID와 비밀번호 유효성 검사
      if (!this.validateInput(this.id) || !this.validateInput(this.password)) {
        this.error = "로그인 중 오류가 발생했습니다. 다시 시도해주세요.";
        alert(this.error);
        return;
      }

      const loginTypeMap = { // 드롭다운 옵션에 따른 로그인 타입 매핑
        "동아리 관리자": "LEADER",
        "동아리 연합회 / 개발팀": "ADMIN"
      };
      this.loginType = loginTypeMap[this.selectedOption] || null;

      try {
        // 서버에 요청을 보냄
        const response = await axios.post('http://15.164.246.244:8080/integration/login', {
          integratedAccount: this.id,
          integratedPw: this.password,
          loginType: this.loginType
        });

        if (response.data) {
          const { message, data } = response.data;
          const { accessToken, refreshToken, role, clubId } = data;

          // Vuex에 인증 데이터 저장하고 상태를 업데이트하는 액션 호출
          this.$store.dispatch('setAuthData', { accessToken, refreshToken, role, clubId });

          // role에 따라 라우팅
          if (role === 'LEADER') {
            this.$router.push({ name: 'main' });
          } else if (role === 'ADMIN') {
            this.$router.push({ name: 'adminmain' });
          }
        } else {
          throw new Error("서버 응답에 데이터가 없습니다.");
        }
      } catch (error) {
        const { code } = error.response?.data || {};


        if (code === 'USR-211') {
          this.failureMessage = "아이디 또는 비밀번호가 일치하지 않습니다.";
        } else if (code === 'ATTEMPT-503') {
          this.failureMessage = "최대 시도 횟수를 초과했습니다. 1분 후 다시 시도 하세요.";
        } else {
          this.failureMessage = "로그인 중 오류가 발생했습니다. 다시 시도해주세요.";
        }
        this.showFailurePopup = true;
      }
    }
  },
  mounted() {
    // 드롭다운 외부 클릭 감지를 위한 이벤트 리스너
    document.addEventListener('click', (e) => {
      const dropdown = e.target.closest('.custom-dropdown');
      if (!dropdown && this.isOpen) {
        this.isOpen = false;
        this.focusedElement = null;
      }
    });
  },
  beforeUnmount() {
    // 컴포넌트 제거 시 이벤트 리스너 제거
    document.removeEventListener('click', this.handleClickOutside);
  }
};
</script>

<style scoped>
.custom-popup {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 999;
}

.popup-content {
  background-color: white;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 0 20px rgba(0, 0, 0, 0.2);
  width: 400px;
  height: 130px;
  text-align: left; /* Align text to the left */
  position: relative;
  margin-top: 50px; /* 팝업창을 아래로 내리기 */
}

.popup-header {
  margin-bottom: 10px;
}

.popup-title {
  font-size: 18px;
  font-weight: bold;
  color: black;
  margin: 0; /* Remove extra spacing around the title */
}

.popup-separator {
  border-bottom: 1px solid #d3d3d3; /* Light gray line */
  margin: 10px 0;
}

.popup-body {
  margin-bottom: 20px;
}

.popup-message {
  font-size: 16px;
  color: #333333; /* Darker gray for the message */
  margin: 0; /* Remove extra spacing */
}

.close-button {
  background-color: #FFB052;
  color: white;
  border: none;
  padding: 7px 30px;
  border-radius: 5px;
  font-size: 16px;
  font-weight: 400;
  cursor: pointer;
  position: absolute;
  bottom: 20px;
  right: 20px;
}

.close-button:hover {
  background-color: #e6953e; /* Darker shade of the original color */
}

@import url('https://fonts.googleapis.com/css2?family=Jua&display=swap');

.login-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  background-color: #f0f0f0;
  width: 100%;
  padding: 20px;
  box-sizing: border-box;
  overflow: hidden;
}

.header {
  text-align: center;
  margin-bottom: 40px;
  width: 100%;
  max-width: 676px;
}

.subtitle {
  margin-bottom: 40px;
  text-align: center;
  color: #9D9D9D;
  font-family: Pretendard;
  font-size: 32px;
  font-style: normal;
  font-weight: 300;
  line-height: 14px; /* 43.75% */
}

.logo-container {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 5px;
}

.logo {
  height: 70px; /* 로고 높이 조정 */
  object-fit: contain; /* 이미지 비율 유지 */
  margin-top: -10px; /* 로고를 살짝 아래로 조정 */
}

.logo-text {
  color: #FFC01D;
  font-family: "Jua", sans-serif;
  font-size: 72px;
  font-weight: 400;
  line-height: 70px;
  letter-spacing: -1.775px;
  height: 70px; /* logo와 동일한 높이 설정 */
  display: flex;
  align-items: center;
}

.login-box {
  padding: 40px;
  width: 100%;
  max-width: 676px;
  height: 400px; /* 높이 고정 */
  border-radius: 16px;
  background: #FFF;
  box-shadow: 0px 0px 4px 0px rgba(0, 0, 0, 0.25);
}

form {
  display: flex;
  flex-direction: column;
  height: 100%;
  justify-content: space-between; /* 요소들 사이의 간격을 균일하게 배분 */
}

.input-container, .custom-dropdown {
  height: 74px;
  padding: 0 15px;
  background-color: #fff;
  display: flex;
  align-items: center;
  border-radius: 12px;
  border: 1px solid #D7D7D7;
  box-shadow: 0px 0px 4px 0px rgba(0, 0, 0, 0.25);
  font-size: 20px;
  padding-left: 25px;
}

.input-container input {
  height: 100%;
  padding: 0 10px;
  font-size: 20px;
  border: none;
  outline: none;
  width: 100%;
}

.input-container input::placeholder {
  color: #9D9D9D;
  font-size: 20px;
}

.icon {
  width: 26px;
  height: 26px;
  color: #9D9D9D;
}

.vector {
  background: url('@/assets/vector.svg') no-repeat center center;
}

.password {
  background: url('@/assets/password.svg') no-repeat center center;
}

input, select {
  border: none;
  outline: none;
  flex-grow: 1;
  padding: 10px;
  font-size: 18px;
  color: #9D9D9D; /* input, select 텍스트 색상 회색으로 설정 */
}

option {
  color: #888; /* option 텍스트 색상 회색으로 설정 */
}

.custom-dropdown {
  cursor: pointer;
  position: relative;
  justify-content: space-between;
}

.dropdown-selected {
  flex: 1;
  display: flex;
  align-items: center;
  color: #9D9D9D;
  font-size: 20px;
}

.dropdown-icon {
  font-size: 24px;
  color: #9D9D9D;
}

.dropdown-options {
  position: absolute;
  top: 100%;
  left: 0;
  width: 100%;
  border: 1px solid #D7D7D7;
  border-radius: 8px;
  margin-top: 5px;
  background-color: #fff;
  box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.1);
  color: #9D9D9D;
  z-index: 1;
  padding: 0; /* 기본 padding 제거 */
}

.dropdown-options li {
  padding: 20px 25px 20px 25px;
  cursor: pointer;
  font-size: 20px;
  transition: background-color 0.2s;
  list-style: none; /* 점 없애기 */
}

.dropdown-options li:first-child:hover {
  background-color: #ffe6c6;
  border-radius: 8px 8px 0px 0px;
}

.dropdown-options li:last-child:hover {
  background-color: #ffe6c6;
  border-radius: 0px 0px 8px 8px;
}

.dropdown-option-selected:first-child {
  background-color: #ffa726;
  color: white;
  border-radius: 8px 8px 0px 0px;
}

.dropdown-option-selected:last-child {
  background-color: #ffa726;
  color: white;
  border-radius: 0px 0px 8px 8px;
}

.dropdown-option-selected {
  background-color: #ffa726;
  color: white;
  pointer-events: none; /* 선택된 옵션에 커서 이벤트 비활성화 */
}

.login-button {
  height: 74px;
  color: white;
  font-size: 32px;
  font-weight: bold;
  cursor: pointer;
  transition: background-color 0.3s;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 12px;
  border: 1px solid #D7D7D7;
  background: #FFB052;
}


.login-button:hover {
  background-color: #e6953e;
}

.input-container.focused,
.custom-dropdown.focused {
  border-color: #FFB052;
  box-shadow: 0 0 0 2px rgba(255, 192, 29, 0.2);
}
</style>
