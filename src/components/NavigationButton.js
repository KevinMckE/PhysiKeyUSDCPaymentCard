import * as React from 'react';
import { Button } from 'react-native-paper';
import { closeSerial } from './HelperFunctions';

const NavigationButton = ({ navigation, text, type, target, size }) => {
  const handlePress = async () => {
    try {
      await closeSerial();
    } catch (error) {
      console.warn(error);
    }
    if(target != null) {
    navigation.navigate(target);
    } 
  };

  return (
    <Button
      mode={type === 'primary' ? 'contained' : 'outlined'}
      onPress={handlePress}
      style={[{ marginVertical: 10, }, size === 'small' ? { width: '100%' } : { width: 250 }]} 
      buttonColor={type === 'primary' ? '#332eb3' : undefined}
      labelStyle={size === 'small' ? { fontSize: 14 } : { fontSize: 18 }}
    >
      {text}
    </Button>
  );
};

export default NavigationButton;