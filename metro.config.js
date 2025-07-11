const { getDefaultConfig } = require("expo/metro-config");
const { withNativeWind } = require("nativewind/metro");

let config = getDefaultConfig(__dirname);

config.resolver.assetExts = config.resolver.assetExts.filter(ext => ext !== "svg");
config.resolver.sourceExts = [...config.resolver.sourceExts, "svg"];

config = withNativeWind(config, {
    input: "./src/common/lib/nativewind/global.css",
});

config.resolver.unstable_enablePackageExports = false;

module.exports = config;
