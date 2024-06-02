import React, { useState, useEffect } from 'react';
import { Image, Text } from 'react-native';
import { createMaterialBottomTabNavigator } from 'react-native-paper/react-navigation';
import { useIsFocused } from '@react-navigation/native';
import { getBaseUSDCActivity } from '../functions/base/getBaseUSDCActivity';
import { getUSDCBalance } from '../functions/base/getBaseUSDC';
import styles from '../styles/common';
import account from '../screens/Account';
import buy from '../screens/Buy';
import transactions from './History';
const Tab = createMaterialBottomTabNavigator();

const Home = ({ route }) => {
  const { label, publicKey } = route.params;
  const [balance, setBalance] = useState('');
  const [activity, setActivity] = useState([]);
  const [isLoading, setIsLoading] = useState(true); // Add loading state
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
    return <Text>OOF</Text>; 
  }

  return (
    <>
      <Tab.Navigator
        theme={{colors: {secondaryContainer: '#7FA324'}}} // <---- Here
        initialRouteName="Home"
        activeColor="#000000"
        inactiveColor="#808080"
        barStyle={{ backgroundColor: '#ffffff' }}
      >
        <Tab.Screen
          name="Account"
          component={account}
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
          name="Contacts"
          component={buy}
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
          name="History"
          component={transactions}
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
          name="Settings"
          component={buy}
          options={{
            tabBarLabel: 'Settings',
            tabBarIcon: ({ focused }) => (
              <Image
                source={require('../assets/icons/user_setting.png')}
                style={[styles.tabBarIcon, focused ? null : styles.inactiveTabIcon]}
              />
            )
          }}
        />

      </Tab.Navigator>
    </>
  );
}

export default Home;
