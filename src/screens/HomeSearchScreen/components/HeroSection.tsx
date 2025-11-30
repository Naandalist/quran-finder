import React from 'react';
import { Text } from 'react-native';
import { styles } from '../styles';

export function HeroSection() {
  return (
    <>
      <Text style={styles.heroTitle}>Cari Ayat</Text>
      <Text style={styles.heroSubtitleBold}>
        Temukan ayat Al-Qur'an dari lafaz atau terjemahan yang kamu ingat.
      </Text>
      <Text style={styles.heroSubtitle}>
        Ketik lafaz latin atau kata kunci bahasa Indonesia, lalu pilih mode
        pencarian yang sesuai.
      </Text>
    </>
  );
}
