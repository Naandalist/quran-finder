export type RootStackParamList = {
  HomeSearch: undefined;
  SearchResults: { query: string; mode: 'lafaz' | 'makna' };
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
