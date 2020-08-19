import Vue from "vue";
import Vuex from "vuex";
import CollectorModel, { NameReference } from "./CollectorModel";
import Datum, { FlattenedNumberedSentence, searchContext, AnswerSubmit, OperationRecord, Levels, ParagraphSimilarity, HitStatus } from "./Datum";

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
    selectedFacts: new Set(),
    selectedFactsArray: [] as number[],
    searchQuery: "",
    startTime: -1,
    pausedTime: -1,
    pauseStartTime: -1,
    pauseEndTime: -1,
    isPaused: false,
    operationRecords: [] as OperationRecord[],
    interfaceName: "Basic"
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
          supportingFacts: state.selectedFactsArray,
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
    setStartTime(state, time: number) {
      state.startTime = time;
    },
    setPausedTime(state, time: number) {
      state.pauseEndTime = time;
    },
    setPaused(state, isPaused: boolean) {
      state.isPaused = isPaused;
    },
    setParagraphReference(state, reference: NameReference) {
      for (const oldReference in state.paragraphReference) {
        delete state.paragraphReference[oldReference];
      }
      Object.assign(state.paragraphReference, reference);
    },
    setSentenceReference(state, reference: NameReference) {
      for (const oldReference in state.sentenceReference) {
        delete state.sentenceReference[oldReference];
      }
      Object.assign(state.sentenceReference, reference);
    },
    addSelectedFact(state, factNumber: number) {
      state.selectedFacts.add(factNumber);
      state.selectedFactsArray = Array.from(state.selectedFacts);
    },
    removeSelectedFact(state, factNumber: number) {
      state.selectedFacts.delete(factNumber);
      state.selectedFactsArray = Array.from(state.selectedFacts);
    },
    clearSelectedFacts(state) {
      state.selectedFacts.clear();
      state.selectedFactsArray = Array.from(state.selectedFacts);
    },
    appendOperationRecord(state, record: OperationRecord) {
      state.operationRecords.push(record);
    },
    clearOperationRecords(state) {
      state.operationRecords.splice(0, state.operationRecords.length);
    },
    setInterface(state, interfaceName: string) {
      state.interfaceName = interfaceName;
    }
  },

  actions: {
    addSearchRecord(context, time: number) {
      const searchQuery = context.state.searchQuery;
      const hitStatus = context.getters.hitStatus as HitStatus;
      const originalSentences = context.state.datum.flattened_context;
      const hitSentences = [];
      if (hitStatus.highlightedSentences.length) {
        for (let i = 1; i <= originalSentences.length; i++) {
          if (originalSentences[i - 1][1] != hitStatus.highlightedSentences[i]) {
            hitSentences.push(i);
          }
        }
      }
      context.commit("appendOperationRecord", {
        name: "search",
        data: {
          query: searchQuery,
          hitParagraphs: hitStatus.hitParagraphs,
          hitSentences: hitSentences
        },
        time: time
      } as OperationRecord);
    },
    onFactClicked(context, { factNumber, time }) {
      if (context.state.selectedFacts.has(factNumber)) {
        context.commit("removeSelectedFact", factNumber);
      } else {
        context.commit("addSelectedFact", factNumber);
      }
      context.commit("appendOperationRecord", {
        name: "select",
        data: Array.from(context.state.selectedFacts),
        time: time
      });
    },
    newDatum(context, datum: Datum) {
      context.commit("setDatum", datum);
      context.commit("clearSelectedFacts");
      context.commit("setSearchQuery", "");
      context.commit("setStartTime", Date.now());
      context.commit("setPausedTime", 0);
      context.commit("setPaused", false);
      context.commit("clearOperationRecords");
      const paragraphReference = {} as NameReference;
      const sentenceReference = {} as NameReference;
      let letterCode = "A".charCodeAt(0);
      for (const paragraph of datum.context) {
        paragraphReference[paragraph[0]] = String.fromCharCode(letterCode);
        for (let i = 0; i < paragraph[1].length; i++) {
          sentenceReference[String(paragraph[1][i][0])] = String.fromCharCode(letterCode) + '-' + String(i + 1);
        }
        letterCode++;
      }
      context.commit("setParagraphReference", paragraphReference);
      context.commit("setSentenceReference", sentenceReference);
    },
    addAnswerTypeRecord(context, { typedAnswer, time }) {
      context.commit("appendOperationRecord", {
        name: "answer",
        data: typedAnswer,
        time: time
      } as OperationRecord);
    },
    addNoteTypeRecord(context, { typedNote, time }) {
      context.commit("appendOperationRecord", {
        name: "note",
        data: typedNote,
        time: time
      } as OperationRecord);
    },
  },
});
