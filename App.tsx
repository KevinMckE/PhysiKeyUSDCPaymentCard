import './global';
import * as React from 'react';
import { useEffect } from 'react';
import { Appearance } from 'react-native';
import { Provider as PaperProvider, DefaultTheme } from 'react-native-paper';
import AppNavigator from './src/components/AppNavigator.js';

const App = () => {
  
  useEffect(() => {
    const fetchCatFact = async () => {
      try {
        const response = await fetch('https://catfact.ninja/fact');
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const data = await response.json();
        console.log(data);
      } catch (error) {
        setError(error.message);
      }
    };
    fetchCatFact();
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
