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
// components
import Text from '../components/CustomText';
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
      style={styles.modal} 
    >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
          <Text   size={"large"} color={"#000000"} text={title} style={{ marginBottom: 32, marginTop: 16 }}/>
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
              <Text size={"small"} color={"#FF0000"} text={errorMessage} />
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
    backgroundColor: 'rgba(0, 0, 0, 0.5)', 
    padding: 16
  },
  modalContent: {
    backgroundColor: '#fff',
    width: '100%',
    padding: 16,
    borderRadius: 15,
    alignItems: 'center',
  },
  inlineButton: {
    marginTop: 32,
  },
  errorMessage: {
    color: 'red',
    margin: 16,
  },
});