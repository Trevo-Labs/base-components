import { defineSetupVue3 } from '@histoire/plugin-vue'
import { createRouter, createWebHistory } from 'vue-router'
import './assets/css/main.css'
import './assets/css/histoire.css'

// Router de pega para las stories: CellLink y BasePageHeader usan RouterLink y
// sin router instalado Vue avisa de que el componente no está resuelto.
const router = createRouter({
  history: createWebHistory(),
  routes: [{ path: '/:pathMatch(.*)*', component: { template: '<div />' } }],
})

export const setupVue3 = defineSetupVue3(({ app }) => {
  app.use(router)
})
