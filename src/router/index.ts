import { createRouter, createWebHistory } from 'vue-router'
import BrowserView from '../views/BrowserView.vue'
import SimulatorView from '@/views/SimulatorView.vue'
import LibraryView from '@/views/LibraryView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'browser',
      component: BrowserView,
      meta: {
        title: 'Conversations Browser'
      }
    },
    {
      path: '/simulator',
      name: 'simulator',
      component: SimulatorView,
      meta: {
        title: 'Conversations Simulator'
      }
    },
    {
      path: '/library/:id?/:tab?',
      component: LibraryView,
      name: 'library',
      props: true,
      meta: {
        title: 'Library',
        rootAnchor: 'Library'
      }
    }
  ]
})

export default router
