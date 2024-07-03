<template>
  <div id="app">
    <headBar />
    <div class="main">
      <div class="sidebar">
        <SidebarMenu />
      </div>
      <div class="dashboard">
        <router-view/>
      </div>
    </div>
  </div>
</template>

<script>
import SidebarMenu from './components/SidebarMenu.vue';
import HeadBar from './components/HeadBar.vue';

export default {
  name: 'App',
  components:{
    SidebarMenu,
    HeadBar
  },
};
</script>

<style>
.app{
  background: #F0F2F5;
}

html,
body {
  margin: 0;
  padding: 0;
  background: #F0F2F5;
}

.main{
  display: flex;
  justify-content: space-evenly;
}

.sidebar{
  flex-direction: column;
  display: flex;
}

.dashboard{
  flex-direction: column;
  display: flex;
}
</style>
