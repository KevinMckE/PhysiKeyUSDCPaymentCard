import React, { useState, Suspense } from 'react';
import { View, Image, StyleSheet, Text, Modal, Platform, ImageBackground } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import NavigationButton from '../components/NavigationButton';
import ModalButton from '../components/ModalButton';
import PasswordInput from '../components/PasswordInput';
import { scanSerialForKey } from '../functions/scanSerialForKey';
import { accountLogin } from '../functions/accountLogin';

const Login = ({ navigation }) => {
  const [modalVisible, setModalVisible] = useState(false);
  const [secondModalVisible, setSecondModalVisible] = useState(false);
  const [scanModal, setScanModal] = useState(false);
  const [tagID, setTagID] = useState('');
  //const [newCard, setNewCard] = useState(false);
  const [password, setPassword] = useState(null);
  const [confirmPassword, setConfirmPassword] = useState(null);
  const [errorMessage, setErrorMessage] = useState('');
  const [gifSource, setGifSource] = useState(require('../assets/tap_image.png'));
  const { navigate } = useNavigation();

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
    changeGifSource();
  };

  const changeGifSource = () => {
    const newSource =
      gifSource === require('../assets/tap_image.png')
        ? require('../assets/tap_animation.gif')
        : require('../assets/tap_image.png');
    setGifSource(newSource);
  };

  const handleScanCardPress = () => {
    changeGifSource();
    setScanModal(true);
    fetchTag();
  };

  const confirmPasswords = async () => {
    if (password && confirmPassword) {
      if (password === confirmPassword) {
        setErrorMessage('');
        setModalVisible(false);
        changeGifSource();
        try {
          let key = await accountLogin(tagID, password);
          if (key) {
            navigate('Account', { publicKey: key });
          } else {
            console.error('Cannot complete confirmPasswords. Key is not defined.');
          }
        } catch (error) {
          console.error('Cannot complete confirmPasswords: ', error);
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
          <Text style={styles.headingText}>Scan your card and input your password.</Text>
        </View>

        <View style={styles.imageContainer}>
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
          <Suspense fallback={<Image source={require('../assets/tap_image.png')} style={styles.centeredImage} resizeMode="cover" />}>
            <Image
              source={gifSource}
              style={styles.centeredImage}
              fadeDuration={0}
              resizeMode="cover"
            />
          </Suspense>
        </View>

        <View style={styles.bottomContainer}>
          <ModalButton text='Scan Card' type='primary' size='large' onPress={() => { handleScanCardPress(); }} />
          <NavigationButton navigation={navigation} text='Go Back' type='secondary' target='Landing' size='large' />
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
              <Text style={styles.headingText}>Each new password creates a new account when used with your card. We cannot recover your passwords for you.</Text>
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
                <ModalButton text='Close' type='secondary' size='small' onPress={() => {
                  setModalVisible(false);
                  changeGifSource();
                }} />
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
                <ModalButton text='Cancel' type='secondary' size='large' onPress={() => { setScanModal(false); changeGifSource(); }} />
              </View>
            </View>
          </Modal>
        )}

        <Modal
          animationType="slide"
          transparent={true}
          visible={secondModalVisible}
          onRequestClose={() => {
            setSecondModalVisible(false);
          }}
        >
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <Text style={styles.headingText}>New Card?</Text>
              <Text style={styles.errorMessage}>It looks like you may not have created a new secure passcode.  Would you like to do that now? Your assets will be automatically transferred.</Text>
              <View style={styles.inlineButton}>
                <NavigationButton navigation={navigation} text='No' type='secondary' target='Account' size='small' />
                <NavigationButton navigation={navigation} text='Yes' type='primary' target='CreateNewCard' size='small' />
              </View>
            </View>
          </View>
        </Modal>
      </View>
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
    flex: 0.5,
    padding: 30,
  },
  imageContainer: {
    alignItems: 'center',
    flex: 3,
  },
  backgroundImage: {
    position: 'absolute',
    top: 20,
    width: 300,
    height: 300,
    opacity: 1,
    transform: [{rotate: '-5deg'}]
  },
  backgroundImageSecondary: {
    position: 'absolute',
    top: 10,
    width: 335,
    height: 335,
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

export default Login;