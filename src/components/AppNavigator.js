import React from 'react';
import { Text, TouchableOpacity } from 'react-native';
import { DefaultTheme, NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import Landing from '../screens/Landing';
import Login from '../screens/Login';
import AddAccount from '../screens/AddAccount';
import Home from '../screens/Home';
import Pay from '../screens/Pay';
import Request from '../screens/Request';
import AccountSettings from '../screens/AccountSettings';
import styles from '../styles/common';

const Stack = createStackNavigator();
const navTheme = { ...DefaultTheme, colors: { ...DefaultTheme.colors, background: 'transparent' } };

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
          name="AddAccount"
          component={AddAccount}
          options={{
            title: 'Add Account',
          }}
        />
        <Stack.Screen
          name="Home"
          component={Home}
          options={({ navigation }) => ({
            title: 'Regen Card',
            headerLeft: () => (
              <TouchableOpacity onPress={() => navigation.navigate('Login')} style={styles.headerButton}>
              <Text style={styles.headerButtonArrow}>{'<'}</Text>
              <Text style={[styles.headerButtonText, { marginLeft: 10, fontWeight: 'bold' }]}>
              Logout
              </Text>
            </TouchableOpacity>),
          })}
        />
        <Stack.Screen
          name="Pay"
          component={Pay}
          options={{
            title: 'Send USDC',
          }}
        />
        <Stack.Screen
          name="Request"
          component={Request}
          options={{
            title: 'Request USDC',
          }}
        />
        <Stack.Screen
          name="AccountSettings"
          component={AccountSettings}
          options={{
            title: 'Account Settings',
          }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;
