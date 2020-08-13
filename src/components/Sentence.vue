<template>
  <v-hover v-slot:default="{ hover }">
    <v-container class="pb-0">
      <v-row>
        <v-card
          :elevation="hover ? 2 : 0"
          class="mx-3"
          :class="{ 'on-hover': hover }"
          style="cursor:pointer;user-select:none"
          width="100%"
          v-if="enabled"
          @click.native="onClickFact"
        >
          <span class="mr-2">
            <span class="no-text">
              <span>{{sentenceNumberText}}</span>
              <span v-html="questionHighlighted" class="ml-1"></span>
            </span>
          </span>
          <v-overlay absolute class="justify-start" opacity="0">
            <span class="mr-2">
              <span class="no-text">
                <span :class="{'deep-purple lighten-4': selected}">{{sentenceNumberText}}</span>
                <span v-html="selectedHighlighted" :class="{'selected': selected}" class="ml-1"></span>
              </span>
            </span>
          </v-overlay>
          <v-overlay absolute class="justify-start text--primary" opacity="0">
            <span class="mr-2">
              <span>
                <span>{{sentenceNumberText}}</span>
                <span v-html="searchHighlighted" class="ml-1"></span>
              </span>
            </span>
          </v-overlay>
        </v-card>
      </v-row>
      <v-row v-if="showTitle" class="mx-0 pb-1">
        <v-row>
          <v-btn
            class="font-italic text-decoration-underline"
            @click="onClickTitle"
            text
            small
          >({{ sentence[2] }})</v-btn>
        </v-row>
        <v-row>
          <v-expand-transition v-if="showTitle">
            <v-card v-show="expand" width="70%" class="mx-10">
              <v-card-text>
                <v-row v-for="sentence in paragraph[1]" :key="sentence[0]" class="my-2">
                  <Sentence :sentenceNumber="sentence[0]" :enabled="true" :showTitle="false" />
                </v-row>
              </v-card-text>
            </v-card>
          </v-expand-transition>
        </v-row>
      </v-row>
    </v-container>
  </v-hover>
</template>

<script lang="ts">
import Vue from "vue";
import Component from "vue-class-component";
import { Prop } from "vue-property-decorator";
import { Paragraph, FlattenedNumberedSentence, HitStatus } from "../Datum";
import sw from "stopword";

@Component
export default class Sentence extends Vue {
  name = "Sentence";

  @Prop(Number) readonly sentenceNumber!: number;

  get sentence() {
    for (let i = 0; i < this.contextFlattened.length; i++) {
      if (this.sentenceNumber == this.contextFlattened[i][0]) {
        return this.contextFlattened[i];
      }
    }
    return this.contextFlattened[0];
  }

  get context() {
    return this.$store.state.datum.context as Paragraph[];
  }

  get contextFlattened() {
    return this.$store.state.datum[
      "flattened_context"
    ] as FlattenedNumberedSentence[];
  }

  get selectedFacts() {
    return this.$store.state.selectedFacts as number[];
  }

  get searchQuery() {
    return this.$store.state.searchQuery as string;
  }

  get hitStatus() {
    return this.$store.getters.hitStatus as HitStatus;
  }

  @Prop(Boolean) readonly enabled!: boolean;

  @Prop(Boolean) readonly showTitle!: boolean;

  get question() {
    return this.$store.state.datum.question;
  }

  expand = false;

  get sentenceNumberText() {
    return "[ " + this.sentence[0] + " ]";
  }

  get searchHighlighted() {
    if (this.hitStatus.highlightedSentences[this.sentence[0]]) {
      return this.hitStatus.highlightedSentences[this.sentence[0]].trim();
    } else {
      return this.sentence[1].trim();
    }
  }

  get questionHighlighted() {
    let questionWords = this.question.split(/\W+/);
    questionWords = sw.removeStopwords(questionWords);
    let questionHighlightedSentence = this.sentence[1];
    questionWords.forEach((word: string) => {
      if (!word || word == "s") {
        return;
      }
      const query = RegExp("\\b" + word + "\\b", "gi");
      questionHighlightedSentence = questionHighlightedSentence.replace(
        query,
        '<span class="questionHighlight">$&</span>'
      );
    });
    return questionHighlightedSentence.trim();
  }

  get selectedHighlighted() {
    if (!this.selectedFacts.length) {
      return this.sentence[1].trim();
    } else {
      const selectedWords = new Set<string>();
      this.selectedFacts.forEach((selectedNumber) => {
        let words = this.contextFlattened[selectedNumber - 1][1].split(/\W+/);
        words = sw.removeStopwords(words);
        words.forEach((word) => {
          selectedWords.add(word);
        });
      });
      let selectedHighlightedSentence = this.sentence[1];
      selectedWords.forEach((word: string) => {
        if (!word || word == "s") {
          return;
        }
        const query = RegExp("\\b" + word + "\\b", "gi");
        selectedHighlightedSentence = selectedHighlightedSentence.replace(
          query,
          '<span class="selectedHighlight">$&</span>'
        );
      });
      return selectedHighlightedSentence.trim();
    }
  }

  get paragraph() {
    if (this.context && this.sentence[2])
      for (const paragraph of this.context) {
        if (paragraph[0] == this.sentence[2]) {
          return paragraph;
        }
      }
    return undefined;
  }

  get selected() {
    if (this.selectedFacts.includes(this.sentence[0])) {
      return true;
    } else {
      return false;
    }
  }

  onClickFact() {
    this.$store.commit("toggleFactSelection", this.sentence[0]);
  }

  onClickTitle() {
    this.expand = !this.expand;
  }
}
</script>

<style>
.questionHighlight {
  background-color: #90caf9;
}
.searchHit {
  font-weight: 700;
}
.selected,
.selectedHighlight {
  text-decoration: underline;
  text-decoration-color: #9575cd;
}
.no-text {
  color: rgba(0, 0, 0, 0);
}
</style>