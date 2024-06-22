import React from 'react';
import { View, ImageBackground } from 'react-native';
import { Text } from 'react-native-paper';
import styles from '../styles/common';

const AccountSettings = () => {
  return (
    <>
      <ImageBackground
        source={require('../assets/regen_card_background.png')}
        style={{ flex: 1, width: '100%', height: '100%' }}
      >
        <View style={styles.textContainer}>
          <Text>This page is under construction, sorry!</Text>
        </View>
      </ImageBackground>
    </>
  );
}

export default AccountSettings;
