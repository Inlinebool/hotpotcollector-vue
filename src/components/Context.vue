<template>
  <v-card class="ma-3">
    <v-card-text>
      <v-expansion-panels v-model="context" multiple value="1">
        <ParagraphPanel v-for="paragraph in context" :key="paragraph[0]" :paragraph="paragraph"></ParagraphPanel>
      </v-expansion-panels>
    </v-card-text>
  </v-card>
</template>

<script lang="ts">
import Vue from "vue";
import Component from "vue-class-component";
import ParagraphPanel from "./ParagraphPanel.vue";
import { Prop } from "vue-property-decorator";
import { Paragraph } from "../Datum";

@Component({
  components: { ParagraphPanel }
})
export default class Context extends Vue {
  name = "Context";

  @Prop(Array) readonly context: [] | undefined;

  openedParagraphs = [0, 1, 2];

  created() {
    console.log(this.context);
  }
}
</script>
