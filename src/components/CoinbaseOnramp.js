import React, { useMemo, useCallback } from 'react'
import { WebView } from 'react-native-webview'
import { generateOnRampURL } from '@coinbase/cbpay-js'
import 'react-native-url-polyfill/auto'

const CoinbaseOnRamp = ({ currentAmount, publicKey }) => {
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
    }

    return generateOnRampURL(options)
  }, [currentAmount, publicKey]);

  const onMessage = useCallback((event) => {
    console.log('onMessage', event.nativeEvent.data)
    try {
      const { data } = JSON.parse(event.nativeEvent.data);
      if (data.eventName === 'request_open_url') {
        viewUrlInSecondWebview(data.url);
      }
    } catch (error) {
      console.error(error);
    }
  }, []);

  return (
    <WebView source={{ uri: coinbaseURL }} onMessage={onMessage} />
  )
}

export default CoinbaseOnRamp;
