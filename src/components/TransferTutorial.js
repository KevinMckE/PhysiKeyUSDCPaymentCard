import React, { useState, useEffect } from 'react';
import { Dimensions, View,Image } from 'react-native';
import Carousel from 'react-native-reanimated-carousel';
// components
import Text from '../components/CustomText'

const TransferTutorial = () => {
  const [width, setWidth] = useState(Dimensions.get('window').width);

  // Update the width if the window size changes
  useEffect(() => {
    const handleResize = () => {
      setWidth(Dimensions.get('window').width);
    };

    const dimensionChangeListener = Dimensions.addEventListener('change', handleResize);

    // Clean up the event listener on unmount
    return () => {
      dimensionChangeListener?.remove();
    };
  }, []);

  const slides = [
    { key: '1', text: 'To avoid fees create a Coinbase account.  Otherwise utilize Transak within our app.', image: require('../assets/icons/sign_up.png') },
    { key: '2', text: 'Set up a wallet in Coinbase to buy or receive USDC. Remember, this must be on the BASE network', image: require('../assets/icons/buy_icon.png') },
    { key: '3', text: 'Copy your account address from our app to use in the Coinbase interface', image: require('../assets/icons/copy_icon.png') },
    { key: '4', text: 'Transfer your assets.  Any money in your Coinbase account can be easily transferred to your bank.', image: require('../assets/icons/transfer_icon.png') },
  ];

  return (
    <View style={{ flex: 1 }}>
      <Carousel
        loop
        width={width}
        height={width / 2}
        autoPlay={true}
        data={slides}
        scrollAnimationDuration={5000}
        renderItem={({ item }) => (
          <View
            style={{
              flex: 1,
              justifyContent: 'center',
              alignItems: 'center',
              margin: 16,
            }}
          >
             <Image
                source={item.image}
                style={{ width: 64, height: 64, marginVertical: 16 }}
              />
          <Text size={"medium"} color={"#000000"} text={item.text} />
         
          </View>
        )}
      />
    </View>
  );
};

export default TransferTutorial;