<template>
  <div class="header">
    <div class="header-content">
      <img
          src="../../assets/dongurami_logo.png"
          alt="Dongurami Logo"
          class="logo"
          @click="navigateTo('dashboard')"
          style="cursor: pointer;"
      />
      <h1 class="title" @click="navigateTo('dashboard')" style="cursor: pointer;">동구라미</h1>
      <!--    <NotificationButton/>-->
    </div>
    <!-- 햄버거 메뉴 버튼 (반응형에서만 표시) -->
    <div class="hamburger-menu" @click="toggleSidebar">
      <svg v-if="!isMenuOpen" xmlns="http://www.w3.org/2000/svg" height="40px" viewBox="0 -960 960 960" width="40px" fill="#e3e3e3">
        <path d="M120-240v-80h720v80H120Zm0-200v-80h720v80H120Zm0-200v-80h720v80H120Z"/>
      </svg>
      <svg v-else xmlns="http://www.w3.org/2000/svg" height="40px" viewBox="0 -960 960 960" width="40px" fill="#e3e3e3">
        <path d="M120-240v-80h720v80H120Zm0-200v-80h720v80H120Zm0-200v-80h720v80H120Z"/>
      </svg>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Headbar',
  data() {
    return {
      isMenuOpen: false
    };
  },
  methods: {
    navigateTo(route) {
      // 라우터를 사용하여 지정된 경로로 이동
      this.$router.push({ name: route });
    },
    toggleSidebar() {
      this.isMenuOpen = !this.isMenuOpen;
      // 부모 컴포넌트(Main.vue)에 사이드바 토글 이벤트 전달
      this.$emit('toggle-sidebar', this.isMenuOpen);
    } 
  }
};
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Jua&display=swap');

.header {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 86px;
  background: #fff;
  box-shadow: 0px 2.5px 0px 0px rgba(0, 0, 0, 0.13);
  margin-bottom: 40px;
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 500;
}

.header-content {
  display: flex;
  align-items: center;
  transition: all 0.3s ease;
  margin-left: 230px;
}

.logo {
  width: 30px;
  height: 25px;
  padding: 5px;
  transform: scaleX(-1);
}

.title {
  color: #FFC01D;
  font-family: "Jua", sans-serif;
  font-size: 20px;
  font-style: normal;
  font-weight: 405;
  line-height: 14px; /* 100% */
}
.hamburger-menu {
  display: none;
  cursor: pointer;
  padding: 10px;
  margin-right: 20px;
  align-items: center;
  justify-content: center;
}

.hamburger-menu svg {
  transition: fill 0.3s ease;
}

.hamburger-menu:hover svg {
  fill: #FFC01D;
}
/* 반응형 스타일 */
@media (max-width: 1300px) {
  .hamburger-menu {
    display: flex;
  }
  
  .header-content {
    margin-left: 20px;
  }
}

@media (max-width: 768px) {
  .hamburger-menu {
    display: flex;
  }
}

@media (max-width: 576px) {
  .hamburger-menu {
    display: flex;
  }
  .header-content {
    margin-left: 10px;
  }
}
</style>