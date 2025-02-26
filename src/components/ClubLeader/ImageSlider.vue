<template>
  <div class="image-slider">
    <div class="slider">
      <button class="nav-button prev-button" @click="previousSlide">
        <svg xmlns="http://www.w3.org/2000/svg" width="32" height="68" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1" stroke-linecap="round" stroke-linejoin="round">
          <polyline points="15 18 9 12 15 6"></polyline>
        </svg>
      </button>

      <div class="slides">
        <img v-for="(image, index) in images"
             :src="image"
             :key="index"
             :class="{ active: index === activeIndex }"
             alt="동아리 사진"
             @contextmenu.prevent
        />
      </div>

      <button class="nav-button next-button" @click="nextSlide">
        <svg xmlns="http://www.w3.org/2000/svg" width="32" height="68" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1" stroke-linecap="round" stroke-linejoin="round">
          <polyline points="9 18 15 12 9 6"></polyline>
        </svg>
      </button>
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
  name: 'ImageSlider',
  props: ['images'],
  data() {
    return {
      activeIndex: 0,
      autoSlideInterval: null
    };
  },
  mounted() {
    this.startAutoSlide();
  },
  beforeUnmount() {
    this.stopAutoSlide();
  },
  methods: {
    startAutoSlide() {
      this.autoSlideInterval = setInterval(() => {
        this.nextSlide();
      }, 3000);
    },
    stopAutoSlide() {
      clearInterval(this.autoSlideInterval);
    },
    nextSlide() {
      this.activeIndex = (this.activeIndex + 1) % this.images.length;
    },
    previousSlide() {
      this.activeIndex = (this.activeIndex - 1 + this.images.length) % this.images.length;
    },
    // 사용자가 버튼 클릭 시 자동 슬라이드를 일시 정지했다가 다시 시작
    resetAutoSlide() {
      this.stopAutoSlide();
      this.startAutoSlide();
    }
  },
  watch: {
    activeIndex() {
      this.resetAutoSlide();
    }
  }
};
</script>

<style scoped>
.image-slider {
  position: relative;
  max-width: 100%;
  margin-top: 30px;
  margin-bottom: 20px;
}

.slider {
  width: 665px;
  height: 260px;
  background: #303030;
  border-radius: 8px;
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
  overflow: hidden;
}

.slides {
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
}

.slides img {
  max-width: 100%;
  max-height: 100%;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  display: none;
  object-fit: contain;
}

.slides img.active {
  display: block;
}

.nav-button {
  position: absolute;
  top: 0;
  height: 100%;
  background-color: #303030;
  color: white;
  border: none;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  z-index: 10;
  transition: background-color 0.3s;
  width: 50px;
}

.nav-button:hover {
  background-color: rgba(0, 0, 0, 0.5);
}

.prev-button {
  left: 0;
  border-radius: 8px 0 0 8px;
}

.next-button {
  right: 0;
  border-radius: 0 8px 8px 0;
}

.dots {
  position: absolute;
  bottom: 10px;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  gap: 5px;
}

.dots span {
  height: 9px;
  width: 9px;
  background-color: #bbb;
  border-radius: 50%;
  display: inline-block;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.dots span.active {
  background-color: #FFC700;
}
</style>