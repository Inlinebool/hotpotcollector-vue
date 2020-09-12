import Vue from "vue";
import Vuex from "vuex";
import CollectorModel, { NameReference } from "./CollectorModel";
import Datum, { FlattenedNumberedSentence, searchContext, AnswerSubmit, OperationRecord, Levels, ParagraphSimilarity, HitStatus, AnswerData } from "./Datum";

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    user: "anon",
    consent: false,
    instructionDone: false,
    practiceDone: false,
    basicDone: false,
    rankedDone: false,
    practiceQuestions: [] as number[],
    basicQuestions: [] as number[],
    rankedQuestions: [] as number[],
    datum: {} as Datum,
    answer: "",
    note: "",
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
    sessionTime: 0,
    isPaused: false,
    operationRecords: [] as OperationRecord[],
    interfaceName: "Basic",
    contexted: false,
    sessionStartTime: -1
  } as CollectorModel,

  getters: {
    hitStatus: state => {
      return searchContext(state.datum.context, state.searchQuery);
    }
  },

  mutations: {
    setUser(state, user: string) {
      state.user = user;
    },
    setBasicQuestions(state, basicQuestions: number[]) {
      state.basicQuestions = basicQuestions;
    },
    setPracticeQuestions(state, practiceQuestions: number[]) {
      state.practiceQuestions = practiceQuestions;
    },
    setRankedQuestions(state, rankedQuestions: number[]) {
      state.rankedQuestions = rankedQuestions;
    },
    setConsent(state, consent: boolean) {
      state.consent = consent;
    },
    setPracticeDone(state, practiceDone: boolean) {
      state.practiceDone = practiceDone;
    },
    setBasicDone(state, basicDone: boolean) {
      state.basicDone = basicDone;
    },
    setRankedDone(state, rankedDone: boolean) {
      state.rankedDone = rankedDone;
    },
    setInstructionDone(state, instructionDone: boolean) {
      state.instructionDone = instructionDone;
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
      state.answer = answer ? answer : "";
    },
    setSessionStartTime(state, time: number) {
      state.sessionStartTime = time;
    },
    setNote(state, note: string) {
      state.note = note ? note : "";
    },
    setSearchQuery(state, searchQuery: string) {
      state.searchQuery = searchQuery;
    },
    setStartTime(state, time: number) {
      state.startTime = time;
    },
    setPausedTime(state, time: number) {
      state.pausedTime = time;
    },
    setPaused(state, isPaused: boolean) {
      state.isPaused = isPaused;
    },
    setSessionTime(state, time: number) {
      state.sessionTime = time;
    },
    togglePaused(state) {
      state.isPaused = !state.isPaused;
    },
    setParagraphReference(state, reference: NameReference) {
      for (const oldReference in state.paragraphReference) {
        delete state.paragraphReference[oldReference];
      }
      Object.assign(state.paragraphReference, reference);
    },
    setPauseStartTime(state, time: number) {
      state.pauseStartTime = time;
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
      record.realTime = Date.now();
      state.operationRecords.push(record);
    },
    clearOperationRecords(state) {
      state.operationRecords.splice(0, state.operationRecords.length);
    },
    setInterface(state, interfaceName: string) {
      state.interfaceName = interfaceName;
    },
    setContexted(state, contexted: boolean) {
      state.contexted = contexted;
    }
  },

  actions: {
    addSearchRecord(context, { time }) {
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
          query: searchQuery ? searchQuery : "",
          hitParagraphs: hitStatus.hitParagraphs,
          hitSentences: hitSentences
        },
        time: time
      } as OperationRecord);
    },
    onFactClicked(context, { factNumber, time }) {
      if (context.state.selectedFacts.has(factNumber)) {
        context.commit("removeSelectedFact", factNumber);
        context.commit("appendOperationRecord", {
          name: "remove_fact",
          data: factNumber,
          time: time
        } as OperationRecord);
      } else {
        context.commit("addSelectedFact", factNumber);
        context.commit("appendOperationRecord", {
          name: "select_fact",
          data: factNumber,
          time: time
        } as OperationRecord);
      }
      context.commit("appendOperationRecord", {
        name: "click_fact",
        data: Array.from(context.state.selectedFacts),
        time: time
      } as OperationRecord);
    },
    newDatum(context, { datum }) {
      context.commit("setDatum", datum);
      context.commit("clearSelectedFacts");
      context.commit("setSearchQuery", "");
      context.commit("setStartTime", Date.now());
      context.commit("setPausedTime", 0);
      context.commit("setPaused", false);
      context.commit("clearOperationRecords");
      context.commit("setAnswer", "");
      context.commit("setNote", "");
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
    addToggleParagraphRecord(context, { openedParagraphs, time }) {
      context.commit("appendOperationRecord", {
        name: "toggle_paragraph",
        data: openedParagraphs,
        time: time
      } as OperationRecord);
    },
    addExpandAllRecord(context, { time }) {
      context.commit("appendOperationRecord", {
        name: "expand_all",
        data: "",
        time: time
      } as OperationRecord);
    },
    addCollapseAllRecord(context, { time }) {
      context.commit("appendOperationRecord", {
        name: "collapse_all",
        data: "",
        time: time
      } as OperationRecord);
    },
    addExpandHitRecord(context, { time }) {
      context.commit("appendOperationRecord", {
        name: "expand_hit",
        data: "",
        time: time
      } as OperationRecord);
    },
    addToggleSentenceContextRecord(context, { factNumber, time }) {
      context.commit("appendOperationRecord", {
        name: "toggle_sentence_context",
        data: factNumber,
        time: time
      } as OperationRecord);
    },
    addToggleEnableAllRecord(context, { time }) {
      context.commit("appendOperationRecord", {
        name: "toggle_enable_all",
        data: "",
        time: time
      } as OperationRecord);
    },
    addToggleEnableRecord(context, { enabledParagraphs, time }) {
      context.commit("appendOperationRecord", {
        name: "toggle_enable",
        data: enabledParagraphs,
        time: time
      } as OperationRecord);
    },
    addBackToTopRecord(context, { time }) {
      context.commit("appendOperationRecord", {
        name: "back_top",
        data: "",
        time: time
      } as OperationRecord);
    },
    togglePause(context) {
      if (context.state.startTime == -1) {
        return;
      } else {
        context.commit("togglePaused");
        if (context.state.isPaused) {
          context.commit("setPauseStartTime", Date.now());
        } else {
          const pausedTime = Date.now() - context.state.pauseStartTime;
          context.commit("setPausedTime", context.state.pausedTime + pausedTime);
        }
      }
    },
    addSessionTime(context, { time }) {
      this.commit("setSessionTime", context.state.sessionTime + time);
    },
    addSkipClickedRecord(context, { time }) {
      context.commit("appendOperationRecord", {
        name: "skip_clicked",
        data: "",
        time: time
      } as OperationRecord);
    },
    addSubmitClickedRecord(context, { time }) {
      context.commit("appendOperationRecord", {
        name: "submit_clicked",
        data: "",
        time: time
      } as OperationRecord);
    }
  },
});
