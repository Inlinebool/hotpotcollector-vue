<template>
  <v-card class="ma-3" width="100%">
    <v-card-title>Selected Facts:</v-card-title>
    <v-card-text>
      <v-row v-for="sentence in selectedSentences" :key="sentence[0]" class="my-2">
        <CollectorSentence :sentenceNumber="sentence[0]" :enabled="true" :showTitle="false" />
      </v-row>
    </v-card-text>
  </v-card>
</template>

<script lang="ts">
import Vue from "vue";
import Component from "vue-class-component";
import CollectorSentence from "./CollectorSentence.vue";
import { FlattenedNumberedSentence, NumberedSentence } from "../Datum";
import CollectorModel from "@/CollectorModel";

@Component({
  components: {
    CollectorSentence,
  },
})
export default class CollectorSelecteFactHint extends Vue {
  get state() {
    return this.$store.state as CollectorModel;
  }
  get contextFlattened() {
    return this.state.datum["flattened_context"] as FlattenedNumberedSentence[];
  }

  get selectedFacts() {
    return this.state.selectedFactsArray;
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
