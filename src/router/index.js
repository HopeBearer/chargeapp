import { createRouter, createWebHashHistory } from 'vue-router'

const router = createRouter({
  history: createWebHashHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/login',
      component: () => import('@/views/login/Login.vue')
    },
    {
      path: '/',
      redirect: '/home',
      component: () => import('@/views/layout/LayoutContainer.vue'),
      children: [
        {
          path: '/home',
          component: () => import('@/views/home/Home.vue')
        },
        {
          path: '/data',
          component: () => import('@/views/home/Data.vue')
        },
        {
          path: '/user',
          component: () => import('@/views/user/User.vue')
        }
      ]
    },
    {
      path: '/detail',
      component: () => import('@/views/home/Detail.vue')
    }
  ]
})

export default router
