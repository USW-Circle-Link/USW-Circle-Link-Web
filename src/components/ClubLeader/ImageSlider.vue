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
  max-width: 584px;
  align-items: center;
  align-content: center;
  margin-top: 30px;
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
