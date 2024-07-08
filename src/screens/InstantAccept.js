import React, { useState, useEffect } from 'react';
import { View, ActivityIndicator } from 'react-native';
import { Text, TextInput } from 'react-native-paper';
//
import InputModal from '../components/InputModal';
import AndroidScanModal from '../components/AndroidScanModal';
import CustomButton from '../components/CustomButton';
//
import { transferUSDC } from '../functions/core/accountFunctions';
import { scanSerialForKey } from '../functions/core/scanSerialForKey';
import { cancelNfc } from '../functions/core/cancelNfcRequest';
import { createAndSaveAccount } from '../functions/core/createAndSaveAccount';
//
import styles from '../styles/common';

const InstantAccept = ({ navigation }) => {
  const [step, setStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [receipt, setReceipt] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  const [recipientKey, setRecipientKey] = useState('');
  const [tagID, setTagID] = useState('');
  const [scanModal, setScanModal] = useState(false);
  const [amount, setAmount] = useState('');
  const [inputError, setInputError] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    const initializeAccount = async () => {
      const account = await createAndSaveAccount();
      console.log(account.address);
      setRecipientKey(account.address);
      console.log(recipientKey);
      console.log('Initialized account:', account);
    };
    initializeAccount();
  }, []);

  const handleNextStep = () => {
    setStep(step + 1);
  };

  const handlePreviousStep = () => {
    setStep(step - 1);
  };

  const closeScanModal = () => {
    cancelNfc();
    setScanModal(false);
  };

  const fetchTag = async () => {
    console.log('fetching tag')
    try {
      let tag = await scanSerialForKey();
      if (tag) {
        setTagID(tag);
        setModalVisible(true);
        setScanModal(false);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleScanCardPress = () => {
    setScanModal(true);
    fetchTag();
  };

  const handlePasswords = async (password) => {
    setErrorMessage('');
    setModalVisible(false);
    setLoading(true);
    try {
      let receipt = await transferUSDC(tagID, password, amount, publicKey);
      setReceipt(receipt);
      navigation.navigate('Home', { publicKey, label });
    } catch (error) {
      setErrorMessage(error.message); // Set the error message to state variable
      console.error('Cannot complete handlePasswords: ', error);
      setLoading(false);
    }
  };

  const renderStep = () => {
    switch (step) {
      case 0:
        return (
          <View style={styles.inputContainer}>
            <Text style={styles.textMargin} variant='titleMedium'>(1/2) How USDC much are you requesting?</Text>
            <TextInput
              mode="outlined"
              autoFocus={true}
              style={styles.textInput}
              theme={{ colors: { primary: 'green' } }}
              placeholder="Amount"
              value={amount}
              onChangeText={amount => setAmount(amount)}
              returnKeyType={'done'}
              keyboardType={'numeric'}
            />
            {errorMessage ? (
              <Text style={styles.errorText}>{errorMessage}</Text>
            ) : null}
          </View>
        );
      case 1:
        return (
          <View style={styles.inputContainer}>

            <Text style={styles.textMargin} variant='titleLarge'>(2/2) Review Details. You will scan your card to pay.</Text>
            <Text style={styles.textMargin} variant='titleMedium'>{amount} USDC will being paid to: </Text>
            <Text style={styles.textMargin} variant='titleMedium'>{recipientKey}</Text>
            {errorMessage ? (
              <Text style={styles.errorText}>{errorMessage}</Text>
            ) : null}
          </View>
        );
      default:
        return null;
    }
  };

  const renderButtons = () => {
    switch (step) {
      case 0:
        return (
          <View style={styles.bottomContainer}>
            <CustomButton text="Review and Pay" type='primary' size='large' onPress={handleNextStep} />
            <CustomButton text='Go Back' type='secondary' target='Account' size='large' onPress={() => { navigation.navigate('Landing')}} />
          </View>
        );
      case 1:
        return (
          <View style={styles.bottomContainer}>
            <CustomButton text='Scan Card and Send' type='primary' size='large' onPress={() => { handleScanCardPress(); }} />
            <CustomButton text='Go Back' type='secondary' size='large' onPress={() => { handlePreviousStep(); setInputError(''); }} />
          </View>
        );
      default:
        return null;
    }
  };

  return (
    <>
      <View style={styles.container}>
        {loading && (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#7FA324" />
          </View>
        )}
        <View style={styles.topContainer}>
          <Text variant='titleLarge'>Follow the prompts to accept a payment.</Text>
        </View>
        <View style={styles.inputContainer}>
          {renderStep()}
          {inputError ? (
            <Text style={styles.errorText}>{inputError}</Text>
          ) : null}
        </View>
        <View style={styles.bottomContainer}>
          {renderButtons()}
        </View>
      </View>

      <InputModal
        visible={modalVisible}
        closeModal={() => setModalVisible(false)}
        handlePasswords={handlePasswords}
        title='Enter your password.'
      />

      {Platform.OS === 'android' && ( // Render modal only on Android
        <AndroidScanModal
          visible={scanModal}
          closeScanModal={closeScanModal}
        />
      )}
    </>
  );
}

export default InstantAccept;
