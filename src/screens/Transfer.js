import React, { useState } from 'react';
import { View, ImageBackground, Text, Platform, StyleSheet } from 'react-native';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import TransakSell from '../components/TransakSell';
import TransakBuy from '../components/TransakBuy';
import AndroidScanModal from '../components/AndroidScanModal';
import CustomButton from '../components/CustomButton';
import InputModal from '../components/InputModal';
import { accountLogin } from '../functions/core/accountFunctions';
import styles from '../styles/common';
import { cancelNfc } from '../functions/core/cancelNfcRequest';
import { scanSerialForKey } from '../functions/core/scanSerialForKey';

const Tab = createMaterialTopTabNavigator();

const Transfer = ({ navigation, route }) => {
  const [modalVisible, setModalVisible] = useState(false);
  const [scanModal, setScanModal] = useState(false);
  const [errorMessage, setErrorMessage] = useState('Please reverify account before you proceed.');
  const [recipTag, setRecipTag] = useState('');
  const [isVerified, setIsVerified] = useState(false); // Track verification status
  const { publicKey } = route.params;
  console.log(publicKey);

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
        setIsVerified(true); // Set verification status to true
        setModalVisible(false);
        setErrorMessage('');
      } else {
        setModalVisible(false);
        setErrorMessage('This is not the correct account. Please Try again');
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
                tabBarIndicatorStyle: { backgroundColor: '#7FA324' }
              }}
            >
              <Tab.Screen
                name="Onramp"
                component={TransakBuy}
              />
              <Tab.Screen
                name="Offramp"
                component={TransakSell}
              />
            </Tab.Navigator>
          ) : (
            <View style={styles.reverifyContainer}>
              <Text style={styles.reverifyText}>{errorMessage}</Text>
              <CustomButton text='Start Verification' type='primary' size='large' onPress={startVerificationProcess} />
            </View>
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
};

export default Transfer;
