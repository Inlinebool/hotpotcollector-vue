<template>
  <v-card class="ma-auto" max-width="1200">
    <v-card-title>Questionnaire</v-card-title>
    <v-card-text class="text-body-1">
      <div>
        <p>Thank you for participating in this study!</p>
        <p>Final step, please answer the following questions based on your experience. This is very important because it let us know your general thoughts on the study as well as your overall experience in using the interfaces, and allows us to assess the difficulty of the study.</p>
        <p>* marks that the question is required. You need to answer all required questions before clicking SUBMIT.</p>
      </div>
      <v-divider />
      <div class="my-10">
        <div v-for="(question, index) in questions" :key="question" class="mb-10">
          <p class="black--text">
            {{(index + 1) + ") " + question}}
            <span v-if="questionRequired[index]">*</span>
          </p>
          <v-form v-if="questionType[index] == 'A/B'" v-model="valid[index]">
            <v-radio-group row v-model="result[index]" class="mx-auto" :rules="radioRules" required>
              <v-radio label="The first interface (grouped by topics)" value="A"></v-radio>
              <v-spacer />
              <v-radio label="The second interface (ranked individual sentences)" value="B"></v-radio>
            </v-radio-group>
          </v-form>
          <v-form v-if="questionType[index] == 'scale'" v-model="valid[index]">
            <v-radio-group row v-model="result[index]" class="mx-auto" :rules="radioRules" required>
              <v-radio label="Not At All Confident" value="0"></v-radio>
              <v-spacer />
              <v-radio label="Only Slightly Confident" value="1"></v-radio>
              <v-spacer />
              <v-radio label="Somewhat Confident" value="2"></v-radio>
              <v-spacer />
              <v-radio label="Moderately Confident" value="3"></v-radio>
              <v-spacer />
              <v-radio label="Very Confident" value="4"></v-radio>
            </v-radio-group>
          </v-form>
          <v-form v-if="questionType[index] == 'expert'" v-model="valid[index]">
            <v-radio-group row v-model="result[index]" class="mx-auto" :rules="radioRules" required>
              <v-radio label="Never Heard Of" value="0"></v-radio>
              <v-spacer />
              <v-radio label="Novice" value="1"></v-radio>
              <v-spacer />
              <v-radio label="Intermediate" value="2"></v-radio>
              <v-spacer />
              <v-radio label="Advanced" value="3"></v-radio>
              <v-spacer />
              <v-radio label="Expert" value="4"></v-radio>
            </v-radio-group>
          </v-form>
          <v-form v-if="questionType[index] == 'free'" v-model="valid[index]">
            <v-textarea
              auto-grow
              outlined
              counter
              v-model="result[index]"
              :rules="questionRequired[index]? textRulesRequired : textRules"
              clearable
              :required="questionRequired[index]"
            ></v-textarea>
          </v-form>
          <v-divider class="mt-3" />
        </div>
      </div>
    </v-card-text>
    <v-card-actions>
      <v-spacer />
      <v-btn @click.stop="submit" :disabled="!allValid">Submit</v-btn>
      <v-dialog v-model="dialog" width="500" persistent>
        <v-card>
          <v-card-title>Thank you for taking this study!</v-card-title>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn text @click="backToConsent">DONE</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </v-card-actions>
  </v-card>
</template>

<script lang="ts">
import Vue from "vue";
import Component from "vue-class-component";
import { Prop } from "vue-property-decorator";
import CollectorModel from "@/CollectorModel";
import axios, { AxiosResponse } from "axios";
import {
  NewUserResponse,
  AnswerData,
  AnswerSubmit,
  QuestionnaireData,
} from "@/Datum";

@Component
export default class Questionnaire extends Vue {
  questions = [
    "How would you describe your level of expertise in the field of natrual language processing?",
    "How would you describe your level of expertise in the field of data visualization?",
    "Which interface did you find easier to interact with and use?",
    "Of the interfaces you used, which did you think allowed you to most accurately answer questions?",
    "Of the interfaces you used, which did you think allowed you to answer the most questions?",
    "Which interface made it most easy to identify supporting facts?",
    "In the first interface (grouped by topic), how confident were you in providing supporting facts?",
    "In the second interface (ranked individual sentences), how confident were you in providing supporting facts?",
    "Which interface made it most easy to identify answers?",
    "In the first interface (grouped by topic), how confident were you in providing answer?",
    "In the second interface (ranked individual sentences), how confident were you in providing answer?",
    "For the first interface (grouped by topic), what characteristics of the interface did you find to be most useful?",
    "For the second interface (ranked individual sentences), what characteristics of the interface did you find to be most useful?",
    "For the first interface (grouped by topic), what characteristics of the interface did you find to be least useful? ",
    "For the second interface (ranked individual sentences), what characteristics of the interface did you find to be least useful?",
    "Use this box to leave any additional comments about the experiment.",
  ];
  questionType = {
    0: "expert",
    1: "expert",
    2: "A/B",
    3: "A/B",
    4: "A/B",
    5: "A/B",
    6: "scale",
    7: "scale",
    8: "A/B",
    9: "scale",
    10: "scale",
    11: "free",
    12: "free",
    13: "free",
    14: "free",
    15: "free",
  };
  questionRequired = {
    0: true,
    1: true,
    2: true,
    3: true,
    4: true,
    5: true,
    6: true,
    7: true,
    8: true,
    9: true,
    10: false,
    11: false,
    12: false,
    13: false,
    14: false,
    15: false,
  };
  radioRules = [(v: string) => !!v || "This question is required."];
  textRules = [
    (v: string) => !v || (v && v.length <= 5000) || "Max 5000 characters",
  ];
  textRulesRequired = [
    (v: string) => !!v || "This question is required.",
    (v: string) => (v && v.length <= 5000) || "Max 5000 characters",
  ];
  result = [] as string[];
  valid = [] as boolean[];
  dialog = false;
  get allValid() {
    let valid = true;
    for (let i = 0; i < this.questions.length; i++) {
      if (!this.valid[i]) {
        valid = false;
        break;
      }
    }
    return valid;
  }
  get state() {
    return this.$store.state as CollectorModel;
  }
  created() {
    if (
      this.state.instructionDone &&
      this.state.practiceDone &&
      this.state.basicDone &&
      this.state.rankedDone
    ) {
      this.$store.commit("setStartTime", Date.now());
      this.$store.commit("setPausedTime", 0);
      this.$store.commit("setPaused", false);
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
  submit() {
    const time = this.time();
    this.$store.dispatch("addSessionTime", { time });
    const submitData = {
      user: this.state.user,
      interface: this.state.interfaceName,
      totalTime: this.state.sessionTime,
      data: {
        contexted: this.state.contexted,
        result: this.result,
      } as QuestionnaireData,
    } as AnswerSubmit;

    axios.post(process.env.VUE_APP_API_URL + "/answer", submitData).then(
      function (this: Questionnaire, response: AxiosResponse) {
        if (response.data.success == "true") {
          this.dialog = true;
          // this.$router.replace({ name: "consent" });
        }
      }.bind(this)
    );
  }
  backToConsent() {
    this.$router.replace({ name: "consent" });
  }
}
</script>
