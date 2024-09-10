// libraries
import React, { useState, useContext, useCallback } from 'react';
import { View, ImageBackground, Platform } from 'react-native';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { useFocusEffect } from '@react-navigation/native';
// context
import { AccountContext } from '../contexts/AccountContext';
// components
import ZeroFee from './ZeroFee';
import TransakSell from './TransakSell';
import TransakBuy from './TransakBuy';
import AndroidScanModal from '../components/AndroidScanModal';
import CustomButton from '../components/CustomButton';
import InputModal from '../components/InputModal';
import Text from '../components/CustomText';
// functions
import { accountLogin } from '../functions/core/accountFunctions';
import { cancelNfc } from '../functions/core/cancelNfcRequest';
import { scanSerialForKey } from '../functions/core/scanSerialForKey';
// components
import TransferTutorial from '../components/TransferTutorial';
// styles
import styles from '../styles/common';

const Tab = createMaterialTopTabNavigator();

const Transfer = () => {

  const { publicKey, accountName, isCard } = useContext(AccountContext);

  const [modalVisible, setModalVisible] = useState(false);
  const [scanModal, setScanModal] = useState(false);
  const [errorMessage, setErrorMessage] = useState('Please verify your account before you add or sell USDC. We cannot recover funds for you.');
  const [recipTag, setRecipTag] = useState('');
  const [isVerified, setIsVerified] = useState(false);

  useFocusEffect(
    useCallback(() => {
      if (!isCard) {
        setIsVerified(true);
        setErrorMessage('');
      } else {
        setIsVerified(false);
        setErrorMessage('Please verify your account to continue.');
      }
    }, [accountName])
  );

  const closeScanModal = () => {
    cancelNfc();
    setScanModal(false);
  };

  const startVerificationProcess = () => {
    setScanModal(true);
    fetchTag();
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

  const handleRecipPassword = async (password) => {
    setErrorMessage('');
    try {
      let account = await accountLogin(recipTag, password);
      console.log('account address: ', account.address);
      if (account.address === publicKey) {
        setIsVerified(true);
        setModalVisible(false);
        setErrorMessage('');
      } else {
        setModalVisible(false);
        setErrorMessage('This is not the correct card/password combination. Please Try again');
      }
    } catch (error) {
      console.error('Cannot complete handlePasswords: ', error);
    }
  };

  const handleModalClose = () => {
    if (!isVerified) {
      setModalVisible(false);
      setScanModal(true);
    }
  };

  const renderTabs = () => {
    if (isCard) {
      return (
        <>
          <ImageBackground
            source={require('../assets/background.png')}
            style={{ flex: 1, width: '100%', height: '100%' }}
          >
            <View style={{ flex: 1 }}>
              {isVerified ? (
                <Tab.Navigator
                  screenOptions={{
                    tabBarIndicatorStyle: { backgroundColor: '#2E3C49' },
                    tabBarLabelStyle: {
                      fontFamily: 'LeagueSpartan-Regular',
                      fontSize: 24,
                      textTransform: 'none',
                    },
                  }}
                >
                  <Tab.Screen
                    name="No Fees"
                    component={ZeroFee}
                  />
                  <Tab.Screen
                    name="Buy USDC"
                    component={TransakBuy}
                  />
                  <Tab.Screen
                    name="Sell USDC"
                    component={TransakSell}
                  />
                </Tab.Navigator>
              ) : (
                <>
                  <View style={[{ flex: 2, marginTop: 64}]}>
                    <Text size={"large"} color={"#000000"} text={"We recommend Coinbase"} style={{ margin: 16 }} />

                    <TransferTutorial />
                  </View>

                  <View style={[{ flex: 2 }, styles.center]}>
                    <Text size={"small"} color={"#000000"} text={errorMessage} style={{ textAlign: 'center' }} />
                    <CustomButton text='Verify Account' type='primary' size='large' onPress={startVerificationProcess} style={{ marginVertical: 16 }} />
                  </View>
                </>
              )}
            </View>

            <InputModal
              visible={modalVisible}
              closeModal={handleModalClose}
              handlePasswords={handleRecipPassword}
              title='Confirm your password.'
              errorMessage={errorMessage}
            />
            {Platform.OS === 'android' && (
              <AndroidScanModal
                visible={scanModal}
                closeScanModal={closeScanModal}
                changeGifSource={null}
                fetchTag={fetchTag}
              />
            )}
          </ImageBackground>
        </>
      );
    } else {
      return (
        <>
          <ImageBackground
            source={require('../assets/background.png')}
            style={{ flex: 1, width: '100%', height: '100%' }}
          >
            <View style={{ flex: 1 }}>
              <Tab.Navigator
                screenOptions={{
                  tabBarIndicatorStyle: { backgroundColor: '#2E3C49' },
                  tabBarLabelStyle: {
                    fontFamily: 'LeagueSpartan-Regular',
                    fontSize: 24,
                    textTransform: 'none',
                  },
                }}
              >
                <Tab.Screen
                  name="No Fees"
                  component={ZeroFee}
                />
                <Tab.Screen
                  name="Sell USDC"
                  component={TransakSell}
                />
              </Tab.Navigator>

            </View>

            <InputModal
              visible={modalVisible}
              closeModal={handleModalClose}
              handlePasswords={handleRecipPassword}
              title='Confirm your password.'
              errorMessage={errorMessage}
            />
            {Platform.OS === 'android' && (
              <AndroidScanModal
                visible={scanModal}
                closeScanModal={closeScanModal}
                changeGifSource={null}
                fetchTag={fetchTag}
              />
            )}
          </ImageBackground>
        </>
      );
    }
  };

  return (
    renderTabs()
  );
};

export default Transfer;


