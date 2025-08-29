export default ({ config }) => ({
  ...config,
  name: 'Component Template',
  slug: 'component-template',
  version: '0.1.0',
  main: 'node_modules/expo/AppEntry.js',
  orientation: 'portrait',
  icon: './assets/icon.png',
  newArchEnabled: true,
  splash: {
    image: './assets/splash.png',
    resizeMode: 'contain',
    backgroundColor: '#ffffff',
  },
  updates: {
    fallbackToCacheTimeout: 0,
  },
  assetBundlePatterns: ['**/*'],
  ios: {
    bundleIdentifier: 'com.zestic.componenttemplate',
    supportsTablet: true,
  },
  android: {
    package: 'com.zestic.component_template',
    adaptiveIcon: {
      foregroundImage: './assets/adaptive-icon.png',
      backgroundColor: '#FFFFFF',
    },
  },
  web: {
    favicon: './assets/favicon.png',
  },
});
