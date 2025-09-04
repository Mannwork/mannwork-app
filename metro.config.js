const { withNativeWind } = require("nativewind/metro");
const {
    getSentryExpoConfig
} = require("@sentry/react-native/metro");

let config = getSentryExpoConfig(__dirname);

config.resolver.assetExts = config.resolver.assetExts.filter(ext => ext !== "svg");
config.resolver.sourceExts = [...config.resolver.sourceExts, "svg"];

config = withNativeWind(config, {
    input: "./src/common/lib/nativewind/global.css",
});

config.resolver.unstable_enablePackageExports = false;

module.exports = config;