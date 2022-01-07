import { createRouter, createWebHashHistory, RouteRecordRaw } from 'vue-router'

const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    name: 'Home',
    component: () => import('@/views/Home.vue')
  },
  {
    path: '/create',
    name: 'Create',
    component: () => import('@/views/CreateRoom.vue')
  },
  {
    path: '/browse',
    name: 'Browse',
    component: () => import('@/views/BrowseRooms.vue')
  },
  {
    path: '/room/:id',
    name: 'Room',
    component: () => import('@/views/Room.vue')
  }
]

const router = createRouter({
  history: createWebHashHistory(),
  routes
})

export default router