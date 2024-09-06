/////////////////////////////////
// CUSTOM BUTTON           //////
// Custom button with easy     //
// to change styles            //
// Large/Small                 //
// Primary/Secondary           //
// RegenCard 2024              //
/////////////////////////////////

// libraries
import { StyleSheet, Dimensions } from 'react-native';
import { Button } from 'react-native-paper';


const CustomButton = ({ text, type, size, onPress }) => {
  const screenWidth = Dimensions.get('window').width;
  const buttonWidth = size === 'small' ? (screenWidth / 2) - 32 : screenWidth - 32;

  return (
    <Button
      mode={type === 'primary' ? 'elevated' : 'elevated'}
      onPress={onPress}
      style={[styles.button, { width: buttonWidth },]}
      contentStyle={{ justifyContent: 'center', height: '100%', paddingVertical: 0 }}
      buttonColor={type === 'primary' ? '#2E3C49' : '#ffffff'}
      labelStyle={[
        size === 'small' ? { fontSize: 24, lineHeight: 24 } : { fontSize: 24, lineHeight: 24 },
        { fontFamily: 'LeagueSpartan-SemiBold' }
      ]} textColor={type === 'primary' ? '#ffffff' : '#2E3C49'}
    >
      {text}
    </Button>
  );
};

export default CustomButton;

const styles = StyleSheet.create({
  button: {
    borderRadius: 15,
    color: '#2E3C49',
    height: 48,
  },
});

