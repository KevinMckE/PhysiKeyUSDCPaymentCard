/////////////////////////////////
// ADDACCOUNT PAGE //////////////
// Users can add a new account //
// by scanning their card,     //
// naming their account,       //
// and setting a password      //
// RegenCard 2024              //
/////////////////////////////////

// libraries
import React, { useState, useContext, useEffect } from 'react';
import { View, KeyboardAvoidingView, ActivityIndicator, ImageBackground, ScrollView, TouchableOpacity, Image, Platform, Keyboard } from 'react-native'; import { Text, TextInput } from 'react-native-paper';
import Tooltip from 'react-native-walkthrough-tooltip';
// context 
import { AccountContext } from '../contexts/AccountContext';
// components
import CustomButton from '../components/CustomButton';
import PasswordInput from '../components/PasswordInput';
// styles
import styles from '../styles/common';

const AddAccount = ({ navigation, route }) => {
  const { loading, setNewAccount } = useContext(AccountContext);
  const { tag } = route.params;

  const [step, setStep] = useState(0);
  const [password, setPassword] = useState(null);
  const [confirmPassword, setConfirmPassword] = useState(null);
  const [label, setLabel] = useState('');
  const [inputError, setInputError] = useState('');
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
        if (password && password.trim() !== '') {
          if (confirmPassword && confirmPassword.trim() !== '') {
            if (password === confirmPassword) {
              setStep(step + 1);
              setInputError('');
            } else {
              setInputError('The passwords do not match.');
            }
          } else {
            setInputError('Please complete the form.');
          }
        } else {
          setInputError('Oops! Please enter a password.');
        }
        break;
      case 1:
        if (label.trim() !== '') {
          setInputError('');
          setNewAccount(tag, password, label, navigation);
        } else {
          setInputError('Oops! Please enter a name.');
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
            <TouchableOpacity style={styles.topContainer} onPress={() => setTooltipVisible(true)}>
              <Text variant='titleLarge'>(1/2) Enter a password. </Text>
              <Image source={require('../assets/icons/info.png')} style={styles.icon} />
            </TouchableOpacity>
            <Tooltip
              isVisible={tooltipVisible}
              content={<Text>Enter a secure password you will remember.  We will never ask your for your password and cannot recover it for you.</Text>}
              placement="bottom"
              onClose={() => setTooltipVisible(false)}
            >
              <View />
            </Tooltip>
            <View style={[styles.inputContainer, keyboardVisible && styles.inputContainerKeyboard]}>
              <PasswordInput
                text='Enter Password'
                password={password}
                setPassword={setPassword}
              />
              <PasswordInput
                text='Confirm Password'
                password={confirmPassword}
                setPassword={setConfirmPassword}
              />
              <View style={styles.errorContainer}>
                <Text style={styles.errorText}>{inputError}</Text>
              </View>
            </View>
            <View style={[styles.bottomContainer, keyboardVisible && styles.bottomContainerKeyboard]}>
              <CustomButton text='Go Back' type='secondary' size='small' onPress={() => { navigation.navigate('Login'); }} />
              <CustomButton text='Save' type='primary' size='small' onPress={handleNextStep} />
            </View>
          </>
        );
      case 1:
        return (
          <>
            <TouchableOpacity style={styles.topContainer} onPress={() => setTooltipVisible(true)}>
              <Text variant='titleLarge'>(2/2) Name this account. </Text>
              <Image source={require('../assets/icons/info.png')} style={styles.icon} />
            </TouchableOpacity>
            <Tooltip
              isVisible={tooltipVisible}
              content={<Text>Naming your accounts will help organize them in the future.</Text>}
              placement="bottom"
              onClose={() => setTooltipVisible(false)}
            >
              <View />
            </Tooltip>
            <View style={[styles.inputContainer, keyboardVisible && styles.inputContainerKeyboard]}>
              <TextInput
                mode="outlined"
                theme={{ colors: { primary: '#2E3C49' } }}
                returnKeyType="done"
                style={styles.textInput}
                placeholder={'Enter name'}
                value={label}
                onChangeText={setLabel}
                autoCapitalize='none'
                onSubmitEditing={handleNextStep}
              />
            </View>
            <View style={[styles.bottomContainer, keyboardVisible && styles.bottomContainerKeyboard]}>
              <CustomButton text='Go Back' type='secondary' size='small' onPress={handlePreviousStep} />
              <CustomButton text='Save' type='primary' size='small' onPress={handleNextStep} />
            </View>
          </>
        );
      default:
        return null;
    }
  };

  return (
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
            {loading && (
              <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#7FA324" />
              </View>
            )}
            {renderStep()}
          </View>
        </ScrollView>
      </ImageBackground>
    </KeyboardAvoidingView>
  );
}

export default AddAccount;