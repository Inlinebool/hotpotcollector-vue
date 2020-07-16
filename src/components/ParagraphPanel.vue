<template>
  <v-expansion-panel>
    <v-expansion-panel-header>{{ paragraph[0] }}</v-expansion-panel-header>
    <v-expansion-panel-content>
      <Sentence v-for="sentence in paragraph[1]" :key="sentence[0]" :sentence="sentence">
      </Sentence>
    </v-expansion-panel-content>
  </v-expansion-panel>
</template>

<script lang="ts">
import Vue from "vue";
import Component from "vue-class-component";
import Sentence from "./Sentence.vue"
import { Prop } from "vue-property-decorator";
import { Paragraph } from "../Datum";

@Component({
  components: {
    Sentence
  }
})
export default class ParagraphPanel extends Vue {
  name = "ParagraphPanel";

  @Prop(Array) readonly paragraph: Paragraph | undefined;
}
</script>
