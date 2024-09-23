import React, { useContext } from 'react';
import { View } from 'react-native';
import { TransakWebView, Environments, Events } from '@transak/react-native-sdk';
import { AccountContext } from '../contexts/AccountContext';
import { TRANSAK_ENVIRONMENT, TRANSAK_API_KEY } from '@env';

const TransakBuy = () => {
  const { publicKey } = useContext(AccountContext);

  const transakConfig = {
    apiKey: TRANSAK_API_KEY,
    environment: Environments[TRANSAK_ENVIRONMENT],
    defaultCryptoCurrency: 'USDC',
    fiatCurrency: 'USD',
    productsAvailed: 'BUY',
    networks: 'BASE',
    cryptoCurrencyList: 'USDC',
    disableCrypto: false,
    disableNetwork: false,
    disableFiat: false,  
    fiatAmount: '',  
    defaultPaymentMethod: 'pm_us_wire_bank_transfer',
    themeColor: '2E3C49',
    walletAddress: publicKey,
  };

  const onTransakEventHandler = (event, data) => {
    console.log(event, data);
  };

  return (
    <View style={{ flex: 1 }}>
      <TransakWebView
        transakConfig={transakConfig}
        onTransakEvent={onTransakEventHandler}
        style={{ flex: 1 }}  // Ensure the WebView takes full height
      />
    </View>
  );
};

export default TransakBuy;