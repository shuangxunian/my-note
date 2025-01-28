import { createRouter, createWebHashHistory } from 'vue-router'

const router = createRouter({
  history: createWebHashHistory(),
  routes: [
    {
      path: '/',
      redirect: '/main',
    },
    {
      name: 'Login',
      path: '/login',
      component: () => import('@/views/login/UserLogin.vue'),
    },
    {
      name: 'Main',
      path: '/main',
      component: () => import('@/views/main/AllPage.vue'),
    },
    {
      name: 'BookDetail',
      path: '/bookDetail',
      component: () => import('@/views/book-detail/bookDetail.vue'),
    },
    {
      path: '/:pathMatch(.*)',
      component: () => import('@/views/not-found/NotFound.vue'),
    },
  ],
})

router.beforeEach((to, from, next) => {
  // 获取token
  const token = localStorage.getItem('token')
  // 如果没有token，则跳转到登录页面
  if (!token && to.path !== '/login') {
    next('/login')
  } else {
    next()
  }
})

export default router
