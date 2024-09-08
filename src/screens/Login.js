// libraries
import React, { useState, useCallback } from 'react';
import { View, Image, Platform, ImageBackground } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
// components
import Text from '../components/CustomText';
import CustomButton from '../components/CustomButton';
import AccountList from '../components/AccountList';
import TooltipComponent from '../components/ToolTip';
import AndroidScanModal from '../components/AndroidScanModal';
// functions
import { getData } from '../functions/core/asyncStorage';
import { cancelNfc } from '../functions/core/cancelNfcRequest';
import { scanSerialForKey } from '../functions/core/scanSerialForKey';
// styles
import styles from '../styles/common';

const Login = ({ navigation }) => {
  const [dataList, setDataList] = useState([]);
  const [scanModal, setScanModal] = useState(false);
  const [tooltipVisible, setTooltipVisible] = useState(false);

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
    <View style={styles.container}>
      <ImageBackground
        source={require('../assets/background.png')}
        style={{ flex: 1, width: '100%', height: '100%' }}
      >
        {dataList.length > 0 ? (
          <>
            <View style={{ flex: 2, margin: 16 }}>
              <TooltipComponent
                tooltipVisible={tooltipVisible}
                setTooltipVisible={setTooltipVisible}
                title="Select or add an account"
                text="*Requires a Regen Card"
                content="You can make multiple accounts using a single card."
              />
            </View>
            <View style={styles.listContainer}>
              <AccountList data={dataList} navigation={navigation} setData={setDataList} />
            </View>
          </>
        ) : (
          <>
            <View style={{ flex: 2, margin: 16 }}>
              <TooltipComponent
                tooltipVisible={tooltipVisible}
                setTooltipVisible={setTooltipVisible}
                title="Add an account"
                text="*Requires a Regen Card"
                content="You can make multiple accounts using a single card."
              />
            </View>
            <View style={[{ flex: 4, }, styles.center]}>
            <Image
                source={require('../assets/card_tap_animation.gif')}
                style={styles.animationContainer}
                resizeMode="contain"
              />
            </View>
            </>
          )}
            <View style={[{ flex: 2, justifyContent: 'center' }, styles.center]}>
              <View style={styles.buttonContainer}>
                <CustomButton text='Go Back' type='secondary' size='small' onPress={() => { navigation.navigate('Landing'); }} />
                <CustomButton text='Add' type='primary' size='small' onPress={handleScanCardPress} />
              </View>
            </View>
      </ImageBackground>
      {Platform.OS === 'android' && (
        <AndroidScanModal
          visible={scanModal}
          closeScanModal={closeScanModal}
        />
      )}
    </View>
  );
};

export default Login;
