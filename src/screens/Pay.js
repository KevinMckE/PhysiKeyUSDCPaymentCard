import React, { useState, useEffect } from 'react';
import { View, ActivityIndicator } from 'react-native';
import { Text, TextInput, Card } from 'react-native-paper';
import InputModal from '../components/InputModal';
import AndroidScanModal from '../components/AndroidScanModal';
import CustomButton from '../components/CustomButton';
import { accountLogin, signAndSend } from '../functions/core/accountFunctions';
import { scanSerialForKey } from '../functions/core/scanSerialForKey';
import { getGasEstimate } from '../functions/optimism/getGasEstimate';
import { cancelNfc } from '../functions/core/cancelNfcRequest';
import styles from '../styles/common';

const Pay = ({ navigation, route }) => {
  const [step, setStep] = useState(0);
  const [gas, setGas] = useState('');
  const [loading, setLoading] = useState(false);
  const [receipt, setReceipt] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  const [signModal, setSignModal] = useState(false);
  const [tagID, setTagID] = useState('');
  const [scanModal, setScanModal] = useState(false);
  const [recipientKey, setRecipientKey] = useState('');
  const [amount, setAmount] = useState('');
  const [inputError, setInputError] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [isSuccess, setSuccess] = useState(false);

  const { publicKey } = route.params;

  const handleTransferPress = () => {
    navigation.navigate('Home', { publicKey });
  };

  const handleNextStep = () => {
    switch (step) {
      case 0:
        if (recipientKey.trim() !== '') {
          setStep(step + 1);
          setInputError('');
        } else {
          setInputError('Oops! Please enter a recipient.');
        }
        break;
      case 1:
        if (parseFloat(amount) > 0 && gas !== null) {
          setStep(step + 1);
          setInputError('');
        } else {
          setInputError('Oops! Please enter a valid number.')
        }
        break;
      default:
        break;
    }
  };

  const handlePreviousStep = () => {
    setStep(step - 1);
  };

  const closeScanModal = () => {
    cancelNfc();
    setScanModal(false);
  };

  const fetchTag = async () => {
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

  const fetchSign = async () => {
    try {
      let tag = await scanSerialForKey();
      if (tag) {
        setTagID(tag);
        setSignModal(true);
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

  const handleSignAndSend = () => {
    setScanModal(true);
    fetchSign();
  };

  useEffect(() => {
    const fetchGasEstimate = async () => {
      if (parseFloat(amount) ==  0) {
        setInputError('Oops! Set a valid amount.');
      }
      try {
        const gasEstimate = await getGasEstimate(publicKey, recipientKey, amount);
        setGas(gasEstimate.toString() + 'n');
        setInputError('');
      } catch (error) {
        setGas(null)
        console.error('Cannot complete fetchGasEstimate: ', error);
        setInputError('Error fetching gas estimate: ' + error.message); 
      }
    };

    if (amount && publicKey && recipientKey) {
      fetchGasEstimate();
    }
  }, [amount, publicKey, recipientKey]);

  const handlePasswords = async (password) => {
    setErrorMessage('');
    setModalVisible(false);
    try {
      let { publicKey } = await accountLogin(tagID, password);
      if (publicKey) {
        setRecipientKey(publicKey);
      } else {
        console.error('Cannot complete handlePasswords. Key is not defined.');
      }
    } catch (error) {
      console.error('Cannot complete handlePasswords: ', error);
    }
  };

  const confirmSign = async (password) => {
    setErrorMessage('');
    setSignModal(false);
    setLoading(true);
    try {
      let receipt = await signAndSend(tagID, password, amount, recipientKey, gas, publicKey);
      setReceipt(receipt);
      navigation.navigate('Account', { publicKey });
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
            <Text style={styles.textMargin} variant='titleMedium'>Input or scan card for recipient address. (1/3) </Text>
            <TextInput
              mode="outlined"
              style={styles.textInput}
              placeholder="Recipient address..."
              value={recipientKey}
              onChangeText={recipientKey => setRecipientKey(recipientKey)}
              returnKeyType={'done'}
            />
            <Text style={styles.textMargin} variant='titleMedium'>or</Text>
            <CustomButton text="Scan Recipient's Card" type='primary' size='large' onPress={() => { handleScanCardPress(); }} />
          </View>
        );
      case 1:
        return (
          <View style={styles.inputContainer}>
            <Text style={styles.textMargin} variant='titleMedium'>How much would you like to send? (2/3)</Text>
            <TextInput
              mode="outlined"
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
      case 2:
        return (
          <View style={styles.inputContainer}>
            <Card style={styles.confirmCard}>
              <Text style={styles.textMargin} variant='titleLarge'>Confirm Details (3/3)</Text>
              <Text style={styles.textMargin} variant='titleMedium'>{publicKey}</Text>
              <Text style={styles.textMargin} variant='titleLarge'>Sending {amount} ETH to:</Text>
              <Text style={styles.textMargin} variant='titleMedium'>{recipientKey}</Text>
              <Text style={styles.textMargin} variant='titleLarge'>Estimated gas {gas} ETH</Text>
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
            <CustomButton text='Continue' type='primary' size='large' onPress={handleNextStep} />
            <CustomButton text='Go Back' type='secondary' size='large' onPress={() => { handleTransferPress(); }} />
          </View>
        );
      case 1:
        return (
          <View style={styles.bottomContainer}>
            <CustomButton text='Continue' type='primary' size='large' onPress={handleNextStep} />
            <CustomButton text='Go Back' type='secondary' target='Account' size='large' onPress={() => { handlePreviousStep(); setInputError(''); }} />
          </View>
        );
      case 2:
        return (
          <View style={styles.bottomContainer}>
            <CustomButton text='Sign and Send' type='primary' size='large' onPress={() => { handleSignAndSend(); }} />
            <CustomButton text='Go Back' type='secondary' target='Account' size='large' onPress={handlePreviousStep} />
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
          <Text variant='titleLarge'>Follow the prompts to transfer ETH to another wallet.</Text>
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
        title='Enter the recipients password.'
        changeGifSource={null}
      />

      <InputModal
        visible={signModal}
        closeModal={() => setSignModal(false)}
        handlePasswords={confirmSign}
        title='Enter your password to confirm and send this transaction.'
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
}

export default Pay;