<template>
  <v-card class="ma-3">
    <v-card-text>
      <v-container>
        <v-row>
          <div class="text-h1" v-text="tooltip"></div>
        </v-row>
        <v-row>
          <div class="text-h5" v-text="question"></div>
        </v-row>
      </v-container>
      <p class="text-body-1" v-text="question"></p>
    </v-card-text>
  </v-card>
</template>

<script lang="ts">
import Vue from "vue";
import Component from "vue-class-component";
import { Prop } from "vue-property-decorator";

@Component
export default class Question extends Vue {
  name = "Question";

  tooltip =
    "For the following question, type in the correct answer based on the given paragraphs and click on the sentence that support your answer.";

  @Prop(String) readonly question: string | undefined;
}
</script>
