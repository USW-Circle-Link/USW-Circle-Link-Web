<template>
    <div class="header">
        <img @click="navigateTo('dashboard')" src="../../assets/dongurami_logo.png" alt="Dongurami Logo" class="logo" />
        <h1 @click="navigateTo('dashboard')" class="title">동구라미</h1>
        <NotificationButton/>
    </div>
</template>

<script>
import NotificationButton from "@/components/ClubLeader/NotificationButton.vue";

export default {
name: 'Headbar',
components: {NotificationButton},
    methods : {
    navigateTo(routeName) {
      this.$router.push({ name: routeName }).catch(err => {
        if (err.name !== 'NavigationDuplicated') {
          throw err;
        }
      });
    },
  }
};


</script>

<style scoped>
.header {
width: 100%;
display: flex;
align-items: center;
height: 86px;
background: #fff;
box-shadow: 0px 2.5px 0px 0px rgba(0, 0, 0, 0.13);
margin-bottom: 40px;
}
.logo {
width: 17px;
height: 17px;
padding: 5px;
transform: scaleX(-1);
margin-left: 200px;
}

.title {
color: #FFC700;
font-family: "Jalnan";
font-size: 14px;
font-style: normal;
font-weight: 400;
line-height: 14px; /* 100% */
}
</style>
