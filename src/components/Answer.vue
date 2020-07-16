<template>
  <v-card class="ma-3">
    <v-card-text>
      <v-container>
        <v-row></v-row>
        <v-row>
          <v-text-field label="Answer" outlined></v-text-field>
        </v-row>
        <v-row>
          <v-textarea name="Note" label="Note" outlined></v-textarea>
        </v-row>
        <v-row>
          <v-col>
            <v-btn small>Submit and Next Question</v-btn>
          </v-col>
          <v-col>
            <v-btn small>Skip and Next Question</v-btn>
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
export default class Answer extends Vue {
  name = "Answer";

  // @Prop(Array) readonly context: [] | undefined;

  // created() {
  //   console.log(this.context);
  // }
}
</script>
