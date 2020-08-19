import Datum, { OperationRecord, ParagraphSimilarity, Levels } from "./Datum";

export default interface CollectorModel {
  user: string;
  levels: Levels;
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
  pauseEndTime: number;
  isPaused: boolean;
  operationRecords: OperationRecord[];
  interfaceName: string;
}

export interface NameReference {
  [name: string]: string;
}