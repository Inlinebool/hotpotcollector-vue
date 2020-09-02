import Datum, { OperationRecord, ParagraphSimilarity, Levels } from "./Datum";

export default interface CollectorModel {
  consent: boolean;
  instructionDone: boolean;
  practiceDone: boolean;
  basicDone: boolean;
  rankedDone: boolean;
  user: string;
  practiceQuestions: number[];
  basicQuestions: number[];
  rankedQuestions: number[];
  datum: Datum;
  rankedParagraphs: ParagraphSimilarity[];
  rankedSentences: number[];
  paragraphReference: NameReference;
  sentenceReference: NameReference;
  answer: string;
  note: string;
  selectedFacts: Set<number>;
  selectedFactsArray: number[];
  searchQuery: string;
  startTime: number;
  pausedTime: number;
  pauseStartTime: number;
  sessionTime: number;
  isPaused: boolean;
  operationRecords: OperationRecord[];
  interfaceName: string;
  contexted: boolean;
}

export interface NameReference {
  [name: string]: string;
}