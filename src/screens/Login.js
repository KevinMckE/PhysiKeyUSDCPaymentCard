import React, { useState, Suspense, useEffect } from 'react';
import { View, Image, StyleSheet, Text, ImageBackground, Modal } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import NavigationButton from '../components/NavigationButton';
import ModalButton from '../components/ModalButton';
import PasswordInput from '../components/PasswordInput';
import { readTag, accountLogin } from '../components/HelperFunctions';

const Login = ({ navigation }) => {
  const [modalVisible, setModalVisible] = useState(false);
  const [secondModalVisible, setSecondModalVisible] = useState(false);
  const [tagID, setTagID] = useState('');
  //const [newCard, setNewCard] = useState(false);
  const [password, setPassword] = useState(null);
  const [confirmPassword, setConfirmPassword] = useState(null);
  const [errorMessage, setErrorMessage] = useState('');
  const [gifSource, setGifSource] = useState(require('../assets/tap_image.png'));
  const { navigate } = useNavigation();

  const fetchTag = async () => {
    try {
      let tag = await readTag();
      newTagID = tag.id;
      ndefPayload = tag.ndefMessage[0].payload;
      /**
      if (ndefPayload.length === 0) {
        setNewCard(true);
      }
       */
      if (newTagID) {
        setTagID(newTagID);
        setModalVisible(true);
      }
    } catch (error) {
      //console.log(error);
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
    fetchTag();
  };

  const confirmPasswords = async () => {
    console.warn(password);
    if (password && confirmPassword) {
      if (password === confirmPassword) {
        setErrorMessage('');
        setModalVisible(false);
        try {
          let key = await accountLogin(tagID, password);
          console.warn(key);
          if (key) {
            navigate('Account', { publicKey: key });
          } else {
            //console.error('Key is not defined.');
          }
        } catch (error) {
          //console.error('Error logging in:', error);
        }
      } else {
        setErrorMessage('The passwords do not match.');
      }
    } else {
      setErrorMessage('Please complete the form.');
    }
  };
  return (
    <View style={styles.container}>

      <View style={styles.topContainer}>
        <Text style={styles.headingText}>Scan your card and input your password.</Text>
      </View>

      <View style={styles.imageContainer}>
        <ImageBackground
          source={require('../assets/blob_background.png')}
          style={styles.backgroundImage}
          resizeMode="contain"
        >
          <Suspense fallback={<Image source={require('../assets/tap_image.png')} style={styles.centeredImage} resizeMode="cover" />}>
            <Image
              source={gifSource}
              style={styles.centeredImage}
              fadeDuration={0}
              resizeMode="cover"
            />
          </Suspense>
        </ImageBackground>
      </View>

      <View style={styles.bottomContainer}>
        <NavigationButton navigation={navigation} text='Go Back' type='secondary' target='Landing' size='large' />
        <ModalButton text='Scan Card' type='primary' size='large' onPress={handleScanCardPress} />
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
            <Text style={styles.headingText}>Entering a new or random password create a new wallet.</Text>
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
    margin: 10,
  },
});

export default Login;