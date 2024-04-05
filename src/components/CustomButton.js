import * as React from 'react';
import { Button } from 'react-native-paper';

const CustomButton = ({ text, type, size, onPress }) => {
  return (
    <Button
      mode={type === 'primary' ? 'elevated' : 'outlined'}
      onPress={onPress}
      style={[{ marginVertical: 10, }, size === 'small' ? { width: 150 } : { width: 250 }]} 
      buttonColor={type === 'primary' ? '#5a56db' : '#ffffff'}
      labelStyle={size === 'small' ? { fontSize: 14 } : { fontSize: 18 }}
      textColor={type === 'primary' ? '#ffffff' : '#5a56db'}
    >
      {text}
    </Button>
  );
};

export default CustomButton;