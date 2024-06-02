import React from 'react';
import { DefaultTheme, NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import Landing from '../screens/Landing';
import Login from '../screens/Login';
import Home from '../screens/Home';
import Pay from '../screens/Pay';
import Request from '../screens/Request';

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
            name="Home"
            component={Home}
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

        </Stack.Navigator>
      </NavigationContainer>
  );
};

export default AppNavigator;