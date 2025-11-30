export interface TajweedMark {
  class: string;
  start_baris: number;
  end_baris: number;
  start_pojok: number;
  end_pojok: number;
}

export interface VerseRaw {
  id: number;
  number: number;
  text: string;
  juz_id: number;
  surah_id: number;
  transliteration: string;
  translation_id: string;
}

export interface Verse extends VerseRaw {
  verse_key: string; // computed: "surah_id:number"
}

export type QueryMode = 'lafaz' | 'terjemahan';

export interface SearchResult {
  verse: Verse;
  score: number;
}

export const APP_NAME = 'Cari Ayat';

export const EXAMPLE_QUERIES = [
  'bismillah',
  'alhamdulillah',
  'qulhuwallah',
  'innalillahi',
  'allahulailaha',
  'yaayyuhalkafirun',
];

export const SEARCH_DEBOUNCE_MS = 300;
