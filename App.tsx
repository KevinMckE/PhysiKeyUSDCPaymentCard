import './global';
import * as React from 'react';
import { useEffect } from 'react';
import { Provider as PaperProvider, DefaultTheme } from 'react-native-paper';
import AppNavigator from './src/components/AppNavigator.js';

const App = () => {

  useEffect(() => {
    fetch('https://dummy.restapiexample.com/api/v1/employees') // api for the get request
    .then(response => response.json())
    .then(data => console.log(data));
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
