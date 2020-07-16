export default interface Datum {
  question: string;
  numbered_context: Paragraph[];
}

export interface NumberedSentence {
  idx: number;
  sentence: string;
}

export interface Paragraph {
  title: string;
  content: NumberedSentence[];
}

export interface ParagraphConstructor {
  new (title: string, content: NumberedSentence[]): Paragraph;
  clone(): Paragraph;
}

export interface NumberedSentenceConstructor {
  new (idx: number, sentence: string): NumberedSentence;
  clone(): NumberedSentence;
}

export let Paragraph: ParagraphConstructor;
export let NumberedSentence: NumberedSentenceConstructor;