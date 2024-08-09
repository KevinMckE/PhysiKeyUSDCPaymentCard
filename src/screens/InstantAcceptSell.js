// libraries
import React from 'react';
import { View, ImageBackground } from 'react-native';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
// components
import ZeroFee from './ZeroFee';

const Tab = createMaterialTopTabNavigator();

const InstantAccountSell = () => {
  return (
    <>
      <ImageBackground
        source={require('../assets/background.png')}
        style={{ flex: 1, width: '100%', height: '100%' }}
      >
        <ZeroFee navigation={navigation} />
      </ImageBackground>
    </>
  );
};

export default InstantAccountSell;
