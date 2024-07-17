import React, { useState, useEffect } from 'react';
import { View, ActivityIndicator, Image, Pressable, Platform } from 'react-native';
import { Text, TextInput, Card } from 'react-native-paper';
import AsyncStorage from '@react-native-async-storage/async-storage';
//
import InputModal from '../components/InputModal';
import AndroidScanModal from '../components/AndroidScanModal';
import CustomButton from '../components/CustomButton';
//
import { transferUSDC } from '../functions/core/accountFunctions';
import { scanSerialForKey } from '../functions/core/scanSerialForKey';
import { cancelNfc } from '../functions/core/cancelNfcRequest';
import { accountLogin } from '../functions/core/accountFunctions';
//
import styles from '../styles/common';

const randomstring = require('randomstring');

const InstantAccept = ({ navigation }) => {
  const [step, setStep] = useState(0);
  const [loading, setLoading] = useState(true);
  const [receipt, setReceipt] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  const [publicKey, setPublicKey] = useState('');
  const [tagID, setTagID] = useState('');
  const [scanModal, setScanModal] = useState(false);
  const [amount, setAmount] = useState('');
  const [inputError, setInputError] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  
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
          setPublicKey(account.address); 
        } else {
          console.log('account exists...')
          const account = await accountLogin(storedValue, storedValue);
          setPublicKey(account.address); 
        }
      } catch (error) {
        console.error("Error initializing account: ", error);
      }
    };

    initializeAccount();
    setLoading(false);
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
      setLoading(false);
      handleNextStep();
    } catch (error) {
      setErrorMessage(error.message);
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
            <Text style={styles.textMargin} variant='titleLarge'>(2/2) Review Details.</Text>
            <Text style={styles.textMargin} variant='titleMedium'>{amount} USDC will being paid to: </Text>
            <Text style={styles.textMargin} variant='titleMedium'>{publicKey}</Text>
            {errorMessage ? (
              <Text style={styles.errorText}>{errorMessage}</Text>
            ) : null}
          </View>
        );
      case 2:
        return (
          <View style={styles.inputContainer}>
            <Text style={styles.textMargin} variant='titleLarge'>Success! Return to perform another transaction.</Text>
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
            <CustomButton text='Go Back' type='secondary' target='Account' size='large' onPress={() => { navigation.navigate('Landing') }} />
          </View>
        );
      case 1:
        return (
          <View style={styles.bottomContainer}>
            <CustomButton text='Scan Card and Send' type='primary' size='large' onPress={() => { handleScanCardPress(); }} />
            <CustomButton text='Go Back' type='secondary' size='large' onPress={() => { handlePreviousStep(); setInputError(''); }} />
          </View>
        );
      case 2:
        return (
          <View style={styles.bottomContainer}>
            <CustomButton text='Return' type='primary' size='large' onPress={() => { setStep(0) }} />
            <CustomButton text='Transfer Assets' type='secondary' size='large' onPress={() => { navigation.navigate('InstantAcceptTransfer', { publicKey }) }} />
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
      </View >

      <InputModal
        visible={modalVisible}
        closeModal={() => setModalVisible(false)}
        handlePasswords={handlePasswords}
        title='Enter your password.'
      />

      {
        Platform.OS === 'android' && ( // Render modal only on Android
          <AndroidScanModal
            visible={scanModal}
            closeScanModal={closeScanModal}
          />
        )
      }
    </>
  );
}

export default InstantAccept;

/*
{"address": "0x8EE908f003B039aEbD870b89EdE4BcFFBEdb9d52", "client": {"account": undefined, "batch": undefined, "cacheTime": 4000, "call": [Function call], "ccipRead": undefined, "chain": undefined, "createBlockFilter": [Function createBlockFilter], "createContractEventFilter": [Function createContractEventFilter], "createEventFilter": [Function createEventFilter], "createPendingTransactionFilter": [Function createPendingTransactionFilter], "estimateContractGas": [Function estimateContractGas], "estimateFeesPerGas": [Function estimateFeesPerGas], "estimateGas": [Function estimateGas], "estimateMaxPriorityFeePerGas": [Function estimateMaxPriorityFeePerGas], "extend": [Function anonymous], "getBalance": [Function getBalance], "getBlobBaseFee": [Function getBlobBaseFee], "getBlock": [Function getBlock], "getBlockNumber": [Function getBlockNumber], "getBlockTransactionCount": [Function getBlockTransactionCount], "getBytecode": [Function getBytecode], "getChainId": [Function getChainId], "getCode": [Function getCode], "getContractEvents": [Function getContractEvents], "getEip712Domain": [Function getEip712Domain], "getEnsAddress": [Function getEnsAddress], "getEnsAvatar": [Function getEnsAvatar], "getEnsName": [Function getEnsName], "getEnsResolver": [Function getEnsResolver], "getEnsText": [Function getEnsText], "getFeeHistory": [Function getFeeHistory], "getFilterChanges": [Function getFilterChanges], "getFilterLogs": [Function getFilterLogs], "getGasPrice": [Function getGasPrice], "getLogs": [Function getLogs], "getProof": [Function getProof], "getStorageAt": [Function getStorageAt], "getTransaction": [Function getTransaction], "getTransactionConfirmations": [Function getTransactionConfirmations], "getTransactionCount": [Function getTransactionCount], "getTransactionReceipt": [Function getTransactionReceipt], "key": "public", "multicall": [Function multicall], "name": "Public Client", "pollingInterval": 4000, "prepareTransactionRequest": [Function prepareTransactionRequest], "readContract": [Function readContract], "request": [Function anonymous], "sendRawTransaction": [Function sendRawTransaction], "simulateContract": [Function simulateContract], "transport": {"fetchOptions": undefined, "key": "http", "name": "HTTP JSON-RPC", "request": [Function request], "retryCount": 3, "retryDelay": 150, "timeout": 10000, "type": "http", "url": "https://api.developer.coinbase.com/rpc/v1/base-sepolia/IA6ru-E7imSIFQpmKGOzYYjXvryTrRME"}, "type": "publicClient", "uid": "0f1b5286cd8", "uninstallFilter": [Function uninstallFilter], "verifyMessage": [Function verifyMessage], "verifySiweMessage": [Function verifySiweMessage], "verifyTypedData": [Function verifyTypedData], "waitForTransactionReceipt": [Function waitForTransactionReceipt], "watchBlockNumber": [Function watchBlockNumber], "watchBlocks": [Function watchBlocks], "watchContractEvent": [Function watchContractEvent], "watchEvent": [Function watchEvent], "watchPendingTransactions": [Function watchPendingTransactions]}, "encodeCallData": [Function encodeCallData], "encodeDeployCallData": [Function encodeDeployCallData], "entryPoint": "0x5FF137D4b0FDCD49DcA30c7CF57E578a026d2789", "getDummySignature": [Function getDummySignature], "getFactory": [Function getFactory], "getFactoryData": [Function getFactoryData], "getInitCode": [Function getInitCode], "getNonce": [Function getNonce], "nonceManager": undefined, "publicKey": "0x8EE908f003B039aEbD870b89EdE4BcFFBEdb9d52", "signMessage": [Function signMessage], "signTransaction": [Function signTransaction], "signTypedData": [Function signTypedData], "signUserOperation": [Function signUserOperation], "source": "SimpleSmartAccount", "type": "local"}
*/