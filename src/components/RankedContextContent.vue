<template>
  <v-container>
    <v-expansion-panels>
      <v-expansion-panel>
        <v-expansion-panel-header>Paragraph Select</v-expansion-panel-header>
        <v-expansion-panel-content>
          <v-card>
            <v-row no-gutters>
              <v-switch
                no-gutters
                label="Select All"
                v-model="enableAll"
                dense
                @change="toggleEnableAll"
              ></v-switch>
            </v-row>
            <v-divider />
            <v-row no-gutters>
              <v-col v-for="paragraph in context" :key="paragraph[0]" cols="3">
                <v-checkbox
                  :label="getParagraphHeader(paragraph[0])"
                  v-model="enabledParagraphs"
                  :value="paragraph[0]"
                  dense
                  @change="enableToggled"
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
  </v-container>
</template>

<script lang="ts">
import Vue from "vue";
import Component from "vue-class-component";
import Sentence from "./Sentence.vue";
import { Watch } from "vue-property-decorator";
import { FlattenedNumberedSentence, Paragraph, HitStatus } from "../Datum";
import CollectorModel, { NameReference } from "@/CollectorModel";

@Component({
  components: { Sentence },
})
export default class RankedContextContent extends Vue {
  get state() {
    return this.$store.state as CollectorModel;
  }

  get context() {
    return this.state.datum.context as Paragraph[];
  }

  get contextFlattened() {
    return this.state.datum["flattened_context"] as FlattenedNumberedSentence[];
  }

  get hitStatus() {
    return this.$store.getters.hitStatus as HitStatus;
  }

  get rankedSentences() {
    return this.state.rankedSentences;
  }

  get paragraphReference() {
    return this.state.paragraphReference as NameReference;
  }

  getParagraphHeader(title: string) {
    return this.paragraphReference[title] + ": " + title;
  }

  time() {
    if (this.state.startTime != -1) {
      return Date.now() - this.state.startTime - this.state.pausedTime;
    } else {
      return -1;
    }
  }

  enabledParagraphs = [] as string[];

  enableAll = true;

  created() {
    this.onContextChanged();
  }

  @Watch("context")
  onContextChanged() {
    this.enabledParagraphs = [] as string[];
    if (this.context) {
      this.context.forEach((paragraph) => {
        this.enabledParagraphs.push(paragraph[0]);
      });
    }

    this.enableAll = true;
  }

  toggleEnableAll() {
    if (this.enableAll) {
      this.enabledParagraphs = [] as string[];
      this.context.forEach((paragraph) => {
        this.enabledParagraphs.push(paragraph[0]);
      });
    } else {
      this.enabledParagraphs = [];
    }
    const time = this.time();
    this.$store.dispatch("addToggleEnableAllRecord", { time });
  }

  get enabledFacts() {
    const enabledFacts = [] as FlattenedNumberedSentence[];
    if (this.contextFlattened) {
      for (let i = 0; i < this.rankedSentences.length; i++) {
        const fact = this.contextFlattened[this.rankedSentences[i] - 1];
        if (
          this.enabledParagraphs.includes(fact[2]) &&
          this.hitStatus.highlightedSentences[fact[0]] != fact[1]
        ) {
          enabledFacts.push(fact);
        }
      }
    }

    return enabledFacts;
  }

  enableToggled(enabledParagraphs: string[]) {
    const time = this.time();
    this.$store.dispatch("addToggleEnableRecord", {
      enabledParagraphs,
      time,
    });
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
.sentence-transition-enter,
.sentence-transition-leave-to {
  opacity: 0;
  transform: translateX(30px);
}
.sentence-transition-active {
  position: absolute;
}
</style>