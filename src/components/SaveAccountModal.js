/////////////////////////////////
// SAVE ACCOUNT MODAL       /////
//                             //
//                             //
//                             //
//                             //
//                             //
/////////////////////////////////

// libraries
import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import Modal from "react-native-modal";
import { Text } from 'react-native-paper';
// components
import PasswordInput from '../components/PasswordInput';
import CustomButton from '../components/CustomButton';

const SaveAccount = ({ visible, closeModal, handleName, title }) => {
  const [label, setLabel] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const handleLabel = () => {
    if (label) {
      handleName(label);
    } else {
      setErrorMessage('Please name this account.');
    }
  };

  return (
    <Modal
      avoidKeyboard
      visible={visible}
      onRequestClose={closeModal}
      style={styles.modal} 
    >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.text} variant='titleMedium'>{title}</Text>
            <PasswordInput
              text='Name'
              password={label}
              setPassword={setLabel}
            />
            {errorMessage ? (
              <Text style={styles.errorMessage}>{errorMessage}</Text>
            ) : null}
            <View style={styles.inlineButton}>
              <CustomButton text='Close' type='secondary' size='small' onPress={() => { closeModal(); }} />
              <CustomButton text='Enter' type='primary' size='small' onPress={handleLabel} />
            </View>
          </View>
        </View>
    </Modal>
  );
}

export default SaveAccount;

const styles = StyleSheet.create({
  modal: {
    margin: 0, 
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.7)', 
    padding: 20
  },
  modalContent: {
    backgroundColor: '#fff',
    width: '100%',
    padding: 30,
    borderRadius: 10,
    alignItems: 'center',
  },
  inlineButton: {
    flexDirection: 'row',
    marginTop: 15,
    width: 100,
    justifyContent: 'center',
    gap: 5,
  },
  text: {
    margin: 10,
  },
  errorMessage: {
    color: 'red',
    margin: 10,
  },
});