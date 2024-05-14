import React from 'react';
import { Image } from 'react-native';
import { createMaterialBottomTabNavigator } from 'react-native-paper/react-navigation';
import styles from '../styles/common';
import account from '../screens/Account';
import buy from '../screens/Buy';
const Tab = createMaterialBottomTabNavigator();

const Home = ({ route }) => {
  const { label, publicKey } = route.params;

  return (
    <>
      <Tab.Navigator
        initialRouteName="Home"
        activeColor="#000000"
        inactiveColor="#808080"
        barStyle={{ backgroundColor: '#ffffff' }}
      >
        <Tab.Screen
          name="Home"
          component={account}
          initialParams={{ label, publicKey }}
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
          component={buy}
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
                source={require('../assets/icons/settings.png')}
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
