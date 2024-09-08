// libraries
import React, { useContext } from 'react';
import { Image, ActivityIndicator, View, StyleSheet } from 'react-native';
import { createMaterialBottomTabNavigator } from 'react-native-paper/react-navigation';
// components
import CustomButton from '../components/CustomButton';
// context
import { AccountContext } from '../contexts/AccountContext';
// pages
import Account from './Account';
import Transfer from './Transfer';
import History from './History';
import styles from '../styles/common';
import LoadingOverlay from '../components/LoadingOverlay';

const Tab = createMaterialBottomTabNavigator();

const Home = ({ navigation }) => {
  const { loading, activity, accountName } = useContext(AccountContext);

  return (
    <View style={styles.container}>
      <LoadingOverlay loading={loading} />

      <Tab.Navigator
        theme={{ colors: { secondaryContainer: '#94BE43' } }}
        initialRouteName="Account"
        activeColor="#000000"
        inactiveColor="#808080"
        barStyle={{ backgroundColor: '#ffffff', height: 80 }}
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
          name="Load Card"
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

      <View style={styles.homeButtons}>
        {accountName === "Default" ? (
          <CustomButton text="Request" type="primary" size="Large" onPress={() => { navigation.navigate('InstantAccept'); }} />
        ) : (
          <>
            <CustomButton text="Send" type="primary" size="small" onPress={() => { navigation.navigate('Send'); }} />
            <CustomButton text="Request" type="primary" size="small" onPress={() => {navigation.navigate('Request'); }} />
          </>
        )}
      </View>
    </View>
    
  );
};


export default Home;
