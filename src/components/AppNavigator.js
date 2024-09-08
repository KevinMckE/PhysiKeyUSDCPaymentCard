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
import { TouchableOpacity, Image, Keyboard } from 'react-native';
import { Provider as PaperProvider, DefaultTheme } from 'react-native-paper';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
// providers
import AccountContextProvider from '../contexts/AccountContext';
// screens
import Landing from '../screens/Landing';
import Login from '../screens/Login';
import AddAccount from '../screens/AddAccount';
import InstantAccept from '../screens/InstantAccept/InstantAccept';
import InstantAcceptLogin from '../screens/InstantAccept/InstantAcceptLogin';
import InstantAcceptTransfer from '../screens/InstantAccept/InstantAcceptTransfer';
import InstantAccountSell from '../screens/InstantAccept/InstantAcceptSell';
import History from '../screens/History';
import Home from '../screens/Home';
import Send from '../screens/Send';
import Request from '../screens/Request';
import AccountSettings from '../screens/AccountSettings';
import WebViewScreen from '../screens/WebViewScreen';

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
                title: 'Regen Card',
              }}
            />
            <Stack.Screen
              name="Login"
              component={Login}
              options={({ navigation }) => ({
                title: 'Login',
                headerLeft: () => (
                  <TouchableOpacity onPress={() => {
                    navigation.goBack();
                  }}>
                    <Image source={require('../assets/icons/back.png')} style={{ width: 24, height: 24, marginHorizontal: 16 }} />
                  </TouchableOpacity>
                ),
              })}
            />
            <Stack.Screen
              name="AddAccount"
              component={AddAccount}
              options={({ navigation }) => ({
                title: 'Add Account',
                headerLeft: () => (
                  <TouchableOpacity onPress={() => {
                    navigation.goBack();
                  }}>
                    <Image source={require('../assets/icons/back.png')} style={{ width: 24, height: 24, marginHorizontal: 16 }} />
                  </TouchableOpacity>
                ),
              })}
            />
            <Stack.Screen
              name="InstantAccept"
              component={InstantAccept}
              options={({ navigation }) => ({
                title: 'Accept Payment',
                headerLeft: () => (
                  <TouchableOpacity onPress={() => {
                    Keyboard.dismiss();
                    navigation.goBack();
                  }}>
                    <Image source={require('../assets/icons/back.png')} style={{ width: 24, height: 24, marginHorizontal: 16 }} />
                  </TouchableOpacity>
                ),
              })}
            />
            <Stack.Screen
              name="InstantAcceptLogin"
              component={InstantAcceptLogin}
              options={({ navigation }) => ({
                title: 'Configure Account',
                headerLeft: () => (
                  <TouchableOpacity onPress={() => {
                    navigation.goBack();
                  }}>
                    <Image source={require('../assets/icons/back.png')} style={{ width: 24, height: 24, marginHorizontal: 16 }} />
                  </TouchableOpacity>
                ),
              })}
            />
            <Stack.Screen
              name="InstantAcceptTransfer"
              component={InstantAcceptTransfer}
              options={({ navigation }) => ({
                title: 'Transfer Assets',
                headerLeft: () => (
                  <TouchableOpacity onPress={() => {
                    navigation.goBack();
                  }}>
                    <Image source={require('../assets/icons/back.png')} style={{ width: 24, height: 24, marginHorizontal: 16 }} />
                  </TouchableOpacity>
                ),
              })}
            />
            <Stack.Screen
              name="InstantAccountSell"
              component={InstantAccountSell}
              options={({ navigation }) => ({
                title: 'Sell Assets',
                headerLeft: () => (
                  <TouchableOpacity onPress={() => {
                    navigation.goBack();
                  }}>
                    <Image source={require('../assets/icons/back.png')} style={{ width: 24, height: 24, marginHorizontal: 16 }} />
                  </TouchableOpacity>
                ),
              })}
            />
            <Stack.Screen
              name="History"
              component={History}
              options={({ navigation }) => ({
                title: 'Transaction History',
                headerLeft: () => (
                  <TouchableOpacity onPress={() => {
                    navigation.goBack();
                  }}>
                    <Image source={require('../assets/icons/back.png')} style={{ width: 24, height: 24, marginHorizontal: 16 }} />
                  </TouchableOpacity>
                ),
              })}
            />
            <Stack.Screen
              name="Home"
              component={Home}
              options={({ navigation }) => ({
                title: 'Your Account',
                headerLeft: () => (
                  <TouchableOpacity onPress={() => {
                    navigation.goBack();
                  }}>
                    <Image source={require('../assets/icons/back.png')} style={{ width: 24, height: 24, marginHorizontal: 16 }} />
                  </TouchableOpacity>
                ),
              })}
            />
            <Stack.Screen
              name="Send"
              component={Send}
              options={({ navigation }) => ({
                title: 'Send USDC',
                headerLeft: () => (
                  <TouchableOpacity onPress={() => {
                    navigation.goBack();
                  }}>
                    <Image source={require('../assets/icons/back.png')} style={{ width: 24, height: 24, marginHorizontal: 16 }} />
                  </TouchableOpacity>
                ),
              })}
            />
            <Stack.Screen
              name="Request"
              component={Request}
              options={({ navigation }) => ({
                title: 'Request USDC',
                headerLeft: () => (
                  <TouchableOpacity onPress={() => {
                    navigation.goBack();
                  }}>
                    <Image source={require('../assets/icons/back.png')} style={{ width: 24, height: 24, marginHorizontal: 16 }} />
                  </TouchableOpacity>
                ),
              })}
            />
            <Stack.Screen
              name="AccountSettings"
              component={AccountSettings}
              options={({ navigation }) => ({
                title: 'Account',
                headerLeft: () => (
                  <TouchableOpacity onPress={() => {
                    navigation.goBack();
                  }}>
                    <Image source={require('../assets/icons/back.png')} style={{ width: 24, height: 24, marginHorizontal: 16 }} />
                  </TouchableOpacity>
                ),
              })}
            />
          </Stack.Navigator>
        </NavigationContainer>
      </PaperProvider>
    </AccountContextProvider>
  );
};

export default AppNavigator;
