import Vue from 'vue';
import VueRouter, { RouteConfig } from 'vue-router';
import Collector from '@/views/Collector.vue';
import UserSelect from '../views/UserSelect.vue';
import Instruction from '@/views/Instruction.vue';

Vue.use(VueRouter);

const routes: Array<RouteConfig> = [
  {
    path: '/collector',
    name: 'collector',
    component: Collector
  },
  {
    path: '/userselect',
    name: "userselect",
    component: UserSelect
  },
  {
    path: '/',
    name: "root",
    redirect: "/instruction/1"
  },
  {
    path: '/instruction/:pageParam',
    name: "instruction",
    props: true,
    component: Instruction
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
  mode: 'hash',
  base: process.env.BASE_URL,
  routes
});

export default router;
