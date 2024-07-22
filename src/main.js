import { createApp } from 'vue';
import App from './App.vue';
import store from './store/store';
import router from './router';
import io from 'socket.io-client';

// 웹소켓 서버 URL
const socket = io('http://localhost:3000');

const app = createApp(App);

app.use(store);
app.use(router);

// 웹소켓을 Vue 인스턴스의 프로토타입에 추가
app.config.globalProperties.$socket = socket;

app.mount('#app');
