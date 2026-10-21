import { TestIds } from 'react-native-google-mobile-ads';

export const bannerAdUnitId = __DEV__
  ? TestIds.ADAPTIVE_BANNER
  : '';

export const nativeAdUnitId = __DEV__
  ? TestIds.NATIVE
  : '';
