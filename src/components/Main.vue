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
  name: 'Main',
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
  display: flex;
  justify-content: space-evenly;
}

.sidebar{
  flex-direction: column;
  display: flex;
}

.content{
  flex-direction: column;
  display: flex;
}


</style>