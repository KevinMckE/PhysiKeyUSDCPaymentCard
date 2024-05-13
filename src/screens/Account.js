import React, { useState, useEffect } from 'react';
import { View, Image, Pressable } from 'react-native';
import Clipboard from '@react-native-clipboard/clipboard';
import { useIsFocused } from '@react-navigation/native';
import { Text, Card } from 'react-native-paper';
import { getOptimismBalance } from '../functions/getOptimismBalance';
import CurrencyCard from '../components/CurrencyCard';
import CustomSnackbar from '../components/CustomSnackbar';
import CustomButton from '../components/CustomButton';
import styles from '../styles/common';
import { trigger } from 'react-native-haptic-feedback';

const Account = ({ navigation, route }) => {
  const [balance, setBalance] = useState('');
  const { label, publicKey, snackbarMessage } = route.params;
  const truncatedKey = `${publicKey.slice(0, 7)}...${publicKey.slice(-5)}`;
  const [snackbarVisible, setSnackbarVisible] = useState(false);
  const [snackbarText, setSnackbarText] = useState('');
  const [isSuccess, setSuccess] = useState(false);

  const isFocused = useIsFocused();

  const options = {
    enableVibrateFallback: true,
    ignoreAndroidSystemSettings: false,
  };

  useEffect(() => {
    let isMounted = true;
    const fetchBalance = async () => {
      handleSnackbar(true, snackbarMessage);
      try {
        let fetchedBalance = await getOptimismBalance(publicKey);
        if (fetchedBalance === '0.') {
          fetchedBalance = '0.0';
        }
        if (isMounted && isFocused) {
          setBalance(fetchedBalance);
        }
      } catch (error) {
        console.log('Cannot complete fetchBalance: ', error);
      }
    };
    if (isFocused) {
      fetchBalance();
    }
    return () => {
      isMounted = false;
    };
  }, [publicKey, snackbarMessage, isFocused]);

  const handleCopyToClipboard = () => {
    trigger("impactLight", options);
    Clipboard.setString(publicKey);
  };

  const handleSnackbar = (success, text) => {
    setSuccess(success);
    setSnackbarText(text);
    setSnackbarVisible(true);
  };

  return (
    <>
      <View style={styles.balanceContainer}>
        <Pressable onPress={handleCopyToClipboard}>
          <Card style={styles.card}>
            <View style={styles.keyContent}>
              <Text variant='titleLarge'>{label}</Text>
              <Text variant='titleLarge'>{truncatedKey}</Text>
              <Image
                source={require('../assets/copy_icon.png')}
                style={styles.copyImage}
              />
            </View>
          </Card>
        </Pressable>
        <CurrencyCard
          title="Balance"
          subtitle={balance}
          imageSource={require('../assets/optimism_logo.png')}
          navigation={navigation}
          publicKey={publicKey}
        />
      </View>
      <CustomButton text='Buy' type='secondary' size='large' onPress={() => { navigation.navigate('Buy'); }} />
      <CustomButton text='Sell' type='secondary' size='large' onPress={() => { navigation.navigate('Sell'); }} />
      <CustomSnackbar
        visible={snackbarVisible}
        onDismiss={() => setSnackbarVisible(false)}
        duration={3000}
        text={snackbarText}
        isSuccess={isSuccess}
      />
    </>
  );
}

export default Account;
