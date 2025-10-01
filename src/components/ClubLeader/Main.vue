<template>
  <div id="main" :class="{ 'sidebar-hidden': !showSidebar }">
    <HeadBar @toggle-sidebar="handleSidebarToggle" />
    
    <div class="main-content">
      <transition name="slide">
        <SidebarMenu v-if="showSidebar" class="sidebar" />
      </transition>
      
      <div class="content">
        <router-view />
      </div>
    </div>
    
    <div v-if="showSidebar && windowWidth < 1300" class="sidebar-overlay" @click="closeSidebar"></div>
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
    window.addEventListener('resize', this.handleResize);
  },
  beforeUnmount() {
    window.removeEventListener('resize', this.handleResize);
  },
  methods: {
    // 화면 크기가 변경될 때 호출되는 메서드
    handleResize() {
      const oldWidth = this.windowWidth;
      this.windowWidth = window.innerWidth;

      // 데스크톱 <-> 모바일 뷰 경계를 넘나들 때만 사이드바 상태를 자동으로 변경
      if (oldWidth >= BREAKPOINT && this.windowWidth < BREAKPOINT) {
        // 데스크톱 -> 모바일로 전환 시: 사이드바를 숨김
        this.showSidebar = false;
      } else if (oldWidth < BREAKPOINT && this.windowWidth >= BREAKPOINT) {
        // 모바일 -> 데스크톱으로 전환 시: 사이드바를 표시
        this.showSidebar = true;
      }
    },
    // 햄버거 메뉴 클릭 시 호출되는 메서드 (자식 컴포넌트로부터 전달받음)
    handleSidebarToggle() {
      this.showSidebar = !this.showSidebar;
    },
    // 모바일 오버레이 클릭 시 사이드바를 닫는 메서드
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
  background-color: #F0F2F5;
  font-family: 'Pretendard', sans-serif;
  min-width: 360px;
}

#main {
  position: relative;
  overflow-x: hidden;
}

.main-content {
  /* HeadBar의 높이(86px)만큼 상단 여백을 주어 콘텐츠가 가려지지 않게 함 */
  padding-top: 86px; 
}

/* --- 데스크톱 레이아웃 (1300px 이상) --- */
/* 데스크톱에서는 사이드바가 보일 때 콘텐츠를 밀어내는 방식(Push)으로 동작 */
.sidebar {
  position: fixed;
  top: 86px;
  left: 10%;
  width: 250px; /* 레이아웃 계산을 위해 고정 너비 사용 */
  height: calc(100% - 86px);
  z-index: 100;
  background-color: #F0F2F5;
  transition: transform 0.3s ease;
}

.content {
  /* 사이드바 너비와 여백만큼 왼쪽 마진을 주어 콘텐츠를 밀어냄 */
  margin-left: calc(10% + 250px);
  padding: 24px;
  width: calc(100% - (10% + 250px)); /* width 계산이 간단해집니다. */
  transition: margin-left 0.3s ease, width 0.3s ease;
  box-sizing: border-box; /* padding과 border 값을 포함해서 관리 쉬움 */
}

/* 데스크톱에서 사이드바가 숨겨질 때 (sidebar-hidden 클래스가 있을 때) */
#main.sidebar-hidden .sidebar {
  /* 사이드바를 화면 왼쪽 밖으로 이동시킴 */
  transform: translateX(-120%);
}

#main.sidebar-hidden .content {
  /* margin을 auto로 설정하여 중앙 정렬합니다. */
  margin: 0 auto;
  
  /* 콘텐츠가 너무 넓어지는 것을 방지하기 위해 최대 너비를 설정합니다. */
  max-width: 1400px;
  
  /* 너비를 100%로 설정해, 화면이 max-width보다 작아질 때 */
  /* 자동으로 줄어들도록 만듭니다. */
  width: 100%;
}


/* --- 모바일/태블릿 레이아웃 (1300px 미만) --- */
@media (max-width: 1300px) {
  /* 모바일에서는 사이드바가 콘텐츠 위를 덮는 방식(Overlay)으로 동작 */
  .sidebar {
    left: 0; /* 화면 좌측 끝에 고정 */
    width: 280px;
    background-color: #fff;
    box-shadow: 2px 0 8px rgba(0,0,0,0.1);
    z-index: 1000;
  }

  /* 모바일에서는 콘텐츠가 항상 전체 너비를 차지 (밀려나지 않음) */
  .content {
    margin-left: 0;
    width: 100%;
    padding: 24px 5%; /* 좌우 여백 */
  }

  /* 모바일에서 사이드바가 숨겨졌을 때도 콘텐츠 너비는 동일 */
  #main.sidebar-hidden .content {
    margin-left: 0;
    width: 100%;
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
</style>