import React, { useState, useEffect } from 'react';
import { View, Image, StyleSheet, Text, ImageBackground, Modal } from 'react-native';
import NavigationButton from '../components/NavigationButton';
import NfcManager, { Ndef, NfcTech } from 'react-native-nfc-manager';
import DatePickerInput from '../components/DatePickerInput';

const LoginDate = ({ navigation }) => {
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null);

  useEffect(() => {
    readSerial();
  }, []);

  const readSerial = async () => {
    try {
      await NfcManager.requestTechnology(NfcTech.NfcA);
      const tag = await NfcManager.getTag();
      console.warn(tag.id);
      console.warn(tag);

      setModalVisible(true);
    } catch (ex) {
      console.error(ex);
    } finally {
      NfcManager.cancelTechnologyRequest();
    }
  };

  const handleDateSelect = (date, confirmDate) => {
    // You can perform any logic with the selected date here
    setSelectedDate(date);
    setModalVisible(false);
  };

  return (
    <View style={styles.container}>
      <View style={styles.topContainer}>
        <Text style={styles.headingText}>Scan your card and input Date Passcode.</Text>
      </View>

      <View style={styles.imageContainer}>
        <ImageBackground
          source={require('../assets/blob_background.png')}
          style={styles.backgroundImage}
          resizeMode="contain"
        >
        <DatePickerInput onEnter={handleDateSelect} onClose={() => setModalVisible(false)} />
        </ImageBackground>
      </View>

      <View style={styles.bottomContainer}>
        <NavigationButton navigation={navigation} text='Go Back' type='secondary' target='Landing' size='large' />
        <NavigationButton navigation={navigation} text='Continue' type='primary' target='CreateNewCard' size='large' />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    height: '100%',
  },
  topContainer: {
    flex: 1,
    padding: 30,
  },
  imageContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    flex: 2,
  },
  backgroundImage: {
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1,
    aspectRatio: 1,
  },
  bottomContainer: {
    flex: 2,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headingText: {
    fontSize: 18,
    color: '#000000',
    fontWeight: 'bold',
  },
});

export default LoginDate;