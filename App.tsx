import './global';
import * as React from 'react';
import { useEffect } from 'react';
import { Appearance } from 'react-native';
import { Provider as PaperProvider, DefaultTheme } from 'react-native-paper';
import AppNavigator from './src/components/AppNavigator.js';

const App = () => {

  useEffect(() => {
    Appearance.setColorScheme('light');
   }, []);

  if (!__DEV__) {
    console.log = () => { };
  };

  return (
    <PaperProvider theme={DefaultTheme}>
      <AppNavigator />
    </PaperProvider>
  );
}

export default App;
