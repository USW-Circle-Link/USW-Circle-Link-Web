
<template>
  <div class="header">
    <img src="../../assets/dongurami_logo.png" alt="Dongurami Logo" class="logo" />
    <h1 class="title">동구라미</h1>
<!--    <NotificationButton/>-->
  </div>
</template>

<script>
import NotificationButton from "@/components/ClubLeader/NotificationButton.vue";

export default {
  name: 'Headbar',
  // components: {NotificationButton}
};


</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Jua&diszzplay=swap');


.header {
  width: 100%;
  display: flex;
  align-items: center;
  height: 86px;
  background: #fff;
  box-shadow: 0px 2.5px 0px 0px rgba(0, 0, 0, 0.13);
  margin-bottom: 40px;
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 500;
}

.logo {
  width: 30px;
  height: 25px;
  padding: 5px;
  transform: scaleX(-1);
  margin-left: 230px;
}

.title {
  color: #FFC01D;
  font-family: "Jua", sans-serif;
  font-size: 20px;
  font-style: normal;
  font-weight: 405;
  line-height: 14px; /* 100% */
}
</style>
