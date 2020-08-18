import Datum, { OperationRecord, Paragraph, ParagraphSimilarity } from "./Datum";

export default interface CollectorModel {
  user: string;
  levels: { easy: boolean, medium: boolean, hard: boolean; };
  datum: Datum;
  rankedParagraphs: ParagraphSimilarity[];
  rankedSentences: number[];
  paragraphReference: NameReference;
  sentenceReference: NameReference;
  answer: string;
  note: string;
  selectedFacts: number[];
  searchQuery: string;
  startTime: number;
  pausedTime: number;
  pauseStartTime: number;
  pauseEndTime: number;
  isPaused: boolean;
  operationRecords: OperationRecord[];
}

export interface NameReference {
  [name: string]: string;
}