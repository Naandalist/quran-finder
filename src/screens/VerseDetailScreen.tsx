import React from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity } from 'react-native';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

import { Screen } from 'components/layout/Screen';
import { AppBar } from 'components/layout/AppBar';
import { IconButton } from 'components/common/IconButton';
import { useTheme } from 'lib/theme/ThemeProvider';
import { RootStackParamList } from 'app/navigation/types';
import { getVerseByKey } from 'lib/quran/verses';

import { VerseMetaHeader } from 'components/verses/VerseMetaHeader';

type NavigationProp = NativeStackNavigationProp<RootStackParamList, 'VerseDetail'>;
type VerseDetailRouteProp = RouteProp<RootStackParamList, 'VerseDetail'>;

export default function VerseDetailScreen() {
  const navigation = useNavigation<NavigationProp>();
  const route = useRoute<VerseDetailRouteProp>();
  const { colors, spacing, typography } = useTheme();

  const { verseKey } = route.params;
  const verse = getVerseByKey(verseKey);

  const [surahId] = verseKey.split(':').map(Number);

  if (!verse) {
    return (
      <Screen>
        <AppBar
          title="Ayat"
          left={
            <IconButton icon="←" onPress={() => navigation.goBack()} />
          }
        />
        <View style={styles.errorContainer}>
          <Text style={[typography.body, { color: colors.textMuted }]}>
            Ayat tidak ditemukan
          </Text>
        </View>
      </Screen>
    );
  }

  return (
    <Screen>
      <AppBar
        title={`Ayat ${verseKey}`}
        left={
          <IconButton icon="←" onPress={() => navigation.goBack()} />
        }
        right={
          <View style={styles.headerActions}>
            <IconButton icon="🔖" onPress={() => {}} />
            <IconButton icon="📤" onPress={() => {}} />
          </View>
        }
      />

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={[styles.content, { padding: spacing.md, gap: spacing.lg }]}>
        {/* Meta Header */}
        <VerseMetaHeader verseKey={verseKey} />

        {/* Arabic Text */}
        <View
          style={[
            styles.arabicContainer,
            {
              backgroundColor: colors.surface,
              padding: spacing.lg,
              borderRadius: 12,
            },
          ]}>
          <Text
            style={[
              typography.arabic,
              styles.arabicText,
              { color: colors.text, fontSize: 32, lineHeight: 56 },
            ]}>
            {verse.text}
          </Text>
        </View>

        {/* Transliteration */}
        <View style={[styles.section, { gap: spacing.xs }]}>
          <Text style={[typography.caption, { color: colors.textMuted }]}>
            Transliterasi
          </Text>
          <Text style={[typography.body, { color: colors.textSecondary }]}>
            {verse.transliteration}
          </Text>
        </View>

        {/* Translation */}
        <View style={[styles.section, { gap: spacing.xs }]}>
          <Text style={[typography.caption, { color: colors.textMuted }]}>
            Terjemahan
          </Text>
          <Text style={[typography.body, { color: colors.text }]}>
            {verse.translation_id}
          </Text>
        </View>

        {/* Context Link */}
        <TouchableOpacity
          style={[
            styles.contextButton,
            {
              backgroundColor: colors.surfaceElevated,
              padding: spacing.md,
            },
          ]}
          onPress={() => navigation.navigate('SurahContext', { surahId })}>
          <Text style={[typography.body, { color: colors.text }]}>
            📖 Lihat dalam konteks surah
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  scrollView: {
    flex: 1,
  },
  content: {},
  errorContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  arabicContainer: {},
  arabicText: {
    textAlign: 'right',
    writingDirection: 'rtl',
  },
  section: {},
  contextButton: {
    alignSelf: 'stretch',
  },
});
