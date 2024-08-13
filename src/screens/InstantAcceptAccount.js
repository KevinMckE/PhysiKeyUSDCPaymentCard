// libraries
import React, { useContext, useState } from 'react';
import { View, Image, Pressable, ImageBackground, RefreshControl, ScrollView } from 'react-native';
import { Text, Card } from 'react-native-paper';
import { trigger } from 'react-native-haptic-feedback';
import Clipboard from '@react-native-clipboard/clipboard';
// context
import { AccountContext } from '../contexts/AccountContext';
// components
import CurrencyCard from '../components/CurrencyCard';
import CustomButton from '../components/CustomButton';
// styles
import styles from '../styles/common';

const InstantAcceptAccount = ({ navigation }) => {
  const [refreshing, setRefreshing] = useState(false);
  const { publicKey, balance, setNewActivity, setNewBalance } = useContext(AccountContext);

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    setNewActivity(publicKey);
    setNewBalance(publicKey);
    setTimeout(() => {
      setRefreshing(false);
    }, 2000);
  }, []);

  const handleCopyToClipboard = () => {
    trigger("impactLight", { enableVibrateFallback: true, ignoreAndroidSystemSettings: false });
    Clipboard.setString(publicKey);
  };

  return (
    <ScrollView  refreshControl={ <RefreshControl refreshing={refreshing} onRefresh={onRefresh}/>}>
      <ImageBackground
        source={require('../assets/background.png')}
        style={{ flex: 1, width: '100%', height: '100%' }}
      >
        <View style={styles.container}>
          <Pressable onPress={handleCopyToClipboard}>
            <Card style={styles.card}>
              <View style={styles.keyContent}>
                <Text>Account (Optimism network): {publicKey.slice(0, 7)}...{publicKey.slice(-5)}</Text>
                <Image
                  source={require('../assets/icons/copy_icon.png')}
                  style={styles.copyImage}
                />
              </View>
            </Card>
          </Pressable>
          <CurrencyCard
            title="Balance"
            subtitle="*USDC on Optimism network"
            amount={balance}
            imageSource={require('../assets/logos/optimism_logo.png')}
            navigation={navigation}
            publicKey={publicKey}
          />
          <View style={{ justifyContent: 'center', alignItems: 'center' }}>
            <CustomButton text='Transactions' type='primary' size='large' onPress={() => { setNewActivity(publicKey); navigation.navigate('History'); }} />
          </View>
          <View style={{ justifyContent: 'center', alignItems: 'center', padding: 20 }}>
            <Text>For best security we recommend only keeping a small amount of money in this wallet. Please consider transferring your assets if holding more than $500.</Text>
          </View>
          <View style={{ justifyContent: 'center', alignItems: 'center', padding: 20, }}>
            <CustomButton text='Transfer' type='primary' size='large' onPress={() => { navigation.navigate('InstantAcceptTransfer') }} />
            <CustomButton text='Cashout' type='primary' size='large' onPress={() => { navigation.navigate('InstantAccountSell') }} />
          </View >
          <View style={styles.bottomContainer}>
            <CustomButton text='Go Back' type='secondary' size='large' onPress={() => { navigation.navigate('InstantAccept') }} />
          </View>
        </View>
      </ImageBackground>
    </ScrollView>
  );
}

export default InstantAcceptAccount;