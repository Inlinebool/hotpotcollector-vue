export default interface Datum {
  idx: number;
  question: string;
  context: Paragraph[];
  flattened_context: FlattenedNumberedSentence[];
}

export interface NumberedSentence {
  0: number; // index
  1: string; // sentence
}

export interface FlattenedNumberedSentence {
  0: number; // index
  1: string; // sentence
  2: string; // title
}

export interface Paragraph {
  0: string; // title
  1: NumberedSentence[];
}

// export interface ParagraphConstructor {
//   new(title: string, content: NumberedSentence[]): Paragraph;
//   clone(): Paragraph;
// }

// export interface NumberedSentenceConstructor {
//   new(idx: number, sentence: string): NumberedSentence;
//   clone(): NumberedSentence;
// }

// export let Paragraph: ParagraphConstructor;
// export let NumberedSentence: NumberedSentenceConstructor;