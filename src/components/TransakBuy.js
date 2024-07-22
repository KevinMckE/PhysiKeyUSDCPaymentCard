import React from 'react';
import { TransakWebView, Environments, Events } from '@transak/react-native-sdk';

const TransakBuy = () => {
  const transakConfig = {
    apiKey: '54789b9d-02ca-4bb4-9f1c-b475348bb61d', 
    environment: Environments.STAGING, 
    defaultCryptoCurrency: 'USDC',
    fiatCurrency: 'USD',
    fiatAmount: 100, 
    productsAvailed: 'BUY',
    networks: 'BASE',
    cryptoCurrencyList: 'USDC', 
    disableCrypto: true,
    disableNetwork: true, 
    disableFiat: true, 
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

export default TransakBuy;