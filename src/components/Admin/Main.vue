<template>
  <div id="main">
    <HeadBar ref="headbar" @toggle-sidebar="handleSidebarToggle" />
    <div class="main-content">
      <transition name="slide">
        <SidebarMenu v-if="showSidebar" class="sidebar" />
      </transition>
      <div class="content" :class="{ 'full-width': !showSidebar }">
        <router-view />
      </div>
    </div>
    <!-- 모바일 사이드바 오버레이 -->
    <div v-if="showSidebar && windowWidth <= 1150" class="sidebar-overlay" @click="closeSidebar"></div>
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
    this.checkWindowSize();
    window.addEventListener('resize', this.checkWindowSize);
  },
  beforeUnmount() {
    window.removeEventListener('resize', this.checkWindowSize);
  },
  methods: {
    checkWindowSize() {
      this.windowWidth = window.innerWidth;
      // 화면 너비가 1150px 이하면 사이드바를 자동으로 숨김
      if (this.windowWidth <= 1150) {
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
  width: 100%;
}

.sidebar{
  position: fixed;
  top: 86px;
  left: 0;
  display: flex;
  overflow: auto;
  width: 240px;
  min-width: 240px;
  height: calc(100vh - 86px);
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
  flex: 1;
  display: flex;
  flex-direction: column;
  padding: 20px;
  margin-left: 240px;
  transition: margin-left 0.3s;
}

.full-width {
  margin-left: 0;
}

/* 390px 이하에서 content full-width를 380px로 설정 */
@media (max-width: 390px) {
  .content.full-width {
    width: 380px;
    max-width: 380px;
    margin: 0 auto;
  }
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
    width: 240px;
  }
  
  .content {
    margin-left: 240px;
  }
}

@media (max-width: 1150px) {
  .sidebar {
    width: 240px;
    background-color: #fff;
    box-shadow: 2px 0 5px rgba(0, 0, 0, 0.1);
  }
  
  .content {
    margin-left: 0;
  }
  
  .full-width {
    margin-left: 0;
  }
}

* {
  font-family: Pretendard;
}
</style>