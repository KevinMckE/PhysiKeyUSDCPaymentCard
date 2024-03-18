import React, { useState } from 'react';
import { View, TextInput, TouchableOpacity, Text, StyleSheet } from 'react-native';
import DatePicker from 'react-native-date-picker';

const DatePickerInput = () => {
  const [date, setDate] = useState(null);
  const [open, setOpen] = useState(false);

  const [confirmDate, setConfirmDate] = useState(null);
  const [confirmVisible, setConfirmVisible] = useState(false);

  const handleDateSelection = () => {
    setOpen(true);
  };

  const handleConfirmDateSelection = () => {
    setOpen(true);
    setConfirmVisible(true);
  };

  const handleDateChange = (selectedDate) => {
    if (confirmVisible) {
      setConfirmDate(selectedDate);
    } else {
      setDate(selectedDate);
    }
    setOpen(false);
  };

  return (
    <View>
      <TouchableOpacity onPress={handleDateSelection}>
        <TextInput
          style={styles.textInput}
          placeholder="Select Date"
          value={date ? date.toDateString() : ''}
          editable={false}
          secureTextEntry={confirmVisible}
        />
      </TouchableOpacity>
      <TouchableOpacity onPress={handleConfirmDateSelection}>
        <TextInput
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
    borderRadius: 50,
    borderColor: 'gray',
    borderWidth: 1,
    paddingLeft: 10,
  },
  toggleButton: {
    marginTop: 10,
  },
});

export default DatePickerInput;