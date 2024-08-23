module.exports = function(api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'], // Use the Expo preset if you're working with Expo
    plugins: [
      'react-native-reanimated/plugin', // Reanimated plugin should be added at the top of the plugins list
      [
        'module:react-native-dotenv',
        {
          moduleName: '@env',
          path: '.env',
          safe: false,
          allowUndefined: true,
        },
      ],
    ],
  };
};