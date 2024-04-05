import React from 'react';
import { Modal, View, Text, Image } from 'react-native';
import CustomButton from '../components/CustomButton';
import styles from '../styles/common';

const AndroidScanModal = ({ visible, closeModal, changeGifSource }) => {
  return (
    <Modal
      animationType="fade"
      transparent={true}
      visible={visible}
      onRequestClose={closeModal}
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
          <CustomButton
            text='Cancel'
            type='secondary'
            size='large'
            onPress={() => { 
              closeModal(); 
              changeGifSource();
            }}
          />
        </View>
      </View>
    </Modal>
  );
}

export default AndroidScanModal;