/////////////////////////////////
// SEND USDC                  ///
// Transfer assets from an     //
// account to another          //
//                             //
// RegenCard 2024           /////
/////////////////////////////////

// libraries
import React, { useState, useContext, useEffect } from 'react';
import { View, KeyboardAvoidingView, ImageBackground, ScrollView, Image, Platform, Keyboard } from 'react-native';
import { Text, TextInput } from 'react-native-paper';
// context
import { AccountContext } from '../contexts/AccountContext';
// components
import InputModal from '../components/InputModal';
import AndroidScanModal from '../components/AndroidScanModal';
import CustomButton from '../components/CustomButton';
import TooltipComponent from '../components/ToolTip';
import LoadingOverlay from '../components/LoadingOverlay';
// functions
import { accountLogin, transferUSDC } from '../functions/core/accountFunctions';
import { scanSerialForKey } from '../functions/core/scanSerialForKey';
import { cancelNfc } from '../functions/core/cancelNfcRequest';
// styles
import styles from '../styles/common';

const Send = ({ navigation }) => {

  const { publicKey, loading, setIsLoading, setStatusMessage, setNewBalance, setNewActivity } = useContext(AccountContext);

  const [step, setStep] = useState(0);
  const [modalVisible, setModalVisible] = useState(false);
  const [signModalVisible, setSignModalVisible] = useState(false);
  const [tagID, setTagID] = useState('');
  const [recipTag, setRecipTag] = useState('');
  const [scanModal, setScanModal] = useState(false);
  const [recipientKey, setRecipientKey] = useState('');
  const [amount, setAmount] = useState('');
  const [inputError, setInputError] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [success, setSuccess] = useState(false);
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
        setSignModalVisible(true);
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

  const handlePasswords = async (password) => {
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
    setSignModalVisible(false);
    try {
      setIsLoading(true);
      let receipt = await transferUSDC(tagID, password, amount, recipientKey);
      setStatusMessage(receipt);
      setSuccess(true);
      setIsLoading(false);
      setStep(3);
    } catch (error) {
      console.error('Cannot complete confirmSign: ', error.message);
      setErrorMessage(error.message || 'An error occurred.');
      setIsLoading(false);
      setSuccess(false);
      setStep(3);
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
              title="(1/3) Input recipient address."
              text="*Optimism network only"
              content="You can paste in this value or use a Regen Card to populate the value. This must be an Ethereum address on the Optimism network."
            />
            <View style={[styles.inputContainer, keyboardVisible && styles.inputContainerKeyboard]}>
              <TextInput
                mode="outlined"
                style={styles.textInput}
                theme={{ colors: { primary: '#2E3C49' } }}
                placeholder="Recipient Address"
                value={recipientKey}
                onChangeText={recipientKey => setRecipientKey(recipientKey)}
                returnKeyType={'done'}
              />
              <Text style={styles.textMargin} variant='titleMedium'>or</Text>
              <CustomButton text="Scan Card" type='primary' size='large' onPress={() => { handleScanCardPress(); }} />
              <View style={styles.errorContainer}>
                <Text style={styles.errorText}>{inputError}</Text>
              </View>
            </View>
            <View style={[styles.bottomContainer, keyboardVisible && styles.bottomContainerKeyboard]}>
              <CustomButton text='Go Back' type='secondary' size='large' onPress={() => {
                navigation.navigate('Home');
              }} />
              <CustomButton text='Confirm' type='primary' size='large' onPress={handleNextStep} />
            </View>
          </>
        );
      case 1:
        return (
          <>
            <TooltipComponent
              tooltipVisible={tooltipVisible}
              setTooltipVisible={setTooltipVisible}
              title="(2/3) How much?"
              text="*USDC on Optimism network"
              content="Enter a valid value.  Please note there is current a 0% transaction fee."
            />
                        
            <View style={[styles.inputContainer, keyboardVisible && styles.inputContainerKeyboard]}>
              <TextInput
                mode="outlined"
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
              <CustomButton text='Go Back' type='secondary' target='Account' size='large' onPress={() => { handlePreviousStep(); setInputError(''); }} />
              <CustomButton text='Confirm' type='primary' size='large' onPress={handleNextStep} />
            </View>
          </>
        );
      case 2:
        return (
          <>
            <TooltipComponent
              tooltipVisible={tooltipVisible}
              setTooltipVisible={setTooltipVisible}
              title="(3/3) Review Details."
              content="It is important to review the details. You will scan your card to confirm the transaction."
            />
            <View style={[styles.inputContainer, keyboardVisible && styles.inputContainerKeyboard]}>
              <Text style={styles.textMargin} variant='titleMedium'>You are sending {amount} USDC to:</Text>
              <Text style={styles.textMargin} variant='titleMedium'>{String(recipientKey)}</Text>
              <Text style={styles.textMargin} variant='titleMedium'>The fee for this transaction is 0%</Text>
              <Text style={styles.textMargin} variant='titleMedium'>Total transaction amount is {amount} USDC</Text>
              <View style={styles.errorContainer}>
                <Text style={styles.errorText}>{inputError}</Text>
              </View>
            </View>
            <View style={[styles.bottomContainer, keyboardVisible && styles.bottomContainerKeyboard]}>
              <CustomButton text='Go Back' type='secondary' target='Account' size='large' onPress={handlePreviousStep} />
              <CustomButton text='Confirm' type='primary' size='large' onPress={() => { handleSignAndSend(); }} />
            </View>
          </>
        );
      case 3:
        return success ? (
          <>
            <View style={[styles.inputContainer, keyboardVisible && styles.inputContainerKeyboard]}>
              <Text style={styles.textMargin} variant='titleLarge'>Success!</Text>
            </View>
            <View style={[styles.inputContainer, keyboardVisible && styles.inputContainerKeyboard]}>
              <Text style={styles.textMargin} variant='titleMedium'>Perform another transfer or return to account page.</Text>
              <View style={styles.errorContainer}>
                <Text style={styles.errorText}>{inputError}</Text>
              </View>
            </View>
            <View style={[styles.bottomContainer, keyboardVisible && styles.bottomContainerKeyboard]}>
              <CustomButton text='Transfer Again' type='primary' size='large' onPress={() => setStep(0)} />
              <CustomButton text='Return' type='secondary' size='large' onPress={() => { setNewBalance(publicKey); setNewActivity(publicKey); navigation.navigate('Home'); }} />
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
              <CustomButton text='Return' type='secondary' size='large' onPress={() => { navigation.navigate('Home'); }} />
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
      <InputModal
        visible={signModalVisible}
        closeModal={() => setSignModalVisible(false)}
        handlePasswords={confirmSign}
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

export default Send;