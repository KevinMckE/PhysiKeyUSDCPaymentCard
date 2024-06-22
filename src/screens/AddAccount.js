import React, { useState } from 'react';
import { View, KeyboardAvoidingView } from 'react-native';
import { Text } from 'react-native-paper';
//
import CustomButton from '../components/CustomButton';
import PasswordInput from '../components/PasswordInput';
//
import { scanSerialForKey } from '../functions/core/scanSerialForKey';
import { accountLogin } from '../functions/core/accountFunctions';
import { cancelNfc } from '../functions/core/cancelNfcRequest';
import { storeData, } from '../functions/core/asyncStorage';
import styles from '../styles/common';

const AddAccount = ({ navigation, route }) => {
  const [step, setStep] = useState(0);
  const [account, setAccount] = useState('');
  const [publicKey, setPublicKey] = useState('');
  const [password, setPassword] = useState(null);
  const [confirmPassword, setConfirmPassword] = useState(null);
  const [name, setName] = useState('');
  const [inputError, setInputError] = useState('');

  const { tag } = route.params;

  const handleNextStep = () => {
    switch (step) {
      case 0:
        if (password.trim() !== '') {
          if (password && confirmPassword) {
            if (password === confirmPassword) {
              setStep(step + 1);
              setInputError('');
            } else {
              setErrorMessage('The passwords do not match.');
            }
          } else {
            setErrorMessage('Please complete the form.');
          }
        } else {
          setInputError('Oops! Please enter a password.');
        }
        break;
      case 1:
        if (name.trim() !== '') {
          setInputError('');
          handleLogin(tag, password);
          handleName(name);
        } else {
          setInputError('Oops! Please enter a name.')
        }
        break;
      default:
        break;
    }
  };

  const handlePreviousStep = () => {
    setStep(step - 1);
  };

  const handleLogin = async (tag, password) => {
    try {
      let account = await accountLogin(tag, password);
      if (account) {
        setAccount(account);
        let address = account.address
        setPublicKey(address);
      } else {
        console.error('Cannot complete accountLogin. Key is not defined.');
      }
    } catch (error) {
      console.error('Cannot complete handlePasswords: ', error);
    }
  };

  const handleName = (label) => {
    storeData(label, publicKey);
    navigation.navigate('Home', { label, publicKey, account });
  };

  const renderStep = () => {
    switch (step) {
      case 0:
        return (
          <View style={styles.inputContainer}>
            <Text style={styles.textMargin} variant='titleMedium'>(1/2) Enter a password.  Do not share this value.  We Cannot recover passwords for you.</Text>
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
            <Text style={styles.textMargin} variant='titleMedium'>(2/2) Name this account.  You can change this name at any time.</Text>
            <PasswordInput
              text='Enter Name'
              password={name}
              setPassword={setName}
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
            <CustomButton text='Go Back' type='secondary' target='Account' size='large' onPress={(handlePreviousStep)} />
          </View>
        );
      default:
        return null;
    }
  };

  return (
    <>

      <KeyboardAvoidingView style={styles.container}>
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

    </>
  );
}

export default AddAccount;