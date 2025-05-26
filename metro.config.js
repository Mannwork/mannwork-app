const { getDefaultConfig } = require('expo/metro-config');
const { withNativeWind } = require('nativewind/metro');

/** @type {import('expo/metro-config').MetroConfig} */
let config = getDefaultConfig(__dirname);

config = withNativeWind(config, { input: './src/common/lib/nativewind/global.css' });

config.resolver.unstable_enablePackageExports = false;

module.exports = config;