import Vue from "vue";
import Vuex from "vuex";
import CollectorModel from "./CollectorModel";
import Datum, { FlattenedNumberedSentence, searchContext } from "./Datum";

Vue.use(Vuex);

export default new Vuex.Store({
  state: { datum: {} as Datum, answer: "", note: "", selectedFacts: [], searchQuery: "" } as CollectorModel,

  getters: {
    hitStatus: state => {
      return searchContext(state.datum.context, state.searchQuery);
    }
  },

  mutations: {
    setDatum(state, datum: Datum) {
      state.datum = datum;
      state.selectedFacts.splice(0, state.selectedFacts.length);
      state.searchQuery = "";
    },
    updateRankedFacts(state, facts: FlattenedNumberedSentence[]) {
      state.datum["flattened_context"] = facts;
    },
    setAnswer(state, answer: string) {
      state.answer = answer;
    },
    setNote(state, note: string) {
      state.note = note;
    },
    setSearchQuery(state, searchQuery: string) {
      state.searchQuery = searchQuery;
    },
    appendSelectedFact(state, factNumber: number) {
      if (!state.selectedFacts.includes(factNumber)) {
        state.selectedFacts.push(factNumber);
      }
    },
    removeSelectFact(state, factNumber: number) {
      const pos = state.selectedFacts.indexOf(factNumber);
      if (pos != -1) {
        state.selectedFacts.splice(pos, 1);
      }
    },
    toggleFactSelection(state, factNumber: number) {
      const pos = state.selectedFacts.indexOf(factNumber);
      if (pos != -1) {
        state.selectedFacts.splice(pos, 1);
      } else {
        state.selectedFacts.push(factNumber);
      }
    }
  },

  actions: {

  }
});
