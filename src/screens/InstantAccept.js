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
import { View, Pressable, KeyboardAvoidingView, ActivityIndicator, ImageBackground, ScrollView, TouchableOpacity, Image, Platform, Keyboard } from 'react-native';
import { Text, TextInput, Card } from 'react-native-paper';
import Tooltip from 'react-native-walkthrough-tooltip';
import AsyncStorage from '@react-native-async-storage/async-storage';
// context 
import { AccountContext } from '../contexts/AccountContext';
// components
import InputModal from '../components/InputModal';
import AndroidScanModal from '../components/AndroidScanModal';
import CustomButton from '../components/CustomButton';
// functions 
import { transferUSDC } from '../functions/core/accountFunctions';
import { scanSerialForKey } from '../functions/core/scanSerialForKey';
import { cancelNfc } from '../functions/core/cancelNfcRequest';
import { accountLogin } from '../functions/core/accountFunctions';
// 
import styles from '../styles/common';

const randomstring = require('randomstring');

const InstantAccept = ({ navigation }) => {

  const { publicKey, loading, setNewPublicKey, setStatusMessage } = useContext(AccountContext);

  const [step, setStep] = useState(0);
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
    const initializeAccount = async () => {
      const defaultKey = "default";
      let input = randomstring.generate(35);
      try {
        const storedValue = await AsyncStorage.getItem(defaultKey);
        if (!storedValue) {
          console.log('creating new...')
          await AsyncStorage.setItem(defaultKey, input);
          const account = await accountLogin(input, input);
          setNewPublicKey(account.address);
        } else {
          console.log('account exists...')
          const account = await accountLogin(storedValue, storedValue);
          setNewPublicKey(account.address);
        }
      } catch (error) {
        console.error("Error initializing account: ", error);
      }
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
    try {
      let receipt = await transferUSDC(tagID, password, amount, publicKey);
      setStatusMessage(receipt);
      handleNextStep();
    } catch (error) {
      setErrorMessage(error.message);
      console.error('Cannot complete handlePasswords: ', error);
    }
  };

  const renderStep = () => {
    switch (step) {
      case 0:
        return (
          <>
            <TouchableOpacity style={styles.topContainer} onPress={() => setTooltipVisible(true)}>
              <Text variant='titleLarge'>(1/2) How much USDC?</Text>
              <Image source={require('../assets/icons/info.png')} style={styles.icon} />
            </TouchableOpacity>
            <Tooltip
              isVisible={tooltipVisible}
              content={<Text>Enter a valid value. To be valid enter a number greater than 0.</Text>}
              placement="bottom"
              onClose={() => setTooltipVisible(false)}
            >
              <View />
            </Tooltip>
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
              <CustomButton text='Go Back' type='secondary' size='large' onPress={() => navigation.nagivate('Landing')} />
              <CustomButton text='Continue' type='primary' size='large' onPress={handleNextStep} />
            </View>
          </>
        );
      case 1:
        return (
          <>
            <TouchableOpacity style={styles.topContainer} onPress={() => setTooltipVisible(true)}>
              <Text variant='titleLarge'>(2/2) Review Details. </Text>
              <Image source={require('../assets/icons/info.png')} style={styles.icon} />
            </TouchableOpacity>
            <Tooltip
              isVisible={tooltipVisible}
              content={<Text>We recommend verifying the "paid to" address matches that in your account details.</Text>}
              placement="bottom"
              onClose={() => setTooltipVisible(false)}
            >
              <View />
            </Tooltip>
            <View style={[styles.inputContainer, keyboardVisible && styles.inputContainerKeyboard]}>
              <Text style={styles.textMargin} variant='titleMedium'>{amount} USDC will being paid to: </Text>
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
        return (
          <>
            <View style={[styles.inputContainer, keyboardVisible && styles.inputContainerKeyboard]}>
              <Text style={styles.textMargin} variant='titleLarge'>Success!</Text>
            </View>
            <View style={[styles.inputContainer, keyboardVisible && styles.inputContainerKeyboard]}>
              <Text style={styles.textMargin} variant='titleMedium'>Return to peform another transaction or transfer assets.</Text>
              <View style={styles.errorContainer}>
                <Text style={styles.errorText}>{inputError}</Text>
              </View>
            </View>
            <View style={[styles.bottomContainer, keyboardVisible && styles.bottomContainerKeyboard]}>
              <CustomButton text='Return' type='primary' size='large' onPress={() => { setStep(0) }} />
              <CustomButton text='Transfer Assets' type='secondary' size='large' onPress={() => { navigation.navigate('InstantAcceptTransfer', { publicKey }) }} />
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
          <Pressable onPress={() => navigation.navigate('InstantAcceptAccount', { publicKey })}>
                <Card style={styles.card}>
                  <View style={styles.keyContent}>
                    <Text>Account Details: {publicKey.slice(0, 7)}...{publicKey.slice(-5)}</Text>
                    <Image
                      source={require('../assets/icons/user_setting.png')}
                      style={styles.copyImage}
                    />
                  </View>
                </Card>
              </Pressable>
            <View style={styles.container}>
              {loading && (
                <View style={styles.loadingContainer}>
                  <ActivityIndicator size="large" color="#7FA324" />
                </View>
              )}
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
