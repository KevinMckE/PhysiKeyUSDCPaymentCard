import React from 'react';
import { TransakWebView, Environments, Events } from '@transak/react-native-sdk';

const TransakSell = () => {
  const transakConfig = {
    apiKey: '54789b9d-02ca-4bb4-9f1c-b475348bb61d', // Required
    environment: Environments.STAGING, // or Environments.PRODUCTION, Required
    defaultCryptoCurrency: 'USDC', // Example cryptocurrency, adjust as needed
    fiatCurrency: 'USD', // Fiat currency for off-ramp
    fiatAmount: 100, // Amount to off-ramp
    productsAvailed: 'SELL',
    // Other necessary configuration parameters for off-ramping
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