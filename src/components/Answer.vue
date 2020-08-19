<template>
  <v-card class="ma-3">
    <v-card-text>
      <v-container>
        <v-row>
          <v-text-field label="Answer" v-model="answer" @input="onAnswerInput" outlined clearable></v-text-field>
        </v-row>
        <v-row>
          <v-textarea
            name="Note"
            label="Note"
            v-model="note"
            @input="onNoteInput"
            outlined
            clearable
          ></v-textarea>
        </v-row>
        <v-row>
          <v-col>
            <v-btn small @click="onSubmit">Submit and Next Question</v-btn>
          </v-col>
          <v-col>
            <v-btn small @click="onSkip">Skip and Next Question</v-btn>
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
export default class Answer extends Vue {
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

  onSubmit() {
    this.$emit("submit");
    this.clear();
  }

  onSkip() {
    this.$emit("skip");
    this.clear();
  }

  clear() {
    this.answer = "";
    this.note = "";
  }

  onAnswerInput(value: string) {
    const time = Date.now() - this.state.startTime - this.state.pausedTime;
    this.$store.dispatch("addAnswerTypeRecord", { value, time });
  }

  onNoteInput(value: string) {
    const time = Date.now() - this.state.startTime - this.state.pausedTime;
    this.$store.dispatch("addNoteTypeRecord", { value, time });
  }
}
</script>
