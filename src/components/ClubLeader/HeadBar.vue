<template>
    <div class="header">
        <img @click="navigateTo('dashboard')" src="../../assets/dongurami_logo.png" alt="Dongurami Logo" class="logo" />
        <h1 @click="navigateTo('dashboard')" class="title">동구라미</h1>
    </div>
</template>

<script>

export default {
    name: 'Headbar',  // 구성요소 이름
    methods : {
      // 함수 실행 시 routeName의 컴포넌트로 이동
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
@import url('https://fonts.googleapis.com/css2?family=Jua&display=swap');


.header {
  width: 100%;
  display: flex;
  align-items: center;
  height: 86px;
  background: #fff;
  box-shadow: 0 2.5px 0 0 rgba(0, 0, 0, 0.13);
  margin-bottom: 40px;
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 100;
}

.logo {
  width: 30px;
  height: 25px;
  padding: 5px;
  transform: scaleX(-1);
  margin-left: 260px;
  cursor: pointer; /* Add this line */
}

.title {
  color: #FFC01D;
  font-family: "Jua", sans-serif;
  font-size: 20px;
  font-style: normal;
  font-weight: 405;
  line-height: 14px; /* 100% */
  cursor: pointer; /* Add this line */
}
</style>
