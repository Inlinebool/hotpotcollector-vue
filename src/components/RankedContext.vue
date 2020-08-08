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
        v-model="searchString"
        @input="searchStringChanged"
      ></v-text-field>
      <v-spacer />
      <!-- <v-btn class="mr-2" small @click="expandHit">Expand Hit</v-btn>
      <v-btn class="mr-2" small @click="expandAll">Expand All</v-btn>
      <v-btn class="mr-2" small @click="collapseAll">Collapse All</v-btn>-->
    </v-toolbar>
    <v-card-text>
      <v-expansion-panels>
        <v-expansion-panel>
          <v-expansion-panel-header>Paragraph Select</v-expansion-panel-header>
          <v-expansion-panel-content>
            <v-card>
              <v-row no-gutters>
                <v-switch
                  no-gutters
                  label="Select All"
                  v-model="selectAll"
                  dense
                  @change="toggleSelectAll"
                ></v-switch>
              </v-row>
              <v-divider />
              <v-row no-gutters>
                <v-col v-for="paragraph in context" :key="paragraph[0]" cols="3">
                  <v-checkbox
                    :label="paragraph[0]"
                    v-model="enabledParagraphs"
                    :value="paragraph[0]"
                    dense
                  ></v-checkbox>
                </v-col>
              </v-row>
            </v-card>
          </v-expansion-panel-content>
        </v-expansion-panel>
      </v-expansion-panels>
      <v-row v-for="sentence in enabledFacts" :key="sentence[0]" class="my-2">
        <Sentence
          :sentence="sentence"
          :context="context"
          v-model="value"
          :hitStatus="sentenceHitStatus"
          :enabled="enabledParagraphs.includes(sentence[2])"
        />
      </v-row>
    </v-card-text>
  </v-card>
</template>

<script lang="ts">
import Vue from "vue";
import Component from "vue-class-component";
import Sentence from "./Sentence.vue";
import { Prop, Watch } from "vue-property-decorator";
import {
  FlattenedNumberedSentence,
  Paragraph,
  ParagraphHitStatus,
} from "../Datum";

@Component({
  components: { Sentence },
})
export default class RankedContext extends Vue {
  name = "RankedContext";
  searchString = "";

  @Prop(Array) readonly context!: Paragraph[];

  @Prop(Array) readonly contextFlattened!: FlattenedNumberedSentence[];

  @Prop(Array) readonly contextRanked!: FlattenedNumberedSentence[];

  @Prop(Array)
  value!: number[];

  sentenceHitStatus = { hit: false, hitSentences: [] } as ParagraphHitStatus;

  enabledParagraphs = [] as string[];

  selectAll = true;

  @Watch("context")
  onContextChanged() {
    this.enabledParagraphs = [] as string[];
    this.context.forEach((paragraph) => {
      this.enabledParagraphs.push(paragraph[0]);
    });
    this.selectAll = true;
  }

  // @Watch("enabledParagraphs")
  // onEnabledParagraphsChanged() {
  //   if (this.enabledParagraphs.length == this.context.length) {
  //     this.selectAll = true;
  //   } else {
  //     this.selectAll = false;
  //   }
  // }

  toggleSelectAll() {
    console.log(this.selectAll);
    if (this.selectAll) {
      this.enabledParagraphs = [] as string[];
      this.context.forEach((paragraph) => {
        this.enabledParagraphs.push(paragraph[0]);
      });
    } else {
      this.enabledParagraphs = [];
    }
  }

  get enabledFacts() {
    const enabledFacts = [] as FlattenedNumberedSentence[];
    this.contextRanked.forEach((fact) => {
      if (this.enabledParagraphs.includes(fact[2])) {
        enabledFacts.push(fact);
      }
    });
    return enabledFacts;
  }

  searchStringChanged() {
    this.sentenceHitStatus.hitSentences = [];
    this.contextRanked.forEach((sentence) => {
      if (
        this.searchString &&
        sentence[1].toLowerCase().includes(this.searchString.toLowerCase())
      ) {
        this.sentenceHitStatus.hitSentences.push(sentence[0]);
      }
    });
    this.$emit(
      "searchStringChanged",
      this.searchString,
      this.sentenceHitStatus
    );
  }
}
</script>
