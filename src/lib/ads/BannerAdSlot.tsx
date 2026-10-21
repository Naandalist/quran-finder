import React, { useEffect, useState } from 'react';
import { StyleSheet, useWindowDimensions, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import {
  BannerAd,
  BannerAdSize,
} from 'react-native-google-mobile-ads';
import { colors } from 'lib/theme/colors';
import { spacing } from 'lib/theme/spacing';
import { bannerAdUnitId } from './adUnits';
import { mobileAdsReady } from './startMobileAds';

type BannerAdSlotProps = {
  variant?: 'anchored' | 'card';
};

export function BannerAdSlot({ variant = 'anchored' }: BannerAdSlotProps) {
  const insets = useSafeAreaInsets();
  const { width: windowWidth } = useWindowDimensions();
  const [ready, setReady] = useState(false);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    let active = true;
    void mobileAdsReady().then(ok => {
      if (active) {
        setReady(ok);
      }
    });
    return () => {
      active = false;
    };
  }, []);

  if (!bannerAdUnitId || !ready || failed) {
    return null;
  }

  if (variant === 'card') {
    return (
      <View style={styles.card}>
        <BannerAd
          unitId={bannerAdUnitId}
          size={BannerAdSize.INLINE_ADAPTIVE_BANNER}
          width={Math.floor(windowWidth - spacing.md * 2)}
          maxHeight={100}
          onAdFailedToLoad={() => setFailed(true)}
        />
      </View>
    );
  }

  return (
    <View style={[styles.wrap, { paddingBottom: insets.bottom }]}>
      <BannerAd
        unitId={bannerAdUnitId}
        size={BannerAdSize.LARGE_ANCHORED_ADAPTIVE_BANNER}
        onAdFailedToLoad={() => setFailed(true)}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    alignItems: 'center',
    backgroundColor: colors.background,
  },
  card: {
    borderRadius: spacing.borderRadius.sm,
    borderWidth: spacing.borderWidth.default,
    borderColor: colors.gray200,
    borderLeftWidth: spacing.borderWidth.thick,
    borderLeftColor: colors.teal,
    overflow: 'hidden',
    alignItems: 'center',
    backgroundColor: colors.background,
    marginBottom: spacing.sm,
  },
});

