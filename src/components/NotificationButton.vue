<template>
        <div class="icon-wrapper">
            <i class="icon alram"></i>
            <span class="red-dot">
              <p>{{number}}</p>
            </span>
        </div>
</template>

<script>
export default {
    name: 'NotificationButton',
    data(){
      return{
        number: 1,
      }
    }
};
</script>

<style scoped>

.icon-wrapper {
  position: relative;
  display: flex;
  align-items: center;
  margin-left: 70%;
}

.alram {
  width: 24px;
  height: 24px;
  background: url('@/assets/alram.svg') no-repeat center center;
  background-size: contain;
}

.red-dot {
  width: 16px;
  height: 16px;
  background-color: #FF0000;
  border-radius: 50%;
  position: absolute;
  color: #ffffff;
  text-align: center;
  margin: 0 0 17px 13px;
}

.red-dot p{
  color: #FFF;
  font-family: Pretendard;
  font-size: 12px;
  font-style: normal;
  font-weight: 600;
  margin: 1.5px 0 0px 0px;
}
</style>