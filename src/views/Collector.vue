<template>
  <v-card class="ma-3">
    <v-overlay :value="paused" opacity="1">
      <v-btn icon @click="togglePause">
        <v-icon>mdi-close</v-icon>
      </v-btn>
    </v-overlay>
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
      <v-btn class="mr-2" small @click="togglePause">Pause</v-btn>
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
            <Context :ready="ready"></Context>
          </v-col>
          <v-col cols="4">
            <v-row>
              <SelectedFactHint :contextFlattened="contextFlattened" />
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
import Component from "vue-class-component";
import axios, { AxiosResponse } from "axios";
import Datum, {
  RankParagraphResponse,
  RankFactResponse,
  AnswerData,
  AnswerSubmit,
} from "../Datum";
import CollectorModel from "@/CollectorModel";
import { Watch } from "vue-property-decorator";

@Component({
  components: {
    Question,
    Context,
    Answer,
    SelectedFactHint,
  },
})
export default class Collector extends Vue {
  gotoIdx = -1;
  previousIndices = [] as number[];
  created() {
    this.randomQuestion(true);
  }
  get state() {
    return this.$store.state as CollectorModel;
  }
  get datum() {
    return this.state.datum as Datum;
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
  get selectedFacts() {
    return this.state.selectedFactsArray;
  }
  get user() {
    return this.state.user;
  }
  get levels() {
    return this.state.levels;
  }
  get ranked(): boolean {
    return this.state.interfaceName != "Basic";
  }
  get paused() {
    return this.state.isPaused;
  }

  ready = false;

  time() {
    if (this.state.startTime != -1) {
      return Date.now() - this.state.startTime - this.state.pausedTime;
    } else {
      return -1;
    }
  }

  createSubmitData() {
    return {
      user: this.state.user,
      levels: this.state.levels,
      interface: this.state.interfaceName,
      totalTime: this.state.sessionTime,
      data: {
        idx: this.state.datum.idx,
        answer: this.state.answer,
        notes: this.state.note,
        supportingFacts: this.state.selectedFactsArray,
        operationRecord: this.state.operationRecords,
        time: this.time(),
      } as AnswerData,
    } as AnswerSubmit;
  }

  onSubmit() {
    if (!this.state.answer) {
      alert("You must type in the answer before submit.");
      return;
    }
    const time = this.time();
    this.$store.dispatch("addSessionTime", { time });
    const submitData = this.createSubmitData();
    console.log(submitData);
    axios
      .post(process.env.VUE_APP_API_URL + "/answer", submitData)
      .then(
        function (this: Collector, response: AxiosResponse) {
          if (response.data.success == "true") {
            this.randomQuestion(true);
          } else {
            alert(response.data);
          }
        }.bind(this)
      );
  }

  onSkip() {
    const time = this.time();
    this.$store.dispatch("addSessionTime", { time });
    const submitData = this.createSubmitData();
    console.log(submitData);
    axios
      .post(process.env.VUE_APP_API_URL + "/answer", submitData)
      .then(
        function (this: Collector, response: AxiosResponse) {
          if (response.data.success == "true") {
            this.randomQuestion(true);
          } else {
            alert(response.data);
          }
        }.bind(this)
      );
  }

  goto() {
    this.indexedQuestion(this.gotoIdx, true);
  }

  backup() {
    if (this.previousIndices.length) {
      this.indexedQuestion(this.previousIndices.pop() as number, false);
    }
  }

  indexedQuestion(idx: number, save: boolean) {
    this.ready = false;
    axios
      .get(process.env.VUE_APP_API_URL + "/question", {
        params: { idx: idx },
      })
      .then(
        function (this: Collector, response: AxiosResponse) {
          this.newQuestion(response.data, save);
        }.bind(this)
      );
  }

  randomQuestion(save: boolean) {
    this.ready = false;
    axios
      .get(process.env.VUE_APP_API_URL + "/question", {
        params: {
          user: this.user,
          easy: this.levels.easy,
          medium: this.levels.medium,
          hard: this.levels.hard,
        },
      })
      .then(
        function (this: Collector, response: AxiosResponse) {
          this.newQuestion(response.data, save);
        }.bind(this)
      );
  }

  newQuestion(datum: Datum, save: boolean) {
    if (!datum || !datum.idx) {
      return;
    }
    if (this.datum.idx && this.datum.idx != -1 && save) {
      this.previousIndices.push(this.datum.idx);
    }
    this.$store.dispatch("newDatum", { datum }).then(() => {
      this.gotoIdx = datum.idx;
      if (this.ranked) {
        this.getRankedContext();
      } else {
        this.getRankedParagraph();
      }
    });
  }

  @Watch("selectedFacts")
  updateRankedContext() {
    if (this.ranked) {
      this.getRankedContext();
    }
  }

  getRankedContext() {
    axios
      .get(process.env.VUE_APP_API_URL + "/rankfact", {
        params: { idx: this.datum.idx, chosenFacts: this.selectedFacts },
      })
      .then(
        function (this: Collector, response: AxiosResponse) {
          const rankResponse = response.data as RankFactResponse;
          this.$store.commit(
            "updateRankedFactNumbers",
            rankResponse.ranked_fact_numbers
          );
          this.ready = true;
        }.bind(this)
      );
  }

  getRankedParagraph() {
    axios
      .get(process.env.VUE_APP_API_URL + "/rankparagraph", {
        params: { idx: this.datum.idx },
      })
      .then(
        function (this: Collector, response: AxiosResponse) {
          const rankedParagraphs = response.data as RankParagraphResponse;
          this.$store.commit(
            "updateRankedParagraphs",
            rankedParagraphs.ranked_paragraphs
          );
          this.ready = true;
        }.bind(this)
      );
  }

  togglePause() {
    this.$store.dispatch("togglePause");
  }
}
</script>