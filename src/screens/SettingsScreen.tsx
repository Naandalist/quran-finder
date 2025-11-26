import React from 'react';
import { View, Text, StyleSheet, Switch, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

import { Screen } from 'components/layout/Screen';
import { AppBar } from 'components/layout/AppBar';
import { IconButton } from 'components/common/IconButton';
import { useTheme } from 'lib/theme/ThemeProvider';
import { RootStackParamList } from 'app/navigation/types';

type NavigationProp = NativeStackNavigationProp<RootStackParamList, 'Settings'>;

interface SettingItemProps {
  title: string;
  subtitle?: string;
  onPress?: () => void;
  rightElement?: React.ReactNode;
}

const SettingItem: React.FC<SettingItemProps> = ({
  title,
  subtitle,
  onPress,
  rightElement,
}) => {
  const { colors, spacing, typography } = useTheme();

  return (
    <TouchableOpacity
      style={[
        styles.settingItem,
        {
          padding: spacing.md,
          borderBottomWidth: 1,
          borderBottomColor: colors.border,
        },
      ]}
      onPress={onPress}
      disabled={!onPress}>
      <View style={styles.settingContent}>
        <Text style={[typography.body, { color: colors.text }]}>{title}</Text>
        {subtitle && (
          <Text style={[typography.caption, { color: colors.textMuted }]}>
            {subtitle}
          </Text>
        )}
      </View>
      {rightElement}
    </TouchableOpacity>
  );
};

export default function SettingsScreen() {
  const navigation = useNavigation<NavigationProp>();
  const { colors, spacing, typography } = useTheme();

  const [darkMode, setDarkMode] = React.useState(false);
  const [showTranslit, setShowTranslit] = React.useState(true);

  return (
    <Screen>
      <AppBar
        title="Pengaturan"
        left={
          <IconButton icon="←" onPress={() => navigation.goBack()} />
        }
      />

      <View style={styles.container}>
        {/* Display Section */}
        <View style={[styles.section, { marginBottom: spacing.lg }]}>
          <Text
            style={[
              typography.caption,
              {
                color: colors.textMuted,
                paddingHorizontal: spacing.md,
                marginBottom: spacing.sm,
              },
            ]}>
            TAMPILAN
          </Text>
          <View
            style={[
              styles.sectionContent,
              { backgroundColor: colors.surface, borderRadius: 12 },
            ]}>
            <SettingItem
              title="Mode Gelap"
              subtitle="Gunakan tema gelap untuk kenyamanan mata"
              rightElement={
                <Switch
                  value={darkMode}
                  onValueChange={setDarkMode}
                  trackColor={{ true: colors.primary, false: colors.border }}
                />
              }
            />
            <SettingItem
              title="Tampilkan Transliterasi"
              subtitle="Tampilkan bacaan latin di bawah ayat"
              rightElement={
                <Switch
                  value={showTranslit}
                  onValueChange={setShowTranslit}
                  trackColor={{ true: colors.primary, false: colors.border }}
                />
              }
            />
          </View>
        </View>

        {/* About Section */}
        <View style={[styles.section, { marginBottom: spacing.lg }]}>
          <Text
            style={[
              typography.caption,
              {
                color: colors.textMuted,
                paddingHorizontal: spacing.md,
                marginBottom: spacing.sm,
              },
            ]}>
            TENTANG
          </Text>
          <View
            style={[
              styles.sectionContent,
              { backgroundColor: colors.surface, borderRadius: 12 },
            ]}>
            <SettingItem title="Versi Aplikasi" subtitle="1.0.0" />
            <SettingItem title="Tentang Cari Ayat" onPress={() => {}} />
          </View>
        </View>
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 16,
  },
  section: {},
  sectionContent: {
    overflow: 'hidden',
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  settingContent: {
    flex: 1,
  },
});
