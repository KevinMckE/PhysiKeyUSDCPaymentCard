import React, { useState, useEffect } from 'react';
import { Image, Text } from 'react-native';
import { createMaterialBottomTabNavigator } from 'react-native-paper/react-navigation';
import { useIsFocused } from '@react-navigation/native';
import { getBaseUSDCActivity } from '../functions/base/getBaseUSDCActivity';
import { getUSDCBalance } from '../functions/base/getBaseUSDC';
import Account from './Account';
import Fund from './Fund';
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

  useEffect(() => {
    let isMounted = true;
    const fetchBalance = async () => {
      try {
        let fetchedActivity = await getBaseUSDCActivity(publicKey);
        setActivity(fetchedActivity);
        let fetchedBalance = await getUSDCBalance(publicKey);
        if (fetchedBalance === '0.') {
          fetchedBalance = '0.0';
        }
        if (isMounted && isFocused) {
          setBalance(fetchedBalance);
          setIsLoading(false);
        }
      } catch (error) {
        console.log('Cannot complete fetchBalance: ', error);
      }
    };
    if (isFocused) {
      fetchBalance();
    }
    return () => {
      isMounted = false;
    };
  }, [publicKey, isFocused]);

  if (isLoading) {
    return <Text>Loading...</Text>;
  }

  return (
    <Tab.Navigator
      theme={{ colors: { secondaryContainer: '#7FA324' } }}
      initialRouteName="Home"
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
        component={Fund}
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
