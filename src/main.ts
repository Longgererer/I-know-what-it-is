import { createApp } from 'vue'
import Router from './router'
import App from './App.vue'
import { buildSocket } from './utils/tools'

createApp(App).use(Router).mount('#app')

buildSocket()