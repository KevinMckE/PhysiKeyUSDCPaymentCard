import React from 'react';
import { View } from 'react-native';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import CoinbaseOnRamp from '../components/CoinbaseOnramp';
import MoonPay from '../components/MoonPay';

const Tab = createMaterialTopTabNavigator();

const Fund = ({ publicKey }) => {
  return (
    <View style={{ flex: 1 }}>
      <Tab.Navigator
        screenOptions={{
          tabBarIndicatorStyle: { backgroundColor: '#7FA324' },
        }}
      >
        <Tab.Screen name="Coinbase">
          {() => <CoinbaseOnRamp publicKey={publicKey} />}
        </Tab.Screen>
        <Tab.Screen name="Moonpay" component={MoonPay} />
      </Tab.Navigator>
    </View>
  );
};

export default Fund;
