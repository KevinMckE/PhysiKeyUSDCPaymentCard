import React, { useState, useEffect } from 'react';
import { View, Image, StyleSheet, Text, ImageBackground, Modal } from 'react-native';
import NavigationButton from '../components/NavigationButton';
import ModalButton from '../components/ModalButton';
import DatePickerInput from '../components/DatePickerInput';
import { readSerial, testLogin } from '../components/HelperFunctions';

const Login = ({ navigation }) => {
  const [modalVisible, setModalVisible] = useState(false);
  const [tagID, setTagID] = useState('');
  const [date, setDate] = useState(null);
  const [confirmDate, setConfirmDate] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        let tagID = await readSerial();
        if (tagID) {
          setTagID(tagID);
          setModalVisible(true);
        }
        //console.warn(tagID);
      } catch (error) {
        console.log(error);
      }
    };

    fetchData();
  }, []);

  const handleDateChange = (newDate, newConfirmDate) => {
    setDate(newDate);
    setConfirmDate(newConfirmDate);
  };

  const confirmDates = () => {
    console.warn('DATE:', date);
    console.warn('CONFIRM DATE:', confirmDate);
    if (date && confirmDate) {

      setModalVisible(false);
      setModalVisible(false);

    }
    //testLogin(tagID, date);


  }

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
            <DatePickerInput
              text='Select Date'
              date={date}  // Pass date state as prop
              setDate={setDate}  // Pass setDate function as prop
            />
            <DatePickerInput
              text='Confirm Date'
              date={confirmDate}  // Pass confirmDate state as prop
              setDate={setConfirmDate}  // Pass setConfirmDate function as prop
            />
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
  }
});

export default Login;