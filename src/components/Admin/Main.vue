<template>
  <div id="main">
    <HeadBar />
    <div class="main-content" :class="{ 'sidebar-hidden': !showSidebar }">
      <transition name="slide">
        <SidebarMenu v-if="showSidebar" class="sidebar" />
      </transition>
      <div class="content" :class="{ 'full-width': !showSidebar }">
        <router-view />
      </div>
    </div>
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
  beforeDestroy() {
    window.removeEventListener('resize', this.checkWindowSize);
  },
  methods: {
    checkWindowSize() {
      this.windowWidth = window.innerWidth;
      // 화면 너비가 1200px 미만이면 사이드바를 자동으로 숨김
      // 겹침을 방지하기 위해 더 일찍 사이드바를 숨김
      if (this.windowWidth < 1300) {
        this.showSidebar = false;
      } else {
        this.showSidebar = true;
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
  height: 100%;
  transition: all 0.3s;
  z-index: 10;
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

/* 반응형 스타일 */
@media (max-width: 1400px) {
  .sidebar {
    width: 22%;
  }

  .content {
    margin-left: 32%;
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
</style>