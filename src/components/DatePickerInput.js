import React, { useState } from 'react';
import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';
import { TextInput } from 'react-native-paper';
import DatePicker from 'react-native-date-picker';

const DatePickerInput = ({ onDateChange }) => {
  const [open, setOpen] = useState(false);
  const [date, setDate] = useState(null);
  const [selection, setSelection] = useState();
  const [confirmDate, setConfirmDate] = useState(null);
  const [confirmVisible, setConfirmVisible] = useState(true);

  const handleDateSelection = () => {
    setOpen(true);
  };

  const handleDateChange = (selectedDate) => {
    if (selection == 2) {
      setConfirmDate(selectedDate);
    } else {
      setDate(selectedDate);
    }
    setOpen(false);
    onDateChange(date, confirmDate);
  };

  return (
    <View>
      <TouchableOpacity onPress={() => {handleDateSelection(); setSelection(1)}}>
        <TextInput
          mode="outlined"
          style={styles.textInput}
          placeholder="Select Date"
          value={date ? date.toDateString() : ''}
          editable={false}
          secureTextEntry={confirmVisible}
        />
      </TouchableOpacity>
      <TouchableOpacity onPress={() => {handleDateSelection(); setSelection(2)}}>
        <TextInput
          mode="outlined"
          style={styles.textInput}
          placeholder="Confirm Date"
          value={confirmDate ? confirmDate.toDateString() : ''}
          editable={false}
          secureTextEntry={confirmVisible}
        />
      </TouchableOpacity>
      <DatePicker
        modal
        mode="date"
        open={open}
        date={date || new Date()}
        onConfirm={handleDateChange}
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