<template>
  <div id="main">
    <HeadBar ref="headbar" @toggle-sidebar="handleSidebarToggle" />
    <div class="main-content" :class="{ 'sidebar-hidden': !showSidebar }">
      <transition name="slide">
        <SidebarMenu v-if="showSidebar" class="sidebar" />
      </transition>
      <div class="content" :class="{ 'full-width': !showSidebar }">
        <router-view />
      </div>
    </div>
    <!-- 모바일 사이드바 오버레이 -->
    <div v-if="showSidebar && windowWidth < 1300" class="sidebar-overlay" @click="closeSidebar"></div>
  </div>
</template>

<script>
import SidebarMenu from './SidebarMenu.vue';
import HeadBar from './HeadBar.vue';

export default {
  name: 'adminmain',
  components: {
    SidebarMenu,
    HeadBar,
  },
  data() {
    return {
      showSidebar: true,
      windowWidth: window.innerWidth
    };
  },
  mounted() {
    this.checkWindowSize(); // 꼭 호출!
    window.addEventListener('resize', this.checkWindowSize);
  },
  beforeUnmount() {
    window.removeEventListener('resize', this.checkWindowSize);
  },
  methods: {
    checkWindowSize() {
      this.windowWidth = window.innerWidth;
      // 화면 너비가 1300px 미만이면 사이드바를 자동으로 숨김
      if (this.windowWidth < 1300) {
        this.showSidebar = false;
      } else {
        this.showSidebar = true;
      }
    },
    handleSidebarToggle(isOpen) {
      // 햄버거 메뉴에서 전달받은 상태로 사이드바 토글
      this.showSidebar = isOpen;
    },
    closeSidebar() {
      this.showSidebar = false;
      // 헤더의 햄버거 메뉴 상태도 초기화
      if (this.$refs.headbar) {
        this.$refs.headbar.isMenuOpen = false;
      }
    }
  }
};
</script>

<style>
.main{
  background: #F0F2F5;
}

html,
body {
  margin: 0;
  padding: 0;
  background: #F0F2F5;
  min-width: 390px;
  overflow-x: hidden;
}

.main-content{
  padding-top: 140px;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  transition: all 0.3s;
}

.sidebar{
  display: flex;
  position: fixed;
  overflow: auto;
  margin-left: 10%;
  width: 25%;
  height: 73%;
  top: 86px;
  transition: all 0.3s;
  z-index: 1000;
}

.sidebar-content::-webkit-scrollbar {
  display: none;
}

.sidebar-content {
  -ms-overflow-style: none;  /* IE and Edge */
  scrollbar-width: none;  /* Firefox */
}

.content{
  flex-direction: column;
  display: flex;
  margin-left: 35%;
  transition: all 0.3s;
}

.full-width {
  margin-left: 10% !important;
  width: 80%;
}

.sidebar-hidden {
  min-width: auto;
}

/* 슬라이드 효과 */
.slide-enter-active, .slide-leave-active {
  transition: transform 0.3s;
}
.slide-enter, .slide-leave-to {
  transform: translateX(-100%);
}

/* 모바일 사이드바 오버레이 */
.sidebar-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  z-index: 999;
}

/* 반응형 스타일 */
@media (max-width: 1400px) {
  .sidebar {
    width: 22%;
  }

  .content {
    margin-left: 32%;
  }
}

@media (max-width: 1300px) {
  .sidebar {
    width: 240px;
    margin-left: 0;
    left: 0;
    top: 86px;
    height: calc(100vh - 86px);
    background-color: #fff;
    box-shadow: 2px 0 5px rgba(0, 0, 0, 0.1);
  }
  
  .main-content {
    min-width: auto;
  }

  .full-width {
    margin-left: 5% !important;
    width: 90%;
  }
}

@media (max-width: 1200px) {
  .main-content {
    min-width: auto;
  }

  .full-width {
    margin-left: 5% !important;
    width: 90%;
  }
}

* {
  font-family: Pretendard;
}
</style>