import { createApp } from 'vue'
import App from '@/App.vue'
import router from '@router/index'
import { buildWS } from '@utils/socketTools'
import { stateName, createState } from '@/store'

const app = createApp(App)
const globalState = createState()
app.provide(stateName, globalState)

// 建立ws连接
const $ws = buildWS()
// 将ws实例存入全局
app.config.globalProperties.$ws = $ws

app.use(router).mount('#app')

// 在页面卸载的时候关闭ws连接
window.addEventListener('unload', () => {
  $ws.close()
})