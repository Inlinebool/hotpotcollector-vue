<script lang="ts">
import Component from "vue-class-component";
import BasicCollector from "./BasicCollector.vue";
import RankedContext from "../components/RankedContext.vue";
import axios, { AxiosResponse } from "axios";
import Datum, { RankFactsResponse } from "@/Datum";
import { Watch } from "vue-property-decorator";

@Component({
  components: {
    RankedContext,
  },
})
export default class RankedCollector extends BasicCollector {
  name = "RankedCollector";
  contextComponent = "RankedContext";

  newQuestion(datum: Datum, save: boolean) {
    if (this.datum.idx && this.datum.idx != -1 && save) {
      this.previousIndices.push(this.datum.idx);
    }
    this.$store.commit("setDatum", datum);
    this.gotoIdx = datum.idx;
    this.getRankedContext();
  }

  @Watch("selectedFacts")
  updateRankedContext() {
    this.getRankedContext();
  }

  getRankedContext() {
    axios
      .get(process.env.VUE_APP_API_URL + "/rank", {
        params: { idx: this.datum.idx, chosenFacts: this.selectedFacts },
      })
      .then(
        function (this: BasicCollector, response: AxiosResponse) {
          const rankResponse = response.data as RankFactsResponse;
          this.$store.commit("updateRankedFacts", rankResponse.ranked_facts);
        }.bind(this)
      );
  }
}
</script>