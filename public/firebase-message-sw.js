// Import the Firebase scripts
importScripts('https://www.gstatic.com/firebasejs/9.6.1/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/9.6.1/firebase-messaging-compat.js');

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCc1ZStuGuAAUYnosBu9hEs7I-mAy2Ej4Y",
  authDomain: "project-1449470303390130162.firebaseapp.com",
  projectId: "project-1449470303390130162",
  storageBucket: "project-1449470303390130162.firebasestorage.app",
  messagingSenderId: "311789790774",
  appId: "1:311789790774:web:3341bee7cc5b9167b41a97",
  measurementId: "G-3DJ4Y71M0N"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);

// Initialize Firebase Messaging
const messaging = firebase.messaging();

// Background message handler
messaging.onBackgroundMessage(function(payload) {
  console.log('[firebase-message-sw.js] Received background message ', payload);
  
  // Customize notification here
  const notificationTitle = payload.notification.title || 'Notification Title';
  const notificationOptions = {
    body: payload.notification.body || 'Notification Body',
    icon: payload.notification.icon || '/firebase-logo.png'
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
});
