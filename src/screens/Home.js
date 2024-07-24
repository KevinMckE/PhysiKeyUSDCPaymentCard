// libraries
import React, { useState, useEffect, useContext } from 'react';
import { Image, ActivityIndicator, View } from 'react-native';
import { createMaterialBottomTabNavigator } from 'react-native-paper/react-navigation';
// context
import { AccountContext } from '../contexts/AccountContext';
// functions 
import { getBaseUSDCActivity } from '../functions/base/getBaseUSDCActivity';
// pages
import Account from './Account';
import Transfer from './Transfer';
import History from './History';
import Contacts from './Contacts';
import styles from '../styles/common';

const Tab = createMaterialBottomTabNavigator();

const Home = ({ route, navigation }) => {

  const { loading, activity } = useContext(AccountContext);

  if (loading) {
    return (
      <View style={[styles.container, styles.loadingContainer]}>
        <ActivityIndicator size="large" color="#7FA324" />
      </View>
    );
  }

  return (
    <Tab.Navigator
      theme={{ colors: { secondaryContainer: '#94BE43' } }}
      initialRouteName="Account"
      activeColor="#000000"
      inactiveColor="#808080"
      barStyle={{ backgroundColor: '#ffffff' }}
    >
      <Tab.Screen
        name="Account"
        component={Account}
        options={{
          tabBarLabel: 'Home',
          tabBarIcon: ({ focused }) => (
            <Image
              source={require('../assets/icons/home.png')}
              style={[styles.tabBarIcon, focused ? null : styles.inactiveTabIcon]}
            />
          )
        }}
      />
      <Tab.Screen
        name="History"
        component={History}
        options={{
          tabBarLabel: 'History',
          tabBarIcon: ({ focused }) => (
            <Image
              source={require('../assets/icons/history.png')}
              style={[styles.tabBarIcon, focused ? null : styles.inactiveTabIcon]}
            />
          )
        }}
      />
      <Tab.Screen
        name="Contacts"
        component={Contacts}
        options={{
          tabBarLabel: 'Contacts',
          tabBarIcon: ({ focused }) => (
            <Image
              source={require('../assets/icons/contacts.png')}
              style={[styles.tabBarIcon, focused ? null : styles.inactiveTabIcon]}
            />
          )
        }}
      />
      <Tab.Screen
        name="Transfer"
        component={Transfer}
        initialParams={{ activity }}
        options={{
          tabBarLabel: 'Transfer',
          tabBarIcon: ({ focused }) => (
            <Image
              source={require('../assets/icons/fund.png')}
              style={[styles.tabBarIcon, focused ? null : styles.inactiveTabIcon]}
            />
          )
        }}
      />
    </Tab.Navigator>
  );
}

export default Home;
