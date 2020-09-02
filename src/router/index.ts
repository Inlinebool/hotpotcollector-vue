import Vue from 'vue';
import VueRouter, { RouteConfig } from 'vue-router';
import Collector from '@/views/Collector.vue';
import Instruction from '@/views/Instruction.vue';
import Consent from '@/views/Consent.vue';
import Questionnaire from "@/views/Questionnaire.vue"

Vue.use(VueRouter);

const routes: Array<RouteConfig> = [
  {
    path: '/collector',
    name: 'collector',
    component: Collector
  },
  {
    path: '/consent',
    name: "consent",
    component: Consent
  },
  {
    path: '/instruction',
    name: "instruction",
    component: Instruction
  },
  {
    path: '/questionnaire',
    name: "questionnaire",
    component: Questionnaire
  },
  {
    path: '/',
    name: "root",
    redirect: "/consent"
  },
  // {
  //   path: '*',
  //   redirect: "/consent"
  // }
];

const router = new VueRouter({
  mode: 'hash',
  base: process.env.BASE_URL,
  routes
});

export default router;
