import React from 'react';
import { ImageBackground } from 'react-native';
import { DefaultTheme, NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import Landing from '../screens/Landing';
import Login from '../screens/Login';
import CreateNewCard from '../screens/CreateNewCard';
import Account from '../screens/Account';
//import ConceptApp from '../screens/old/ConceptApp';


const Stack = createStackNavigator();
const navTheme = { ...DefaultTheme, colors: { ...DefaultTheme.colors, background: 'transparent', }, };

const AppNavigator = () => {
  return (
    <ImageBackground
      source={require('../assets/background_grid.png')}
      style={{ flex: 1, width: '100%', height: '100%' }}
    >
      <NavigationContainer theme={navTheme}>
        <Stack.Navigator initialRouteName="Login">
          <Stack.Screen
            name="Landing"
            component={Landing}
            options={{
              headerShown: false
            }}
          />
          <Stack.Screen
            name="Login"
            component={Login}
            options={{
              title: 'Access Assets',

            }}
          />
          <Stack.Screen
            name="CreateNewCard"
            component={CreateNewCard}
            options={{
              title: 'Setup New Access (1/3)',
            }}
          />
          <Stack.Screen
            name="Account"
            component={Account}
            options={{
              title: 'Your Assets',
            }}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </ImageBackground>
  );
};

export default AppNavigator;