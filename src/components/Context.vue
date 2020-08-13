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
        clearable
        v-model="searchQuery"
        @input="searchQueryChanged"
      ></v-text-field>
      <v-spacer />
      <v-btn class="mr-2" small @click="expandHit">Expand Hit</v-btn>
      <v-btn class="mr-2" small @click="expandAll">Expand All</v-btn>
      <v-btn class="mr-2" small @click="collapseAll">Collapse All</v-btn>
    </v-toolbar>
    <v-card-text>
      <v-expansion-panels multiple v-model="openedParagraphs">
        <ParagraphPanel
          v-for="(paragraph, index) in context"
          :key="paragraph[0]"
          :paragraphNumber="index"
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
import { Paragraph, FlattenedNumberedSentence, HitStatus } from "../Datum";

@Component({
  components: { ParagraphPanel },
})
export default class Context extends Vue {
  name = "Context";

  get searchQuery() {
    return this.$store.state.searchQuery as string;
  }

  set searchQuery(value) {
    this.$store.commit("setSearchQuery", value);
  }

  get context() {
    return this.$store.state.datum.context as Paragraph[];
  }

  get contextFlattened() {
    return this.$store.state.datum[
      "flattened_context"
    ] as FlattenedNumberedSentence[];
  }

  get hitStatus() {
    return this.$store.getters.hitStatus as HitStatus;
  }

  openedParagraphs = [] as number[];

  @Watch("context")
  onContextChanged() {
    setTimeout(this.expandAll, 200);
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

  expandHit() {
    this.openedParagraphs = [];
    this.context.forEach((paragraph, index) => {
      if (this.hitStatus.hitParagraphs.includes(paragraph[0])) {
        this.openedParagraphs.push(index);
      }
    });
  }

  searchQueryChanged() {
    this.expandHit();
  }
}
</script>
