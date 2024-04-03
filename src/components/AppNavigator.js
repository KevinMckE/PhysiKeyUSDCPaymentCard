import React from 'react';
import { ImageBackground } from 'react-native';
import { DefaultTheme, NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import Landing from '../screens/Landing';
import Login from '../screens/Login';
import Account from '../screens/Account';
import NftDetails from '../screens/NftDetails';
import Transfer from '../screens/Transfer';

const Stack = createStackNavigator();
const navTheme = { ...DefaultTheme, colors: { ...DefaultTheme.colors, background: 'transparent', }, };

const AppNavigator = () => {
  return (
      <NavigationContainer theme={navTheme}>
        <Stack.Navigator initialRouteName="Transfer">
          <Stack.Screen
            name="Landing"
            component={Landing}
            options={{
              headerShown: false,
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
            name="Account"
            component={Account}
            options={{
              title: 'Your Assets',
            }}
          />
          <Stack.Screen
            name="NftDetails"
            component={NftDetails}
            options={{
              title: 'NFT Details',
            }}
          />
          <Stack.Screen
            name="Transfer"
            component={Transfer}
            options={{
              title: 'Transfer OP',
            }}
          />
        </Stack.Navigator>
      </NavigationContainer>
  );
};

export default AppNavigator;