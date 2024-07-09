<template>
  <div class="login-container">
    <img src="@/assets/dongurami_logo.png" alt="Dongurami Logo" class="logo" />
    <div class="title">우리 학교 동아리 다 모임</div>
    <form class="login-form" @submit.prevent="login">
      <div class="input-group">
        <input type="text" placeholder="ID" v-model="id" />
      </div>
      <div class="input-group">
        <input type="password" placeholder="PASSWORD" v-model="password" />
      </div>
      <button type="submit">로그인</button>
    </form>
    <button @click="navigateToApp">다음 버튼 누르삼 (관리자 계정으로 로그인 되었다고 가정, 아직 개발중임 낑낑..)</button>
  </div>
</template>

<script>
export default {
  name: 'Login',
  data() {
    return {
      id: '',
      password: '',
      error: ''
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
  background-color: #f5f5f5;
}

.logo {
  width: 100px;
  margin-bottom: 20px;
}

.title {
  font-size: 20px;
  margin-bottom: 20px;
}

.login-form {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 300px;
}

.input-group {
  width: 100%;
  margin-bottom: 15px;
}

.input-group input {
  width: 100%;
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 5px;
}

button {
  width: 100%;
  padding: 10px;
  border: none;
  border-radius: 5px;
  background-color: #ffcc00;
  color: white;
  font-size: 16px;
  cursor: pointer;
}

button + button {
  margin-top: 10px;
  background-color: #ccc;
}
</style>


