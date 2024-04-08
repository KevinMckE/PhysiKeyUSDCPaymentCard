import './shim.js';
import * as React from 'react';
import { Provider as PaperProvider, DefaultTheme } from 'react-native-paper';
import AppNavigator from './src/components/AppNavigator.js';

const App = () => {
 if (!__DEV__) {
    console.log = () => {};
  }
  return (
    <PaperProvider theme={DefaultTheme}>
      <AppNavigator />
    </PaperProvider>
  );
}

export default App;


