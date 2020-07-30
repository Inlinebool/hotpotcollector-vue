<template>
  <v-hover v-slot:default="{ hover }">
    <v-card
      :elevation="hover ? 2 : 0"
      :class="{ 'on-hover': hover , 'blue lighten-4 font-weight-medium': selected, 'purple lighten-5': hit}"
      style="cursor:pointer;user-select:none"
      width="100%"
      @click="onClickFact"
    >
      <span class="mr-2">
        <span>[ {{ sentence[0] }} ]</span>
        <span>{{ sentence[1] }}</span>
      </span>
    </v-card>
  </v-hover>
</template>

<script lang="ts">
import Vue from "vue";
import Component from "vue-class-component";
import { Prop } from "vue-property-decorator";
import { NumberedSentence, ParagraphHitStatus } from "../Datum";

@Component
export default class ParagraphPanel extends Vue {
  name = "ParagraphPanel";

  @Prop(Array) readonly sentence!: NumberedSentence;

  @Prop(Array)
  value!: number[];

  @Prop(Object) readonly hitStatus!: ParagraphHitStatus;

  get selected() {
    if (this.value.includes(this.sentence[0])) {
      return true;
    } else {
      return false;
    }
  }

  get hit() {
    if (!this.hitStatus) {
      return false;
    }
    if (this.hitStatus.hitSentences.includes(this.sentence[0])) {
      return true;
    } else {
      return false;
    }
  }

  onClickFact() {
    if (!this.value.includes(this.sentence[0])) {
      this.value.push(this.sentence[0]);
    } else {
      const pos = this.value.indexOf(this.sentence[0]);
      this.value.splice(pos, 1);
    }
    this.$emit("input", this.value);
  }
}
</script>

<style scoped>
</style>