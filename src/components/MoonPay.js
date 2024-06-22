import React from 'react';
import { StyleSheet } from 'react-native';
import { useMoonPaySdk } from '@moonpay/react-native-moonpay-sdk';

const MoonPay = () => {
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
};

const styles = StyleSheet.create({
  MoonPay: {
    flex: 1,
  },
});

export default MoonPay;
