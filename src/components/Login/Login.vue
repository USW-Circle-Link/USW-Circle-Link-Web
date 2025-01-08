<template>
  <div class="login-container">
    <div class="header">
      <p class="subtitle">우리 학교 동아리 다 모임</p>
      <div class="logo-container">
        <img src="@/assets/dongurami_logo.png" alt="Dongurami Logo" class="logo" />
        <span class="logo-text">동구라미</span>
      </div> 
    </div>
    <div class="login-box">
      <form @submit.prevent="login">
        <div class="input-container">
          <span class="icon vector"></span>
          <input type="text" placeholder="ID" v-model="id" required />        <!-- ID 입력 필드 -->
        </div>
        <div class="input-container">
          <span class="icon password"></span>
          <input type="password" placeholder="PASSWORD" v-model="password" required />        <!-- 비밀번호 입력 필드 -->
        </div>

        <div class="custom-dropdown" @click="toggleDropdown">
          <div class="dropdown-selected">
            {{ selectedOption || '동아리 관리자' }}             <!-- 선택된 옵션 표시 (기본값: 동아리 관리자) -->
          </div>
          <span class="dropdown-icon">&#9662;</span>
          <ul v-if="isOpen" class="dropdown-options" >
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
    };
  },
  methods: {
    toggleDropdown() { // 드롭다운 열기/닫기
      this.isOpen = !this.isOpen;
    },
    selectOption(option) { // 드롭다운 옵션 선택
      this.selectedOption = option;
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
  margin-top: 185px; /* 팝업창을 아래로 내리기 */
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
  height: 90vh;
  background-color: #f0f0f0;
}

.header {
  text-align: center;
  margin-bottom: 70px;
}

.subtitle {
  color: #9D9D9D;
  font-size: 33px;
  font-weight: 310;
  margin-bottom: 20px;
  margin-left: 20px;
  text-align: center; /* 문구 가운데 정렬 */
}

.logo-container {
  display: flex;
  align-items: center;
  justify-content: center;
}

.logo {
  height: 64px;
  margin-right: 5px;
}

.logo-text {
  color: #FFC01D;
  text-align: center;
  font-family: "Jua", sans-serif; /* Ensure fallback font is provided */
  font-size: 72px;
  font-style: normal;
  font-weight: 400;
  line-height: 71px; /* 98.611% */
  letter-spacing: -1.775px;
}
.login-box {
  margin-top: 0px;
  background: white;
  padding: 40px;
  border-radius: 10px;
  box-shadow: 0 0 20px rgba(0, 0, 0, 0.1);
  width: 600px;
}

.input-container {
  display: flex;
  align-items: center;
  margin-bottom: 20px;
  border: 1.5px solid #e7e7e7;
  border-radius: 5px;
  padding: 10px;
  background-color: #fff;
  flex-direction: row;
}

.input-container input::placeholder{
  color: #9D9D9D;
  font-size: 16px;
}

.icon {
  width: 26px;
  height: 26px;
  color: #9D9D9D;
  margin-left: 10px;
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
  position: relative;
  user-select: none;
  display: flex;
  align-items: center;
  margin-bottom: 20px;
  border: 1.5px solid #e7e7e7;
  border-radius: 5px;
  padding: 10px 15px 10px 15px;
  background-color: #fff;
  justify-content: space-between;
  cursor: pointer;
}

.dropdown-selected {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 10px;
  border-radius: 5px;
  background-color: #fff;
  cursor: pointer;
  color: #9D9D9D;
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
  font-size: 16px;
  transition: background-color 0.2s;
  list-style: none; /* 점 없애기 */
}

.dropdown-options li:first-child:hover {
  background-color: #FFB052;
  border-radius: 8px 8px 0px 0px;
}

.dropdown-options li:last-child:hover {
  background-color: #FFB052;
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

.login-button {
  width: 100%;
  padding: 15px;
  margin-left: 1px;
  background-color: #FFB052;
  border: none;
  border-radius: 5px;
  font-size: 18px;
  font-weight: bold;
  color: white;
  cursor: pointer;
}

.login-button:hover {
  background-color: #FFB052;
}
</style>
