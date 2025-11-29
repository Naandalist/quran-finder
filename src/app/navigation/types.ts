export type RootStackParamList = {
  HomeSearch: undefined;
  SearchResults: { query: string; mode: 'lafaz' | 'terjemahan' };
  VerseDetail: { verseKey: string };
  SurahContext: { surahId: number; verseNumber?: number };
  Bookmarks: undefined;
  Settings: undefined;
};

declare global {
  namespace ReactNavigation {
    interface RootParamList extends RootStackParamList {}
  }
}
