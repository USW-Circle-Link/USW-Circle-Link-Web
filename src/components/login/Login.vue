<!-- src/components/Login.vue -->
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
          <span class="icon">👤</span>
          <input type="text" placeholder="ID" v-model="id" />
        </div>
        <div class="input-container">
          <span class="icon">🔒</span>
          <input type="password" placeholder="PASSWORD" v-model="password" />
        </div>
        <button type="submit" class="login-button">로그인</button>
      </form>
    </div>
  </div>
</template>

<script>
export default {
  name: "Login",
  data() {
    return {
      id: "",
      password: "",
      error: ""
    };
  },
  methods: {
    async login() {
      try {
        console.log('Sending login request with:', {
          username: this.id,
          password: this.password
        });

        const response = await fetch('https://e6551747-676d-480f-8cde-06e1b3913440.mock.pstmn.io/api/login', { // 여기에 Postman Mock 서버 URL을 사용하세요.
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            username: this.id,
            password: this.password
          })
        });

        console.log('Received response:', response);

        if (!response.ok) {
          throw new Error('Invalid credentials');
        }

        const data = await response.json();
        alert(`Login successful: ${JSON.stringify(data)}`);
        this.navigateToApp();
      } catch (error) {
        this.error = error.message;
        alert(`Error: ${this.error}`);
      }
    },
    navigateToApp() {
      this.$router.push({ name: 'main' }).catch(err => {
        if (err.name !== 'NavigationDuplicated') {
          throw err;
        }
      });
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
  color: #888888;
  font-size: 24px;
  font-weight: 300; /* 글씨를 얇게 만듭니다 */
  margin-bottom: 10px;
}

.logo-container {
  display: flex;
  align-items: center;
  justify-content: center;
}

.logo {
  height: 80px;
  margin-right: 5px;
}

.logo-text {
  color: #ffcc00;
  font-size: 48px;
  font-weight: bold;
}

.login-box {
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
  border: 1px solid #ddd;
  border-radius: 5px;
  padding: 10px;
  background-color: #fff;
}

.icon {
  font-size: 24px;
  margin-right: 10px;
  color: #888;
}

input {
  border: none;
  outline: none;
  flex-grow: 1;
  padding: 10px;
  font-size: 18px;
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

.navigate-button {
  width: 100%;
  padding: 15px;
  background-color: #ccc;
  border: none;
  border-radius: 5px;
  font-size: 16px;
  color: white;
  cursor: pointer;
  margin-top: 10px;
}

.navigate-button:hover {
  background-color: #bbb;
}
</style>
