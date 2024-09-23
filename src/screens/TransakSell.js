import React, { useContext } from 'react';
import { ScrollView, View } from 'react-native';
import { TransakWebView, Environments, Events } from '@transak/react-native-sdk';
// context
import { AccountContext } from '../contexts/AccountContext';
// env
import { TRANSAK_ENVIRONMENT, TRANSAK_API_KEY } from '@env';

const TransakSell = () => {

  const { publicKey } = useContext(AccountContext);

  const transakConfig = {
    apiKey: TRANSAK_API_KEY,
    environment: Environments[TRANSAK_ENVIRONMENT],
    defaultCryptoCurrency: 'USDC',
    fiatCurrency: 'USD',
    fiatAmount: '', // Leave this blank
    productsAvailed: 'SELL',
    networks: 'BASE',
    cryptoCurrencyList: 'USDC',
    disableCrypto: true,
    disableNetwork: true,
    disableFiat: false, // Enable the fiat amount input
    themeColor: '2E3C49',
    walletAddress: publicKey
  };

  const onTransakEventHandler = (event, data) => {
    switch (event) {
      case Events.ORDER_CREATED:
        console.log(event, data);
        break;

      case Events.ORDER_PROCESSING:
        console.log(event, data);
        break;

      case Events.ORDER_COMPLETED:
        console.log(event, data);
        break;

      default:
        console.log(event, data);
    }
  };

  return (
    <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
      <View style={{ flex: 1 }}>
        <TransakWebView
          transakConfig={transakConfig}
          onTransakEvent={onTransakEventHandler}
        />
      </View>
      <View style={{ height: 50 }}/>
    </ScrollView>
  );
};

export default TransakSell;
