/////////////////////////////////
// INSTANT ACCOUNT LOGIN      ///
//                             //
//                             //
//                             //
// RegenCard 2024           /////
/////////////////////////////////

// libraries
import React, { useState, useEffect, useContext } from 'react';
import { View, KeyboardAvoidingView, ImageBackground, Platform, Keyboard } from 'react-native';
import * as Keychain from 'react-native-keychain';
import { Text, TextInput } from 'react-native-paper';
import AsyncStorage from '@react-native-async-storage/async-storage';
// context 
import { AccountContext } from '../contexts/AccountContext';
// components 
import CustomButton from '../components/CustomButton';
import TooltipComponent from '../components/ToolTip';
// functions
import { accountLogin } from '../functions/core/accountFunctions';
// styles
import styles from '../styles/common';

const randomstring = require('randomstring');

const InstantAcceptLogin = ({ navigation }) => {

  const { publicKey, setIsLoading, setNewPublicKey, setNewBalance } = useContext(AccountContext);

  const [keyboardVisible, setKeyboardVisible] = useState(false);
  const [tooltipVisible, setTooltipVisible] = useState(false);

  const initializeAccount = async () => {
    const username = "Default";
    let password = randomstring.generate(35);
    try {
      setIsLoading(true);
      const credentials = await Keychain.getGenericPassword();
      if (!credentials || credentials.username !== username) {
        console.log('creating new...');
        await Keychain.setGenericPassword(username, password);
        const account = await accountLogin(password, password);
        setNewPublicKey(account.address);
        setNewBalance(account.address);
      } else {
        console.log('account exists...');
        const account = await accountLogin(credentials.password, credentials.password);
        setNewPublicKey(account.address);
        setNewBalance(account.address);
      }
      setIsLoading(false);
    } catch (error) {
      setIsLoading(false);
      console.error("Error initializing account: ", error);
      navigation.navigate('Landing');
    }
  };

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
          <TooltipComponent
            tooltipVisible={tooltipVisible}
            setTooltipVisible={setTooltipVisible}
            title="Use existing wallet or generate a new one."
            content="Paste in an existing wallet if you prefer.  Otherwise we can generate a wallet for you!"
          />
          <View style={[styles.inputContainer, keyboardVisible && styles.inputContainerKeyboard]}>
            <TextInput
              mode="outlined"
              style={styles.textInput}
              theme={{ colors: { primary: '#2E3C49' } }}
              placeholder="Existing Wallet"
              value={publicKey}
              multiline={true}
              onChangeText={publicKey => setNewPublicKey(publicKey)}
              returnKeyType={'done'}
            />
            <Text style={styles.textMargin} variant='titleMedium'>or</Text>
            <CustomButton text="Generate" type='primary' size='large' onPress={() => { initializeAccount(); }} />
          </View>
          <View style={[styles.bottomContainer, keyboardVisible && styles.bottomContainerKeyboard]}>
            <CustomButton text='Go Back' type='secondary' size='large' onPress={() => {
              navigation.navigate('Landing');
            }} />
            <CustomButton text='Confirm' type='primary' size='large' onPress={() => {initializeAccount(); navigation.navigate('InstantAccept')}} />
          </View>
        </ImageBackground >
      </KeyboardAvoidingView >
    </>
  );
}

export default InstantAcceptLogin;