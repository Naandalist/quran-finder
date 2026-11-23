jest.mock('react-native-dotenv', () => ({
  ADMOB_ANDROID_APP_ID: '',
  ADMOB_IOS_APP_ID: '',
  ADMOB_NATIVE_UNIT_ID: '',
  ADMOB_BANNER_UNIT_ID: '',
}));

jest.mock('react-native-mmkv', () => {
  const stores = new Map();
  const getStore = name => {
    if (!stores.has(name)) {
      stores.set(name, new Map());
    }
    return stores.get(name);
  };
  return {
    __esModule: true,
    createMMKV: ({ id = 'default' } = {}) => {
      const store = getStore(id);
      return {
        getString: key => store.get(key),
        set: (key, value) => store.set(key, String(value)),
        getNumber: key => store.get(key),
        getBoolean: key => store.get(key),
        contains: key => store.has(key),
        remove: key => store.delete(key),
        clearAll: () => store.clear(),
      };
    },
  };
});

jest.mock('react-native-bootsplash', () => ({
  __esModule: true,
  default: {
    hide: jest.fn(() => Promise.resolve()),
    init: jest.fn(),
  },
  useHideAnimation: jest.fn(() => ({ container: {}, logo: {}, brand: {} })),
}));

jest.mock('react-native-sound-player', () => ({
  __esModule: true,
  default: {
    playUrl: jest.fn(),
    pause: jest.fn(),
    resume: jest.fn(),
    stop: jest.fn(),
    getInfo: jest.fn(() => Promise.resolve({ currentTime: 0, duration: 0 })),
    addEventListener: jest.fn(() => ({ remove: jest.fn() })),
  },
}));

jest.mock('@dr.pogodin/react-native-fs', () => ({
  __esModule: true,
  DocumentDirectoryPath: '/data/user/0/com.naandalist.quran_finder/files',
  exists: jest.fn(() => Promise.resolve(false)),
  unlink: jest.fn(() => Promise.resolve()),
  copyFileAssets: jest.fn(() => Promise.resolve()),
}));

jest.mock('react-native-nitro-sqlite', () => {  const connection = {
    execute: jest.fn(() => ({ rows: { _array: [] } })),
    executeAsync: jest.fn(() => Promise.resolve({ rows: { _array: [] } })),
    close: jest.fn(),
  };
  return {
    __esModule: true,
    open: jest.fn(() => connection),
  };
});

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
