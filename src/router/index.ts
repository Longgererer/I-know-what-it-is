import { createRouter, createWebHashHistory, RouteRecordRaw } from 'vue-router'

const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    name: 'Home',
    meta: { title: '游戏首页' },
    component: () => import('@/views/Home.vue'),
  },
  {
    path: '/create',
    name: 'Create',
    meta: { title: '创建房间' },
    component: () => import('@/views/CreateRoom.vue'),
  },
  {
    path: '/browse',
    name: 'Browse',
    meta: { title: '浏览房间' },
    component: () => import('@/views/BrowseRooms.vue')
  },
  {
    path: '/room/:roomId',
    name: 'Room',
    component: () => import('@/views/Room.vue')
  }
]

const router = createRouter({
  history: createWebHashHistory(),
  routes
})

router.beforeEach((to, _, next) => {
  const { name, params, meta: { title } } = to
  if (title) {
    document.title = <string>title
  }
  if (name === 'Room') {
    // 在跳转至房间页面的时候如果没有传递roomId或roomInfo则视为非法用户无权进入，直接跳转到主页
    if (!params.roomId || !params.roomInfo) {
      next('/')
    }
  }
  next()
})

export default router