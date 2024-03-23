import React, { useState } from 'react';
import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';
import { TextInput } from 'react-native-paper';

const DatePickerInput = ({ text }) => {
  const [inputText, setInputText] = useState('');
  const [confirmVisible, setConfirmVisible] = useState(true);

  const handleInputChange = (text) => {
    setInputText(text); // Update the inputText state when the text changes
  };

  return (
    <View>
        <TextInput
        mode="outlined"
        style={styles.textInput}
        placeholder={text}
        value={inputText}
        onChangeText={handleInputChange}
        secureTextEntry={confirmVisible}
      />
 
      <TouchableOpacity
        style={styles.toggleButton}
        onPress={() => setConfirmVisible(!confirmVisible)}>
        <Text>{confirmVisible ? 'Show' : 'Hide'}</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  textInput: {
    marginTop: 10,
    width: 250,
    height: 40,
    backgroundColor: '#ffffff',
   
  },
  toggleButton: {
    marginTop: 10,
  },
});

export default DatePickerInput;