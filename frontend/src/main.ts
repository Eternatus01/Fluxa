import { createApp } from 'vue'
import './app/style.css'
import App from './app/App.vue'
import router from "./app/router/index.ts"
import { createPinia } from 'pinia';
import { VueQueryPlugin } from 'vue-query';

const pinia = createPinia();

createApp(App).use(pinia).use(router).use(VueQueryPlugin).mount('#app')
