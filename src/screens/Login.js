import React, { useState, useCallback } from 'react';
import { View, Image, Platform, ImageBackground } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { Text } from 'react-native-paper';
//
import CustomButton from '../components/CustomButton';
import AccountList from '../components/AccountList';
import AndroidScanModal from '../components/AndroidScanModal';
//
import { getData } from '../functions/core/asyncStorage';
import { cancelNfc } from '../functions/core/cancelNfcRequest';
import { scanSerialForKey } from '../functions/core/scanSerialForKey';
//
import styles from '../styles/common';

const Login = ({ navigation }) => {
  const [dataList, setDataList] = useState([]);
  const [scanModal, setScanModal] = useState(false);

  useFocusEffect(
    useCallback(() => {
      const fetchData = async () => {
        try {
          const data = await getData();
          setDataList(data || []);
        } catch (error) {
          console.error('Error fetching saved accounts:', error);
        }
      };

      fetchData();
    }, [])
  );

  const handleScanCardPress = () => {
    setScanModal(true);
    fetchTag();
  };

  const closeScanModal = () => {
    cancelNfc();
    setScanModal(false);
  };

  const fetchTag = async () => {
    try {
      let tag = await scanSerialForKey();
      if (tag) {
        setScanModal(false); 
        navigation.navigate('AddAccount', { tag });
      }
    } catch (error) {
      console.log('Cannot complete fetchTag: ', error);
    }
  };

  return (
    <>
      <ImageBackground
        source={require('../assets/regen_card_background.png')}
        style={{ flex: 1, width: '100%', height: '100%' }}
      >
        {dataList.length > 0 ? (
          <>
            <View style={styles.topContainer}>
              <Text variant='titleLarge'>Select or add Account.</Text>
            </View>
            <View style={styles.listContainer}>
              <AccountList data={dataList} navigation={navigation} setData={setDataList} />
            </View>
          </>
        ) : (
          <>
            <View style={styles.topContainer}>
              <Text variant='titleLarge'>Add an account to continue.</Text>
            </View>
            <View style={styles.listContainer}>
              <Image
                source={require('../assets/regen_leaf.png')}
                style={styles.imageContainer}
                resizeMode="contain"
              />
            </View>
          </>
        )}

        <View style={styles.bottomContainer}>
          <CustomButton text='Add Account' type='primary' size='large' onPress={handleScanCardPress} />
          <CustomButton text='Go Back' type='secondary' size='large' onPress={() => { navigation.navigate('Landing'); }} />
        </View>

        {Platform.OS === 'android' && (
          <AndroidScanModal
            visible={scanModal}
            closeScanModal={closeScanModal}
          />
        )}
      </ImageBackground>
    </>
  );
};

export default Login;
