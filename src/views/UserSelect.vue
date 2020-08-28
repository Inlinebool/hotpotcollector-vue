<template>
  <v-card class="mx-auto" width="400">
    <v-card-title>Interface Settings</v-card-title>
    <v-card-text>
      <v-form>
        <v-select label="Username" :items="usernames" v-model="user" v-if="false"></v-select>
        <v-select label="Difficulty Levels" :items="levelList" v-model="selectedLevels" multiple></v-select>
        <v-select label="Interface" :items="interfaces" v-model="selectedInterface"></v-select>
      </v-form>
    </v-card-text>
    <v-card-actions>
      <v-spacer></v-spacer>
      <v-btn @click="start">Start</v-btn>
    </v-card-actions>
  </v-card>
</template>

<script lang="ts">
import Vue from "vue";
import { Levels } from "@/Datum";
import Component from "vue-class-component";
import CollectorModel from "@/CollectorModel";

@Component
export default class UserSelect extends Vue {
  usernames = ["anon", "kairong", "josh", "mihai", "fan", "matt"];

  levelList = ["easy", "medium", "hard"];

  interfaces = ["Basic", "Ranked with Context", "Ranked without Context"];

  get state() {
    return this.$store.state as CollectorModel;
  }

  get user() {
    return this.state.user;
  }

  set user(value: string) {
    this.$store.commit("setUser", value);
  }

  get selectedLevels() {
    const selectedLevels = [];
    const levels = this.state.levels;
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

  get selectedInterface() {
    return this.state.interfaceName;
  }

  set selectedInterface(value: string) {
    this.$store.commit("setInterface", value);
  }

  start() {
    if (this.state.interfaceName == "Basic") {
      this.$router.push({ name: "collector" });
    } else {
      this.$router.push({
        name: "instruction",
        params: { pageParam: "ranked" },
      });
    }
  }
}
</script>