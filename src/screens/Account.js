import React, { useState, useEffect } from 'react';
import { View, Image, Pressable } from 'react-native';
import Clipboard from '@react-native-clipboard/clipboard';
import { Text, Card } from 'react-native-paper';
import CurrencyCard from '../components/CurrencyCard';
import RecentTransactionList from '../components/TransactionList';
import CustomButton from '../components/CustomButton';
import styles from '../styles/common';
import { trigger } from 'react-native-haptic-feedback';

const Account = ({ navigation, route }) => {
  const { label, publicKey, balance, activity } = route.params; // Accessing parameters from route
  const truncatedKey = `${publicKey.slice(0, 7)}...${publicKey.slice(-5)}`;

  const handleCopyToClipboard = () => {
    trigger("impactLight", { enableVibrateFallback: true, ignoreAndroidSystemSettings: false });
    Clipboard.setString(publicKey);
  };

  return (
    <>
      <Pressable onPress={handleCopyToClipboard}>
        <Card style={styles.card}>
          <View style={styles.keyContent}>
            <Text variant='titleLarge'>{label}</Text>
            <Text variant='titleLarge'>{truncatedKey}</Text>
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
      <RecentTransactionList
        navigation={navigation}
        data={activity} 
        limit={3}
      />
      <View style={styles.mainButtons}>
        <CustomButton text='Send' type='primary' size='small' onPress={() => { navigation.navigate('Pay', { publicKey }); }} />
        <CustomButton text='Request' type='primary' size='small' onPress={() => { navigation.navigate('Request', { publicKey }); }} />
      </View>
    </>
  );
}

export default Account;
