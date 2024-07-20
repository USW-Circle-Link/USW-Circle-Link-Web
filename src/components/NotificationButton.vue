<template>
  <div class="notification-wrapper">
    <div class="icon-wrapper" @click="toggleNotification">
      <i class="icon alram"></i>
      <span class="red-dot" v-if="number > 0">
        <p>{{ number }}</p>
      </span>
    </div>
    <div class="notification-popup" v-if="showNotification">
      <div class="notification-header">
        <span>알림</span>
        <button @click="toggleNotification">X</button>
      </div>
      <div class="notification-content">
        <img src="@/assets/logo.png" alt="Notification Image" class="notification-image" />
        <p>동아리 연합회에서 새로운 공지가 있어요</p>
      </div>
      <div class="notification-footer">
        <button @click="prevNotification">이전</button>
        <span>{{ currentPage }}/{{ totalPages }}</span>
        <button @click="nextNotification">다음</button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'NotificationButton',
  data() {
    return {
      number: 1, // 초기 알림 개수
      showNotification: false, // 알림 창 표시 여부
      currentPage: 1,
      totalPages: 10
    };
  },
  methods: {
    toggleNotification() {
      this.showNotification = !this.showNotification;
    },
    prevNotification() {
      if (this.currentPage > 1) {
        this.currentPage--;
      }
    },
    nextNotification() {
      if (this.currentPage < this.totalPages) {
        this.currentPage++;
      }
    }
  },
};
</script>

<style scoped>
.notification-wrapper {
  position: relative
}

.icon-wrapper {
  position: relative;
 
  /* 원하는 위치에 맞게 조정하세요 */
  left: 1700px; /* 원하는 위치에 맞게 조정하세요 */
  display: flex;
  align-items: center;
  cursor: pointer;
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
  top: -8px;
  right: -8px;
}

.red-dot p {
  color: #FFF;
  font-family: Pretendard;
  font-size: 12px;
  font-style: normal;
  font-weight: 600;
  margin: 0;
  line-height: 16px;
}

.notification-popup {
  position: absolute;
  top: 30px;
  left: 1450px; /* 원하는 위치에 맞게 조정하세요 */
  width: 250px;
  background: white;
  border: 1px solid #ccc;
  border-radius: 8px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
  z-index: 1000; /* Ensure the popup is above other content */
}

.notification-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px;
  border-bottom: 1px solid #ddd;
}

.notification-content {
  display: flex;
  align-items: center;
  padding: 10px;
}

.notification-image {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  margin-right: 10px;
}

.notification-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px;
  border-top: 1px solid #ddd;
}
</style>
