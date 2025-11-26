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
  translation_en: string;
  translation_my: string;
  translation_de: string;
  translation_tr: string;
  translation_fr: string;
  tajweed?: TajweedMark[];
}

export interface Verse extends VerseRaw {
  verse_key: string; // computed: "surah_id:number"
}

export type QueryMode = 'lafaz' | 'makna';

export interface SearchResult {
  verse: Verse;
  score: number;
}

export const APP_NAME = 'Cari Ayat';

export const EXAMPLE_QUERIES = [
  'bismillah',
  'alhamdulillah',
  'qulhuallah',
  'inna lillahi',
  'ayat kursi',
  'al fatihah',
];

export const SEARCH_DEBOUNCE_MS = 300;
