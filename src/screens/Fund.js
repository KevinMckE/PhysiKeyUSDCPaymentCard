import React, { useMemo, useCallback } from 'react';
import { View, StyleSheet } from 'react-native';
import { WebView } from 'react-native-webview';
import { generateOnRampURL } from '@coinbase/cbpay-js';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { useMoonPaySdk } from '@moonpay/react-native-moonpay-sdk';

const Tab = createMaterialTopTabNavigator();

const Fund = ({ currentAmount, route }) => {
  const { publicKey } = route.params;

  const coinbaseURL = useMemo(() => {
    const options = {
      appId: '2b31dfbd-2552-4556-942c-9adb871bbb56',
      destinationWallets: [
        {
          address: publicKey,
          assets: ['USDC'],
          supportedNetworks: ['base'],
        },
      ],
      handlingRequestedUrls: true,
      presetCryptoAmount: currentAmount,
    };

    try {
      return generateOnRampURL(options);
    } catch (error) {
      console.error('Error generating Coinbase URL:', error);
      return null;
    }
  }, [currentAmount, publicKey]);

  const onMessage = useCallback((event) => {
    console.log('onMessage', event.nativeEvent.data);
    try {
      const { data } = JSON.parse(event.nativeEvent.data);
      if (data.eventName === 'request_open_url') {
        console.log('Requested URL:', data.url);
      }
    } catch (error) {
      console.error('Error handling message:', error);
    }
  }, []);

  const { MoonPayWebViewComponent } = useMoonPaySdk({
    sdkConfig: {
      flow: 'buy',
      environment: 'sandbox',
      params: {
        apiKey: 'pk_test_PWF6upCocpUN03Fj5VyYwq0cMvjRBQh',
      },
    },
  });

  const RenderMoonpayComponent = () => (
    <MoonPayWebViewComponent style={styles.MoonPay} />
  );

  const RenderCoinbaseComponent = () => (
    <WebView source={{ uri: coinbaseURL }} onMessage={onMessage} />
  );

  return (
    <View style={{ flex: 1 }}>
      <Tab.Navigator
        screenOptions={{
          tabBarIndicatorStyle: { backgroundColor: '#7FA324' },
        }}
      >
        <Tab.Screen
          name="Coinbase"
          component={RenderCoinbaseComponent}
        />
        <Tab.Screen
          name="Moonpay"
          component={RenderMoonpayComponent}
        />
      </Tab.Navigator>
    </View>
  );
};

const styles = StyleSheet.create({
  MoonPay: {
    flex: 1,
  },
});

export default Fund;
