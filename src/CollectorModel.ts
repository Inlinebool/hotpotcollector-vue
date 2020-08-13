import Datum, { OperationRecord } from "./Datum";

export default interface CollectorModel {
  user: string;
  levels: { easy: boolean, medium: boolean, hard: boolean; };
  datum: Datum;
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