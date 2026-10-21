import React, { useEffect, useState } from 'react';
import { Image, StyleSheet, Text, View } from 'react-native';
import {
  NativeAd,
  NativeAdView,
  NativeAsset,
  NativeAssetType,
} from 'react-native-google-mobile-ads';
import { colors } from 'lib/theme/colors';
import { spacing } from 'lib/theme/spacing';
import { nativeAdUnitId } from './adUnits';
import { mobileAdsReady } from './startMobileAds';

export function NativeAdCard() {
  const [nativeAd, setNativeAd] = useState<NativeAd | null>(null);

  useEffect(() => {
    if (!nativeAdUnitId) {
      return;
    }

    let cancelled = false;
    let loaded: NativeAd | undefined;

    void mobileAdsReady().then(async ok => {
      if (!ok || cancelled) {
        return;
      }
      try {
        loaded = await NativeAd.createForAdRequest(nativeAdUnitId, {
          startVideoMuted: true,
        });
        if (cancelled) {
          loaded.destroy();
          return;
        }
        setNativeAd(loaded);
      } catch {
        loaded?.destroy();
      }
    });

    return () => {
      cancelled = true;
      loaded?.destroy();
    };
  }, []);

  if (!nativeAd) {
    return null;
  }

  return (
    <NativeAdView nativeAd={nativeAd} style={styles.container}>
      <View style={styles.headerRow}>
        <View style={styles.adBadge}>
          <Text style={styles.adBadgeText}>Iklan</Text>
        </View>
        {nativeAd.advertiser ? (
          <View style={styles.advertiserBadge}>
            <NativeAsset assetType={NativeAssetType.ADVERTISER}>
              <Text style={styles.advertiserText} numberOfLines={1}>
                {nativeAd.advertiser}
              </Text>
            </NativeAsset>
          </View>
        ) : null}
      </View>

      <View style={styles.bodyRow}>
        {nativeAd.icon?.url ? (
          <NativeAsset assetType={NativeAssetType.ICON}>
            <Image
              source={{ uri: nativeAd.icon.url }}
              style={styles.icon}
            />
          </NativeAsset>
        ) : null}
        <View style={styles.copy}>
          <NativeAsset assetType={NativeAssetType.HEADLINE}>
            <Text style={styles.headline} numberOfLines={2}>
              {nativeAd.headline}
            </Text>
          </NativeAsset>
          {nativeAd.body ? (
            <NativeAsset assetType={NativeAssetType.BODY}>
              <Text style={styles.body} numberOfLines={3}>
                {nativeAd.body}
              </Text>
            </NativeAsset>
          ) : null}
        </View>
      </View>

      {nativeAd.callToAction ? (
        <NativeAsset assetType={NativeAssetType.CALL_TO_ACTION}>
          <Text style={styles.cta}>{nativeAd.callToAction}</Text>
        </NativeAsset>
      ) : null}
    </NativeAdView>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: 12,
    backgroundColor: colors.background,
    borderRadius: spacing.borderRadius.sm,
    borderWidth: 0.5,
    borderColor: colors.grayBorder,
    overflow: 'hidden',
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  adBadge: {
    backgroundColor: colors.tealLight,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderTopLeftRadius: spacing.borderRadius.sm,
    borderBottomRightRadius: spacing.borderRadius.sm,
    paddingRight: spacing.cardPadding,
  },
  adBadgeText: {
    color: colors.tealDark,
    fontSize: 12,
    fontWeight: '600',
  },
  advertiserBadge: {
    backgroundColor: colors.greenLight,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderTopLeftRadius: spacing.borderRadius.sm,
    borderBottomRightRadius: spacing.borderRadius.sm,
    marginLeft: -spacing.sm,
    maxWidth: 180,
  },
  advertiserText: {
    color: colors.greenDark,
    fontSize: 12,
    fontWeight: '600',
  },
  bodyRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginHorizontal: spacing.md,
    marginBottom: spacing.md,
    gap: spacing.sm,
  },
  icon: {
    width: 40,
    height: 40,
    borderRadius: spacing.borderRadius.sm,
  },
  copy: {
    flex: 1,
  },
  headline: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.gray800,
    lineHeight: 20,
    marginBottom: 4,
  },
  body: {
    fontSize: 11,
    color: colors.gray600,
    lineHeight: 18,
    letterSpacing: 0.5,
  },
  cta: {
    alignSelf: 'flex-start',
    marginHorizontal: spacing.md,
    marginBottom: spacing.md,
    backgroundColor: colors.teal,
    color: colors.white,
    fontSize: 12,
    fontWeight: '700',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: spacing.borderRadius.sm,
    overflow: 'hidden',
  },
});
