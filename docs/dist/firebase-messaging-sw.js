// /public/firebase-messaging-sw.js
importScripts(
  "https://www.gstatic.com/firebasejs/10.8.0/firebase-app-compat.js"
);
importScripts(
  "https://www.gstatic.com/firebasejs/10.8.0/firebase-messaging-compat.js"
);



const firebaseConfig = {
  apiKey: "AIzaSyCc1ZStuGuAAUYnosBu9hEs7I-mAy2Ej4Y",
  authDomain: "project-1449470303390130162.firebaseapp.com",
  projectId: "project-1449470303390130162",
  storageBucket: "project-1449470303390130162.firebasestorage.app",
  messagingSenderId: "311789790774",
  appId: "1:311789790774:web:3341bee7cc5b9167b41a97",
  measurementId: "G-3DJ4Y71M0N"
};


// 파이어베이스 초기화
firebase.initializeApp(firebaseConfig);

const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
  const notificationTitle = payload.title;
  const notificationOptions = {
      body: payload.body
  };
  self.registration.showNotification(notificationTitle, notificationOptions);
  
});
