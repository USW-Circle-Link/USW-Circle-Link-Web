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
          <span class="icon"></span>
          <input type="text" placeholder="ID" v-model="id" required />
        </div>
        <div class="input-container">
          <span class="icon"></span>
          <input type="password" placeholder="PASSWORD" v-model="password" required />
        </div>

        <div class="input-container">
          <select v-model="loginType" required>
            <option value="LEADER">동아리 관리자</option>
            <option value="ADMIN">동아리 연합회/개발팀</option>
          </select>
        </div>
        <button type="submit" class="login-button">로그인</button>
      </form>
    </div>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  name: "Login",
  data() {
    return {
      id: "",
      password: "",
      loginType: "LEADER",
      error: ""
    };
  },
  methods: {
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

      try {
        // 서버에 요청을 보냄
        const response = await axios.post('http://15.164.246.244:8080/integration/login', {
          integratedAccount: this.id,
          integratedPw: this.password,
          loginType: this.loginType
        });

        const { message, data } = response.data;
        const { accessToken, refreshToken, role, clubId } = data;

        // 성공 메시지를 팝업으로 띄우기
        alert(message);

        // Vuex에 저장하고 상태를 업데이트하는 액션 호출
        this.$store.dispatch('setAuthData', { accessToken, refreshToken, role, clubId });

        // role에 따라 라우팅
        if (role === 'LEADER') {
          this.$router.push({ name: 'main' });
        } else if (role === 'ADMIN') {
          this.$router.push({ name: 'adminmain' });
        }
      } catch (error) {
        const { message, code } = error.response.data;

        if (code === 'USR-211') {
          alert("아이디 혹은 비밀번호가 일치하지 않습니다");
        } else if (code === 'ATTEMPT-503') {
          alert("최대 시도 횟수를 초과했습니다. 1분 후 다시 시도 하세요");
        } else {
          this.error = "로그인 중 오류가 발생했습니다. 다시 시도해주세요.";
          alert(this.error);
        }
      }
    }
  }
};
</script>

<style scoped>
.login-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100vh;
  background-color: #f0f0f0;
}

.header {
  text-align: center;
  margin-bottom: 80px;
}

.subtitle {
  color: #C0C0C0F7;
  font-size: 34px;
  font-weight: 320;
  margin-bottom: 10px;
  margin-left: 30px;
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
  color: #FFC700;
  font-family: "Jalnan";
  font-style: normal;
  font-size: 60px;
  font-weight: bold;
  line-height: 14px;
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
}

.icon {
  font-size: 24px;
  margin-right: 10px;
  color: #888;
}

input, select {
  border: none;
  outline: none;
  flex-grow: 1;
  padding: 10px;
  font-size: 18px;
  color: #888; /* input, select 텍스트 색상 회색으로 설정 */
}

option {
  color: #888; /* option 텍스트 색상 회색으로 설정 */
}

.login-button {
  width: 100%;
  padding: 15px;
  background-color: #ffcc00;
  border: none;
  border-radius: 5px;
  font-size: 18px;
  font-weight: bold;
  color: white;
  cursor: pointer;
}

.login-button:hover {
  background-color: #e6b800;
}
</style>