import React from 'react';
import { ImageBackground} from 'react-native';
import { DefaultTheme, NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import Landing from '../screens/Landing';

const Stack = createStackNavigator();
const navTheme = { ...DefaultTheme, colors: { ...DefaultTheme.colors, background: 'transparent', }, };

const AppNavigator = () => {
  return (
    <ImageBackground
      source={require('../assets/background_grid.png')}
      style={{ flex: 1, width: '100%', height: '100%' }}
    >
      <NavigationContainer theme={navTheme}>
        <Stack.Navigator initialRouteName="Landing">
          <Stack.Screen
            name="Landing"
            component={Landing}
            options={{
              headerShown: false
            }}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </ImageBackground>
  );
};

export default AppNavigator;