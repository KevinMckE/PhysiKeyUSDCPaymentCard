import React, { useState, useEffect, useRef } from 'react';
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
      if (parseFloat(amount) == 0) {
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

  const handlePasswords = async (password) => {
    setErrorMessage('');
    setModalVisible(false);
    try {
      let { publicKey } = await accountLogin(tagID, password);
      if (publicKey) {
        const signedTx = await signTransaction("yourTag", "yourPassword", "0.1", "recipientAddress");
        handleNextStep();
      } else {
        console.error('Cannot complete handlePasswords. Key is not defined.');
      }
    } catch (error) {
      console.error('Cannot complete handlePasswords: ', error);
    }
  };

  const confirmSign = async () => {
    handleSnackbar(true, '(1/2) Beginning the transfer...');
    setErrorMessage('');
    setSignModal(false);
    setLoading(true);
    try {
      handleSnackbar(true, '(2/2) Retrieving the receipt...');
      let receipt = await signAndSend(tagID, senderPassword, amount, publicKey, gas, senderKey);
      setReceipt(receipt);
      navigation.navigate('Account', { publicKey, snackbarMessage: 'Successfully transfered Ether!' });
    } catch (error) {
      console.error('Cannot complete confirmSign: ', error);
      handleSnackbar(false, `There was an issue: ${error}`);
    } finally {
      setLoading(false);
    }
  };
  // Example usage
  async function exampleUsage() {
    try {
      // Step 1: Sign the transaction and store the signed transaction object
      const signedTx = await signTransaction("yourTag", "yourPassword", "0.1", "recipientAddress");

      // Step 2: Store the signed transaction object somewhere, like in a variable or a database
      // For simplicity, let's assume we're storing it in a variable
      const storedSignedTx = signedTx;

      // Later when you're ready to send the transaction

      // Step 3: Retrieve the stored signed transaction object
      // For this example, we'll use the storedSignedTx variable

      // Step 4: Send the signed transaction
      const txReceipt = await sendSignedTransaction(storedSignedTx);
      console.log("Transaction sent. Receipt:", txReceipt);
    } catch (error) {
      console.error("Error:", error);
    }
  }

  const renderStep = () => {
    switch (step) {
      case 0:
        return (
          <View style={styles.inputContainer}>
            <Text style={styles.textMargin} variant='titleMedium'>How much are you requesting?</Text>
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
            <Text style={styles.textMargin} variant='titleLarge'>Confirm Details</Text>
            <Text style={styles.textMargin} variant='titleMedium'>{senderKey}</Text>
            <Text style={styles.textMargin} variant='titleLarge'>Sending {amount} ETH to:</Text>
            <Text style={styles.textMargin} variant='titleMedium'>{publicKey}</Text>
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
            <CustomButton text='Scan Card' type='primary' size='large' onPress={() => { handleScanCardPress(); }} />
            <CustomButton text='Go Back' type='secondary' size='large' onPress={() => { handlePreviousStep(); setInputError(''); }} />
          </View>
        );
      case 1:
        return (
          <View style={styles.bottomContainer}>
            <CustomButton text='Confirm' type='primary' size='large' onPress={() => { confirmSign(); }} />
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
    </ImageBackground>
  );
}

export default Request;