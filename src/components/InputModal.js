/////////////////////////////////
// INPUT MODAL              /////
//  Main input modal used      //
// to input passwords when     //
// performing account actions  //
//                             //
// RegenCard 2024              //
/////////////////////////////////

import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import Modal from "react-native-modal";
import { Text } from 'react-native-paper';
import PasswordInput from '../components/PasswordInput';
import CustomButton from '../components/CustomButton';

const InputModal = ({ visible, closeModal, handlePasswords, title }) => {
  const [password, setPassword] = useState(null);
  const [confirmPassword, setConfirmPassword] = useState(null);
  const [errorMessage, setErrorMessage] = useState('');

  const handleConfirmPasswords = () => {
    if (password && confirmPassword) {
      if (password === confirmPassword) {
        handlePasswords(password);
      } else {
        setErrorMessage('The passwords do not match.');
      }
    } else {
      setErrorMessage('Please complete the form.');
    }
  };

  return (
    <Modal
      avoidKeyboard
      visible={visible}
      onRequestClose={closeModal}
      style={styles.modal} // Apply full-screen style
    >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.text} variant='titleMedium'>{title}</Text>
            <PasswordInput
              text='Enter Password'
              password={password}
              setPassword={setPassword}
            />
            <PasswordInput
              text='Confirm Password'
              password={confirmPassword}
              setPassword={setConfirmPassword}
            />
            {errorMessage ? (
              <Text style={styles.errorMessage}>{errorMessage}</Text>
            ) : null}
            <View style={styles.inlineButton}>
              <CustomButton text='Close' type='secondary' size='small' onPress={() => { closeModal(); }} />
              <CustomButton text='Enter' type='primary' size='small' onPress={handleConfirmPasswords} />
            </View>
          </View>
        </View>
    </Modal>
  );
}

export default InputModal;

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