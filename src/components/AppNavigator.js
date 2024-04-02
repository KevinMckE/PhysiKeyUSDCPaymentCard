import React from 'react';
import { ImageBackground } from 'react-native';
import { DefaultTheme, NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import Landing from '../screens/Landing';
import Login from '../screens/Login';
import Account from '../screens/Account';
import NftDetails from '../screens/NftDetails';

const Stack = createStackNavigator();
const navTheme = { ...DefaultTheme, colors: { ...DefaultTheme.colors, background: 'transparent', }, };

const AppNavigator = () => {
  return (
    <ImageBackground
      source={require('../assets/tech_pattern.jpg')}
      style={{ flex: 1, width: '100%', height: '100%' }}
    >
      <NavigationContainer theme={navTheme}>
        <Stack.Navigator initialRouteName="Landing">
          <Stack.Screen
            name="Landing"
            component={Landing}
            options={{
              headerShown: false,
              detachPreviousScreen: false
            }}
          />
          <Stack.Screen
            name="Login"
            component={Login}
            options={{
              title: 'Access Assets',
              detachPreviousScreen: false
            }}
          />
          <Stack.Screen
            name="Account"
            component={Account}
            options={{
              title: 'Your Assets',
              detachPreviousScreen: false
            }}
          />
          <Stack.Screen
            name="NftDetails"
            component={NftDetails}
            options={{
              title: 'NFT Details',
              detachPreviousScreen: false
            }}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </ImageBackground> 
  );
};

export default AppNavigator;