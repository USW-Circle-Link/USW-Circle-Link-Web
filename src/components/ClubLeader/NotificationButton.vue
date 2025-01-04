<template>
  <div class="notification-wrapper">
    <div class="icon-wrapper" @click="toggleNotification">
      <i class="icon alram"></i>
      <!-- 읽지 않은 알림 개수 표시 -->
      <span class="red-dot" v-if="unreadCount > 0">
        <p>{{ unreadCount }}</p>
      </span>
    </div>
    <div class="notification-popup" v-if="showNotification">
      <div class="notification-header">
        <span>알림</span>
        <button @click="showNotification = false">X</button>
      </div>
      <div class="notification-content">
        <!-- 알림 리스트 렌더링 -->
        <ul v-if="logs.length > 0" class="notification-list">
          <li v-for="(log, index) in logs" :key="index" class="notification-item">
            <div class="notification-main">
              <p class="notification-message">{{ log.body }}</p>
              <p class="notification-timestamp">{{ log.timestamp }}</p>
            </div>
            <span class="delete-button" @click="deleteNotification(index)">X</span>
          </li>
        </ul>
        <p v-else class="no-notification">알림이 없습니다.</p>
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
      logs: [], // 알림 데이터를 저장
    };
  },
  methods: {
    toggleNotification() {
      this.showNotification = !this.showNotification;
      if (this.showNotification && this.unreadCount > 0) {
        this.markAsRead();
      }
    },
    handleNewNotification(notification) {
      console.log('새로운 알림 수신:', notification);
      const timestamp = new Date().toLocaleString(); // 알림 시간 추가
      this.logs.push({ ...notification, read: false, timestamp });
      this.unreadCount = this.logs.filter((log) => !log.read).length; // 읽지 않은 알림 개수 업데이트
    },
    markAsRead() {
      this.logs.forEach((log) => (log.read = true));
      this.unreadCount = 0;
    },
    deleteNotification(index) {
      this.logs.splice(index, 1);
      this.unreadCount = this.logs.filter((log) => !log.read).length;
    },
  },
  mounted() {
    const firebaseConfig = {
      apiKey: "YOUR_API_KEY",
      authDomain: "YOUR_PROJECT_ID.firebaseapp.com",
      projectId: "YOUR_PROJECT_ID",
      storageBucket: "YOUR_PROJECT_ID.appspot.com",
      messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
      appId: "YOUR_APP_ID",
      measurementId: "YOUR_MEASUREMENT_ID",
    };

    const app = initializeApp(firebaseConfig);
    const messaging = getMessaging(app);

    getToken(messaging, {
      vapidKey: 'YOUR_PUBLIC_VAPID_KEY',
    })
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

    onMessage(messaging, (payload) => {
      console.log('포그라운드 메시지 수신:', payload);
      if (payload && payload.notification) {
        this.handleNewNotification(payload.notification);
      }
    });

    navigator.serviceWorker.addEventListener('message', (event) => {
      console.log('서비스 워커 메시지 수신:', event.data);
      if (event.data && event.data.msg === 'Message received') {
        this.handleNewNotification({ body: event.data.data });
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
  right: 160px;
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
  font-family: Arial, sans-serif;
  font-size: 12px;
  font-weight: bold;
  margin: 0;
}

.notification-popup {
  position: fixed;
  top: 60px;
  right: 160px;
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
  flex-direction: column;
  padding: 10px;
}

.notification-list {
  list-style: none;
  padding: 0;
  margin: 0;
}

.notification-item {
  display: flex;
  justify-content: space-between;
  align-items: flex-start; /* 위쪽 정렬 */
  border-bottom: 1px solid #ddd;
  padding: 10px 0;
}

.notification-main {
  display: flex;
  flex-direction: column;
  flex-grow: 1;
}

.notification-message {
  font-size: 14px;
  font-weight: bold;
  margin-bottom: 4px;
}

.notification-timestamp {
  font-size: 12px;
  color: #999;
}

.delete-button {
  color: #ccc;
  font-size: 14px;
  cursor: pointer;
  margin-left: 10px;
}

.delete-button:hover {
  color: #999;
}

.no-notification {
  text-align: center;
  color: #999;
}
</style>
