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
                <span :class="{'purple lighten-5': selected}">{{sentenceNumberText}}</span>
                <span v-html="selectedHighlighted" :class="{'selected': selected}" class="ml-1"></span>
              </span>
            </span>
          </v-overlay>
          <v-overlay absolute class="justify-start text--primary" opacity="0" color="white">
            <span class="mr-2">
              <span>
                <span>{{sentenceNumberText}}</span>
                <span v-html="searchHighlighted" class="ml-1"></span>
              </span>
            </span>
          </v-overlay>
          <v-overlay absolute class="justify-start text--primary" opacity="0" color="white">
            <span class="mr-2 no-text">
              <span>
                <span>{{sentenceNumberText}}</span>
                <span v-html="answerHighlighted" class="ml-1"></span>
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
          >({{ paragraphHeader }})</v-btn>
        </v-row>
        <v-row>
          <v-expand-transition>
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
import CollectorModel, { NameReference } from "@/CollectorModel";

@Component({
  name: "Sentence",
})
export default class CollectorSentence extends Vue {
  @Prop(Number) readonly sentenceNumber!: number;
  @Prop(Boolean) readonly enabled!: boolean;
  @Prop(Boolean) readonly showTitle!: boolean;

  get state() {
    return this.$store.state as CollectorModel;
  }

  get sentence() {
    return this.contextFlattened[this.sentenceNumber - 1];
  }

  get context() {
    return this.state.datum.context as Paragraph[];
  }

  get contextFlattened() {
    return this.state.datum["flattened_context"] as FlattenedNumberedSentence[];
  }

  get selectedFacts() {
    return this.state.selectedFactsArray;
  }

  get searchQuery() {
    return this.state.searchQuery as string;
  }

  get hitStatus() {
    return this.$store.getters.hitStatus as HitStatus;
  }

  get sentenceReference() {
    return this.state.sentenceReference as NameReference;
  }

  get question() {
    return this.state.datum.question;
  }

  get sentenceNumberText() {
    return "[" + this.sentence[0] + "]";
  }

  get searchHighlighted() {
    if (this.hitStatus.highlightedSentences[this.sentence[0]]) {
      return this.hitStatus.highlightedSentences[this.sentence[0]].trim();
    } else {
      return this.sentence[1].trim();
    }
  }

  get answerHighlighted() {
    let answerHighlighedSentence = this.sentence[1];
    if (this.state.answer) {
      const answerQuery = new RegExp(this.state.answer, "gi");
      answerHighlighedSentence = answerHighlighedSentence.replace(
        answerQuery,
        '<span class="answerHit">$&</span>'
      );
    }
    return answerHighlighedSentence.trim();
  }

  get questionHighlighted() {
    const regexpBMPWord = /(\w|[\u0080-\uFFFF])+/gu;
    let questionWords = this.question.match(regexpBMPWord);
    questionWords = sw.removeStopwords(questionWords);
    let questionHighlightedSentence = this.sentence[1];
    if (questionWords) {
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
    }

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

  get paragraphNumber() {
    if (this.context && this.sentence[2])
      for (let i = 0; i < this.context.length; i++) {
        if (this.context[i][0] == this.sentence[2]) {
          return i;
        }
      }
    return undefined;
  }

  get paragraphReference() {
    return this.state.paragraphReference as NameReference;
  }

  get paragraphHeader() {
    if (this.paragraph) {
      return (
        this.paragraphReference[this.paragraph[0]] + ": " + this.paragraph[0]
      );
    } else {
      return undefined;
    }
  }

  get selected() {
    if (this.selectedFacts.includes(this.sentence[0])) {
      return true;
    } else {
      return false;
    }
  }

  onClickFact() {
    const options = {
      factNumber: this.sentence[0],
      time: Date.now() - this.state.startTime - this.state.pausedTime,
    };
    this.$store.dispatch("onFactClicked", options);
  }

  time() {
    if (this.state.startTime != -1) {
      return Date.now() - this.state.startTime - this.state.pausedTime;
    } else {
      return -1;
    }
  }

  expand = false;

  onClickTitle() {
    this.expand = !this.expand;
    const factNumber = this.sentence[0];
    const time = this.time();
    this.$store.dispatch("addToggleSentenceContextRecord", {
      factNumber,
      time,
    });
  }
}
</script>

<style>
.questionHighlight {
  background-color: #bbdefb;
}
.searchHit {
  /* font-weight: 700; */
  /* font-style: italic; */
  color: #d81b60;
}
.answerHit {
  /* font-weight: 700; */
  /* font-style: italic; */
  text-decoration: underline;
  color: #ffa726;
}
.selected,
.selectedHighlight {
  /* text-decoration: underline;
  text-decoration-color: #9575cd; */
  background-color: #f3e5f5;
}
.no-text {
  color: rgba(0, 0, 0, 0);
}
</style>