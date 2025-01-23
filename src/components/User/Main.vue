<template>
  <div id="main">
    <HeadBar />
    <div class="main-content">
      <SidebarMenu class="sidebar" />
      <div class="content">
        <dashboard />
      </div>
    </div>
  </div>
</template>
<script setup>
import HeadBar from "@/components/User/HeadBar.vue";
import SidebarMenu from "@/components/User/SidebarMenu.vue";
import Dashboard from "@/components/User/Dashboard.vue";
</script>

<style>

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