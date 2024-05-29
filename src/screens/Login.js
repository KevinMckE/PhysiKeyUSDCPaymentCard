import React, { useState } from 'react';
import { View, Image, Platform, ActivityIndicator } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { Text } from 'react-native-paper';
import CustomButton from '../components/CustomButton';
import InputModal from '../components/InputModal';
import AndroidScanModal from '../components/AndroidScanModal';
import SaveAccount from '../components/SaveAccountModal';
import AccountList from '../components/AccountList';
import { scanSerialForKey } from '../functions/core/scanSerialForKey';
import { accountLogin } from '../functions/core/accountFunctions';
import { cancelNfc } from '../functions/core/cancelNfcRequest';
import { storeData, getData } from '../functions/core/asyncStorage';
import styles from '../styles/common';

const Login = ({ navigation }) => {
  const [modalVisible, setModalVisible] = useState(false);
  const [scanModal, setScanModal] = useState(false);
  const [saveModal, setSaveModal] = useState(false);
  const [publicKey, setPublicKey] = useState('');
  const [tagID, setTagID] = useState('');
  const [loading, setLoading] = useState(false);
  const [dataList, setDatalist] = useState([]);

  useFocusEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getData();
        setDatalist(data);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  });

  const closeScanModal = () => {
    cancelNfc();
    setScanModal(false);
  };

  const fetchTag = async () => {
    try {
      let tag = await scanSerialForKey();
      if (tag) {
        setTagID(tag);
        setModalVisible(true);
        setScanModal(false);
      }
    } catch (error) {
      console.log('Cannot complete fetchTag: ', error);
    }
  };

  const handleScanCardPress = () => {
    setScanModal(true);
    fetchTag();
  };

  const handlePasswords = async (password) => {
    setModalVisible(false);
    setLoading(true);
    try {
      let { publicKey } = await accountLogin(tagID, password);
      setPublicKey(publicKey);
      if (publicKey) {
        setSaveModal(true);
      } else {
        console.error('Cannot complete handlePasswords. Key is not defined.');
      }
    } catch (error) {
      console.error('Cannot complete handlePasswords: ', error);
    } finally {
      setLoading(false);
    }
  };

  const handleName = (label) => {
    storeData(label, publicKey);
    setSaveModal(false);
    navigation.navigate('Home', { label, publicKey });
  };

  return (
    <>
      <View style={styles.container}>
        {loading && (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#0000ff" />
          </View>
        )}
        <View style={styles.topContainer}>
          <Text variant='titleLarge'>Select or Add Account</Text>
        </View>

        <View style={styles.listContainer}>
          {dataList.length > 0 ? (
            <AccountList data={dataList} navigation={navigation} setData={setDatalist} />
          ) : (
            <View style={styles.imageContainer}>
              <Image
                source={require('../assets/blob_background_gradient.png')}
                style={styles.backgroundImageSecondary}
                resizeMode="contain"
              />
            </View>
          )}
        </View>

        <View style={styles.bottomContainer}>
          <CustomButton text='Add Account' type='primary' size='large' onPress={() => { handleScanCardPress(); }} />
          <CustomButton text='Go Back' type='secondary' size='large' onPress={() => { navigation.navigate('Landing'); }} />
        </View>

        <InputModal
          visible={modalVisible}
          closeModal={() => setModalVisible(false)}
          handlePasswords={handlePasswords}
          title={`Each new password creates a new account when used with your card. \n\nWe cannot recover passwords for you.`}
        />

        <SaveAccount
          visible={saveModal}
          closeModal={() => setSaveModal(false)}
          handleName={handleName}
          title={`Please name this account.`}
        />

        {Platform.OS === 'android' && ( // Render modal only on Android
          <AndroidScanModal
            visible={scanModal}
            closeScanModal={closeScanModal}
          />
        )}
      </View>
    </>
  );
}

export default Login;
