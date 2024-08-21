<template>
  <div class="image-slider">
    <div class="slides">
      <img v-for="(image, index) in images" :src="image" :key="index" :class="{ active: index === activeIndex }"  alt="사진"/>
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
  align-content: center;
}

.slides{
  width: 584px;
  margin-left: 185px;
  align-items: center;
  align-content: center;
}

.slides img {
  width: 214px;
  display: none;
}

.slides img.active {
  display: block;
}

.dots {
  text-align: center;
}

.dots span {
  height: 9px;
  width: 9px;
  margin: 0 2px;
  background-color: #bbb;
  border-radius: 50%;
  display: inline-block;
  cursor: pointer;
}

.dots span.active {
  background-color: #FFC700;
}
</style>