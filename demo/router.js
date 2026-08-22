import { createRouter, createWebHistory } from 'vue-router'
import { demos } from './demos'
import Index from './Index.vue'

export const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: '/', name: 'index', component: Index },
    ...demos.map((demo) => ({
      path: `/${demo.slug}`,
      name: demo.slug,
      component: demo.component,
    })),
  ],
})
