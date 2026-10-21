module.exports = function (api) {
  api.cache(false);
  return {
    presets: ['module:@react-native/babel-preset'],
    plugins: [
      [
        'module:react-native-dotenv',
        {
          moduleName: 'react-native-dotenv',
          path: '.env',
          allowUndefined: true,
        },
      ],
      [
        'module-resolver',
        {
          root: ['./src'],
          extensions: ['.ios.js', '.android.js', '.js', '.ts', '.tsx', '.json'],
          alias: {
            screens: './src/screens',
            components: './src/components',
            lib: './src/lib',
            app: './src/app',
          },
        },
      ],
    ],
  };
};
