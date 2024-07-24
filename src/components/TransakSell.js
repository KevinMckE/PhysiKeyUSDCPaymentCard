import React from 'react';
import { TransakWebView, Environments, Events } from '@transak/react-native-sdk';
import { TRANSAK_API_KEY } from '@env';
//walletAddress 
const TransakSell = () => {
  const transakConfig = {
    apiKey: TRANSAK_API_KEY, 
    environment: Environments.STAGING, 
    defaultCryptoCurrency: 'USDC',
    fiatCurrency: 'USD',
    fiatAmount: 100, 
    productsAvailed: 'SELL',
    networks: 'BASE',
    cryptoCurrencyList: 'USDC', 
    disableCrypto: true,
    disableNetwork: true, 
    disableFiat: true, 
    themeColor: '000000',
  };

  const onTransakEventHandler = (event, data) => {
    switch(event) {
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
    <TransakWebView
      transakConfig={transakConfig}
      onTransakEvent={onTransakEventHandler}
    />
  );
};

export default TransakSell;