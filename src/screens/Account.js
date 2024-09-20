// libraries
import React, { useContext, useState, useCallback } from 'react';
import { View, Pressable, ImageBackground, RefreshControl, ScrollView } from 'react-native';
import Clipboard from '@react-native-clipboard/clipboard';
import { trigger } from 'react-native-haptic-feedback';
// components
import AccountCard from '../components/AccountCard';
import CurrencyCard from '../components/CurrencyCard';
import RecentTransactionList from '../components/TransactionList';
import Text from '../components/CustomText';
// context
import { AccountContext } from '../contexts/AccountContext';
// styles
import styles from '../styles/common';

const Account = ({ navigation }) => {
  const [refreshing, setRefreshing] = useState(false);
  const { activity, publicKey, accountName, balance, setNewActivity, setNewBalance, isCard } = useContext(AccountContext);

  const onRefresh = useCallback(() => {
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
    <ScrollView refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}>
      <ImageBackground
        source={require('../assets/background.png')}
        style={{ flex: 1, width: '100%', height: '100%' }}
      >
        <View style={styles.textContainer}>
          <Text size={"small"} color={"#000000"} text={"Account"} />
          <Pressable
            onPress={() => {
              navigation.navigate('AccountSettings', { navigation });
            }}
          >
            <Text size={"small"} color={"#000000"} text={"View Details >"} />
          </Pressable>
        </View>
        <Pressable onPress={handleCopyToClipboard}>
          <AccountCard
            publicKey={publicKey}
            accountName={accountName}
          />
        </Pressable>
        <CurrencyCard
          title="Balance"
          subtitle="*USDC on Base network"
          amount={balance}
          imageSource={require('../assets/logos/usdc_base_logo.png')}
          navigation={navigation}
          publicKey={publicKey}
        />
        <View style={styles.textContainer}>
          <Text size={"small"} color={"#000000"} text={"Recent Transactions"} />
          <Pressable
            onPress={() => {
              navigation.navigate('History');
            }}
          >
            <Text size={"small"} color={"#000000"} text={"View All >"} />
          </Pressable>
        </View>
        <RecentTransactionList
          navigation={navigation}
          data={activity}
          limit={3}
        />
        <View style={{ height: 80 }}/>
      </ImageBackground>
    </ScrollView>
  );
}

export default Account;
