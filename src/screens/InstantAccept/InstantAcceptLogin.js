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
// context 
import { AccountContext } from '../../contexts/AccountContext';
// components 
import CustomButton from '../../components/CustomButton';
import TooltipComponent from '../../components/ToolTip';
import LoadingOverlay from '../../components/LoadingOverlay';
// functions
import { accountLogin } from '../../functions/core/accountFunctions';
// styles
import styles from '../../styles/common';

const InstantAcceptLogin = ({ navigation }) => {
  const { setIsLoading, loading, setNewPublicKey, setNewBalance } = useContext(AccountContext);

  const [keyboardVisible, setKeyboardVisible] = useState(false);
  const [tooltipVisible, setTooltipVisible] = useState(false);

  const initializeAccount = async () => {
    const username = "Default";
    const password = randomString;
    try {
      setIsLoading(true);
      console.log('Creating a new account...');
      await Keychain.setGenericPassword(username, password);
      const account = await accountLogin(password, password);
      setNewPublicKey(account.address);
      setNewBalance(account.address);
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
          source={require('../../assets/background.png')}
          style={{ flex: 1, width: '100%', height: '100%' }}
        >
          <LoadingOverlay loading={loading} />

          <TooltipComponent
            tooltipVisible={tooltipVisible}
            setTooltipVisible={setTooltipVisible}
            title="Generate a newaccount"
            content="Make sure you have cleared any funds from your old account!"
          />
          <View style={[styles.inputContainer, keyboardVisible && styles.inputContainerKeyboard]}>
            <CustomButton text="Generate" type='primary' size='large' onPress={() => { initializeAccount(); }} />
          </View>
          <View style={[styles.bottomContainer, keyboardVisible && styles.bottomContainerKeyboard]}>
            <CustomButton text='Go Back' type='secondary' size='large' onPress={() => {
              navigation.navigate('Landing');
            }} />
            <CustomButton text='Confirm' type='primary' size='large' onPress={() => { initializeAccount(); navigation.navigate('InstantAccept') }} />
          </View>
        </ImageBackground >
      </KeyboardAvoidingView >
    </>
  );
}

export default InstantAcceptLogin;