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
      textColor={type === 'primary' ? '#ffffff' : '#5a56db'}
    >
      {text}
    </Button>
  );
};

export default CustomButton;

const styles = StyleSheet.create({
  button: {
    borderRadius:15, 
    borderColor:'#5a56db',
    borderWidth: 1,
    color: 'white',
  },
});

/**
 *  scanBtn: {
    width: 300,
    height: 50,
    marginBottom: 100,
    borderRadius:15, 
    borderColor:'gray',
    color: 'black',
    borderWidth: 1,
    color: 'white',
    backgroundColor: 'black',
    alignItems: 'center',
    justifyContent: 'center',
  },
  bigBtn: {
    width: 250,
    height: 70,
    marginBottom: 15,
    borderRadius:15, 
    borderColor:'gray',
    color: 'white',
    borderWidth: 1,
    color: 'black',
    backgroundColor: 'white',
    alignItems: 'center',
    justifyContent: 'center',
  },
 */