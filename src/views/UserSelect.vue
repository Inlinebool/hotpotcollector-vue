<template>
  <v-card class="mx-auto" width="400">
    <v-card-title>User Select</v-card-title>
    <v-card-text>
      <v-form>
        <v-select label="Username" :items="usernames" v-model="user"></v-select>
        <v-select label="Difficulty Levels" :items="levelList" v-model="selectedLevels" multiple></v-select>
        <v-select label="Interface" :items="interfaces" v-model="selectedInterface"></v-select>
      </v-form>
    </v-card-text>
    <v-card-actions>
      <v-spacer></v-spacer>
      <v-btn :to="selectedInterfaceRoute">Start</v-btn>
    </v-card-actions>
  </v-card>
</template>

<script lang="ts">
import Vue from "vue";
import { Levels } from "@/Datum";
import Component from "vue-class-component";

interface InterfaceRoutes {
  [interfaceName: string]: string;
}

@Component
export default class UserSelect extends Vue {
  name = "UserSelect";

  usernames = ["anon", "kairong", "josh", "mihai", "fan", "matt"];

  levelList = ["easy", "medium", "hard"];

  interfaces = ["Basic", "Ranked"];

  selectedInterface = "Basic";

  interfaceRoutes = {
    Basic: "/basic",
    Ranked: "/ranked",
  } as InterfaceRoutes;

  get user() {
    return this.$store.state.user;
  }

  set user(value: string) {
    this.$store.commit("setUser", value);
  }

  get selectedLevels() {
    const selectedLevels = [];
    const levels = this.$store.state.levels;
    for (const level of this.levelList) {
      if (levels[level]) {
        selectedLevels.push(level);
      }
    }
    return selectedLevels;
  }

  set selectedLevels(value: string[]) {
    const levels = { easy: false, medium: false, hard: false } as Levels;
    for (const level of value) {
      levels[level] = true;
    }
    this.$store.commit("setLevels", levels);
  }

  get selectedInterfaceRoute() {
    return this.interfaceRoutes[this.selectedInterface];
  }
}
</script>