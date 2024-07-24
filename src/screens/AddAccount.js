
// libraries
import React, { useState, useContext } from 'react';
import { View, KeyboardAvoidingView, ActivityIndicator, ImageBackground } from 'react-native';
import { Text, TextInput } from 'react-native-paper';
// context 
import { AccountContext } from '../contexts/AccountContext';
// components
import CustomButton from '../components/CustomButton';
import PasswordInput from '../components/PasswordInput';

/**
import { accountLogin } from '../functions/core/accountFunctions';
import { storeData } from '../functions/core/asyncStorage';
*/
import styles from '../styles/common';

const AddAccount = ({ navigation, route }) => {

  const { loading, setNewAccount } = useContext(AccountContext);
  const { tag } = route.params;

  const [step, setStep] = useState(0);
  const [password, setPassword] = useState(null);
  const [confirmPassword, setConfirmPassword] = useState(null);
  const [label, setLabel] = useState('');
  const [inputError, setInputError] = useState('');

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

  /** 
  const handleLogin = async (tag, password, name) => {
    try {
      setLoading(true);
      let account = await accountLogin(tag, password);
      await storeData(name, account.address);
      setLoading(false);
      navigation.navigate('Home', { label: name, publicKey: account.address, account });
    } catch (error) {
      console.error('Cannot complete handleLogin: ', error);
    }
  };
*/

  const renderStep = () => {
    switch (step) {
      case 0:
        return (
          <View style={styles.inputContainer}>
            <Text style={styles.textMargin} variant='titleMedium'>(1/2) Enter a password. Do not share this value. We cannot recover passwords for you.</Text>
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
          </View>
        );
      case 1:
        return (
          <View style={styles.inputContainer}>
            <Text style={styles.textMargin} variant='titleMedium'>(2/2) Name this account. You can change this name at any time.</Text>
            <TextInput
              mode="outlined"
              theme={{ colors: { primary: 'green' } }}
              returnKeyType="done"
              style={styles.textInput}
              placeholder={'Enter name'}
              value={label}
              onChangeText={setLabel}
              autoCapitalize='none'
            />
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
            <CustomButton text='Save Password' type='primary' size='large' onPress={handleNextStep} />
            <CustomButton text='Go Back' type='secondary' size='large' onPress={() => { navigation.navigate('Login'); }} />
          </View>
        );
      case 1:
        return (
          <View style={styles.bottomContainer}>
            <CustomButton text='Save and Login' type='primary' size='large' onPress={handleNextStep} />
            <CustomButton text='Go Back' type='secondary' size='large' onPress={handlePreviousStep} />
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
        <KeyboardAvoidingView style={styles.container}>
          {loading && (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color="#7FA324" />
            </View>
          )}
          <View style={styles.topContainer}>
            <Text variant='titleLarge'>Follow the prompts to add an account.</Text>
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
        </KeyboardAvoidingView>
      </ImageBackground>
    </>
  );
}

export default AddAccount;