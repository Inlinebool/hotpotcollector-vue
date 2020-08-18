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

export interface HitStatus {
  hitParagraphs: string[];
  highlightedSentences: HighlightedSentences;
}

export interface HighlightedSentences {
  [sentenceNumber: number]: string;
}

export interface RankFactResponse {
  ranked_fact_numbers: number[];
}

export interface RankParagraphResponse {
  ranked_paragraphs: string[];
}

export interface ParagraphSimilarity {
  0: string;
  1: number;
}

export interface AnswerSubmit {
  user: string;
  levels: Levels;
  data: AnswerData;
}

export interface Levels {
  easy: boolean;
  medium: boolean;
  hard: boolean;
  [levelName: string]: boolean;
}

export interface AnswerData {
  idx: number;
  answer: string;
  notes: string;
  supportingFacts: number[];
  operationRecord: OperationRecord[];
}

export interface OperationRecord {
  name: string;
  data: any;
  time: number;
}

export function searchContext(context: Paragraph[], searchQuery: string) {
  const hitStatus = { hitParagraphs: [], highlightedSentences: [] } as HitStatus;
  if (!searchQuery || !(searchQuery.trim())) {
    if (!context) {
      return hitStatus;
    }
    context.forEach(paragraph => {
      hitStatus.hitParagraphs.push(paragraph[0]);
    });
    return hitStatus;
  }
  const query = searchQuery.trim();
  context.forEach(paragraph => {
    let hit = false;
    const queryReg = new RegExp(query, 'gi');
    if (paragraph[0].search(query) != -1) {
      hit = true;
    }
    paragraph[1].forEach(numberedSentence => {
      if (numberedSentence[1].search(queryReg) == -1) {
        hitStatus.highlightedSentences[numberedSentence[0]] = numberedSentence[1];
      } else {
        hit = true;
        hitStatus.highlightedSentences[numberedSentence[0]] = numberedSentence[1].replace(queryReg, "<span class=\"searchHit\">$&</span>");
      }
    });
    if (hit) {
      hitStatus.hitParagraphs.push(paragraph[0]);
    }
  });
  return hitStatus;
}