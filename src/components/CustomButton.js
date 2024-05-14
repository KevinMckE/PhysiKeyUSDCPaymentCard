import * as React from 'react';
import { StyleSheet } from 'react-native';
import { Button } from 'react-native-paper';

const CustomButton = ({ text, type, size, onPress }) => {
  return (
    <Button
      mode={type === 'primary' ? 'contained' : 'outlined'}
      onPress={onPress}
      style={[styles.button, [{ marginVertical: 10, }, size === 'small' ? { width: 150 } : { width: 250 }]]} 
      buttonColor={type === 'primary' ? '#000000' : '#ffffff'}
      labelStyle={size === 'small' ? { fontSize: 16 } : { fontSize: 18 }}
      textColor={type === 'primary' ? '#ffffff' : '#000000'}
    >
      {text}
    </Button>
  );
};

export default CustomButton;

const styles = StyleSheet.create({
  button: {
    borderRadius:15, 
    borderColor:'#184211',
    borderWidth: 1,
    color: '#ffffff',
  },
});

