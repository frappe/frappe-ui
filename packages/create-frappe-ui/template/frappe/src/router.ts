import { createRouter, createWebHistory } from 'vue-router'

import Home from './pages/Home.vue'

const router = createRouter({
  history: createWebHistory(__ROUTER_BASE_CODE__),
  routes: [
    {
      path: '/',
      name: 'Home',
      component: Home,
    },
  ],
})

export default router
