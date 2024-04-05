import React, { useState } from 'react';
import { Modal, View, StyleSheet } from 'react-native';
import { Text } from 'react-native-paper';
import PasswordInput from '../components/PasswordInput';
import CustomButton from '../components/CustomButton';

const InputModal = ({ visible, closeModal, handlePasswords }) => {
  const [password, setPassword] = useState(null);
  const [confirmPassword, setConfirmPassword] = useState(null);
  const [errorMessage, setErrorMessage] = useState('');

  const handleConfirmPasswords = () => {
    if (password && confirmPassword) {
      if (password === confirmPassword) {
        handlePasswords(password, confirmPassword);
      } else {
        setErrorMessage('The passwords do not match.');
      }
    } else {
      setErrorMessage('Please complete the form.');
    }
  };

  return (
    <Modal
      transparent={true}
      visible={visible}
      onRequestClose={closeModal}
    >
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <Text style={styles.text} variant='titleMedium'>Each new password creates a new account when used with your card. {"\n"} {"\n"}
            We cannot recover passwords for you.
          </Text>
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
            <CustomButton text='Close' type='secondary' size='small' onPress={() => { closeModal(); changeGifSource(); }} />
            <CustomButton text='Enter' type='primary' size='small' onPress={handleConfirmPasswords} />
          </View>
        </View>
      </View>
    </Modal>
  );
}

export default InputModal;

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    padding: 20,
  },
  modalContent: {
    backgroundColor: '#fff',
    padding: 20,
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