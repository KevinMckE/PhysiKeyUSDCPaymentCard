import React from 'react';
import { ImageBackground } from 'react-native';
import { DefaultTheme, NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import Landing from '../screens/Landing';
import Login from '../screens/Login';
import Account from '../screens/Account';
import NftDetails from '../screens/NftDetails';
import Pay from '../screens/Pay';
import Request from '../screens/Request';
import Buy from '../screens/Buy';
import Sell from '../screens/Sell';

const Stack = createStackNavigator();
const navTheme = { ...DefaultTheme, colors: { ...DefaultTheme.colors, background: 'transparent', }, };

const AppNavigator = () => {
  return (
      <NavigationContainer theme={navTheme}>
        <Stack.Navigator initialRouteName="Landing">
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
              title: 'Login',
            }}
          />
          <Stack.Screen
            name="Account"
            component={Account}
            options={{
              title: 'Your Account',
            }}
          />
          <Stack.Screen
            name="Pay"
            component={Pay}
            options={{
              title: 'Send ETH',
            }}
          />
          <Stack.Screen
            name="Request"
            component={Request}
            options={{
              title: 'Request ETH',
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
            name="Buy"
            component={Buy}
            options={{
              title: 'Buy',
            }}
          />
          <Stack.Screen
            name="Sell"
            component={Sell}
            options={{
              title: 'Sell',
            }}
          />
        </Stack.Navigator>
      </NavigationContainer>
  );
};

export default AppNavigator;