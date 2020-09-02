<template>
  <v-card class="ma-3">
    <v-card-text>
      <v-container>
        <v-row class="grey lighten-4 mb-2">
          <p>Hint:</p>
          <p>In many cases, the answer can either be a yes or no, or a span from the facts that can be used to answer the question, i.e., the facts you have selected.</p>
        </v-row>
        <v-form v-model="answerValid" ref="answerForm">
          <v-row>
            <v-text-field
              label="Answer"
              v-model="answer"
              @input="onAnswerInput"
              outlined
              clearable
              :rules="answerRule"
              required
            ></v-text-field>
          </v-row>
        </v-form>
        <v-row class="ml-0 text-caption">
          <p
            v-if="!valid"
            class="red--text"
          >You must select at least one fact that you use to answer the question.</p>
        </v-row>
        <v-row>
          <v-col>
            <v-btn
              small
              @click="onSubmit"
              :disabled="!valid || !answerValid"
            >Submit and Next Question</v-btn>
          </v-col>
          <v-col>
            <v-dialog
              v-model="dialog"
              width="500"
              persistent
              overlay-opacity="1"
              overlay-color="black"
            >
              <template v-slot:activator="{ on, attrs }">
                <v-btn small v-on="on" v-bind="attrs" @click="onSkip">Skip and Next Question</v-btn>
              </template>
              <v-card>
                <v-card-title>Please tell us why you skipped this question:</v-card-title>
                <v-card-text>
                  <v-textarea
                    name="Note"
                    placeholder="e.g. question unclear, couldn't find answer, etc."
                    v-model="note"
                    outlined
                    clearable
                  ></v-textarea>
                </v-card-text>
                <v-card-actions>
                  <v-btn small @click="onSkipAbort">Return to Question</v-btn>
                  <v-spacer></v-spacer>
                  <v-btn small @click="onSkipSubmit">Submit</v-btn>
                </v-card-actions>
              </v-card>
            </v-dialog>
          </v-col>
          <v-col>
            <v-btn small v-if="false" @click="onBackToInstructions">Back to Instructions</v-btn>
          </v-col>
        </v-row>
      </v-container>
    </v-card-text>
  </v-card>
</template>

<script lang="ts">
import Vue from "vue";
import Component from "vue-class-component";
import CollectorModel from "@/CollectorModel";

@Component
export default class CollectorAnswer extends Vue {
  dialog = false;
  answerValid = false;
  answerRule = [(v: string) => !!v || "Answer cannot be empty."];

  get valid() {
    return this.state.selectedFactsArray.length > 0;
  }

  get state() {
    return this.$store.state as CollectorModel;
  }

  get answer() {
    return this.state.answer as string;
  }

  set answer(value) {
    this.$store.commit("setAnswer", value);
  }

  get note() {
    return this.state.note as string;
  }

  set note(value) {
    this.$store.commit("setNote", value);
  }

  get practice() {
    return !this.state.practiceDone;
  }

  onSubmit() {
    this.$emit("submit");
    this.clear();
  }

  onBackToInstructions() {
    this.$store.commit("setInstructionDone", false);
    this.$router.replace({ name: "instruction" });
  }

  onSkip() {
    const time = Date.now() - this.state.startTime - this.state.pausedTime;
    this.$store.dispatch("addSkipClickedRecord", { time });
    this.$store.dispatch("togglePause");
  }

  onSkipAbort() {
    this.$store.dispatch("togglePause");
    this.dialog = false;
  }

  onSkipSubmit() {
    this.$store.dispatch("togglePause");
    this.dialog = false;
    this.$emit("skip");
    this.clear();
  }

  clear() {
    const answerForm = this.$refs.answerForm as any;
    answerForm.reset();
  }

  onAnswerInput(value: string) {
    const time = Date.now() - this.state.startTime - this.state.pausedTime;
    this.$store.dispatch("addAnswerTypeRecord", { typedAnswer: value, time });
  }
}
</script>
