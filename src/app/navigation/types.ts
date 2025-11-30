export type RootStackParamList = {
  HomeSearch: undefined;
  SearchResults: { query: string; mode: 'lafaz' | 'terjemahan' };
  SearchHistory: undefined;
  VerseDetail: { verseKey: string };
  SurahContext: { surahId: number; verseNumber?: number };
};

declare global {
  namespace ReactNavigation {
    interface RootParamList extends RootStackParamList {}
  }
}
