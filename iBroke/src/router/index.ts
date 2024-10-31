import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import OptionsTracker from '../views/OptionsTracker.vue'
import AccountSummary from '@/views/AccountSummary.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/homee',
      name: 'home',
      component: HomeView,
    },
    {
      path: '/options',
      name: 'options',
      component: OptionsTracker,
    },
    {
      path: '/account',
      name: 'account',
      component: AccountSummary,
    },
  ],
})

export default router
