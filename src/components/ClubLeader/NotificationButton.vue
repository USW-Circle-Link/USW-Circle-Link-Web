<template>
  <div class="notification-wrapper">
    <div class="icon-wrapper" @click="toggleNotification">
      <i class="icon alram"></i>
      <span class="red-dot" v-if="unreadCount > 0">
        <p>{{ unreadCount }}</p>
      </span>
    </div>
    <div class="notification-popup" v-if="showNotification">
      <div class="notification-header">
        <span>알림</span>
        <!-- X 버튼을 클릭하면 showNotification을 false로 설정하여 팝업 닫기 -->
        <button @click="showNotification = false">X</button>
      </div>
      <div class="notification-content">
        <p v-if="currentNotification.body" class="notification-message">{{ currentNotification.body }}</p>
      </div>
      <div class="notification-footer">
        <button class="nav-button" @click="prevNotification" :disabled="currentPage <= 1">
          <img src="@/assets/left.png" alt="Previous" />
        </button>
        <span>{{ currentPage }}/{{ totalPages }}</span>
        <button class="nav-button" @click="nextNotification" :disabled="currentPage >= totalPages">
          <img src="@/assets/rigth.png" alt="Next" />
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import { initializeApp } from 'firebase/app';
import { getMessaging, getToken, onMessage } from 'firebase/messaging';

export default {
  name: 'NotificationButton',
  data() {
    return {
      unreadCount: 0, // 읽지 않은 알림의 개수
      showNotification: false,
      currentPage: 1,
      logs: [],
    };
  },
  computed: {
    totalPages() {
      return this.logs.length;
    },
    currentNotification() {
      return this.logs[this.currentPage - 1] || {}; // 현재 페이지의 알림을 표시
    }
  },
  methods: {
    toggleNotification() {
      this.showNotification = !this.showNotification;
      if (this.showNotification && this.unreadCount > 0) {
        this.markAsRead();
      }
    },
    prevNotification() {
      if (this.currentPage > 1) {
        this.currentPage--;
        this.markAsRead(); // 이전 알림으로 이동할 때 읽음 처리
      }
    },
    nextNotification() {
      if (this.currentPage < this.totalPages) {
        this.currentPage++;
        this.markAsRead(); // 다음 알림으로 이동할 때 읽음 처리
      }
    },
    handleNewNotification(notification) {
      console.log("Handling new notification:", notification);
      this.logs.push({ ...notification, read: false }); // 알림을 읽지 않은 상태로 추가
      this.unreadCount = this.logs.filter(log => !log.read).length; // 읽지 않은 알림 개수 갱신

      console.log("Unread count:", this.unreadCount);
      console.log("Current page:", this.currentPage);
      
      this.showNotification = true;
      this.currentPage = this.totalPages;

      console.log("Show notification:", this.showNotification);
    },
    markAsRead() {
      if (this.logs[this.currentPage - 1] && !this.logs[this.currentPage - 1].read) {
        this.logs[this.currentPage - 1].read = true; // 현재 알림을 읽음으로 표시
        this.unreadCount = this.logs.filter(log => !log.read).length; // 읽지 않은 알림 개수 갱신
      }
    }
  },
  mounted() {
    const firebaseConfig = {
      apiKey: "AIzaSyC6WwOF-ZEOvfLd4TbL_YF4T6iGi5x6XL4",
      authDomain: "qweqwr-d96fc.firebaseapp.com",
      projectId: "qweqwr-d96fc",
      storageBucket: "qweqwr-d96fc.appspot.com",
      messagingSenderId: "681489530902",
      appId: "1:681489530902:web:f25db09b0c0fd9bb84b537",
      measurementId: "G-M8TVVVQ6XX"
    };

    const app = initializeApp(firebaseConfig);
    const messaging = getMessaging(app);

    navigator.serviceWorker.register('/firebase-messaging-sw.js')
      .then((registration) => {
        console.log('Service worker successfully registered:', registration.scope);
      })
      .catch((err) => {
        console.error('Service worker registration failed:', err);
      });

    getToken(messaging, { vapidKey: 'BLlH9816_Xje0heq1MivqGd_Nph28i1P9cAfK8kiFLGV2xtHIBCA-gaKG7OacECoA-sgDZS2Y58GQmzv_jWPewo' })
      .then((currentToken) => {
        if (currentToken) {
          console.log('FCM 토큰:', currentToken);
        } else {
          console.log('FCM 토큰을 가져올 수 없습니다.');
        }
      })
      .catch((err) => {
        console.error('FCM 토큰 가져오는 중 오류 발생:', err);
      });

    if (navigator.serviceWorker) {
      navigator.serviceWorker.addEventListener('message', (event) => {
        console.log('Data received from service worker:', event.data);
        if (event.data && event.data.msg === 'Message received') {
          this.handleNewNotification({ body: event.data.data });
        }
      });
    } else {
      console.error('Service worker is not supported in this browser.');
    }

    onMessage(messaging, (payload) => {
      console.log('Message received in foreground:', payload);
      if (payload && payload.notification) {
        this.handleNewNotification(payload.notification);
      }
    });
  },
};
</script>



<style scoped>
.notification-wrapper {
  position: relative;
}

.icon-wrapper {
  position: fixed;
  top: 20px;
  right: 160px; /* 원하는 위치에 맞게 조정하세요 */
  display: flex;
  align-items: center;
  cursor: pointer;
  margin-top: 10px;
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
  top: -8px;
  right: -8px;
  display: flex;
  justify-content: center;
  align-items: center;
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
  position: fixed;
  top: 60px;
  right: 160px; /* 원하는 위치에 맞게 조정하세요 */
  width: 300px;
  background: white;
  border: 1px solid #ccc;
  border-radius: 8px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
  z-index: 1000;
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

.notification-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px;
  border-top: 1px solid #ddd;
}

.nav-button {
  background-color: white;
  border: none;
  padding: 0;
  cursor: pointer;
}

.nav-button img {
  width: 20px;
  height: 20px;
}
</style>