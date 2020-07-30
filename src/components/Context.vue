<template>
  <v-card class="ma-3">
    <v-toolbar dense elevation="1">
      <v-text-field
        class="mr-2"
        dense
        hide-details
        single-line
        solo
        label="Search: "
        prepend-icon="mdi-magnify"
      ></v-text-field>
      <v-spacer />
      <v-btn class="mr-2" small>Expand Hit</v-btn>
      <v-btn class="mr-2" small @click="expandAll">Expand All</v-btn>
      <v-btn class="mr-2" small @click="collapseAll">Collapse All</v-btn>
    </v-toolbar>
    <v-card-text>
      <v-expansion-panels multiple v-model="openedParagraphs">
        <ParagraphPanel
          v-for="paragraph in context"
          :key="paragraph[0]"
          :paragraph="paragraph"
          v-model="value"
        ></ParagraphPanel>
      </v-expansion-panels>
    </v-card-text>
  </v-card>
</template>

<script lang="ts">
import Vue from "vue";
import Component from "vue-class-component";
import ParagraphPanel from "./ParagraphPanel.vue";
import { Prop, Watch } from "vue-property-decorator";
import { Paragraph } from "../Datum";

@Component({
  components: { ParagraphPanel }
})
export default class Context extends Vue {
  name = "Context";

  @Prop(Array) readonly context!: Paragraph[];

  @Prop(Array)
  value!: number[];

  openedParagraphs = [] as number[];

  @Watch("context")
  onContextChanged() {
    // this.expandAll();
    this.collapseAll();
    this.expandAll();
  }

  expandAll() {
    this.openedParagraphs = [];
    for (let i = 0; i < this.context.length; i++) {
      this.openedParagraphs.push(i);
    }
  }

  collapseAll() {
    this.openedParagraphs = [];
  }
}
</script>
