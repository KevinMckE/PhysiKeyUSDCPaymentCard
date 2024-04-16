import React, { useState, useEffect } from 'react';
import { View, ImageBackground, ActivityIndicator } from 'react-native';
import { Text, TextInput } from 'react-native-paper';
import InputModal from '../components/InputModal';
import AndroidScanModal from '../components/AndroidScanModal';
import CustomButton from '../components/CustomButton';
import CustomSnackbar from '../components/CustomSnackbar';
import { accountLogin, signAndSend } from '../functions/accountFunctions';
import { scanSerialForKey } from '../functions/scanSerialForKey';
import { getGasEstimate } from '../functions/getGasEstimate';
import { cancelNfc } from '../functions/cancelNfcRequest';
import styles from '../styles/common';

const Request = ({ navigation, route }) => {
  const [step, setStep] = useState(0);
  const [gas, setGas] = useState('');
  const [loading, setLoading] = useState(false);
  const [receipt, setReceipt] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  const [signModal, setSignModal] = useState(false);
  const [tagID, setTagID] = useState('');
  const [scanModal, setScanModal] = useState(false);
  const [amount, setAmount] = useState('');
  const [inputError, setInputError] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [snackbarVisible, setSnackbarVisible] = useState(false);
  const [snackbarText, setSnackbarText] = useState('');
  const [isSuccess, setSuccess] = useState(false);

  const { publicKey } = route.params;
  const recipientKey = publicKey;
  const handleTransferPress = () => {
    navigation.navigate('Account', { publicKey, snackbarMessage: 'Succesfully logged in!' });
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

  const handSignAndSend = () => {
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

  const handleSnackbar = (success, text) => {
    setSuccess(success);
    setSnackbarText(text);
    setSnackbarVisible(true);
  };

  const confirmSign = async (password) => {
    handleSnackbar(true, '(1/2) Beginning the transfer...');
    setErrorMessage('');
    setSignModal(false);
    setLoading(true);
    try {
      handleSnackbar(true, '(2/2) Retrieving the receipt...');
      let receipt = await signAndSend(tagID, password, amount, recipientKey, gas, publicKey);
      setReceipt(receipt);
      navigation.navigate('Account', { publicKey, snackbarMessage: 'Successfully transfered Ether!' });
    } catch (error) {
      console.error('Cannot complete confirmSign: ', error);
      handleSnackbar(false, `There was an issue: ${error}`);
    } finally {
      setLoading(false);
    }
  };

  const renderStep = () => {
    switch (step) {
      case 0:
        return (
          <View style={styles.inputContainer}>
            <Text style={styles.textMargin} variant='titleMedium'>How much are you requesting?</Text>
            <TextInput
              mode="outlined"
              style={styles.textInput}
              placeholder="Amount..."
              value={amount}
              onChangeText={amount => setAmount(amount)}
            />
            {errorMessage ? (
              <Text style={styles.errorText}>{errorMessage}</Text>
            ) : null}
          </View>
        );
      case 1:
        return (
          <View style={styles.inputContainer}>
            <Text style={styles.textMargin} variant='titleLarge'>Confirm Details</Text>
            <Text style={styles.textMargin} variant='titleMedium'>{publicKey}</Text>
            <Text style={styles.textMargin} variant='titleLarge'>Sending {amount} ETH to:</Text>
            <Text style={styles.textMargin} variant='titleMedium'>{recipientKey}</Text>
            <Text style={styles.textMargin} variant='titleLarge'>Estimated gas {gas} ETH</Text>
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
            <CustomButton text='Review' type='primary' size='large' onPress={handleNextStep} />
            <CustomButton text='Go Back' type='secondary' size='large' onPress={() => { handleTransferPress(); }} />
          </View>
        );
      case 1:
        return (
          <View style={styles.bottomContainer}>
            <CustomButton text='Sign' type='primary' size='large' onPress={handleNextStep} />
            <CustomButton text='Go Back' type='secondary' target='Account' size='large' onPress={() => { handlePreviousStep(); setInputError(''); }} />
          </View>
        );
      default:
        return null;
    }
  };

  return (

    <ImageBackground
      source={require('../assets/tech_pattern.jpg')}
      style={{ flex: 1, width: '100%', height: '100%' }}
    >
      <View style={styles.container}>
        {loading && (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#0000ff" />
          </View>
        )}
        <View style={styles.topContainer}>
          <Text variant='titleLarge'>Input request amount and tap the request button.</Text>
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

      <CustomSnackbar
        visible={snackbarVisible}
        onDismiss={() => setSnackbarVisible(false)}
        duration={3000}
        text={snackbarText}
        isSuccess={isSuccess}
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
    </ImageBackground>
  );
}

export default Request;