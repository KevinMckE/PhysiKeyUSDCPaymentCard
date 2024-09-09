/////////////////////////////////
// ACCOUNT REQUEST USDC       ///
// Request Payment from        //
// another card                //
//                             //
// RegenCard 2024           /////
/////////////////////////////////

// libraries
import React, { useState, useEffect, useContext, useRef, useCallback } from 'react';
import { View, KeyboardAvoidingView, ImageBackground, Image, Platform, Keyboard, TextInput, Pressable } from 'react-native';
import { useNavigationState, useFocusEffect } from '@react-navigation/native';
import * as Keychain from 'react-native-keychain';
// context
import { AccountContext } from '../contexts/AccountContext';
// components
import InputModal from '../components/InputModal';
import AndroidScanModal from '../components/AndroidScanModal';
import CustomButton from '../components/CustomButton';
import TooltipComponent from '../components/ToolTip';
import LoadingOverlay from '../components/LoadingOverlay';
import Text from '../components/CustomText';
import AccountButton from '../components/AccountButton';
// functions
import { accountLogin, transferUSDC } from '../functions/core/accountFunctions';
import { scanSerialForKey } from '../functions/core/scanSerialForKey';
import { cancelNfc } from '../functions/core/cancelNfcRequest';
import { generateRandomString } from '../functions/core/generateRandomString';
// styles
import styles from '../styles/common';

const Request = ({ navigation }) => {
  const navigationState = useNavigationState(state => state);
  const previousRouteName = navigationState.routes[navigationState.index - 1]?.name;

  const { publicKey, loading, setIsLoading, setStatusMessage, setNewPublicKey, setNewName, setIsCard, updateAccount } = useContext(AccountContext);

  const [step, setStep] = useState(0);
  const [success, setSuccess] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [tagID, setTagID] = useState('');
  const [scanModal, setScanModal] = useState(false);
  const [amount, setAmount] = useState();
  const [rawInput, setRawInput] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [inputError, setInputError] = useState('');
  const [keyboardVisible, setKeyboardVisible] = useState(false);
  const [keyboardHeight, setKeyboardHeight] = useState(0);
  const [tooltipVisible, setTooltipVisible] = useState(false);

  const textInputRef = useRef(null);

  useEffect(() => {
    if (previousRouteName === "Landing") {
      const getDefaultAccount = async () => {
        setIsLoading(true);
        setIsCard(true);
        const username = "Default";
        try {
          const credentials = await Keychain.getGenericPassword();
          if (credentials && credentials.username === username) {
            console.log('Account exists...');
            const account = await accountLogin(credentials.password, credentials.password);
            setNewPublicKey(account.address);
            setNewName(username);
            updateAccount(account.address);
          } else {
            console.log('No account found...');
            const password = await generateRandomString(70);
            await Keychain.setGenericPassword(username, password);
            const account = await accountLogin(password, password);
            setNewPublicKey(account.address);
            setNewName(username);
            updateAccount(account.address);
          }
        } catch (error) {
          console.error("Error retrieving account: ", error);
          navigation.navigate('Landing');
        } finally {
          setIsLoading(false);
        }
      };
      getDefaultAccount();
    }
  }, []);

  useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener('keyboardDidShow', (event) => {
      setKeyboardVisible(true);
      setKeyboardHeight(event.endCoordinates.height);
    });
    const keyboardDidHideListener = Keyboard.addListener('keyboardDidHide', () => {
      setKeyboardVisible(false);
      setKeyboardHeight(0);
    });

    return () => {
      keyboardDidShowListener.remove();
      keyboardDidHideListener.remove();
    };
  }, []);

  useEffect(() => {
    if (!loading && textInputRef.current) {
      const timer = setTimeout(() => {
        textInputRef.current?.focus();
      }, 1000);
      return () => clearTimeout(timer); 
    }
  }, [loading]);

  useFocusEffect(
    useCallback(() => {
      return () => {
        setStep(0);        
        setAmount();
        setRawInput('');      
      };
    }, [])
  );

  const handleNextStep = () => {
    switch (step) {
      case 0:
        if (parseFloat(amount) > 0) {
          setStep(step + 1);
          setInputError('');
        } else {
          setInputError('Please enter a valid number.')
        }
        break;
      case 1:
        setStep(step + 1);
        break;
      default:
        break;
    }
  };

  const handlePreviousStep = () => {
    setStep(step - 1);
  };

  const handleAmountChange = (input) => {
    const validNumberRegex = /^(\d+(\.\d*)?|\.\d+)$/;
    setRawInput(input);
    if (validNumberRegex.test(input) || input === '') {
      setAmount(input);
      setInputError('');
    } else {
      setInputError('Please enter a valid number.');
    }
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
    let totalAmount = parseFloat(amount);
    try {
      setIsLoading(true);
      let receipt = await transferUSDC(tagID, password, totalAmount, publicKey);
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
            <View style={{ flex: 2, margin: 16 }}>
              <TooltipComponent
                tooltipVisible={tooltipVisible}
                setTooltipVisible={setTooltipVisible}
                title="Input USDC Amount."
                text="*USDC on Optimism network"
                content="Valid numbers are greater than 0 and formatted correctly."
              />
            </View>
            <Pressable onPress={() => textInputRef.current.focus()} style={{ flex: 4, margin: 16 }}>
              <View style={{ justifyContent: 'center', flexDirection: 'row' }}>
                <TextInput
                  ref={textInputRef}
                  style={styles.amountInput}
                  selectionColor={'#000000'}
                  placeholder="0"
                  value={rawInput}
                  onChangeText={handleAmountChange}
                  returnKeyType={'done'}
                  keyboardType={'numeric'}
                />
                <Text size={"large"} color={"#000000"} text={'  USDC'} />
              </View>
              <Text size={"small"} color={"#ff0000"} text={inputError} style={{ textAlign: 'center' }} />
            </Pressable>
            <View style={[{ flex: 2 }, keyboardVisible && { marginBottom: (keyboardHeight + 32) }]}>
              <View style={styles.buttonContainer}>
                <CustomButton text='Go Back' type='secondary' size='small' onPress={() => { Keyboard.dismiss(); navigation.goBack(); }} />
                <CustomButton text='Continue' type='primary' size='small' onPress={handleNextStep} />
              </View>
              <AccountButton
                publicKey={publicKey}
                updateAccount={updateAccount}
                navigation={navigation}
              />
            </View>
          </>
        );
      case 1:
        return (
          <>
            <View style={{ flex: 2, margin: 16 }}>
              <TooltipComponent
                tooltipVisible={tooltipVisible}
                setTooltipVisible={setTooltipVisible}
                title="Review Details."
                content="We recommend verifying the 'paid to' address matches that in your account details below."
              />
            </View>
            <View style={{ flex: 4, margin: 16 }}>
              <View style={{ justifyContent: 'center', flexDirection: 'row', margin: 16 }}>
                <Text size={"xl"} color={"#000000"} text={`${amount} USDC`} />
              </View>
              <Text size={"medium"} color={"#000000"} text={"Will be paid to: "} />
              <Text size={"medium"} color={"#000000"} text={publicKey} />
            </View>
            <View style={{ flex: 2 }}>
              <View style={styles.buttonContainer}>
                <CustomButton text='Go Back' type='secondary' size='small' onPress={() => { handlePreviousStep(); }} />
                <CustomButton text='Scan Card' type='primary' size='small' onPress={() => { handleScanCardPress(); }} />
              </View>
              <AccountButton
                publicKey={publicKey}
                updateAccount={updateAccount}
                navigation={navigation}
              />
            </View>
          </>
        );
      case 2:
        return success ? (
          <>
            <View style={[{ flex: 6, margin: 16, justifyContent: 'center' }, styles.center]}>
              <Image
                source={require('../assets/icons/success.png')}
                style={{ width: 128, height: 128 }}
              />
              <Text size={"xl"} color={"#000000"} text={"Success!"} />
              <Text size={"medium"} color={"#000000"} text={"You can now view the transaction in your account details."} />
            </View>
            <View style={[{ flex: 2 }, styles.center]}>
              <CustomButton text='Accept Payment' type='primary' size='large' onPress={() => { setStep(0); setRawInput(''); }} />
              <AccountButton
                publicKey={publicKey}
                updateAccount={updateAccount}
                navigation={navigation}
              />
            </View>
          </>
        ) : (
          <>
            <View style={[{ flex: 6, margin: 16, justifyContent: 'center' }, styles.center]}>
              <Image
                source={require('../assets/icons/failure.png')}
                style={{ width: 128, height: 128 }}
              />
              <Text size={"xl"} color={"#000000"} text={"Failure!"} />
              <Text size={"medium"} color={"#000000"} text={"There was an error and this payment was declined."} />
            </View>
            <View style={[{ flex: 2 }, styles.center]}>
              <CustomButton text='Try Again' type='primary' size='large' onPress={() => { setStep(0) }} />
              <AccountButton
                publicKey={publicKey}
                updateAccount={updateAccount}
                navigation={navigation}
              />
            </View>
          </>
        );
      default:
        return null;
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : null}
      style={{ flex: 1 }}
    >
      <ImageBackground
        source={require('../assets/background.png')}
        style={{ flex: 1, width: '100%', height: '100%' }}
      >
        <LoadingOverlay loading={loading} />
        {renderStep()}
      </ImageBackground >

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
    </KeyboardAvoidingView>
  );
}

export default Request;