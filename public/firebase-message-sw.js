// Import the Firebase scripts
importScripts('https://www.gstatic.com/firebasejs/9.6.1/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/9.6.1/firebase-messaging-compat.js');

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyC6WwOF-ZEOvfLd4TbL_YF4T6iGi5x6XL4",
  authDomain: "qweqwr-d96fc.firebaseapp.com",
  projectId: "qweqwr-d96fc",
  storageBucket: "qweqwr-d96fc.appspot.com",
  messagingSenderId: "681489530902",
  appId: "1:681489530902:web:f25db09b0c0fd9bb84b537",
  measurementId: "G-M8TVVVQ6XX"

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
