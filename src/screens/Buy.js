import React from 'react';
import styles from '../styles/common';
import { useMoonPaySdk } from '@moonpay/react-native-moonpay-sdk';

const Buy = () => {
  
  const { MoonPayWebViewComponent } = useMoonPaySdk({
    sdkConfig: {
      flow: 'buy',
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

export default Buy;
