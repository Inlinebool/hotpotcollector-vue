<template>
  <v-expansion-panel @change="onParagraphToggled">
    <v-expansion-panel-header>{{ paragraphHeader }}</v-expansion-panel-header>
    <v-expansion-panel-content>
      <v-row v-for="sentence in paragraph[1]" :key="sentence[0]" class="my-2">
        <CollectorSentence :sentenceNumber="sentence[0]" :enabled="true" :showTitle="false" />
      </v-row>
    </v-expansion-panel-content>
  </v-expansion-panel>
</template>

<script lang="ts">
import Vue from "vue";
import Component from "vue-class-component";
import CollectorSentence from "./CollectorSentence.vue";
import { Prop } from "vue-property-decorator";
import { Paragraph } from "../Datum";
import CollectorModel, { NameReference } from "@/CollectorModel";

@Component({
  components: {
    CollectorSentence,
  },
})
export default class CollectorContextParagraphPanel extends Vue {
  @Prop(Number) readonly paragraphNumber!: number;

  get state() {
    return this.$store.state as CollectorModel;
  }

  get paragraph() {
    return this.state.datum.context[this.paragraphNumber] as Paragraph;
  }

  get paragraphReference() {
    return this.state.paragraphReference as NameReference;
  }

  get paragraphHeader() {
    return (
      this.paragraphReference[this.paragraph[0]] + ": " + this.paragraph[0]
    );
  }

  onParagraphToggled() {
    this.$emit("toggled");
  }
}
</script>
