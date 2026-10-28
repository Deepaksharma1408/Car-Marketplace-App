const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);

// Build caches contain Gradle sockets and Android SDK files, not app sources.
// Watching them can crash Metro on Windows and needlessly index gigabytes.
const existingBlockList = config.resolver.blockList;
config.resolver.blockList = [
  ...(Array.isArray(existingBlockList) ? existingBlockList : existingBlockList ? [existingBlockList] : []),
  /[/\\](\.android-tools|\.android-sdk|\.android-avd|\.git)([/\\]|$)/,
];

if (!config.resolver.assetExts.includes('mp4')) {
  config.resolver.assetExts.push('mp4');
}

module.exports = config;
