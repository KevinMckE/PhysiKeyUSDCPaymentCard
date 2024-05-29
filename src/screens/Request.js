import React, { useState, useEffect, useRef } from 'react';
import { View, ActivityIndicator } from 'react-native';
import { Text, TextInput, Card } from 'react-native-paper';
import InputModal from '../components/InputModal';
import AndroidScanModal from '../components/AndroidScanModal';
import CustomButton from '../components/CustomButton';
import { signTransaction, sendSignedTransaction } from '../functions/core/accountFunctions';
import { scanSerialForKey } from '../functions/core/scanSerialForKey';
import { getGasEstimate } from '../functions/optimism/getGasEstimate';
import { cancelNfc } from '../functions/core/cancelNfcRequest';
import styles from '../styles/common';

const Request = ({ navigation, route }) => {
  const [step, setStep] = useState(0);
  const [gas, setGas] = useState('');
  const [loading, setLoading] = useState(false);
  const [signedTransaction, setSignedTransaction] = useState(null);
  const [receipt, setReceipt] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  const [recipientKey, setRecipientKey] = useState('');
  const [signModal, setSignModal] = useState(false);
  const [tagID, setTagID] = useState('');
  const [scanModal, setScanModal] = useState(false);
  const [amount, setAmount] = useState('');
  const [inputError, setInputError] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [isSuccess, setSuccess] = useState(false);

  const { publicKey } = route.params;

  useEffect(() => {
    setRecipientKey(publicKey)
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

  useEffect(() => {
    const fetchGasEstimate = async () => {
      if (parseFloat(amount) === 0) {
        setInputError('Oops! Set a valid amount.');
      } else {
        setInputError('');
      }
    };
    if (amount) {
      fetchGasEstimate();
    }
  }, [amount]);


  const handlePasswords = async (password) => {
    setErrorMessage('');
    setModalVisible(false);
    //setLoading(true);
    try {
      let signedTx = await signTransaction(tagID, password, amount, recipientKey);
      const gasEstimate = await getGasEstimate();
      setGas(gasEstimate.toString() + 'n');
      setSignedTransaction(signedTx);
      if (signedTx) {
        setLoading(false);
        handleNextStep();
      } else {
        console.error('Cannot complete handlePasswords. Key is not defined.');
      }
    } catch (error) {
      setErrorMessage(error.message); // Set the error message to state variable
      console.error('Cannot complete handlePasswords: ', error);
    }
  };

  const confirmSign = async () => {
    setErrorMessage('');
    setSignModal(false);
    setLoading(true);
    try {
      let receipt = await sendSignedTransaction(signedTransaction);
      setReceipt(receipt);
      navigation.navigate('Home', publicKey);
    } catch (error) {
      console.error('Cannot complete confirmSign: ', error);
    } finally {
      setLoading(false);
    }
  };

  const renderStep = () => {
    switch (step) {
      case 0:
        return (
          <View style={styles.inputContainer}>
            <Text style={styles.textMargin} variant='titleMedium'>How much are you requesting? (1/2)</Text>
            <TextInput
              mode="outlined"
              autoFocus={true}
              style={styles.textInput}
              placeholder="Amount..."
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
            <Card style={styles.confirmCard}>
              <Text style={styles.textMargin} variant='titleLarge'>Confirm Details (2/2)</Text>
              <Text style={styles.textMargin} variant='titleMedium'>You are sending {amount} ETH to:</Text>
              <Text style={styles.textMargin} variant='titleMedium'>{recipientKey}</Text>
              <Text style={styles.textMargin} variant='titleMedium'>Estimated gas {gas} ETH</Text>
            </Card>
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
            <CustomButton text="Scan Payer's Card" type='primary' size='large' onPress={() => { handleScanCardPress(); }} />
            <CustomButton text='Go Back' type='secondary' target='Account' size='large' onPress={() => { navigation.navigate('Account', publicKey) }}/>
          </View>
        );
      case 1:
        return (
          <View style={styles.bottomContainer}>
            <CustomButton text='Confirm and Send' type='primary' size='large' onPress={() => { confirmSign(); }} />
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
            <ActivityIndicator size="large" color="#0000ff" />
          </View>
        )}
        <View style={styles.topContainer}>
          <Text variant='titleLarge'>Input request and scan card for payment.</Text>
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

export default Request;