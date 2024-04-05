import React, { useState } from 'react';
import { Modal, View, Text } from 'react-native';
import PasswordInput from '../components/PasswordInput';
import CustomButton from '../components/CustomButton';
import styles from '../styles/common';

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
          <Text style={styles.headingText}>Each new password creates a new account when used with your card. {"\n"} {"\n"}
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