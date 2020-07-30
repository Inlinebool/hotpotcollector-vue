<template>
  <v-card class="ma-3">
    <v-card-text>
      <v-container>
        <v-row>
          <v-text-field label="Answer" v-model="answer" outlined clearable></v-text-field>
        </v-row>
        <v-row>
          <v-textarea name="Note" label="Note" v-model="note" outlined clearable></v-textarea>
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

@Component
export default class Answer extends Vue {
  name = "Answer";

  answer = "";

  note = "";

  onSubmit() {
    this.$emit("submit", this.answer, this.note);
    this.clear();
  }

  onSkip() {
    this.$emit("skip", this.note);
    this.clear();
  }

  clear() {
    this.answer = "";
    this.note = "";
  }
}
</script>
