import { createRouter, createWebHashHistory } from 'vue-router'
import Home from '/@/views/Home.vue'
import HomeMenu from '/@views/HomeMenu.vue'
import NewRoom from '/@views/NewRoom.vue'
import SeekRoom from '/@views/SeekRoom.vue'

const Router = createRouter({
  history: createWebHashHistory(),
  routes: [{
    path: '/',
    name: 'Home',
    component: Home,
    children: [
      {
        path: '/',
        name: 'HomeMenu',
        component: HomeMenu
      },
      {
        path: '/create',
        name: 'NewRoom',
        component: NewRoom
      },
      {
        path: '/seek',
        name: 'SeekRoom',
        component: SeekRoom
      }
    ]
  }]
})

export default Router