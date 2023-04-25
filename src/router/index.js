import { createRouter, createWebHashHistory } from 'vue-router';
import HomeView from '../views/HomeView.vue';

const routes = [
  {
    path: '/',
    name: 'home',
    component: HomeView,
  },
  {
    path: '/about',
    name: 'about',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "about" */ '../views/AboutView.vue'),
  },
  {
    path: '/loginpage',
    component: () => import('../views/LoginPage.vue'),
  },
  {
    path: '/dashboardpage',
    component: () => import('../views/DashboardPage.vue'),
    children: [
      {
        path: 'productspage',
        component: () => import('../views/ProductsPage.vue'),
      },
      {
        path: 'orderlist',
        component: () => import('../views/OrderList.vue'),
      },
      {
        path: 'coupon',
        component: () => import('../views/Coupon.vue'),
      },
    ],
  },
  {
    path: '/user',
    component: () => import('../views/Userboard.vue'),
    children: [
      {
        path: 'cart',
        component: () => import('../views/UserCart.vue'),
      },
      {
        path: 'product/:productId',
        component: () => import('../views/UserProduct.vue'),
      },
      {
        path: 'checkout/:orderId',
        component: () => import('../views/UserCheckout.vue'),
      },
    ],
  },
];

const router = createRouter({
  history: createWebHashHistory(),
  routes,
});

export default router;
