<template>
  <!-- 이미지 슬라이더 구성요소 -->
  <div class="image-slider">
    <!-- 슬라이더 컨테이너 -->
    <div class="slider">
      <div class="slides">
        <!-- 이미지를 동적으로 생성 -->
        <img
            v-for="(image, index) in images"
            :src="image"
            :key="index"
            :class="{ active: index === activeIndex }"
            alt="사진"
        />
      </div>
    </div>
    <div class="dots">
      <span
          v-for="(image, index) in images"
          :key="index"
          :class="{ active: index === activeIndex }"
          @click="activeIndex = index"
      ></span>
    </div>
  </div>
</template>

<script>
export default {
  name: 'ImageSlider', // 구성요소 이름
  props: ['images'], // 이미지 URL 배열
  data() {
    return {
      activeIndex: 0, // 현재 활성화된 슬라이드 인덱스 (사진 값이 들어오기 전 사진 0개 기본값)
    };
  },
  mounted() {
    // 3초마다 자동으로 이미지 순환
    setInterval(() => {
      this.activeIndex = (this.activeIndex + 1) % this.images.length;
    }, 3000);
  },
};
</script>

<style scoped>
.image-slider {
  position: relative;
  max-width: 584px;
  align-items: center;
  align-content: center;
  margin-top: 20px;
}

.slides{
  width: 584px;
  margin-left: 185px;
  align-items: center;
  align-content: center;
  text-align:center;
}

.slider{
  margin-left: 20px;
  margin-right: 30px;
  width: 540px;
  height: 200px;
  background: #303030;
  border-radius: 8px;
  vertical-align: middle;
  display: flex;
  justify-content: center;
  align-content: center;
  position: relative;
}

.slides img {
  max-width: 200px;
  max-height: 200px;
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
  margin-top: 15px;
  text-align: center;
}

.dots span {
  height: 9px;
  width: 9px;
  margin: 0 3px;
  background-color: #bbb;
  border-radius: 50%;
  display: inline-block;
  cursor: pointer;
}

.dots span.active {
  background-color: #FFC700;
}
</style>
