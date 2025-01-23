<template>
  <div id="main">
    <HeadBar />
    <div class="main-content">
      <SidebarMenu class="sidebar" />
      <div class="content">
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
}

.sidebar{
  display: flex;
  position: fixed;
  overflow: auto;
  margin-left: 10%;
  width: 25%;
  height: 100%;
}

.content{
  flex-direction: column;
  display: flex;
  margin-left:35%;
}


</style>
