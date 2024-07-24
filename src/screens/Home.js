import React, { useState, useEffect } from 'react';
import { Image, ActivityIndicator, View } from 'react-native';
import { createMaterialBottomTabNavigator } from 'react-native-paper/react-navigation';
import { useIsFocused } from '@react-navigation/native';
//
import { getBaseUSDCActivity } from '../functions/base/getBaseUSDCActivity';
import { getUSDCBalance } from '../functions/base/getBaseUSDC';
//
import Account from './Account';
import Transfer from './Transfer';
import History from './History';
import Contacts from './Contacts';
import styles from '../styles/common';

const Tab = createMaterialBottomTabNavigator();

const Home = ({ route, navigation }) => {
  const { label, publicKey } = route.params;
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
    if (isFocused) {
      fetchBalance();
    }
    fetchBalance();
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
      theme={{ colors: { secondaryContainer: '#94BE43' } }}
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
        name="Transfer"
        component={Transfer}
        initialParams={{ label, publicKey, balance, activity }}
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
