import {
  ADMOB_BANNER_UNIT_ID,
  ADMOB_NATIVE_UNIT_ID,
} from 'react-native-dotenv';
import { TestIds } from 'react-native-google-mobile-ads';

export const bannerAdUnitId = __DEV__
  ? TestIds.ADAPTIVE_BANNER
  : ADMOB_BANNER_UNIT_ID || '';

export const nativeAdUnitId = __DEV__
  ? TestIds.NATIVE
  : ADMOB_NATIVE_UNIT_ID || '';

