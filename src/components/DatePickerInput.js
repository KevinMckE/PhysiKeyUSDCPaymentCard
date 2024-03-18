import React, { useState } from 'react';
import { View, TextInput, TouchableOpacity, Text, Modal, StyleSheet } from 'react-native';
import DatePicker from 'react-native-date-picker';

const DatePickerInput = ({ visible, onClose, onEnter }) => {
  const [date, setDate] = useState(null);
  const [confirmDate, setConfirmDate] = useState(null);
  const [confirmVisible, setConfirmVisible] = useState(false);

  const handleDateSelection = () => {
    setConfirmVisible(true);
  };

  const handleConfirmDateSelection = () => {
    setConfirmVisible(true);
  };

  const handleDateChange = (selectedDate) => {
    if (confirmVisible) {
      setConfirmDate(selectedDate);
    } else {
      setDate(selectedDate);
    }
  };

  const handleEnter = () => {
    if (date && confirmDate && date.toDateString() === confirmDate.toDateString()) {
      onEnter(date, confirmDate); // Pass selected dates back to parent component
    }
  };

  return (
    <Modal visible={visible} transparent>
      <View style={styles.modalContainer}>
        <View style={styles.contentContainer}>
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
            date={date || new Date()}
            onDateChange={handleDateChange}
          />
          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={styles.enterButton}
              onPress={handleEnter}>
              <Text>Enter</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.closeButton}
              onPress={onClose}>
              <Text>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  contentContainer: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 10,
    alignItems: 'center',
  },
  textInput: {
    marginTop: 10,
    width: 250,
    height: 40,
    borderRadius: 50,
    borderColor: '#333333',
    backgroundColor: '#ffffff',
    borderWidth: 1,
    paddingLeft: 10,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
  },
  enterButton: {
    backgroundColor: 'blue',
    padding: 10,
    borderRadius: 5,
  },
  closeButton: {
    backgroundColor: 'red',
    padding: 10,
    borderRadius: 5,
  },
});

export default DatePickerInput;
