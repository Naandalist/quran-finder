import React, { useEffect, useState, useCallback, useRef } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Image,
} from 'react-native';
import SoundPlayer from 'react-native-sound-player';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Verse } from 'lib/types';
import surahs from 'lib/quran/surahs.json';

interface SurahInfo {
  id: number;
  name: string;
  translate: string;
  type: string;
  verse_count: number;
  juz_id: number;
}

interface FloatingAudioPlayerProps {
  verse: Verse | null;
  onClose: () => void;
}

// Play icon component
const PlayIcon = ({
  size = 24,
  color = '#FFFFFF',
}: {
  size?: number;
  color?: string;
}) => (
  <View style={[playIconStyles.container, { width: size, height: size }]}>
    <View
      style={[
        playIconStyles.triangle,
        {
          borderLeftWidth: size * 0.4,
          borderTopWidth: size * 0.3,
          borderBottomWidth: size * 0.3,
          borderLeftColor: color,
          marginLeft: size * 0.1,
        },
      ]}
    />
  </View>
);

const playIconStyles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  triangle: {
    width: 0,
    height: 0,
    borderTopColor: 'transparent',
    borderBottomColor: 'transparent',
  },
});

// Pause icon component
const PauseIcon = ({
  size = 24,
  color = '#FFFFFF',
}: {
  size?: number;
  color?: string;
}) => (
  <View
    style={[
      pauseIconStyles.container,
      { width: size, height: size, gap: size * 0.15 },
    ]}
  >
    <View
      style={[
        pauseIconStyles.bar,
        { width: size * 0.2, height: size * 0.6, backgroundColor: color },
      ]}
    />
    <View
      style={[
        pauseIconStyles.bar,
        { width: size * 0.2, height: size * 0.6, backgroundColor: color },
      ]}
    />
  </View>
);

const pauseIconStyles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  bar: {
    borderRadius: 2,
  },
});

// Close icon component
const CloseIcon = ({
  size = 20,
  color = '#9CA3AF',
}: {
  size?: number;
  color?: string;
}) => (
  <View style={[closeIconStyles.container, { width: size, height: size }]}>
    <View
      style={[
        closeIconStyles.line,
        {
          width: size * 0.7,
          height: 2,
          backgroundColor: color,
          transform: [{ rotate: '45deg' }],
        },
      ]}
    />
    <View
      style={[
        closeIconStyles.line,
        {
          width: size * 0.7,
          height: 2,
          backgroundColor: color,
          transform: [{ rotate: '-45deg' }],
          position: 'absolute',
        },
      ]}
    />
  </View>
);

const closeIconStyles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  line: {
    borderRadius: 1,
  },
});

// Quran artwork image
const QuranArtwork = () => (
  <Image
    source={require('../../../assets/a_verse_from_qur_an.jpg')}
    style={quranArtworkStyles.image}
    resizeMode="cover"
  />
);

const quranArtworkStyles = StyleSheet.create({
  image: {
    width: '100%',
    height: '100%',
  },
});

// Static waveform data - mimics real audio waveform pattern
const WAVEFORM_DATA = [
  0.3, 0.5, 0.4, 0.7, 0.6, 0.8, 0.5, 0.9, 0.7, 0.6, 0.8, 0.5, 0.7, 0.9, 0.6,
  0.4, 0.7, 0.8, 0.5, 0.6, 0.9, 0.7, 0.5, 0.8, 0.6, 0.7, 0.4, 0.6, 0.8, 0.5,
  0.7, 0.9, 0.6, 0.5, 0.8, 0.7, 0.6, 0.9, 0.5, 0.7, 0.8, 0.6, 0.5, 0.7, 0.9,
  0.6, 0.8, 0.5, 0.7, 0.4,
];

// Static Waveform component with progress
const StaticWaveform = ({ progress }: { progress: number }) => {
  const barCount = WAVEFORM_DATA.length;
  const progressIndex = Math.floor(progress * barCount);

  return (
    <View style={waveformStyles.container}>
      {WAVEFORM_DATA.map((amplitude, index) => {
        const isPlayed = index <= progressIndex;
        return (
          <View
            key={index}
            style={[
              waveformStyles.bar,
              {
                height: `${amplitude * 100}%`,
                backgroundColor: isPlayed ? '#0D9488' : '#4B5563',
              },
            ]}
          />
        );
      })}
    </View>
  );
};

const waveformStyles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    height: 36,
    paddingHorizontal: 2,
  },
  bar: {
    width: 3,
    borderRadius: 1.5,
    marginHorizontal: 1,
  },
});

export const FloatingAudioPlayer: React.FC<FloatingAudioPlayerProps> = ({
  verse,
  onClose,
}) => {
  const insets = useSafeAreaInsets();
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const progressInterval = useRef<ReturnType<typeof setInterval> | null>(null);
  const currentVerseId = useRef<number | null>(null);
  const currentAudioUrl = useRef<string | null>(null);

  // Get surah info
  const surahInfo: SurahInfo | undefined = verse
    ? surahs.find((s: SurahInfo) => s.id === verse.surah_id)
    : undefined;

  const surahName = surahInfo?.name || `Surah ${verse?.surah_id}`;

  // Base URL for audio files
  const AUDIO_BASE_URL = 'https://everyayah.com/data/Nasser_Alqatami_128kbps';

  // Generate audio URL based on verse (surah_id and verse number)
  // Format: {surah_id:3digits}{verse_number:3digits}.mp3
  // Example: Surah 2 Ayat 3 → 002003.mp3
  const getAudioUrl = useCallback((v: Verse): string => {
    const surahId = String(v.surah_id).padStart(3, '0');
    const verseNumber = String(v.number).padStart(3, '0');
    return `${AUDIO_BASE_URL}/${surahId}${verseNumber}.mp3`;
  }, []);

  console.log('🔥 getAudioUrl:', getAudioUrl);

  const startProgressTracking = useCallback(() => {
    if (progressInterval.current) {
      clearInterval(progressInterval.current);
    }
    progressInterval.current = setInterval(async () => {
      try {
        const info = await SoundPlayer.getInfo();
        if (info && info.duration > 0) {
          setProgress(info.currentTime / info.duration);
        }
      } catch {
        // Ignore errors when getting info
      }
    }, 100);
  }, []);

  const stopProgressTracking = useCallback(() => {
    if (progressInterval.current) {
      clearInterval(progressInterval.current);
      progressInterval.current = null;
    }
  }, []);

  const loadAndPlay = useCallback(
    async (v: Verse) => {
      try {
        setIsLoading(true);
        setProgress(0);

        const audioUrl = getAudioUrl(v);

        // Stop any current playback
        try {
          SoundPlayer.stop();
        } catch {
          // Ignore if nothing is playing
        }

        // Small delay to ensure component is mounted
        await new Promise<void>(resolve => setTimeout(resolve, 100));

        // Play from URL
        try {
          SoundPlayer.playUrl(audioUrl);
          currentVerseId.current = v.id;
          currentAudioUrl.current = audioUrl;
          setIsPlaying(true);
          startProgressTracking();
        } catch (playError) {
          console.error('Error playing URL:', playError);
          setIsLoading(false);
        }
      } catch (error) {
        console.error('Error loading audio:', error);
        setIsLoading(false);
      }
    },
    [getAudioUrl, startProgressTracking],
  );

  useEffect(() => {
    // Set up event listeners
    const onFinishedPlaying = SoundPlayer.addEventListener(
      'FinishedPlaying',
      () => {
        // Loop: replay the audio when finished
        if (currentAudioUrl.current) {
          setProgress(0);
          SoundPlayer.playUrl(currentAudioUrl.current);
        }
      },
    );

    const onFinishedLoading = SoundPlayer.addEventListener(
      'FinishedLoading',
      () => {
        setIsLoading(false);
      },
    );

    const onFinishedLoadingURL = SoundPlayer.addEventListener(
      'FinishedLoadingURL',
      () => {
        setIsLoading(false);
      },
    );

    return () => {
      onFinishedPlaying.remove();
      onFinishedLoading.remove();
      onFinishedLoadingURL.remove();
      stopProgressTracking();
      try {
        SoundPlayer.stop();
      } catch {
        // Ignore
      }
    };
  }, [stopProgressTracking]);

  useEffect(() => {
    if (verse && verse.id !== currentVerseId.current) {
      loadAndPlay(verse);
    }
  }, [verse, loadAndPlay]);

  const handlePlayPause = useCallback(() => {
    try {
      if (isPlaying) {
        SoundPlayer.pause();
        setIsPlaying(false);
        stopProgressTracking();
      } else {
        SoundPlayer.resume();
        setIsPlaying(true);
        startProgressTracking();
      }
    } catch (error) {
      console.error('Error toggling playback:', error);
    }
  }, [isPlaying, startProgressTracking, stopProgressTracking]);

  const handleClose = useCallback(() => {
    try {
      SoundPlayer.stop();
    } catch {
      // Ignore
    }
    setIsPlaying(false);
    setProgress(0);
    stopProgressTracking();
    currentVerseId.current = null;
    currentAudioUrl.current = null;
    onClose();
  }, [onClose, stopProgressTracking]);

  if (!verse) return null;

  return (
    <View style={[styles.container, { paddingBottom: insets.bottom || 16 }]}>
      {/* Close button row */}
      <View style={styles.closeButtonRow}>
        <TouchableOpacity style={styles.closeButton} onPress={handleClose}>
          <CloseIcon size={20} color="#9CA3AF" />
        </TouchableOpacity>
      </View>

      {/* Static Waveform with Progress */}
      <View style={styles.visualizerContainer}>
        <StaticWaveform progress={progress} />
      </View>

      <View style={styles.content}>
        {/* Album art / Icon */}
        <TouchableOpacity style={styles.artworkContainer} onPress={handleClose}>
          <QuranArtwork />
        </TouchableOpacity>

        {/* Track info */}
        <View style={styles.infoContainer}>
          <Text style={styles.title} numberOfLines={1}>
            Surah {surahName}: {verse.number}
          </Text>
          <Text style={styles.artist} numberOfLines={1}>
            Nasser Al Qatami
          </Text>
        </View>

        {/* Play/Pause button */}
        <TouchableOpacity
          style={styles.playButton}
          onPress={handlePlayPause}
          disabled={isLoading}
        >
          {isLoading ? (
            <ActivityIndicator size="small" color="#FFFFFF" />
          ) : isPlaying ? (
            <PauseIcon size={24} color="#FFFFFF" />
          ) : (
            <PlayIcon size={24} color="#FFFFFF" />
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#1F2937',
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 10,
  },
  closeButtonRow: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    paddingTop: 8,
    paddingHorizontal: 8,
  },
  visualizerContainer: {
    height: 36,
    paddingHorizontal: 16,
    justifyContent: 'center',
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  artworkContainer: {
    width: 48,
    height: 48,
    borderRadius: 8,
    overflow: 'hidden',
    backgroundColor: '#374151',
  },
  infoContainer: {
    flex: 1,
    marginLeft: 12,
  },
  title: {
    fontSize: 14,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  artist: {
    fontSize: 12,
    color: '#9CA3AF',
    marginTop: 2,
  },
  playButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#0D9488',
    alignItems: 'center',
    justifyContent: 'center',
  },
  closeButton: {
    width: 32,
    height: 32,
    marginLeft: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default FloatingAudioPlayer;
