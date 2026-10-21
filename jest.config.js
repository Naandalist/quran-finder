module.exports = {
  preset: 'react-native',
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
  moduleNameMapper: {
    '^lib/(.*)$': '<rootDir>/src/lib/$1',
    '^components/(.*)$': '<rootDir>/src/components/$1',
    '^screens/(.*)$': '<rootDir>/src/screens/$1',
    '^app/(.*)$': '<rootDir>/src/app/$1',
  },
  testPathIgnorePatterns: ['/node_modules/', '<rootDir>/website/'],
  transformIgnorePatterns: [
    'node_modules/(?!(@react-native|react-native|react-native-nitro-sqlite|react-native-google-mobile-ads)/)',
  ],
};
