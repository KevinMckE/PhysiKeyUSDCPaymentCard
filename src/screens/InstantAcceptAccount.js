import React, { useContext, useEffect } from 'react';
import { View, Image, Pressable, ImageBackground } from 'react-native';
import { Text, Card } from 'react-native-paper';
import { trigger } from 'react-native-haptic-feedback';
import Clipboard from '@react-native-clipboard/clipboard';
// context
import { AccountContext } from '../contexts/AccountContext';
// components
import CurrencyCard from '../components/CurrencyCard';
import CustomButton from '../components/CustomButton';
//

import styles from '../styles/common';

const InstantAcceptAccount = ({ navigation }) => {
  const { publicKey, balance } = useContext(AccountContext);

  const handleCopyToClipboard = () => {
    trigger("impactLight", { enableVibrateFallback: true, ignoreAndroidSystemSettings: false });
    Clipboard.setString(publicKey);
  };

  return (
    <>
      <ImageBackground
        source={require('../assets/background.png')}
        style={{ flex: 1, width: '100%', height: '100%' }}
      >
        <View style={styles.container}>
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
          <CurrencyCard
            title="Balance"
            subtitle={balance}
            imageSource={require('../assets/logos/usdc_logo.png')}
            navigation={navigation}
            publicKey={publicKey}
          />
          <View style={{ justifyContent: 'center', alignItems: 'center', padding: 20 }}>
            <Text>We recommend only keeping a small amount of money in this wallet.  Please utilize external tools to transfer your assets to a more secure place.</Text>
            <CustomButton text='Transfer' type='primary' size='large' onPress={() => { navigation.navigate('InstantAcceptTransfer') }} />
            <CustomButton text='Cashout' type='primary' size='large' onPress={() => { navigation.navigate('InstantAccountSell') }} />
          </View >
        </View>

        <View style={styles.bottomContainer}>
          <CustomButton text='Go Back' type='secondary' size='large' onPress={() => { navigation.navigate('InstantAccept') }} />
        </View>
      </ImageBackground>
    </>
  );
}

export default InstantAcceptAccount;