import React, { useState } from 'react';
import { View, StyleSheet, Text, ImageBackground, Modal, Image } from 'react-native';
import NavigationButton from '../components/NavigationButton';
import { TextInput } from 'react-native-paper';
import PasswordInput from '../components/PasswordInput';
import ModalButton from '../components/ModalButton';
import { readTag, accountLogin, scanSerialForKey, signAndSend } from '../components/HelperFunctions';

const Transfer = ({ navigation, route }) => {
  const [modalVisible, setModalVisible] = useState(false);
  const [secondModalVisible, setSecondModalVisible] = useState(false);
  const [tagID, setTagID] = useState('');
  const [scanModal, setScanModal] = useState(false);
  const [recipientKey, setRecipientKey] = useState('');
  const [amount, setAmount] = useState('');
  const [password, setPassword] = useState(null);
  const [confirmPassword, setConfirmPassword] = useState(null);
  const [errorMessage, setErrorMessage] = useState('');

  //const { publicKey } = route.params;

  const fetchTag = async () => {
    try {
      let tag = await scanSerialForKey();
      if (tag) {
        setTagID(tag);
        //console.warn(tag);
        setModalVisible(true);
        setScanModal(false);
      }
    } catch (error) {
      //console.log(error);
    }
  };

  const handleScanCardPress = () => {
    setScanModal(true);
    fetchTag();
  };

  const signAndSend = () => {
    setScanModal(true);
    fetchTag();
  };

  const confirmPasswords = async (test) => {
    if (password && confirmPassword) {
      if (password === confirmPassword) {
        setErrorMessage('');
        setModalVisible(false);
        if (test==='') {
        try {
          let key = await accountLogin(tagID, password);
          if (key) {
            setRecipientKey(key);
          } else {
            //console.error('Key is not defined.');
          }
        } catch (error) {
          //console.error('Error logging in:', error);
        }
      } else {
        try {
          signAndSend(tagID, password, amount, recipientKey);
        } catch (error) {
          //console.error('Error logging in:', error);
        }
      }
      } else {
        setErrorMessage('The passwords do not match.');
      }
    } else {
      setErrorMessage('Please complete the form.');
    }
  };

  return (
    <ImageBackground
      source={require('../assets/tech_pattern.jpg')}
      style={{ flex: 1, width: '100%', height: '100%' }}
    >
      <View style={styles.container}>

        <View style={styles.topContainer}>
          <Text style={styles.headingText}>Follow the prompts to transfer Optimism to another wallet.</Text>
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.paragraphText}>Input or scan card to fill recipient address.</Text>
          <TextInput
            mode="outlined"
            style={styles.textInput}
            placeholder="Recipient..."
            value={recipientKey}
            onChangeText={recipientKey => setRecipientKey(recipientKey)}
          />
          <ModalButton text='Scan Card' type='secondary' size='large' onPress={() => { handleScanCardPress(); }} />

          <Text style={styles.paragraphText}>How much would you like to send?</Text>
          <TextInput
            mode="outlined"
            style={styles.textInput}
            placeholder="Amount..."
            value={amount}
            onChangeText={amount => setAmount(amount)}
            keyboardType="numeric"
          />
        </View>

        <View style={styles.bottomContainer}>
        <ModalButton text='Sign and Send' type='primary' size='large' onPress={() => { signAndSend(); }} />
          <NavigationButton navigation={navigation} text='Go Back' type='secondary' target='Account' size='large' />
        </View>
      </View>

      <Modal
          transparent={true}
          visible={modalVisible}
          onRequestClose={() => {
            setModalVisible(false);
          }}
        >
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <Text style={styles.headingText}>Enter your password.</Text>
              <PasswordInput
                text='Enter Password'
                password={password}
                setPassword={setPassword}
              />
              <PasswordInput
                text='Confirm Password'
                password={confirmPassword}
                setPassword={setConfirmPassword}
              />
              {errorMessage ? (
                <Text style={styles.errorMessage}>{errorMessage}</Text>
              ) : null}
              <View style={styles.inlineButton}>
                <ModalButton text='Close' type='secondary' size='small' onPress={() => {setModalVisible(false);}} />
                <ModalButton text='Enter' type='primary' size='small' onPress={confirmPasswords} />
              </View>
            </View>
          </View>
        </Modal>

        {Platform.OS === 'android' && ( // Render modal only on Android
          <Modal
            animationType="fade"
            transparent={true}
            visible={scanModal}
            onRequestClose={() => setScanModal(false)}
          >
            <View style={styles.modalContainer}>
              <View style={styles.bottomThirdContainer}>
                <Text style={styles.headingText}>Ready to Scan</Text>
                <Image
                  source={require('../assets/nfc_icon.png')}
                  resizeMode="contain"
                  scanModalImage
                  style={styles.scanModalImage}
                />
                <Text>Hold your device near the NFC tag.</Text>
                <ModalButton text='Cancel' type='secondary' size='large' onPress={() => { setScanModal(false); }} />
              </View>
            </View>
          </Modal>
        )}
    </ImageBackground>
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
  inputContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    flex: 2,
    width: '100%',
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
  paragraphText: {
    color: '#000000',
    fontSize: 18,
    margin: 10,
  },
  textInput: {
    marginTop: 10,
    width: 250,
    height: 40,
    backgroundColor: '#ffffff',
  },


  backgroundImage: {
    position: 'absolute',
    top: 20,
    width: 300,
    height: 300,
    opacity: 1,
  },
  centeredImage: {
    width: '100%',
    height: '100%'
  },
  bottomContainer: {
    flex: 3,
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
    margin: 10,
  },
  bottomThirdContainer: {
    position: 'absolute',
    bottom: 0,
    width: '100%',
    backgroundColor: '#fff',
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    alignItems: 'center',
    padding: 20,
  },
  scanModalImage: {
    height: 150,
    marginBottom: 10,
  }
});

export default Transfer;