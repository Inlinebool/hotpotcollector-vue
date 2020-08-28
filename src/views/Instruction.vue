<template>
  <v-card class="ma-auto" :max-width="pageWidth">
    <v-card-title>Instructions</v-card-title>
    <v-card-subtitle class="text-h6">{{ subtitle }}</v-card-subtitle>
    <v-card-text class="text-body-1">
      <div v-if="page == 1">
        <p>
          Here we provide you with instructions for the study you are about to take that uses visualization to help improve
          <span
            class="strong-1"
          >Question Answering (QA)</span> systems.
        </p>
        <p>
          In this study you will be presented with a visual interface for QA. You will be given a
          <span
            class="strong-1"
          >question</span> and a
          <span class="strong-1">set of facts</span> extracted from 10 Wikipedia articles.
        </p>
        <p>
          Your task is to
          <span class="strong-1">answer the question</span> based on the facts
          <span class="strong-2">{{ "and " }}</span>
          <span class="strong-1">identify the facts</span> that are used to explain why the answer is correct.
        </p>
        <p>
          Each question will need
          <span class="strong-1">at least 1</span> fact to show that the answer is correct. Most questions need 2, sometimes more facts.
        </p>
        <p>In this tutorial we will introduce you to the entire procedure with a sample interface. The actual interface you will see in the study will be organized differently, but the task will be the same.</p>
        <p>Please do this study on a desktop machine or a laptop with a modern web browser, for example Google Chrome.</p>
      </div>
      <div v-if="page == 2">
        <p>Here is an overview of the interface. At the top is the question, and the facts are listed below grouped by topic.</p>
        <p>Each topic is tagged with a capital letter, and each fact is tagged by their topic as well as its number within the topic.</p>
        <p>
          In the facts, all words that apear in the question will have a
          <span class="question">blue</span> background.
        </p>
        <v-divider class="my-5"></v-divider>
        <v-img src="../img/overview_A_1.png" contain max-width="100%"></v-img>
      </div>
      <div v-if="page == 3">
        Each group can be collapsed or expanded. You can also use the buttons on the right of the toolbar to expand/collapse all groups.
        <v-divider class="my-5"></v-divider>
        <v-img src="../img/overview_A_collapsed.png" contain max-width="100%"></v-img>
      </div>
      <div v-if="page == 4">
        <p>
          You can use the search bar to search for a key phrase, and facts that contain the key phrase will be
          <span
            class="search"
          >highlighted</span>. Groups that do not contain the key phrase will be automatically collapsed.
        </p>
        <p>Here we search for “Laura Slade” because the question “What movie was Laura Slade Wiggins in that was the third film in a series” is asking for movies that she was in.</p>
        <v-divider class="my-5"></v-divider>
        <v-img src="../img/search_A_1.png" contain max-width="100%"></v-img>
      </div>
      <div v-if="page == 5">
        <p>
          After reading
          <span class="strong-1">Fact D-2</span>, we know that the answer must be one of “Shameless”, “The Tomorrow People”, “Starving in Suburbia” and “Rings”. Now we need to know which of them was the third film in a series.
        </p>
        <p>
          Since Fact D-2 is useful for answering the question, we select it by
          <span
            class="strong-1"
          >clicking</span> on the sentence. The
          <span class="selected">color of the fact</span> will change and it will show up in the
          <span class="strong-1">Selected Facts</span> area on the right. In all other facts, words that appear in the selected facts will also have the same
          <span
            class="selected"
          >background color</span>.
        </p>
        <v-divider class="my-5"></v-divider>
        <v-img src="../img/select_A_1.png" contain max-width="100%"></v-img>
      </div>
      <div v-if="page == 6">
        <p>
          We can next search for the titles and find information about the works. When we search for Rings, we notice that
          <span
            class="strong-1"
          >Fact G-2</span> states that “Rings” is the third film in “The Ring” series. That's our answer!
        </p>
        <p>
          Now we
          <span class="strong-1">click</span> on Fact G-2 to select it, and we
          <span class="strong-1">type</span> the answer “Rings” in the answer box.
        </p>
        <p>
          As you type in the answer, you'll notice that your answer is also
          <span
            class="answer"
          >highlighted</span> within the facts. In fact, for most questions, the answer is either a
          <span
            class="strong-1"
          >yes or no</span>, or a span from the facts that you use to answer the question, that is,
          <span
            class="strong-1"
          >a span from the facts that you select</span>.
        </p>
        <p>
          Finally, after selecting all the supporting facts and typing in the answer, we click
          <span
            class="strong-1"
          >SUBMIT AND NEXT QUESTION</span> to submit the answer/supporting facts and go to the next question.
        </p>
        <p>
          If you would like to skip this question, you could click on the <span class="strong-1">SKIP AND NEXT QUESTION</span> to skip to the next question.
        </p>
        <v-divider class="my-5"></v-divider>
        <v-img src="../img/Answer_A.png" contain max-width="100%"></v-img>
      </div>
      <div v-if="page == 7">
        <p>Next, try to answer 10 questions on your own. Try to make use of the tools we provided and complete the task as soon and as accurately as possible. We will time your process and record your operations (search, scroll, click, type, etc.) with the interface.</p>
      </div>
      <div v-if="page == 8">
        <p>Now try 10 more questions with a different interface.</p>
        <p>
          In this interface, the facts are no longer grouped by their topic. Rather, they are
          <span
            class="strong-1"
          >ordered by their similarity to the question as well as the already selected supporting facts</span>. At the start when there is no selected fact, the facts are simply ordered by their similarity to the question.
        </p>
        <p>
          Whenever you click on a fact and select it as supporting fact, all the facts will be re-ordered by their similarity to the question
          <span
            class="strong-2"
          >and</span> all the facts you have selected, so you'll see facts moving around when you click.
        </p>
        <p>The topic is shown at the end of each fact, and when you click on the topic all the facts within that topic will show up.</p>
        <p>There is also a topic selection panel where you can toggle visibility of facts within certain topics.</p>
        <p>Search bar is also available. Fact selection and answer input are the same as before.</p>
        <v-divider class="my-5"></v-divider>
        <v-img src="../img/context_B.png" contain max-width="100%"></v-img>
      </div>
      <div v-if="page == 9">
        <p>Now try 10 more questions with a different interface.</p>
        <p>
          In this interface, the facts are no longer grouped by their topic. Rather, they are
          <span
            class="strong-1"
          >ordered by their similarity to the question as well as the already selected supporting facts</span>. At the start when there is no selected fact, the facts are simply ordered by their similarity to the question.
        </p>
        <p>
          Whenever you click on a fact and select it as supporting fact, all the facts will be re-ordered by their similarity to the question
          <span
            class="strong-2"
          >and</span> all the facts you have selected, so you'll see facts moving around when you click.
        </p>
        <p>Search bar is also available. Fact selection and answer input are the same as before.</p>
        <v-divider class="my-5"></v-divider>
        <v-img src="../img/overview_B.png" contain max-width="100%"></v-img>
      </div>
    </v-card-text>
    <v-card-actions>
      <v-btn v-if="page > 1" @click="previousPage">Previous Page</v-btn>
      <v-spacer></v-spacer>
      <v-btn v-if="page < 7" @click="nextPage">Next Page</v-btn>
      <v-btn v-if="page == 7" to="/userselect">Start</v-btn>
      <v-btn v-if="page > 7" to="/collector">Start</v-btn>
    </v-card-actions>
  </v-card>
</template>

<script lang="ts">
import Vue from "vue";
import Component from "vue-class-component";
import { Prop } from "vue-property-decorator";
import CollectorModel from "@/CollectorModel";

@Component
export default class Instruction extends Vue {
  @Prop(String) readonly pageParam: string | undefined;

  get state() {
    return this.$store.state as CollectorModel;
  }

  get page() {
    if (!this.pageParam) {
      this.$router.push({
        name: "instruction",
        params: { pageParam: "1" },
      });
      return -1;
    } else {
      if (this.pageParam == "ranked") {
        switch (this.state.interfaceName) {
          case "Ranked with Context":
            return 8;
          case "Ranked without Context":
            return 9;
          default:
            alert("interface should have been selected");
            return -1;
        }
      } else {
        const page = parseInt(String(this.pageParam));
        if (!page || page < 0 || page > 7) {
          this.$router.push({
            name: "instruction",
            params: { pageParam: "1" },
          });
        }
        return page;
      }
    }
  }

  nextPage() {
    this.$router.push({
      name: "instruction",
      params: { pageParam: (this.page + 1).toString() },
    });
  }

  previousPage() {
    this.$router.push({
      name: "instruction",
      params: { pageParam: (this.page - 1).toString() },
    });
  }

  get pageWidth() {
    switch (this.page) {
      case 1:
        return 600;
      case 2:
      case 3:
      case 4:
      case 5:
      case 6:
        return 1200;
      case 7:
        return 600;
      case 8:
        return 1200;
      case 9:
        return 1200;
      default:
        return 1200;
    }
  }

  get subtitle() {
    switch (this.page) {
      case 1:
        return "Welcome!";
      case 2:
        return "Overview";
      case 3:
        return "Fact Grouping";
      case 4:
      case 5:
        return "Fact Searching";
      case 6:
        return "Fact Searching and Answer Input";
      default:
        return "";
    }
  }
}
</script>

<style>
.strong-1 {
  font-weight: bold;
  text-decoration: underline;
}
.strong-2 {
  font-style: italic;
}
.question {
  background-color: #bbdefb;
}
.search {
  font-style: italic;
  font-weight: bold;
  color: #d81b60;
}
.selected {
  background-color: #f3e5f5;
}
.answer {
  /* font-weight: 700; */
  /* font-style: italic; */
  text-decoration: underline;
  color: #ffa726;
}
</style>