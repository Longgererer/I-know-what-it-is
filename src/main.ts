import { createApp } from 'vue'
import App from '@/App.vue'
import router from '@router/index'
import { buildWS } from '@utils/socketTools'

const app = createApp(App)

app.use(router).mount('#app')

app.config.globalProperties.$ws = buildWS()