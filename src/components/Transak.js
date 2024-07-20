import React from 'react';
import { TransakWebView, Environments, Events } from '@transak/react-native-sdk';

const Transak = () => {
  const transakConfig = {
    apiKey: '54789b9d-02ca-4bb4-9f1c-b475348bb61d', // Required
    environment: Environments.STAGING, // or Environments.PRODUCTION, Required
    partnerOrderId: '<unique-order-id-generated-by-your-system>', // Required to receive order events

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

export default Transak;