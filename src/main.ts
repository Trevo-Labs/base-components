import { createApp } from 'vue'
import './assets/css/main.css'
import App from './app/app.vue'
import router from './router'

createApp(App).use(router).mount('#app')
