import React, { useState } from 'react';
import { View, TextInput, TouchableOpacity, Text } from 'react-native';
import DatePicker from 'react-native-date-picker';

const DatePickerInput = ({ onDateChange }) => {
  const [date, setDate] = useState(null);
  const [open, setOpen] = useState(false);
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
      onDateChange(selectedDate);
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
        onConfirm={handleDateChange}
        onCancel={() => setOpen(false)}
      />
      <TouchableOpacity
        style={styles.toggleButton}
        onPress={() => setConfirmVisible(!confirmVisible)}>
        <Text>{confirmVisible ? 'Hide' : 'Show'}</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  textInput: {
    marginTop: 10,
    width: 200,
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    paddingLeft: 10,
  },
  toggleButton: {
    marginTop: 10,
    width: 100,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'lightgray',
  },
});

export default DatePickerInput;