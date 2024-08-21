/////////////////////////////////
// APP NAVIGATOR COMPONENT///////
// Handle context AND stack    //
// of screens for stack        //
// navigation.  Used in APP.TSX//
//                             //
// RegenCard 2024              //
/////////////////////////////////

// libraries
import React from 'react';
import { Text, TouchableOpacity } from 'react-native';
import { Provider as PaperProvider, DefaultTheme } from 'react-native-paper';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
// providers
import AccountContextProvider from '../contexts/AccountContext';
// screens
import Landing from '../screens/Landing';
import Login from '../screens/Login';
import AddAccount from '../screens/AddAccount';
import InstantAccept from '../screens/InstantAccept';
import InstantAcceptLogin from '../screens/InstantAcceptLogin';
import InstantAcceptAccount from '../screens/InstantAcceptAccount';
import InstantAcceptTransfer from '../screens/InstantAcceptTransfer';
import InstantAccountSell from '../screens/InstantAcceptSell';
import History from '../screens/History';
import Home from '../screens/Home';
import Send from '../screens/Send';
import Request from '../screens/Request';
import AccountSettings from '../screens/AccountSettings';
import WebViewScreen from '../screens/WebViewScreen';
// styles
import styles from '../styles/common';

const Stack = createStackNavigator();

const AppNavigator = () => {
  return (
    <AccountContextProvider>
      <PaperProvider theme={DefaultTheme}>
        <NavigationContainer>
          <Stack.Navigator initialRouteName="Landing">
            <Stack.Screen
              name="Landing"
              component={Landing}
              options={{
                headerShown: false,
              }}
            />
            <Stack.Screen
              name="WebViewScreen"
              component={WebViewScreen}
              options={{
                title: 'Regen.Cards',
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
              name="InstantAccept"
              component={InstantAccept}
              options={{
                title: 'Accept Payment',
              }}
            />
            <Stack.Screen
              name="InstantAcceptLogin"
              component={InstantAcceptLogin}
              options={{
                title: 'Configure Account',
              }}
            />
            <Stack.Screen
              name="InstantAcceptAccount"
              component={InstantAcceptAccount}
              options={{
                title: 'Account Details',
              }}
            />
            <Stack.Screen
              name="InstantAcceptTransfer"
              component={InstantAcceptTransfer}
              options={{
                title: 'Transfer Assets',
              }}
            />
            <Stack.Screen
              name="InstantAccountSell"
              component={InstantAccountSell}
              options={{
                title: 'Sell Assets',
              }}
            />
            <Stack.Screen
              name="History"
              component={History}
              options={{
                title: 'Transaction History',
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
              name="Send"
              component={Send}
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
      </PaperProvider>
    </AccountContextProvider>
  );
};

export default AppNavigator;
