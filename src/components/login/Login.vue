<template>
  <div class="login-container">
    <img src="@/assets/dongurami_logo.png" alt="Dongurami Logo" class="logo" />
    <div class="title">우리 학교 동아리 다 모임</div>
    <form class="login-form">
      <div class="input-group">
        <input type="text" placeholder="ID" v-model="id" />
      </div>
      <div class="input-group">
        <input type="password" placeholder="PASSWORD" v-model="password" />
      </div>
      <button type="submit" @click.prevent="login">로그인</button>
    </form>
    <button @click="navigateToApp">Go to Main App</button>
  </div>
</template>

<script>
export default {
  name: 'Login',
  methods: {
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
