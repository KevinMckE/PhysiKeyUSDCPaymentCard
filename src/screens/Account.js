import React, { useState, useEffect } from 'react';
import { View, Image, Pressable } from 'react-native';
import Clipboard from '@react-native-clipboard/clipboard';
import { useIsFocused } from '@react-navigation/native';
import { Text, Card } from 'react-native-paper';
import { getBaseUSDCActivity } from '../functions/getBaseUSDCActivity';
import { getUSDCBalance } from '../functions/getBaseUSDC';
import CurrencyCard from '../components/CurrencyCard';
import CustomButton from '../components/CustomButton';
import styles from '../styles/common';
import { trigger } from 'react-native-haptic-feedback';

const Account = ({ navigation, route }) => {
  const [balance, setBalance] = useState('');
  const { label, publicKey } = route.params;
  const truncatedKey = `${publicKey.slice(0, 7)}...${publicKey.slice(-5)}`;
  const isFocused = useIsFocused();

  useEffect(() => {
    let isMounted = true;
    const fetchBalance = async () => {
      try {
        getBaseUSDCActivity('0x179F961d5A0cC6FCB32e321d77121D502Fe3abF4');
        let fetchedBalance = await getUSDCBalance('0x179F961d5A0cC6FCB32e321d77121D502Fe3abF4');
        console.log(fetchedBalance)
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
  }, [publicKey, isFocused]);

  const handleCopyToClipboard = () => {
    trigger("impactLight", { enableVibrateFallback: true, ignoreAndroidSystemSettings: false });
    Clipboard.setString(publicKey);
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
          imageSource={require('../assets/usdc_logo.png')}
          navigation={navigation}
          publicKey={publicKey}
        />
      </View>
      <View style={styles.mainButtons}>
        <CustomButton text='Send' type='primary' size='small' onPress={() => { navigation.navigate('Pay', { publicKey }); }} />
        <CustomButton text='Request' type='primary' size='small' onPress={() => { navigation.navigate('Request', { publicKey }); }} />
      </View>
    </>
  );
}

export default Account;
