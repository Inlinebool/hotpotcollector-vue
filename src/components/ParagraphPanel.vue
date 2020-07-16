<template>
  <v-expansion-panel>
    <v-expansion-panel-header>{{ paragraph[0] }}</v-expansion-panel-header>
    <v-expansion-panel-content>
      <v-row v-for="sentence in paragraph[1]" :key="sentence[0]" class="my-2">
        <Sentence :sentence="sentence" v-model="value" />
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

@Component({
  components: {
    Sentence
  }
})
export default class ParagraphPanel extends Vue {
  name = "ParagraphPanel";

  @Prop(Array) readonly paragraph: Paragraph | undefined;

  @Prop(Array)
  value!: number[];

  onFactClicked(idx: number, value: boolean) {
    this.$emit("factClicked", idx, value);
  }

  // created() {
  //   console.log(this.paragraph)
  // }
}
</script>
