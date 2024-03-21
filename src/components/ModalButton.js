import * as React from 'react';
import { Button } from 'react-native-paper';
import { closeSerial } from './HelperFunctions';

const NavigationButton = ({ navigation, text, type, target, size, onPress }) => {
  return (
    <Button
      mode={type === 'primary' ? 'contained' : 'outlined'}
      onPress={onPress}
      style={[{ marginVertical: 10, }, size === 'small' ? { width: '100%' } : { width: 250 }]} 
      buttonColor={type === 'primary' ? '#332eb3' : undefined}
      labelStyle={size === 'small' ? { fontSize: 14 } : { fontSize: 18 }}
    >
      {text}
    </Button>
  );
};

export default NavigationButton;