// libraies
import React, { useContext } from 'react';
import { TransakWebView, Environments, Events, ScrollView } from '@transak/react-native-sdk';
// context
import { AccountContext } from '../contexts/AccountContext';
// env
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
    defaultPaymentMethod: 'pm_us_wire_bank_transfer',
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
    <TransakWebView
      transakConfig={transakConfig}
      onTransakEvent={onTransakEventHandler}
    />
  );
};

export default TransakBuy;