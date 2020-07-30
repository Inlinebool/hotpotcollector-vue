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

export interface ParagraphHitStatus {
  hit: boolean;
  hitSentences: number[];
}

export function searchParagraph(paragraph: Paragraph, searchString: string) {
  if (!searchString) {
    return { hit: true, hitSentences: [] }
  }
  const query = searchString.toLowerCase();
  let hit = false;
  const hitSentences = [] as number[];
  if (paragraph[0].toLowerCase().includes(query)) {
    hit = true;
  }
  paragraph[1].forEach(sentence => {
    if (sentence[1].toLowerCase().includes(query)) {
      hit = true;
      hitSentences.push(sentence[0])
    }
  });
  return { hit: hit, hitSentences: hitSentences }
}