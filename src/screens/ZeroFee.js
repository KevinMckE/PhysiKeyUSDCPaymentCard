// libraries
import React, { useContext } from 'react';
import { View, Image, Pressable } from 'react-native';
import { Text, Card } from 'react-native-paper';
import { trigger } from 'react-native-haptic-feedback';
import Clipboard from '@react-native-clipboard/clipboard';
// context
import { AccountContext } from '../contexts/AccountContext';
// components
import CustomButton from '../components/CustomButton';
// styles
import styles from '../styles/common';

const ZeroFee = ({ navigation }) => {
  const { publicKey } = useContext(AccountContext);

  const handleCopyToClipboard = () => {
    trigger("impactLight", { enableVibrateFallback: true, ignoreAndroidSystemSettings: false });
    Clipboard.setString(publicKey);
  };

  return (
    <>
      <View style={styles.container}>
        <View style={styles.topContainer}>
          <Text style={styles.textMargin} variant='titleLarge'>Use an external tool to transfer funds.</Text>
        </View>
        <View style={styles.inputContainer}>
          <Text style={styles.textMargin} variant='titleMedium'>Copy your Optimism Ethereum address to paste in your wallet. Be sure you send on the Optimism network.</Text>
          <Text style={styles.textMargin} variant='titleMedium'> If you are unsure about this do not proceed. We cannot recover funds.</Text>
        </View>
        <Pressable onPress={handleCopyToClipboard}>
          <Card style={styles.card}>
            <View style={styles.keyContent}>
              <Text style={styles.accountText} numberOfLines={3} ellipsizeMode="tail">
                Account (Optimism network): {publicKey}
              </Text>
              <Image
                source={require('../assets/icons/copy_icon.png')}
                style={styles.copyImage}
              />
            </View>
          </Card>
        </Pressable>
        <View style={styles.bottomContainer}>
          <CustomButton text='Go Back' type='primary' size='large' onPress={() => { navigation.goBack(); }} />
        </View>
      </View>
    </>
  );
};

export default ZeroFee;
