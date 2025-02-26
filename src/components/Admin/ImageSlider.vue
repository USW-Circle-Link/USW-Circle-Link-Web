
<template>
  <div class="image-slider">
    <div class="slider">
      <div class="slides">
        <img v-for="(image, index) in images" :src="image" :key="index" :class="{ active: index === activeIndex }"  alt="사진"/>
      </div>
    </div>
    <div class="dots">
      <span v-for="(image, index) in images" :key="index" :class="{ active: index === activeIndex }" @click="activeIndex = index"></span>
    </div>
  </div>
</template>

<script>
export default {
  name: 'ImageSlider',
  props: ['images'],
  data() {
    return {
      activeIndex: 0
    };
  },
  mounted() {
    setInterval(() => {
      this.activeIndex = (this.activeIndex + 1) % this.images.length;
    }, 3000);
  }
};
</script>

<style scoped>
.image-slider {
  position: relative;
  max-width: 3000px;
  align-items: center;
  align-content: center;
  margin-top: 30px;
  margin-bottom: 20px; /* 슬라이더와 아래 콘텐츠 간격 추가 */

}

.slides{
  width: 600px;
  margin-left: 185px;
  align-items: center;
  align-content: center;
  text-align:center;
}

.slider{
  margin-left: 30px;
  margin-right: 30px;
  width: 635px;
  height: 260px;
  background: #303030;
  border-radius: 8px;
  vertical-align: middle;
  display: flex;
  justify-content: center;
  align-items: center;
  align-content: center;
  position: relative; /* dots를 슬라이더 내부에 배치할 수 있도록 기준 설정 */
}

.slides img {
  max-width: 200px;
  max-height: 510px;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translateX(-50%) translateY(-50%);
  display: none;
}

.slides img.active {
  display: block;
}

.dots {
  position: absolute; /* dots를 슬라이더 내부에 배치 */
  bottom: 10px; /* 슬라이더의 맨 아래에 위치 */
  left: 50%; /* 가로 중앙 정렬 */
  transform: translateX(-50%); /* 가로 중앙 정렬 보정 */
  display: flex; /* dots들을 가로로 배치 */
  gap: 5px; /* dots 간의 간격 */
}

.dots span {
  height: 9px;
  width: 9px;
  background-color: #bbb;
  border-radius: 50%;
  display: inline-block;
  cursor: pointer;
  /* transition: background-color 0.3s ease; 색상 변경 애니메이션 */
}

.dots span.active {
  background-color: #FFC700;
}
</style>

