import React, { useState, Suspense } from 'react';
import { View, Image, Platform, ImageBackground, ActivityIndicator } from 'react-native';
import { Text } from 'react-native-paper';
import CustomButton from '../components/CustomButton';
import InputModal from '../components/InputModal';
import AndroidScanModal from '../components/AndroidScanModal';
import CustomSnackbar from '../components/CustomSnackbar';
import { scanSerialForKey } from '../functions/scanSerialForKey';
import { accountLogin } from '../functions/accountFunctions';
import { cancelNfc } from '../functions/cancelNfcRequest';
import styles from '../styles/common';

const Login = ({ navigation }) => {
  const [modalVisible, setModalVisible] = useState(false);
  const [scanModal, setScanModal] = useState(false);
  const [tagID, setTagID] = useState('');
  const [gifSource, setGifSource] = useState(require('../assets/tap_image.png'));
  const [loading, setLoading] = useState(false);

  const [snackbarVisible, setSnackbarVisible] = useState(false);
  const [snackbarText, setSnackbarText] = useState('');
  const [isSuccess, setSuccess] = useState(false);

  const closeScanModal = () => {
    cancelNfc();
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

  const handlePasswords = async (password) => {
    handleSnackbar(true, 'Attemping login...');
    setModalVisible(false);
    changeGifSource();
    setLoading(true);
    try {
      let { publicKey } = await accountLogin(tagID, password);
      if (publicKey) {
        navigation.navigate('Account', { publicKey: publicKey });
      } else {
        console.error('Cannot complete handlePasswords. Key is not defined.');
        handleSnackbar(false, 'Cannot complete handlePasswords. Key is not defined.');
      }
    } catch (error) {
      console.error('Cannot complete handlePasswords: ', error);
      handleSnackbar(false, `There was an issue: ${error}`);
    } finally {
      setLoading(false);
    }
  };

  const handleSnackbar = (success, text) => {
    setSuccess(success);
    setSnackbarText(text);
    setSnackbarVisible(true);
  };

  return (
    <ImageBackground
      source={require('../assets/tech_pattern.jpg')}
      style={{ flex: 1, width: '100%', height: '100%' }}
    >
      <View style={styles.container}>
        {loading && (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#0000ff" />
          </View>
        )}
        <View style={styles.topContainer}>
          <Text variant='titleLarge'>Scan your card and input your password.</Text>
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

        <CustomSnackbar
          visible={snackbarVisible}
          onDismiss={() => setSnackbarVisible(false)}
          duration={3000}
          text={snackbarText}
          isSuccess={isSuccess}
        />

        <InputModal
          visible={modalVisible}
          closeModal={() => setModalVisible(false)}
          handlePasswords={handlePasswords}
          title={`Each new password creates a new account when used with your card. \n\nWe cannot recover passwords for you.`}
          changeGifSource={changeGifSource}
        />

        {Platform.OS === 'android' && ( // Render modal only on Android
          <AndroidScanModal
            visible={scanModal}
            closeScanModal={closeScanModal}
            changeGifSource={changeGifSource}
          />
        )}
      </View>
    </ImageBackground>
  );
}

export default Login;