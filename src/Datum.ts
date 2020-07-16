export default interface Datum {
  question: string;
  numbered_context: Paragraph[];
  numbered_context_flattened: FlattenedNumberedSentence[];
}

export interface NumberedSentence {
  0: number;
  1: string;
}

export interface FlattenedNumberedSentence {
  0: number;
  1: string;
  2: string;
}

export interface Paragraph {
  0: string;
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