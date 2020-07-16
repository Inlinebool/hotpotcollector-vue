<template>
  <v-card class="ma-3">
    <v-card-text>
      <v-container>
        <v-row>
          <v-text-field label="Question Index: " />
        </v-row>
        <v-row>
          <v-col>
            <v-btn small>Go To</v-btn>
          </v-col>
          <v-col>
            <v-btn small>Next</v-btn>
          </v-col>
          <v-col>
            <v-btn small>Random</v-btn>
          </v-col>
        </v-row>
      </v-container>
    </v-card-text>
  </v-card>
</template>

<script lang="ts">
import Vue from "vue";
import Component from "vue-class-component";
import { Prop } from "vue-property-decorator";

@Component
export default class QuestionSelect extends Vue {
  name = "QuestionSelect";

  // @Prop(Array) readonly context: [] | undefined;

  // created() {
  //   console.log(this.context);
  // }
}
</script>
