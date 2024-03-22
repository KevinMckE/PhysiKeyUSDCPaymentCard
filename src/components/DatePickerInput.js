import React, { useState } from 'react';
import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';
import { TextInput } from 'react-native-paper';
import DatePicker from 'react-native-date-picker';

const DatePickerInput = ({ text, date, setDate }) => {
  const [open, setOpen] = useState(false);
  const [confirmVisible, setConfirmVisible] = useState(true);

  return (
    <View>
      <TouchableOpacity onPress={() => setOpen(true)}>
        <TextInput
          mode="outlined"
          style={styles.textInput}
          placeholder={text}
          value={date ? date.toDateString() : ''}
          editable={false}
          secureTextEntry={confirmVisible}
        />
      </TouchableOpacity>
      <DatePicker
        modal
        mode="date"
        open={open}
        date={date || new Date()}
        onConfirm={(selectedDate) => { setOpen(false); setDate(selectedDate) }}
        onCancel={() => setOpen(false)}
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