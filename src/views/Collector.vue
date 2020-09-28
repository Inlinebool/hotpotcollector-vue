<template>
  <v-card class="ma-auto" max-width="1400px">
    <v-overlay :value="paused" opacity="1" color="black">
      <v-btn icon @click="togglePause">
        <v-icon>mdi-close</v-icon>
      </v-btn>
    </v-overlay>
    <v-toolbar v-if="!practice" dense elevation="1" floating>
      <v-btn class="mr-2" small @click="togglePause">Pause</v-btn>
    </v-toolbar>
    <v-card-text>
      <v-container>
        <v-row>
          <v-col>
            <CollectorQuestion v-if="ready" :question="question" />
          </v-col>
        </v-row>
        <v-row>
          <v-col cols="8">
            <CollectorContext :ready="ready" />
          </v-col>
          <v-col cols="4">
            <v-row>
              <CollectorSelectedFactHint :contextFlattened="contextFlattened" />
            </v-row>
            <v-row>
              <CollectorAnswer @submit="onSubmit" @skip="onSkip" />
            </v-row>
          </v-col>
        </v-row>
      </v-container>
    </v-card-text>
  </v-card>
</template>

<script lang="ts">
import Vue from "vue";
import CollectorQuestion from "../components/CollectorQuestion.vue";
import CollectorContext from "../components/CollectorContext.vue";
import CollectorAnswer from "../components/CollectorAnswer.vue";
import CollectorSelectedFactHint from "../components/CollectorSelectedFactHint.vue";
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
    CollectorQuestion,
    CollectorContext,
    CollectorAnswer,
    CollectorSelectedFactHint,
  },
})
export default class Collector extends Vue {
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
  get ranked(): boolean {
    return this.state.interfaceName != "Basic";
  }
  get paused() {
    return this.state.isPaused;
  }
  get practice() {
    return !this.state.practiceDone;
  }

  ready = false;

  created() {
    if (this.state.instructionDone && !this.state.practiceDone) {
      this.indexedQuestion(this.state.practiceQuestions[0]);
    } else if (
      this.state.instructionDone &&
      this.state.practiceDone &&
      !this.state.basicDone
    ) {
      this.indexedQuestion(this.state.basicQuestions[0]);
    } else if (
      this.state.instructionDone &&
      this.state.practiceDone &&
      this.state.basicDone &&
      !this.state.rankedDone
    ) {
      this.indexedQuestion(this.state.rankedQuestions[0]);
    } else {
      this.$router.replace({ name: "consent" });
    }
  }

  time() {
    if (this.state.startTime != -1) {
      return Date.now() - this.state.startTime - this.state.pausedTime;
    } else {
      return -1;
    }
  }

  createSubmitData(dataTime: number, endRealTime: number) {
    return {
      user: this.state.user,
      interface: this.state.interfaceName,
      questionTotalTime: this.state.sessionTime,
      sessionStartRealTime: this.state.sessionStartTime,
      sessionEndRealTime: NaN,
      data: {
        idx: this.state.datum.idx,
        answer: this.state.answer,
        notes: this.state.note,
        supportingFacts: this.state.selectedFactsArray,
        operationRecord: this.state.operationRecords,
        time: dataTime,
        startRealTime: this.state.startTime,
        endRealTime: endRealTime,
      } as AnswerData,
    } as AnswerSubmit;
  }

  onSubmit() {
    if (!this.state.answer) {
      alert("You must type in the answer before submit.");
      return;
    }
    const endRealTime = Date.now();
    const dataTime = endRealTime - this.state.startTime - this.state.pausedTime;
    this.$store.dispatch("addSessionTime", { time: dataTime });
    const submitData = this.createSubmitData(dataTime, endRealTime);
    console.log(submitData);
    axios.post(process.env.VUE_APP_API_URL + "/answer", submitData).then(
      function (this: Collector, response: AxiosResponse) {
        if (response.data.success == "true") {
          this.nextQuestion();
        } else {
          alert(response.data);
        }
      }.bind(this)
    );
  }

  onSkip() {
    const endRealTime = Date.now();
    const dataTime = endRealTime - this.state.startTime - this.state.pausedTime;
    this.$store.dispatch("addSessionTime", { time: dataTime });
    const submitData = this.createSubmitData(dataTime, endRealTime);
    axios.post(process.env.VUE_APP_API_URL + "/answer", submitData).then(
      function (this: Collector, response: AxiosResponse) {
        if (response.data.success == "true") {
          this.nextQuestion();
        } else {
          alert(response.data);
        }
      }.bind(this)
    );
  }

  nextQuestion() {
    if (this.state.instructionDone && !this.state.practiceDone) {
      const pos = this.state.practiceQuestions.indexOf(this.datum.idx);
      if (pos == this.state.practiceQuestions.length - 1) {
        this.$store.commit("setPracticeDone", true);
        this.$router.replace({ name: "instruction" });
      } else {
        this.indexedQuestion(this.state.practiceQuestions[pos + 1]);
      }
    } else if (
      this.state.instructionDone &&
      this.state.practiceDone &&
      !this.state.basicDone
    ) {
      const pos = this.state.basicQuestions.indexOf(this.datum.idx);
      if (pos == this.state.basicQuestions.length - 1) {
        this.$store.commit("setBasicDone", true);
        this.$router.replace({ name: "instruction" });
      } else {
        this.indexedQuestion(this.state.basicQuestions[pos + 1]);
      }
    } else if (
      this.state.instructionDone &&
      this.state.practiceDone &&
      this.state.basicDone &&
      !this.state.rankedDone
    ) {
      const pos = this.state.rankedQuestions.indexOf(this.datum.idx);
      if (pos == this.state.rankedQuestions.length - 1) {
        this.$store.commit("setRankedDone", true);
        this.$router.replace({ name: "questionnaire" });
      } else {
        this.indexedQuestion(this.state.rankedQuestions[pos + 1]);
      }
    } else {
      this.$router.replace({ name: "consent" });
    }
  }

  indexedQuestion(idx: number) {
    this.ready = false;
    axios
      .get(process.env.VUE_APP_API_URL + "/question", {
        params: { idx: idx },
      })
      .then(
        function (this: Collector, response: AxiosResponse) {
          console.log(response.data);
          this.newQuestion(response.data);
        }.bind(this)
      );
  }

  newQuestion(datum: Datum) {
    if (!datum) {
      return;
    }
    this.$store.dispatch("newDatum", { datum }).then(() => {
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
          if (!this.ready) {
            this.ready = true;
            this.$store.commit("setStartTime", Date.now());
          }
        }.bind(this)
      );
  }

  togglePause() {
    this.$store.dispatch("togglePause");
  }
}
</script>