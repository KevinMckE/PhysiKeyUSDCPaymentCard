import React, { useState, useEffect } from 'react';
import { View, Image, Pressable } from 'react-native';
//import Clipboard from '@react-native-clipboard/clipboard';
import { Text, Card, List } from 'react-native-paper';
import CurrencyCard from '../components/CurrencyCard';
import RecentTransactionList from '../components/TransactionList';
import CustomButton from '../components/CustomButton';
import styles from '../styles/common';
import { trigger } from 'react-native-haptic-feedback';

const Account = ({ navigation, route }) => {
  const { label, publicKey, account, balance, activity } = route.params;
  const truncatedKey = `${publicKey.slice(0, 7)}...${publicKey.slice(-5)}`;

  const handleCopyToClipboard = () => {
    console.log('test')
    /** 
    trigger("impactLight", { enableVibrateFallback: true, ignoreAndroidSystemSettings: false });
    Clipboard.setString(publicKey);
    */
  };

  return (
    <>
      <View style={styles.textContainer}>
        <Text>Account Details</Text>
        <Text onPress={() => { navigation.navigate('AccountSettings', { navigation, data }) }}>{`View All >`}</Text>
      </View>
      <Pressable onPress={handleCopyToClipboard}>
        <Card style={styles.card}>
          <View style={styles.keyContent}>
            <List.Item
              title={label}
              description={truncatedKey}
            />
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
      <View style={styles.textContainer}>
        <Text>Recent Activity</Text>
        <Text onPress={() => { navigation.navigate('History') }}>{`View all >`}</Text>
      </View>
      <RecentTransactionList
        navigation={navigation}
        data={activity}
        limit={3}
      />
      <View style={styles.mainButtons}>
        <CustomButton text='Send' type='primary' size='small' onPress={() => { navigation.navigate('Pay', { account }); }} />
        <CustomButton text='Request' type='primary' size='small' onPress={() => { navigation.navigate('Request', { account }); }} />
      </View>
    </>
  );
}

export default Account;
