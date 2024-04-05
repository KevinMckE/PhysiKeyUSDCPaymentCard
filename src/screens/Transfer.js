import React, { useState } from 'react';
import { View, StyleSheet, Text, ImageBackground, Modal, Image, ScrollView } from 'react-native';
import { TextInput } from 'react-native-paper';
import PasswordInput from '../components/PasswordInput';
import ModalButton from '../components/ModalButton';
import { accountLogin } from '../functions/accountLogin';
import { scanSerialForKey } from '../functions/scanSerialForKey';

const Transfer = ({ navigation, route }) => {
  const [step, setStep] = useState(0);
  const [gas, setGas] = useState('');
  const [receipt, setReceipt] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  const [signModal, setSignModal] = useState(false);
  const [tagID, setTagID] = useState('');
  const [scanModal, setScanModal] = useState(false);
  const [recipientKey, setRecipientKey] = useState('');
  const [amount, setAmount] = useState('');
  const [password, setPassword] = useState(null);
  const [confirmPassword, setConfirmPassword] = useState(null);
  const [inputError, setInputError] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const { publicKey } = route.params;

  const handleTransferPress = () => {
    navigation.navigate('Account', { publicKey }); 
  };

  const handleNextStep = () => {
    if (recipientKey.length !== 0) {
      setStep(step + 1);
      setInputError('');
    } else {
      setInputError('Oops! Please enter a recipient..')
    }
  };

  const handlePreviousStep = () => {
    setStep(step - 1);
  };

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

  const fetchSign = async () => {
    try {
      let tag = await scanSerialForKey();
      if (tag) {
        setTagID(tag);
        //console.warn(tag);
        setSignModal(true);
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
    fetchSign();
  }

  const confirmPasswords = async () => {
    if (password && confirmPassword) {
      if (password === confirmPassword) {
        setErrorMessage('');
        setModalVisible(false);
        let recipientKey = await accountLogin(tagID, password);
        setRecipientKey(recipientKey);
      } else {
        setErrorMessage('The passwords do not match.');
      }
    } else {
      setErrorMessage('Please complete the form.');
    }
  };

  const confirmSign = async () => {
    if (password && confirmPassword) {
      if (password === confirmPassword) {
        setErrorMessage('');
        setSignModal(false);
        let receipt = await signAndSend(tagID, password, amount, recipientKey, publicKey);
        setReceipt(receipt);
        console.log(receipt);
        //navigation.navigate('Account', { publicKey });
      } else {
        setErrorMessage('The passwords do not match.');
      }
    } else {
      setErrorMessage('Please complete the form.');
    }
  };

  const renderStep = () => {
    switch (step) {
      case 0:
        return (
          <View style={styles.inputContainer}>
            <Text style={styles.paragraphText}>Input or scan card for recipient address. (1/3) </Text>
            <TextInput
              mode="outlined"
              style={styles.textInput}
              placeholder="Recipient address..."
              value={recipientKey}
              onChangeText={recipientKey => setRecipientKey(recipientKey)}
            />
            <ModalButton text='Scan Card' type='primary' size='large' onPress={() => { handleScanCardPress(); }} />
          </View>
        );
      case 1:
        return (
          <View style={styles.inputContainer}>
            <Text style={styles.paragraphText}>How much would you like to send? (2/3)</Text>
            <TextInput
              mode="outlined"
              style={styles.textInput}
              placeholder="Amount..."
              value={amount}
              onChangeText={amount => setAmount(amount)}
              keyboardType="numeric"
            />
          </View>
        );
      case 2:
        return (
          <View style={styles.inputContainer}>
            <Text style={styles.paragraphText}>Confirm Details (3/3)</Text>
            <Text style={styles.paragraphText}>{publicKey}</Text>
            <Text style={styles.paragraphText}>Sending {amount} OP to:</Text>
            <Text style={styles.paragraphText}>{recipientKey}</Text>
            <Text style={styles.paragraphText}>Estimated gas {gas} OP</Text>
          </View>
        );
      default:
        return null;
    }
  };

  const renderButtons = () => {
    switch (step) {
      case 0:
        return (
          <View style={styles.bottomContainer}>
            <ModalButton text='Continue' type='primary' size='large' onPress={handleNextStep} />
            <ModalButton text='Go Back' type='secondary' size='large' onPress={() => { handleTransferPress(); }} />
          </View>
        );
      case 1:
        return (
          <View style={styles.bottomContainer}>
            <ModalButton text='Continue' type='primary' size='large' onPress={handleNextStep} />
            <ModalButton text='Go Back' type='secondary' target='Account' size='large' onPress={handlePreviousStep} />
          </View>
        );
      case 2:
        return (
          <View style={styles.bottomContainer}>
            <ModalButton text='Sign and Send' type='primary' size='large'  onPress={() => { signAndSend(); }} />
            <ModalButton text='Go Back' type='secondary' target='Account' size='large' onPress={handlePreviousStep} />
          </View>
        );
      default:
        return null;
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
          <Image
            source={require('../assets/blob_background_blue.png')}
            style={styles.backgroundImageSecondary}
            resizeMode="contain"
          />
          <Image
            source={require('../assets/blob_background_black.png')}
            style={styles.backgroundImage}
            resizeMode="contain"
          />
          {renderStep()}
          {inputError ? (
                <Text style={styles.errorMessage}>{inputError}</Text>
              ) : null}
        </View>
        <View style={styles.bottomContainer}>
          {renderButtons()}
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
              <ModalButton text='Close' type='secondary' size='small' onPress={() => { setModalVisible(false); }} />
              <ModalButton text='Enter' type='primary' size='small' onPress={confirmPasswords} />
            </View>
          </View>
        </View>
      </Modal>

      <Modal
        transparent={true}
        visible={signModal}
        onRequestClose={() => {
          setSignModal(false);
        }}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.headingText}>Enter your password. This step will sign the and send the transaction.</Text>
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
              <ModalButton text='Close' type='secondary' size='small' onPress={() => { setSignModal(false); }} />
              <ModalButton text='Enter' type='primary' size='small' onPress={confirmSign} />
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
    padding: 30,
  },
  bottomContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headingText: {
    fontSize: 18,
    color: '#000000',
    fontWeight: 'bold',
  },
  paragraphText: {
    color: '#fff',
    fontSize: 18,
    padding: 10,
  },
  textInput: {
    marginTop: 10,
    width: 250,
    height: 40,
    backgroundColor: '#ffffff',
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
  },
  backgroundImage: {
    position: 'absolute',
    width: 475,
    height: 475,
    opacity: 1,
    transform: [{ rotate: '-5deg' }]
  },
  backgroundImageSecondary: {
    position: 'absolute',
    width: 500,
    height: 500,
    opacity: 1,
  },
});

export default Transfer;