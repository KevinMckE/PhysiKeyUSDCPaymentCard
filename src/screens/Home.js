import React, { useState, useEffect } from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

import account from '../screens/Account';
import buy from '../screens/Buy';
const Tab = createBottomTabNavigator();

const Home = ({ route }) => {
 const { label, publicKey } = route.params;

  return (
    <>
      <Tab.Navigator>
        <Tab.Screen name="Home" component={account} initialParams={{ label, publicKey }} />
        <Tab.Screen name="Settings" component={buy} />
      </Tab.Navigator>
    </>
  );
}

export default Home;
