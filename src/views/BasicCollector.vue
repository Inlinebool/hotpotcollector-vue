<template>
  <v-card class="ma-3">
    <v-card-text>
      <v-container>
        <v-row>
          <v-col cols="8">
            <Question :question="question" />
          </v-col>
          <v-col cols="4">
            <QuestionSelect />
          </v-col>
        </v-row>
        <v-row>
          <v-col cols="8">
            <Context :context="context" />
          </v-col>
          <v-col cols="4">
            <Answer />
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
import QuestionSelect from "../components/QuestionSelect.vue";
import Component from "vue-class-component";
import axios, { AxiosResponse } from "axios";
import Datum, { Paragraph } from "../Datum";

@Component({
  components: {
    Question,
    Context,
    Answer,
    QuestionSelect
  }
})
export default class BasicCollector extends Vue {
  name = BasicCollector;
  datum = {} as Datum;
  created() {
    axios.get(process.env.VUE_APP_API_URL + "/question", {}).then(
      function(this: BasicCollector, response: AxiosResponse) {
        this.datum = response.data.data;
        console.log(this.datum);
      }.bind(this)
    );
  }
  get question() {
    return this.datum["question"];
  }
  get context() {
    return this.datum["numbered_context"];
  }
}
</script>