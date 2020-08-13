<template>
  <v-card class="ma-3" width="100%">
    <v-card-title>Selected Facts:</v-card-title>
    <v-card-text>
      <v-row v-for="sentence in selectedSentences" :key="sentence[0]" class="my-2">
        <Sentence :sentenceNumber="sentence[0]" :enabled="true" :showTitle="false" />
      </v-row>
    </v-card-text>
  </v-card>
</template>

<script lang="ts">
import Vue from "vue";
import Component from "vue-class-component";
import Sentence from "./Sentence.vue";
import { FlattenedNumberedSentence, NumberedSentence } from "../Datum";

@Component({
  components: {
    Sentence,
  },
})
export default class SelecteFactHint extends Vue {
  name = "SelecteFactHint";

  get contextFlattened() {
    return this.$store.state.datum[
      "flattened_context"
    ] as FlattenedNumberedSentence[];
  }

  get selectedFacts() {
    return this.$store.state.selectedFacts as number[];
  }

  get selectedSentences() {
    const selectedSentences = [] as NumberedSentence[];
    this.selectedFacts.forEach((idx) => {
      for (let i = 0; i < this.contextFlattened.length; i++) {
        if (idx == this.contextFlattened[i][0]) {
          selectedSentences.push(this.contextFlattened[i]);
        }
      }
    });
    return selectedSentences;
  }
}
</script>
