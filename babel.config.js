module.exports = (api) => {
  const babelEnv = api.env();
  const plugins = [['module:react-native-dotenv']];
  if (babelEnv !== 'development') {
    plugins.push(['transform-remove-console']);
  }
  return {
    presets: ['module:metro-react-native-babel-preset'],
    plugins,
  };
};

