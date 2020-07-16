<template>
  <span class="mr-2">
    <span> [ {{ sentence[0] }} ] </span>
    <span>{{ sentence[1] }}</span>
  </span>
</template>

<script lang="ts">
import Vue from "vue";
import Component from "vue-class-component";
import { Prop } from "vue-property-decorator";
import { NumberedSentence } from "../Datum";

@Component
export default class ParagraphPanel extends Vue {
  name = "ParagraphPanel";

  @Prop(NumberedSentence) readonly sentence: NumberedSentence | undefined;
}
</script>
