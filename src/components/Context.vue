<template>
  <v-card class="ma-3" max-height>
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
      <v-btn class="mr-2" small @click="expandHit(true)" v-if="!ranked">Expand Hit</v-btn>
      <v-btn class="mr-2" small @click="expandAll(true)" v-if="!ranked">Expand All</v-btn>
      <v-btn class="mr-2" small @click="collapseAll(true)" v-if="!ranked">Collapse All</v-btn>
    </v-toolbar>
    <v-card-text>
      <v-expansion-panels multiple v-model="openedParagraphs" v-if="!ranked && ready">
        <ParagraphPanel
          v-for="(index) in range(context.length)"
          :key="index"
          :paragraphNumber="rankedParagraphIndices[index]"
          @toggled="onParagraphToggled"
        ></ParagraphPanel>
      </v-expansion-panels>
      <RankedContextContent v-if="ranked && ready"></RankedContextContent>
    </v-card-text>
  </v-card>
</template>

<script lang="ts">
import Vue from "vue";
import Component from "vue-class-component";
import ParagraphPanel from "./ParagraphPanel.vue";
import { Watch, Prop } from "vue-property-decorator";
import {
  Paragraph,
  FlattenedNumberedSentence,
  HitStatus,
  ParagraphSimilarity,
} from "../Datum";
import CollectorModel, { NameReference } from "@/CollectorModel";
import RankedContextContent from "@/components/RankedContextContent.vue";
import _ from "lodash";

@Component({
  components: {
    ParagraphPanel,
    RankedContextContent,
  },
})
export default class Context extends Vue {
  @Prop(Boolean) readonly ready!: boolean;

  get state() {
    return this.$store.state as CollectorModel;
  }

  get searchQuery() {
    return this.state.searchQuery as string;
  }

  set searchQuery(value) {
    this.$store.commit("setSearchQuery", value);
  }

  get context() {
    return this.state.datum.context as Paragraph[];
  }

  get rankedParagraphIndices() {
    const rankedParagraphs = this.state
      .rankedParagraphs as ParagraphSimilarity[];
    const paragraphReference = this.state.paragraphReference as NameReference;
    const rankedIndices = [] as number[];
    for (const paragraph of rankedParagraphs) {
      rankedIndices.push(
        paragraphReference[paragraph[0]].charCodeAt(0) - "A".charCodeAt(0)
      );
    }
    return rankedIndices;
  }

  get reverseRankedParagraphIndices() {
    const rankedParagraphs = this.state.rankedParagraphs;
    const reverseIndices = {} as NameReference;
    for (const paragraph of this.context) {
      for (let i = 0; i < rankedParagraphs.length; i++) {
        if (rankedParagraphs[i][0] == paragraph[0]) {
          reverseIndices[paragraph[0]] = String(i);
        }
      }
    }
    return reverseIndices;
  }

  get contextFlattened() {
    return this.state.datum["flattened_context"] as FlattenedNumberedSentence[];
  }

  get hitStatus() {
    return this.$store.getters.hitStatus as HitStatus;
  }

  get ranked(): boolean {
    return this.state.interfaceName != "Basic";
  }

  get contexted(): boolean {
    return this.state.interfaceName == "Ranked without Context";
  }

  get openedParagraphTitles() {
    const titles = [] as string[];
    if (this.ready) {
      for (const index of this.openedParagraphs) {
        titles.push(this.context[this.rankedParagraphIndices[index]][0]);
      }
    }
    return titles;
  }

  time() {
    if (this.state.startTime != -1) {
      return Date.now() - this.state.startTime - this.state.pausedTime;
    } else {
      return -1;
    }
  }

  openedParagraphs = [] as number[];

  onParagraphToggled() {
    const time = this.time();
    const titles = this.openedParagraphTitles;
    this.$store.dispatch("addToggleParagraphRecord", { titles, time });
  }

  @Watch("context")
  onContextChanged() {
    setTimeout(this.expandAll, 200, false);
  }

  range(size: number) {
    return _.range(size);
  }

  expandAll(record: boolean) {
    this.openedParagraphs = [];
    for (let i = 0; i < this.context.length; i++) {
      this.openedParagraphs.push(i);
    }
    if (record) {
      const time = this.time();
      if (time != -1) {
        this.$store.dispatch("addExpandAllRecord", { time });
      }
    }
  }

  collapseAll(record: boolean) {
    this.openedParagraphs = [];
    if (record) {
      const time = this.time();
      if (time != -1) {
        this.$store.dispatch("addCollapseAllRecord", { time });
      }
    }
  }

  expandHit(record: boolean) {
    this.openedParagraphs = [];
    this.context.forEach((paragraph) => {
      if (this.hitStatus.hitParagraphs.includes(paragraph[0])) {
        this.openedParagraphs.push(
          Number(this.reverseRankedParagraphIndices[paragraph[0]])
        );
      }
    });
    if (record) {
      const time = this.time();
      if (time != -1) {
        this.$store.dispatch("addExpandHitRecord", { time });
      }
    }
  }

  searchQueryChanged() {
    this.expandHit(false);
    const time = this.time();
    if (time != -1) {
      this.$store.dispatch("addSearchRecord", { time });
    }
  }
}
</script>
