<template>
  <div id="app">
    <headBar />
    <div class = "main">
      <div class = "sidebar">
        <SidebarMenu />
      </div>
      <div class="dashboard">
        <ClubInfo/>
        <Dashboard/>
      </div>
    </div>
  </div>
</template>
<!--test-->
<script>
import Dashboard from './components/Dashboard.vue';
import SidebarMenu from './components/SidebarMenu.vue';
import HeadBar from './components/HeadBar.vue';
import ClubInfo from './components/ClubInfo.vue'

export default {
  name: 'App',
  components:{
    Dashboard,
    SidebarMenu,
    HeadBar,
    ClubInfo
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