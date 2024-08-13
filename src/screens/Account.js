// libraries
import React, { useContext, useState } from 'react';
import { View, Image, Pressable, ImageBackground, RefreshControl, ScrollView } from 'react-native';
import { Text, Card, List } from 'react-native-paper';
import Clipboard from '@react-native-clipboard/clipboard';
import { trigger } from 'react-native-haptic-feedback';
// components
import CurrencyCard from '../components/CurrencyCard';
import RecentTransactionList from '../components/TransactionList';
import CustomButton from '../components/CustomButton';
// context
import { AccountContext } from '../contexts/AccountContext';
// styles
import styles from '../styles/common';

const Account = ({ navigation }) => {
  const [refreshing, setRefreshing] = useState(false);
  const { activity, publicKey, accountName, balance, setNewActivity, setNewBalance } = useContext(AccountContext);
  const truncatedKey = `${publicKey.slice(0, 7)}...${publicKey.slice(-5)}`;

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
        <View style={styles.textContainer}>
          <Text>Account (Optimism network)</Text>
          <Text onPress={() => { navigation.navigate('AccountSettings', { navigation }) }}>{`View All >`}</Text>
        </View>
        <Pressable onPress={handleCopyToClipboard}>
          <Card style={styles.card}>
            <View style={styles.keyContent}>
              <List.Item
                title={accountName}
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
          subtitle="*USDC on Optimism network"
          amount={balance}
          imageSource={require('../assets/logos/optimism_logo.png')}
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
          <CustomButton text='Send' type='primary' size='small' onPress={() => { navigation.navigate('Send') }}/>
          <CustomButton text='Request' type='primary' size='small' onPress={() => { navigation.navigate('Request') }}/>
        </View>
      </ImageBackground>
    </ScrollView>
  );
}

export default Account;
