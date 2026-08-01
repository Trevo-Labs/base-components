import { createRouter, createWebHistory } from 'vue-router'

// Router mínimo: existe para que RouterLink funcione (lo usan CellLink y
// BasePageHeader) y como punto de arranque del proyecto que copie esta base.
export const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      name: 'home',
      component: () => import('@/views/home-view/home-view.vue'),
    },
    {
      path: '/:pathMatch(.*)*',
      redirect: '/',
    },
  ],
})

export default router
