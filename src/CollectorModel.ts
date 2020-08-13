import Datum from "./Datum";

export default interface CollectorModel {
  datum: Datum;
  answer: string;
  note: string;
  selectedFacts: number[];
  searchQuery: string;
}