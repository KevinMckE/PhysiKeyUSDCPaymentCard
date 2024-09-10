import React, { useState, useEffect } from 'react';
import { Dimensions, View } from 'react-native';
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
    { key: '1', text: 'Its easy to load your card or cashout your account.' },
    { key: '2', text: 'Use your own Coinbase account or our integrated Transak service.' },
    { key: '3', text: 'Load your card' },
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
          <Text size={"medium"} color={"#000000"} text={item.text} />

          </View>
        )}
      />
    </View>
  );
};

export default TransferTutorial;