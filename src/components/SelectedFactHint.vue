<template>
  <v-card class="ma-3" width="100%">
    <v-card-title>Selected Facts:</v-card-title>
    <v-card-text>
      <v-row v-for="sentence in selectedSentences" :key="sentence[0]" class="my-2">
        <Sentence :sentence="sentence" v-model="value" />
      </v-row>
    </v-card-text>
  </v-card>
</template>

<script lang="ts">
import Vue from "vue";
import Component from "vue-class-component";
import Sentence from "./Sentence.vue";
import { Prop } from "vue-property-decorator";
import { FlattenedNumberedSentence, NumberedSentence } from "../Datum";

@Component({
  components: {
    Sentence
  }
})
export default class SelecteFactHint extends Vue {
  name = "SelecteFactHint";

  @Prop(Array) readonly contextFlattened!: FlattenedNumberedSentence[];

  @Prop(Array)
  value!: number[];

  get selectedSentences() {
    const selectedSentences = [] as NumberedSentence[];
    this.value.forEach(idx =>
      selectedSentences.push([
        this.contextFlattened[idx - 1][0],
        this.contextFlattened[idx - 1][1]
      ])
    );
    return selectedSentences;
  }
}
</script>
