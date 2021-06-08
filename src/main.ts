import { createApp } from 'vue'
import Router from './router'
import App from './App.vue'
import Socket from './utils/socket'

createApp(App).use(Router).mount('#app')

new Socket('ws://127.0.0.1:4041')