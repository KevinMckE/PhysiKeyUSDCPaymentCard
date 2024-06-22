import React, { useState, useEffect } from 'react';
import { Image, ActivityIndicator, View } from 'react-native';
import { createMaterialBottomTabNavigator } from 'react-native-paper/react-navigation';
import { useIsFocused } from '@react-navigation/native';

import { getBaseUSDCActivity } from '../functions/base/getBaseUSDCActivity';
import { getUSDCBalance } from '../functions/base/getBaseUSDC';

import Account from './Account';
import Fund from './Fund';
import History from './History';
import Contacts from './Contacts';
import styles from '../styles/common';
import CoinbaseOnRamp from '../components/CoinbaseOnramp';

const Tab = createMaterialBottomTabNavigator();

const Home = ({ route, navigation }) => {
  const { label, account, publicKey } = route.params;
  const [balance, setBalance] = useState('');
  const [activity, setActivity] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const isFocused = useIsFocused();

  const fetchBalance = async () => {
    try {
      let fetchedActivity = await getBaseUSDCActivity(publicKey);
      setActivity(fetchedActivity);
      let fetchedBalance = await getUSDCBalance(publicKey);
      if (fetchedBalance === '0.') {
        fetchedBalance = '0.0';
      }
      setBalance(fetchedBalance);
      setIsLoading(false);
    } catch (error) {
      console.log('Cannot complete fetchBalance: ', error);
    }
  };

  useEffect(() => {
    let isMounted = true;
    if (isFocused) {
      fetchBalance();
    }
    return () => {
      isMounted = false;
    };
  }, [isFocused, navigation]);

  if (isLoading) {
    return (
      <View style={[styles.container, styles.loadingContainer]}>
        <ActivityIndicator size="large" color="#7FA324" />
      </View>
    );
  }

  return (
    <Tab.Navigator
      theme={{ colors: { secondaryContainer: '#7FA324' } }}
      initialRouteName="Account"
      activeColor="#000000"
      inactiveColor="#808080"
      barStyle={{ backgroundColor: '#ffffff' }}
    >
      <Tab.Screen
        name="Account"
        component={Account}
        initialParams={{ label, publicKey, balance, activity }}
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
        initialParams={{ label, publicKey, balance, activity }}
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
        name="Fund"
        component={CoinbaseOnRamp}
        initialParams={{ publicKey }}
        options={{
          tabBarLabel: 'Fund',
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
