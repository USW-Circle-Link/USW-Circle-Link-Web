<template>
  <div class="MainBox">
    <div class="Info">
      <div class="info">
        <p class="clubname">지원자 합격 처리</p>
      </div>

    </div>
  </div>
</template>

<script>
export default {
  name: 'MainBox'
};

</script>

<style scoped>

.MainBox{
  width: 886px;
  height: 276px;
  display: flex;
  background: #fff;
  margin-bottom: 30px;
  border-radius: 8px;
}


.Info{
  display: flex;
  flex-direction: column;
  justify-content: center;
  vertical-align: middle;
}

.info{
  display: flex;
  align-items: center;
  height: px;
}

.clubname{
  color: #000;
  font-family: Pretendard;
  font-size: 24px;
  font-style: normal;
  font-weight: 600;
  line-height: 24px; /* 100% */
  letter-spacing: -0.6px;
  margin-right: 15px;
}

</style>