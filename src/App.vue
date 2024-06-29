<template>
  <div id="app">
    <headBar />
    <div class = "main">
      <div class = "sidebar">
        <SidebarMenu />
      </div>
      <div class="dashboard">
<!--        <ClubInfo/>-->
<!--        <Dashboard/>-->
        <h1>동아리 소개 수정</h1>
        <ClubUpdateHeader/>
        <ClubInfoTextInput/>
        <ClubPicture/>
      </div>
    </div>
  </div>
</template>

<script>
import Dashboard from './components/Dashboard.vue';
import SidebarMenu from './components/SidebarMenu.vue';
import HeadBar from './components/HeadBar.vue';
import ClubInfo from './components/ClubInfo.vue'
import ClubUpdateHeader from "@/components/ClubUpdateHeader.vue";
import ClubInfoTextInput from "@/components/ClubInfoTextInput.vue"
import ClubPicture from "@/components/ClubPicture.vue"

export default {
  name: 'App',
  components:{
    Dashboard,
    SidebarMenu,
    HeadBar,
    ClubInfo,
    ClubUpdateHeader,
    ClubInfoTextInput,
    ClubPicture
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