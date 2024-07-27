// libraries
import React from 'react';
import { View, ImageBackground } from 'react-native';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
// components
import TransakSell from '../components/TransakSell';
import TransakBuy from '../components/TransakBuy';
import ZeroFee from '../components/ZeroFee';

const Tab = createMaterialTopTabNavigator();

const InstantAccountSell = () => {
  return (
    <>
      <ImageBackground
        source={require('../assets/background.png')}
        style={{ flex: 1, width: '100%', height: '100%' }}
      >
        <View style={{ flex: 1 }}>
          <Tab.Navigator
            screenOptions={{
              tabBarIndicatorStyle: { backgroundColor: '#94BE43' }
            }}
          >
            <Tab.Screen
              name="Offramp"
              component={TransakSell}
            />
            <Tab.Screen
              name="Onramp"
              component={TransakBuy}
            />
            <Tab.Screen
              name="Feeless"
              component={ZeroFee}
            />
          </Tab.Navigator>
        </View>
      </ImageBackground>
    </>
  );
};

export default InstantAccountSell;
