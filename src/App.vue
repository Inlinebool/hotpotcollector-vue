<template>
  <v-app>
    <v-app-bar app color="primary" dark>
      <v-toolbar-title>Hotpot Collector</v-toolbar-title>
    </v-app-bar>
    <v-content>
      <router-view />
    </v-content>
    <v-btn
      v-scroll="onScroll"
      v-show="fab"
      fab
      dark
      fixed
      bottom
      right
      color="primary"
      @click="toTop"
    >
      <v-icon>mdi-arrow-up</v-icon>
    </v-btn>
  </v-app>
</template>

<script lang="ts">
import Vue from "vue";
import store from "./store";
import _ from "lodash";
import { OperationRecord } from "./Datum";
import { Store } from "vuex";
import CollectorModel from "./CollectorModel";

export default Vue.extend({
  name: "App",

  components: {},

  data: () => ({
    //
    fab: false,
  }),

  store,

  methods: {
    onScroll(e: { target: { scrollTop: any } }) {
      if (typeof window === "undefined") return;
      const top = window.pageYOffset || e.target.scrollTop || 0;
      this.fab = top > 20;
      const state = this.$store.state as CollectorModel;
      if (state.startTime != -1) {
        const time = Date.now() - state.startTime - state.pausedTime;
        this.recordScroll(top, time, this.$store);
      }
    },
    toTop() {
      this.$vuetify.goTo(0);
    },
    recordScroll: _.throttle((top: number, time: number, store: any) => {
      store.commit("appendOperationRecord", {
        name: "scroll",
        data: top,
        time: time,
      } as OperationRecord);
    }, 200),
  },
});
</script>
