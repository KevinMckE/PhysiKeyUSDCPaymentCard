import React, { useState, useEffect } from 'react';
import { View, Image, Pressable } from 'react-native';
import Clipboard from '@react-native-clipboard/clipboard';
import { useIsFocused } from '@react-navigation/native';
import { Text, Card } from 'react-native-paper';
import { getBaseUSDCActivity } from '../functions/getBaseUSDCActivity';
import { getUSDCBalance } from '../functions/getBaseUSDC';
import CurrencyCard from '../components/CurrencyCard';
import TransactionList from '../components/TransactionList';
import CustomButton from '../components/CustomButton';
import styles from '../styles/common';
import { trigger } from 'react-native-haptic-feedback';

const Account = ({ navigation, route }) => {
  const [balance, setBalance] = useState('');
  const [activity, setActivity] = useState([{"age": '2024-05-19T04:30:04.000Z', "hash": "0x7f22bfca6876d2b4e39d250fa3fef51a1f8c92e5d1a17699180ea542b4fa219c", "method": "IN", "value": '.99999999999999'}, {"age": '2024-05-28T04:24:26.000Z', "hash": "0xdbcc35db7832d8a563cfa16e59c3b79518d051b4550f1f72c1902f3587b7184e", "method": "IN", "value": '9.99999999999999'}]);
  const { label, publicKey } = route.params;
  const truncatedKey = `${publicKey.slice(0, 7)}...${publicKey.slice(-5)}`;
  const isFocused = useIsFocused();

  useEffect(() => {
    console.log(publicKey)
    let isMounted = true;
    const fetchBalance = async () => {
      try {
        let fetchedActivity = await getBaseUSDCActivity(publicKey);
        console.log(fetchedActivity[0]);
        setActivity(fetchedActivity);
        let fetchedBalance = await getUSDCBalance(publicKey);
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
        <TransactionList data={activity}  />

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
