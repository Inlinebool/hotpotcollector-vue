<template>
  <v-card class="ma-3">
    <v-toolbar dense elevation="1" floating>
      <v-text-field
        class="mr-2 shrink"
        dense
        hide-details
        single-line
        solo
        label="Question Index: "
        append-icon="mdi-arrow-right-bold"
        v-model="gotoIdx"
        @click:append="goto"
      ></v-text-field>
      <v-btn class="mr-2" small @click="randomQuestion">
        <v-icon>mdi-shuffle-variant</v-icon>
      </v-btn>
      <v-btn class="mr-2" small @click="backup">
        <v-icon>mdi-backup-restore</v-icon>
      </v-btn>
    </v-toolbar>
    <v-card-text>
      <v-container>
        <v-row>
          <v-col>
            <Question :question="question" />
          </v-col>
        </v-row>
        <v-row>
          <v-col cols="8">
            <Context :context="context" v-model="selectedFacts" />
          </v-col>
          <v-col cols="4">
            <v-row>
              <SelectedFactHint :contextFlattened="contextFlattened" v-model="selectedFacts" />
            </v-row>
            <v-row>
              <Answer @submit="onSubmit" @skip="onSkip" />
            </v-row>
          </v-col>
        </v-row>
      </v-container>
    </v-card-text>
  </v-card>
</template>

<script lang="ts">
import Vue from "vue";
import Question from "../components/Question.vue";
import Context from "../components/Context.vue";
import Answer from "../components/Answer.vue";
import SelectedFactHint from "../components/SelectedFactHint.vue";
import QuestionSelect from "../components/QuestionSelect.vue";
import Component from "vue-class-component";
import axios, { AxiosResponse } from "axios";
import Datum from "../Datum";

@Component({
  components: {
    Question,
    Context,
    Answer,
    QuestionSelect,
    SelectedFactHint,
  },
})
export default class BasicCollector extends Vue {
  name = BasicCollector;
  datum = {} as Datum;
  selectedFacts = [];
  gotoIdx = -1;
  previousIndices = [] as number[];
  created() {
    this.randomQuestion(true);
  }
  get question() {
    return this.datum["question"];
  }
  get context() {
    return this.datum["context"];
  }
  get contextFlattened() {
    return this.datum["flattened_context"];
  }

  onSubmit(answer: string, note: string) {
    console.log(this.selectedFacts, answer, note);
  }

  onSkip(note: string) {
    return 0;
  }

  goto() {
    this.indexedQuestion(this.gotoIdx, true);
  }

  backup() {
    console.log(this.previousIndices);
    if (this.previousIndices.length) {
      this.indexedQuestion(this.previousIndices.pop() as number, false);
    }
  }

  indexedQuestion(idx: number, save: boolean) {
    axios
      .get(process.env.VUE_APP_API_URL + "/question", {
        params: { idx: idx },
      })
      .then(
        function (this: BasicCollector, response: AxiosResponse) {
          this.newQuestion(response.data, save);
        }.bind(this)
      );
  }

  randomQuestion(save: boolean) {
    axios
      .get(process.env.VUE_APP_API_URL + "/question", {
        params: { user: "anon", easy: true, medium: true, hard: true },
      })
      .then(
        function (this: BasicCollector, response: AxiosResponse) {
          this.newQuestion(response.data, save);
        }.bind(this)
      );
  }

  newQuestion(datum: Datum, save: boolean) {
    if (this.datum.idx && save) {
      this.previousIndices.push(this.datum.idx);
    }
    this.datum = datum;
    this.selectedFacts = [];
    this.gotoIdx = this.datum.idx;
  }
}
</script>