const { withRozenite } = require('@rozenite/metro');
const { getDefaultConfig, mergeConfig } = require('@react-native/metro-config');
const exclusionList = require('metro-config/src/defaults/exclusionList');

/**
 * Metro configuration
 * https://reactnative.dev/docs/metro
 *
 * @type {import('@react-native/metro-config').MetroConfig}
 */
const config = {
  resolver: {
    // website/ is a separate Astro app with its own node_modules.
    blockList: exclusionList([/\/website\/.*/]),
  },
};

module.exports = withRozenite(mergeConfig(getDefaultConfig(__dirname), config), {
  enabled: process.env.WITH_ROZENITE === 'true',
});
