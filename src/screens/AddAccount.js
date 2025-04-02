/////////////////////////////////
// CompleteLogin //////////////

/////////////////////////////////

// libraries
import React, { useState, useContext, useEffect } from 'react';
import { View, KeyboardAvoidingView, ImageBackground, ScrollView, Image, Keyboard } from 'react-native';
import { TextInput } from 'react-native-paper';
import AsyncStorage from '@react-native-async-storage/async-storage';
import emojiRegex from 'emoji-regex';
// context 
import { AccountContext } from '../contexts/AccountContext';
// components
import CustomButton from '../components/CustomButton';
import PasswordInput from '../components/PasswordInput';
import Text from '../components/CustomText';
import LoadingOverlay from '../components/LoadingOverlay';
import TooltipComponent from '../components/ToolTip';
import AndroidScanModal from '../components/AndroidScanModal';

import { writeToCard } from '../functions/core/writeToCard';
import { cancelNfc } from '../functions/core/cancelNfcRequest';
import enablePassword from '../functions/core/enablePassword';
// styles
import styles from '../styles/common';

const AddAccount = ({ navigation, route }) => {
  const { loading, setNewAccount } = useContext(AccountContext);
  const regex = emojiRegex();

  const [step, setStep] = useState(0);
  const [password, setPassword] = useState(null);
  const [confirmPassword, setConfirmPassword] = useState(null);
  const [label, setLabel] = useState('');
  const [inputError, setInputError] = useState('');
  const [keyboardHeight, setKeyboardHeight] = useState(0);
  const [keyboardVisible, setKeyboardVisible] = useState(false);
  const [tooltipVisible, setTooltipVisible] = useState(false);
  const [randVal, setRandVal] = useState(null); 
  const [scanModal, setScanModal] = useState(false);
  
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

    const closeScanModal = () => {
      cancelNfc();
      setScanModal(false);
    };

  const handleNextStep = async () => {
    switch (step) {
      case 0:
        setScanModal(true);
        try {
          const result = await writeToCard();
          if (result?.randVal) {
            setRandVal(result.randVal); 
            setStep(step + 1);
          } else {
            setInputError('Failed to write to card. Please try again.');
          }
        } catch (error) {
          setInputError('Error setting up the card. Try again.');
        } finally {
          setScanModal(false);
        }
        break;
      case 1:
        setScanModal(true);
        try {
          await enablePassword();
          setStep(step + 1);
        } catch (error) {
          setInputError('Error locking card.');
          setStep(0);
        } finally {
          setScanModal(false);
        }
        break;
      case 2:
        if (password && password.trim() !== '') {
          if (regex.test(password)) {
            setInputError('Emoji characters are not allowed.');
            return;
          }
          if (password.length < 4) {
            setInputError('Passwords must be at least 4 characters.');
            return;
          }
          if (confirmPassword && confirmPassword.trim() !== '') {
            if (password === confirmPassword) {
              setNewAccount(randVal, password, label, navigation);
              setInputError('');
            } else {
              setInputError('The passwords do not match.');
            }
          } else {
            setInputError('Please confirm your password.');
          }
        } else {
          setInputError('Please enter a password.');
        }
        break;
      case 3:
        if (label.trim() !== '') {
          try {
            const keys = await AsyncStorage.getAllKeys();
            const items = await AsyncStorage.multiGet(keys);
            const accountNames = items.map(item => item[0]);
            const inputName = label;
            const isDuplicate = accountNames.includes(inputName);
            if (isDuplicate) {
              setInputError('This name is already being used on this device. Please try another name.');
              return;
            }
            setInputError('');
            setNewAccount(randVal, password, label, navigation);
          } catch (error) {
            console.error('Error retrieving accounts from AsyncStorage:', error);
          }
        } else {
          setInputError('Please enter a name.');
        }
        break;
      default:
        break;
    }
  };

  const handlePreviousStep = () => {
    setStep(step - 1);
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
                title="(1/2) Scan card again"
                text="*This is the first step in card setup."
                content="This will write the necessary details to the card."
              />
            </View>
            <View style={{ flex: 4, margin: 16 }}>
            <Image
                source={require('../assets/icons/scan_again.png')}
                style={styles.animationContainer}
                resizeMode="contain"
              />
            </View>
            <View style={{ flex: 2 }}>
              <View style={styles.buttonContainer}>
                <CustomButton text='Press to Scan' type='primary' size='large' onPress={handleNextStep} />
              </View>
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
                title="(2/2) Final scan"
                text="*This will complete the card setup."
                content="This step helps prevent accidental card overrides"
              />
            </View>
            <View style={{ flex: 4, margin: 16 }}>
            <Image
                source={require('../assets/icons/lock_card.png')}
                style={styles.animationContainer}
                resizeMode="contain"
              />
              <Text size={"small"} color={"#ff0000"} text={inputError} style={{ textAlign: 'center' }} />
            </View>
            <View style={{ flex: 2 }}>
              <View style={styles.buttonContainer}>
                <CustomButton text='Press to Scan' type='primary' size='large' onPress={handleNextStep} />
              </View>
            </View>
          </>
        );
      case 2:
        return (
          <>
            <View style={{ flex: 2, margin: 16 }}>
              <TooltipComponent
                tooltipVisible={tooltipVisible}
                setTooltipVisible={setTooltipVisible}
                title="Choose a password"
                content="Passwords must be 4 characters and may not contain emoji's.  It is important you remember this password."
              />
            </View>
            <View style={{ flex: 5, margin: 16 }}>
              <PasswordInput
                text='Enter Password...'
                password={password}
                setPassword={setPassword}
              />
              <PasswordInput
                text='Confirm Password...'
                password={confirmPassword}
                setPassword={setConfirmPassword}
              />
              <Text size={"small"} color={"#ff0000"} text={inputError} style={{ textAlign: 'center' }} />
            </View>
            <View style={{ flex: 2 }}>
              <View style={styles.buttonContainer}>
                <CustomButton text='Go Back' type='secondary' size='small' onPress={() => { navigation.navigate('Login'); }} />
                <CustomButton text='Login' type='primary' size='small' onPress={handleNextStep} />
              </View>
            </View>
          </>
        );
      case 3:
        return (
          <>
            <View style={{ flex: 2, margin: 16 }}>
              <TooltipComponent
                tooltipVisible={tooltipVisible}
                setTooltipVisible={setTooltipVisible}
                title="Name this account"
                content="Names can be any length or character but must be unique."
              />
            </View>
            <View style={{ flex: 4, margin: 16 }}>
              <TextInput
                mode="outlined"
                theme={{ colors: { primary: '#2E3C49' } }}
                returnKeyType="done"
                style={styles.textInput}
                placeholder={'Enter name...'}
                value={label}
                onChangeText={setLabel}
                autoCapitalize='none'
                onSubmitEditing={handleNextStep}
              />
               <Text size={"small"} color={"#ff0000"} text={inputError} style={{ textAlign: 'center' }} />
            </View>
            
            <View style={{ flex: 2 }}>
              <View style={styles.buttonContainer}>
                <CustomButton text='Go Back' type='secondary' size='small' onPress={handlePreviousStep} />
                <CustomButton text='Login' type='primary' size='small' onPress={() => { Keyboard.dismiss(); handleNextStep(); }} />
              </View>
            </View>
          </>
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
        <LoadingOverlay loading={loading} />
        {renderStep()}

      </ImageBackground>
      {Platform.OS === 'android' && (
        <AndroidScanModal
          visible={scanModal}
          closeScanModal={closeScanModal}
        />
      )}
    </>
  );
}

export default AddAccount;