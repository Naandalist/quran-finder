jest.mock('react-native-google-mobile-ads', () => {
  const React = require('react');
  return {
    __esModule: true,
    default: () => ({
      initialize: jest.fn(() => Promise.resolve([])),
    }),
    AdsConsent: {
      gatherConsent: jest.fn(() => Promise.resolve({ canRequestAds: true })),
      getConsentInfo: jest.fn(() => Promise.resolve({ canRequestAds: true })),
    },
    BannerAd: () => React.createElement(React.Fragment),
    BannerAdSize: {
      LARGE_ANCHORED_ADAPTIVE_BANNER: 'LARGE_ANCHORED_ADAPTIVE_BANNER',
      INLINE_ADAPTIVE_BANNER: 'INLINE_ADAPTIVE_BANNER',
    },
    NativeAd: {
      createForAdRequest: jest.fn(() => Promise.reject(new Error('ads mock'))),
    },
    NativeAdView: ({ children }) => children,
    NativeAsset: ({ children }) => children,
    NativeAssetType: {
      ADVERTISER: 'advertiser',
      BODY: 'body',
      CALL_TO_ACTION: 'callToAction',
      HEADLINE: 'headline',
      ICON: 'icon',
    },
    TestIds: {
      ADAPTIVE_BANNER: 'test-adaptive-banner',
      NATIVE: 'test-native',
    },
  };
});
