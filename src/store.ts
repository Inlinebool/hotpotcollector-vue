import Vue from "vue";
import Vuex from "vuex";
import CollectorModel, { NameReference } from "./CollectorModel";
import Datum, { FlattenedNumberedSentence, searchContext, AnswerSubmit, OperationRecord, Levels, ParagraphSimilarity } from "./Datum";

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    user: "anon",
    levels: { easy: true, medium: true, hard: true },
    datum: {} as Datum,
    answer: "", note: "",
    rankedParagraphs: [] as ParagraphSimilarity[],
    rankedSentences: [] as number[],
    paragraphReference: {} as NameReference,
    sentenceReference: {} as NameReference,
    selectedFacts: [] as number[],
    searchQuery: "",
    startTime: -1,
    pausedTime: -1,
    pauseStartTime: -1,
    pauseEndTime: -1,
    isPaused: false,
    operationRecords: [] as OperationRecord[]
  } as CollectorModel,

  getters: {
    hitStatus: state => {
      return searchContext(state.datum.context, state.searchQuery);
    },
    answerSubmitData: state => {
      return {
        user: state.user,
        levels: state.levels,
        data: {
          idx: state.datum.idx,
          answer: state.answer,
          notes: state.note,
          supportingFacts: state.selectedFacts,
          operationRecord: state.operationRecords
        }
      } as AnswerSubmit;
    }
  },

  mutations: {
    setUser(state, user: string) {
      state.user = user;
    },
    setLevels(state, levels: Levels) {
      state.levels = levels;
    },
    setDatum(state, datum: Datum) {
      state.datum = datum;
      state.selectedFacts.splice(0, state.selectedFacts.length);
      state.searchQuery = "";
      state.startTime = Date.now();
      state.pausedTime = 0;
      state.isPaused = false;
      state.operationRecords = [];
      let letterCode = "A".charCodeAt(0);
      for (const paragraph of state.datum.context) {
        state.paragraphReference[paragraph[0]] = String.fromCharCode(letterCode);
        for (let i = 0; i < paragraph[1].length; i++) {
          state.sentenceReference[String(paragraph[1][i][0])] = String.fromCharCode(letterCode) + '-' + String(i + 1);
        }
        letterCode++;
      }
    },
    updateRankedFacts(state, facts: FlattenedNumberedSentence[]) {
      state.datum["flattened_context"] = facts;
    },
    updateRankedFactNumbers(state, factNumbers: number[]) {
      state.rankedSentences = factNumbers;
    },
    updateRankedParagraphs(state, paragraphs: ParagraphSimilarity[]) {
      state.rankedParagraphs = paragraphs;
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
