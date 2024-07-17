import React from 'react';
import { View, Image, Pressable } from 'react-native';
import { Text, Card } from 'react-native-paper';
import { trigger } from 'react-native-haptic-feedback';
import Clipboard from '@react-native-clipboard/clipboard';

import CustomButton from '../components/CustomButton';
//

import styles from '../styles/common';

const InstantAcceptAccount = ({ navigation, route }) => {
  const { publicKey } = route.params;

  const handleCopyToClipboard = () => {
    trigger("impactLight", { enableVibrateFallback: true, ignoreAndroidSystemSettings: false });
    Clipboard.setString(publicKey);
  };

  return (
    <>
      <View style={styles.container}>
        <View style={styles.topContainer}>
          <Text variant='titleLarge'>This should be used a temporary wallet.</Text>
        </View>

      </View >
      <View style={styles.inputContainer}>
        <Text>We recommend only keeping a small amount of money in this wallet.  Please utilize external tools to transfer your assets to a more secure place.</Text>
        
      </View>
      <Pressable onPress={handleCopyToClipboard}>
          <Card style={styles.card}>
            <View style={styles.keyContent}>
              <Text>Account Details: {publicKey}</Text>
              <Image
                source={require('../assets/icons/copy_icon.png')}
                style={styles.copyImage}
              />
            </View>
          </Card>
        </Pressable>
      <View style={styles.bottomContainer}>
        <CustomButton text='Go Back' type='primary' size='large' onPress={() => { navigation.navigate('InstantAccept') }} />
        <CustomButton text='Transfer Assets' type='secondary' size='large' onPress={() => { navigation.navigate('InstantAcceptTransfer', { publicKey }) }} />
      </View>
    </>
  );
}

export default InstantAcceptAccount;