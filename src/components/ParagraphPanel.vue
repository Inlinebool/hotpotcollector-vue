<template>
  <v-expansion-panel>
    <v-expansion-panel-header>{{ paragraphHeader }}</v-expansion-panel-header>
    <v-expansion-panel-content>
      <v-row v-for="sentence in paragraph[1]" :key="sentence[0]" class="my-2">
        <Sentence :sentenceNumber="sentence[0]" :enabled="true" :showTitle="false" />
      </v-row>
    </v-expansion-panel-content>
  </v-expansion-panel>
</template>

<script lang="ts">
import Vue from "vue";
import Component from "vue-class-component";
import Sentence from "./Sentence.vue";
import { Prop } from "vue-property-decorator";
import { Paragraph } from "../Datum";
import { NameReference } from "@/CollectorModel";

@Component({
  components: {
    Sentence,
  },
})
export default class ParagraphPanel extends Vue {
  name = "ParagraphPanel";

  @Prop(Number) readonly paragraphNumber!: number;

  get paragraph() {
    return this.$store.state.datum.context[this.paragraphNumber] as Paragraph;
  }

  get paragraphReference() {
    return this.$store.state.paragraphReference as NameReference;
  }

  get paragraphHeader() {
    return (
      this.paragraphReference[this.paragraph[0]] + ": " + this.paragraph[0]
    );
  }
}
</script>
