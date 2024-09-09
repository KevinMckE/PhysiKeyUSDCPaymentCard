// libraries
import React from 'react';
import { View, ImageBackground } from 'react-native';
// components
import Text from '../components/CustomText'
import CustomButton from '../components/CustomButton';

const AccountSettings = ({ navigation }) => {
  return (
    <>
      <ImageBackground
        source={require('../assets/background.png')}
        style={{ flex: 1, width: '100%', height: '100%' }}
      >
        <View style={{ flex: 8, margin: 16 }}>
          <Text size={"large"} color={"#000000"} text={'This page is currently under construction.'} style={{ textAlign: 'center' }} />
          <CustomButton text='Go Back' type='primary' size='large' onPress={() => {
            navigation.navigate('Home');
          }} />
        </View>
      </ImageBackground>
    </>
  );
}

export default AccountSettings;
