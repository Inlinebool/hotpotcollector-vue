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
      <transition-group name="sentence-transition" tag="p">
        <v-row v-for="sentence in enabledFacts" :key="sentence[0]" class="my-2 sentence-item">
          <Sentence :sentenceNumber="sentence[0]" :enabled="true" :showTitle="true" />
        </v-row>
      </transition-group>
    </v-card-text>
  </v-card>
</template>

<script lang="ts">
import Vue from "vue";
import Component from "vue-class-component";
import Sentence from "./Sentence.vue";
import { Watch } from "vue-property-decorator";
import { FlattenedNumberedSentence, Paragraph, HitStatus } from "../Datum";

@Component({
  components: { Sentence },
})
export default class RankedContext extends Vue {
  name = "RankedContext";

  get context() {
    return this.$store.state.datum.context as Paragraph[];
  }

  get contextFlattened() {
    return this.$store.state.datum[
      "flattened_context"
    ] as FlattenedNumberedSentence[];
  }

  get searchQuery() {
    return this.$store.state.searchQuery as string;
  }

  set searchQuery(value) {
    this.$store.commit("setSearchQuery", value);
  }

  get hitStatus() {
    return this.$store.getters.hitStatus as HitStatus;
  }

  enabledParagraphs = [] as string[];

  selectAll = true;

  @Watch("context")
  onContextChanged() {
    this.enabledParagraphs = [] as string[];
    if (this.context) {
      this.context.forEach((paragraph) => {
        this.enabledParagraphs.push(paragraph[0]);
      });
    }

    this.selectAll = true;
  }

  toggleSelectAll() {
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
    if (this.contextFlattened) {
      this.contextFlattened.forEach((fact) => {
        if (
          this.enabledParagraphs.includes(fact[2]) &&
          this.hitStatus.highlightedSentences[fact[0]] != fact[1]
        ) {
          enabledFacts.push(fact);
        }
      });
    }

    return enabledFacts;
  }
}
</script>
<style>
.sentence-item {
  transition: all 0.5s;
}
.sentence-transition-move {
  transition: transform 0.5s;
}
.sentence-transition-enter, .sentence-transition-leave-to {
  opacity: 0;
  transform: translateX(30px);
}
.sentence-transition-active {
  position: absolute;
}
</style>