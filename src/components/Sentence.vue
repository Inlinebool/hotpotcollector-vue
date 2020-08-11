<template>
  <v-hover v-slot:default="{ hover }">
    <v-container>
      <v-row>
        <v-btn
          v-if="sentence[2]"
          class="font-italic text-decoration-underline"
          @click="onClickTitle"
          text
          small
        >({{ sentence[2] }})</v-btn>
      </v-row>
      <v-row>
        <v-card
          :elevation="hover ? 2 : 0"
          class="mx-3"
          :class="{ 'on-hover': hover , 'grey lighten-3 font-weight-medium': selected, 'purple lighten-5': hit}"
          style="cursor:pointer;user-select:none"
          width="100%"
          v-if="enabled"
          @click.native="onClickFact"
        >
          <span class="mr-2">
            <span>
              <span>[ {{ sentence[0] }} ]</span>
              <span>{{ sentence[1] }}</span>
            </span>
            <v-expand-transition v-if="sentence[2]">
              <v-card v-show="expand" width="70%" class="mx-auto">
                <v-card-text>
                  <v-row v-for="sentence in paragraph[1]" :key="sentence[0]" class="my-2">
                    <Sentence :sentence="sentence" v-model="value" :enabled="true" />
                  </v-row>
                </v-card-text>
              </v-card>
            </v-expand-transition>
          </span>
        </v-card>
      </v-row>
    </v-container>
  </v-hover>
</template>

<script lang="ts">
import Vue from "vue";
import Component from "vue-class-component";
import { Prop } from "vue-property-decorator";
import {
  NumberedSentence,
  ParagraphHitStatus,
  Paragraph,
  FlattenedNumberedSentence,
} from "../Datum";

@Component
export default class Sentence extends Vue {
  name = "Sentence";

  @Prop(Array) readonly sentence!: NumberedSentence | FlattenedNumberedSentence;

  @Prop(Array) readonly context!: Paragraph[];

  @Prop(Array)
  value!: number[];

  @Prop(Object) readonly hitStatus!: ParagraphHitStatus;

  @Prop(Boolean) readonly enabled!: boolean;

  expand = false;

  get paragraph() {
    let index = -1;
    const sentence = this.sentence as FlattenedNumberedSentence;
    if (sentence[2] && this.context) {
      for (let i = 0; i < this.context.length; i++) {
        if (this.context[i][0] == sentence[2]) {
          index = i;
        }
      }
    }
    if (index != -1) {
      return this.context[index];
    } else {
      return [];
    }
  }

  get selected() {
    if (this.value.includes(this.sentence[0])) {
      return true;
    } else {
      return false;
    }
  }

  get hit() {
    if (!this.hitStatus) {
      return false;
    }
    if (this.hitStatus.hitSentences.includes(this.sentence[0])) {
      return true;
    } else {
      return false;
    }
  }

  onClickFact() {
    if (!this.value.includes(this.sentence[0])) {
      this.value.push(this.sentence[0]);
    } else {
      const pos = this.value.indexOf(this.sentence[0]);
      this.value.splice(pos, 1);
    }
    this.$emit("input", this.value);
  }

  onClickTitle() {
    this.expand = !this.expand;
    console.log(this.paragraph);
  }
}
</script>

<style scoped>
</style>