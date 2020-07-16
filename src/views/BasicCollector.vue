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
        :value="questionIdx"
        @click:append="goto"
      ></v-text-field>
      <v-btn class="mr-2" small @click="randomQuestion">
        <v-icon>mdi-shuffle-variant</v-icon>
      </v-btn>
      <v-btn class="mr-2" small>
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
import { Watch } from "vue-property-decorator";
import axios, { AxiosResponse } from "axios";
import Datum, { Paragraph } from "../Datum";

@Component({
  components: {
    Question,
    Context,
    Answer,
    QuestionSelect,
    SelectedFactHint
  }
})
export default class BasicCollector extends Vue {
  name = BasicCollector;
  datum = {} as Datum;
  questionIdx = -1;
  selectedFacts = [];
  created() {
    // axios.get(process.env.VUE_APP_API_URL + "/question", {}).then(
    //   function(this: BasicCollector, response: AxiosResponse) {
    //     this.datum = response.data.data;
    //     this.questionIdx = response.data.idx;
    //     console.log(this.datum);
    //   }.bind(this)
    // );
    this.randomQuestion();
  }
  get question() {
    return this.datum["question"];
  }
  get context() {
    return this.datum["numbered_context"];
  }
  get contextFlattened() {
    return this.datum["numbered_context_flattened"];
  }

  onSubmit(answer: string, note: string) {
    console.log(this.selectedFacts, answer, note);
  }

  onSkip(note: string) {
    return 0;
  }

  goto() {
    return 0;
  }

  randomQuestion() {
    axios.get(process.env.VUE_APP_API_URL + "/question", {}).then(
      function(this: BasicCollector, response: AxiosResponse) {
        this.datum = response.data.data;
        this.questionIdx = response.data.idx;
        console.log(this.datum);
      }.bind(this)
    );
    this.selectedFacts = [];
  }
}
</script>