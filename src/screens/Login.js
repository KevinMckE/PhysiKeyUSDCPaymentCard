import React, { useState, useEffect } from 'react';
import { View, Image, StyleSheet, Text, ImageBackground, Modal } from 'react-native';
import NavigationButton from '../components/NavigationButton';
import ModalButton from '../components/ModalButton';
import DatePickerInput from '../components/DatePickerInput';
import { readSerial, accountLogin, checkNdef } from '../components/HelperFunctions';

const Login = ({ navigation }) => {
  const [modalVisible, setModalVisible] = useState(false);
  const [tagID, setTagID] = useState('');
  const [date, setDate] = useState(null);
  const [publicKey, setPublicKey] = useState(null);
  const [confirmDate, setConfirmDate] = useState(null);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    fetchTag();
  }, []);

  const fetchTag = async () => {
    try {
      let tag = await readSerial();
      console.warn('WHOLE TAG:', tag);
      console.warn('NDEF:', tag).ndefMessage;
      let payload = tag
      tagID = tag.id;
      if (tagID) {
        setTagID(tagID);

        //setModalVisible(true);
      }
      //console.warn(tagID);
    } catch (error) {
      console.log(error);
    }
  };

  const confirmDates = () => {
    if (date && confirmDate) {
      if (date.getTime() === confirmDate.getTime()) {
        setErrorMessage('');
        setModalVisible(false);
        //let publicKey = accountLogin(tagID, date);
        setPublicKey(publicKey);
      } else {
        setErrorMessage('The dates do not match.');
      }
    } else {
      setErrorMessage('Please complete the form.');
    }
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
        <NavigationButton navigation={navigation} text='Scan Again' type='primary' target={null} size='large' onPress={confirmDates}/>
      </View>

      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          setModalVisible(false);
        }}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.headingText}>Entering a new or random date will create a new wallet.</Text>
            <DatePickerInput
              text='Select Date'
              date={date}
              setDate={setDate}
            />
            <DatePickerInput
              text='Confirm Date'
              date={confirmDate}
              setDate={setConfirmDate}
            />
            {errorMessage ? (
              <Text style={styles.errorMessage}>{errorMessage}</Text>
            ) : null}
            <View style={styles.inlineButton}>
              <ModalButton navigation={navigation} text='Close' type='secondary' target={null} size='small' onPress={() => setModalVisible(false)} />
              <ModalButton navigation={navigation} text='Enter' type='primary' target={null} size='small' onPress={confirmDates} />
            </View>
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
    padding: 20,
  },
  modalContent: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 10,
    alignItems: 'center',
  },
  inlineButton: {
    flexDirection: 'row',
    width: 100,
    justifyContent: 'center',
    gap: 10,
  },
  errorMessage: {
    color: 'red',
    marginTop: 10,
  },
});

export default Login;