// main.js

import { createApp } from 'vue'; // Import createApp from Vue
import App from './App.vue';
import { createRouter, createWebHistory } from 'vue-router'; // Import createRouter and createWebHistory from Vue Router
import MainPage from './components/MainPage.vue';
import LoginForm from './components/LoginForm.vue';
import RegistrationForm from './components/RegistrationForm.vue';
import CabinetPage from './components/CabinetPage.vue';
import PrivateMessage from './components/PrivateMessage.vue';
import UserPage from './components/UserPage.vue';

const routes = [
    { path: "/", component: MainPage},
    { path: "/login", component: LoginForm},
    { path: "/register", component: RegistrationForm},
    { path: "/cabinet", component: CabinetPage},
    { path: "/messages", component: PrivateMessage},
    { path: "/userpage", component: UserPage},
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

const app = createApp(App);

app.use(router); // Use the router with the app

const socket = new WebSocket('ws://localhost:8080/websocket'); // Replace 'localhost:8080' with your server address

app.config.globalProperties.$socket = socket;

// Register your components
app.component('MainPage', MainPage);
app.component('LoginForm', LoginForm);
app.component('RegistrationForm', RegistrationForm);
app.component('CabinetPage', CabinetPage);
app.component('PrivateMessage', PrivateMessage);
app.component('UserPage', UserPage);

app.mount('#app'); // Mount the app to the #app element