
import { StyleSheet } from 'react-native';
import { Button } from 'react-native-paper';

const CustomButton = ({ text, type, size, onPress }) => {
  return (
    <Button
      mode={type === 'primary' ? 'contained' : 'outlined'}
      onPress={onPress}
      style={[styles.button, [{ marginVertical: 10, }, size === 'small' ? { width: 150 } : { width: 175 }]]} 
      buttonColor={type === 'primary' ? '#2E3C49' : '#ffffff'}
      labelStyle={size === 'small' ? { fontSize: 14 } : { fontSize: 16 }}
      textColor={type === 'primary' ? '#ffffff' : '#2E3C49'}
    >
      {text}
    </Button>
  );
};

export default CustomButton;

const styles = StyleSheet.create({
  button: {
    borderRadius:15, 
    borderColor:'#2E3C49',
    borderWidth: 1,
    color: '#2E3C49',
  },
});

