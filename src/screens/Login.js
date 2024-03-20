import React, { useState, useEffect } from 'react';
import { View, Image, StyleSheet, Text, ImageBackground, Modal } from 'react-native';
import NavigationButton from '../components/NavigationButton';
import NfcManager, { Ndef, NfcTech } from 'react-native-nfc-manager';
import DatePickerInput from '../components/DatePickerInput';

const Login = ({ navigation }) => {
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
        <Text style={styles.headingText}>Scan your card then input Date Passcode.</Text>
      </View>

      <View style={styles.imageContainer}>
        <ImageBackground
          source={require('../assets/blob_background.png')}
          style={styles.backgroundImage}
          resizeMode="contain"
        >
          <Image
            source={require('../assets/tap_animation.gif')}
            style={styles.centeredImage}
            resizeMode="cover"
          />
        </ImageBackground>
      </View>

      <View style={styles.bottomContainer}>
        <NavigationButton navigation={navigation} text='Go Back' type='secondary' target='Landing' size='large' />
        <NavigationButton navigation={navigation} text='Continue' type='primary' target='CreateNewCard' size='large' />
      </View>
        
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          setModalVisible(!modalVisible);
        }}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.headingText}>Entering a new or random date will create a new wallet.</Text>
            <DatePickerInput onEnter={handleDateSelect} onClose={() => setModalVisible(false)} />
            <NavigationButton navigation={navigation} text='Close' type='secondary' target={null} size='small' />
            <NavigationButton navigation={navigation} text='Enter' type='primary' target={null} size='small' />
          </View>
        </View>
      </Modal>
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
    alignItems: 'center',
    flex: 2,
  },
  backgroundImage: {
    flex: 1,
    aspectRatio: 1,
  },
  centeredImage: {
    width: '100%',
    height: '100%',
  },
  inputContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    flex: 2,
  },
  bottomContainer: {
    flex: 2,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headingText: {
    fontSize: 18,
    marginBottom: 25,
    color: '#000000',
    fontWeight: 'bold',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 10,
    alignItems: 'center',
  },
});

export default Login;