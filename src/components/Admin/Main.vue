<template>
  <div id="main">
    <HeadBar ref="headbar" @toggle-sidebar="handleSidebarToggle" />
    <div class="main-content">
      <transition name="slide">
        <SidebarMenu v-if="showSidebar" class="sidebar" />
      </transition>
      
      <div class="content">
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

const BREAKPOINT = 1300; // 중단점(breakpoint)을 상수로 관리하여 유지보수 용이성 향상

export default {
  name: 'Main',
  components: {
    SidebarMenu,
    HeadBar,
  },
  data() {
    return {
      // 페이지 로드 시 화면 너비에 따라 사이드바 초기 상태 결정
      showSidebar: window.innerWidth >= BREAKPOINT,
      windowWidth: window.innerWidth,
    };
  },
  mounted() {
    this.handleResize();
    window.addEventListener('resize', this.handleResize);
  },
  beforeUnmount() {
    window.removeEventListener('resize', this.handleResize);
  },
  methods: {
  checkWindowSize() {
    const oldWidth = this.windowWidth;
    this.windowWidth = window.innerWidth;

    if (this.windowWidth <= 1150) {
      this.showSidebar = false;
    } else if (oldWidth < BREAKPOINT && this.windowWidth >= BREAKPOINT) {
      this.showSidebar = true;
    }
  },

  handleResize() {
    this.checkWindowSize();
  },

  handleSidebarToggle() {
    this.showSidebar = !this.showSidebar;
  },

  closeSidebar() {
    this.showSidebar = false;
  }
}

};
</script>

<style>
/* --- 전역 및 레이아웃 기본 --- */
html, body {
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

/* --- 공통 트랜지션 및 오버레이 --- */
.slide-enter-active, .slide-leave-active {
  transition: transform 0.3s ease;
}
.slide-enter-from, .slide-leave-to {
  /* v-if 조건이 false가 되면 이 클래스가 적용되어 사라지는 애니메이션이 됨 */
  transform: translateX(-120%);
}

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