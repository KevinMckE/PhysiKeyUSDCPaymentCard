import React, { useState, Suspense } from 'react';
import { View, Image, StyleSheet, Text, Modal, Platform, ImageBackground } from 'react-native';
import CustomButton from '../components/CustomButton';
import PasswordInput from '../components/PasswordInput';
import AndroidScanModal from '../components/AndroidScanModal';
import { scanSerialForKey } from '../functions/scanSerialForKey';
import { accountLogin } from '../functions/accountFunctions';
import styles from '../styles/common';

const Login = ({ navigation }) => {
  const [modalVisible, setModalVisible] = useState(false);
  const [scanModal, setScanModal] = useState(false);
  const [tagID, setTagID] = useState('');
  const [password, setPassword] = useState(null);
  const [confirmPassword, setConfirmPassword] = useState(null);
  const [errorMessage, setErrorMessage] = useState('');
  const [gifSource, setGifSource] = useState(require('../assets/tap_image.png'));

  const closeModal = () => {
    setScanModal(false);
  };

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
          <CustomButton text='Scan Card' type='primary' size='large' onPress={() => { handleScanCardPress(); }} />
          <CustomButton text='Go Back' type='secondary' size='large' onPress={() => { navigation.navigate('Landing'); }} />
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
              <Text style={styles.headingText}>Each new password creates a new account when used with your card. {"\n"} {"\n"}
                We cannot recover passwords for you.
              </Text>
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
                <CustomButton text='Close' type='secondary' size='small' onPress={() => { setModalVisible(false); changeGifSource(); }} />
                <CustomButton text='Enter' type='primary' size='small' onPress={() => { confirmPasswords(); }} />
              </View>
            </View>
          </View>
        </Modal>


        {Platform.OS === 'android' && ( // Render modal only on Android
          <AndroidScanModal
            visible={scanModal}
            closeModal={closeModal}
            changeGifSource={changeGifSource}
          />
        )}
      </View>
    </ImageBackground>
  );
}

export default Login;