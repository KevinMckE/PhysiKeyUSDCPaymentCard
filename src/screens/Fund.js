import React, { useState } from 'react';
import { View, Text } from 'react-native';

import InputModal from '../components/InputModal';

import { accountLogin } from '../functions/core/accountFunctions';

import styles from '../styles/common';



const Fund = ({ navigation, route }) => {
  const [modalVisible, setModalVisible] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');
  const [recipTag, setRecipTag] = useState('');
  const [scanModal, setScanModal] = useState(false);
  const { publicKey } = route.params;
  console.log(publicKey)

  const fetchTag = async () => {
    try {
      let tag = await scanSerialForKey();
      if (tag) {
        setRecipTag(tag);
        setModalVisible(true);
        setScanModal(false);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleRecipPassword = async (password) => {
    setErrorMessage('');
    try {
      let account = await accountLogin(recipTag, password);
      console.log('account address: ', account.address)
      if (account.address == publicKey) {
        setModalVisible(false);
      } else {
        setErrorMessage('Incorrect password.  Try again.')
      }
    } catch (error) {
      console.error('Cannot complete handlePasswords: ', error);
    }
  };

  return (
    <>
      <View style={styles.inputContainer}>
        <Text style={styles.textMargin} variant='titleMedium'>{publicKey}</Text>
      </View>

      <InputModal
        visible={modalVisible}
        closeModal={() => setModalVisible(false)}
        handlePasswords={handleRecipPassword}
        title='Confirm your password.'
        changeGifSource={null}
      />

      {Platform.OS === 'android' && ( // Render modal only on Android
        <AndroidScanModal
          visible={scanModal}
          closeScanModal={closeScanModal}
          changeGifSource={null}
        />
      )}
    </>
  );
};

export default Fund;
