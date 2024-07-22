import React, { useState } from 'react';
import { View, ImageBackground } from 'react-native';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
//
import TransakSell from '../components/TransakSell';
import TransakBuy from '../components/TransakBuy';
import AndroidScanModal from '../components/AndroidScanModal';
import { accountLogin } from '../functions/core/accountFunctions';
//
import InputModal from '../components/InputModal';
//
import styles from '../styles/common';

const Tab = createMaterialTopTabNavigator();

const Transfer = ({ navigation, route }) => {
  const [modalVisible, setModalVisible] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [recipTag, setRecipTag] = useState('');
  const [scanModal, setScanModal] = useState(false);
  const { publicKey } = route.params;
  
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

  const handleRecipPassword = async (password) => {
    setErrorMessage('');
    try {
      let account = await accountLogin(recipTag, password);
      console.log('account address: ', account.address)
      if (account.address == publicKey) {
        setModalVisible(false);
      } else {
        setErrorMessage('Incorrect password.  Try again.')
      }
    } catch (error) {
      console.error('Cannot complete handlePasswords: ', error);
    }
  };

  return (
    <>
      <ImageBackground
        source={require('../assets/background.png')}
        style={{ flex: 1, width: '100%', height: '100%' }}
      >
        <View style={{ flex: 1 }}>
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
        </View>
        <InputModal
          visible={modalVisible}
          closeModal={() => setModalVisible(false)}
          handlePasswords={handleRecipPassword}
          title='Confirm your password.'
          changeGifSource={null}
        />
        {Platform.OS === 'android' && ( // Render modal only on Android
          <AndroidScanModal
            visible={scanModal}
            closeScanModal={closeScanModal}
            changeGifSource={null}
          />
        )}
      </ImageBackground>
    </>
  );
};

export default Transfer;
