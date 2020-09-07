<template>
  <v-card class="ma-auto" max-width="800">
    <v-card-title>Welcome!</v-card-title>
    <v-card-text class="text-body-1">
      <div>
        <p>
          <span class="strong-1">You are being asked to participate in a research study</span>. The purpose of this study is to determine effective visualization techniques for interfacing with
          <span
            class="strong-1"
          >Question Answering (QA)</span> systems. Please consider the following information carefully and check the consent box before continuing.
        </p>
        <p class="text-h6 mt-5">Disclosures:</p>
        <ul>
          <li>You have to be at least 18 years old to participate in this study.</li>
          <li>
            This study will take about
            <span class="strong-1">30 minutes</span> to complete.
          </li>
          <li>You can stop participation at any time and for any reason by simply closing this window or navigating to another site. If you choose to end participation before submitting the survey, none of your responses will be recorded.</li>
          <li>Pressing the "Back" button during the session will restart the study.</li>
          <li>
            We recommand running this study on a desktop machine or a laptop with
            <span
              class="strong-1"
            >Google Chrome</span>.
          </li>
          <li>There are no expected risks to you as a result of participating in this study beyond those experienced in everyday life.</li>
          <li>You will not benefit directly from participating in this study. This study does not offer compensation to participants.</li>
        </ul>
        <p class="text-h6 mt-5">About the Study:</p>
        <ul>
          <li>
            You will be presented with a visual interface for QA. You will be given a
            <span
              class="strong-1"
            >question</span> and a
            <span class="strong-1">set of facts</span> extracted from 10 Wikipedia articles. Your task is to
            <span
              class="strong-1"
            >answer the question</span> based on the facts
            <span class="strong-2">{{ "and " }}</span>
            <span class="strong-1">identify the facts</span> that are used to explain why the answer is correct.
          </li>
          <li>You will first be shown instructions for the study. The instructions will provide a description of the dataset that you will interact with, a description of the visualization tools that you will use, and information on the workflow for completing the task. The instructions will end with a set of demonstrative tasks that you will need to complete, in order to provide initial hands-on experience with using the visual interface.</li>
          <li>After the instructions, you will then be provided with a different visual interface. The task remains the same, and you will need to complete another set of tasks using the new interface. We will time your process and record your operations (search, scroll, click, type, etc.) with the interface. Try to make use of the tools we provided with the interfaces and complete the tasks as quickly and as accurately as possible.</li>
          <li>Last, you will be asked to answer a few questions regarding the interfaces you have just used, in order for us to obtain your general thoughts on the study, and assess the difficulty of the study and your overall experience in using the particular visual interface.</li>
          <li>The data resulting from your participation, namely your answers and interactions with both interfaces, will be stored for future research.</li>
        </ul>
        <p class="text-h6 mt-5">Contact:</p>
        <ul>
          <li>
            For questions, concerns, or complaints about the study you may contact Joshua Levine at
            <a
              href="josh@email.arizona.edu"
            >josh@email.arizona.edu</a>.
            For questions about your rights as a participant in this study or to discuss other study-related concerns or complaints with someone who is not part of the research team, you may contact the Human Subjects Protection Program at 520-626-6721 or online at
            <a
              href="http://rgw.arizona.edu/compliance/human-subjects-protection-program"
            >http://rgw.arizona.edu/compliance/human-subjects-protection-program</a>.
          </li>
        </ul>
      </div>
    </v-card-text>
    <v-card-actions>
      <v-checkbox color="red darken-3" v-model="consent">
        <template v-slot:label>
          <span
            class="red--text darken-3 font-weight-bold"
          >I have read the above information and consent to volunteer in this study.</span>
        </template>
      </v-checkbox>
      <v-spacer />
      <v-btn :disabled="!consent" @click="nextPage">Next</v-btn>
    </v-card-actions>
  </v-card>
</template>

<script lang="ts">
import Vue from "vue";
import Component from "vue-class-component";
import { Prop } from "vue-property-decorator";
import CollectorModel from "@/CollectorModel";
import axios, { AxiosResponse } from "axios";
import { NewUserResponse } from "@/Datum";

@Component
export default class Consent extends Vue {
  get state() {
    return this.$store.state as CollectorModel;
  }

  get consent() {
    return this.state.consent as boolean;
  }

  set consent(value) {
    this.$store.commit("setConsent", value);
  }

  created() {
    this.$store.commit("setConsent", false);
    this.$store.commit("setInstructionDone", false);
    this.$store.commit("setPracticeDone", false);
    this.$store.commit("setBasicDone", false);
    this.$store.commit("setRankedDone", false);
  }

  nextPage() {
    axios.get(process.env.VUE_APP_API_URL + "/newuser").then(
      function (this: Consent, response: AxiosResponse) {
        if (response.data.success != "true") {
          alert(response.data);
          return;
        }
        const newUserResponse = response.data.data as NewUserResponse;
        this.$store.commit("setUser", newUserResponse.user);
        this.$store.commit("setContexted", newUserResponse.contexted);
        this.$store.commit(
          "setPracticeQuestions",
          newUserResponse.practice_questions
        );
        this.$store.commit(
          "setBasicQuestions",
          newUserResponse.basic_questions
        );
        this.$store.commit(
          "setRankedQuestions",
          newUserResponse.ranked_questions
        );
        this.$router.push({ name: "instruction" });
      }.bind(this)
    );
  }
}
</script>

<style>
.strong-1 {
  font-weight: bold;
  /* text-decoration: underline; */
}
.strong-2 {
  font-style: italic;
}
</style>