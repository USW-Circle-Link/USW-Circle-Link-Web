<template>
  <div class="header">
    <div class="header-content">
      <img src="../../assets/dongurami_logo.png" alt="Dongurami Logo" class="logo" />
      <h1 class="title">동구라미</h1>
      <!--    <NotificationButton/>-->
    </div>
  </div>
</template>

<script>
export default {
  name: 'Headbar',
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
  box-shadow: 0px 2.5px 0px 0px rgba(0, 0, 0, 0.13);
  margin-bottom: 40px;
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 500;
}

.header-content {
  display: flex;
  align-items: center;
  transition: all 0.3s ease;
  margin-left: 230px;
}

.logo {
  width: 30px;
  height: 25px;
  padding: 5px;
  transform: scaleX(-1);
}

.title {
  color: #FFC01D;
  font-family: "Jua", sans-serif;
  font-size: 20px;
  font-style: normal;
  font-weight: 405;
  line-height: 14px; /* 100% */
}

/* 반응형 스타일 */
@media (max-width: 1400px) {
  .header-content {
    margin-left: 180px;
  }
}

@media (max-width: 1350px) {
  .header-content {
    margin-left: 175px;
  }
}

@media (max-width: 1300px) {
  .header-content {
    margin-left: 170px;
  }
}

@media (max-width: 1250px) {
  .header-content {
    margin-left: 125px;
  }
}

@media (max-width: 1200px) {
  .header-content {
    margin-left: 100px;
  }
}

@media (max-width: 112px) {
  .header-content {
    margin-left: 68px;
  }
}

@media (max-width: 992px) {
  .header-content {
    margin-left: 50px;
  }
}

@media (max-width: 768px) {
  .header-content {
    margin-left: 20px;
  }
}

@media (max-width: 576px) {
  .header-content {
    margin-left: 10px;
  }
}
</style>