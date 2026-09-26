import { createRouter, createWebHistory } from 'vue-router'

export const router = createRouter({
  // The same path as `frontendRoute` in vite.config.ts
  history: createWebHistory('__ROUTE__'),
  routes: [
    { path: '/', component: () => import('./pages/Home.vue') },
    { path: '/:path(.*)*', component: () => import('./pages/NotFound.vue') },
  ],
})
