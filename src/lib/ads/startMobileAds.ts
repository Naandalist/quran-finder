import mobileAds, { AdsConsent } from 'react-native-google-mobile-ads';

let ready: Promise<boolean> | undefined;

/** Consent first, then one SDK init. Ads stay blocked until this resolves true. */
export function mobileAdsReady(): Promise<boolean> {
  ready ??= (async () => {
    let canRequestAds = false;
    try {
      canRequestAds = (await AdsConsent.gatherConsent()).canRequestAds;
    } catch {
      try {
        canRequestAds = (await AdsConsent.getConsentInfo()).canRequestAds;
      } catch {
        canRequestAds = true;
      }
    }
    if (!canRequestAds) {
      return false;
    }
    try {
      await mobileAds().initialize();
      return true;
    } catch {
      return false;
    }
  })();
  return ready;
}

export function startMobileAds(): void {
  void mobileAdsReady();
}
