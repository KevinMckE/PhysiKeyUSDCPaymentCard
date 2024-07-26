// libraries
import React, { useState } from 'react';
import { View, ActivityIndicator, ImageBackground } from 'react-native';
import { Text, TextInput } from 'react-native-paper';
// context
import { AccountContext } from '../contexts/AccountContext';
// components
import InputModal from '../components/InputModal';
import AndroidScanModal from '../components/AndroidScanModal';
import CustomButton from '../components/CustomButton';
// functions
import { accountLogin, transferUSDC } from '../functions/core/accountFunctions';
import { scanSerialForKey } from '../functions/core/scanSerialForKey';
import { cancelNfc } from '../functions/core/cancelNfcRequest';
// styles
import styles from '../styles/common';

const Send = ({ navigation, route }) => {

  const { publicKey, accountName, balance } = useContext(AccountContext);

  const [step, setStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [receipt, setReceipt] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  const [signModal, setSignModal] = useState(false);
  const [tagID, setTagID] = useState('');
  const [recipTag, setRecipTag] = useState('');
  const [scanModal, setScanModal] = useState(false);
  const [recipientKey, setRecipientKey] = useState('');
  const [amount, setAmount] = useState('');
  const [inputError, setInputError] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [isSuccess, setSuccess] = useState(false);

  const handleTransferPress = () => {
    navigation.navigate('Home');
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
        if (parseFloat(amount) > 0) {
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
        setRecipTag(tag);
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

  const handleRecipPassword = async (password) => {
    setErrorMessage('');
    setModalVisible(false);
    try {
      let account = await accountLogin(recipTag, password);
      setRecipientKey(account.address);
    } catch (error) {
      console.error('Cannot complete handlePasswords: ', error);
    }
  };

  const confirmSign = async (password) => {
    setErrorMessage('');
    setSignModal(false);
    setLoading(true);
    try {
      let receipt = await transferUSDC(tagID, password, amount, recipientKey);
      setReceipt(receipt);
      console.log(receipt);
      navigation.navigate('Home');
    } catch (error) {
      console.error('Cannot complete confirmSign: ', error.message);
      setLoading(false);

    } finally {
      setLoading(false);
    }
  };

  const renderStep = () => {
    switch (step) {
      case 0:
        return (
          <View style={styles.inputContainer}>
            <Text style={styles.textMargin} variant='titleMedium'>(1/3) Input a recipient address.  You can also scan a card to populate this field.</Text>
            <TextInput
              mode="outlined"
              style={styles.textInput}
              theme={{ colors: { primary: 'green' } }}
              placeholder="Recipient Address"
              value={recipientKey}
              onChangeText={recipientKey => setRecipientKey(recipientKey)}
              returnKeyType={'done'}
            />
            <Text style={styles.textMargin} variant='titleMedium'>or</Text>
            <CustomButton text="Scan Recipient's Card" type='primary' size='large' onPress={() => { handleScanCardPress(); }} />
            {errorMessage ? (
              <Text style={styles.errorText}>{errorMessage}</Text>
            ) : null}
          </View>
        );
      case 1:
        return (
          <View style={styles.inputContainer}>
            <Text style={styles.textMargin} variant='titleMedium'>(2/3) How much would you like to send? Please note there will be a 0% transaction fee.</Text>
            <TextInput
              mode="outlined"
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
      case 2:
        return (
          <View style={styles.inputContainer}>
            <Text style={styles.textMargin} variant='titleLarge'>(3/3) Review Details.  You will scan your card to confirm the transaction.</Text>
            <Text style={styles.textMargin} variant='titleMedium'>You are is sending {amount} USDC to:</Text>
            <Text style={styles.textMargin} variant='titleMedium'>{recipientKey}</Text>
            <Text style={styles.textMargin} variant='titleMedium'>The fee for this transaction is {`0%`}</Text>
            <Text style={styles.textMargin} variant='titleMedium'>Total transaction amount is {amount} USDC</Text>
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
            <CustomButton text='Confirm Recipient' type='primary' size='large' onPress={handleNextStep} />
            <CustomButton text='Go Back' type='secondary' size='large' onPress={() => { handleTransferPress(); }} />
          </View>
        );
      case 1:
        return (
          <View style={styles.bottomContainer}>
            <CustomButton text='Confirm Amount' type='primary' size='large' onPress={handleNextStep} />
            <CustomButton text='Go Back' type='secondary' target='Account' size='large' onPress={() => { handlePreviousStep(); setInputError(''); }} />
          </View>
        );
      case 2:
        return (
          <View style={styles.bottomContainer}>
            <CustomButton text='Confirm and Send' type='primary' size='large' onPress={() => { handleSignAndSend(); }} />
            <CustomButton text='Go Back' type='secondary' target='Account' size='large' onPress={handlePreviousStep} />
          </View>
        );
      default:
        return null;
    }
  };

  return (
    <>
      <ImageBackground
        source={require('../assets/background.png')}
        style={{ flex: 1, width: '100%', height: '100%' }}
      >
        <View style={styles.container}>
          {loading && (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color="#7FA324" />
            </View>
          )}
          <View style={styles.topContainer}>
            <Text variant='titleLarge'>Follow the prompts to transfer USDC to another wallet.</Text>
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
          handlePasswords={handleRecipPassword}
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
      </ImageBackground>
    </>
  );
}

export default Send;