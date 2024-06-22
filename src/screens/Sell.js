import React from 'react';
import styles from '../styles/common';
import { useMoonPaySdk } from '@moonpay/react-native-moonpay-sdk';

const Sell = () => {
    
  const { MoonPayWebViewComponent } = useMoonPaySdk({
    sdkConfig: {
      flow: 'sell',
      environment: 'sandbox',
      params: {
        apiKey: 'pk_test_PWF6upCocpUN03Fj5VyYwq0cMvjRBQh',
      },
    },
  });

  return (
    <>
      <MoonPayWebViewComponent style={styles.MoonPay} />
    </>
  );
}

export default Sell;