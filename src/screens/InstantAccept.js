/////////////////////////////////
// INSTANT ACCEPT PAGE //////////
// Randomly generated wallet   //
// thats saved to the device   //
// allows users to quickly     //
// accept payment              //
// RegenCard 2024              //
/////////////////////////////////

// libraries
import React, { useState, useEffect, useContext } from 'react';
import { View, Pressable, KeyboardAvoidingView, ImageBackground, ScrollView, Image, Platform, Keyboard } from 'react-native';
import * as Keychain from 'react-native-keychain';
import { Text, TextInput, Card } from 'react-native-paper';
// context 
import { AccountContext } from '../contexts/AccountContext';
// components
import InputModal from '../components/InputModal';
import AndroidScanModal from '../components/AndroidScanModal';
import CustomButton from '../components/CustomButton';
import TooltipComponent from '../components/ToolTip';
import LoadingOverlay from '../components/LoadingOverlay';
// functions 
import { transferUSDC } from '../functions/core/accountFunctions';
import { scanSerialForKey } from '../functions/core/scanSerialForKey';
import { cancelNfc } from '../functions/core/cancelNfcRequest';
import { accountLogin } from '../functions/core/accountFunctions';
// styles
import styles from '../styles/common';

const InstantAccept = ({ navigation }) => {

  const { publicKey, loading, setIsLoading, setNewPublicKey, setStatusMessage, setNewBalance } = useContext(AccountContext);

  const [step, setStep] = useState(0);
  const [success, setSuccess] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [tagID, setTagID] = useState('');
  const [scanModal, setScanModal] = useState(false);
  const [amount, setAmount] = useState('');
  const [inputError, setInputError] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [keyboardVisible, setKeyboardVisible] = useState(false);
  const [tooltipVisible, setTooltipVisible] = useState(false);

  useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener('keyboardDidShow', () => {
      setKeyboardVisible(true);
    });
    const keyboardDidHideListener = Keyboard.addListener('keyboardDidHide', () => {
      setKeyboardVisible(false);
    });

    return () => {
      keyboardDidShowListener.remove();
      keyboardDidHideListener.remove();
    };
  }, []);

  useEffect(() => {
    const getDefaultAccount = async () => {
      const username = "Default";
      try {
        const credentials = await Keychain.getGenericPassword();
        if (credentials && credentials.username === username) {
          console.log('Account exists...');
          const account = await accountLogin(credentials.password, credentials.password);
          setNewPublicKey(account.address);
          setNewBalance(account.address);
        } else {
          console.log('No account found...');
          navigation.navigate('InstantAcceptLogin');
          return null; 
        }
      } catch (error) {
        console.error("Error retrieving account: ", error);
        navigation.navigate('Landing');
      }
    };
    getDefaultAccount();
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
    try {
      setIsLoading(true);
      let receipt = await transferUSDC(tagID, password, amount, publicKey);
      setStatusMessage(receipt);
      setSuccess(true);
      setIsLoading(false);
      handleNextStep();
    } catch (error) {
      setErrorMessage(error);
      setIsLoading(false);
      setSuccess(false);
      handleNextStep();
      console.error('Cannot complete handlePasswords: ', error);
    }
  };

  const renderStep = () => {
    switch (step) {
      case 0:
        return (
          <>
            <TooltipComponent
              tooltipVisible={tooltipVisible}
              setTooltipVisible={setTooltipVisible}
              title="(1/2) Input USDC Amount."
              text="*USDC on Optimism network"
              content="Enter a valid amount. To be valid the number must be greater than zero."
            />
            <View style={[styles.inputContainer, keyboardVisible && styles.inputContainerKeyboard]}>

              <TextInput
                mode="outlined"
                autoFocus={true}
                style={styles.textInput}
                theme={{ colors: { primary: '#2E3C49' } }}
                placeholder="Amount"
                value={amount}
                onChangeText={amount => setAmount(amount)}
                returnKeyType={'done'}
                keyboardType={'numeric'}
              />
              <View style={styles.errorContainer}>
                <Text style={styles.errorText}>{inputError}</Text>
              </View>
            </View>
            <View style={[styles.bottomContainer, keyboardVisible && styles.bottomContainerKeyboard]}>
              <CustomButton text='Go Back' type='secondary' size='large' onPress={() => navigation.navigate('Landing')} />
              <CustomButton text='Continue' type='primary' size='large' onPress={handleNextStep} />
            </View>
          </>
        );
      case 1:
        return (
          <>
            <TooltipComponent
              tooltipVisible={tooltipVisible}
              setTooltipVisible={setTooltipVisible}
              title="(2/2) Review Details."
              content="We recommend verifying the 'paid to' address matches that in your account details."
            />
            <View style={[styles.inputContainer, keyboardVisible && styles.inputContainerKeyboard]}>
              <Text style={styles.textMargin} variant='titleMedium'>{amount} USDC on Optimism network will be paid to: </Text>
              <Text style={styles.textMargin} variant='titleMedium'>{publicKey}</Text>
              <View style={styles.errorContainer}>
                <Text style={styles.errorText}>{inputError}</Text>
              </View>
            </View>
            <View style={[styles.bottomContainer, keyboardVisible && styles.bottomContainerKeyboard]}>
              <CustomButton text='Go Back' type='secondary' size='large' onPress={() => { handlePreviousStep(); setInputError(''); }} />
              <CustomButton text='Scan Card' type='primary' size='large' onPress={() => { handleScanCardPress(); }} />
            </View>
          </>
        );
      case 2:
        return success ? (
          <>
            <View style={[styles.inputContainer, keyboardVisible && styles.inputContainerKeyboard]}>
              <Text style={styles.textMargin} variant='titleLarge'>Success!</Text>
            </View>
            <View style={[styles.inputContainer, keyboardVisible && styles.inputContainerKeyboard]}>
              <Text style={styles.textMargin} variant='titleMedium'>Return to perform another transaction or transfer assets.</Text>
              <View style={styles.errorContainer}>
                <Text style={styles.errorText}>{inputError}</Text>
              </View>
            </View>
            <View style={[styles.bottomContainer, keyboardVisible && styles.bottomContainerKeyboard]}>
              <CustomButton text='Return' type='primary' size='large' onPress={() => setStep(0)} />
              <CustomButton text='Transfer Assets' type='secondary' size='large' onPress={() => { setNewBalance(publicKey); navigation.navigate('InstantAcceptAccount'); }} />
            </View>
          </>
        ) : (
          <>
            <View style={[styles.inputContainer, keyboardVisible && styles.inputContainerKeyboard]}>
              <Text style={styles.textMargin} variant='titleLarge'>Failed!</Text>
            </View>
            <View style={[styles.inputContainer, keyboardVisible && styles.inputContainerKeyboard]}>
              <Text style={styles.textMargin} variant='titleMedium'>{errorMessage}</Text>
            </View>
            <View style={[styles.bottomContainer, keyboardVisible && styles.bottomContainerKeyboard]}>
              <CustomButton text='Try Again' type='primary' size='large' onPress={() => setStep(0)} />
            </View>
          </>
        );
      default:
        return null;
    }
  };

  return (
    <>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
      >
        <ImageBackground
          source={require('../assets/background.png')}
          style={{ flex: 1, width: '100%', height: '100%' }}
        >
          <ScrollView contentContainerStyle={{ flexGrow: 1 }} keyboardShouldPersistTaps='handled'>
            <View style={styles.container}>
              <LoadingOverlay loading={loading} />
              <Pressable onPress={() => { setNewBalance(publicKey); navigation.navigate('InstantAcceptAccount', { publicKey }); }}>
                <Card style={styles.card}>
                  <View style={styles.keyContent}>
                    <Text>Account (Optimism network): {publicKey.slice(0, 7)}...{publicKey.slice(-5)}</Text>
                    <Image
                      source={require('../assets/icons/user_setting.png')}
                      style={styles.copyImage}
                    />
                  </View>
                </Card>
              </Pressable>
              {renderStep()}
            </View>
          </ScrollView>
        </ImageBackground >
      </KeyboardAvoidingView >

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
