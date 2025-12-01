import React from 'react';
import { Text } from 'react-native';
import { styles } from '../styles';

export function HeroSection() {
  return (
    <>
      <Text style={styles.heroTitle}>Cari Ayat</Text>
      <Text style={styles.heroSubtitleBold}>
        Membantumu menemukan ayat Al-Qur'an.
      </Text>
      <Text style={styles.heroSubtitle}>
        Meski ada typo atau hanya mengingat samar-samar.
      </Text>
    </>
  );
}
