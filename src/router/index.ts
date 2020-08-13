import Vue from 'vue';
import VueRouter, { RouteConfig } from 'vue-router';
import BasicCollector from '../views/BasicCollector.vue';
import RankedCollector from '../views/RankedCollector.vue';
import UserSelect from '../views/UserSelect.vue';

Vue.use(VueRouter);

const routes: Array<RouteConfig> = [
  {
    path: '/basic',
    name: 'BasicCollector',
    component: BasicCollector
  },
  {
    path: '/ranked',
    name: 'RankedCollector',
    component: RankedCollector
  },
  {
    path: '/',
    name: "UserSelect",
    component: UserSelect
  }
  // {
  //   path: '/about',
  //   name: 'About',
  //   // route level code-splitting
  //   // this generates a separate chunk (about.[hash].js) for this route
  //   // which is lazy-loaded when the route is visited.
  //   component: () => import(/* webpackChunkName: "about" */ '../views/About.vue')
  // }
];

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
});

export default router;
