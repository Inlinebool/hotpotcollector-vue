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
  highlightedSentences: { [sentenceNumber: number]: string };
}

export interface RankFactsResponse {
  ranked_facts: FlattenedNumberedSentence[];
}

export function searchContext(context: Paragraph[], searchQuery: string) {
  const hitStatus = { hitParagraphs: [], highlightedSentences: [] } as HitStatus;
  if (!searchQuery) {
    context.forEach(paragraph => {
      hitStatus.hitParagraphs.push(paragraph[0]);
    });
    return hitStatus;
  }
  context.forEach(paragraph => {
    let hit = false;
    const query = new RegExp(searchQuery, 'gi');
    if (paragraph[0].search(query) != -1) {
      hit = true;
    }
    paragraph[1].forEach(numberedSentence => {
      if (numberedSentence[1].search(query) == -1) {
        hitStatus.highlightedSentences[numberedSentence[0]] = numberedSentence[1];
      } else {
        hit = true;
        hitStatus.highlightedSentences[numberedSentence[0]] = numberedSentence[1].replace(query, "<span class=\"searchHit\">$&</span>");
      }
    });
    if (hit) {
      hitStatus.hitParagraphs.push(paragraph[0]);
    }
  });
  return hitStatus;
}